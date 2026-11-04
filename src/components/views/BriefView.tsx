import React from 'react';
import { 
  BriefProject, 
  PersonalityScores 
} from '../../types';
import { PERSONALITY_PAIRS, LOOKFEEL_TAGS } from '../../data/presets';
import { Download, Check, Sparkles, Building2, User } from 'lucide-react';
import html2canvas from 'html2canvas';

interface BriefViewProps {
  brief: BriefProject;
  onUpdateBrief: (updated: Partial<BriefProject>) => void;
  theme: 'dark' | 'light';
}

export const BriefView: React.FC<BriefViewProps> = ({
  brief,
  onUpdateBrief,
  theme
}) => {
  const p = brief.personality;

  const handlePersonalityChange = (key: keyof PersonalityScores, val: number) => {
    onUpdateBrief({
      personality: {
        ...brief.personality,
        [key]: val
      }
    });
  };

  const toggleLookFeel = (tag: string) => {
    const current = brief.lookfeel || [];
    const exists = current.includes(tag);
    const updated = exists ? current.filter(t => t !== tag) : [...current, tag];
    onUpdateBrief({ lookfeel: updated });
  };

  const exportBriefPng = async () => {
    const el = document.getElementById('briefPrintableCard');
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2 });
      const link = document.createElement('a');
      link.download = `obeecreatives-Brief-${(brief.brandName || 'Brand').replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export PNG failed', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      
      {/* Left Column (3 cols): Info Produk & 7 Personality Sliders */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* Info Brand Card */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Info Proyek Klien</span>
            <Building2 size={13} className="text-red-400" />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Nama Brand / Produk</label>
              <input
                type="text"
                value={brief.brandName}
                onChange={e => onUpdateBrief({ brandName: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Nama Klien / Perusahaan</label>
              <input
                type="text"
                value={brief.clientName}
                onChange={e => onUpdateBrief({ clientName: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Kategori</label>
                <input
                  type="text"
                  value={brief.category}
                  onChange={e => onUpdateBrief({ category: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">No. Brief</label>
                <input
                  type="text"
                  readOnly
                  value={brief.briefNumber}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-400 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 7 Personality Sliders */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Personality Produk (1 - 5)</span>
            <span className="text-red-400 font-mono text-xs">7 Sumbu</span>
          </div>

          <div className="space-y-4">
            {PERSONALITY_PAIRS.map(pair => {
              const val = p[pair.key];
              return (
                <div key={pair.key} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-medium text-slate-300">
                    <span className={val <= 2 ? 'text-red-400 font-bold' : ''}>{pair.left.split(' / ')[0]}</span>
                    <span className="text-[10px] text-slate-400 font-mono">[{val}]</span>
                    <span className={val >= 4 ? 'text-red-400 font-bold' : ''}>{pair.right.split(' / ')[0]}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={val}
                    onChange={e => handlePersonalityChange(pair.key, parseInt(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Center Column (6 cols): Printable Brief Visual Identity Board */}
      <div className="lg:col-span-6 space-y-3">
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">LIVE BRIEF PRESENTATION CARD</span>
          <button
            onClick={exportBriefPng}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            <Download size={13} className="text-red-400" />
            <span>Unduh Brief (PNG)</span>
          </button>
        </div>

        {/* The Card - Clean Executive Aesthetic */}
        <div 
          id="briefPrintableCard"
          className="rounded-2xl border border-slate-200 bg-white p-7 text-slate-900 shadow-xl min-h-[640px]"
        >
          {/* Board Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-5">
            <div>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest font-mono">
                OBEECREATIVES • CREATIVE BRIEF
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-950 mt-0.5">
                {brief.brandName || 'Nama Brand Belum Diisi'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {brief.clientName} • {brief.category} • Ref: {brief.briefNumber}
              </p>
            </div>
            <div className="text-right">
              <span className="font-display font-bold text-sm tracking-tight text-slate-900">
                obee<span className="text-red-600">creatives</span>
              </span>
              <p className="text-[9px] uppercase tracking-wider text-slate-400">
                Visual Identity OS
              </p>
            </div>
          </div>

          {/* Section 01: Personality Produk */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="text-red-600 font-mono text-xs font-bold">01</span>
                Personality Brand &amp; Produk
              </h3>
              <span className="text-[10px] text-slate-400">Skor Bipolar 1 - 5</span>
            </div>

            <div className="space-y-2.5 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              {PERSONALITY_PAIRS.map(pair => {
                const val = p[pair.key];
                const pct = ((val - 1) / 4) * 100;
                return (
                  <div key={pair.key} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-800">
                      <span>{pair.left}</span>
                      <span>{pair.right}</span>
                    </div>
                    <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 bottom-0 left-0 bg-red-600 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(8, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 02: Logo Look & Feel */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="text-red-600 font-mono text-xs font-bold">02</span>
                Logo Look &amp; Feel
              </h3>
              <span className="text-[10px] text-slate-400">Kesan Visual Utama</span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
              {LOOKFEEL_TAGS.map(tag => {
                const isSelected = (brief.lookfeel || []).includes(tag);
                return (
                  <span
                    key={tag}
                    className={`rounded-full px-3 py-1 text-xs transition ${
                      isSelected
                        ? 'bg-slate-950 text-white font-bold shadow-sm'
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Section 03: Arahan Logo & Palet Warna */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="text-red-600 font-mono text-xs font-bold">03</span>
                Arahan Logo &amp; Palet Warna
              </h3>
              <span className="text-[10px] text-slate-400">Filosofi &amp; Swatches</span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <p className="text-slate-400 text-[10px]">Jenis Eksekusi Logo:</p>
                <p className="font-semibold text-slate-800">{brief.jenisLogo}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Bentuk Icon / Lambang:</p>
                <p className="font-semibold text-slate-800">{brief.bentukIcon}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Pasangan Font:</p>
                <p className="font-semibold text-slate-800">{brief.fontDisplay} / {brief.fontBody}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Palet Warna Utama:</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {brief.palette.map((hex, i) => (
                    <span 
                      key={i} 
                      className="h-4 w-4 rounded-full border border-black/10 shadow-inner" 
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 04: Target Pasar & Acuan Fotografi Produk */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="text-red-600 font-mono text-xs font-bold">04</span>
                Target Pasar &amp; Acuan Fotografi (obee Studio)
              </h3>
              <span className="text-[10px] text-slate-400">Pedoman Tim Foto</span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <p className="text-slate-400 text-[10px]">Kelas Ekonomi:</p>
                <p className="font-semibold text-slate-800">{brief.targetMarket.economy}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Target Usia:</p>
                <p className="font-semibold text-slate-800">{brief.targetMarket.age}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Pencahayaan Foto Produk:</p>
                <p className="font-semibold text-slate-800">{brief.visualPhoto.character}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Rasio Gambar Kebutuhan:</p>
                <p className="font-semibold text-slate-800">{brief.visualPhoto.ratio}</p>
              </div>
            </div>
          </div>

          {/* Section 05: Gaya Caption & Catatan Khusus */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="text-red-600 font-mono text-xs font-bold">05</span>
                Gaya Komunikasi &amp; Catatan Khusus
              </h3>
              <span className="text-[10px] text-slate-400">Tone of Voice</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Gaya Caption:</span>
                <p className="text-slate-700 italic">"{brief.captionStyle || 'Belum diatur'}"</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Catatan Tambahan &amp; Larangan:</span>
                <p className="text-slate-800 whitespace-pre-wrap">{brief.notes || 'Tidak ada catatan tambahan.'}</p>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-mono">
            <span>Diverifikasi oleh: {brief.verifiedBy || brief.creatorName || 'obeecreatives Team'}</span>
            <span>All Rights Reserved • obeecreatives 2026</span>
          </div>
        </div>

      </div>

      {/* Right Column (3 cols): Arahan Teknis Logo, Segmentasi, & Fotografi */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* Logo Look & Feel Selector */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Logo Look &amp; Feel</span>
            <span className="text-red-400 text-xs font-mono">{brief.lookfeel?.length || 0} Terpilih</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {LOOKFEEL_TAGS.map(tag => {
              const isSelected = (brief.lookfeel || []).includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleLookFeel(tag)}
                  className={`rounded-full px-2.5 py-1 text-xs transition ${
                    isSelected
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Arahan Teknis Logo */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Arah Eksekusi Logo
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Jenis Logo</label>
            <select
              value={brief.jenisLogo}
              onChange={e => onUpdateBrief({ jenisLogo: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="Kombinasi Logogram+Logotype">Kombinasi Logogram + Logotype</option>
              <option value="Logotype Dinamis">Logotype Dinamis (Tipografi Kustom)</option>
              <option value="Logogram / Simbol Abstrak">Logogram / Simbol Abstrak</option>
              <option value="Emblem / Badge Klasik">Emblem / Badge Klasik</option>
              <option value="Monogram Inisial Minimalis">Monogram Inisial Minimalis</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Bentuk Icon / Lambang</label>
            <select
              value={brief.bentukIcon}
              onChange={e => onUpdateBrief({ bentukIcon: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="Geometris & Presisi">Geometris &amp; Presisi</option>
              <option value="Organik & Dinamis">Organik &amp; Dinamis</option>
              <option value="Maskot / Karakter Brand">Maskot / Karakter Brand</option>
              <option value="Inisial / Monogram">Inisial / Monogram</option>
              <option value="Custom Hand-Drawn">Custom Hand-Drawn</option>
            </select>
          </div>
        </div>

        {/* Target Pasar */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Target Pasar &amp; Demografi
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Kelas Ekonomi</label>
            <select
              value={brief.targetMarket.economy}
              onChange={e => onUpdateBrief({ targetMarket: { ...brief.targetMarket, economy: e.target.value as any } })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="Menengah Bawah">Menengah Bawah (Mass Market)</option>
              <option value="Menengah Atas">Menengah Atas (Affluent)</option>
              <option value="Premium / Luxury">Premium / Luxury (High End)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Rentang Usia</label>
            <select
              value={brief.targetMarket.age}
              onChange={e => onUpdateBrief({ targetMarket: { ...brief.targetMarket, age: e.target.value as any } })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="Anak-anak">Anak-anak (Kids)</option>
              <option value="Remaja">Remaja &amp; Gen Z</option>
              <option value="Dewasa">Dewasa / Milenial Mapan</option>
              <option value="Semua Usia">Semua Usia (Family)</option>
            </select>
          </div>
        </div>

        {/* Acuan Fotografi Produk */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
            <span>Pedoman Foto Produk</span>
            <span className="text-red-400 text-[10px]">Studio Acuan</span>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Pencahayaan Studio</label>
            <select
              value={brief.visualPhoto.character}
              onChange={e => onUpdateBrief({ visualPhoto: { ...brief.visualPhoto, character: e.target.value as any } })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="Normal">Normal Studio Lighting</option>
              <option value="High Key">High Key (Terang, Bersih, Modern)</option>
              <option value="Low Key">Low Key (Gelap, Misterius, Mewah)</option>
              <option value="Moody / Dramatic">Moody / Dramatic Shadow</option>
              <option value="Clean Minimalist">Clean Minimalist White</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Rasio Kebutuhan Media</label>
            <select
              value={brief.visualPhoto.ratio}
              onChange={e => onUpdateBrief({ visualPhoto: { ...brief.visualPhoto, ratio: e.target.value as any } })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="Square 1:1">Square 1:1 (Instagram Feed / Katalog)</option>
              <option value="Story / Reels 9:16">Story / Reels 9:16 (TikTok & IG Story)</option>
              <option value="Potrait 4:3">Potrait 4:3 (E-commerce Marketplace)</option>
              <option value="Landscape 16:9">Landscape 16:9 (Website Header / YouTube)</option>
            </select>
          </div>
        </div>

        {/* Gaya Caption & Catatan */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Tone of Voice &amp; Catatan
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Gaya Caption</label>
            <input
              type="text"
              value={brief.captionStyle}
              onChange={e => onUpdateBrief({ captionStyle: e.target.value })}
              placeholder="mis. santai, hangat, edukatif, banyak emoji"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Catatan Tambahan</label>
            <textarea
              rows={3}
              value={brief.notes}
              onChange={e => onUpdateBrief({ notes: e.target.value })}
              placeholder="Catatan kompetitor, filosofi khusus, larangan warna..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
