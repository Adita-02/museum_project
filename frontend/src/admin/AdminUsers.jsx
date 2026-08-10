import { useState, useEffect, useMemo, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Users, User, Mail, Calendar, Search, Trash2, Shield,
  AlertCircle, X, CheckCircle2, Crown, Sparkles, UserPlus
} from 'lucide-react';

/* ─────────────────────────────  helpers  ───────────────────────────── */

const initialsOf = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || '')
    .join('') || '?';

const gradientFor = (seed = '') => {
  const palettes = [
    'from-amber-400 to-amber-600',
    'from-yellow-400 to-amber-500',
    'from-amber-300 to-yellow-600',
    'from-yellow-500 to-amber-600',
    'from-amber-500 to-yellow-500',
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
};

const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

/* ─────────────────────────────  toast  ────────────────────────────── */

function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="fixed top-5 right-5 z-[120] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 min-w-[300px] max-w-sm
            px-5 py-4 rounded-2xl border shadow-2xl backdrop-blur-xl
            animate-[slideIn_.3s_ease-out]
            ${
              t.type === 'success'
                ? 'bg-neutral-900/90 border-amber-500/30 text-neutral-200'
                : t.type === 'error'
                ? 'bg-neutral-900/90 border-red-500/40 text-red-200'
                : 'bg-neutral-900/90 border-neutral-700/50 text-neutral-200'
            }`}
        >
          {t.type === 'success' && <CheckCircle2 size={20} className="text-amber-400 mt-0.5 shrink-0" />}
          {t.type === 'error' && <AlertCircle size={20} className="text-red-400 mt-0.5 shrink-0" />}
          <span className="text-sm font-medium leading-relaxed flex-1">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100 transition-opacity p-1 hover:bg-neutral-800 rounded-lg">
            <X size={16} />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn { 
          from { opacity:0; transform: translateY(-12px) translateX(12px) scale(0.95); } 
          to { opacity:1; transform:none; } 
        }
      `}</style>
    </div>
  );
}

/* ───────────────────────────  confirm modal  ───────────────────────── */

