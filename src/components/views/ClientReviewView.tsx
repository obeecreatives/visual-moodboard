import React, { useState } from 'react';
import { 
  BriefProject, 
  UserProfile, 
  BriefStatus 
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
  CheckCircle2, 
  Clock, 
  Share2, 
  Download, 
  ExternalLink, 
  MessageSquare, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClientReviewViewProps {
  brief: BriefProject;
  currentUser: UserProfile;
  onUpdateBrief: (updated: Partial<BriefProject>) => void;
  onApprove: (notes: string) => void;
  openExportModal: () => void;
  theme: 'dark' | 'light';
}

export const ClientReviewView: React.FC<ClientReviewViewProps> = ({
  brief,
  currentUser,
  onUpdateBrief,
  onApprove,
  openExportModal,
  theme
}) => {
  const [clientNotes, setClientNotes] = useState(brief.approvalNotes || '');
  const [isApproved, setIsApproved] = useState(brief.status === 'approved');

  const handleApproveClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsApproved(true);
    onApprove(clientNotes);
  };

  const m = brief.mockupConfig;
  const shape = SHAPES[m.shape] || SHAPES.box;
  const baseColor = m.color || '#C9B896';
  const topColor = shadeColor(baseColor, 14);
  const sideColor = shadeColor(baseColor, -16);
  const vb = shape.viewBox.split(' ').map(Number);
  const vbW = vb[2];
  const vbH = vb[3];
  const zone = shape.zone;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Client Review Banner */}
      <div className="rounded-3xl border border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 shadow-xl text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-red-600/30 border border-red-500/40 text-red-400 px-3 py-0.5 text-xs font-bold uppercase tracking-wider font-mono">
                PORTAL APPROVAL KLIEN
              </span>
              <span className="font-mono text-xs text-slate-400">
                {brief.briefNumber}
              </span>
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-white">
              {brief.brandName}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              {brief.clientName} • Paket: {brief.packageName} • Lead: {brief.creatorName}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold ${
              brief.status === 'approved' 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}>
              {brief.status === 'approved' ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Approved (Disetujui Klien)</span>
                </>
              ) : (
                <>
                  <Clock size={16} />
                  <span>Menunggu Verifikasi &amp; Approval Klien</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openExportModal}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                <Download size={13} className="text-red-400" />
                <span>Unduh Dokumen PDF</span>
              </button>

              {brief.slidesUrl && (
                <a
                  href={brief.slidesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  <ExternalLink size={13} className="text-blue-400" />
                  <span>Buka Slides Klien</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Identity & 3D Mockup Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side (5 cols): Brief Summary & Palette */}
        <div className="md:col-span-5 space-y-4">
          
          {/* Palet Warna Terpilih */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-5 shadow-sm text-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Palet Warna Brand</span>
              <Sparkles size={13} className="text-red-400" />
            </h3>

            <div className="flex items-center gap-2 mb-3">
              {brief.palette.map((hex, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full h-14 rounded-xl border border-black/20 shadow-sm"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="font-mono text-[10px] text-slate-300 mt-1 uppercase font-semibold">
                    {hex}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Tipografi Utama:</span>
                <span className="font-semibold text-white">{brief.fontDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tipografi Pendukung:</span>
                <span className="font-semibold text-white">{brief.fontBody}</span>
              </div>
            </div>
          </div>

          {/* Konsep & Arah Desain */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-5 shadow-sm text-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Konsep Visual &amp; Logo
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Jenis Logo:</span>
                <span className="font-semibold text-white">{brief.jenisLogo}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Bentuk Icon:</span>
                <span className="font-semibold text-white">{brief.bentukIcon}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Target Pasar:</span>
                <span className="font-semibold text-white">{brief.targetMarket.economy}, {brief.targetMarket.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gaya Foto Produk:</span>
                <span className="font-semibold text-white">{brief.visualPhoto.character} ({brief.visualPhoto.ratio})</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block mb-1.5">Kata Kunci Kesan (Look &amp; Feel):</span>
              <div className="flex flex-wrap gap-1">
                {(brief.lookfeel || []).map(t => (
                  <span key={t} className="rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs text-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side (7 cols): Mockup Stage Preview */}
        <div className="md:col-span-7 space-y-4">
          
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-5 shadow-sm text-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Visualisasi Kemasan: {SHAPE_LABELS[m.shape]}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {m.materialStyle.toUpperCase()} FINISH
              </span>
            </div>

            {/* Stage Canvas */}
            <div 
              className="relative flex items-center justify-center rounded-2xl p-6 min-h-[360px] shadow-inner overflow-hidden"
              style={{ background: 'linear-gradient(180deg, #f5f4f0, #e7e6e0)' }}
            >
              <div 
                className="relative"
                style={{ width: '260px', height: `${260 * (vbH / vbW)}px` }}
              >
                <svg
                  viewBox={shape.viewBox}
                  className="w-full h-full block"
                  dangerouslySetInnerHTML={{
                    __html: `
                      <defs>
                        ${glossDefsFor(m.materialStyle)}
                        ${cylLightDefFor(m.materialStyle)}
                        ${SHADOW_BLUR_FILTER}
                      </defs>
                      ${buildGroundShadow(vbW, vbH, shape.shadowY)}
                      ${shape.build(baseColor, topColor, sideColor)}
                      ${m.windowEnabled && shape.windowZone ? buildWindowOverlay(shape.windowZone) : ''}
                    `
                  }}
                />

                {/* Logo & Product Text */}
                <div
                  className="absolute overflow-hidden pointer-events-none"
                  style={{
                    left: `${(zone.x / vbW) * 100}%`,
                    top: `${(zone.y / vbH) * 100}%`,
                    width: `${(zone.w / vbW) * 100}%`,
                    height: `${(zone.h / vbH) * 100}%`
                  }}
                >
                  {m.logo && (
                    <img
                      src={m.logo}
                      alt="Logo"
                      className="absolute left-1/2 top-1/2 max-w-[180%] max-h-[180%] object-contain"
                      style={{
                        transform: `translate(-50%, -50%) translate(${m.logoX}px, ${m.logoY}px) rotate(${m.logoRot}deg) scale(${m.logoScale})`
                      }}
                    />
                  )}

                  <div
                    className="absolute left-1/2 top-1/2 text-center whitespace-nowrap"
                    style={{
                      transform: `translate(-50%, -50%) translate(0px, ${m.textY}px)`,
                      fontFamily: m.textFont,
                      color: m.textColor
                    }}
                  >
                    {m.prodName && (
                      <p className="font-bold leading-tight uppercase tracking-wider text-sm">
                        {m.prodName}
                      </p>
                    )}
                    {m.prodTag && (
                      <p className="leading-snug opacity-80 uppercase font-mono text-[9px]">
                        {m.prodTag}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Feedback & 1-Click Approval Box */}
          <div className="rounded-2xl border border-red-500/30 bg-slate-900 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-red-500" />
              <h3 className="font-display text-base font-bold text-white">
                Verifikasi &amp; Persetujuan Klien (Client Approval)
              </h3>
            </div>

            <p className="text-xs text-slate-300">
              Dengan menekan tombol persetujuan di bawah, klien menyatakan sepakat terhadap konsep visual identity, palet warna, tipografi, dan arah kemasan produk untuk dilanjutkan ke tahap cetak dan photoshoot studio obeecreatives.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Catatan Persetujuan / Pesan Klien (Opsional):
              </label>
              <textarea
                rows={2}
                value={clientNotes}
                onChange={e => setClientNotes(e.target.value)}
                placeholder="Contoh: Disetujui 100%, warna sudah sesuai ekspektasi..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-400">
                Verifikator Aktif: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
              </div>

              <button
                onClick={handleApproveClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 transition transform active:scale-95"
              >
                <CheckCircle2 size={16} />
                <span>Setujui Guideline Visual (Approve)</span>
              </button>
            </div>

            {brief.verifiedAt && (
              <p className="text-[10px] text-emerald-400 font-mono text-right">
                ✓ Telah diverifikasi oleh {brief.verifiedBy} pada {new Date(brief.verifiedAt).toLocaleString('id-ID')}
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
