import React from 'react';
import { 
  BriefProject, 
  SceneConfig, 
  PackagingShapeKey 
} from '../../types';
import { 
  SHAPES, 
  SHAPE_LABELS, 
  shadeColor, 
  SHADOW_BLUR_FILTER, 
  buildGroundShadow, 
  cylLightDefFor, 
  glossDefsFor, 
  buildWindowOverlay 
} from '../../data/shapes';
import { 
  Layers, 
  Plus, 
  RotateCcw, 
  Download, 
  Trash2, 
  Box, 
  Image as ImageIcon,
  Check
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface SceneViewProps {
  brief: BriefProject;
  onUpdateBrief: (updated: Partial<BriefProject>) => void;
  theme: 'dark' | 'light';
}

const SCENES_BG: Record<string, string> = {
  'studio-light': 'linear-gradient(180deg, #f5f4f0, #e7e6e0)',
  'studio-dark': 'linear-gradient(180deg, #2b2926, #141312)',
  'kraft': 'linear-gradient(180deg, #c9a875, #a8804f)'
};

export const SceneView: React.FC<SceneViewProps> = ({
  brief,
  onUpdateBrief,
  theme
}) => {
  const sc = brief.sceneConfig || {
    items: [
      { id: 1, shape: 'box', color: brief.palette[0] || '#2F3B25' },
      { id: 2, shape: 'pouch', color: brief.palette[1] || '#6B7A4A' },
      { id: 3, shape: 'zipperpouch', color: brief.palette[3] || '#C9B896' }
    ],
    showLogo: true,
    scene: 'studio-light'
  };

  const updateScene = (updated: Partial<SceneConfig>) => {
    onUpdateBrief({
      sceneConfig: {
        ...sc,
        ...updated
      }
    });
  };

  const handleAddItem = () => {
    if (sc.items.length >= 6) return;
    const availableShapes = Object.keys(SHAPES) as PackagingShapeKey[];
    const nextShape = availableShapes[sc.items.length % availableShapes.length];
    const nextColor = brief.palette[sc.items.length % brief.palette.length] || '#C9B896';

    const newItem = {
      id: Date.now() + Math.random(),
      shape: nextShape,
      color: nextColor
    };

    updateScene({ items: [...sc.items, newItem] });
  };

  const handleRemoveItem = (id: number) => {
    if (sc.items.length <= 1) return;
    updateScene({ items: sc.items.filter(item => item.id !== id) });
  };

  const handleItemShapeChange = (id: number, shape: PackagingShapeKey) => {
    const updated = sc.items.map(it => it.id === id ? { ...it, shape } : it);
    updateScene({ items: updated });
  };

  const handleItemColorChange = (id: number, color: string) => {
    const updated = sc.items.map(it => it.id === id ? { ...it, color } : it);
    updateScene({ items: updated });
  };

  const handleResetScene = () => {
    updateScene({
      items: [
        { id: 1, shape: 'box', color: brief.palette[0] || '#2F3B25' },
        { id: 2, shape: 'pouch', color: brief.palette[1] || '#6B7A4A' },
        { id: 3, shape: 'zipperpouch', color: brief.palette[3] || '#C9B896' }
      ],
      showLogo: true,
      scene: 'studio-light'
    });
  };

  const exportScenePng = async () => {
    const el = document.getElementById('sceneStageContainer');
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { backgroundColor: null, scale: 2 });
      const link = document.createElement('a');
      link.download = `obeecreatives-SetKemasan-${(brief.brandName || 'Brand').replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export Scene PNG failed', err);
    }
  };

  const itemHeight = 250;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      
      {/* Left Column (3 cols): Items in Set & Background Settings */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* Set Header & Add Button */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Item Kemasan dalam Set ({sc.items.length}/6)
            </span>
            <Layers size={13} className="text-red-400" />
          </div>

          <button
            onClick={handleAddItem}
            disabled={sc.items.length >= 6}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-40 transition"
          >
            <Plus size={14} className="text-red-400" />
            <span>+ Tambah Kemasan ke Set</span>
          </button>
        </div>

        {/* Item List Controls */}
        <div className="space-y-3">
          {sc.items.map((item, idx) => (
            <div 
              key={item.id}
              className="rounded-2xl border border-slate-700/80 bg-slate-900 p-3.5 shadow-sm space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-mono text-red-400 border border-slate-700">
                    {idx + 1}
                  </span>
                  <span>Kemasan #{idx + 1}</span>
                </span>
                {sc.items.length > 1 && (
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-slate-400 hover:text-red-400"
                    title="Hapus kemasan dari set"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Bentuk:</label>
                <select
                  value={item.shape}
                  onChange={e => handleItemShapeChange(item.id, e.target.value as PackagingShapeKey)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                >
                  {Object.entries(SHAPE_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 mb-1">Pilihan Warna:</span>
                <div className="flex items-center gap-1.5">
                  {brief.palette.map((hex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleItemColorChange(item.id, hex)}
                      className={`h-6 w-6 rounded-lg border transition ${
                        item.color.toLowerCase() === hex.toLowerCase() ? 'ring-2 ring-red-500 scale-105 border-white' : 'border-black/20'
                      }`}
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                  <input
                    type="color"
                    value={item.color}
                    onChange={e => handleItemColorChange(item.id, e.target.value)}
                    className="h-6 w-8 rounded border border-slate-700 bg-slate-800 cursor-pointer ml-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Studio Lighting & Logo Toggle */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Latar Studio Foto</label>
            <select
              value={sc.scene}
              onChange={e => updateScene({ scene: e.target.value as any })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="studio-light">Studio Terang (Clean Minimalist)</option>
              <option value="studio-dark">Studio Gelap (Dramatic Shadow)</option>
              <option value="kraft">Meja Kayu / Kraft Warm</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-800">
            <input
              type="checkbox"
              checked={sc.showLogo}
              onChange={e => updateScene({ showLogo: e.target.checked })}
              className="rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-0"
            />
            <span className="text-xs font-semibold text-slate-200">
              Tampilkan Logo Seragam di Seluruh Kemasan
            </span>
          </label>
        </div>

      </div>

      {/* Center Column (9 cols): The Lineup Scene Stage */}
      <div className="lg:col-span-9 space-y-3">
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            PRODUCT LINEUP STAGE • {sc.items.length} ITEM DI SET
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetScene}
              className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition"
            >
              <RotateCcw size={12} />
              <span>Reset Set</span>
            </button>
            <button
              onClick={exportScenePng}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition shadow"
            >
              <Download size={13} />
              <span>Unduh Set Kemasan (PNG)</span>
            </button>
          </div>
        </div>

        {/* Multi-Item Lineup Stage */}
        <div 
          id="sceneStageContainer"
          className="relative flex items-center justify-center rounded-2xl p-8 min-h-[520px] shadow-xl overflow-hidden"
          style={{ background: SCENES_BG[sc.scene] || SCENES_BG['studio-light'] }}
        >
          <div className="flex items-end justify-center gap-6 flex-wrap w-full py-6">
            {sc.items.map((item) => {
              const itemShape = SHAPES[item.shape] || SHAPES.box;
              const vb = itemShape.viewBox.split(' ').map(Number);
              const vbW = vb[2];
              const vbH = vb[3];
              const itemWidth = itemHeight * (vbW / vbH);

              const base = item.color;
              const top = shadeColor(base, 14);
              const side = shadeColor(base, -16);

              const zone = itemShape.zone;

              return (
                <div 
                  key={item.id} 
                  className="relative flex-shrink-0"
                  style={{ width: `${itemWidth}px`, height: `${itemHeight}px` }}
                >
                  <svg
                    viewBox={itemShape.viewBox}
                    className="w-full h-full block"
                    dangerouslySetInnerHTML={{
                      __html: `
                        <defs>
                          ${glossDefsFor(brief.mockupConfig.materialStyle)}
                          ${cylLightDefFor(brief.mockupConfig.materialStyle)}
                          ${SHADOW_BLUR_FILTER}
                        </defs>
                        ${buildGroundShadow(vbW, vbH, itemShape.shadowY)}
                        ${itemShape.build(base, top, side)}
                        ${brief.mockupConfig.windowEnabled && itemShape.windowZone ? buildWindowOverlay(itemShape.windowZone) : ''}
                      `
                    }}
                  />

                  {/* Synchronized Logo on Each Item */}
                  {sc.showLogo && brief.mockupConfig.logo && (
                    <div
                      className="absolute overflow-hidden flex items-center justify-center pointer-events-none"
                      style={{
                        left: `${(zone.x / vbW) * 100}%`,
                        top: `${(zone.y / vbH) * 100}%`,
                        width: `${(zone.w / vbW) * 100}%`,
                        height: `${(zone.h / vbH) * 100}%`
                      }}
                    >
                      <img
                        src={brief.mockupConfig.logo}
                        alt="Logo"
                        className="max-w-[75%] max-h-[75%] object-contain drop-shadow"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Watermark Tag */}
          <div className="absolute bottom-3 left-4 text-[9px] uppercase tracking-wider font-mono text-slate-500/80">
            obeecreatives Lineup Studio
          </div>
        </div>

      </div>

    </div>
  );
};
