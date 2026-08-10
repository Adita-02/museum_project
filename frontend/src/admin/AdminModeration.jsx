// src/admin/AdminModeration.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Heart, Share2, MessageSquare, Trash2, Loader2 } from "lucide-react";

const REGIONS = [
  { key: "asia", label: "Asia" },
  { key: "africa", label: "Africa" },
];

export default function AdminModeration() {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  const [region, setRegion] = useState("asia");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      if (region === "asia") {
        const res = await api.get("/places");
        setItems(
          (res.data || []).map((p) => ({
            ...p,
            _label: p.title,
            _endpoint: `/places/${p._id}`,
          }))
        );
      } else {
        const res = await api.get("/africa");
        const merged = [
          ...(res.data.kingdoms || []),
          ...(res.data.expeditions || []),
          ...(res.data.atlasSmall || []),
          ...(res.data.atlasLarge ? [res.data.atlasLarge] : []),
          ...(res.data.museum || []),
        ];
        setItems(
          merged.map((m) => ({
            ...m,
            _label: m.title,
            _endpoint: `/africa/${m._type}/${m._id}`,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load moderation data:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, isAdmin]);

  const deleteComment = async (item, commentId) => {
    if (!window.confirm("এই কমেন্টটা মুছে ফেলবেন?")) return;
    try {
      await api.delete(`${item._endpoint}/comments/${commentId}`);
      loadItems();
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert(err.response?.data?.message || "Comment delete করা যায়নি.");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#090806] text-[#efe3c4] flex items-center justify-center">
        <p className="font-['Cinzel',serif] tracking-wider text-[#dbb45f]">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#090806] text-[#efe3c4] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 className="font-['Cinzel',serif] text-2xl text-[#dbb45f]">Admin Access Required</h2>
        <p className="text-zinc-400 max-w-sm">Please sign in with an admin account to moderate content.</p>
      </div>
    );
  }

  const totalReacts = items.reduce((s, i) => s + (i.react || 0), 0);
  const totalShares = items.reduce((s, i) => s + (i.share || 0), 0);
  const totalComments = items.reduce((s, i) => s + (i.comments?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#090806] text-[#efe3c4] px-8 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-['Cinzel',serif] text-3xl text-[#dbb45f] mb-2">Moderation</h1>
        <p className="text-zinc-500 mb-8">React, comment, share সংখ্যা দেখুন এবং অনুপযুক্ত কমেন্ট মুছে দিন।</p>

        {/* Region toggle */}
        <div className="flex gap-2 mb-8">
          {REGIONS.map((r) => (
            <button
              key={r.key}
              onClick={() => setRegion(r.key)}
              className={`text-xs px-5 py-2.5 rounded-full border transition ${
                region === r.key
                  ? "bg-[rgba(219,180,95,0.15)] border-[rgba(219,180,95,0.6)] text-[#efe3c4]"
                  : "border-[rgba(219,180,95,0.2)] text-zinc-400 hover:border-[rgba(219,180,95,0.5)]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(219,180,95,0.15)] rounded-xl px-5 py-4 flex items-center gap-3">
            <Heart className="text-[#dbb45f]" size={20} />
            <div>
              <p className="text-xl font-semibold text-[#efe3c4]">{totalReacts}</p>
              <p className="text-xs text-zinc-500">Total Reacts</p>
            </div>
          </div>
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(219,180,95,0.15)] rounded-xl px-5 py-4 flex items-center gap-3">
            <MessageSquare className="text-[#dbb45f]" size={20} />
            <div>
              <p className="text-xl font-semibold text-[#efe3c4]">{totalComments}</p>
              <p className="text-xs text-zinc-500">Total Comments</p>
            </div>
          </div>
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(219,180,95,0.15)] rounded-xl px-5 py-4 flex items-center gap-3">
            <Share2 className="text-[#dbb45f]" size={20} />
            <div>
              <p className="text-xl font-semibold text-[#efe3c4]">{totalShares}</p>
              <p className="text-xs text-zinc-500">Total Shares</p>
            </div>
          </div>
        </div>

        {/* Item list */}
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500 py-10 justify-center">
            <Loader2 className="animate-spin" size={18} />
            Loading...
          </div>
        ) : items.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">এই region-এ কোনো item পাওয়া যায়নি।</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const isOpen = expandedId === item._id;
              const commentCount = item.comments?.length || 0;
              return (
                <div
                  key={item._id}
                  className="bg-[rgba(255,255,255,0.03)] border border-[rgba(219,180,95,0.1)] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? null : item._id)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[rgba(219,180,95,0.04)] transition"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#efe3c4] truncate">
                        {item._label || item._id}
                      </p>
                      {item._type && (
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-0.5">
                          {item._type}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-400 flex-shrink-0 ml-4">
                      <span className="flex items-center gap-1">
                        <Heart size={13} /> {item.react || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={13} /> {commentCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 size={13} /> {item.share || 0}
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[rgba(219,180,95,0.1)] px-5 py-4">
                      {commentCount === 0 ? (
                        <p className="text-zinc-600 text-sm italic">কোনো কমেন্ট নেই।</p>
                      ) : (
                        <div className="space-y-3">
                          {item.comments.map((c) => (
                            <div
                              key={c._id}
                              className="flex items-start justify-between gap-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(219,180,95,0.06)] rounded-lg px-4 py-3"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-[#dbb45f]">
                                    {c.name || "Anonymous"}
                                  </span>
                                  {c.createdAt && (
                                    <span className="text-[10px] text-zinc-600">
                                      {new Date(c.createdAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-zinc-300 mt-1 break-words">{c.text}</p>
                              </div>
                              <button
                                onClick={() => deleteComment(item, c._id)}
                                className="flex-shrink-0 p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                                title="Delete comment"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}