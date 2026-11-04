import React from 'react';
import { 
  FolderKanban, 
  FileText, 
  Palette, 
  Box, 
  Layers, 
  CheckSquare, 
  Database, 
  RefreshCw, 
  Users, 
  Compass,
  ArrowUpRight,
  Camera
} from 'lucide-react';
import { ActiveTab, Role } from '../../types';

interface SidebarProps {
  isCollapsed: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openGasModal: () => void;
  openUserModal: () => void;
  onManualSync: () => void;
  isSyncing: boolean;
  isGasConnected: boolean;
  userRole: Role;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  activeTab,
  setActiveTab,
  openGasModal,
  openUserModal,
  onManualSync,
  isSyncing,
  isGasConnected,
  userRole
}) => {
  const menuItems = [
    {
      id: 'pipeline' as ActiveTab,
      label: 'Brief & Pipeline',
      subtitle: 'Kanban alur produksi packaging',
      icon: FolderKanban
    },
    {
      id: 'brief' as ActiveTab,
      label: 'Visual Identity',
      subtitle: '7 Personality & acuan foto',
      icon: FileText
    },
    {
      id: 'mood' as ActiveTab,
      label: 'Moodboard Studio',
      subtitle: 'Palet warna, font & pinboard',
      icon: Palette
    },
    {
      id: 'mockup' as ActiveTab,
      label: 'Mockup Kemasan',
      subtitle: '17 varian bentuk SVG realistis',
      icon: Box
    },
    {
      id: 'scene' as ActiveTab,
      label: 'Set Kemasan',
      subtitle: 'Product lineup & family shot',
      icon: Layers
    },
    {
      id: 'photo-studio' as ActiveTab,
      label: 'Photo Studio',
      subtitle: 'Lighting diagram & shot matrix',
      icon: Camera
    },
    {
      id: 'client-review' as ActiveTab,
      label: 'Portal Review Klien',
      subtitle: 'Presentasi & verifikasi approval',
      icon: CheckSquare
    }
  ];

  return (
    <aside
      className={`fixed top-14 bottom-0 left-0 z-30 flex flex-col border-r border-slate-800 bg-slate-900 text-slate-300 transition-all duration-200 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Switch App OS Pill (Matches obeecreatives screenshot) */}
      <div className="p-3 border-b border-slate-800/80">
        {!isCollapsed ? (
          <div className="flex items-center justify-between rounded-xl bg-slate-800/80 px-3 py-2 text-xs font-semibold text-white border border-slate-700/60 shadow-inner">
            <div className="flex items-center gap-2">
              <Compass size={14} className="text-red-500" />
              <span>Packaging OS</span>
            </div>
            <span className="rounded bg-red-600/30 px-1.5 py-0.5 text-[9px] font-bold text-red-300 font-mono">
              v2.6
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-red-500 font-bold text-xs border border-slate-700">
              OS
            </span>
          </div>
        )}
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>
        )}

        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                isActive
                  ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-950/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 transition-transform ${
                  isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!isCollapsed && (
                <div className="flex flex-col leading-tight truncate">
                  <span className="text-xs truncate">{item.label}</span>
                  <span
                    className={`text-[10px] truncate ${
                      isActive ? 'text-red-100' : 'text-slate-400'
                    }`}
                  >
                    {item.subtitle}
                  </span>
                </div>
              )}
            </button>
          );
        })}

        {/* Administration / Management (Only for Lead Creative & Bendahara) */}
        {(userRole === 'developer' || userRole === 'bendahara') && (
          <div className="pt-4">
            {!isCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sistem &amp; Hak Akses
              </div>
            )}

            <button
              onClick={openUserModal}
              title={isCollapsed ? 'Database Tim & Staf' : undefined}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Users size={17} className="flex-shrink-0 text-slate-400" />
              {!isCollapsed && (
                <div className="flex flex-col leading-tight truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium">Tim &amp; Direktori</span>
                    <span className="rounded bg-red-950/80 text-red-400 border border-red-800/40 px-1 text-[8px] font-bold">
                      RBAC
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Kelola akses &amp; matriks peran</span>
                </div>
              )}
            </button>
          </div>
        )}

        {/* Headless GAS Menu */}
        <div className="pt-2">
          <button
            onClick={openGasModal}
            title={isCollapsed ? 'Headless GAS Center' : undefined}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <Database size={17} className="flex-shrink-0 text-slate-400" />
            {!isCollapsed && (
              <div className="flex flex-col leading-tight truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium">Headless GAS</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${isGasConnected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                </div>
                <span className="text-[10px] text-slate-400">Sinkronisasi Google Sheet (Dev)</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Sync Engine Section (Matches obeecreatives screenshot) */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        {!isCollapsed ? (
          <div className="space-y-2">
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/40 transition disabled:opacity-50"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin text-emerald-400' : 'text-emerald-400'} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sync Sheet & Cache'}</span>
            </button>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Sync Engine
              </span>
              <span className="text-emerald-400 font-semibold">0.01s Instant</span>
            </div>
          </div>
        ) : (
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            title="Sync Sheet & Cache"
            className="flex h-10 w-full items-center justify-center rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/50 transition"
          >
            <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        )}
      </div>
    </aside>
  );
};
