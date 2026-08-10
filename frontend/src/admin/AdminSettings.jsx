import { useState } from "react";
import { User, Shield, Mail, Calendar, Edit3, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// ─── Profile Emblem with Rotating Rings (softer colors) ──────────────
function ProfileEmblem({ src, name }) {
  const initials = (name || "A")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="profile-emblem-wrapper" aria-hidden="true">
      <svg viewBox="0 0 56 56" className="emblem-ring-outer">
        <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" strokeDasharray="1 4" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 56 56" className="emblem-ring-inner">
        <circle cx="28" cy="28" r="19" fill="none" stroke="rgba(201,168,76,0.35)" strokeWidth="0.6" strokeDasharray="5 2.5" />
      </svg>
      <svg viewBox="0 0 56 56" className="emblem-dots">
        <circle cx="28" cy="4" r="1.2" fill="rgba(232,213,154,0.6)" />
        <circle cx="28" cy="52" r="1.2" fill="rgba(232,213,154,0.6)" />
        <circle cx="4" cy="28" r="1.2" fill="rgba(232,213,154,0.6)" />
        <circle cx="52" cy="28" r="1.2" fill="rgba(232,213,154,0.6)" />
      </svg>
      <div className="emblem-orbit">
        <div className="emblem-orbit-dot" />
      </div>
      <div className="emblem-ring-bg" />
      <div className="emblem-avatar">
        {src ? (
          <img src={src} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-[#17110b]" />
        ) : (
          <div className="w-full h-full rounded-full flex items-center justify-center border-4 border-[#17110b] bg-[#d4af37]/15 text-[#d4af37] text-3xl font-serif">
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Edit Profile Modal ───────────────────────────────────────────────
function EditProfileModal({ user, onClose, onSaved }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", { name: name.trim(), email: email.trim() });
      onSaved(res.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
      <div className="bg-[#17110b] border border-[#d4af37]/30 rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#c9b99a] hover:text-white transition"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-serif text-[#fff1b8] mb-6">Edit Profile</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9b99a] mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0d0905] border border-[#d4af37]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#fff1b8] focus:outline-none focus:border-[#d4af37]/60 transition"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9b99a] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0d0905] border border-[#d4af37]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#fff1b8] focus:outline-none focus:border-[#d4af37]/60 transition"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#17110b] font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-[#d4af37]/30 text-[#fff1b8] hover:bg-[#d4af37]/10 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const { user, loading, updateUser } = useAuth();
  const [showEdit, setShowEdit] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-serif tracking-wider text-[#d4af37]">Loading...</p>
      </div>
    );
  }

  const handleSaved = (updatedUser) => {
    updateUser({ name: updatedUser.name, email: updatedUser.email });
  };

  return (
    <div className="relative max-w-5xl mx-auto py-12 px-5">
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#d4af37]/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#8b5e34]/10 blur-3xl rounded-full" />

      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-[#fff1b8] via-[#d4af37] to-[#fff1b8] bg-clip-text text-transparent">
          Admin Profile
        </h1>
        <p className="text-[#c9b99a] mt-3">Manage your museum administrator identity</p>
      </div>

      <div className="bg-[#17110b]/90 backdrop-blur-xl border border-[#d4af37]/30 rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center">
          <ProfileEmblem name={user?.name} />

          <h2 className="mt-5 text-3xl font-serif text-[#fff1b8]">
            {user?.name || "Admin"}
          </h2>

          <span className="mt-2 mb-2 px-5 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-sm border border-[#d4af37]/40">
            {user?.role === "admin" ? "Admin" : user?.role || "User"}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-13">
          <InfoCard icon={<Mail />} title="Email" value={user?.email || "—"} />
          <InfoCard icon={<Shield />} title="Permission" value="Full Access" />
          <InfoCard icon={<User />} title="Account Type" value="Museum Administrator" />
          <InfoCard icon={<Calendar />} title="Status" value="Active" />
        </div>

        <button
          onClick={() => setShowEdit(true)}
          className="mt-15 w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#17110b] font-bold hover:scale-[1.02] transition shadow-lg shadow-[#d4af37]/20"
        >
          <Edit3 size={20} />
          Edit Profile
        </button>
      </div>

      <p className="text-center mt-8 text-xs text-[#c9b99a]/40 tracking-widest">
        ARCHÆUM DIGITAL MUSEUM ADMIN PANEL
      </p>

      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSaved={handleSaved}
        />
      )}

      <style>{`
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes spin-reverse { to { transform: rotate(-360deg); } }
        @keyframes orbit-spin { to { transform: rotate(360deg); } }
        @keyframes orbit-pulse {
          0%, 100% { opacity: .35; transform: scale(.9); }
          50%      { opacity: .7;  transform: scale(1.1); }
        }
        .profile-emblem-wrapper {
          position: relative;
          width: 160px;
          height: 160px;
          flex-shrink: 0;
          filter: drop-shadow(0 0 12px rgba(201,168,76,0.15));
        }
        .profile-emblem-wrapper svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .emblem-ring-outer { animation: spin-slow 18s linear infinite; transform-origin: 50% 50%; }
        .emblem-ring-inner { animation: spin-reverse 13s linear infinite; transform-origin: 50% 50%; }
        .emblem-dots { animation: spin-slow 30s linear infinite; transform-origin: 50% 50%; }
        .emblem-orbit {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          animation: orbit-spin 9s linear infinite;
          pointer-events: none;
        }
        .emblem-orbit-dot {
          position: absolute;
          top: -2.5px;
          left: 50%;
          width: 5px;
          height: 5px;
          margin-left: -2.5px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(232,213,154,0.7), rgba(201,168,76,0.4) 55%, rgba(107,77,16,0.3) 100%);
          box-shadow: 0 0 6px rgba(232,213,154,0.4), 0 0 12px rgba(201,168,76,0.2);
          animation: orbit-pulse 3.5s ease-in-out infinite;
        }
        .emblem-ring-bg {
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 35% 30%, rgba(255,235,180,0.05), transparent 60%),
            radial-gradient(circle at 50% 50%, #1a140b, #0a0805 75%);
          border: 1px solid rgba(201,168,76,0.2);
          pointer-events: none;
        }
        .emblem-avatar {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .emblem-avatar img, .emblem-avatar > div {
          width: 132px;
          height: 132px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #17110b;
          box-shadow: 0 0 20px rgba(212,175,55,0.1);
          pointer-events: auto;
        }
        .emblem-avatar::before {
          content: "";
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, rgba(212,175,55,0.4), rgba(255,241,184,0.3), rgba(212,175,55,0.4));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#0d0905] border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition">
      <div className="text-[#d4af37]">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wider text-[#c9b99a]">{title}</p>
        <h3 className="text-[#fff1b8] mt-1 font-medium">{value}</h3>
      </div>
    </div>
  );
}