import React, { useState } from 'react';
import { 
  BriefProject 
} from '../../types';
import { PRESETS } from '../../data/presets';
import { hexToHSL, generatePalette } from '../../data/shapes';
import { 
  Palette, 
  Type, 
  Sparkles, 
  Upload, 
  Trash2, 
  Plus, 
  Download, 
  Image as ImageIcon 
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface MoodboardViewProps {
  brief: BriefProject;
  onUpdateBrief: (updated: Partial<BriefProject>) => void;
  theme: 'dark' | 'light';
}

export const MoodboardView: React.FC<MoodboardViewProps> = ({
  brief,
  onUpdateBrief,
  theme
}) => {
  const [seedColor, setSeedColor] = useState(brief.palette[2] || '#e31e2b');
  const [selectedScheme, setSelectedScheme] = useState<'analog' | 'complement' | 'mono'>('analog');
  const [newKeyword, setNewKeyword] = useState('');

  const applyPreset = (key: string) => {
    const p = PRESETS[key];
    if (!p) return;
    onUpdateBrief({
      palette: [...p.palette],
      fontDisplay: p.fontDisplay,
      fontBody: p.fontBody,
      keywords: [...p.keywords],
      mockupConfig: {
        ...brief.mockupConfig,
        color: p.palette[3] || p.palette[1]
      }
    });
  };

  const handleApplyCustomPalette = () => {
    const generated = generatePalette(seedColor, selectedScheme);
    onUpdateBrief({
      palette: generated,
      mockupConfig: {
        ...brief.mockupConfig,
        color: generated[3] || generated[1]
      }
    });
  };

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newKeyword.trim()) {
      e.preventDefault();
      const updated = [...(brief.keywords || []), newKeyword.trim()];
      onUpdateBrief({ keywords: updated });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const updated = (brief.keywords || []).filter((_, i) => i !== index);
    onUpdateBrief({ keywords: updated });
  };

  const handleUploadRefImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const current = brief.refImages || [];
          onUpdateBrief({ refImages: [...current, event.target.result as string] });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveRefImage = (index: number) => {
    const updated = (brief.refImages || []).filter((_, i) => i !== index);
    onUpdateBrief({ refImages: updated });
  };

  const exportMoodboardPng = async () => {
    const el = document.getElementById('moodboardPrintableCard');
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2 });
      const link = document.createElement('a');
      link.download = `obeecreatives-Moodboard-${(brief.brandName || 'Brand').replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export Moodboard PNG failed', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      
      {/* Left Column (3 cols): Presets & Custom Palette Generator */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* Preset Arah Desain */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Preset Arah Desain</span>
            <Sparkles size={13} className="text-red-400" />
          </div>

          <div className="space-y-1.5">
            {Object.entries(PRESETS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-left text-xs text-slate-200 hover:border-red-500 hover:bg-slate-700 transition"
              >
                <span className="font-semibold">{p.label}</span>
                <div className="flex items-center gap-1">
                  {p.palette.slice(0, 4).map((hex, i) => (
                    <span
                      key={i}
                      className="h-2.5 w-2.5 rounded-full border border-black/20"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Palette Generator */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Harmoni Palet Warna Kustom
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Pilih Warna Dasar (Seed Color)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={seedColor}
                onChange={e => setSeedColor(e.target.value)}
                className="h-10 w-14 rounded-xl border border-slate-700 bg-slate-800 p-1 cursor-pointer"
              />
              <input
                type="text"
                value={seedColor.toUpperCase()}
                onChange={e => setSeedColor(e.target.value)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Skema Harmoni</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['analog', 'complement', 'mono'] as const).map(sch => (
                <button
                  key={sch}
                  type="button"
                  onClick={() => setSelectedScheme(sch)}
                  className={`rounded-lg py-1.5 text-[11px] font-semibold capitalize border transition ${
                    selectedScheme === sch
                      ? 'border-red-500 bg-red-600 text-white'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {sch === 'analog' ? 'Analog' : sch === 'complement' ? 'Komplemen' : 'Monokrom'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleApplyCustomPalette}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 hover:border-slate-600 transition"
          >
            Terapkan Palet Kustom
          </button>
        </div>

        {/* Tipografi Settings */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
            <span>Pilihan Tipografi</span>
            <Type size={13} className="text-red-400" />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Font Display / Judul</label>
            <select
              value={brief.fontDisplay}
              onChange={e => onUpdateBrief({ fontDisplay: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="Space Grotesk">Space Grotesk (Modern Bold)</option>
              <option value="Inter">Inter (Clean Sans)</option>
              <option value="JetBrains Mono">JetBrains Mono (Technical / Industrial)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Font Body / Keterangan</label>
            <select
              value={brief.fontBody}
              onChange={e => onUpdateBrief({ fontBody: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="Inter">Inter (Neutral Legible)</option>
              <option value="Space Grotesk">Space Grotesk</option>
              <option value="JetBrains Mono">JetBrains Mono (Editorial Code)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Center Column (6 cols): Printable Moodboard Card */}
      <div className="lg:col-span-6 space-y-3">
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">LIVE MOODBOARD CARD</span>
          <button
            onClick={exportMoodboardPng}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            <Download size={13} className="text-red-400" />
            <span>Unduh Moodboard (PNG)</span>
          </button>
        </div>

        {/* The Printable Board */}
        <div 
          id="moodboardPrintableCard"
          className="rounded-2xl border border-slate-200 bg-white p-7 text-slate-900 shadow-xl min-h-[640px]"
        >
          {/* Board Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-5">
            <div>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest font-mono">
                OBEECREATIVES • MOOD &amp; COLOR SYSTEM
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-950 mt-0.5">
                {brief.brandName || 'Brand Visual Moodboard'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Acuan Harmoni Warna, Pasangan Huruf &amp; Referensi Visual
              </p>
            </div>
            <div className="text-right">
              <span className="font-display font-bold text-sm tracking-tight text-slate-900">
                obee<span className="text-red-600">creatives</span>
              </span>
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                PALETTE SHEET
              </p>
            </div>
          </div>

          {/* Section 01: Palet Warna Swatches */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="text-red-600 font-mono text-xs font-bold">01</span>
                Palet Warna Acuan Kemasan &amp; Identitas
              </h3>
              <span className="text-[10px] text-slate-400">HEX &amp; HSL Specs</span>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {brief.palette.map((hex, idx) => {
                const [h, s, l] = hexToHSL(hex);
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div 
                      className="w-full h-20 rounded-xl shadow-md border border-black/10 relative overflow-hidden group"
                      style={{ backgroundColor: hex }}
                    >
                      {/* Subtle glossy dot in center */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-white/40 border border-black/10" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-900 mt-2">
                      {hex.toUpperCase()}
                    </span>
                    <span className="font-mono text-[9px] text-slate-400">
                      H{h} S{s} L{l}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 02: Tipografi Pasangan Huruf */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="text-red-600 font-mono text-xs font-bold">02</span>
                Pasangan Tipografi (Font Pairing)
              </h3>
              <span className="text-[10px] text-slate-400">Display vs Body</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-1">
              <p 
                className="text-2xl font-bold text-slate-900"
                style={{ fontFamily: brief.fontDisplay }}
              >
                Aa Bb Cc — {brief.brandName || 'Judul Kemasan Produk'}
              </p>
              <p 
                className="text-xs text-slate-600"
                style={{ fontFamily: brief.fontBody }}
              >
                Komposisi bahan, informasi gizi, netto 250g, dan deskripsi manfaat produk tertulis secara rapi ({brief.fontBody}).
              </p>
            </div>
          </div>

          {/* Section 03: Mood & Tone Kata Kunci */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="text-red-600 font-mono text-xs font-bold">03</span>
                Kata Kunci Suasana Visual (Mood &amp; Tone)
              </h3>
              <span className="text-[10px] text-slate-400">{brief.keywords?.length || 0} Karakter</span>
            </div>

            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              {(brief.keywords || []).map((k, i) => (
                <span
                  key={i}
                  className="rounded-full bg-white border border-slate-200 px-3 py-1 font-mono text-xs text-slate-800 shadow-2xs"
                >
                  #{k}
                </span>
              ))}
            </div>
          </div>

          {/* Section 04: Papan Referensi Visual Pinboard */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="text-red-600 font-mono text-xs font-bold">04</span>
                Papan Referensi Visual (Pinboard)
              </h3>
              <span className="text-[10px] text-slate-400">Inspirasi Mood &amp; Styling</span>
            </div>

            <div 
              className="rounded-2xl p-5 min-h-[200px] flex flex-wrap gap-4 items-center justify-start border border-slate-200"
              style={{
                backgroundColor: '#f1f0ea',
                backgroundImage: 'radial-gradient(#d5d4cb 1.5px, transparent 1.5px)',
                backgroundSize: '16px 16px'
              }}
            >
              {(brief.refImages || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full py-8 text-center text-slate-500">
                  <ImageIcon size={28} className="text-slate-400 mb-2" />
                  <p className="text-xs font-medium">Belum ada gambar referensi visual yang diunggah</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Unggah foto referensi di panel kanan untuk melengkapi moodboard klien.</p>
                </div>
              ) : (
                (brief.refImages || []).map((src, i) => {
                  const rotations = ['-rotate-2', 'rotate-2', '-rotate-1', 'rotate-1', '-rotate-3'];
                  const rot = rotations[i % rotations.length];
                  return (
                    <div
                      key={i}
                      className={`relative w-28 bg-white p-2 shadow-lg rounded-sm ${rot} hover:rotate-0 hover:scale-105 transition-all group`}
                    >
                      {/* Red Pin Header */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-red-600 shadow-md border border-white" />
                      
                      <button
                        onClick={() => handleRemoveRefImage(i)}
                        className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition"
                        title="Hapus gambar"
                      >
                        ✕
                      </button>

                      <div className="h-24 w-full bg-slate-100 overflow-hidden rounded-xs">
                        <img src={src} alt={`Ref ${i}`} className="h-full w-full object-cover" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Card Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-mono">
            <span>Diverifikasi oleh: {brief.verifiedBy || 'obeecreatives Lead'}</span>
            <span>All Rights Reserved • obeecreatives 2026</span>
          </div>
        </div>

      </div>

      {/* Right Column (3 cols): Keywords Editor & Photo Reference Uploader */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* Keywords Editor */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
            <span>Kata Kunci Mood</span>
            <span className="text-red-400 text-xs font-mono">{brief.keywords?.length || 0}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(brief.keywords || []).map((k, i) => (
              <span
                key={i}
                className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
              >
                <span>{k}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(i)}
                  className="text-slate-400 hover:text-red-400"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <input
            type="text"
            value={newKeyword}
            onChange={e => setNewKeyword(e.target.value)}
            onKeyDown={handleAddKeyword}
            placeholder="+ Tambah kata kunci, tekan Enter"
            className="w-full rounded-xl border border-dashed border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
          />
        </div>

        {/* Upload Foto Referensi */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
            <span>Upload Foto Referensi</span>
            <Upload size={13} className="text-red-400" />
          </div>

          <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 hover:border-red-500 bg-slate-800/50 p-6 text-center cursor-pointer transition">
            <Upload size={22} className="text-slate-400 mb-2" />
            <span className="text-xs font-semibold text-slate-200">+ Pilih Gambar Referensi</span>
            <span className="text-[10px] text-slate-500 mt-1">Mendukung multi-file PNG/JPG</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUploadRefImages}
              className="hidden"
            />
          </label>

          {(brief.refImages || []).length > 0 && (
            <div className="text-right">
              <button
                onClick={() => onUpdateBrief({ refImages: [] })}
                className="text-[11px] text-red-400 hover:underline"
              >
                Bersihkan Semua Foto
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
