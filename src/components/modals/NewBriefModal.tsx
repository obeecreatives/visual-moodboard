import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { BriefProject, PackagingShapeKey } from '../../types';
import { DESIGN_PRESETS } from '../../data/presets';
import { SHAPES, SHAPE_LABELS } from '../../data/shapes';

interface NewBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBrief: (brief: BriefProject) => void;
  nextNumber: string;
  creatorName: string;
}

export const NewBriefModal: React.FC<NewBriefModalProps> = ({
  isOpen,
  onClose,
  onAddBrief,
  nextNumber,
  creatorName
}) => {
  const [brandName, setBrandName] = useState('');
  const [clientName, setClientName] = useState('');
  const [packageName, setPackageName] = useState('Full Branding, Kemasan & Foto Produk');
  const [category, setCategory] = useState('Food & Beverages');
  const [initialShape, setInitialShape] = useState<PackagingShapeKey>('box');
  const [initialPreset, setInitialPreset] = useState('natural');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !clientName.trim()) return;

    const preset = DESIGN_PRESETS[initialPreset] || DESIGN_PRESETS.natural;

    const newBrief: BriefProject = {
      id: `brief-${Date.now()}`,
      briefNumber: nextNumber,
      clientName: clientName.trim(),
      brandName: brandName.trim(),
      packageName,
      category,
      status: 'draft',
      creatorName,
      createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
      updatedAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
      personality: {
        ekonomisMewah: 3,
        feminimMaskulin: 3,
        tradisionalModern: 3,
        simpleRumit: 3,
        monoFullcolor: 3,
        anakDewasa: 3,
        funSerius: 3
      },
      lookfeel: ['Modern', 'Fresh'],
      jenisLogo: 'Kombinasi Logogram+Logotype',
      bentukIcon: 'Geometris',
      targetMarket: {
        economy: 'Menengah Atas',
        age: 'Dewasa'
      },
      visualPhoto: {
        character: 'Normal',
        ratio: 'Square 1:1'
      },
      captionStyle: 'Santai, hangat, edukatif',
      notes: '',
      palette: [...preset.palette],
      fontDisplay: preset.fontDisplay,
      fontBody: preset.fontBody,
      keywords: [...preset.keywords],
      refImages: [],
      mockupConfig: {
        shape: initialShape,
        color: preset.palette[2] || '#C9A24B',
        scene: 'studio-light',
        logo: null,
        logoScale: 0.8,
        logoX: 0,
        logoY: -10,
        logoRot: 0,
        prodName: brandName.trim().toUpperCase(),
        prodTag: '',
        textFont: preset.fontDisplay,
        textColor: '#18181a',
        textSize: 15,
        textY: 35,
        texture: 'none',
        textureOpacity: 0.35,
        materialStyle: 'glossy',
        windowEnabled: false,
        extraImages: [],
        extraTexts: []
      },
      sceneConfig: {
        items: [
          { id: 1, shape: initialShape, color: preset.palette[2] || '#C9A24B' },
          { id: 2, shape: 'pouch', color: preset.palette[0] || '#2F3B25' },
          { id: 3, shape: 'paperbag', color: preset.palette[4] || '#EDE6D6' }
        ],
        showLogo: true,
        scene: 'studio-light'
      }
    };

    onAddBrief(newBrief);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
              <Plus size={18} />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-white">
                Buat Brief Visual Klien Baru
              </h2>
              <p className="text-xs text-slate-400">
                Nomor Dokumen: <span className="font-mono text-red-400">{nextNumber}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nama Brand / Merk Produk *</label>
            <input
              type="text"
              required
              placeholder="mis. Dawana Honey"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nama Perusahaan / Klien *</label>
            <input
              type="text"
              required
              placeholder="mis. PT Dawana Nusantara Sejahtera"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kategori Produk</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none"
              >
                <option value="Food & Beverages">Food &amp; Beverages (F&amp;B)</option>
                <option value="Snack & Retail">Snack &amp; Retail</option>
                <option value="Skincare & Cosmetics">Skincare &amp; Cosmetics</option>
                <option value="Herbal & Health">Herbal &amp; Health</option>
                <option value="Coffee & Tea">Kopi &amp; Teh</option>
                <option value="Fashion & Lifestyle">Fashion &amp; Lifestyle</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Bentuk Kemasan Awal</label>
              <select
                value={initialShape}
                onChange={(e) => setInitialShape(e.target.value as PackagingShapeKey)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none"
              >
                {(Object.keys(SHAPES) as PackagingShapeKey[]).map((sk) => (
                  <option key={sk} value={sk}>{SHAPE_LABELS[sk] || sk}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Paket Layanan obeecreatives</label>
            <select
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none"
            >
              <option value="Full Branding, Kemasan & Foto Produk">Full Branding, Kemasan &amp; Foto Produk</option>
              <option value="Desain Kemasan Saja">Desain Kemasan Saja</option>
              <option value="Desain Logo Bebas Template">Desain Logo Bebas Template</option>
              <option value="Branding + Manajemen Media Sosial">Branding + Manajemen Media Sosial</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Preset Arah Moodboard Awal</label>
            <select
              value={initialPreset}
              onChange={(e) => setInitialPreset(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none"
            >
              {Object.entries(DESIGN_PRESETS).map(([k, p]) => (
                <option key={k} value={k}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-red-600 px-5 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Mulai Susun Brief
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
