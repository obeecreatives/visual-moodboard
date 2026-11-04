import React, { useState } from 'react';
import { 
  FileText, 
  X, 
  Download, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  ExternalLink,
  Loader2
} from 'lucide-react';
import { BriefProject } from '../../types';
import { generatePdfViaGas } from '../../services/gasService';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { OfficialDesignBriefSheet } from './OfficialDesignBriefSheet';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  brief: BriefProject;
  gasUrl: string;
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  brief,
  gasUrl
}) => {
  const [showOfficialSheet, setShowOfficialSheet] = useState(false);
  const [isExportingClient, setIsExportingClient] = useState(false);
  const [isExportingGas, setIsExportingGas] = useState(false);
  const [gasResult, setGasResult] = useState<{ pdfBase64?: string; fileName?: string; slidesUrl?: string; error?: string } | null>(null);

  if (!isOpen) return null;

  const handleExportClientPdf = async () => {
    setIsExportingClient(true);
    try {
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 40;

      // 1. Cover Page
      pdf.setFillColor(13, 13, 13);
      pdf.rect(0, 0, pageW, pageH, 'F');
      
      pdf.setTextColor(227, 30, 43); // #e31e2b
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('OBEECREATIVES • CREATIVE AGENCY OS', pageW / 2, pageH / 2 - 60, { align: 'center' });

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(26);
      pdf.text('VISUAL IDENTITY & PACKAGING', pageW / 2, pageH / 2 - 30, { align: 'center' });
      pdf.text('BRAND GUIDELINE', pageW / 2, pageH / 2 - 2, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(16);
      pdf.text(brief.brandName || 'Brand Visual Guideline', pageW / 2, pageH / 2 + 35, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setTextColor(160, 160, 160);
      pdf.text(
        `Disusun oleh obeecreatives • Klien: ${brief.clientName} • ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        pageW / 2,
        pageH / 2 + 62,
        { align: 'center' }
      );

      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      pdf.text('obeecreatives — All Rights Reserved • Developed by Lalu Mahendra', pageW / 2, pageH - 30, { align: 'center' });

      // Helper function to capture any element and add as page
      const addElementPage = async (elementId: string, title: string) => {
        const el = document.getElementById(elementId);
        if (!el) return;
        const canvas = await html2canvas(el, { scale: 1.8, backgroundColor: '#ffffff' });
        pdf.addPage();

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.setTextColor(20, 20, 20);
        pdf.text(title, margin, margin);

        pdf.setDrawColor(227, 30, 43);
        pdf.setLineWidth(2);
        pdf.line(margin, margin + 6, margin + 35, margin + 6);

        const maxW = pageW - margin * 2;
        const maxH = pageH - margin * 2 - 30;
        const ratio = Math.min(maxW / canvas.width, maxH / canvas.height);
        const w = canvas.width * ratio;
        const h = canvas.height * ratio;
        const x = (pageW - w) / 2;

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, margin + 24, w, h);

        pdf.setFontSize(8);
        pdf.setTextColor(140, 140, 140);
        pdf.text('obeecreatives — All Rights Reserved', margin, pageH - 20);
        pdf.text(brief.briefNumber, pageW - margin, pageH - 20, { align: 'right' });
      };

      // 2. Add Brief Card if present
      await addElementPage('briefPrintableCard', '01. Brief Visual Identity & Personality');
      // 3. Add Moodboard Card if present
      await addElementPage('moodboardPrintableCard', '02. Moodboard & Palet Warna');

      const fileName = `obeecreatives-Guideline-${(brief.brandName || 'Brand').replace(/\s+/g, '-')}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('Client PDF generation error', err);
    } finally {
      setIsExportingClient(false);
    }
  };

  const handleExportGas = async () => {
    if (!gasUrl.trim()) return;
    setIsExportingGas(true);
    setGasResult(null);

    try {
      // Capture mockup and scene canvas if on DOM
      let mockImg: string | null = null;
      let sceneImg: string | null = null;

      const mockEl = document.getElementById('mockupStageElement');
      if (mockEl) {
        const c1 = await html2canvas(mockEl, { scale: 1.5, backgroundColor: null });
        mockImg = c1.toDataURL('image/png');
      }

      const sceneEl = document.getElementById('sceneStageContainer');
      if (sceneEl) {
        const c2 = await html2canvas(sceneEl, { scale: 1.5, backgroundColor: null });
        sceneImg = c2.toDataURL('image/png');
      }

      const res = await generatePdfViaGas(gasUrl, brief, mockImg, sceneImg);
      if (res.ok && res.result) {
        setGasResult(res.result);
        
        // Trigger download
        const blob = new Blob(
          [Uint8Array.from(atob(res.result.pdfBase64), c => c.charCodeAt(0))],
          { type: 'application/pdf' }
        );
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = res.result.fileName;
        a.click();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
      } else {
        setGasResult({ error: res.error || 'Gagal memproses via Apps Script' });
      }
    } catch (err: unknown) {
      setGasResult({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      setIsExportingGas(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl flex flex-col rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
              <FileText size={16} />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white">
                Export Brand &amp; Packaging Guideline
              </h2>
              <p className="text-[10px] text-slate-400">
                Dokumen resmi presentasi klien obeecreatives
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

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
            {/* Option 1: Official 2-Page Design Brief Sheet (Matching Reference PDF) */}
            <div className="rounded-2xl border border-blue-500/50 bg-blue-950/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-400" />
                  <span>Format Resmi: Design Brief &amp; Visual Kemasan (2 Halaman)</span>
                </h4>
                <span className="rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 text-[9px] font-bold uppercase">
                  Standar Dokumen
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Format resmi sesuai formulir kemasan: Halaman 1 (Identitas Talenta/Mentor, Legalitas P-IRT, Halal, BPOM, Diproduksi Di, Netto &amp; Komposisi) dan Halaman 2 (Spesifikasi Fisik, Personality Produk, Look &amp; Feel, serta Strip Approval ACC).
              </p>
              <button
                onClick={() => setShowOfficialSheet(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow transition"
              >
                <FileText size={14} />
                <span>Buka &amp; Cetak Format Resmi 2 Halaman</span>
              </button>
            </div>

            {/* Option 2: Browser PDF Engine */}
            <div className="rounded-2xl border border-slate-700/80 bg-slate-800/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Download size={14} className="text-red-400" />
                  <span>Export PDF Instan Brand Guideline (Cover + Palette)</span>
                </h4>
                <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold">
                  0.01s Cepat
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Menggabungkan Halaman Cover Brand, Brief Personality, dan Moodboard Swatches langsung menjadi file PDF resolusi tinggi siap kirim ke klien.
              </p>
              <button
                onClick={handleExportClientPdf}
                disabled={isExportingClient}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white shadow transition disabled:opacity-50"
              >
                {isExportingClient ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Membuat PDF...</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>Unduh Dokumen PDF Instan</span>
                  </>
                )}
              </button>
            </div>

          {/* Option 2: Server Google Slides & PDF Engine */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Share2 size={14} className="text-blue-400" />
                <span>Google Slides + PDF via Apps Script</span>
              </h4>
              <span className="rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 text-[9px] font-bold">
                Vector Native
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Membangun slide presentasi Google Slides otomatis di Google Drive yang dapat diedit (*editable text &amp; shape*), lalu mengekspornya jadi PDF server-side.
            </p>

            <button
              onClick={handleExportGas}
              disabled={!gasUrl.trim() || isExportingGas}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-white transition disabled:opacity-50"
            >
              {isExportingGas ? (
                <>
                  <Loader2 size={14} className="animate-spin text-blue-400" />
                  <span>Membuat Google Slides &amp; PDF...</span>
                </>
              ) : (
                <>
                  <ExternalLink size={14} className="text-blue-400" />
                  <span>Generate Google Slides &amp; PDF</span>
                </>
              )}
            </button>

            {!gasUrl.trim() && (
              <p className="text-[10px] text-amber-400 mt-1">
                * Memerlukan URL Web App Google Apps Script di panel Headless GAS.
              </p>
            )}

            {gasResult && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-1 mt-2">
                {gasResult.error ? (
                  <p className="text-rose-400">{gasResult.error}</p>
                ) : (
                  <>
                    <p className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      <span>PDF Berhasil Dibuat &amp; Terunduh!</span>
                    </p>
                    {gasResult.slidesUrl && (
                      <a
                        href={gasResult.slidesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <span>Buka versi Google Slides (Bisa Diedit Manual)</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 px-6 py-3.5 bg-slate-950 flex items-center justify-end text-xs text-slate-400">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-semibold text-white transition"
          >
            Tutup
          </button>
        </div>

      </div>

      {/* Official 2-Page Design Brief Modal */}
      <OfficialDesignBriefSheet
        isOpen={showOfficialSheet}
        onClose={() => setShowOfficialSheet(false)}
        brief={brief}
      />
    </div>
  );
};
