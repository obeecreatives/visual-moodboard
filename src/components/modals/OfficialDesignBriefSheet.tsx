import React from 'react';
import { BriefProject, PackagingLegalAndContent } from '../../types';
import { Printer, Download, X } from 'lucide-react';

interface OfficialDesignBriefSheetProps {
  isOpen: boolean;
  onClose: () => void;
  brief: BriefProject;
}

export const OfficialDesignBriefSheet: React.FC<OfficialDesignBriefSheetProps> = ({
  isOpen,
  onClose,
  brief
}) => {
  if (!isOpen) return null;

  const spec: PackagingLegalAndContent = brief.packagingSpec || {
    talentaName: brief.creatorName || 'Aldrien Andriansyah',
    mentorName: 'Lalu Mahendra (obeecreatives)',
    businessName: brief.clientName || 'CV Usaha Bersama',
    phone: '0812-3456-7890',
    productName: brief.brandName || 'Nama Produk',
    pirtNumber: 'P-IRT 2095201010892-28',
    halalNumber: 'ID52110001892340623',
    bpomNumber: 'BPOM RI MD 867031002891',
    producedIn: 'Lombok, Nusa Tenggara Barat - Indonesia',
    tagline: 'Murni dari Hutan Alami Tropis',
    netto: '350 Gram (Netto)',
    nutritionFacts: 'Takaran Saji 1 sdm (15g): Energi 45 kkal, Gula Alami 12g, Lemak 0g',
    ingredients: '100% Madu Hutan Alami (Pure Natural Honey)',
    productPhotoRef: 'Foto jar botol kaca madu 350g dengan sendok kayu tetesan',
    socialMedia: '@dawanahoney · www.dawana.id',
    targetMarketDesc: 'Keluarga modern & konsumen peduli kesehatan alami usia 25-45 tahun',
    priceRange: 'Rp 65.000 - Rp 85.000',
    labelDimensions: '19.5 cm x 7.2 cm (Full Wrap Body)',
    packagingType: 'Glass Jar Hexagonal dengan Tutup Metal Gold',
    colorNotes: 'Warm Honey Gold, Forest Green, Emas Foil',
    labelMaterial: 'Stiker Vinyl Matte Waterproof + Hot Stamp Foil Emas',
    logoReadiness: 'Sudah Ada Siap Pakai',
    accDate: '2026-11-04',
    accTalentaSignature: 'Aldrien A.',
    accClientSignature: 'Bpk. Hendro (Owner)'
  };

  const p = brief.personality;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      {/* Container */}
      <div className="w-full max-w-5xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:rounded-none print:bg-white print:max-w-none">
        
        {/* Modal Top Bar (Hidden when printed) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-slate-950 border-b border-slate-800 gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shrink-0">
              Format Resmi 2 Hal
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-white truncate">
              Preview: Design Brief &amp; Visual Desain Kemasan
            </h3>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              aria-label="Tutup Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="p-2 sm:p-6 md:p-8 space-y-8 max-h-[85vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 print:space-y-0">
          
          {/* Mobile swipe hint banner */}
          <div className="md:hidden flex items-center gap-2 p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[11px] leading-tight">
            <span>💡</span>
            <span>Mode Layar Kecil: Geser ke samping (swipe) untuk memeriksa detail formulir standar 2 halaman tanpa terpotong.</span>
          </div>

          {/* ========================================================= */}
          {/* HALAMAN 1: DESIGN BRIEF - DESAIN KEMASAN                 */}
          {/* ========================================================= */}
          <div className="w-full overflow-x-auto pb-2 print:overflow-visible">
            <div 
              id="official-brief-page-1"
              className="min-w-[680px] md:min-w-0 w-full aspect-[1.414/1] bg-[#eef2f6] text-[#0f172a] p-6 sm:p-10 md:p-12 flex flex-col justify-between shadow-xl rounded-xl border border-slate-300 print:shadow-none print:rounded-none print:border-none print:aspect-auto print:min-h-screen print:page-break-after"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
            {/* Top Bar Section */}
            <div className="flex items-start justify-between gap-6 pb-6 border-b border-slate-300">
              {/* Talenta & Mentor Block */}
              <div className="w-3/5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-36 py-1.5 px-3 bg-[#1e2b58] text-white text-[11px] font-bold uppercase tracking-wider text-center shrink-0 shadow-xs">
                    NAMA TALENTA
                  </div>
                  <div className="flex-1 border-b-2 border-[#1e2b58] text-xs font-semibold text-[#1e2b58] px-2 py-0.5 truncate">
                    {spec.talentaName || brief.creatorName || '-'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-36 py-1.5 px-3 bg-[#1e2b58] text-white text-[11px] font-bold uppercase tracking-wider text-center shrink-0 shadow-xs">
                    NAMA MENTOR
                  </div>
                  <div className="flex-1 border-b-2 border-[#1e2b58] text-xs font-semibold text-[#1e2b58] px-2 py-0.5 truncate">
                    {spec.mentorName || 'Lalu Mahendra (obeecreatives)'}
                  </div>
                </div>
              </div>

              {/* Title Header Badge */}
              <div className="bg-[#1e2b58] text-white px-8 py-3.5 rounded-l-2xl shadow-md text-right">
                <h1 className="text-2xl font-black tracking-tight leading-none uppercase">
                  DESIGN BRIEF
                </h1>
                <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase mt-1">
                  DESAIN KEMASAN
                </h2>
              </div>
            </div>

            {/* Main Form Rows (14 Fields) */}
            <div className="grid grid-cols-1 gap-2.5 my-4">
              {[
                { label: 'NAMA CLIENT', value: spec.businessName || brief.clientName },
                { label: 'TLP', value: spec.phone },
                { label: 'NAMA USAHA', value: spec.businessName || brief.clientName },
                { label: 'NAMA PRODUK', value: spec.productName || brief.brandName },
                { label: 'P-IRT', value: spec.pirtNumber },
                { label: 'HALAL', value: spec.halalNumber },
                { label: 'BPOM', value: spec.bpomNumber },
                { label: 'DIPRODUKSI DI', value: spec.producedIn },
                { label: 'TAG LINE', value: spec.tagline },
                { label: 'ISI BERSIH', value: spec.netto },
                { label: 'INFORMASI GIZI', value: spec.nutritionFacts },
                { label: 'KOMPOSISI', value: spec.ingredients },
                { label: 'FOTO PRODUK', value: spec.productPhotoRef },
                { label: 'SOSMED', value: spec.socialMedia }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-40 py-1 px-3 bg-[#1e2b58] text-white text-[10px] font-bold uppercase tracking-wider text-center shrink-0 shadow-xs">
                    {item.label}
                  </div>
                  <div className="flex-1 border-b border-[#1e2b58]/50 text-xs text-[#0f172a] px-2 py-0.5 truncate font-medium">
                    {item.value || '-'}
                  </div>
                </div>
              ))}
            </div>

              {/* Bottom Brand Stamp */}
              <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-mono">FORM-REF: {brief.briefNumber} · HALAMAN 1 DARI 2</span>
                <span>obeecreatives — Packaging OS</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* HALAMAN 2: VISUAL DESAIN - DESAIN KEMASAN                 */}
          {/* ========================================================= */}
          <div className="w-full overflow-x-auto pb-2 print:overflow-visible">
            <div 
              id="official-brief-page-2"
              className="min-w-[680px] md:min-w-0 w-full aspect-[1.414/1] bg-[#eef2f6] text-[#0f172a] p-6 sm:p-10 md:p-12 flex flex-col justify-between shadow-xl rounded-xl border border-slate-300 print:shadow-none print:rounded-none print:border-none print:aspect-auto print:min-h-screen print:page-break-before"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
            {/* Top Bar Section with Approval Boxes */}
            <div className="flex items-start justify-between gap-6 pb-6 border-b border-slate-300">
              {/* Approval Box: ACC TANGGAL | TALENTA | KLIENT */}
              <div className="w-3/5 grid grid-cols-3 border border-[#1e2b58] bg-white divide-x divide-[#1e2b58] shadow-xs">
                <div className="p-2 flex flex-col justify-between h-20">
                  <span className="text-[10px] font-bold text-[#1e2b58] text-center uppercase">
                    ACC TANGGAL
                  </span>
                  <span className="text-center font-mono text-xs font-semibold text-[#1e2b58]">
                    {spec.accDate || new Date().toISOString().split('T')[0]}
                  </span>
                </div>
                <div className="p-2 flex flex-col justify-between h-20">
                  <span className="text-[10px] font-bold text-[#1e2b58] text-center uppercase">
                    TALENTA
                  </span>
                  <span className="text-center text-xs font-semibold text-[#1e2b58] truncate">
                    {spec.accTalentaSignature || spec.talentaName || 'Ttd Talenta'}
                  </span>
                </div>
                <div className="p-2 flex flex-col justify-between h-20">
                  <span className="text-[10px] font-bold text-[#1e2b58] text-center uppercase">
                    KLIENT
                  </span>
                  <span className="text-center text-xs font-semibold text-[#1e2b58] truncate">
                    {spec.accClientSignature || 'Ttd Klien'}
                  </span>
                </div>
              </div>

              {/* Title Header Badge */}
              <div className="bg-[#1e2b58] text-white px-8 py-3.5 rounded-l-2xl shadow-md text-right">
                <h1 className="text-2xl font-black tracking-tight leading-none uppercase">
                  VISUAL DESAIN
                </h1>
                <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase mt-1">
                  DESAIN KEMASAN
                </h2>
              </div>
            </div>

            {/* Middle Section: 7 Form Fields */}
            <div className="grid grid-cols-1 gap-2.5 my-4">
              {[
                { label: 'TARGET PASAR', value: spec.targetMarketDesc },
                { label: 'RANGE HARGA PRODUK', value: spec.priceRange },
                { label: 'UKURAN LABELING', value: spec.labelDimensions },
                { label: 'JENIS KEMASAN', value: spec.packagingType },
                { label: 'WARNA', value: spec.colorNotes || brief.palette.join(', ') },
                { label: 'BAHAN LABELING', value: spec.labelMaterial },
                { label: 'KETERSEDIAAN LOGO', value: spec.logoReadiness }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-48 py-1 px-3 bg-[#1e2b58] text-white text-[10px] font-bold uppercase tracking-wider text-center shrink-0 shadow-xs">
                    {item.label}
                  </div>
                  <div className="flex-1 border-b border-[#1e2b58]/50 text-xs text-[#0f172a] px-2 py-0.5 truncate font-medium">
                    {item.value || '-'}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom 2-Column Section: PERSONALITY PRODUK & DESAIN LOOK AND FEEL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-300">
              
              {/* Bottom Left: PERSONALITY PRODUK (7 Rows with 5 Radio Circles) */}
              <div className="space-y-3">
                <div className="w-full py-1.5 px-4 bg-[#1e2b58] text-white text-[11px] font-bold uppercase tracking-wider text-center shadow-xs">
                  PERSONALITY PRODUK
                </div>

                <div className="space-y-1.5 px-1 text-xs font-bold text-[#1e2b58]">
                  {[
                    { left: 'EKONOMIS', right: 'MEWAH', score: p.ekonomisMewah },
                    { left: 'FEMINIM', right: 'MASKULIN', score: p.feminimMaskulin },
                    { left: 'TRADISIONAL', right: 'MODERN', score: p.tradisionalModern },
                    { left: 'SIMPLE', right: 'RUMIT', score: p.simpleRumit },
                    { left: 'MONOCHROME', right: 'COLOR FULL', score: p.monoFullcolor },
                    { left: 'ANAK', right: 'DEWASA', score: p.anakDewasa },
                    { left: 'FUN', right: 'SERIUS', score: p.funSerius }
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[10px]">
                      <span className="w-24 text-left">{row.left}</span>
                      {/* 5 Radio Circles */}
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(step => (
                          <div
                            key={step}
                            className={`w-4 h-4 rounded-full border-2 border-[#1e2b58] flex items-center justify-center ${
                              row.score === step ? 'bg-[#1e2b58]' : 'bg-transparent'
                            }`}
                          >
                            {row.score === step && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="w-24 text-right">{row.right}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Right: DESAIN LOOK AND FEEL (Exact Buttons Grid from PDF) */}
              <div className="space-y-3">
                <div className="w-full py-1.5 px-4 bg-[#1e2b58] text-white text-[11px] font-bold uppercase tracking-wider text-center shadow-xs">
                  DESAIN LOOK and FEEL
                </div>

                <div className="space-y-2 pt-1">
                  {/* Row 1 */}
                  <div className="flex justify-center gap-2">
                    {['DYNAMIC', 'FUN', 'PLAYFULL'].map(tag => {
                      const isSelected = (brief.lookfeel || []).map(t => t.toUpperCase()).includes(tag);
                      return (
                        <div
                          key={tag}
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg border-2 border-[#1e2b58] text-center ${
                            isSelected ? 'bg-[#1e2b58] text-white' : 'bg-white text-[#1e2b58]'
                          }`}
                        >
                          {tag}
                        </div>
                      );
                    })}
                  </div>

                  {/* Row 2 */}
                  <div className="flex justify-center gap-2">
                    {['MODERN', 'TIMELESS', 'CREATIVE', 'TECHY'].map(tag => {
                      const isSelected = (brief.lookfeel || []).map(t => t.toUpperCase()).includes(tag);
                      return (
                        <div
                          key={tag}
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg border-2 border-[#1e2b58] text-center ${
                            isSelected ? 'bg-[#1e2b58] text-white' : 'bg-white text-[#1e2b58]'
                          }`}
                        >
                          {tag}
                        </div>
                      );
                    })}
                  </div>

                  {/* Row 3 */}
                  <div className="flex justify-center gap-2">
                    {['FRESH', 'FORMAL', 'HIPSTER'].map(tag => {
                      const isSelected = (brief.lookfeel || []).map(t => t.toUpperCase()).includes(tag);
                      return (
                        <div
                          key={tag}
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg border-2 border-[#1e2b58] text-center ${
                            isSelected ? 'bg-[#1e2b58] text-white' : 'bg-white text-[#1e2b58]'
                          }`}
                        >
                          {tag}
                        </div>
                      );
                    })}
                  </div>

                  {/* Row 4 */}
                  <div className="flex justify-center gap-2">
                    {['TRADITIONAL', 'MONOCHROME'].map(tag => {
                      const isSelected = (brief.lookfeel || []).map(t => t.toUpperCase()).includes(tag);
                      return (
                        <div
                          key={tag}
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg border-2 border-[#1e2b58] text-center ${
                            isSelected ? 'bg-[#1e2b58] text-white' : 'bg-white text-[#1e2b58]'
                          }`}
                        >
                          {tag}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
              <span className="font-mono">FORM-REF: {brief.briefNumber} · HALAMAN 2 DARI 2 (APPROVAL RESMI)</span>
              <span>obeecreatives — Packaging OS</span>
            </div>
          </div>
        </div>

        </div>

      </div>
    </div>
  );
};
