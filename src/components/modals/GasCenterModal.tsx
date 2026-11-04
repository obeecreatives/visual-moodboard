import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Activity, 
  RefreshCw, 
  FileCode, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { 
  getStandaloneAppsScriptCode, 
  DEFAULT_SPREADSHEET_ID, 
  pingGasEndpoint 
} from '../../services/gasService';

interface GasCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasUrl: string;
  onSaveGasUrl: (url: string) => void;
  onManualSync: () => void;
  isSyncing: boolean;
  isGasConnected: boolean;
}

export const GasCenterModal: React.FC<GasCenterModalProps> = ({
  isOpen,
  onClose,
  gasUrl,
  onSaveGasUrl,
  onManualSync,
  isSyncing,
  isGasConnected
}) => {
  const [urlInput, setUrlInput] = useState(gasUrl);
  const [activeTab, setActiveTab] = useState<'settings' | 'code' | 'guide'>('settings');
  const [copiedCode, setCopiedCode] = useState(false);
  const [pingStatus, setPingStatus] = useState<{ testing: boolean; latency?: number; ok?: boolean; error?: string } | null>(null);

  React.useEffect(() => {
    if (gasUrl) {
      setUrlInput(gasUrl);
    }
  }, [gasUrl, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveGasUrl(urlInput.trim());
  };

  const handleTestPing = async () => {
    if (!urlInput.trim()) return;
    setPingStatus({ testing: true });
    const res = await pingGasEndpoint(urlInput.trim());
    setPingStatus({
      testing: false,
      ok: res.ok,
      latency: res.latency,
      error: res.error
    });
    if (res.ok) {
      onSaveGasUrl(urlInput.trim());
    }
  };

  const scriptCode = getStandaloneAppsScriptCode(DEFAULT_SPREADSHEET_ID);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
              <Database size={16} />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white">
                Headless GAS Center (Standalone Apps Script)
              </h2>
              <p className="text-[10px] text-slate-400">
                Integrasi REST API Google Sheets &amp; Google Slides untuk obeecreatives
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

        {/* Tab Header */}
        <div className="flex items-center gap-2 border-b border-slate-800 px-6 pt-2 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'settings'
                ? 'border-red-600 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Pengaturan Endpoint &amp; Status
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'code'
                ? 'border-red-600 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Kode Google Apps Script Standalone
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'guide'
                ? 'border-red-600 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Panduan 3 Menit Deploy
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {activeTab === 'settings' && (
            <div className="space-y-5">
              
              {/* Spreadsheet Target Badge */}
              <div className="rounded-2xl border border-slate-700/80 bg-slate-800/60 p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Spreadsheet Target Database
                </span>
                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-xs text-white truncate">
                    ID: <strong className="text-red-400">{DEFAULT_SPREADSHEET_ID}</strong>
                  </div>
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-red-400 hover:underline flex-shrink-0"
                  >
                    <span>Buka Google Sheet</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tab <code className="text-white font-mono bg-slate-900 px-1 py-0.5 rounded">Briefs</code> akan otomatis dibuat dan dikelola oleh backend Apps Script standalone saat pertama kali data masuk.
                </p>
              </div>

              {/* Endpoint URL Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Web App URL Google Apps Script (/exec)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-red-500 focus:outline-none"
                  />
                  <button
                    onClick={handleTestPing}
                    disabled={!urlInput.trim() || pingStatus?.testing}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-50"
                  >
                    <Activity size={13} className={pingStatus?.testing ? 'animate-pulse text-amber-400' : 'text-red-400'} />
                    <span>{pingStatus?.testing ? 'Menguji...' : 'Uji Koneksi'}</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white shadow transition"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              {/* Ping Result Notification */}
              {pingStatus && (
                <div className={`p-4 rounded-xl border text-xs space-y-1 ${
                  pingStatus.ok 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                }`}>
                  <div className="flex items-center gap-2 font-semibold">
                    {pingStatus.ok ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    <span>{pingStatus.ok ? 'Endpoint Berhasil Terhubung!' : 'Koneksi Terhambat atau CORS Perlu Divalidasi'}</span>
                    <span className="font-mono text-[10px] ml-auto">Latency: {pingStatus.latency}ms</span>
                  </div>
                  {pingStatus.error && (
                    <p className="text-[11px] opacity-80 font-mono">{pingStatus.error}</p>
                  )}
                </div>
              )}

              {/* Status Card & Manual Sync */}
              <div className="rounded-2xl border border-slate-700/80 bg-slate-800/40 p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${isGasConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                    Status Sinkronisasi Saat Ini
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Mode Offline-First aktif: Seluruh data selalu instan tersimpan di browser Anda (0.01 detik).
                  </p>
                </div>

                <button
                  onClick={onManualSync}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900/40 transition disabled:opacity-50"
                >
                  <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                  <span>{isSyncing ? 'Sinkronisasi...' : 'Sinkronkan Sekarang'}</span>
                </button>
              </div>

            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Salin seluruh kode di bawah ke editor Standalone Google Apps Script (<a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-red-400 underline">script.google.com</a>):
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-bold text-white shadow transition"
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode ? 'Tersalin!' : 'Salin Kode Script'}</span>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 overflow-x-auto max-h-96 text-xs font-mono text-slate-300">
                <pre>{scriptCode}</pre>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-800/40 p-4 space-y-3">
                <h4 className="font-bold text-white text-sm">
                  Langkah Setup Google Apps Script Standalone (Hanya 3 Menit):
                </h4>
                
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>
                    Buka <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-red-400 underline font-semibold">script.google.com</a> lalu klik <strong>"New Project"</strong> (Project Baru).
                  </li>
                  <li>
                    Beri nama project: <strong className="text-white">obeecreatives — Packaging Toolkit Backend</strong>.
                  </li>
                  <li>
                    Buka tab <strong>"Kode Google Apps Script Standalone"</strong> di atas, klik tombol <strong>"Salin Kode Script"</strong>.
                  </li>
                  <li>
                    Hapus isi default file <code className="text-red-300">Code.gs</code> di editor Google, lalu Paste seluruh kode yang disalin. Simpan (<kbd className="bg-slate-800 px-1 rounded">Ctrl+S</kbd>).
                  </li>
                  <li>
                    Klik <strong>Deploy</strong> (kanan atas) &rarr; <strong>New deployment</strong>.
                  </li>
                  <li>
                    Pilih tipe gear ⚙️ &rarr; <strong>Web app</strong>:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5 text-slate-400">
                      <li>Description: <span className="text-white">v1 Standalone</span></li>
                      <li>Execute as: <span className="text-white">Me (akun Google Anda)</span></li>
                      <li>Who has access: <strong className="text-red-400">Anyone</strong> (Penting agar web app bisa memanggil endpoint).</li>
                    </ul>
                  </li>
                  <li>
                    Klik <strong>Deploy</strong>, izinkan otorisasi akses Google Drive, Slides, dan Sheets.
                  </li>
                  <li>
                    Salin <strong>Web App URL</strong> yang dihasilkan (berakhiran <code className="text-red-300">/exec</code>), lalu tempel ke kolom endpoint di tab Pengaturan modal ini!
                  </li>
                </ol>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 px-6 py-3.5 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>obeecreatives Standalone Engine • Spreadsheet ID: 19xwZc...EU9qko</span>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-semibold text-white transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
