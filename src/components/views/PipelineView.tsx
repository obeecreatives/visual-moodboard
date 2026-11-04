import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Edit3, 
  Eye, 
  Copy, 
  Trash2, 
  FolderCheck,
  Share2,
  Box,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BriefProject, BriefStatus, PackagingShapeKey } from '../../types';
import { SHAPE_LABELS } from '../../data/shapes';

interface PipelineViewProps {
  briefs: BriefProject[];
  activeBrief: BriefProject | null;
  onSelectBrief: (brief: BriefProject) => void;
  onOpenEditor: (tab: 'brief' | 'mood' | 'mockup' | 'scene' | 'client-review') => void;
  onCreateBrief: (newBrief: Partial<BriefProject>) => void;
  onUpdateStatus: (briefId: string, status: BriefStatus) => void;
  onDuplicateBrief: (brief: BriefProject) => void;
  onDeleteBrief: (briefId: string) => void;
  theme: 'dark' | 'light';
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  briefs,
  activeBrief,
  onSelectBrief,
  onOpenEditor,
  onCreateBrief,
  onUpdateStatus,
  onDuplicateBrief,
  onDeleteBrief,
  theme
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientFilter, setSelectedClientFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Brief Form State
  const [newBrandName, setNewBrandName] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newPackage, setNewPackage] = useState('Full Branding & Foto Produk');
  const [newCategory, setNewCategory] = useState('Food & Beverages');
  const [newShape, setNewShape] = useState<PackagingShapeKey>('box');

  const uniqueClients = Array.from(new Set(briefs.map(b => b.clientName)));

  const filteredBriefs = briefs.filter(b => {
    const matchSearch = 
      b.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.briefNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchClient = selectedClientFilter === 'ALL' || b.clientName === selectedClientFilter;
    const matchStatus = selectedStatusFilter === 'ALL' || b.status === selectedStatusFilter;

    return matchSearch && matchClient && matchStatus;
  });

  const columns: { status: BriefStatus; title: string; count: number; color: string; badge: string }[] = [
    { status: 'draft', title: '1. Draft Konsep', count: briefs.filter(b => b.status === 'draft').length, color: 'border-slate-500/40 text-slate-400', badge: 'bg-slate-500/15 text-slate-400' },
    { status: 'review_internal', title: '2. Review Tim obee', count: briefs.filter(b => b.status === 'review_internal').length, color: 'border-blue-500/40 text-blue-400', badge: 'bg-blue-500/15 text-blue-400' },
    { status: 'waiting_client', title: '3. Request Approval Klien', count: briefs.filter(b => b.status === 'waiting_client').length, color: 'border-amber-500/40 text-amber-400', badge: 'bg-amber-500/15 text-amber-400' },
    { status: 'approved', title: '4. Approved / Siap Cetak & Foto', count: briefs.filter(b => b.status === 'approved').length, color: 'border-emerald-500/40 text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-400' }
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    onCreateBrief({
      brandName: newBrandName.trim(),
      clientName: newClientName.trim() || newBrandName.trim(),
      packageName: newPackage,
      category: newCategory,
      mockupConfig: {
        shape: newShape,
        color: '#C9B896',
        scene: 'studio-light',
        logo: null,
        logoScale: 0.8,
        logoX: 0,
        logoY: -10,
        logoRot: 0,
        prodName: newBrandName.toUpperCase(),
        prodTag: newCategory.toUpperCase(),
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
      }
    });

    setNewBrandName('');
    setNewClientName('');
    setShowNewModal(false);
  };

  const getStatusBadge = (status: BriefStatus) => {
    switch (status) {
      case 'draft': return { label: 'Draft', class: 'bg-slate-500/15 text-slate-400 border-slate-500/30' };
      case 'review_internal': return { label: 'Review Tim', class: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
      case 'waiting_client': return { label: 'Menunggu Klien', class: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      case 'revision': return { label: 'Revisi Klien', class: 'bg-rose-500/15 text-rose-400 border-rose-500/30' };
      case 'approved': return { label: 'Approved ✓', class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter & Action Bar (Matching obeecreatives screenshot) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/80 bg-slate-900 p-4 shadow-sm">
        
        {/* Search input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari ide, tema, klien, atau brand packaging..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:border-red-500 focus:outline-none"
          />
        </div>

        {/* Filter Client Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden md:inline">Klien:</span>
          <select
            value={selectedClientFilter}
            onChange={e => setSelectedClientFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 focus:border-red-500 focus:outline-none"
          >
            <option value="ALL">Semua Klien ({uniqueClients.length})</option>
            {uniqueClients.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden md:inline">Status:</span>
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 focus:border-red-500 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="review_internal">Review Tim</option>
            <option value="waiting_client">Menunggu Klien</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        {/* Action Button: Tambah Brief Baru */}
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-900/30 transition"
        >
          <Plus size={15} />
          <span>+ Buat Brief Baru</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Proyek Brand</span>
            <FolderCheck size={16} className="text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-white">{briefs.length}</div>
          <div className="mt-1 text-[10px] text-emerald-400">Tersimpan di Cache 0.01s</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between text-xs text-amber-400">
            <span>Menunggu Approval</span>
            <Clock size={16} className="text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-amber-400">
            {briefs.filter(b => b.status === 'waiting_client').length}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">Perlu konfirmasi klien</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between text-xs text-blue-400">
            <span>Review Desain Tim</span>
            <Edit3 size={16} className="text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-blue-400">
            {briefs.filter(b => b.status === 'review_internal').length}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">Tim kreatif obeecreatives</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between text-xs text-emerald-400">
            <span>Approved &amp; Siap Foto</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-emerald-400">
            {briefs.filter(b => b.status === 'approved').length}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">Klien sepakat 100%</div>
        </div>
      </div>

      {/* Kanban Board by Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map(col => {
          const colBriefs = filteredBriefs.filter(b => {
            if (col.status === 'draft') return b.status === 'draft';
            if (col.status === 'review_internal') return b.status === 'review_internal' || b.status === 'revision';
            if (col.status === 'waiting_client') return b.status === 'waiting_client';
            if (col.status === 'approved') return b.status === 'approved';
            return false;
          });

          return (
            <div key={col.status} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 p-3 min-h-[460px]">
              
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 px-1">
                <span className="font-semibold text-xs text-slate-200">{col.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${col.badge}`}>
                  {colBriefs.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colBriefs.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-800 py-10 text-center text-xs text-slate-500">
                    Tidak ada brief di tahap ini
                  </div>
                ) : (
                  colBriefs.map(b => {
                    const isSelected = activeBrief?.id === b.id;
                    const badge = getStatusBadge(b.status);

                    return (
                      <div
                        key={b.id}
                        onClick={() => onSelectBrief(b)}
                        className={`group cursor-pointer rounded-xl border p-3.5 transition-all shadow-sm ${
                          isSelected
                            ? 'border-red-500 bg-slate-800/90 ring-1 ring-red-500/40'
                            : 'border-slate-700/80 bg-slate-800/60 hover:border-slate-600 hover:bg-slate-800'
                        }`}
                      >
                        {/* Card Header: Client & Brief Number */}
                        <div className="flex items-start justify-between gap-1 mb-2">
                          <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider truncate">
                            {b.clientName}
                          </span>
                          <span className="font-mono text-[9px] text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700">
                            {b.briefNumber}
                          </span>
                        </div>

                        {/* Brand Title */}
                        <h4 className="font-display font-bold text-base text-white truncate">
                          {b.brandName}
                        </h4>

                        {/* Package & Category pills */}
                        <div className="flex flex-wrap gap-1 mt-1.5 mb-3">
                          <span className="rounded bg-slate-900/80 text-[10px] text-slate-300 px-2 py-0.5 border border-slate-700">
                            {b.category}
                          </span>
                          <span className="rounded bg-slate-900/80 text-[10px] text-slate-400 px-2 py-0.5 border border-slate-700">
                            {SHAPE_LABELS[b.mockupConfig.shape] || b.mockupConfig.shape}
                          </span>
                        </div>

                        {/* Color swatches strip */}
                        <div className="flex items-center gap-1 mb-3">
                          {b.palette.slice(0, 5).map((hex, idx) => (
                            <span
                              key={idx}
                              className="h-3.5 w-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: hex }}
                              title={hex}
                            />
                          ))}
                          <span className="text-[10px] text-slate-400 ml-1.5">
                            {b.personality.ekonomisMewah > 3 ? 'Premium' : 'Terjangkau'} • {b.jenisLogo.split(' ')[0]}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectBrief(b);
                                onOpenEditor('mockup');
                              }}
                              className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
                              title="Buka Studio Mockup 3D"
                            >
                              <Box size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectBrief(b);
                                onOpenEditor('client-review');
                              }}
                              className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
                              title="Buka Portal Presentasi Klien"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDuplicateBrief(b);
                              }}
                              className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
                              title="Duplikat Proyek"
                            >
                              <Copy size={13} />
                            </button>
                          </div>

                          {/* Move stage dropdown */}
                          <select
                            value={b.status}
                            onClick={e => e.stopPropagation()}
                            onChange={(e) => onUpdateStatus(b.id, e.target.value as BriefStatus)}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-200 focus:outline-none"
                          >
                            <option value="draft">Draft</option>
                            <option value="review_internal">Review Tim</option>
                            <option value="waiting_client">Approval Klien</option>
                            <option value="approved">Approved ✓</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: Tambah Brief Baru */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-200">
            <h3 className="font-display text-lg font-bold text-white mb-1">
              Buat Brief Packaging Baru
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Inisiasi proyek visual identity &amp; kemasan baru untuk klien obeecreatives.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Brand / Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newBrandName}
                  onChange={e => setNewBrandName(e.target.value)}
                  placeholder="Contoh: Dawana Honey, Keripik Inovasi, Kopi Selasar"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Perusahaan / Klien
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={e => setNewClientName(e.target.value)}
                  placeholder="Contoh: PT Herbal Makmur, CV Rasa Nusantara"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Paket Layanan
                  </label>
                  <select
                    value={newPackage}
                    onChange={e => setNewPackage(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="Full Branding & Foto Produk">Full Branding &amp; Foto</option>
                    <option value="Desain Kemasan Saja">Desain Kemasan Saja</option>
                    <option value="Desain Logo Non-Template">Desain Logo Saja</option>
                    <option value="Branding + Social Media">Branding + Sosmed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kategori Lini Produk
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="Food & Beverages">Food &amp; Beverages (F&amp;B)</option>
                    <option value="Snack & Confectionery">Snack &amp; Camilan</option>
                    <option value="Coffee & Beverages">Kopi &amp; Minuman</option>
                    <option value="Skincare & Beauty">Skincare &amp; Kosmetik</option>
                    <option value="Herbal & Farmasi">Herbal &amp; Farmasi</option>
                    <option value="Fashion & Retail">Fashion &amp; Retail</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bentuk Kemasan Awal
                </label>
                <select
                  value={newShape}
                  onChange={e => setNewShape(e.target.value as PackagingShapeKey)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                >
                  {Object.entries(SHAPE_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs text-slate-300 hover:bg-slate-700 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition"
                >
                  Buat Proyek Brief
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
