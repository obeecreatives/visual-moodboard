import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MockupConfig, PackagingShapeKey, MaterialStyle } from '../../types';
import { 
  buildPackaging3DGroup, 
  createPackagingLabelTexture, 
  isSoftwareGlRenderer 
} from './threeMockupEngine';
import { 
  RotateCw, 
  Camera, 
  Maximize2, 
  Sparkles, 
  Eye, 
  Sun, 
  Layers, 
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ThreeMockupCanvasProps {
  config: MockupConfig;
  onUpdateConfig: (updated: Partial<MockupConfig>) => void;
  brandName: string;
  theme: 'dark' | 'light';
}

type StudioLightingPreset = 'studio-soft' | 'warm-amber' | 'clean-white' | 'dramatic-rim';

export const ThreeMockupCanvas: React.FC<ThreeMockupCanvasProps> = ({
  config,
  onUpdateConfig,
  brandName,
  theme
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const activeLabelTexRef = useRef<THREE.CanvasTexture | null>(null);
  const lightsRef = useRef<{
    keyLight: THREE.DirectionalLight;
    fillLight: THREE.HemisphereLight;
    rimLight: THREE.DirectionalLight;
  } | null>(null);

  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [activeLightingPreset, setActiveLightingPreset] = useState<StudioLightingPreset>('studio-soft');
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [activeCameraView, setActiveCameraView] = useState<'hero' | 'front' | 'top' | 'detail'>('hero');

  // Helper to load logo image if provided in data URL
  const [logoImgElement, setLogoImgElement] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!config.logo) {
      setLogoImgElement(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = config.logo;
    img.onload = () => {
      setLogoImgElement(img);
    };
  }, [config.logo]);

  // Apply Lighting Presets to the 3-point studio rig
  const applyLightingPreset = useCallback((preset: StudioLightingPreset) => {
    setActiveLightingPreset(preset);
    if (!lightsRef.current) return;
    const { keyLight, fillLight, rimLight } = lightsRef.current;

    switch (preset) {
      case 'warm-amber':
        keyLight.color.set('#FFA726');
        keyLight.intensity = 2.4;
        fillLight.color.set('#FFF8E1');
        fillLight.groundColor.set('#5D4037');
        fillLight.intensity = 1.0;
        rimLight.color.set('#FFE082');
        rimLight.intensity = 2.0;
        break;

      case 'clean-white':
        keyLight.color.set('#FFFFFF');
        keyLight.intensity = 2.8;
        fillLight.color.set('#FFFFFF');
        fillLight.groundColor.set('#B0BEC5');
        fillLight.intensity = 1.2;
        rimLight.color.set('#FFFFFF');
        rimLight.intensity = 1.8;
        break;

      case 'dramatic-rim':
        keyLight.color.set('#E0E0E0');
        keyLight.intensity = 1.2;
        fillLight.color.set('#37474F');
        fillLight.groundColor.set('#102027');
        fillLight.intensity = 0.5;
        rimLight.color.set('#FFD54F'); // Warm rim glow
        rimLight.intensity = 4.2;
        break;

      case 'studio-soft':
      default:
        keyLight.color.set('#FFF5E6');
        keyLight.intensity = 2.2;
        fillLight.color.set('#ECEFF1');
        fillLight.groundColor.set('#263238');
        fillLight.intensity = 0.9;
        rimLight.color.set('#90CAF9');
        rimLight.intensity = 1.6;
        break;
    }
  }, []);

  // Camera presets
  const setCameraView = (view: 'hero' | 'front' | 'top' | 'detail') => {
    setActiveCameraView(view);
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    switch (view) {
      case 'front':
        cam.position.set(0, 2.5, 7.5);
        ctrl.target.set(0, 2.0, 0);
        break;
      case 'top':
        cam.position.set(0, 8.5, 2.5);
        ctrl.target.set(0, 1.8, 0);
        break;
      case 'detail':
        cam.position.set(1.5, 2.2, 4.2);
        ctrl.target.set(0, 2.1, 0);
        break;
      case 'hero':
      default:
        cam.position.set(3.8, 3.4, 6.2);
        ctrl.target.set(0, 2.0, 0);
        break;
    }
    ctrl.update();
  };

  // Export current 3D viewport to high-res PNG image
  const handleExport3DImage = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    // Render immediately prior to grabbing data URL
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `obeecreatives-3D-${(config.prodName || 'Mockup').replace(/\s+/g, '-')}-${config.shape}.png`;
    a.click();
  };

  // Initialize Three.js Scene, Camera, PBR Environment, and Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // Transparent canvas so background gradients shine through

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(3.8, 3.4, 6.2);
    cameraRef.current = camera;

    // 2. WebGL Renderer with High-Fidelity Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const isSoftwareGl = isSoftwareGlRenderer(renderer);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Mandatory PBR Studio Environment (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Studio 3-Point Lighting Rig
    const keyLight = new THREE.DirectionalLight('#FFF5E6', 2.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight('#ECEFF1', '#263238', 0.9);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#90CAF9', 1.6);
    rimLight.position.set(-6, 5, -6);
    scene.add(rimLight);

    lightsRef.current = { keyLight, fillLight, rimLight };

    // 5. OrbitControls for 360° Inspection
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.0;
    controls.maxDistance = 14.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent dipping beneath floor
    controls.target.set(0, 2.0, 0);
    controlsRef.current = controls;

    // 6. Animation Frame Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.autoRotate = isAutoRotating;
        controlsRef.current.autoRotateSpeed = 2.0;
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };
    animate();

    // 7. Responsive Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update 3D Packaging Model & Texture on Prop Changes
  useEffect(() => {
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    if (!scene || !renderer) return;

    // Remove previous model group & dispose old textures
    if (modelGroupRef.current) {
      scene.remove(modelGroupRef.current);
      modelGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).geometry) {
          (child as THREE.Mesh).geometry.dispose();
        }
      });
      modelGroupRef.current = null;
    }

    if (activeLabelTexRef.current) {
      activeLabelTexRef.current.dispose();
      activeLabelTexRef.current = null;
    }

    // Generate fresh PBR label texture
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const labelTex = createPackagingLabelTexture(config, config.shape, maxAnisotropy, logoImgElement);
    activeLabelTexRef.current = labelTex;

    // Build composite 3-12 part procedural 3D model
    const isSoftwareGl = isSoftwareGlRenderer(renderer);
    const newModelGroup = buildPackaging3DGroup(config.shape, labelTex, config, isSoftwareGl);
    modelGroupRef.current = newModelGroup;
    scene.add(newModelGroup);

  }, [
    config.shape,
    config.color,
    config.materialStyle,
    config.prodName,
    config.prodTag,
    config.textSize,
    config.textFont,
    config.logo,
    config.logoScale,
    config.logoX,
    config.logoY,
    logoImgElement
  ]);

  // Sync auto rotate with controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] rounded-3xl overflow-hidden border border-slate-700/80 bg-gradient-to-b from-slate-900 via-slate-950 to-black shadow-2xl select-none">
      
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Left Studio Specs Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-lg text-white">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-bold font-display uppercase tracking-wider">
            3D Studio WebGL · PBR Real-Time
          </span>
          <span className="px-1.5 py-0.5 rounded bg-red-600/30 text-red-300 font-mono text-[9px] font-bold">
            360°
          </span>
        </div>
      </div>

      {/* Top Right Quick Capture & Fullscreen View Buttons */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={handleExport3DImage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-white hover:bg-red-600 hover:border-red-500 transition-all shadow-lg active:scale-95"
          title="Export Render 3D High-Res PNG"
        >
          <Camera size={14} className="text-red-400" />
          <span className="hidden sm:inline">Export Render PNG</span>
        </button>

        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-lg active:scale-95 ${
            isAutoRotating 
              ? 'bg-red-600 border-red-500 text-white' 
              : 'bg-slate-900/85 backdrop-blur-md border-slate-700/80 text-slate-300 hover:text-white'
          }`}
          title="Putar Otomatis 360 Derajat"
        >
          <RotateCw size={14} className={isAutoRotating ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Putar 360°</span>
        </button>
      </div>

      {/* Sleek Ergonomic Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-4 inset-x-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:max-w-2xl z-20 transition-all duration-300">
        
        {/* Dock Header Tab with Collapse Toggle */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-t-xl bg-slate-900/90 border-t border-x border-slate-700/80 text-[11px] font-medium text-slate-300 hover:text-white transition shadow-md"
          >
            <span>{isControlsCollapsed ? 'Tampilkan Kontrol Studio 3D' : 'Sembunyikan Kontrol'}</span>
            {isControlsCollapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {/* Dock Content Body */}
        {!isControlsCollapsed && (
          <div className="p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl space-y-3">
            
            {/* Row 1: Camera Angle Presets & Lighting Setup */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              
              {/* Camera Views */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Sudut:</span>
                <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/60">
                  <button
                    onClick={() => setCameraView('hero')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      activeCameraView === 'hero' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Hero 45°
                  </button>
                  <button
                    onClick={() => setCameraView('front')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      activeCameraView === 'front' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Depan
                  </button>
                  <button
                    onClick={() => setCameraView('top')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      activeCameraView === 'top' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Atas
                  </button>
                  <button
                    onClick={() => setCameraView('detail')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      activeCameraView === 'detail' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Detail
                  </button>
                </div>
              </div>

              {/* Lighting Presets */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Pencahayaan:</span>
                <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/60">
                  <button
                    onClick={() => applyLightingPreset('studio-soft')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                      activeLightingPreset === 'studio-soft' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Soft Studio Lighting"
                  >
                    Studio Soft
                  </button>
                  <button
                    onClick={() => applyLightingPreset('warm-amber')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                      activeLightingPreset === 'warm-amber' ? 'bg-amber-600/80 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Warm Honey & Golden Hour"
                  >
                    Amber Warm
                  </button>
                  <button
                    onClick={() => applyLightingPreset('dramatic-rim')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                      activeLightingPreset === 'dramatic-rim' ? 'bg-purple-600/80 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Dramatic Gold Rim Light"
                  >
                    Rim Gold
                  </button>
                </div>
              </div>

            </div>

            {/* Row 2: Material Finish PBR Swatches */}
            <div className="flex items-center justify-between gap-2 border-t border-slate-800/80 pt-2 text-xs flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Material Finish:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateConfig({ materialStyle: 'glossy' })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                      config.materialStyle === 'glossy'
                        ? 'border-red-500 bg-red-600/20 text-white'
                        : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Pernis Mengkilap (Glossy)
                  </button>
                  <button
                    onClick={() => onUpdateConfig({ materialStyle: 'matte' })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                      config.materialStyle === 'matte'
                        ? 'border-red-500 bg-red-600/20 text-white'
                        : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Doff / Soft-Touch
                  </button>
                  <button
                    onClick={() => onUpdateConfig({ materialStyle: 'kraft' })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                      config.materialStyle === 'kraft'
                        ? 'border-amber-500 bg-amber-600/20 text-amber-300'
                        : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Kraft Organik
                  </button>
                </div>
              </div>

              {/* Touch interaction tip */}
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                💡 Drag mouse / sentuh layar untuk rotasi 360° &amp; zoom scroll
              </span>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
