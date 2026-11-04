import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BriefProject, 
  UserProfile, 
  ActiveTab, 
  Role, 
  BriefStatus,
  PhotoShootConcept 
} from './types';
import { 
  INITIAL_BRIEFS, 
  INITIAL_USERS 
} from './data/presets';
import { INITIAL_SHOOT_CONCEPTS } from './data/photographyPresets';
import { 
  STORAGE_KEY_GAS_URL, 
  STORAGE_KEY_BRIEFS, 
  STORAGE_KEY_ACTIVE_PROJECT_ID, 
  STORAGE_KEY_THEME, 
  STORAGE_KEY_SIDEBAR_COLLAPSED, 
  STORAGE_KEY_ACTIVE_USER,
  DEFAULT_GAS_URL,
  archiveBriefToGas,
  updateBriefStatusGas,
  pingGasEndpoint
} from './services/gasService';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PipelineView } from './components/views/PipelineView';
import { BriefView } from './components/views/BriefView';
import { MoodboardView } from './components/views/MoodboardView';
import { MockupView } from './components/views/MockupView';
import { SceneView } from './components/views/SceneView';
import { PhotoStudioView } from './components/views/PhotoStudioView';
import { ClientReviewView } from './components/views/ClientReviewView';
import { GasCenterModal } from './components/modals/GasCenterModal';
import { UserManagementModal } from './components/modals/UserManagementModal';
import { ExportPdfModal } from './components/modals/ExportPdfModal';
import { 
  FolderKanban, 
  FileText, 
  Palette, 
  Box, 
  Layers, 
  CheckSquare, 
  Check,
  Camera,
  Menu
} from 'lucide-react';

