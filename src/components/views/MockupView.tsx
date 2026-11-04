import React, { useState } from 'react';
import { 
  BriefProject, 
  MockupConfig, 
  PackagingShapeKey, 
  MaterialStyle, 
  TextureType 
} from '../../types';
import { 
  SHAPES, 
  SHAPE_LABELS, 
  SHAPE_DESCRIPTIONS, 
  shadeColor, 
  TEXTURE_FILTERS, 
  TEXTURE_PATTERN_DOTS, 
  SHADOW_BLUR_FILTER, 
  buildGroundShadow, 
  cylLightDefFor, 
  glossDefsFor, 
  buildWindowOverlay 
} from '../../data/shapes';
import { 
  Box, 
  Sparkles, 
  Upload, 
  RotateCcw, 
  Download, 
  Sliders, 
  Type, 
  Layers, 
  Image as ImageIcon,
  Check,
  Globe
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { ThreeMockupCanvas } from '../mockups/ThreeMockupCanvas';

interface MockupViewProps {
  brief: BriefProject;
  onUpdateBrief: (updated: Partial<BriefProject>) => void;
  theme: 'dark' | 'light';
}

const SCENES_BG: Record<string, string> = {
  'studio-light': 'linear-gradient(180deg, #f5f4f0, #e7e6e0)',
  'studio-dark': 'linear-gradient(180deg, #2b2926, #141312)',
  'kraft': 'linear-gradient(180deg, #c9a875, #a8804f)'
};

export const MockupView: React.FC<MockupViewProps> = ({
  brief,
  onUpdateBrief,
  theme
}) => {
  const [renderEngine, setRenderEngine] = useState<'3d' | '2d'>('3d');
  const m = brief.mockupConfig;
  const shape = SHAPES[m.shape] || SHAPES.box;
  const baseColor = m.color || '#C9B896';
  const topColor = shadeColor(baseColor, 14);
  const sideColor = shadeColor(baseColor, -16);

  const vb = shape.viewBox.split(' ').map(Number);
  const vbW = vb[2];
  const vbH = vb[3];
  const containerW = 320;
  const containerH = containerW * (vbH / vbW);

  const updateMock = (updated: Partial<MockupConfig>) => {
    onUpdateBrief({
      mockupConfig: {
        ...brief.mockupConfig,
        ...updated
      }
    });
  };

  let textureDefs = '';
  let textureOverlay = '';
  if (m.texture && m.texture !== 'none') {
    if (m.texture === 'dots') {
      textureDefs = TEXTURE_PATTERN_DOTS;
      textureOverlay = `<rect x="0" y="0" width="${vbW}" height="${vbH}" fill="url(#texp-dots)" clip-path="url(#baseClip)" opacity="${m.textureOpacity}" style="mix-blend-mode:multiply"/>`;
    } else {
      textureDefs = TEXTURE_FILTERS[m.texture as Exclude<TextureType, 'none' | 'dots'>] || '';
      textureOverlay = `<rect x="0" y="0" width="${vbW}" height="${vbH}" fill="#000000" filter="url(#texf-${m.texture})" clip-path="url(#baseClip)" opacity="${m.textureOpacity}" style="mix-blend-mode:multiply"/>`;
    }
  }

  const svgInnerContent = `
    <defs>
      ${glossDefsFor(m.materialStyle)}
      ${cylLightDefFor(m.materialStyle)}
      ${SHADOW_BLUR_FILTER}
      <clipPath id="baseClip">${shape.baseClip}</clipPath>
      ${textureDefs}
    </defs>
    ${buildGroundShadow(vbW, vbH, shape.shadowY)}
    ${shape.build(baseColor, topColor, sideColor)}
    ${textureOverlay}
    ${m.windowEnabled && shape.windowZone ? buildWindowOverlay(shape.windowZone) : ''}
  `;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        updateMock({ logo: ev.target.result as string });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddExtraImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          const newImg = {
            id: Date.now() + Math.random(),
            src: ev.target.result as string,
            x: 50,
            y: 50,
            scale: 0.5,
            rot: 0
          };
          updateMock({ extraImages: [...(m.extraImages || []), newImg] });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveExtraImage = (id: string | number) => {
    updateMock({
      extraImages: (m.extraImages || []).filter(img => img.id !== id)
    });
  };

  const handleAddExtraText = () => {
    const newTx = {
      id: Date.now() + Math.random(),
      text: 'HALAL / 100% ORGANIC',
      font: brief.fontDisplay || 'Space Grotesk',
      size: 11,
      color: '#18181a',
      x: 50,
      y: 75,
      rot: 0
    };
    updateMock({ extraTexts: [...(m.extraTexts || []), newTx] });
  };

  const handleRemoveExtraText = (id: string | number) => {
    updateMock({
      extraTexts: (m.extraTexts || []).filter(tx => tx.id !== id)
    });
  };

  const exportMockupPng = async () => {
    const el = document.getElementById('mockupStageElement');
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { backgroundColor: null, scale: 2 });
      const link = document.createElement('a');
      link.download = `obeecreatives-Mockup-${m.shape}-${(brief.brandName || 'Brand').replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export Mockup PNG failed', err);
    }
  };

  const handleResetMockup = () => {
    updateMock({
      shape: 'box',
      color: brief.palette[3] || '#C9B896',
      scene: 'studio-light',
      logo: null,
      logoScale: 0.8,
      logoX: 0,
      logoY: -10,
      logoRot: 0,
      prodName: brief.brandName || '',
      prodTag: brief.category || '',
      textFont: 'Space Grotesk',
      textColor: '#18181a',
      textSize: 15,
      textY: 35,
      texture: 'none',
      textureOpacity: 0.35,
      materialStyle: 'glossy',
      windowEnabled: false,
      extraImages: [],
      extraTexts: []
    });
  };

  const zone = shape.zone;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      
      {/* Left Column (3 cols): Packaging Shape, Finish & Texture Controls */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* Shape Picker */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Bentuk Kemasan (17 Pilihan)</span>
            <Box size={13} className="text-red-400" />
          </div>
          <p className="text-[10px] text-slate-400 mb-3">
            {SHAPE_DESCRIPTIONS[m.shape]}
          </p>

          <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
            {Object.entries(SHAPE_LABELS).map(([k, label]) => {
              const isSelected = m.shape === k;
              return (
                <button
                  key={k}
                  onClick={() => updateMock({ shape: k as PackagingShapeKey })}
                  className={`rounded-xl px-2.5 py-1.5 text-xs text-left transition truncate ${
                    isSelected
                      ? 'bg-red-600 text-white font-bold shadow-md'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {label.split(' / ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Warna Bahan Kemasan */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Warna Bahan Kemasan
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5">Dari Palet Brand:</span>
            <div className="flex items-center gap-1.5">
              {brief.palette.map((hex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => updateMock({ color: hex })}
                  className={`h-7 w-7 rounded-xl border transition ${
                    m.color.toLowerCase() === hex.toLowerCase() ? 'ring-2 ring-red-500 scale-110 border-white' : 'border-black/20'
                  }`}
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400">Pilih Warna Bebas:</span>
            <input
              type="color"
              value={m.color}
              onChange={e => updateMock({ color: e.target.value })}
              className="h-8 w-12 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer"
            />
            <span className="font-mono text-xs text-slate-300 uppercase">{m.color}</span>
          </div>
        </div>

        {/* Finishing & Material Style */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Gaya Material &amp; Tekstur
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Gaya Material (Finishing)</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['glossy', 'matte', 'kraft'] as MaterialStyle[]).map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => updateMock({ materialStyle: style })}
                  className={`rounded-lg py-1.5 text-xs font-semibold capitalize border transition ${
                    m.materialStyle === style
                      ? 'border-red-500 bg-red-600 text-white'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Tekstur Permukaan</label>
            <select
              value={m.texture}
              onChange={e => updateMock({ texture: e.target.value as TextureType })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="none">Tanpa Tekstur (Halus)</option>
              <option value="kraft-grain">Kertas / Grain Berserat</option>
              <option value="linen">Linen Fiber Halus</option>
              <option value="canvas">Canvas Kasar / Emboss</option>
              <option value="dots">Dot Halftone Industri</option>
            </select>
          </div>

          {m.texture !== 'none' && (
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Intensitas Tekstur:</span>
                <span className="font-mono">{Math.round(m.textureOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.8}
                step={0.05}
                value={m.textureOpacity}
                onChange={e => updateMock({ textureOpacity: parseFloat(e.target.value) })}
                className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>
          )}

          {shape.windowZone && (
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={m.windowEnabled}
                  onChange={e => updateMock({ windowEnabled: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-0"
                />
                <span className="text-xs font-semibold text-slate-200">
                  Tampilkan Jendela Produk Transparan
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Latar Studio */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm">
          <label className="block text-[11px] text-slate-400 mb-1">Latar Studio Foto</label>
          <select
            value={m.scene}
            onChange={e => updateMock({ scene: e.target.value as any })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
          >
            <option value="studio-light">Studio Terang (Clean Minimalist)</option>
            <option value="studio-dark">Studio Gelap (Dramatic Moody)</option>
            <option value="kraft">Meja Kayu / Kraft Warm</option>
          </select>
        </div>

      </div>

      {/* Center Column (6 cols): 3D Realistic WebGL vs 2D SVG Stage Canvas */}
      <div className="lg:col-span-6 space-y-3">
        
        {/* Hybrid OS Engine Switcher: 3D Real-Time WebGL vs 2D Vector Flat */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-2xl border border-slate-700/80 bg-slate-900 shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-1 hidden sm:inline">Engine:</span>
            
            <button
              onClick={() => setRenderEngine('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm whitespace-nowrap ${
                renderEngine === '3d'
                  ? 'bg-red-600 text-white shadow-red-950/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/70'
              }`}
            >
              <Sparkles size={13} className={renderEngine === '3d' ? 'text-white' : 'text-slate-400'} />
              <span>3D Studio Interaktif (360° PBR)</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-black/25 text-red-200 uppercase font-mono">
                Realistis
              </span>
            </button>

            <button
              onClick={() => setRenderEngine('2d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                renderEngine === '2d'
                  ? 'bg-red-600 text-white shadow-red-950/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/70'
              }`}
            >
              <Box size={13} className={renderEngine === '2d' ? 'text-white' : 'text-slate-400'} />
              <span>2D Vektor Cepat (17 SVG)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-slate-400 font-mono hidden md:inline">
              {SHAPE_LABELS[m.shape]?.split(' / ')[0]}
            </span>
            <button
              onClick={handleResetMockup}
              className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition"
              title="Reset ke pengaturan default"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            {renderEngine === '2d' && (
              <button
                onClick={exportMockupPng}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition shadow"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Unduh PNG</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Canvas Rendering: 3D Real-Time Three.js vs 2D SVG */}
        {renderEngine === '3d' ? (
          <div id="mockupStageElement" className="w-full">
            <ThreeMockupCanvas
              config={m}
              onUpdateConfig={updateMock}
              brandName={brief.brandName}
              theme={theme}
            />
          </div>
        ) : (
          <div 
            id="mockupStageElement"
            className="relative flex flex-col items-center justify-center rounded-2xl p-6 min-h-[500px] shadow-xl overflow-hidden"
            style={{ background: SCENES_BG[m.scene] || SCENES_BG['studio-light'] }}
          >
          {/* Packaging Container */}
          <div 
            className="relative"
            style={{ width: `${containerW}px`, height: `${containerH}px` }}
          >
            {/* Base SVG Object */}
            <svg
              viewBox={shape.viewBox}
              className="w-full h-full block"
              dangerouslySetInnerHTML={{ __html: svgInnerContent }}
            />

            {/* Label Zone: Main Logo & Product Typography */}
            <div
              className="absolute overflow-hidden pointer-events-none"
              style={{
                left: `${(zone.x / vbW) * 100}%`,
                top: `${(zone.y / vbH) * 100}%`,
                width: `${(zone.w / vbW) * 100}%`,
                height: `${(zone.h / vbH) * 100}%`
              }}
            >
              {/* Logo Overlay */}
              {m.logo && (
                <img
                  src={m.logo}
                  alt="Logo Packaging"
                  className="absolute left-1/2 top-1/2 max-w-[180%] max-h-[180%] object-contain"
                  style={{
                    transform: `translate(-50%, -50%) translate(${m.logoX}px, ${m.logoY}px) rotate(${m.logoRot}deg) scale(${m.logoScale})`
                  }}
                />
              )}

              {/* Product Name & Tagline */}
              <div
                className="absolute left-1/2 top-1/2 text-center whitespace-nowrap"
                style={{
                  transform: `translate(-50%, -50%) translate(0px, ${m.textY}px)`,
                  fontFamily: m.textFont,
                  color: m.textColor
                }}
              >
                {m.prodName && (
                  <p 
                    className="font-bold leading-tight uppercase tracking-wider"
                    style={{ fontSize: `${m.textSize}px` }}
                  >
                    {m.prodName}
                  </p>
                )}
                {m.prodTag && (
                  <p 
                    className="leading-snug opacity-85 tracking-widest uppercase font-mono"
                    style={{ fontSize: `${Math.max(8, m.textSize * 0.52)}px` }}
                  >
                    {m.prodTag}
                  </p>
                )}
              </div>
            </div>

            {/* Extra Image Layers (Badges / Halal / QR) */}
            {(m.extraImages || []).map((img) => (
              <img
                key={img.id}
                src={img.src}
                alt="Extra Badge"
                className="absolute pointer-events-none max-w-[90px] max-h-[90px] object-contain"
                style={{
                  left: `${img.x}%`,
                  top: `${img.y}%`,
                  transform: `translate(-50%, -50%) rotate(${img.rot}deg) scale(${img.scale})`
                }}
              />
            ))}

            {/* Extra Free-floating Texts */}
            {(m.extraTexts || []).map((tx) => (
              <div
                key={tx.id}
                className="absolute pointer-events-none whitespace-nowrap text-center font-bold tracking-wider"
                style={{
                  left: `${tx.x}%`,
                  top: `${tx.y}%`,
                  transform: `translate(-50%, -50%) rotate(${tx.rot}deg)`,
                  fontFamily: tx.font,
                  fontSize: `${tx.size}px`,
                  color: tx.color
                }}
              >
                {tx.text}
              </div>
            ))}
          </div>

          {/* Watermark Tag */}
          <div className="absolute bottom-3 left-4 text-[9px] uppercase tracking-wider font-mono text-slate-500/80">
            obeecreatives 3D Packaging Renderer
          </div>
        </div>
        )}

      </div>

      {/* Right Column (3 cols): Logo, Badges & Typography Controls */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* Logo Utama Uploader & Controls */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
            <span>Logo Kemasan Utama</span>
            <ImageIcon size={13} className="text-red-400" />
          </div>

          <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 hover:border-red-500 bg-slate-800/50 p-3 text-center cursor-pointer transition">
            <Upload size={16} className="text-slate-400 mb-1" />
            <span className="text-xs font-semibold text-slate-200">+ Upload Logo PNG Transparan</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>

          {m.logo && (
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Skala Logo:</span>
                  <span className="font-mono">{m.logoScale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={2.0}
                  step={0.05}
                  value={m.logoScale}
                  onChange={e => updateMock({ logoScale: parseFloat(e.target.value) })}
                  className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Posisi X:</span>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    value={m.logoX}
                    onChange={e => updateMock({ logoX: parseInt(e.target.value) })}
                    className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Posisi Y:</span>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    value={m.logoY}
                    onChange={e => updateMock({ logoY: parseInt(e.target.value) })}
                    className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Rotasi Logo:</span>
                  <span className="font-mono">{m.logoRot}°</span>
                </div>
                <input
                  type="range"
                  min={-45}
                  max={45}
                  value={m.logoRot}
                  onChange={e => updateMock({ logoRot: parseInt(e.target.value) })}
                  className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
              </div>

              <button
                onClick={() => updateMock({ logo: null })}
                className="w-full text-right text-[10px] text-red-400 hover:underline pt-1"
              >
                Hapus Logo
              </button>
            </div>
          )}
        </div>

        {/* Nama Produk & Tipografi Kemasan */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
            <span>Nama Produk &amp; Teks</span>
            <Type size={13} className="text-red-400" />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Nama Produk di Kemasan</label>
            <input
              type="text"
              value={m.prodName}
              onChange={e => updateMock({ prodName: e.target.value })}
              placeholder="Contoh: DAWANA HONEY"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none uppercase"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Tagline / Deskripsi / Netto</label>
            <input
              type="text"
              value={m.prodTag}
              onChange={e => updateMock({ prodTag: e.target.value })}
              placeholder="Contoh: RAW FOREST HONEY 350G"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Font</label>
              <select
                value={m.textFont}
                onChange={e => updateMock({ textFont: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                <option value="Space Grotesk">Space Grotesk</option>
                <option value="Inter">Inter</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Warna Teks</label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={m.textColor}
                  onChange={e => updateMock({ textColor: e.target.value })}
                  className="h-8 w-10 rounded border border-slate-700 bg-slate-800 cursor-pointer"
                />
                <span className="font-mono text-[10px] text-slate-300 uppercase truncate">{m.textColor}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Posisi Y Teks:</span>
              <span className="font-mono">{m.textY}px</span>
            </div>
            <input
              type="range"
              min={-60}
              max={80}
              value={m.textY}
              onChange={e => updateMock({ textY: parseInt(e.target.value) })}
              className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Ukuran Font:</span>
              <span className="font-mono">{m.textSize}px</span>
            </div>
            <input
              type="range"
              min={9}
              max={28}
              value={m.textSize}
              onChange={e => updateMock({ textSize: parseInt(e.target.value) })}
              className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
          </div>
        </div>

        {/* Gambar Tambahan (Halal / BPOM / Seal) */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
            <span>Badge / Seal / Halal</span>
            <Layers size={13} className="text-red-400" />
          </div>

          <label className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-700 hover:border-red-500 bg-slate-800/50 p-2.5 text-center cursor-pointer transition text-xs font-semibold text-slate-300">
            <Upload size={14} />
            <span>+ Tambah Gambar / Badge</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddExtraImage}
              className="hidden"
            />
          </label>

          {(m.extraImages || []).length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {(m.extraImages || []).map((img, idx) => (
                <div key={img.id} className="flex items-center justify-between bg-slate-800 p-2 rounded-xl border border-slate-700 text-xs">
                  <div className="flex items-center gap-2">
                    <img src={img.src} alt="" className="h-6 w-6 object-contain bg-white rounded p-0.5" />
                    <span className="text-[11px] text-slate-300">Layer #{idx + 1}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveExtraImage(img.id)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleAddExtraText}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 transition"
          >
            + Tambah Teks Khusus (Netto / Sertifikasi)
          </button>
        </div>

      </div>

    </div>
  );
};
