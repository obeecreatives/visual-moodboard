import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Lightbulb, 
  Layers, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Printer, 
  Check, 
  Image as ImageIcon, 
  Upload, 
  Link as LinkIcon, 
  Maximize2, 
  X, 
  Sparkles, 
  ShoppingBag,
  ExternalLink,
  Tag,
  Move,
  Crosshair
} from 'lucide-react';
import { 
  PhotoShootConcept, 
  StudioLight, 
  PhotoShotItem, 
  PhotoReferenceImage,
  LightType, 
  LightModifier, 
  PhotoAspect, 
  PhotoAngle, 
  ShotStatus, 
  Role, 
  BriefProject 
} from '../../types';
import { 
  SURFACE_PRESETS, 
  PROPS_CATEGORIES, 
  LIGHTING_PRESET_TEMPLATES 
} from '../../data/photographyPresets';

interface PhotoStudioViewProps {
  currentConcept: PhotoShootConcept;
  onUpdateConcept: (updated: PhotoShootConcept) => void;
  availableBriefs: BriefProject[];
  userRole: Role;
  darkMode: boolean;
  onTriggerSync?: () => void;
}

export const PhotoStudioView: React.FC<PhotoStudioViewProps> = ({
  currentConcept,
  onUpdateConcept,
  availableBriefs,
  userRole,
  darkMode,
  onTriggerSync
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'lighting' | 'props' | 'references' | 'shots' | 'callsheet'>('lighting');
  const [selectedLightId, setSelectedLightId] = useState<string>(currentConcept.lights[0]?.id || 'light-1');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterRefCategory, setFilterRefCategory] = useState<string>('all');
  
  // Modals & Lightbox states
  const [lightboxImage, setLightboxImage] = useState<PhotoReferenceImage | null>(null);
  const [isAddingRefModal, setIsAddingRefModal] = useState<boolean>(false);
  const [isAddingShot, setIsAddingShot] = useState<boolean>(false);
  const [activeUploadShotId, setActiveUploadShotId] = useState<string | null>(null);

  // Hidden file inputs
  const generalFileInputRef = useRef<HTMLInputElement | null>(null);
  const shotFileInputRef = useRef<HTMLInputElement | null>(null);

  // Canvas Drag & Drop State
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [draggingLightId, setDraggingLightId] = useState<string | null>(null);
  const [autoAimEnabled, setAutoAimEnabled] = useState<boolean>(true);

  // New Reference form state
  const [newRef, setNewRef] = useState<{
    title: string;
    url: string;
    category: PhotoReferenceImage['category'];
    note: string;
    attachToShotId: string;
  }>({
    title: '',
    url: '',
    category: 'Lighting',
    note: '',
    attachToShotId: ''
  });

  // New Shot form state
  const [newShot, setNewShot] = useState<Partial<PhotoShotItem>>({
    title: '',
    format: '4:5',
    angle: 'Hero 45°',
    platform: 'Instagram Feed',
    propNotes: '',
    lightingNotes: '',
    status: 'Planned',
    refImage: ''
  });

  const selectedLight = currentConcept.lights.find(l => l.id === selectedLightId) || currentConcept.lights[0];
  const activeSurface = SURFACE_PRESETS.find(s => s.key === currentConcept.surfaceKey) || SURFACE_PRESETS[0];
  const conceptReferences = currentConcept.referenceImages || [];

  // Helper Kelvin to Color Tint
  const getKelvinColor = (kelvin: number) => {
    if (kelvin <= 3400) return '#fbbf24'; // Warm Tungsten
    if (kelvin <= 4500) return '#fde047'; // Studio Warm
    if (kelvin <= 5600) return '#ffffff'; // Daylight Pure White
    return '#93c5fd'; // Cool Daylight
  };

  // Light Handlers
  const handleUpdateSelectedLight = (changes: Partial<StudioLight>) => {
    if (!selectedLight) return;
    const updatedLights = currentConcept.lights.map(l => 
      l.id === selectedLight.id ? { ...l, ...changes } : l
    );
    onUpdateConcept({
      ...currentConcept,
      lights: updatedLights,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddLight = () => {
    const newId = `light-${Date.now()}`;
    const newLightItem: StudioLight = {
      id: newId,
      name: `Light Source ${currentConcept.lights.length + 1}`,
      type: 'fill',
      x: 50,
      y: 20,
      angle: 180,
      power: 70,
      kelvin: 5500,
      modifier: 'Softbox Octa',
      active: true
    };
    onUpdateConcept({
      ...currentConcept,
      lights: [...currentConcept.lights, newLightItem],
      updatedAt: new Date().toISOString()
    });
    setSelectedLightId(newId);
  };

  const handleDeleteLight = (id: string) => {
    if (currentConcept.lights.length <= 1) return;
    const filtered = currentConcept.lights.filter(l => l.id !== id);
    onUpdateConcept({
      ...currentConcept,
      lights: filtered,
      updatedAt: new Date().toISOString()
    });
    if (selectedLightId === id) {
      setSelectedLightId(filtered[0]?.id || '');
    }
  };

  const handleApplyLightingTemplate = (templateIndex: number) => {
    const template = LIGHTING_PRESET_TEMPLATES[templateIndex];
    if (!template) return;
    onUpdateConcept({
      ...currentConcept,
      lights: template.lights,
      updatedAt: new Date().toISOString()
    });
    if (template.lights.length > 0) {
      setSelectedLightId(template.lights[0].id);
    }
  };

  // Canvas Drag & Drop Pointer Handlers
  const handleLightPointerDown = (e: React.PointerEvent, lightId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedLightId(lightId);
    setDraggingLightId(lightId);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!draggingLightId || !canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.round(Math.max(6, Math.min(94, rawX)));
    const clampedY = Math.round(Math.max(6, Math.min(94, rawY)));

    let angleDeg: number | undefined = undefined;
    if (autoAimEnabled) {
      // Calculate angle pointing towards center (50, 50) table
      const dx = 50 - clampedX;
      const dy = 50 - clampedY;
      const rad = Math.atan2(dy, dx);
      let deg = Math.round(rad * (180 / Math.PI) - 90);
      if (deg < 0) deg += 360;
      angleDeg = deg;
    }

    const updatedLights = currentConcept.lights.map(l => {
      if (l.id === draggingLightId) {
        return {
          ...l,
          x: clampedX,
          y: clampedY,
          ...(angleDeg !== undefined ? { angle: angleDeg } : {})
        };
      }
      return l;
    });

    onUpdateConcept({
      ...currentConcept,
      lights: updatedLights,
      updatedAt: new Date().toISOString()
    });
  };

  const handleLightPointerUp = (e: React.PointerEvent) => {
    if (draggingLightId) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      setDraggingLightId(null);
    }
  };

  // Surface & Props Handlers
  const handleSelectSurface = (surfaceKey: string) => {
    onUpdateConcept({
      ...currentConcept,
      surfaceKey,
      updatedAt: new Date().toISOString()
    });
  };

  const handleToggleProp = (propName: string) => {
    const exists = currentConcept.selectedProps.includes(propName);
    const updatedProps = exists 
      ? currentConcept.selectedProps.filter(p => p !== propName)
      : [...currentConcept.selectedProps, propName];
    onUpdateConcept({
      ...currentConcept,
      selectedProps: updatedProps,
      updatedAt: new Date().toISOString()
    });
  };

  // --- REFERENCE PHOTO HANDLERS ---
  const handleGeneralFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setNewRef(prev => ({
          ...prev,
          url: dataUrl,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '')
        }));
        setIsAddingRefModal(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleShotFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadShotId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        // Attach directly to the active shot
        const updatedShots = currentConcept.shots.map(s => 
          s.id === activeUploadShotId ? { ...s, refImage: dataUrl } : s
        );
        // Also save to reference gallery so it can be reused
        const newRefObj: PhotoReferenceImage = {
          id: `ref-${Date.now()}`,
          url: dataUrl,
          title: `Acuan Shot: ${currentConcept.shots.find(s => s.id === activeUploadShotId)?.title || 'Detail'}`,
          category: 'Framing & Angle',
          note: `Foto acuan yang diunggah langsung untuk shot #${activeUploadShotId}`
        };
        onUpdateConcept({
          ...currentConcept,
          shots: updatedShots,
          referenceImages: [...conceptReferences, newRefObj],
          updatedAt: new Date().toISOString()
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
    setActiveUploadShotId(null);
  };

  const handleSaveNewReference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRef.url || !newRef.title) return;

    const newRefObj: PhotoReferenceImage = {
      id: `ref-${Date.now()}`,
      url: newRef.url,
      title: newRef.title,
      category: newRef.category,
      note: newRef.note
    };

    let updatedShots = currentConcept.shots;
    if (newRef.attachToShotId) {
      updatedShots = updatedShots.map(s => 
        s.id === newRef.attachToShotId ? { ...s, refImage: newRef.url } : s
      );
    }

    onUpdateConcept({
      ...currentConcept,
      referenceImages: [...conceptReferences, newRefObj],
      shots: updatedShots,
      updatedAt: new Date().toISOString()
    });

    setNewRef({
      title: '',
      url: '',
      category: 'Lighting',
      note: '',
      attachToShotId: ''
    });
    setIsAddingRefModal(false);
  };

  const handleDeleteReference = (refId: string) => {
    const refToDelete = conceptReferences.find(r => r.id === refId);
    const filtered = conceptReferences.filter(r => r.id !== refId);
    
    // Also remove from any shots if that URL was attached
    const updatedShots = currentConcept.shots.map(s => {
      if (refToDelete && s.refImage === refToDelete.url) {
        return { ...s, refImage: undefined };
      }
      return s;
    });

    onUpdateConcept({
      ...currentConcept,
      referenceImages: filtered,
      shots: updatedShots,
      updatedAt: new Date().toISOString()
    });
    if (lightboxImage?.id === refId) {
      setLightboxImage(null);
    }
  };

  const handleAttachRefToShot = (shotId: string, imageUrl: string) => {
    const updatedShots = currentConcept.shots.map(s => 
      s.id === shotId ? { ...s, refImage: imageUrl } : s
    );
    onUpdateConcept({
      ...currentConcept,
      shots: updatedShots,
      updatedAt: new Date().toISOString()
    });
  };

  const handleRemoveRefFromShot = (shotId: string) => {
    const updatedShots = currentConcept.shots.map(s => 
      s.id === shotId ? { ...s, refImage: undefined } : s
    );
    onUpdateConcept({
      ...currentConcept,
      shots: updatedShots,
      updatedAt: new Date().toISOString()
    });
  };

  // Shot List Handlers
  const handleToggleShotStatus = (shotId: string) => {
    const statusCycle: ShotStatus[] = ['Planned', 'Tested', 'Approved', 'Completed'];
    const updatedShots = currentConcept.shots.map(shot => {
      if (shot.id === shotId) {
        const nextIndex = (statusCycle.indexOf(shot.status) + 1) % statusCycle.length;
        return { ...shot, status: statusCycle[nextIndex] };
      }
      return shot;
    });
    onUpdateConcept({
      ...currentConcept,
      shots: updatedShots,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddShotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShot.title) return;
    const shotItem: PhotoShotItem = {
      id: `shot-${Date.now()}`,
      title: newShot.title,
      format: (newShot.format as PhotoAspect) || '4:5',
      angle: (newShot.angle as PhotoAngle) || 'Hero 45°',
      platform: (newShot.platform as any) || 'Instagram Feed',
      propNotes: newShot.propNotes || '',
      lightingNotes: newShot.lightingNotes || '',
      status: (newShot.status as ShotStatus) || 'Planned',
      refImage: newShot.refImage || undefined
    };
    onUpdateConcept({
      ...currentConcept,
      shots: [...currentConcept.shots, shotItem],
      updatedAt: new Date().toISOString()
    });
    setNewShot({
      title: '',
      format: '4:5',
      angle: 'Hero 45°',
      platform: 'Instagram Feed',
      propNotes: '',
      lightingNotes: '',
      status: 'Planned',
      refImage: ''
    });
    setIsAddingShot(false);
  };

  const handleDeleteShot = (shotId: string) => {
    onUpdateConcept({
      ...currentConcept,
      shots: currentConcept.shots.filter(s => s.id !== shotId),
      updatedAt: new Date().toISOString()
    });
  };

  const filteredShots = filterPlatform === 'all'
    ? currentConcept.shots
    : currentConcept.shots.filter(s => s.platform.toLowerCase().includes(filterPlatform.toLowerCase()));

  const filteredReferences = filterRefCategory === 'all'
    ? conceptReferences
    : conceptReferences.filter(r => r.category === filterRefCategory);

  const handlePrintCallSheet = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs for Local Image Upload */}
      <input
        type="file"
        ref={generalFileInputRef}
        onChange={handleGeneralFileSelect}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={shotFileInputRef}
        onChange={handleShotFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Header Bar */}
      <div className={`p-6 rounded-2xl border transition-colors shadow-sm ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-600 text-white tracking-wider uppercase">
                Photo Studio OS
              </span>
              <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {currentConcept.campaignType}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Klien: <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{currentConcept.clientName}</strong>
              </span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {currentConcept.title}
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Studio tata cahaya interaktif, visual props matrix, galeri acuan foto referensi, dan shot deliverables.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Link to Brief Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Tautkan Brief:</span>
              <select
                value={currentConcept.briefId || ''}
                onChange={(e) => {
                  const bId = e.target.value;
                  const foundBrief = availableBriefs.find(b => b.id === bId);
                  onUpdateConcept({
                    ...currentConcept,
                    briefId: bId,
                    brandName: foundBrief ? foundBrief.brandName : currentConcept.brandName,
                    clientName: foundBrief ? foundBrief.clientName : currentConcept.clientName,
                    palette: foundBrief ? foundBrief.palette : currentConcept.palette,
                    updatedAt: new Date().toISOString()
                  });
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-700 text-slate-200' 
                    : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <option value="">(Tanpa Tautan Brief)</option>
                {availableBriefs.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.briefNumber} — {b.brandName} ({b.clientName})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrintCallSheet}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                darkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Call Sheet</span>
            </button>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('lighting')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubTab === 'lighting'
                ? 'bg-rose-600 text-white shadow-sm'
                : darkMode 
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>1. Studio Lighting</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">
              {currentConcept.lights.length} Lampu
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('props')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubTab === 'props'
                ? 'bg-rose-600 text-white shadow-sm'
                : darkMode 
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Props & Surface</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">
              {currentConcept.selectedProps.length} Props
            </span>
          </button>

          {/* NEW SUB-TAB: ACUAN & REFERENSI FOTO */}
          <button
            onClick={() => setActiveSubTab('references')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubTab === 'references'
                ? 'bg-rose-600 text-white shadow-sm'
                : darkMode 
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>3. Acuan Foto Referensi</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">
              {conceptReferences.length} Acuan
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('shots')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubTab === 'shots'
                ? 'bg-rose-600 text-white shadow-sm'
                : darkMode 
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>4. Shot List & Deliverables</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">
              {currentConcept.shots.length} Shots
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('callsheet')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubTab === 'callsheet'
                ? 'bg-rose-600 text-white shadow-sm'
                : darkMode 
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>5. Production Call Sheet</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: STUDIO LIGHTING CANVAS */}
      {activeSubTab === 'lighting' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main 2D Interactive Studio Floor (Canvas) */}
          <div className={`lg:col-span-8 p-6 rounded-2xl border shadow-sm ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Interactive Studio Floor Plan (Top-Down View)
                </h3>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Klik lampu untuk mengatur arah berkas sinar, temperatur Kelvin, dan intensitas daya.
                </p>
              </div>

              {/* Template & Drag Options */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setAutoAimEnabled(!autoAimEnabled)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    autoAimEnabled
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-xs'
                      : darkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                  title="Arah sorotan lampu otomatis membidik ke meja produk di tengah"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${autoAimEnabled ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span>Auto-Aim Meja: {autoAimEnabled ? 'ON' : 'OFF'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Preset:</span>
                  <select
                    onChange={(e) => handleApplyLightingTemplate(Number(e.target.value))}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 text-slate-200' 
                        : 'bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    {LIGHTING_PRESET_TEMPLATES.map((tpl, idx) => (
                      <option key={idx} value={idx}>{tpl.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Studio Simulation Stage with Interactive Drag and Drop */}
            <div 
              ref={canvasContainerRef}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleLightPointerUp}
              className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center select-none touch-none ${
                draggingLightId ? 'cursor-grabbing' : 'cursor-default'
              }`}
            >
              {/* Studio Grid Lines */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Light Cones Rendering */}
              {currentConcept.lights.filter(l => l.active).map(l => {
                const isSelected = l.id === selectedLightId;
                const lightTint = getKelvinColor(l.kelvin);
                return (
                  <div
                    key={`cone-${l.id}`}
                    className="absolute pointer-events-none transition-all duration-300"
                    style={{
                      left: `${l.x}%`,
                      top: `${l.y}%`,
                      transform: `translate(-50%, -50%) rotate(${l.angle}deg)`,
                      transformOrigin: 'center center'
                    }}
                  >
                    <div 
                      style={{
                        width: `${Math.max(120, l.power * 2.8)}px`,
                        height: '140px',
                        background: `linear-gradient(to bottom, ${lightTint}55 0%, ${lightTint}10 60%, transparent 100%)`,
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                        filter: isSelected ? 'drop-shadow(0 0 12px rgba(225,29,72,0.4))' : 'none'
                      }}
                    />
                  </div>
                );
              })}

              {/* Center Subject / Product Stage Table */}
              <div 
                className="absolute z-10 w-28 h-28 rounded-2xl shadow-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all duration-300"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: activeSurface.color,
                  backgroundImage: activeSurface.texturePattern,
                  borderColor: darkMode ? '#334155' : '#e2e8f0'
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-5 h-5 text-rose-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-900 mt-1 bg-white/80 px-1.5 py-0.5 rounded shadow-xs truncate max-w-[90px]">
                  {currentConcept.brandName || 'Produk'}
                </span>
                <span className="text-[8px] text-slate-700 bg-white/70 px-1 rounded truncate max-w-[90px]">
                  {activeSurface.name.split(' ')[0]}
                </span>
              </div>

              {/* Bottom Main Camera Location */}
              <div 
                className="absolute z-20 flex flex-col items-center pointer-events-none"
                style={{
                  left: '50%',
                  bottom: '12px',
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white border border-rose-500/50 shadow-lg text-[11px] font-semibold">
                  <Camera className="w-3.5 h-3.5 text-rose-400" />
                  <span>Kamera Utama ({currentConcept.cameraSettings.lens.split(' ')[0]})</span>
                </div>
                <div 
                  className="w-32 h-16 border-t border-l border-r border-dashed border-rose-500/30 rounded-t-full mt-1"
                />
              </div>

              {/* Interactive Draggable Lights on the Canvas */}
              {currentConcept.lights.map((l) => {
                const isSelected = l.id === selectedLightId;
                const isDragging = l.id === draggingLightId;
                const lightColor = getKelvinColor(l.kelvin);
                return (
                  <div
                    key={l.id}
                    onPointerDown={(e) => handleLightPointerDown(e, l.id)}
                    onPointerUp={handleLightPointerUp}
                    className={`absolute z-30 group flex flex-col items-center select-none touch-none transition-transform ${
                      isDragging 
                        ? 'scale-125 z-50 cursor-grabbing' 
                        : isSelected 
                          ? 'scale-110 z-40 cursor-grab' 
                          : 'opacity-90 hover:scale-105 cursor-grab'
                    }`}
                    style={{
                      left: `${l.x}%`,
                      top: `${l.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div 
                      className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xl border-2 transition-all relative ${
                        isSelected 
                          ? 'border-rose-500 ring-4 ring-rose-500/40 shadow-rose-500/50' 
                          : 'border-slate-700 bg-slate-900'
                      }`}
                      style={{
                        backgroundColor: l.active ? '#0f172a' : '#334155',
                        boxShadow: l.active ? `0 0 20px ${lightColor}99` : 'none'
                      }}
                    >
                      <Lightbulb 
                        className="w-5 h-5 transition-colors pointer-events-none"
                        style={{ color: l.active ? lightColor : '#64748b' }}
                      />

                      {/* Drag icon hint badge */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
                        <Move className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    <div className="mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 text-white border border-slate-700 whitespace-nowrap shadow-md flex items-center gap-1 pointer-events-none">
                      <span>{l.name}</span>
                      <span className="text-[9px] text-amber-400 font-mono">
                        {isDragging ? `${l.x}%, ${l.y}%` : `${l.power}%`}
                      </span>
                    </div>

                    {isDragging && (
                      <div className="mt-1 bg-rose-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap pointer-events-none animate-pulse">
                        Geser · Sudut: {l.angle}°
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Canvas Action Bar */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddLight}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Lampu Studio</span>
                </button>

                <span className="text-[11px] text-slate-400 hidden sm:inline flex items-center gap-1">
                  <Move className="w-3 h-3 text-rose-500 inline" /> Klik &amp; geser lampu untuk mengubah posisi secara bebas.
                </span>
              </div>

              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Daya Terpasang: <strong className={darkMode ? 'text-white' : 'text-slate-900'}>
                  {currentConcept.lights.filter(l => l.active).reduce((acc, l) => acc + l.power, 0)}W Eqv
                </strong>
              </div>
            </div>
          </div>

          {/* Selected Light Control Inspector (Right Panel) */}
          <div className={`lg:col-span-4 p-6 rounded-2xl border shadow-sm space-y-5 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {selectedLight ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getKelvinColor(selectedLight.kelvin) }}
                    />
                    <h4 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      Inspector: {selectedLight.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateSelectedLight({ active: !selectedLight.active })}
                      className={`text-xs px-2 py-1 rounded font-medium border ${
                        selectedLight.active 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {selectedLight.active ? 'Aktif' : 'Mati'}
                    </button>
                    {currentConcept.lights.length > 1 && (
                      <button
                        onClick={() => handleDeleteLight(selectedLight.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Hapus Lampu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Nama Lampu
                    </label>
                    <input
                      type="text"
                      value={selectedLight.name}
                      onChange={(e) => handleUpdateSelectedLight({ name: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Peran / Role Cahaya
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['key', 'fill', 'rim', 'back', 'hair', 'bounce'] as LightType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => handleUpdateSelectedLight({ type })}
                          className={`py-1 px-2 rounded text-[11px] font-medium uppercase border transition-colors ${
                            selectedLight.type === type
                              ? 'bg-rose-600 text-white border-rose-600'
                              : darkMode
                                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Modifier / Softbox
                    </label>
                    <select
                      value={selectedLight.modifier}
                      onChange={(e) => handleUpdateSelectedLight({ modifier: e.target.value as LightModifier })}
                      className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="Softbox Octa">Softbox Octa 90cm (Cahaya Sangat Lembut)</option>
                      <option value="Beauty Dish">Beauty Dish + Grid (Kontras Tajam Komersial)</option>
                      <option value="Hard Reflector">Standard Hard Reflector (Cahaya Keras/Sunbeam)</option>
                      <option value="Stripbox">Stripbox 30x120cm (Rim Light Produk Kaca/Botol)</option>
                      <option value="Snoot">Snoot / Conical (Spotlight Titik Tertentu)</option>
                      <option value="Scrim Diffuser">Scrim Diffuser Frame (Bebas Pantulan Silau)</option>
                      <option value="White Foamcore">White Foamcore (Reflektor Pantulan Pasif)</option>
                    </select>
                  </div>
                </div>

                {/* Sliders: Power, Kelvin, Angle, Position */}
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Intensitas Daya:</span>
                      <span className="font-mono font-bold text-rose-500">{selectedLight.power}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={selectedLight.power}
                      onChange={(e) => handleUpdateSelectedLight({ power: Number(e.target.value) })}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Color Temperature:</span>
                      <span className="font-mono font-bold text-amber-400">{selectedLight.kelvin}K</span>
                    </div>
                    <input
                      type="range"
                      min="3200"
                      max="6500"
                      step="100"
                      value={selectedLight.kelvin}
                      onChange={(e) => handleUpdateSelectedLight({ kelvin: Number(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                      <span>3200K (Warm)</span>
                      <span>5600K (Daylight)</span>
                      <span>6500K (Cool)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Sudut Arah Sorot:</span>
                      <span className="font-mono font-bold text-blue-400">{selectedLight.angle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={selectedLight.angle}
                      onChange={(e) => handleUpdateSelectedLight({ angle: Number(e.target.value) })}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                Pilih lampu di kanvas floor plan untuk mengatur parameter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PROPS & SURFACE MATRIX */}
      {activeSubTab === 'props' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-6 p-6 rounded-2xl border shadow-sm space-y-5 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                1. Pemilihan Permukaan Alas (Shooting Surface)
              </h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Pilih karakter tekstur alas tempat produk diletakkan saat sesi pemotretan studio.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SURFACE_PRESETS.map((surface) => {
                const isSelected = currentConcept.surfaceKey === surface.key;
                return (
                  <button
                    key={surface.key}
                    onClick={() => handleSelectSurface(surface.key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-rose-500 ring-2 ring-rose-500/30 shadow-md'
                        : darkMode 
                          ? 'border-slate-800 hover:border-slate-700 bg-slate-800/40' 
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div 
                      className="w-full h-16 rounded-lg mb-2 shadow-inner border border-black/10 relative overflow-hidden"
                      style={{
                        backgroundColor: surface.color,
                        backgroundImage: surface.texturePattern
                      }}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white uppercase backdrop-blur-xs">
                        {surface.category}
                      </span>
                    </div>
                    <div className={`font-bold text-xs ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {surface.name}
                    </div>
                    <p className={`text-[11px] mt-1 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {surface.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Color Palette Harmonization */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className={`block text-xs font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Harmonisasi Palet Warna & Tone Suasana
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {currentConcept.palette.map((hex, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-slate-700 bg-slate-800/50">
                    <div className="w-4 h-4 rounded-md shadow-xs" style={{ backgroundColor: hex }} />
                    <span className="text-[11px] font-mono text-slate-300">{hex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Styling Props Checklist */}
          <div className={`lg:col-span-6 p-6 rounded-2xl border shadow-sm space-y-5 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  2. Styling Props & Tekstur Pendukung
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                  {currentConcept.selectedProps.length} Dipilih
                </span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Centang aksesoris dan elemen styling yang wajib disiapkan tim stylist di set studio.
              </p>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {PROPS_CATEGORIES.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-2">
                  <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                    {cat.category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.items.map((propItem) => {
                      const isChecked = currentConcept.selectedProps.includes(propItem);
                      return (
                        <button
                          key={propItem}
                          onClick={() => handleToggleProp(propItem)}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-colors ${
                            isChecked
                              ? 'bg-rose-600/10 border-rose-500/50 text-rose-400 font-medium'
                              : darkMode
                                ? 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            isChecked 
                              ? 'bg-rose-600 border-rose-600 text-white' 
                              : darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span className="truncate">{propItem}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ACUAN & REFERENSI FOTO (VISUAL MOODBOARD) */}
      {activeSubTab === 'references' && (
        <div className="space-y-6">
          {/* Action Header */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-xs font-medium mr-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Kategori Acuan:
              </span>
              {[
                { id: 'all', label: 'Semua Acuan' },
                { id: 'Lighting', label: 'Tata Cahaya (Lighting)' },
                { id: 'Framing & Angle', label: 'Sudut & Framing' },
                { id: 'Props & Styling', label: 'Props & Styling' },
                { id: 'Color Tone', label: 'Color Tone & Mood' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterRefCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filterRefCategory === cat.id
                      ? 'bg-rose-600 text-white shadow-xs'
                      : darkMode
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Upload from Local Storage Button */}
              <button
                onClick={() => generalFileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
                title="Pilih file foto dari laptop/komputer Anda"
              >
                <Upload className="w-3.5 h-3.5 text-rose-400" />
                <span>Upload dari Perangkat</span>
              </button>

              {/* Add by Link or Manual Modal Button */}
              <button
                onClick={() => setIsAddingRefModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Input URL Acuan</span>
              </button>
            </div>
          </div>

          {/* Reference Photos Grid */}
          {filteredReferences.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center mb-3">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h4 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Belum ada acuan foto referensi
              </h4>
              <p className={`text-xs mt-1 max-w-sm mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Unggah contoh foto acuan dari perangkat Anda atau masukkan tautan URL foto referensi untuk memandu fotografer di studio.
              </p>
              <button
                onClick={() => generalFileInputRef.current?.click()}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Foto dari Perangkat</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredReferences.map((ref) => {
                return (
                  <div
                    key={ref.id}
                    className={`rounded-2xl border overflow-hidden flex flex-col justify-between group transition-all hover:shadow-lg ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      {/* Photo Thumbnail Container */}
                      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setLightboxImage(ref)}>
                        <img 
                          src={ref.url} 
                          alt={ref.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxImage(ref);
                            }}
                            className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs"
                            title="Perbesar Foto"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                          {ref.category}
                        </span>
                      </div>

                      {/* Content Info */}
                      <div className="p-4">
                        <h4 className={`text-xs font-bold line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {ref.title}
                        </h4>
                        {ref.note && (
                          <p className={`text-[11px] mt-1 leading-relaxed line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {ref.note}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-3 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                      {/* Quick Attach to Shot Dropdown */}
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAttachRefToShot(e.target.value, ref.url);
                          }
                        }}
                        defaultValue=""
                        className={`text-[10px] font-medium px-2 py-1 rounded border max-w-[170px] truncate ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <option value="">Tautkan ke Shot...</option>
                        {currentConcept.shots.map((s, idx) => (
                          <option key={s.id} value={s.id}>
                            #{idx + 1} {s.title}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleDeleteReference(ref.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Hapus Acuan Foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: SHOT LIST & DELIVERABLES */}
      {activeSubTab === 'shots' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-xs font-medium mr-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Filter Platform:
              </span>
              {[
                { id: 'all', label: 'Semua Shot' },
                { id: 'feed', label: 'Instagram Feed (1:1 & 4:5)' },
                { id: 'reels', label: 'Reels / TikTok (9:16)' },
                { id: 'catalog', label: 'E-Commerce Catalog' },
                { id: 'banner', label: 'Hero Banner (16:9)' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setFilterPlatform(item.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filterPlatform === item.id
                      ? 'bg-rose-600 text-white shadow-xs'
                      : darkMode
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddingShot(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Shot Baru</span>
            </button>
          </div>

          {/* Form Add Shot */}
          {isAddingShot && (
            <div className={`p-6 rounded-2xl border border-rose-500/40 shadow-xl ${
              darkMode ? 'bg-slate-850 border-rose-500/40' : 'bg-rose-50/50 border-rose-200'
            }`}>
              <h4 className={`text-sm font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Form Penambahan Shot List Photoshoot
              </h4>
              <form onSubmit={handleAddShotSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1">Judul / Konsep Shot:</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Hero Angle Kemasan dengan Tekstur Madu Menetes"
                    value={newShot.title}
                    onChange={(e) => setNewShot({ ...newShot, title: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Format Rasio:</label>
                  <select
                    value={newShot.format}
                    onChange={(e) => setNewShot({ ...newShot, format: e.target.value as PhotoAspect })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                    }`}
                  >
                    <option value="4:5">4:5 (Portrait - Instagram Feed)</option>
                    <option value="1:1">1:1 (Square - Feed / E-Commerce)</option>
                    <option value="9:16">9:16 (Vertical - Reels / TikTok / Story)</option>
                    <option value="16:9">16:9 (Landscape - Web Banner / Billboard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Sudut Kamera (Angle):</label>
                  <select
                    value={newShot.angle}
                    onChange={(e) => setNewShot({ ...newShot, angle: e.target.value as PhotoAngle })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                    }`}
                  >
                    <option value="Hero 45°">Hero 45° (Standard Komersial Utama)</option>
                    <option value="Flat Lay 90°">Flat Lay 90° (Top-Down Estetik)</option>
                    <option value="Eye Level 0°">Eye Level 0° (Sejajar Mata)</option>
                    <option value="Macro Detail">Macro Detail (Fokus Label & Tekstur Kemasan)</option>
                    <option value="In-Hand Lifestyle">In-Hand Lifestyle (Dipegang Model)</option>
                    <option value="Dynamic Splash/Action">Dynamic Splash/Action (Percikan / Levitation)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Target Platform:</label>
                  <select
                    value={newShot.platform}
                    onChange={(e) => setNewShot({ ...newShot, platform: e.target.value as any })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                    }`}
                  >
                    <option value="Instagram Feed">Instagram Feed</option>
                    <option value="Instagram Reels / TikTok">Instagram Reels / TikTok</option>
                    <option value="E-Commerce Catalog">E-Commerce Catalog</option>
                    <option value="Website Hero Banner">Website Hero Banner</option>
                    <option value="Print Ad / Billboard">Print Ad / Billboard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Pilih Foto Acuan Referensi (Opsional):</label>
                  <select
                    value={newShot.refImage || ''}
                    onChange={(e) => setNewShot({ ...newShot, refImage: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                    }`}
                  >
                    <option value="">(Belum ada foto acuan)</option>
                    {conceptReferences.map(r => (
                      <option key={r.id} value={r.url}>{r.title} ({r.category})</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-medium mb-1">Instruksi Props & Lighting:</label>
                  <input
                    type="text"
                    placeholder="Misal: Gunakan tatakan kayu jati, teteskan madu dari sendok kayu, rim light dari belakang kanan..."
                    value={newShot.propNotes}
                    onChange={(e) => setNewShot({ ...newShot, propNotes: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                    }`}
                  />
                </div>

                <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingShot(false)}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    Simpan ke Shot List
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Shot Cards Grid with Reference Image Attachments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredShots.map((shot, index) => {
              const statusColors: Record<ShotStatus, string> = {
                Planned: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
                Tested: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                Approved: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                Completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              };

              return (
                <div
                  key={shot.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-sm hover:shadow-md ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    {/* Top Row: Number, Aspect Ratio, Platform */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-rose-500">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-white border border-slate-700 font-mono">
                          {shot.format}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className={`text-[11px] font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          {shot.angle}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteShot(shot.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors p-1"
                        title="Hapus Shot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Reference Photo Box or Aspect Simulator */}
                    <div className="w-full h-36 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2 mb-3 relative overflow-hidden group">
                      {shot.refImage ? (
                        <>
                          <img 
                            src={shot.refImage} 
                            alt={shot.title}
                            className="w-full h-full object-cover rounded-lg cursor-pointer"
                            onClick={() => setLightboxImage({
                              id: `shot-ref-${shot.id}`,
                              url: shot.refImage!,
                              title: `Acuan: ${shot.title}`,
                              category: 'Framing & Angle'
                            })}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => setLightboxImage({
                                id: `shot-ref-${shot.id}`,
                                url: shot.refImage!,
                                title: `Acuan: ${shot.title}`,
                                category: 'Framing & Angle'
                              })}
                              className="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/40"
                              title="Perbesar Acuan"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveRefFromShot(shot.id)}
                              className="p-1.5 rounded-full bg-red-600/60 text-white hover:bg-red-600"
                              title="Hapus Lampiran Foto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-black/70 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 backdrop-blur-xs">
                            <Check className="w-2.5 h-2.5" /> Foto Acuan Terpasang
                          </span>
                        </>
                      ) : (
                        <div 
                          className="border-2 border-dashed border-slate-700 hover:border-rose-500/60 rounded-md flex flex-col items-center justify-center p-2 text-center transition-colors cursor-pointer w-full h-full"
                          onClick={() => {
                            setActiveUploadShotId(shot.id);
                            shotFileInputRef.current?.click();
                          }}
                        >
                          <Upload className="w-4 h-4 text-slate-400 group-hover:text-rose-400 mb-1" />
                          <span className="text-[10px] text-slate-400 group-hover:text-slate-200">
                            + Lampirkan Foto Acuan
                          </span>
                        </div>
                      )}
                    </div>

                    <h4 className={`text-sm font-bold tracking-tight mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {shot.title}
                    </h4>

                    {shot.propNotes && (
                      <p className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {shot.propNotes}
                      </p>
                    )}
                  </div>

                  {/* Bottom Controls */}
                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    {/* Quick Button to Upload/Change Reference */}
                    <button
                      onClick={() => {
                        setActiveUploadShotId(shot.id);
                        shotFileInputRef.current?.click();
                      }}
                      className="text-[10px] text-rose-500 hover:underline flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{shot.refImage ? 'Ganti Foto' : 'Upload Acuan'}</span>
                    </button>

                    <button
                      onClick={() => handleToggleShotStatus(shot.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all hover:scale-105 ${
                        statusColors[shot.status]
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{shot.status}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: PRODUCTION CALL SHEET (READY TO PRINT) */}
      {activeSubTab === 'callsheet' && (
        <div className={`p-8 rounded-2xl border shadow-sm print:p-0 print:border-none ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Header Call Sheet */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold tracking-widest text-rose-600 uppercase">
                  obeecreatives — Production Call Sheet
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-mono text-slate-400">DOC-REF: {currentConcept.id.toUpperCase()}</span>
              </div>
              <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {currentConcept.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Klien: {currentConcept.clientName} · Brand: {currentConcept.brandName} · Tipe: {currentConcept.campaignType}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrintCallSheet}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Produksi (Print / PDF)</span>
              </button>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Tanggal Eksekusi:</span>
              <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{currentConcept.callSheetDate}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Lokasi Studio:</span>
              <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{currentConcept.callSheetLocation}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Lead Photographer:</span>
              <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{currentConcept.photographerName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Lead Stylist:</span>
              <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{currentConcept.stylistName}</strong>
            </div>
          </div>

          {/* Visual Mood & Photo Reference Strip on Call Sheet */}
          {conceptReferences.length > 0 && (
            <div className="py-6 border-b border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-rose-500 uppercase tracking-wider text-xs mb-3">
                Acuan Visual & Benchmark Foto Pemotretan:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {conceptReferences.slice(0, 4).map((ref) => (
                  <div key={ref.id} className="rounded-xl border border-slate-700 overflow-hidden bg-slate-950">
                    <img src={ref.url} alt={ref.title} className="w-full h-24 object-cover" />
                    <div className="p-2 text-[10px]">
                      <strong className="block truncate text-white">{ref.title}</strong>
                      <span className="text-slate-400">{ref.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables Table with Attached Reference Thumbnails */}
          <div className="pt-6">
            <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-3">
              Daftar Deliverables ({currentConcept.shots.length} Shot Terjadwal):
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                    <th className="py-2.5 px-3 font-semibold">No</th>
                    <th className="py-2.5 px-3 font-semibold">Acuan Foto</th>
                    <th className="py-2.5 px-3 font-semibold">Deskripsi Shot</th>
                    <th className="py-2.5 px-3 font-semibold">Format</th>
                    <th className="py-2.5 px-3 font-semibold">Sudut Kamera</th>
                    <th className="py-2.5 px-3 font-semibold">Target Platform</th>
                    <th className="py-2.5 px-3 font-semibold">Props & Styling</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentConcept.shots.map((shot, idx) => (
                    <tr key={shot.id} className={darkMode ? 'text-slate-300 hover:bg-slate-800/30' : 'text-slate-800 hover:bg-slate-50'}>
                      <td className="py-2.5 px-3 font-mono font-bold">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        {shot.refImage ? (
                          <img 
                            src={shot.refImage} 
                            alt={shot.title} 
                            className="w-12 h-12 object-cover rounded-lg border border-slate-700 shadow-xs cursor-pointer"
                            onClick={() => setLightboxImage({
                              id: `cs-${shot.id}`,
                              url: shot.refImage!,
                              title: shot.title,
                              category: 'Framing & Angle'
                            })}
                          />
                        ) : (
                          <span className="text-[10px] text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-medium">{shot.title}</td>
                      <td className="py-2.5 px-3 font-mono">{shot.format}</td>
                      <td className="py-2.5 px-3">{shot.angle}</td>
                      <td className="py-2.5 px-3">{shot.platform}</td>
                      <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate">{shot.propNotes || '-'}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {shot.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INPUT / TAMBAH ACUAN FOTO */}
      {isAddingRefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setIsAddingRefModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold mb-1">
              Tambah Foto Acuan Referensi Pemotretan
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Unggah file foto langsung atau tempelkan URL gambar acuan untuk panduan fotografer & stylist.
            </p>

            <form onSubmit={handleSaveNewReference} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Judul / Deskripsi Singkat Acuan:</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Acuan Lighting Honey Jar atau Acuan Flatlay Botanicals"
                  value={newRef.title}
                  onChange={(e) => setNewRef({ ...newRef, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Sumber Gambar (File Upload atau URL):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="https://... atau hasil upload lokal"
                    value={newRef.url}
                    onChange={(e) => setNewRef({ ...newRef, url: e.target.value })}
                    className={`flex-1 px-3 py-2 rounded-lg border text-xs font-mono truncate ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => generalFileInputRef.current?.click()}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Browse File</span>
                  </button>
                </div>
              </div>

              {/* Live Preview if URL exists */}
              {newRef.url && (
                <div className="w-full h-36 rounded-xl border border-slate-700 overflow-hidden bg-slate-950 flex items-center justify-center relative">
                  <img src={newRef.url} alt="Preview" className="w-full h-full object-contain" />
                  <span className="absolute bottom-2 right-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-white">
                    Preview Acuan
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Kategori Acuan:</label>
                  <select
                    value={newRef.category}
                    onChange={(e) => setNewRef({ ...newRef, category: e.target.value as any })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Lighting">Tata Cahaya (Lighting)</option>
                    <option value="Framing & Angle">Sudut & Framing</option>
                    <option value="Props & Styling">Props & Styling</option>
                    <option value="Color Tone">Color Tone & Mood</option>
                    <option value="Other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Langsung Tautkan ke Shot:</label>
                  <select
                    value={newRef.attachToShotId}
                    onChange={(e) => setNewRef({ ...newRef, attachToShotId: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="">(Simpan di Galeri Umum)</option>
                    {currentConcept.shots.map((s, idx) => (
                      <option key={s.id} value={s.id}>
                        Shot #{idx + 1}: {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Catatan Khusus untuk Tim Studio:</label>
                <textarea
                  rows={2}
                  placeholder="Misal: Perhatikan highlight rim di leher botol kaca, gunakan diffuser di kiri..."
                  value={newRef.note}
                  onChange={(e) => setNewRef({ ...newRef, note: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingRefModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Simpan Acuan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black max-h-[75vh] flex items-center justify-center shadow-2xl">
              <img 
                src={lightboxImage.url} 
                alt={lightboxImage.title} 
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            <div className="w-full mt-3 flex items-center justify-between text-white text-xs px-2">
              <div>
                <strong className="text-sm font-bold block">{lightboxImage.title}</strong>
                <span className="text-slate-400">{lightboxImage.category} {lightboxImage.note && `· ${lightboxImage.note}`}</span>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="px-4 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
