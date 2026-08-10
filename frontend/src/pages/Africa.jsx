// src/pages/Africa.jsx
import React, { useState, useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

// ─── Scroll-reveal wrapper: কার্ড viewport এ আসলে fade+slide করে দেখাবে ──
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Comment Modal ────────────────────────────────────────────────────────
function CommentModal({ item, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  if (!item) return null;

  const comments = [...(item.comments || [])].reverse();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    await onSubmit(item, name, text);
    setText('');
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[210] flex items-center justify-center p-4">
      <div className="bg-[#0A0703] border border-[rgba(219,180,95,0.15)] rounded-3xl w-full max-w-2xl mx-auto relative max-h-[88vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-[rgba(219,180,95,0.08)] border border-[rgba(219,180,95,0.15)] text-[#efe3c4] text-xl transition-all duration-300 hover:bg-[rgba(219,180,95,0.2)] hover:rotate-90 z-10"
        >✕</button>

        <div className="px-8 py-6 border-b border-[rgba(219,180,95,0.1)]">
          <h2 className="font-['Cinzel',serif] text-2xl text-[#d8b56f]">Comments</h2>
          <p className="text-[#8a8270] italic mt-1">on {item.title}</p>
        </div>

        <div className="px-8 py-6 overflow-y-auto flex-1 space-y-5">
          {comments.length === 0 ? (
            <p className="text-zinc-500 italic text-center py-6">এখনো কোনো কমেন্ট নেই। প্রথম কমেন্টটা আপনিই করুন!</p>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="border-b border-[rgba(219,180,95,0.08)] pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-['Cinzel',serif] text-sm text-[#d8b56f]">{c.name}</span>
                  {c.createdAt && <span className="text-[10px] text-zinc-600">{new Date(c.createdAt).toLocaleDateString()}</span>}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{c.text}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 border-t border-[rgba(219,180,95,0.1)] space-y-3">
          <input
            type="text"
            placeholder="আপনার নাম (না দিলে Anonymous)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(219,180,95,0.2)] rounded-xl px-4 py-2.5 text-sm text-[#efe3c4] placeholder-zinc-600 focus:outline-none focus:border-[rgba(219,180,95,0.5)]"
          />
          <textarea
            placeholder="আপনার কমেন্ট লিখুন..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            required
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(219,180,95,0.2)] rounded-xl px-4 py-2.5 text-sm text-[#efe3c4] placeholder-zinc-600 focus:outline-none focus:border-[rgba(219,180,95,0.5)] resize-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full font-['Cinzel',serif] text-sm tracking-[2px] uppercase border border-[#d8b56f] text-[#d8b56f] px-6 py-3 rounded-xl hover:bg-[rgba(219,180,95,0.1)] transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Share Modal ─────────────────────────────────────────────────────────
function ShareModal({ item, onClose, onShare }) {
  if (!item) return null;
  const pageUrl = window.location.href;
  const shareText = `Check out ${item.title} — ${item.desc || ''}`;

  const platforms = [
    { name: "Facebook", icon: "📘", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}` },
    { name: "LinkedIn", icon: "💼", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}` },
    { name: "WhatsApp", icon: "💬", url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + pageUrl)}` },
  ];

  const handlePlatformShare = (url) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
    onShare(item);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      onShare(item);
      alert("Link copied!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[210] flex items-center justify-center p-4">
      <div className="bg-[#0A0703] border border-[rgba(219,180,95,0.15)] rounded-3xl w-full max-w-md mx-auto relative p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-[rgba(219,180,95,0.08)] border border-[rgba(219,180,95,0.15)] text-[#efe3c4] text-xl transition-all duration-300 hover:bg-[rgba(219,180,95,0.2)] hover:rotate-90"
        >✕</button>
        <h2 className="font-['Cinzel',serif] text-2xl text-[#d8b56f] mb-1">Share</h2>
        <p className="text-[#8a8270] italic mb-6">{item.title}</p>
        <div className="space-y-3">
          {platforms.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePlatformShare(p.url)}
              className="w-full flex items-center gap-3 border border-[rgba(219,180,95,0.15)] rounded-xl px-5 py-3.5 text-[#efe3c4] hover:border-[rgba(219,180,95,0.5)] hover:bg-[rgba(219,180,95,0.06)] transition-all duration-200"
            >
              <span className="text-xl">{p.icon}</span>
              <span className="font-['Cinzel',serif] text-sm tracking-[1px]">{p.name}</span>
            </button>
          ))}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 border border-[rgba(219,180,95,0.15)] rounded-xl px-5 py-3.5 text-[#efe3c4] hover:border-[rgba(219,180,95,0.5)] hover:bg-[rgba(219,180,95,0.06)] transition-all duration-200"
          >
            <span className="text-xl">🔗</span>
            <span className="font-['Cinzel',serif] text-sm tracking-[1px]">Copy Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Generic Detail Modal (এখন react/comment/share সহ) ───────────────────
function DetailModal({ data, onClose, onReact, onOpenComments, onOpenShare }) {
  if (!data) return null;
  const { title, desc, img, icon, era, details, subitems } = data;
  const detailEntries = details ? Object.entries(details) : [];

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-2xl z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-w-2xl w-full max-h-[88vh] overflow-y-auto bg-[rgba(18,12,7,0.97)] backdrop-blur-3xl border border-[rgba(219,180,95,0.2)] rounded-[50px] p-10 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-zinc-500 hover:text-white text-3xl transition bg-transparent border-0 cursor-pointer z-10"
        >✕</button>

        {icon && <div className="text-7xl mb-4">{icon}</div>}
        {era && (
          <div className="inline-block border border-yellow-500/30 text-yellow-400 rounded-full px-6 py-3 text-xs tracking-wider mb-4">
            {era}
          </div>
        )}
        <h2 className="font-['Cinzel',serif] text-5xl text-[#d8b56f] mb-3">{title}</h2>
        {img && <img src={img} className="w-full h-[260px] object-cover rounded-3xl mb-6 brightness-90 border border-yellow-500/10" alt={title} />}
        <p className="text-zinc-300 text-lg leading-relaxed font-light mb-6">{desc}</p>

        {detailEntries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
            {detailEntries.map(([key, value]) => (
              <div key={key} className="bg-[rgba(255,255,255,0.03)] rounded-2xl px-4.5 py-3.5 border border-[rgba(219,180,95,0.06)]">
                <div className="text-[10px] uppercase tracking-[2px] text-[#d8b56f] opacity-70">{key}</div>
                <div className="text-sm text-[#efe3c4] mt-1 font-light">{value}</div>
              </div>
            ))}
          </div>
        )}

        {subitems && subitems.length > 0 && (
          <div className="mt-6">
            <h3 className="font-['Cinzel',serif] text-xl text-[#d8b56f] mb-3">Related Sites & Artifacts</h3>
            <div className="flex gap-3.5 overflow-x-auto pb-4">
              {subitems.map((item, i) => (
                <div key={i} className="min-w-[160px] max-w-[180px] flex-shrink-0 bg-[rgba(255,255,255,0.03)] rounded-3xl overflow-hidden border border-[rgba(219,180,95,0.08)] hover:border-[rgba(219,180,95,0.3)] hover:scale-[1.02] transition-all cursor-pointer">
                  <img src={item.img} alt={item.title} className="w-full h-[140px] object-cover" />
                  <div className="p-3.5">
                    <h4 className="font-['Cinzel',serif] text-sm text-[#d8b56f]">{item.title}</h4>
                    <p className="text-[11px] text-[#a09070] mt-0.5">{item.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── REACT / COMMENT / SHARE (stats কার্ডে দেখাবে না) ────── */}
        {data._type !== 'stats' && (
        <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-[rgba(219,180,95,0.08)]">
          <button
            onClick={() => onReact(data)}
            className="flex items-center gap-2 border border-[rgba(219,180,95,0.2)] text-[#efe3c4] px-5 py-2.5 rounded-xl hover:border-[rgba(219,180,95,0.5)] hover:bg-[rgba(219,180,95,0.08)] transition-all duration-200"
          >
            <span>❤️</span><span>{data.react || 0}</span>
          </button>
          <button
            onClick={() => onOpenComments(data)}
            className="flex items-center gap-2 border border-[rgba(219,180,95,0.2)] text-[#efe3c4] px-5 py-2.5 rounded-xl hover:border-[rgba(219,180,95,0.5)] hover:bg-[rgba(219,180,95,0.08)] transition-all duration-200"
          >
            <span>💬</span><span>{(data.comments || []).length}</span>
          </button>
          <button
            onClick={() => onOpenShare(data)}
            className="flex items-center gap-2 border border-[rgba(219,180,95,0.2)] text-[#efe3c4] px-5 py-2.5 rounded-xl hover:border-[rgba(219,180,95,0.5)] hover:bg-[rgba(219,180,95,0.08)] transition-all duration-200"
          >
            <span>↗</span><span>{data.share || 0}</span>
          </button>
        </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#d8b56f] text-[#1a1206] font-semibold rounded-full px-8 py-3 hover:shadow-[0_10px_30px_-10px_#d8b56f] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────
export default function Africa() {
  const [modalData, setModalData] = useState(null);
  const [commentItem, setCommentItem] = useState(null);
  const [shareItem, setShareItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState([]);
  const [kingdoms, setKingdoms] = useState([]);
  const [expeditions, setExpeditions] = useState([]);
  const [atlasLarge, setAtlasLarge] = useState(null);
  const [atlasSmall, setAtlasSmall] = useState([]);
  const [museum, setMuseum] = useState([]);

  const [museumCurrent, setMuseumCurrent] = useState(0);
  const museumTrackRef = useRef(null);
  const museumWrapRef = useRef(null);
  const museumCardRefs = useRef([]);
  const museumDragRef = useRef({ startX: 0, startTX: 0, isDragging: false });

  const getMuseumTX = () => {
    if (!museumTrackRef.current) return 0;
    const mat = new DOMMatrix(getComputedStyle(museumTrackRef.current).transform);
    return mat.m41;
  };

  const scrollToActiveMuseum = (animated = true) => {
    const wrap = museumWrapRef.current;
    const track = museumTrackRef.current;
    const cardEl = museumCardRefs.current[museumCurrent];
    if (!wrap || !track || !cardEl) return;
    const wrapW = wrap.offsetWidth;
    const cardL = cardEl.offsetLeft;
    const cardW = cardEl.offsetWidth;
    const target = -(cardL - wrapW / 2 + cardW / 2);
    track.style.transition = animated ? "transform 0.45s cubic-bezier(0.23,1,0.32,1)" : "none";
    track.style.transform = `translateX(${target}px)`;
  };

  const goToMuseum = (idx) => {
    if (idx < 0 || idx >= museum.length) return;
    setMuseumCurrent(idx);
  };

  useEffect(() => {
    scrollToActiveMuseum(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [museumCurrent, museum]);

  const onMuseumMouseDown = (e) => {
    museumDragRef.current.isDragging = false;
    museumDragRef.current.startX = e.clientX;
    museumDragRef.current.startTX = getMuseumTX();
    museumTrackRef.current.style.transition = "none";
    museumTrackRef.current.style.cursor = "grabbing";
  };
  useEffect(() => {
    const onMove = (e) => {
      if (!museumDragRef.current.startX) return;
      const dx = e.clientX - museumDragRef.current.startX;
      if (Math.abs(dx) > 5) museumDragRef.current.isDragging = true;
      if (museumTrackRef.current) museumTrackRef.current.style.transform = `translateX(${museumDragRef.current.startTX + dx}px)`;
    };
    const onUp = (e) => {
      if (!museumDragRef.current.startX) return;
      if (museumTrackRef.current) museumTrackRef.current.style.cursor = "grab";
      const dx = e.clientX - museumDragRef.current.startX;
      museumDragRef.current.startX = 0;
      if (Math.abs(dx) > 50) {
        goToMuseum(dx < 0 ? Math.min(museumCurrent + 1, museum.length - 1) : Math.max(museumCurrent - 1, 0));
      } else {
        scrollToActiveMuseum(true);
      }
      setTimeout(() => (museumDragRef.current.isDragging = false), 60);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [museumCurrent, museum]);

  const onMuseumTouchStart = (e) => {
    museumDragRef.current.touchStartX = e.touches[0].clientX;
    museumDragRef.current.startTX = getMuseumTX();
    museumTrackRef.current.style.transition = "none";
  };
  const onMuseumTouchMove = (e) => {
    const dx = e.touches[0].clientX - museumDragRef.current.touchStartX;
    museumTrackRef.current.style.transform = `translateX(${museumDragRef.current.startTX + dx}px)`;
  };
  const onMuseumTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - museumDragRef.current.touchStartX;
    if (Math.abs(dx) > 40) {
      goToMuseum(dx < 0 ? Math.min(museumCurrent + 1, museum.length - 1) : Math.max(museumCurrent - 1, 0));
    } else {
      scrollToActiveMuseum(true);
    }
  };

  const museumCardClass = (i) => {
    const d = Math.abs(i - museumCurrent);
    if (d === 0) return "active";
    if (d === 1) return "side";
    return "far";
  };

  // ── Hero parallax ──
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const loadData = () => {
    fetch(`${API_URL}/africa`)
      .then(res => res.json())
      .then(data => {
        setStats(data.stats || []);
        setKingdoms(data.kingdoms || []);
        setExpeditions(data.expeditions || []);
        setAtlasLarge(data.atlasLarge || null);
        setAtlasSmall(data.atlasSmall || []);
        setMuseum(data.museum || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => { loadData(); }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // একটা লিস্টের ভেতরে নির্দিষ্ট item টা আপডেট করার হেল্পার
  const patchInList = (setter, updated) => {
    setter(prev => prev.map(x => x._id === updated._id ? updated : x));
  };

  const applyUpdate = (updated) => {
    // সব state এর ভেতর থেকে যেটাতে মিলবে সেটাই আপডেট হবে
    patchInList(setStats, updated);
    patchInList(setKingdoms, updated);
    patchInList(setExpeditions, updated);
    patchInList(setMuseum, updated);
    setAtlasSmall(prev => prev.map(x => x._id === updated._id ? updated : x));
    setAtlasLarge(prev => (prev && prev._id === updated._id) ? updated : prev);

    // Modal খোলা থাকলে সেটাও রিফ্রেশ করা
    setModalData(md => (md && md._id === updated._id) ? updated : md);
    setCommentItem(ci => (ci && ci._id === updated._id) ? updated : ci);
  };

  const handleReact = async (item) => {
    try {
      const res = await fetch(`${API_URL}/africa/${item._type}/${item._id}/react`, { method: "PATCH" });
      const updated = await res.json();
      applyUpdate(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareCount = async (item) => {
    try {
      const res = await fetch(`${API_URL}/africa/${item._type}/${item._id}/share`, { method: "PATCH" });
      const updated = await res.json();
      applyUpdate(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const submitComment = async (item, name, text) => {
    try {
      const res = await fetch(`${API_URL}/africa/${item._type}/${item._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text }),
      });
      const updated = await res.json();
      applyUpdate(updated);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-[#efe3c4] flex items-center justify-center">
        <p className="font-['Cinzel',serif] tracking-[2px] uppercase text-[#d8b56f]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#efe3c4]" style={{ fontFamily: '"DM Sans", sans-serif' }}>

      {/* ─── Ambient / shimmer animation styles ──────────────────────── */}
      <style>{`
        @keyframes ambientShimmer {
          0%, 100% { box-shadow: 0 0 0 1px rgba(219,180,95,0.10), 0 0 24px -8px rgba(219,180,95,0.10); }
          50%      { box-shadow: 0 0 0 1px rgba(219,180,95,0.28), 0 0 34px -6px rgba(219,180,95,0.28); }
        }
        .ambient-card {
          animation: ambientShimmer 5s ease-in-out infinite;
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: .5; }
          50%      { transform: translateY(10px); opacity: 1; }
        }
        .scroll-indicator {
          animation: scrollBounce 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="min-h-screen flex items-center relative overflow-hidden"
      >
        {/* Parallax background layer (moves slower than scroll) */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,.3), rgba(0,0,0,.75)), url(https://images.unsplash.com/photo-1547471080-7cc2caa01a7e)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.35}px) scale(1.15)`,
            willChange: 'transform',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#d8b56f10_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10 py-20">
          <p className="uppercase tracking-[8px] text-[#d8b56f] text-sm font-light">Ancient Africa Archive</p>
          <h1 className="font-['Cinzel',serif] text-5xl sm:text-7xl md:text-[130px] leading-none mt-6 drop-shadow-2xl tracking-tight">
            Kingdoms<br />Beneath The Sand
          </h1>
          <p className="mt-10 max-w-3xl text-zinc-300 text-lg sm:text-xl leading-8 sm:leading-10 font-light">
            Across deserts, rivers, stone cities and forgotten routes — discover civilizations that shaped trade, science, architecture, belief and human history.
          </p>

          <div className="mt-14 flex flex-wrap gap-5">
            <button onClick={() => scrollTo('timeline')} className="bg-[#d8b56f] text-[#1a1206] font-semibold rounded-full px-10 py-3.5 shadow-[0_10px_30px_-10px_#d8b56f] hover:shadow-[0_20px_40px_-10px_#d8b56f] transition">
              Begin Expedition
            </button>
            <button onClick={() => scrollTo('archive')} className="border border-yellow-500/30 rounded-full px-10 py-3.5 hover:bg-yellow-500/10 transition">
              Explore Archive
            </button>
          </div>

          <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <Reveal key={s._id || i} delay={i * 100}>
                <div
                  className="ambient-card bg-[rgba(255,255,255,0.03)] backdrop-blur-3xl border border-[rgba(219,180,95,0.12)] rounded-[40px] p-8"
                >
                  <h2 className="font-['Cinzel',serif] text-5xl text-[#d8b56f]">{s.stat}</h2>
                  <p className="mt-3 text-zinc-400">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollTo('timeline')}
          className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#d8b56f]/70 hover:text-[#d8b56f] transition"
        >
          <span className="text-[10px] uppercase tracking-[4px]">Scroll</span>
          <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
            <rect x="1" y="1" width="16" height="24" rx="8" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="9" cy="8" r="2" fill="currentColor" />
          </svg>
        </button>
      </section>

      {/* ─── KINGDOM TIMELINE ─────────────────────────────────────────── */}
      <section className="py-28 sm:py-40" id="timeline">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="text-center mb-20">
              <p className="uppercase tracking-[8px] text-[#d8b56f] text-sm font-light">Historical Timeline</p>
              <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl mt-6 text-[#d8b56f] drop-shadow-lg tracking-tight">Rise & Decline</h2>
              <p className="mt-8 text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">
                From river kingdoms to forgotten stone cities — explore the civilizations that transformed Africa.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kingdoms.map((k, i) => (
              <Reveal key={k._id || i} delay={(i % 3) * 90}>
                <div
                  onClick={() => setModalData(k)}
                  className="bg-[rgba(255,255,255,0.03)] rounded-[32px] overflow-hidden border border-[rgba(219,180,95,0.08)] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(219,180,95,0.3)] hover:shadow-[0_20px_40px_-20px_rgba(219,180,95,0.15)]"
                >
                  <img src={k.img} alt={k.title} className="w-full h-[200px] object-cover" />
                  <div className="px-[22px] pt-5 pb-6">
                    <span className="text-[10px] uppercase tracking-[2px] text-[#d8b56f] border border-[rgba(219,180,95,0.2)] rounded-full px-3.5 py-1 inline-block">
                      {k.era}
                    </span>
                    <h3 className="font-['Cinzel',serif] text-[22px] text-[#d8b56f] mt-2.5">{k.title}</h3>
                    <p className="text-sm text-[#a09070] mt-2 leading-relaxed font-light">{k.desc}</p>
                    <div className="mt-3 text-xs text-zinc-500 flex gap-3">
                      <span>❤️ {k.react || 0}</span>
                      <span>💬 {(k.comments || []).length}</span>
                      <span>↗ {k.share || 0}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXPEDITION ───────────────────────────────────────────────── */}
      <section className="pb-28 sm:pb-40" id="expedition">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="mb-16">
              <p className="uppercase tracking-[8px] text-[#d8b56f] text-sm font-light">Field Discovery</p>
              <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl mt-6 text-[#d8b56f] drop-shadow-lg tracking-tight">Archaeology Expedition</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {expeditions.map((e, i) => (
              <Reveal key={e._id || i} delay={i * 90}>
                <div
                  className="ambient-card bg-[rgba(255,255,255,0.03)] backdrop-blur-3xl border border-[rgba(219,180,95,0.12)] rounded-[40px] p-10 text-center"
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <div className="text-5xl">{e.icon}</div>
                  <h3 className="font-['Cinzel',serif] text-3xl mt-6 text-[#d8b56f]">{e.title}</h3>
                  <p className="mt-6 text-zinc-400 font-light">{e.desc?.split('.')[0]}.</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CIVILIZATION ARCHIVE ─────────────────────────────────────── */}
      <section className="pb-28 sm:pb-40" id="archive">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="text-center mb-20">
              <p className="uppercase tracking-[8px] text-[#d8b56f] text-sm font-light">Archive Collection</p>
              <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl mt-6 text-[#d8b56f] drop-shadow-lg tracking-tight">Civilization Atlas</h2>
              <p className="mt-8 text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">
                Travel through forgotten capitals, sacred places and archaeological discoveries.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {atlasLarge && (
              <Reveal className="md:col-span-7">
                <div
                  className="bg-[rgba(255,255,255,0.03)] backdrop-blur-3xl border border-[rgba(219,180,95,0.12)] rounded-[50px] overflow-hidden relative transition-all duration-300 hover:-translate-y-2 hover:border-[rgba(219,180,95,0.4)] h-full"
                >
                  <img src={atlasLarge.img} className="h-[420px] sm:h-[620px] w-full object-cover brightness-75" alt={atlasLarge.title} />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 sm:p-10">
                    <div className="inline-block border border-yellow-500/30 text-yellow-400 rounded-full px-6 py-3 text-xs tracking-wider">
                      Archaeology
                    </div>
                    <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl mt-5 text-[#d8b56f]">{atlasLarge.title}</h2>
                    <p className="mt-6 max-w-2xl leading-9 text-zinc-300 font-light">{atlasLarge.desc}</p>
                  </div>
                </div>
              </Reveal>
            )}

            <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
              {atlasSmall.map((a, i) => (
                <Reveal key={a._id || i} delay={i * 90}>
                  <div
                    className="ambient-card bg-[rgba(255,255,255,0.03)] backdrop-blur-3xl border border-[rgba(219,180,95,0.12)] rounded-[40px] p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[rgba(219,180,95,0.4)]"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  >
                    <div className="text-4xl">{a.icon}</div>
                    <h3 className="font-['Cinzel',serif] text-3xl mt-6 text-[#d8b56f]">{a.title}</h3>
                    <p className="mt-5 text-zinc-400 font-light">{a.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

     {/* ─── MUSEUM COLLECTION ────────────────────────────────────────── */}
      <section className="pb-28 sm:pb-40" id="museum">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="mb-16">
              <p className="uppercase tracking-[8px] text-[#d8b56f] text-sm font-light">Museum Archive</p>
              <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl mt-6 text-[#d8b56f] drop-shadow-lg tracking-tight">Curated Collection</h2>
            </div>
          </Reveal>

          <div className="afr-museum-track-wrap" ref={museumWrapRef}>
            <div className="afr-museum-fade-left" />
            <div className="afr-museum-fade-right" />

            <button
              className="afr-museum-arrow afr-museum-arrow-left"
              onClick={() => goToMuseum(museumCurrent - 1)}
              disabled={museumCurrent === 0}
              aria-label="Previous"
            >
              &#8592;
            </button>
            <button
              className="afr-museum-arrow afr-museum-arrow-right"
              onClick={() => goToMuseum(museumCurrent + 1)}
              disabled={museumCurrent === museum.length - 1}
              aria-label="Next"
            >
              &#8594;
            </button>

            <div
              className="afr-museum-track"
              ref={museumTrackRef}
              onMouseDown={onMuseumMouseDown}
              onTouchStart={onMuseumTouchStart}
              onTouchMove={onMuseumTouchMove}
              onTouchEnd={onMuseumTouchEnd}
            >
              {museum.map((m, i) => (
                <div
                  className={`afr-museum-card ${museumCardClass(i)}`}
                  key={m._id || i}
                  ref={(el) => (museumCardRefs.current[i] = el)}
                  onClick={() => !museumDragRef.current.isDragging && goToMuseum(i)}
                >
                  <img src={m.img} className="afr-museum-img" alt={m.title} />
                  <div className="afr-museum-body">
                    <div className="afr-museum-badge">{m.badge}</div>
                    <h3 className="afr-museum-title">{m.title}</h3>
                    <p className="afr-museum-desc">{m.desc}</p>
                    <div className="afr-museum-actions">
                      <button onClick={(e) => { e.stopPropagation(); handleReact(m); }}>
                        <span>❤️</span><span>{m.react || 0}</span>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setCommentItem(m); }}>
                        <span>💬</span><span>{(m.comments || []).length}</span>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setShareItem(m); }}>
                        <span>↗</span><span>{m.share || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="afr-museum-dots">
            {museum.map((_, i) => (
              <div
                key={i}
                className={`afr-museum-dot ${i === museumCurrent ? "active" : ""}`}
                onClick={() => goToMuseum(i)}
              />
            ))}
          </div>
        </div>
      </section>
      

      {/* ─── MODALS ───────────────────────────────────────────────────── */}
      {modalData && (
        <DetailModal
          data={modalData}
          onClose={() => setModalData(null)}
          onReact={handleReact}
          onOpenComments={(item) => setCommentItem(item)}
          onOpenShare={(item) => setShareItem(item)}
        />
      )}

      {commentItem && (
        <CommentModal
          item={commentItem}
          onClose={() => setCommentItem(null)}
          onSubmit={submitComment}
        />
      )}

      {shareItem && (
        <ShareModal
          item={shareItem}
          onClose={() => setShareItem(null)}
          onShare={handleShareCount}
        />
      )}

    </div>
  );
}