export default function App() {
  // Theme state (Dark mode default matching obeecreatives Workspace OS)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SIDEBAR_COLLAPSED) === 'true';
    } catch {
      return false;
    }
  });

  // Mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('pipeline');

  // Users state
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('obee_workspace_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Active User (RBAC)
  const [activeUser, setActiveUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
      return saved ? JSON.parse(saved) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  // Brief projects state
  const [briefs, setBriefs] = useState<BriefProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BRIEFS);
      return saved ? JSON.parse(saved) : INITIAL_BRIEFS;
    } catch {
      return INITIAL_BRIEFS;
    }
  });

  // Active brief ID
  const [activeBriefId, setActiveBriefId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_PROJECT_ID);
      return saved || briefs[0]?.id || 'brief-dawana-01';
    } catch {
      return briefs[0]?.id || 'brief-dawana-01';
    }
  });

  // Headless GAS URL state
  const [gasUrl, setGasUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GAS_URL);
      return saved && saved.trim() ? saved : DEFAULT_GAS_URL;
    } catch {
      return DEFAULT_GAS_URL;
    }
  });

  // Photography concepts state
  const [shootConcepts, setShootConcepts] = useState<PhotoShootConcept[]>(() => {
    try {
      const saved = localStorage.getItem('obee_shoot_concepts');
      return saved ? JSON.parse(saved) : INITIAL_SHOOT_CONCEPTS;
    } catch {
      return INITIAL_SHOOT_CONCEPTS;
    }
  });

  const [activeShootConceptId, setActiveShootConceptId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('obee_active_shoot_id');
      return saved || shootConcepts[0]?.id || 'shoot-dawana-01';
    } catch {
      return 'shoot-dawana-01';
    }
  });

  const [isGasConnected, setIsGasConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial ping to verify active GAS deployment
  useEffect(() => {
    if (gasUrl) {
      pingGasEndpoint(gasUrl).then(r => {
        setIsGasConnected(r.ok);
      }).catch(() => {
        setIsGasConnected(false);
      });
    }
  }, [gasUrl]);

  // Modals
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync theme with DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {}
  }, [theme]);

  // Persist sidebar collapsed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SIDEBAR_COLLAPSED, String(isSidebarCollapsed));
    } catch {}
  }, [isSidebarCollapsed]);

  // Persist active user
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(activeUser));
    } catch {}
  }, [activeUser]);

  // Persist users list
  useEffect(() => {
    try {
      localStorage.setItem('obee_workspace_users', JSON.stringify(users));
    } catch {}
  }, [users]);

  // Persist briefs list (0.01s Instant Cache)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BRIEFS, JSON.stringify(briefs));
    } catch {}
  }, [briefs]);

  // Persist active brief ID
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_PROJECT_ID, activeBriefId);
    } catch {}
  }, [activeBriefId]);

  // Ping GAS on initial mount if URL exists
  useEffect(() => {
    if (gasUrl) {
      pingGasEndpoint(gasUrl).then((res: { ok: boolean }) => {
        setIsGasConnected(res.ok);
      });
    }
  }, [gasUrl]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const activeBrief = useMemo(() => {
    return briefs.find(b => b.id === activeBriefId) || briefs[0] || null;
  }, [briefs, activeBriefId]);

  const handleUpdateActiveBrief = useCallback((updated: Partial<BriefProject>) => {
    if (!activeBriefId) return;
    setBriefs(prev => prev.map(b => {
      if (b.id === activeBriefId) {
        return {
          ...b,
          ...updated,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    }));
  }, [activeBriefId]);

  // Persist shoot concepts
  useEffect(() => {
    try {
      localStorage.setItem('obee_shoot_concepts', JSON.stringify(shootConcepts));
    } catch {}
  }, [shootConcepts]);

  useEffect(() => {
    try {
      localStorage.setItem('obee_active_shoot_id', activeShootConceptId);
    } catch {}
  }, [activeShootConceptId]);

  const activeShootConcept = useMemo(() => {
    return shootConcepts.find(s => s.id === activeShootConceptId) || shootConcepts[0] || null;
  }, [shootConcepts, activeShootConceptId]);

  const handleUpdateActiveShootConcept = useCallback((updated: PhotoShootConcept) => {
    setShootConcepts(prev => prev.map(sc => sc.id === updated.id ? updated : sc));
    showToast('Konsep photo studio diperbarui!');
  }, [showToast]);

  const handleCreateBrief = useCallback((newBriefData: Partial<BriefProject>) => {
    const year = new Date().getFullYear();
    const count = briefs.length + 1;
    const briefNumber = `OBEE-${year}-${String(count).padStart(3, '0')}`;

    const newProject: BriefProject = {
      id: 'brief_' + Date.now(),
      briefNumber,
      clientName: newBriefData.clientName || 'Klien Baru',
      brandName: newBriefData.brandName || 'Brand Baru',
      packageName: newBriefData.packageName || 'Full Branding & Foto Produk',
      category: newBriefData.category || 'Food & Beverages',
      status: 'draft',
      creatorName: activeUser.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      personality: {
        ekonomisMewah: 3,
        feminimMaskulin: 3,
        tradisionalModern: 3,
        simpleRumit: 3,
        monoFullcolor: 3,
        anakDewasa: 3,
        funSerius: 3
      },
      lookfeel: ['Modern', 'Fresh', 'Clean'],
      jenisLogo: 'Kombinasi Logogram+Logotype',
      bentukIcon: 'Geometris & Presisi',
      targetMarket: {
        economy: 'Menengah Atas',
        age: 'Dewasa'
      },
      visualPhoto: {
        character: 'Normal',
        ratio: 'Square 1:1'
      },
      captionStyle: 'Santai, hangat, jelas',
      notes: '',
      palette: ['#0d0d0d', '#e31e2b', '#ffffff', '#f0f0ee', '#6c6c72'],
      fontDisplay: 'Space Grotesk',
      fontBody: 'Inter',
      keywords: ['modern', 'impactful', 'clean'],
      refImages: [],
      mockupConfig: newBriefData.mockupConfig || {
        shape: 'box',
        color: '#C9B896',
        scene: 'studio-light',
        logo: null,
        logoScale: 0.8,
        logoX: 0,
        logoY: -10,
        logoRot: 0,
        prodName: (newBriefData.brandName || 'BRAND').toUpperCase(),
        prodTag: 'PREMIUM QUALITY',
        textFont: 'Space Grotesk',
        textColor: '#18181a',
        textSize: 15,
        textY: 35,
        texture: 'none',
        textureOpacity: 0.35,
        materialStyle: 'glossy',
        windowEnabled: false,
        extraImages: [],
        extraTexts: []
      },
      sceneConfig: {
        items: [
          { id: 1, shape: 'box', color: '#0d0d0d' },
          { id: 2, shape: 'pouch', color: '#e31e2b' },
          { id: 3, shape: 'zipperpouch', color: '#f0f0ee' }
        ],
        showLogo: true,
        scene: 'studio-light'
      }
    };

    setBriefs(prev => [newProject, ...prev]);
    setActiveBriefId(newProject.id);
    setActiveTab('brief');
    showToast(`Brief baru ${briefNumber} berhasil dibuat!`);
  }, [briefs.length, activeUser.name, showToast]);

  const handleUpdateStatus = useCallback(async (briefId: string, status: BriefStatus) => {
    setBriefs(prev => prev.map(b => {
      if (b.id === briefId) {
        return {
          ...b,
          status,
          verifiedBy: activeUser.name,
          verifiedAt: new Date().toISOString()
        };
      }
      return b;
    }));

    showToast(`Status brief diperbarui ke ${status}`);

    // Silent background sync if GAS is configured
    if (gasUrl) {
      updateBriefStatusGas(gasUrl, briefId, status, activeUser.name).catch(() => {});
    }
  }, [activeUser.name, gasUrl, showToast]);

  const handleDuplicateBrief = useCallback((brief: BriefProject) => {
    const year = new Date().getFullYear();
    const count = briefs.length + 1;
    const briefNumber = `OBEE-${year}-${String(count).padStart(3, '0')}`;

    const duplicated: BriefProject = {
      ...brief,
      id: 'brief_' + Date.now(),
      briefNumber,
      brandName: `${brief.brandName} (Salinan)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBriefs(prev => [duplicated, ...prev]);
    setActiveBriefId(duplicated.id);
    showToast(`Proyek berhasil diduplikasi: ${briefNumber}`);
  }, [briefs.length, showToast]);

  const handleDeleteBrief = useCallback((briefId: string) => {
    if (briefs.length <= 1) {
      alert('Tidak bisa menghapus brief terakhir.');
      return;
    }
    if (confirm('Yakin ingin menghapus brief ini?')) {
      setBriefs(prev => prev.filter(b => b.id !== briefId));
      if (activeBriefId === briefId) {
        const remaining = briefs.filter(b => b.id !== briefId);
        if (remaining[0]) setActiveBriefId(remaining[0].id);
      }
      showToast('Brief berhasil dihapus dari database.');
    }
  }, [briefs, activeBriefId, showToast]);

  const handleManualSync = async () => {
    if (!gasUrl.trim()) {
      setIsGasModalOpen(true);
      return;
    }

    setIsSyncing(true);
    try {
      if (activeBrief) {
        const res = await archiveBriefToGas(gasUrl, activeBrief);
        if (res.ok) {
          setIsGasConnected(true);
          showToast(`Berhasil disinkronkan ke Google Sheet (Baris ${res.row || 'OK'})!`);
        } else {
          showToast(`Gagal sinkron: ${res.error || 'Periksa koneksi'}`);
        }
      }
    } catch (err: unknown) {
      showToast(`Error sinkronisasi: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveGasUrl = (url: string) => {
    setGasUrl(url);
    try {
      localStorage.setItem(STORAGE_KEY_GAS_URL, url);
    } catch {}
    if (url) {
      pingGasEndpoint(url).then((r: { ok: boolean }) => {
        setIsGasConnected(r.ok);
        showToast(r.ok ? 'Endpoint GAS Aktif & Terhubung!' : 'Endpoint tersimpan.');
      });
    }
  };

  const handleClientApprove = (notes: string) => {
    if (!activeBrief) return;
    handleUpdateActiveBrief({
      status: 'approved',
      approvalNotes: notes,
      verifiedBy: activeUser.name,
      verifiedAt: new Date().toISOString()
    });

    showToast('Guideline visual berhasil disetujui 100%! 🎉');

    if (gasUrl) {
      updateBriefStatusGas(gasUrl, activeBrief.id, 'approved', activeUser.name).catch(() => {});
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col`}>
      
      {/* Top Header matching obeecreatives screenshot */}
      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        activeUser={activeUser}
        users={users}
        onSelectUser={setActiveUser}
        openGasModal={() => setIsGasModalOpen(true)}
        openExportModal={() => setIsExportModalOpen(true)}
        openUserModal={() => setIsUserModalOpen(true)}
        isGasConnected={isGasConnected}
        activeBrief={activeBrief}
        allBriefs={briefs}
        onSelectBrief={b => {
          setActiveBriefId(b.id);
          showToast(`Aktif: ${b.brandName}`);
        }}
        activeTab={activeTab}
      />

      {/* Main Body with Sidebar */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* Left Sidebar (Desktop Sticky + Mobile Drawer) */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openGasModal={() => setIsGasModalOpen(true)}
          openUserModal={() => setIsUserModalOpen(true)}
          onManualSync={handleManualSync}
          isSyncing={isSyncing}
          isGasConnected={isGasConnected}
          userRole={activeUser.role}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Canvas */}
        <main className="flex-1 min-w-0 overflow-y-auto p-3 sm:p-5 md:p-6 pb-24 md:pb-8">
          
          {activeTab === 'pipeline' && (
            <PipelineView
              briefs={briefs}
              activeBrief={activeBrief}
              onSelectBrief={b => {
                setActiveBriefId(b.id);
                showToast(`Proyek dipilih: ${b.brandName}`);
              }}
              onOpenEditor={tab => setActiveTab(tab)}
              onCreateBrief={handleCreateBrief}
              onUpdateStatus={handleUpdateStatus}
              onDuplicateBrief={handleDuplicateBrief}
              onDeleteBrief={handleDeleteBrief}
              theme={theme}
            />
          )}

          {activeTab === 'brief' && activeBrief && (
            <BriefView
              brief={activeBrief}
              onUpdateBrief={handleUpdateActiveBrief}
              theme={theme}
            />
          )}

          {activeTab === 'mood' && activeBrief && (
            <MoodboardView
              brief={activeBrief}
              onUpdateBrief={handleUpdateActiveBrief}
              theme={theme}
            />
          )}

          {activeTab === 'mockup' && activeBrief && (
            <MockupView
              brief={activeBrief}
              onUpdateBrief={handleUpdateActiveBrief}
              theme={theme}
            />
          )}

          {activeTab === 'scene' && activeBrief && (
            <SceneView
              brief={activeBrief}
              onUpdateBrief={handleUpdateActiveBrief}
              theme={theme}
            />
          )}

          {activeTab === 'photo-studio' && activeShootConcept && (
            <PhotoStudioView
              currentConcept={activeShootConcept}
              onUpdateConcept={handleUpdateActiveShootConcept}
              availableBriefs={briefs}
              userRole={activeUser.role}
              darkMode={theme === 'dark'}
              onTriggerSync={handleManualSync}
            />
          )}

          {activeTab === 'client-review' && activeBrief && (
            <ClientReviewView
              brief={activeBrief}
              currentUser={activeUser}
              onUpdateBrief={handleUpdateActiveBrief}
              onApprove={handleClientApprove}
              openExportModal={() => setIsExportModalOpen(true)}
              theme={theme}
            />
          )}

        </main>
      </div>

      {/* Ergonomic Floating Bottom Navigation Bar for Mobile Phones & Tablets */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-1 py-1.5 text-slate-400 pb-[calc(0.35rem+env(safe-area-inset-bottom))] shadow-2xl">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl transition-all ${
            activeTab === 'pipeline' 
              ? 'text-white bg-red-600/20 font-bold' 
              : 'hover:text-slate-200'
          }`}
          aria-label="Pipeline Kanban"
        >
          <FolderKanban size={18} className={activeTab === 'pipeline' ? 'text-red-500' : 'text-slate-400'} />
          <span className="text-[10px] mt-0.5 leading-none">Pipeline</span>
        </button>

        <button
          onClick={() => setActiveTab('brief')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl transition-all ${
            activeTab === 'brief' 
              ? 'text-white bg-red-600/20 font-bold' 
              : 'hover:text-slate-200'
          }`}
          aria-label="Brief & Legalitas"
        >
          <FileText size={18} className={activeTab === 'brief' ? 'text-red-500' : 'text-slate-400'} />
          <span className="text-[10px] mt-0.5 leading-none">Brief</span>
        </button>

        <button
          onClick={() => setActiveTab('mood')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl transition-all ${
            activeTab === 'mood' 
              ? 'text-white bg-red-600/20 font-bold' 
              : 'hover:text-slate-200'
          }`}
          aria-label="Moodboard Studio"
        >
          <Palette size={18} className={activeTab === 'mood' ? 'text-red-500' : 'text-slate-400'} />
          <span className="text-[10px] mt-0.5 leading-none">Mood</span>
        </button>

        <button
          onClick={() => setActiveTab('mockup')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl transition-all ${
            activeTab === 'mockup' 
              ? 'text-white bg-red-600/20 font-bold' 
              : 'hover:text-slate-200'
          }`}
          aria-label="Mockup Kemasan 3D"
        >
          <Box size={18} className={activeTab === 'mockup' ? 'text-red-500' : 'text-slate-400'} />
          <span className="text-[10px] mt-0.5 leading-none">Mockup</span>
        </button>

        <button
          onClick={() => setActiveTab('photo-studio')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl transition-all ${
            activeTab === 'photo-studio' 
              ? 'text-white bg-rose-600/25 font-bold ring-1 ring-rose-500/40' 
              : 'hover:text-slate-200'
          }`}
          aria-label="Photo Studio OS"
        >
          <Camera size={18} className={activeTab === 'photo-studio' ? 'text-rose-400' : 'text-slate-400'} />
          <span className="text-[10px] mt-0.5 leading-none">Photo</span>
        </button>

        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl transition-all hover:text-white"
          aria-label="Buka Menu Lengkap"
        >
          <Menu size={18} className="text-slate-400" />
          <span className="text-[10px] mt-0.5 leading-none">Menu</span>
        </button>
      </nav>

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white shadow-2xl animate-bounce">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Headless GAS Center Modal */}
      <GasCenterModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        gasUrl={gasUrl}
        onSaveGasUrl={handleSaveGasUrl}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
        isGasConnected={isGasConnected}
      />

      {/* User Management RBAC Modal */}
      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        users={users}
        onAddUser={newUser => {
          setUsers(prev => [...prev, newUser]);
          showToast(`Pengguna ${newUser.name} berhasil ditambahkan!`);
        }}
        onDeleteUser={userId => {
          setUsers(prev => prev.filter(u => u.id !== userId));
          showToast('Pengguna dihapus.');
        }}
        currentUserRole={activeUser.role}
      />

      {/* Export PDF Modal */}
      {activeBrief && (
        <ExportPdfModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          brief={activeBrief}
          gasUrl={gasUrl}
        />
      )}

    </div>
  );
}