function ConfirmModal({ open, title, message, confirmText = 'Delete', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm animate-[fadeIn_.2s_ease-out]"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md bg-neutral-900/90 border border-neutral-800/80 
        backdrop-blur-xl rounded-3xl shadow-2xl p-8 animate-[pop_.2s_ease-out]">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Trash2 size={24} className="text-red-400" />
          </div>
          <div className="flex-1 mt-1">
            <h3 className="text-neutral-100 text-xl font-semibold tracking-tight">{title}</h3>
            <p className="text-neutral-400 text-sm mt-2 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-300
              bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
              bg-gradient-to-r from-red-500 to-red-600 hover:brightness-110
              shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)] transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes pop    { from { opacity:0; transform: scale(.95) translateY(10px) } to { opacity:1; transform: scale(1) translateY(0) } }
      `}</style>
    </div>
  );
}

/* ─────────────────────  skeleton row  ───────────────────── */

function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 gap-4 pl-10 pr-6 py-5 border-t border-neutral-800/60 items-center">
      <div className="col-span-4 flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl shimmer shrink-0" />
        <div className="space-y-2 w-full">
          <div className="h-4 w-32 rounded-md shimmer" />
          <div className="h-3 w-20 rounded-md shimmer" />
        </div>
      </div>
      <div className="col-span-3"><div className="h-4 w-40 rounded-md shimmer" /></div>
      <div className="col-span-2"><div className="h-6 w-20 rounded-full shimmer" /></div>
      <div className="col-span-2"><div className="h-4 w-24 rounded-md shimmer" /></div>
      <div className="col-span-1 flex justify-center"><div className="h-9 w-9 rounded-xl shimmer" /></div>
      <style>{`
        .shimmer {
          background: linear-gradient(90deg, rgba(38,38,38,0.5) 0%, rgba(245,158,11,0.08) 50%, rgba(38,38,38,0.5) 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

const ROLE_FILTERS = [
  { id: 'all',     label: 'All',     icon: Users },
  { id: 'admin',   label: 'Admins',  icon: Crown },
  { id: 'user',    label: 'Members', icon: User },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();

  /* toasts */
  const [toasts, setToasts] = useState([]);
  const toastSeq = useRef(0);
  const pushToast = (message, type = 'info') => {
    const id = ++toastSeq.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  };
  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  /* confirm modal */
  const [pending, setPending] = useState(null);
  const askDelete = (id, name) => setPending({ id, name });
  const cancelDelete = () => setPending(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('We couldn\'t reach the users service. Please retry.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!pending) return;
    const { id, name } = pending;
    try {
      await api.delete(`/users/${id}`);
      setUsers((u) => u.filter((x) => x._id !== id));
      pushToast(`User "${name}" was deleted successfully.`, 'success');
    } catch (err) {
      console.error('Error deleting user:', err);
      const message = err?.response?.data?.message || 'Failed to delete user.';
      pushToast(message, 'error');
    } finally {
      setPending(null);
    }
  };

  /* derived stats */
  const stats = useMemo(() => {
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;
    const admins = users.filter((u) => u.role === 'admin').length;
    const newThisWeek = users.filter(
      (u) => u.createdAt && now - new Date(u.createdAt).getTime() < week,
    ).length;
    return {
      total: users.length,
      admins,
      members: users.length - admins,
      newThisWeek,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return users.filter((u) => {
      const matchesText =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesText && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  /* ─────────────────────────────  render  ───────────────────────────── */

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans space-y-10">

      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide">
            <Sparkles size={14} className="text-amber-500" /> Admin Console
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-tight">
            Users
          </h2>
          <p className="text-neutral-400 text-lg max-w-xl leading-relaxed">
            Manage every registered member of the museum. Search, filter, and curate with care.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-neutral-400 bg-neutral-900/60
          px-6 py-4 rounded-2xl border border-neutral-800/60 backdrop-blur-xl shadow-lg">
          <Users size={20} className="text-amber-400" />
          <span className="font-bold text-neutral-200 text-xl">{stats.total}</span>
          <span className="text-sm font-medium">registered</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={Users}     label="Total"     value={stats.total}        />
        <StatCard icon={Crown}     label="Admins"    value={stats.admins}       />
        <StatCard icon={User}      label="Members"   value={stats.members}      />
        <StatCard icon={UserPlus}  label="New / 7d"  value={stats.newThisWeek}  highlight />
      </div>

      {/* Info alert */}
      <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl
        backdrop-blur-md flex items-center gap-4">
        <div className="p-2 bg-amber-500/20 rounded-full shrink-0">
          <Shield size={20} className="text-amber-400" />
        </div>
        <p className="text-sm text-amber-300/90 font-medium leading-relaxed">
          You can't delete your own administrator account from this panel.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl
          text-red-300 flex items-center justify-between gap-5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-500/20 rounded-full shrink-0">
              <AlertCircle size={20} className="text-red-400" />
            </div>
            <span className="text-sm font-medium leading-relaxed">{error}</span>
          </div>
          <button
            onClick={fetchUsers}
            className="px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm
              font-semibold hover:bg-red-500 hover:text-white transition-all shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* ─── Toolbar ─── */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5 pointer-events-none transition-colors group-focus-within:text-amber-400"
          />
          <input
            type="text"
            placeholder="Search members by name or email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-14 pr-6 py-4 bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl text-neutral-200 placeholder-neutral-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 focus:bg-neutral-900/80 shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-neutral-900/50 border border-neutral-800
          rounded-2xl backdrop-blur-xl self-start flex-wrap">
          {ROLE_FILTERS.map(({ id, label, icon: Icon }) => {
            const active = roleFilter === id;
            return (
              <button
                key={id}
                onClick={() => setRoleFilter(id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold
                  transition-all whitespace-nowrap
                  ${
                    active
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-[0_0_20px_-5px_rgba(217,119,6,0.4)]'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                  }`}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/60 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div>
              <div className="grid grid-cols-12 gap-4 pl-10 pr-6 py-5 text-neutral-400
                uppercase text-xs font-semibold tracking-widest border-b border-neutral-800/60 bg-neutral-950/50">
                <div className="col-span-4">User</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Joined</div>
                <div className="col-span-1 text-center">Actions</div>
              </div>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-950/50 border-b border-neutral-800/60">
                  <th className="pl-10 pr-6 py-5 text-xs font-semibold text-neutral-400 uppercase tracking-widest">User</th>
                  <th className="px-6 py-5 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-5 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-5 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-5 text-xs font-semibold text-neutral-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-24 text-center">
                      <EmptyState
                        hasFilter={Boolean(searchTerm || roleFilter !== 'all')}
                        onReset={() => { setSearchTerm(''); setRoleFilter('all'); }}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, idx) => {
                    const isCurrent = currentUser && currentUser._id === u._id;
                    const grad = gradientFor(u.name || u.email || u._id);
                    return (
                      <tr
                        key={u._id}
                        className={`group transition-all duration-200
                          animate-[fadeUp_.35s_ease-out_both]
                          ${
                            isCurrent
                              ? 'bg-amber-500/[0.03] hover:bg-amber-500/[0.05]'
                              : 'hover:bg-neutral-800/40'
                          }`}
                        style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
                      >
                        <td className="pl-10 pr-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4 min-w-0">
                            <div
                              className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center
                                font-bold text-sm bg-gradient-to-br ${grad}
                                ${isCurrent ? 'border-2 border-amber-400 shadow-[0_0_15px_-3px_rgba(245,158,11,0.4)]' : 'border border-neutral-800 shadow-sm'}
                                text-neutral-950 transition-transform group-hover:scale-105`}
                            >
                              {initialsOf(u.name)}
                            </div>
                            <div className="min-w-0 space-y-1">
                              <div className={`font-semibold text-lg truncate flex items-center gap-2 transition-colors ${
                                isCurrent ? 'text-amber-400' : 'text-neutral-200 group-hover:text-amber-400'
                              }`}>
                                {u.name || 'Unknown'}
                                {isCurrent && (
                                  <span className="text-[10px] uppercase tracking-widest font-bold
                                    px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10
                                    text-amber-400">
                                    you
                                  </span>
                                )}
                              </div>
                              {u._id && (
                                <div className="text-xs text-neutral-500 font-mono truncate">
                                  #{String(u._id).slice(-8)}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-neutral-400">
                          <div className="flex items-center gap-3">
                            <Mail size={16} className="text-neutral-500 shrink-0" />
                            <span className="truncate font-medium">{u.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {u.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                              text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                              <Crown size={12} /> Admin
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1.5 rounded-full
                              text-xs font-medium bg-neutral-800 text-neutral-400
                              border border-neutral-700/50">
                              Member
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-neutral-400 text-sm">
                          <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-neutral-500 shrink-0" />
                            <span className="font-medium">{fmt(u.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            {isCurrent ? (
                              <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                                <Shield size={14} />
                                <span>Protected</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => askDelete(u._id, u.name)}
                                className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)] transition-all duration-300 opacity-80 group-hover:opacity-100"
                                title="Delete user"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} dismiss={dismissToast} />
      <ConfirmModal
        open={Boolean(pending)}
        title="Delete this user?"
        message={
          pending
            ? `This action permanently removes "${pending.name}" from the museum registry. It cannot be undone.`
            : ''
        }
        confirmText="Yes, delete"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform:none; } }
      `}</style>
    </div>
  );
}

/* ───────────────────────  small reusable card  ─────────────────────── */

function StatCard({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 border border-neutral-800/60
      bg-neutral-900/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
      ${highlight ? 'ring-1 ring-amber-500/30 shadow-[0_0_30px_-10px_rgba(245,158,11,0.15)]' : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent pointer-events-none" />
      <div className="relative flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-widest text-neutral-500 font-bold">{label}</p>
          <p className="text-3xl font-bold text-neutral-200 tracking-tight">{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border
          ${highlight ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-neutral-800/80 border-neutral-700/50 text-neutral-400'}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────  empty state  ────────────────────────── */

function EmptyState({ hasFilter, onReset }) {
  return (
    <div className="flex flex-col items-center gap-4 text-neutral-400">
      <div className="w-16 h-16 rounded-full bg-neutral-800/50 border border-neutral-700/50
        flex items-center justify-center">
        <Users size={28} className="text-neutral-500" />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-xl font-semibold text-neutral-200">
          {hasFilter ? 'No members found' : 'No users registered yet'}
        </p>
        <p className="text-sm">
          {hasFilter ? 'Try adjusting your search or filters.' : 'When users sign up, they will appear here.'}
        </p>
      </div>
      {hasFilter && (
        <button
          onClick={onReset}
          className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold
            bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white transition-all border border-amber-500/20"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}