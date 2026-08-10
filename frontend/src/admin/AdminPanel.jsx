// src/admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const COLLECTIONS = {
  asia_places: {
    label: "Asia — (Places)",
    group: "asia",
    endpoint: "/places",
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "country", label: "Country", type: "text" },
      { name: "cover", label: "Cover Image URL", type: "text" },
      { name: "era", label: "Era", type: "text" },
      { name: "yearStart", label: "Year Start (number, if BCE then negative)", type: "number" },
      { name: "status", label: "Status", type: "text" },
      { name: "decline", label: "Decline (Why did (it) disappear?)", type: "textarea" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "museum", label: "Museum", type: "text" },
      { name: "artifacts", label: "Artifacts (brief description)", type: "textarea" },
      { name: "culture", label: "Culture Tags (Separate with commas)", type: "csv" },
    ],
  },
  africa_stats: {
    label: "Africa — Stats",
    group: "africa",
    endpoint: "/africa/stats",
    titleField: "stat",
    apiType: "stats",
    fields: [
      { name: "stat", label: "Stat (like 50+)", type: "text" },
      { name: "desc", label: "Description", type: "text" },
      { name: "icon", label: "Icon (emoji)", type: "text" },
      { name: "details", label: "Details (JSON: {\"Key\":\"Value\"})", type: "json" },
    ],
  },
  africa_kingdoms: {
    label: "Africa — Kingdoms (Timeline)",
    group: "africa",
    endpoint: "/africa/kingdoms",
    titleField: "title",
    apiType: "kingdoms",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "era", label: "Era", type: "text" },
      { name: "desc", label: "Description", type: "textarea" },
      { name: "img", label: "Image URL", type: "text" },
      { name: "details", label: "Details (JSON)", type: "json" },
      { name: "subitems", label: "Subitems (JSON array)", type: "json" },
    ],
  },
  africa_expeditions: {
    label: "Africa — Expeditions",
    group: "africa",
    endpoint: "/africa/expeditions",
    titleField: "title",
    apiType: "expeditions",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "icon", label: "Icon (emoji)", type: "text" },
      { name: "desc", label: "Description", type: "textarea" },
      { name: "details", label: "Details (JSON)", type: "json" },
    ],
  },
  africa_atlas: {
    label: "Africa — Atlas",
    group: "africa",
    endpoint: "/africa/atlas",
    titleField: "title",
    apiType: "atlas",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "desc", label: "Description", type: "textarea" },
      { name: "img", label: "Image URL (Give (it) if it's a large card.)", type: "text" },
      { name: "icon", label: "Icon (Give (it) if it's a small card.)", type: "text" },
      { name: "size", label: "Size (large / small)", type: "text" },
      { name: "details", label: "Details (JSON)", type: "json" },
    ],
  },
  africa_museum: {
    label: "Africa — Museum",
    group: "africa",
    endpoint: "/africa/museum",
    titleField: "title",
    apiType: "museum",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "badge", label: "Badge", type: "text" },
      { name: "desc", label: "Short Description", type: "text" },
      { name: "fullDesc", label: "Full Description", type: "textarea" },
      { name: "img", label: "Image URL", type: "text" },
      { name: "details", label: "Details (JSON)", type: "json" },
    ],
  },
};

