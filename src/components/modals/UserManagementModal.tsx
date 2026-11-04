import React, { useState } from 'react';
import { 
  Users, 
  X, 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  Check, 
  Mail, 
  Briefcase 
} from 'lucide-react';
import { UserProfile, Role } from '../../types';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  onAddUser: (user: UserProfile) => void;
  onDeleteUser: (userId: string) => void;
  currentUserRole: Role;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  users,
  onAddUser,
  onDeleteUser,
  currentUserRole
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('admin');
  const [division, setDivision] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const initials = name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();

    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      division: division.trim() || (role === 'client' ? 'Klien Brand' : 'Tim obeecreatives'),
      avatarText: initials || 'U'
    };

    onAddUser(newUser);
    setName('');
    setEmail('');
    setDivision('');
  };

  const getRoleBadge = (r: Role) => {
    switch (r) {
      case 'developer': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'bendahara': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'admin': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'client': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
              <Users size={16} />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white">
                Manajemen Tim &amp; Hak Akses (RBAC)
              </h2>
              <p className="text-[10px] text-slate-400">
                Kelola personil agensi obeecreatives &amp; akun peninjau klien
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Add New User Form */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/60 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <UserPlus size={14} className="text-red-400" />
              <span>Tambah Anggota Tim / Klien Baru</span>
            </h4>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: Rian Pratama"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@obeecreatives.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Peran Akses (Role)</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as Role)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="developer">Lead Creative / Developer (Lalu Mahendra)</option>
                    <option value="bendahara">Bendahara Utama / Director</option>
                    <option value="admin">Senior Designer &amp; Photographer (Admin)</option>
                    <option value="client">Klien / Brand Reviewer (Client)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Divisi / Brand Klien</label>
                  <input
                    type="text"
                    value={division}
                    onChange={e => setDivision(e.target.value)}
                    placeholder="misal: Visual Studio Lead atau Klien Dawana"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-right pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white shadow transition"
                >
                  + Tambahkan Pengguna
                </button>
              </div>
            </form>
          </div>

          {/* User List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Daftar Pengguna Terdaftar ({users.length})
            </h4>

            <div className="space-y-2">
              {users.map(u => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-xl border border-slate-700/80 bg-slate-800/80 p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white border border-slate-600">
                      {u.avatarText}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{u.name}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${getRoleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {u.email} • {u.division}
                      </p>
                    </div>
                  </div>

                  {users.length > 1 && u.id !== 'usr_lalu' && (
                    <button
                      onClick={() => onDeleteUser(u.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700"
                      title="Hapus Pengguna"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 px-6 py-3.5 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Hak Akses dikelola oleh Lead Creative &amp; Bendahara Utama</span>
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
