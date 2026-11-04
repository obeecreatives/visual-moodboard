import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  Database, 
  CheckCircle2, 
  Sparkles,
  Layers,
  UserCheck,
  Building2,
  Share2,
  Menu
} from 'lucide-react';
import { UserProfile, Role, BriefProject } from '../../types';

interface HeaderProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  onOpenMobileSidebar?: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeUser: UserProfile;
  users: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  openGasModal: () => void;
  openExportModal: () => void;
  openUserModal: () => void;
  isGasConnected: boolean;
  activeBrief: BriefProject | null;
  allBriefs: BriefProject[];
  onSelectBrief: (brief: BriefProject) => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarCollapsed,
  toggleSidebar,
  onOpenMobileSidebar,
  theme,
  toggleTheme,
  activeUser,
  users,
  onSelectUser,
  openGasModal,
  openExportModal,
  openUserModal,
  isGasConnected,
  activeBrief,
  allBriefs,
  onSelectBrief,
  activeTab
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showBriefDropdown, setShowBriefDropdown] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const pendingCount = allBriefs.filter(b => b.status === 'waiting_client' || b.status === 'review_internal').length;

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'developer': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'bendahara': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'admin': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'client': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-t-2 border-red-600 bg-slate-900 text-slate-100 shadow-md">
      <div className="flex h-14 items-center justify-between px-2.5 sm:px-4 md:px-5 gap-1.5 sm:gap-2">
        
        {/* Left Section: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          
          {/* Mobile Hamburger Button */}
          <button
            onClick={onOpenMobileSidebar || toggleSidebar}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white transition shrink-0"
            title="Buka Menu"
            aria-label="Menu"
          >
            <Menu size={18} />
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-600 hover:bg-slate-700 hover:text-white transition-colors shrink-0"
          >
            {isSidebarCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>

          {/* obeecreatives Logo & Subtitle */}
          <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white font-bold text-xs shadow-sm">
              <span className="font-display">O</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 leading-none">
                <span className="font-display font-bold text-sm sm:text-base text-white tracking-tight">obee</span>
                <span className="font-display font-bold text-sm sm:text-base text-red-500 tracking-tight">creatives</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium hidden sm:inline-block">
                Toolkit &amp; Packaging OS
              </span>
            </div>
          </div>

          {/* Active Brief Project Selector */}
          <div className="relative ml-2 hidden lg:block">
            <button
              onClick={() => setShowBriefDropdown(!showBriefDropdown)}
              className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/70 px-3 py-1.5 text-xs text-slate-200 hover:border-slate-600 transition"
            >
              <Building2 size={13} className="text-red-400" />
              <span className="font-medium max-w-[140px] truncate">
                {activeBrief ? activeBrief.brandName : 'Pilih Brief'}
              </span>
              <span className="text-[10px] text-slate-400">({activeBrief?.briefNumber || 'None'})</span>
            </button>

            {showBriefDropdown && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-xl border border-slate-700 bg-slate-800 p-1.5 shadow-2xl z-50">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Daftar Proyek Brand
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {allBriefs.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onSelectBrief(b);
                        setShowBriefDropdown(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                        activeBrief?.id === b.id ? 'bg-red-600 text-white font-semibold' : 'text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      <div className="text-left truncate">
                        <p className="truncate">{b.brandName}</p>
                        <p className={`text-[10px] ${activeBrief?.id === b.id ? 'text-red-100' : 'text-slate-400'}`}>
                          {b.clientName}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] ml-2 opacity-80">{b.briefNumber}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center / Stats Section */}
        <div className="hidden xl:flex items-center gap-2">
          {/* Active View Indicator */}
          <div className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-300">
            <Layers size={13} className="text-red-400" />
            <span className="capitalize">{activeTab.replace('-', ' ')}</span>
          </div>

          {/* Pending approval badge */}
          {pendingCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping"></span>
              <span>+{pendingCount} Perlu Review</span>
            </div>
          )}

          {/* 0.01s Instant Load Badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
            <CheckCircle2 size={12} className="text-emerald-400" />
            <span>0.01s Instant Cache</span>
          </div>
        </div>

        {/* Right Section: Actions, Theme, Role Selector */}
        <div className="flex items-center gap-2">
          
          {/* Headless GAS Button */}
          <button
            onClick={openGasModal}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition ${
              isGasConnected 
                ? 'border-emerald-600/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50' 
                : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-600'
            }`}
            title="Pengaturan Headless GAS REST API"
          >
            <Database size={13} className={isGasConnected ? 'text-emerald-400' : 'text-slate-400'} />
            <span className="hidden sm:inline">Headless GAS</span>
            <span className={`h-2 w-2 rounded-full ${isGasConnected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
          </button>

          {/* Export PDF Button (Full on sm+, icon on mobile) */}
          <button
            onClick={openExportModal}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-600 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-700 transition"
            title="Export Guideline PDF"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">Export Guideline</span>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white transition"
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-blue-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white transition"
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          {/* RBAC Role Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-xl border px-2 sm:px-2.5 py-1.5 text-xs transition ${getRoleBadgeColor(activeUser.role)}`}
              title={`Peran: ${activeUser.role} (${activeUser.name})`}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white shrink-0">
                {activeUser.avatarText}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="font-semibold">{activeUser.name.split(' ')[0]}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-80">{activeUser.role}</span>
              </div>
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-slate-700 bg-slate-800 p-2 shadow-2xl z-50">
                <div className="flex items-center justify-between px-2 py-1 border-b border-slate-700/80 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Peran (RBAC)
                  </span>
                  {(activeUser.role === 'developer' || activeUser.role === 'bendahara') && (
                    <button
                      onClick={() => {
                        setShowRoleDropdown(false);
                        openUserModal();
                      }}
                      className="text-[10px] text-red-400 hover:underline"
                    >
                      Kelola User
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u);
                        setShowRoleDropdown(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition ${
                        activeUser.id === u.id ? 'bg-red-600/20 text-red-300 font-semibold' : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white">
                        {u.avatarText}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-medium text-white">{u.name}</span>
                        <span className="text-[10px] text-slate-400">{u.division}</span>
                      </div>
                      {activeUser.id === u.id && (
                        <CheckCircle2 size={13} className="ml-auto text-red-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