// ─── ফর্ম ────────────────────────────────────────────────────────────────
function ItemForm({ config, initial, onCancel, onSaved, token }) {
  const [values, setValues] = useState(() => {
    const v = {};
    config.fields.forEach(f => {
      if (f.type === "json") {
        v[f.name] = initial ? JSON.stringify(initial[f.name] ?? (f.name === "subitems" ? [] : {}), null, 2) : (f.name === "subitems" ? "[]" : "{}");
      } else if (f.type === "csv") {
        v[f.name] = initial && Array.isArray(initial[f.name]) ? initial[f.name].join(", ") : "";
      } else {
        v[f.name] = initial ? (initial[f.name] ?? "") : "";
      }
    });
    return v;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (name, value) => setValues(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {};
    try {
      for (const f of config.fields) {
        if (f.type === "json") {
          payload[f.name] = JSON.parse(values[f.name] || (f.name === "subitems" ? "[]" : "{}"));
        } else if (f.type === "csv") {
          payload[f.name] = values[f.name].split(",").map(s => s.trim()).filter(Boolean);
        } else if (f.type === "number") {
          payload[f.name] = values[f.name] === "" ? undefined : Number(values[f.name]);
        } else {
          payload[f.name] = values[f.name];
        }
      }
    } catch (err) {
      setError("There is an incorrect format in the JSON field.Such as: {\"Key\":\"Value\"}");
      setSaving(false);
      return;
    }

    try {
      const isEdit = !!initial?._id;
      const url = isEdit ? `${API_URL}${config.endpoint}/${initial._id}` : `${API_URL}${config.endpoint}`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Unable to save");
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(219,180,95,0.15)] rounded-2xl p-6 space-y-4 mb-8">
      <h3 className="font-['Cinzel',serif] text-lg text-[#dbb45f]">
        {initial ? "Edit" : "Add New"} — {config.label}
      </h3>

      {config.fields.map(f => (
        <div key={f.name}>
          <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">{f.label}</label>
          {f.type === "textarea" || f.type === "json" ? (
            <textarea
              rows={f.type === "json" ? 4 : 3}
              value={values[f.name]}
              onChange={(e) => handleChange(f.name, e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(219,180,95,0.2)] rounded-lg px-3 py-2 text-sm text-[#efe3c4] font-mono focus:outline-none focus:border-[rgba(219,180,95,0.5)]"
            />
          ) : (
            <input
              type={f.type === "number" ? "number" : "text"}
              value={values[f.name]}
              onChange={(e) => handleChange(f.name, e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(219,180,95,0.2)] rounded-lg px-3 py-2 text-sm text-[#efe3c4] focus:outline-none focus:border-[rgba(219,180,95,0.5)]"
            />
          )}
        </div>
      ))}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#dbb45f] text-[#1a1206] font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-[rgba(219,180,95,0.3)] text-[#efe3c4] px-6 py-2.5 rounded-lg hover:bg-[rgba(219,180,95,0.08)] transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Main Admin Page ───────────────────────────────────────────────────
export default function AdminPanel() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [searchParams, setSearchParams] = useSearchParams();
  const regionParam = searchParams.get('region');
  const region = regionParam === 'africa' ? 'africa' : regionParam === 'asia' ? 'asia' : null;

  const filteredEntries = region
    ? Object.entries(COLLECTIONS).filter(([, c]) => c.group === region)
    : [];

  const [selectedKey, setSelectedKey] = useState(filteredEntries[0]?.[0] || null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (!region) {
      setSelectedKey(null);
      return;
    }
    const entries = Object.entries(COLLECTIONS).filter(([, c]) => c.group === region);
    if (entries.length > 0) {
      setSelectedKey(entries[0][0]);
    }
  }, [region]);

  const config = region ? COLLECTIONS[selectedKey] : null;
  const isAdmin = user?.role === 'admin';

  // ─── Live clock for welcome screen ──────────────────────────────
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const loadItems = () => {
    if (!config) return;
    setLoading(true);
    fetch(`${API_URL}${config.endpoint}`)
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!isAdmin || !config) return;
    setShowForm(false);
    setEditingItem(null);
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey, isAdmin, region]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      const res = await fetch(`${API_URL}${config.endpoint}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        navigate('/login');
        return;
      }
      loadItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingItem(null);
    loadItems();
  };

  // ─── Auth loading state ──────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#090806] text-[#efe3c4] flex items-center justify-center">
        <p className="font-['Cinzel',serif] tracking-wider text-[#dbb45f]">Loading...</p>
      </div>
    );
  }

  // ─── Not logged in, or logged in but not admin ──────────────────
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#090806] text-[#efe3c4] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-['Cinzel',serif] text-2xl text-[#dbb45f]">Admin Access Required</h1>
        <p className="text-zinc-400 max-w-sm">
          {user ? "This account does not have admin access." : "Please sign in with an admin account to view this page."}
        </p>
        <Link
          to="/login"
          className="bg-[#dbb45f] text-[#1a1206] font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // ─── No region selected — welcome screen ──────────────────────
  if (!region) {
    return (
      <div className="min-h-screen bg-[#090806] text-[#efe3c4] px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Greeting header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#dbb45f]/70 mb-2">
                {formattedDate}
              </p>
              <h1 className="font-['Cinzel',serif] text-4xl text-[#dbb45f]">
                {greeting}, {user?.name || 'Admin'}
              </h1>
              <p className="text-zinc-500 mt-2">
                Here's a quick overview of the content workspace.
              </p>
            </div>
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(219,180,95,0.2)] rounded-2xl px-6 py-4 text-right">
              <p className="text-3xl font-['Cinzel',serif] text-[#efe3c4] tabular-nums">
                {formattedTime}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Local time</p>
            </div>
          </div>

          {/* Tip strip */}
          <div className="flex items-center gap-3 bg-[rgba(219,180,95,0.06)] border border-[rgba(219,180,95,0.2)] rounded-xl px-5 py-4">
            <span className="w-2 h-2 rounded-full bg-[#dbb45f] flex-shrink-0" />
            <p className="text-sm text-zinc-400">
              Use the <span className="text-[#dbb45f]">Asia</span> or{' '}
              <span className="text-[#dbb45f]">Africa</span> or{' '}
              <span className="text-[#dbb45f]">Civilizations</span> links in the sidebar to manage content.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090806] text-[#efe3c4] px-8 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-['Cinzel',serif] text-3xl text-[#dbb45f]">
            {region === 'asia' ? 'Asia' : 'Africa'} — Content Manager
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchParams({})}
              className="text-xs border border-[rgba(219,180,95,0.3)] text-[#efe3c4] px-4 py-2 rounded-lg hover:bg-[rgba(219,180,95,0.08)] transition"
            >
              ← Change Region
            </button>
            <Link
              to="/admin/artifacts"
              className="text-xs border border-[rgba(219,180,95,0.3)] text-[#efe3c4] px-4 py-2 rounded-lg hover:bg-[rgba(219,180,95,0.08)] transition"
            >
              Manage Artifacts →
            </Link>
          </div>
        </div>
        <p className="text-zinc-500 mb-8">Add, edit, and delete {region === 'asia' ? 'Asia' : 'Africa'} content from here</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {filteredEntries.map(([key, c]) => (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`text-xs px-4 py-2 rounded-full border transition ${
                selectedKey === key
                  ? 'bg-[rgba(219,180,95,0.15)] border-[rgba(219,180,95,0.6)] text-[#efe3c4]'
                  : 'border-[rgba(219,180,95,0.2)] text-zinc-400 hover:border-[rgba(219,180,95,0.5)]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {!showForm && (
          <button
            onClick={() => { setEditingItem(null); setShowForm(true); }}
            className="mb-6 bg-[#dbb45f] text-[#1a1206] font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition"
          >
            + Add New
          </button>
        )}

        {showForm && config && (
          <ItemForm
            config={config}
            initial={editingItem}
            onCancel={() => { setShowForm(false); setEditingItem(null); }}
            onSaved={handleSaved}
            token={token}
          />
        )}

        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-zinc-500">There are no items.</p>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-[rgba(255,255,255,0.03)] border border-[rgba(219,180,95,0.1)] rounded-xl px-5 py-3.5"
              >
                <span className="text-sm">{item[config.titleField] || item.title || item._id}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingItem(item); setShowForm(true); }}
                    className="text-xs border border-[rgba(219,180,95,0.3)] px-4 py-1.5 rounded-lg hover:bg-[rgba(219,180,95,0.08)] transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-xs border border-red-500/30 text-red-400 px-4 py-1.5 rounded-lg hover:bg-red-500/10 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}