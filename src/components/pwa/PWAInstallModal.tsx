import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Laptop, 
  Smartphone, 
  Tablet, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { DevicePlatform } from '../../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => Promise<boolean>;
  isInstallable: boolean;
  isInstalled: boolean;
  platform: DevicePlatform;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isInstallable,
  isInstalled,
  platform
}) => {
  const [activeTab, setActiveTab] = useState<'desktop' | 'android' | 'ios'>(() => {
    if (platform === 'ios') return 'ios';
    if (platform === 'android') return 'android';
    return 'desktop';
  });

  const [installSuccess, setInstallSuccess] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setIsInstalling(true);
    const success = await onInstall();
    setIsInstalling(false);
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/25 backdrop-blur-md shadow-inner">
                <Download size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display tracking-tight">
                  Instal obeecreatives App
                </h3>
                <p className="text-xs text-white/85">
                  Pasang di PC/Laptop, Android, iPhone &amp; Tablet
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition"
              aria-label="Tutup Modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Device Switcher Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
              activeTab === 'desktop'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Laptop size={14} />
            <span>PC / Laptop</span>
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
              activeTab === 'android'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Smartphone size={14} />
            <span>Android</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
              activeTab === 'ios'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Tablet size={14} />
            <span>iPhone / iPad</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          
          {/* Already installed banner */}
          {isInstalled && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-emerald-300">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-emerald-200">Aplikasi Sudah Terpasang!</span>
                <p className="text-emerald-300/80">Anda sudah menjalankan obeecreatives dalam mode aplikasi native mandiri.</p>
              </div>
            </div>
          )}

          {/* Direct 1-Click Install Button if supported */}
          {isInstallable && !isInstalled && (
            <div className="rounded-xl border border-red-500/30 bg-gradient-to-br from-red-950/50 via-slate-900 to-slate-900 p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-900/40">
                <Download size={24} />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                Tersedia Pemasangan 1-Klik Langsung
              </h4>
              <p className="text-xs text-slate-300 mb-3.5 max-w-md mx-auto">
                Browser Anda mendukung instalasi instan. Klik tombol di bawah untuk menambahkan ikon aplikasi ke desktop/layar utama.
              </p>
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:from-red-500 hover:to-rose-500 transition active:scale-95 disabled:opacity-50"
              >
                <Zap size={15} />
                <span>{isInstalling ? 'Memproses...' : 'Pasang Aplikasi Sekarang'}</span>
              </button>
            </div>
          )}

          {/* Success banner */}
          {installSuccess && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-950/60 p-3 text-emerald-200 text-xs">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Pemasangan berhasil! Aplikasi siap dibuka dari desktop / layar beranda.</span>
            </div>
          )}

          {/* TAB 1: DESKTOP (PC / Laptop) */}
          {activeTab === 'desktop' && (
            <div className="space-y-3.5">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                  <Laptop size={14} />
                  <span>Cara Pasang di Windows, Mac &amp; Linux (Chrome / Edge / Brave)</span>
                </h4>
                
                <ol className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">1</span>
                    <span>
                      Pada bilah alamat (address bar) browser di bagian atas kanan, klik ikon <strong>Instal (komputer dengan panah bawah)</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">2</span>
                    <span>
                      Atau klik menu browser (titik tiga <strong>⋮</strong> atau <strong>…</strong>) ➔ pilih <strong>"Simpan dan bagikan" / "Aplikasi"</strong> ➔ klik <strong>"Instal obeecreatives"</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">3</span>
                    <span>
                      Konfirmasi dialog pop-up. Ikon aplikasi akan otomatis disematkan ke <strong>Desktop, Start Menu, atau Mac Dock</strong>.
                    </span>
                  </li>
                </ol>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-2.5 flex items-start gap-2">
                  <ShieldCheck size={14} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Jendela Mandiri</span>
                    <span className="text-slate-400">Bebas tab browser &amp; bilah URL yang mengganggu.</span>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-2.5 flex items-start gap-2">
                  <Zap size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Performa Maksimal</span>
                    <span className="text-slate-400">Akses instan dari taskbar dengan rendering 3D WebGL optimal.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANDROID (Handphone & Tablet) */}
          {activeTab === 'android' && (
            <div className="space-y-3.5">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Smartphone size={14} />
                  <span>Cara Pasang di HP / Tablet Android (Google Chrome / Samsung)</span>
                </h4>
                
                <ol className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">1</span>
                    <span>
                      Buka web ini di browser <strong>Google Chrome</strong> atau <strong>Samsung Internet</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">2</span>
                    <span>
                      Ketuk tombol menu titik tiga (<strong>⋮</strong>) di sudut kanan atas layar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">3</span>
                    <span>
                      Pilih opsi <strong>"Instal aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">4</span>
                    <span>
                      Ketuk <strong>"Instal"</strong>. Aplikasi akan muncul di laci aplikasi seperti aplikasi Android asli!
                    </span>
                  </li>
                </ol>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-3 flex items-center gap-3 text-xs text-slate-300">
                <Sparkles size={16} className="text-emerald-400 shrink-0" />
                <span>Mendukung orientasi vertikal maupun horizontal (landscape) di tablet Samsung Galaxy Tab, Xiaomi Pad, dll.</span>
              </div>
            </div>
          )}

          {/* TAB 3: IOS (iPhone & iPad Safari) */}
          {activeTab === 'ios' && (
            <div className="space-y-3.5">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                  <Tablet size={14} />
                  <span>Cara Pasang di iPhone &amp; iPad (Apple Safari)</span>
                </h4>
                
                <ol className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">1</div>
                    <div>
                      <span>Buka web ini menggunakan browser resmi <strong>Safari</strong> di iOS / iPadOS.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">2</div>
                    <div>
                      <span>Ketuk tombol <strong>Bagikan / Share</strong> di bilah bawah Safari:</span>
                      <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-slate-800/80 px-2.5 py-1.5 w-fit border border-slate-700 text-blue-300 font-medium">
                        <Share size={15} />
                        <span>Ikon Kotak dengan Panah ke Atas</span>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">3</div>
                    <div>
                      <span>Gulir ke bawah pada menu opsi, lalu pilih:</span>
                      <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-slate-800/80 px-2.5 py-1.5 w-fit border border-slate-700 text-white font-medium">
                        <PlusSquare size={15} className="text-emerald-400" />
                        <span>Tambahkan ke Layar Utama (Add to Home Screen)</span>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">4</div>
                    <div>
                      <span>Ketuk tombol <strong>"Tambah" (Add)</strong> di pojok kanan atas. Aplikasi akan terpasang di Home Screen iPhone/iPad Anda!</span>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-3 flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                <span>Saat dibuka dari Layar Utama, aplikasi berjalan secara fullscreen tanpa toolbar Safari (Standalone iOS App).</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/80 px-5 py-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>Progressive Web App (PWA) Standard</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
