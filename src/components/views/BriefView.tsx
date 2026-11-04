import React, { useState } from 'react';
import { 
  BriefProject, 
  PersonalityScores,
  PackagingLegalAndContent 
} from '../../types';
import { PERSONALITY_PAIRS, LOOKFEEL_TAGS } from '../../data/presets';
import { 
  Download, 
  Check, 
  Sparkles, 
  Building2, 
  User, 
  FileText, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Layers,
  Scale
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { OfficialDesignBriefSheet } from '../modals/OfficialDesignBriefSheet';

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
  const [activeTab, setActiveTab] = useState<'official_doc' | 'visual_os'>('official_doc');
  const [isOfficialSheetOpen, setIsOfficialSheetOpen] = useState(false);

  const p = brief.personality;
  const spec: PackagingLegalAndContent = brief.packagingSpec || {
    talentaName: brief.creatorName || 'Adissa Rifdah Aulia',
    mentorName: 'Lalu Mahendra (obeecreatives)',
    businessName: brief.clientName || 'PT Dawana Herbal Sentosa',
    phone: '0812-9876-5432',
    productName: brief.brandName || 'Dawana Honey',
    pirtNumber: 'P-IRT 2095201010892-28',
    halalNumber: 'ID52110001892340623',
    bpomNumber: 'BPOM RI MD 867031002891',
    producedIn: 'Lombok Barat, NTB - Indonesia',
    tagline: 'Murni dari Hutan Tropis Nusantara',
    netto: '350 Gram (Net Weight)',
    nutritionFacts: 'Takaran Saji 1 sdm (15g): Energi 45 kkal, Gula 12g, Lemak 0g',
    ingredients: '100% Madu Hutan Alami (Pure Natural Honey)',
    productPhotoRef: '/public/assets/aistudio/image_246715ec.png',
    socialMedia: '@dawanahoney · www.dawanahoney.id',
    targetMarketDesc: 'Keluarga modern & profesional muda usia 25-45 tahun',
    priceRange: 'Rp 65.000 - Rp 85.000',
    labelDimensions: '19.5 cm x 7.2 cm (Full Wrap Jar Body)',
    packagingType: 'Glass Jar Hexagonal dengan Tutup Metal Gold',
    colorNotes: 'Warm Honey Gold, Forest Green, Emas Foil',
    labelMaterial: 'Stiker Vinyl Matte Waterproof + Hot Stamp Foil Emas',
    logoReadiness: 'Sudah Ada Siap Pakai',
    accDate: '2026-11-01',
    accTalentaSignature: 'Adissa Rifdah',
    accClientSignature: 'Bpk. Hendro Prayogo (Owner)'
  };

  const handleUpdatePackagingSpec = (changes: Partial<PackagingLegalAndContent>) => {
    onUpdateBrief({
      packagingSpec: {
        ...spec,
        ...changes
      }
    });
  };

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
    <div className="space-y-6">
      
      {/* Top Banner Navigation & Official Document Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-700/80 bg-slate-900 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('official_doc')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'official_doc'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Formulir Desain Brief Kemasan Resmi (Standar Dokumen)</span>
          </button>

          <button
            onClick={() => setActiveTab('visual_os')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'visual_os'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Visual Identity &amp; Personality OS</span>
          </button>
        </div>

        <button
          onClick={() => setIsOfficialSheetOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm whitespace-nowrap"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Export Format Resmi (2 Halaman)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: FORMULIR DOKUMEN BRIEF KEMASAN RESMI (MENGAKOMODASI CONTOH PDF)   */}
      {/* ========================================================================= */}
      {activeTab === 'official_doc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* HALAMAN 1: IDENTITAS, LEGALITAS & KONTEN WAJIB LABEL (6 COLS) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="p-6 rounded-2xl border border-slate-700/80 bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Halaman 1: Identitas &amp; Legalitas Produk (Design Brief)
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                  Wajib Kemasan RI
                </span>
              </div>

              {/* Talenta & Mentor */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Nama Talenta (Desainer)</label>
                  <input
                    type="text"
                    value={spec.talentaName}
                    onChange={e => handleUpdatePackagingSpec({ talentaName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Nama Mentor / Creative Lead</label>
                  <input
                    type="text"
                    value={spec.mentorName}
                    onChange={e => handleUpdatePackagingSpec({ mentorName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Data Klien & Usaha */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nama Client</label>
                    <input
                      type="text"
                      value={spec.businessName}
                      onChange={e => {
                        handleUpdatePackagingSpec({ businessName: e.target.value });
                        onUpdateBrief({ clientName: e.target.value });
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Telepon / WhatsApp (TLP)</label>
                    <input
                      type="text"
                      value={spec.phone}
                      onChange={e => handleUpdatePackagingSpec({ phone: e.target.value })}
                      placeholder="0812-..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nama Usaha / Perusahaan</label>
                    <input
                      type="text"
                      value={spec.businessName}
                      onChange={e => handleUpdatePackagingSpec({ businessName: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nama Produk</label>
                    <input
                      type="text"
                      value={spec.productName}
                      onChange={e => {
                        handleUpdatePackagingSpec({ productName: e.target.value });
                        onUpdateBrief({ brandName: e.target.value });
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Nomor Izin Edar & Legalitas */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Legalitas Izin Edar Kemasan
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">No. P-IRT</label>
                    <input
                      type="text"
                      value={spec.pirtNumber}
                      onChange={e => handleUpdatePackagingSpec({ pirtNumber: e.target.value })}
                      placeholder="P-IRT ..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">No. HALAL</label>
                    <input
                      type="text"
                      value={spec.halalNumber}
                      onChange={e => handleUpdatePackagingSpec({ halalNumber: e.target.value })}
                      placeholder="ID..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">No. BPOM</label>
                    <input
                      type="text"
                      value={spec.bpomNumber}
                      onChange={e => handleUpdatePackagingSpec({ bpomNumber: e.target.value })}
                      placeholder="BPOM MD..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Diproduksi Di (Lokasi Pabrik)</label>
                  <input
                    type="text"
                    value={spec.producedIn}
                    onChange={e => handleUpdatePackagingSpec({ producedIn: e.target.value })}
                    placeholder="Kota, Provinsi - Indonesia"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Konten Teks Kemasan */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  Konten Informasi Label Wajib
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tag Line Produk</label>
                    <input
                      type="text"
                      value={spec.tagline}
                      onChange={e => handleUpdatePackagingSpec({ tagline: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Isi Bersih (Netto / Gramatur)</label>
                    <input
                      type="text"
                      value={spec.netto}
                      onChange={e => handleUpdatePackagingSpec({ netto: e.target.value })}
                      placeholder="misal: 250g / 500ml"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Informasi Nilai Gizi (Nutrition Facts)</label>
                  <input
                    type="text"
                    value={spec.nutritionFacts}
                    onChange={e => handleUpdatePackagingSpec({ nutritionFacts: e.target.value })}
                    placeholder="Takaran saji, energi, lemak, protein, natrium..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Komposisi Bahan (Ingredients)</label>
                  <textarea
                    rows={2}
                    value={spec.ingredients}
                    onChange={e => handleUpdatePackagingSpec({ ingredients: e.target.value })}
                    placeholder="Bahan utama, rempah, pengawet alami, alergen..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Foto Produk (Acuan / Link)</label>
                    <input
                      type="text"
                      value={spec.productPhotoRef}
                      onChange={e => handleUpdatePackagingSpec({ productPhotoRef: e.target.value })}
                      placeholder="Link file foto atau deskripsi..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Akun Sosial Media &amp; Kontak (Sosmed)</label>
                    <input
                      type="text"
                      value={spec.socialMedia}
                      onChange={e => handleUpdatePackagingSpec({ socialMedia: e.target.value })}
                      placeholder="@brand · www.brand.com"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HALAMAN 2: SPESIFIKASI FISIK, PERSONALITY & APPROVAL ACC (6 COLS) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="p-6 rounded-2xl border border-slate-700/80 bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Halaman 2: Spesifikasi Fisik &amp; Approval (Visual Desain)
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  ACC &amp; Cetak
                </span>
              </div>

              {/* Strip Persetujuan ACC */}
              <div className="p-3 rounded-xl border border-slate-700 bg-slate-800/60 space-y-2">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                  Strip Verifikasi Persetujuan (ACC Cetak)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">ACC Tanggal</label>
                    <input
                      type="date"
                      value={spec.accDate || ''}
                      onChange={e => handleUpdatePackagingSpec({ accDate: e.target.value })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Talenta (Ttd/Nama)</label>
                    <input
                      type="text"
                      value={spec.accTalentaSignature || ''}
                      onChange={e => handleUpdatePackagingSpec({ accTalentaSignature: e.target.value })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Klient (Ttd/Nama)</label>
                    <input
                      type="text"
                      value={spec.accClientSignature || ''}
                      onChange={e => handleUpdatePackagingSpec({ accClientSignature: e.target.value })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Fisik Labeling & Kemasan */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Target Pasar</label>
                  <input
                    type="text"
                    value={spec.targetMarketDesc}
                    onChange={e => handleUpdatePackagingSpec({ targetMarketDesc: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Range Harga Produk</label>
                    <input
                      type="text"
                      value={spec.priceRange}
                      onChange={e => handleUpdatePackagingSpec({ priceRange: e.target.value })}
                      placeholder="Rp ... - Rp ..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Ukuran Labeling (P x L x T)</label>
                    <input
                      type="text"
                      value={spec.labelDimensions}
                      onChange={e => handleUpdatePackagingSpec({ labelDimensions: e.target.value })}
                      placeholder="misal: 19.5 x 7 cm"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Jenis Kemasan</label>
                    <input
                      type="text"
                      value={spec.packagingType}
                      onChange={e => handleUpdatePackagingSpec({ packagingType: e.target.value })}
                      placeholder="Botol, Jar, Standing Pouch..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Bahan Labeling</label>
                    <input
                      type="text"
                      value={spec.labelMaterial}
                      onChange={e => handleUpdatePackagingSpec({ labelMaterial: e.target.value })}
                      placeholder="Stiker Vinyl, Kraft, Metalized..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Warna / Preferensi Palette</label>
                    <input
                      type="text"
                      value={spec.colorNotes}
                      onChange={e => handleUpdatePackagingSpec({ colorNotes: e.target.value })}
                      placeholder="Warm Honey Gold, Emas Foil..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Ketersediaan Logo</label>
                    <select
                      value={spec.logoReadiness}
                      onChange={e => handleUpdatePackagingSpec({ logoReadiness: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Sudah Ada Siap Pakai">Sudah Ada Siap Pakai</option>
                      <option value="Perlu Redesign">Perlu Redesign</option>
                      <option value="Belum Ada (Dibuatkan Baru)">Belum Ada (Dibuatkan Baru)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Action Preview Official PDF */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Data otomatis tersinkronisasi ke layout cetak resmi 2 halaman.
                </span>
                <button
                  onClick={() => setIsOfficialSheetOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Lihat Lembar ACC</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: VISUAL IDENTITY & PERSONALITY OS (LAYOUT INTERAKTIF 3 KOLOM ASLI) */}
      {/* ========================================================================= */}
      {activeTab === 'visual_os' && (
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

              {/* Section 03: Palet Warna */}
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="text-red-600 font-mono text-xs font-bold">03</span>
                    Palet Warna Visual
                  </h3>
                  <span className="text-[10px] text-slate-400">5 Hex Swatches</span>
                </div>

                <div className="grid grid-cols-5 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {brief.palette.map((hex, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-full aspect-square rounded-lg shadow-sm border border-black/10" style={{ backgroundColor: hex }} />
                      <span className="text-[10px] font-mono mt-1 text-slate-600">{hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (3 cols): Tips & Ringkasan */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm space-y-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Ringkasan Spesifikasi Fisik
              </div>
              <ul className="text-xs space-y-2 text-slate-300">
                <li>• Jenis Kemasan: <strong className="text-white">{spec.packagingType}</strong></li>
                <li>• Ukuran Label: <strong className="text-white font-mono">{spec.labelDimensions}</strong></li>
                <li>• Bahan Label: <strong className="text-white">{spec.labelMaterial}</strong></li>
                <li>• Izin Edar P-IRT: <strong className="text-white font-mono">{spec.pirtNumber}</strong></li>
                <li>• Sertifikat Halal: <strong className="text-white font-mono">{spec.halalNumber}</strong></li>
                <li>• No. BPOM: <strong className="text-white font-mono">{spec.bpomNumber}</strong></li>
              </ul>
              <button
                onClick={() => setIsOfficialSheetOpen(true)}
                className="w-full mt-2 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Buka Lembar Cetak ACC</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* MODAL PRINT RESMI 2 HALAMAN (PERSIS SEPERTI CONTOH PDF) */}
      <OfficialDesignBriefSheet
        isOpen={isOfficialSheetOpen}
        onClose={() => setIsOfficialSheetOpen(false)}
        brief={brief}
      />

    </div>
  );
};
