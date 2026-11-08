import React, { useState } from 'react';
import { Download, Laptop, Smartphone, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, platform, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running in standalone PWA mode, show subtle badge or hide
  if (isInstalled) {
    if (variant === 'sidebar') {
      return (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-400">
          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
          <span className="truncate">Aplikasi Terpasang (PWA)</span>
        </div>
      );
    }
    return null;
  }

  const handleClick = async () => {
    // If the browser supports beforeinstallprompt, try direct install or open guided modal
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {variant === 'sidebar' ? (
        <button
          onClick={() => setShowModal(true)}
          className="group flex w-full items-center gap-2.5 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-950/40 to-slate-900/60 p-2.5 text-xs font-semibold text-white shadow-sm hover:border-red-500/60 hover:from-red-900/50 hover:to-slate-800 transition active:scale-[0.98]"
          title="Pasang aplikasi di PC, Handphone atau Tablet"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white shadow">
            <Download size={14} className="group-hover:animate-bounce" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="font-bold text-white flex items-center gap-1.5">
              Instal Aplikasi
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
            </span>
            <span className="text-[10px] text-slate-400">PC • Android • iOS</span>
          </div>
        </button>
      ) : variant === 'compact' ? (
        <button
          onClick={() => setShowModal(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/40 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition shadow-sm"
          title="Instal di PC / Handphone / Tablet"
          aria-label="Instal Aplikasi"
        >
          <Download size={15} />
        </button>
      ) : (
        <button
          onClick={handleClick}
          className="relative flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-gradient-to-r from-red-600 to-rose-600 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white shadow hover:from-red-500 hover:to-rose-500 transition active:scale-95"
          title="Instal aplikasi di PC/Laptop, Handphone atau Tablet"
        >
          <Download size={13} className="shrink-0" />
          <span className="hidden md:inline">Instal App</span>
          <span className="md:hidden">Instal</span>
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
        </button>
      )}

      {/* Installation Guide & 1-Click Modal */}
      <PWAInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onInstall={install}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        platform={platform}
      />
    </>
  );
};
