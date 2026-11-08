import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl border border-amber-500/40 bg-amber-950/90 px-3.5 py-2 text-xs font-medium text-amber-200 shadow-2xl backdrop-blur-md animate-bounce">
      <WifiOff size={16} className="text-amber-400 shrink-0" />
      <div>
        <p className="font-semibold leading-tight text-white">Mode Offline Aktif</p>
        <p className="text-[11px] text-amber-300/80">Aplikasi tetap dapat digunakan dengan cache offline PWA.</p>
      </div>
    </div>
  );
};
