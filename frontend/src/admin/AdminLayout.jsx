import { Outlet, Link, useLocation, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

import {
  LayoutDashboard,
  Landmark,
  Receipt,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  Sparkles,
  Command,
  Crown,
  Shield,
  Users,
  MapPin,
  Star,
  Lightbulb,
  ShoppingCart,
  Building2,
  Globe,
  Mountain,
  MessageSquare,  
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

// ─── Sidebar Emblem (rotating rings + Æ seal) ──────────────────
function SidebarEmblem() {
  return (
    <div className="sidebar-emblem" aria-hidden="true">
      <svg viewBox="0 0 56 56" className="mini-spin">
        <circle cx="28" cy="28" r="24" fill="none"
                stroke="rgba(232,213,154,.85)" strokeWidth=".9"
                strokeDasharray="1 4" strokeLinecap="round"/>
      </svg>
      <svg viewBox="0 0 56 56" className="mini-spin-rev">
        <circle cx="28" cy="28" r="19" fill="none"
                stroke="rgba(201,168,76,.6)" strokeWidth=".7"
                strokeDasharray="5 2.5"/>
      </svg>
      <svg viewBox="0 0 56 56" className="mini-spin-slow">
        <circle cx="28" cy="4"  r="1.5" fill="#e8d59a"/>
        <circle cx="28" cy="52" r="1.5" fill="#e8d59a"/>
        <circle cx="4"  cy="28" r="1.5" fill="#e8d59a"/>
        <circle cx="52" cy="28" r="1.5" fill="#e8d59a"/>
      </svg>
      <div className="mini-ring-bg" />
      <div className="mini-orbit" />
      <div className="mini-seal">Æ</div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const navItems = useMemo(
    () => [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview' },
      { to: '/admin/artifacts', label: 'Artifacts', icon: Landmark, description: 'Museum pieces' },
      { to: '/admin/civilizations', label: 'Civilizations', icon: Building2, description: 'Historical eras' },
      { to: '/admin/content?region=asia', label: 'Asia', icon: Globe, description: 'Asia places' },
      { to: '/admin/content?region=africa', label: 'Africa', icon: Mountain, description: 'Africa content' },
      { to: '/admin/orders', label: 'Orders', icon: ShoppingCart, description: 'Customer orders' },
      { to: '/admin/users', label: 'Users', icon: Users, description: 'System users' },
      { to: '/admin/reviews', label: 'Reviews', icon: Star, description: 'Customer feedback' },
      { to: '/admin/suggestions', label: 'Suggestions', icon: Lightbulb, description: 'User ideas' },
      { to: '/admin/moderation', label: 'Moderation', icon: MessageSquare, description: 'Reacts, comments & shares' },
      { to: '/admin/settings', label: 'Settings', icon: Settings, description: 'Configuration' },
    ],
    []
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0805] text-[#e8e1d9] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-serif text-2xl text-[#f5d77f]">Admin Access Required</h1>
        <p className="text-[#99907e] max-w-sm">This account does not have admin access.</p>
        <Link to="/" className="bg-[#e6c364] text-[#1a1208] font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition">
          Go Home
        </Link>
      </div>
    );
  }

  const isActive = (path) => {
    const [pathOnly, queryOnly] = path.split('?');
    if (pathOnly !== location.pathname) return false;
    if (!queryOnly) return !location.search; // plain path must have no query to match
    const currentParams = new URLSearchParams(location.search);
    const targetParams = new URLSearchParams(queryOnly);
    for (const [key, value] of targetParams) {
      if (currentParams.get(key) !== value) return false;
    }
    return true;
  };

  const matchedPage = navItems.find((item) => isActive(item.to));
  const currentPage =
    matchedPage ||
    (location.pathname === '/admin/content'
      ? { label: 'Content', description: 'Region content manager', icon: Globe }
      : navItems[0]);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex h-screen bg-[#0a0805] text-[#e8e1d9] font-sans overflow-hidden relative">
      {/* Ambient background pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #e6c364 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient gradient orbs */}
      <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-[#e6c364]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-64 w-96 h-96 bg-[#93000a]/[0.05] rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar – width adjusted to w-64 for better proportion */}
      <aside className="w-64 bg-gradient-to-b from-[#1c1510]/95 via-[#1a130c]/95 to-[#14100a]/95 backdrop-blur-xl border-r border-[#4d4637]/30 flex flex-col shadow-2xl flex-shrink-0 relative z-10">
        {/* Brand – now with rotating emblem */}
        <div className="px-5 pt-6 pb-5 border-b border-[#4d4637]/20">
          <div className="flex items-center gap-3">
            <SidebarEmblem />  {/* ← এখানে এমব্লেম যোগ করা হয়েছে */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-[#f5d77f] font-serif tracking-wide leading-none">
                Museum Admin
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#99907e] mt-1.5 font-semibold">
                Royal Collection
              </p>
            </div>
          </div>
        </div>

        {/* Navigation – badges removed */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`
                  group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 ease-out
                  ${
                    active
                      ? 'bg-gradient-to-r from-[#e6c364]/15 to-transparent text-[#f5d77f]'
                      : 'text-[#b5a890] hover:bg-[#37342f]/40 hover:text-[#e8e1d9]'
                  }
                `}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-gradient-to-b from-[#f5d77f] to-[#b8943f] rounded-r-full shadow-lg shadow-[#e6c364]/50" />
                )}
                <span
                  className={`
                    flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300
                    ${
                      active
                        ? 'bg-gradient-to-br from-[#e6c364] to-[#b8943f] text-[#1a1208] shadow-md shadow-[#e6c364]/40'
                        : 'bg-[#2a241c]/60 text-[#b5a890] group-hover:bg-[#37342f] group-hover:text-[#e6c364] group-hover:scale-110'
                    }
                  `}
                >
                  <Icon size={17} strokeWidth={2.3} />
                </span>
                <span className="flex-1 font-medium text-[14px] tracking-wide">
                  {label}
                </span>
                {/* Badge removed */}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="border-t border-[#4d4637]/30 p-4">
          <div className="group flex items-center gap-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-[#2a241c]/80 to-[#22180f]/60 border border-[#4d4637]/30 hover:border-[#e6c364]/30 transition-all duration-300 cursor-pointer">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#e6c364]/30 to-[#93000a]/20 flex items-center justify-center border border-[#e6c364]/40">
                <Crown className="text-[#e6c364]" size={20} strokeWidth={2.2} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#22c55e] rounded-full border-2 border-[#1c1510]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-[#f5e6c4] truncate">
                  {user?.name || 'Admin'}
                </p>
                <Shield size={11} className="text-[#e6c364] flex-shrink-0" />
              </div>
              <p className="text-[11px] text-[#99907e] truncate">
                {user?.email || 'admin@museum.com'}
              </p>
            </div>
            <ChevronRight
              size={16}
              className="text-[#7a715f] group-hover:text-[#e6c364] group-hover:translate-x-0.5 transition-all"
            />
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#93000a]/20 to-[#93000a]/10 hover:from-[#93000a]/40 hover:to-[#93000a]/30 text-[#ffb4ab] py-2.5 rounded-xl transition-all duration-300 text-sm font-medium border border-[#ffb4ab]/15 hover:border-[#ffb4ab]/40 hover:shadow-lg hover:shadow-[#93000a]/20 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-700 ease-out" />
            <LogOut size={16} className="relative group-hover:-translate-x-0.5 transition-transform" />
            <span className="relative">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="h-16 px-8 flex items-center justify-between border-b border-[#4d4637]/20 bg-[#0d0b07]/40 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1c1510]/60 border border-[#4d4637]/30">
              <currentPage.icon size={15} className="text-[#e6c364]" strokeWidth={2.3} />
              <h1 className="text-[14px] font-semibold text-[#f5e6c4] tracking-wide">
                {currentPage.label}
              </h1>
            </div>
            <span className="text-[12px] text-[#99907e] hidden sm:flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#e6c364]/60" />
              {currentPage.description}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button className="relative h-9 w-9 rounded-xl bg-[#1c1510]/80 border border-[#4d4637]/30 hover:border-[#e6c364]/30 hover:bg-[#22180f] flex items-center justify-center transition-all duration-300 group">
              <Bell
                size={16}
                className="text-[#b5a890] group-hover:text-[#e6c364] group-hover:rotate-[15deg] transition-all duration-300"
              />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#e6c364] rounded-full">
                <span className="absolute inset-0 bg-[#e6c364] rounded-full animate-ping opacity-75" />
              </span>
            </button>

            <div className="hidden lg:flex flex-col items-end px-3 py-1 rounded-xl bg-[#1c1510]/40 border border-[#4d4637]/20">
              <span className="text-[10px] text-[#99907e] font-medium leading-tight">
                {formattedDate}
              </span>
              <span className="text-[12px] font-semibold text-[#e8e1d9] tabular-nums leading-tight">
                {formattedTime}
              </span>
            </div>

            <div className="h-6 w-px bg-[#4d4637]/30 mx-1" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-[#0a0805] relative">
          <Outlet />
        </main>
      </div>

      {/* Logout modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          <div className="bg-gradient-to-br from-[#1c1510] to-[#14100a] border border-[#4d4637]/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            style={{ animation: 'slideUp 0.25s ease-out' }}
          >
            <div className="w-12 h-12 rounded-xl bg-[#93000a]/20 border border-[#93000a]/30 flex items-center justify-center mb-4">
              <LogOut className="text-[#ffb4ab]" size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#e8e1d9] mb-1 font-serif">
              Sign out of Museum Admin?
            </h3>
            <p className="text-sm text-[#99907e] mb-5 leading-relaxed">
              You'll need to sign back in to manage the royal collection.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#2a241c] hover:bg-[#37342f] text-[#e8e1d9] text-sm font-medium border border-[#4d4637]/30 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#93000a] to-[#7a0008] hover:from-[#a8000a] hover:to-[#93000a] text-white text-sm font-semibold shadow-lg shadow-[#93000a]/30 hover:shadow-[#93000a]/50 transition-all duration-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Global & Emblem Styles ────────────────────────────── */}
      <style>{`
        @keyframes ringSpin   { to { transform: rotate(360deg); } }
        @keyframes orbitSpin  { to { transform: rotate(360deg); } }
        @keyframes orbitPulse {
          0%, 100% { opacity: .45; transform: scale(.92); }
          50%      { opacity: 1;   transform: scale(1.18); }
        }

        .sidebar-emblem {
          position: relative;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          filter: drop-shadow(0 0 12px rgba(201,168,76,.35));
        }
        .sidebar-emblem svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .sidebar-emblem .mini-spin {
          animation: ringSpin 18s linear infinite;
          transform-origin: 50% 50%;
        }
        .sidebar-emblem .mini-spin-rev {
          animation: ringSpin 13s linear infinite reverse;
          transform-origin: 50% 50%;
        }
        .sidebar-emblem .mini-spin-slow {
          animation: ringSpin 30s linear infinite;
          transform-origin: 50% 50%;
        }
        .sidebar-emblem .mini-orbit {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          animation: orbitSpin 9s linear infinite;
          pointer-events: none;
        }
        .sidebar-emblem .mini-orbit::after {
          content: "";
          position: absolute;
          top: -2.5px;
          left: 50%;
          width: 5px;
          height: 5px;
          margin-left: -2.5px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fff3c2, #c9a84c 55%, #6b4d10 100%);
          box-shadow: 0 0 7px rgba(232,213,154,.9), 0 0 14px rgba(201,168,76,.55);
          animation: orbitPulse 3.5s ease-in-out infinite;
        }
        .sidebar-emblem .mini-seal {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cinzel', serif;
          font-size: 20px;
          color: #e8d59a;
          pointer-events: none;
          text-shadow: 0 0 10px rgba(232,213,154,.5);
        }
        .sidebar-emblem .mini-ring-bg {
          position: absolute;
          inset: 7px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 35% 30%, rgba(255,235,180,.10), transparent 60%),
            radial-gradient(circle at 50% 50%, #1a140b, #0a0805 75%);
          border: 1px solid rgba(201,168,76,.35);
          pointer-events: none;
        }

        .font-serif {
          font-family: 'Playfair Display', Georgia, serif;
        }
        body {
          font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #37342f, #2a241c);
          border-radius: 4px;
          border: 1px solid #14100a;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #4d4637, #37342f);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}