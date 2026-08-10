// src/pages/Asia.jsx
import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

// ─── Artifact Modal Component ───────────────────────────────────────────
function ArtifactModal({ place, onClose }) {
  const [current, setCurrent] = useState(0);
  if (!place) return null;
  const artifacts = place.artifactList;
  const total = artifacts.length;

  const goTo = (idx) => {
    if (idx < 0 || idx >= total) return;
    setCurrent(idx);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0A0703] border border-[rgba(219,180,95,0.15)] rounded-3xl w-full max-w-5xl mx-auto relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="sticky top-4 float-right mr-6 w-11 h-11 rounded-full bg-[rgba(219,180,95,0.08)] border border-[rgba(219,180,95,0.15)] text-[#efe3c4] text-xl transition-all duration-300 hover:bg-[rgba(219,180,95,0.2)] hover:rotate-90 z-10"
        >✕</button>

        <div className="px-8 py-6 clear-both text-center md:text-left">
          <h2 className="font-['Cinzel',serif] text-3xl text-[#dbb45f]">{place.title}</h2>
          <p className="text-[#8a8270] font-['Crimson_Pro',serif] italic mt-1">
            Housed at <strong className="text-[#b8a88a] not-italic">{place.museum}</strong>
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center min-h-[420px] overflow-hidden px-6 md:px-16 pb-6">
          <button onClick={() => goTo(current - 1)} className="absolute left-2 md:left-4 w-10 h-10 rounded-full bg-[rgba(15,10,4,0.78)] border border-[rgba(219,180,95,0.25)] text-[#dbb45f] flex items-center justify-center z-10 hover:border-[rgba(219,180,95,0.55)] transition-all">←</button>
          <button onClick={() => goTo(current + 1)} className="absolute right-2 md:right-4 w-10 h-10 rounded-full bg-[rgba(15,10,4,0.78)] border border-[rgba(219,180,95,0.25)] text-[#dbb45f] flex items-center justify-center z-10 hover:border-[rgba(219,180,95,0.55)] transition-all">→</button>

          <div className="flex gap-5 items-center justify-center w-full mx-auto">
            {artifacts.map((art, i) => {
              const dist = Math.abs(i - current);
              let scale = 'scale-[0.80] opacity-30 hidden md:flex';
              if (dist === 0) scale = 'scale-[1.07] -translate-y-2.5 opacity-100 flex';
              else if (dist === 1) scale = 'scale-[0.89] translate-y-2.5 opacity-60 hidden sm:flex';
              return (
                <div
                  key={i}
                  onClick={() => goTo(i)}
                  className={`flex-shrink-0 w-[200px] h-[400px] rounded-3xl border border-[rgba(219,180,95,0.18)] bg-gradient-to-b from-[#1a140d] to-[#0c0906] cursor-pointer transition-all duration-500 flex-col overflow-hidden ${scale}`}
                >
                  <div className="mx-4 mt-6 rounded-xl overflow-hidden border border-[rgba(219,180,95,0.2)] h-32 flex-shrink-0">
                    <img src={art.img} alt={art.name} className="w-full h-full object-cover opacity-85" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-[8px] font-semibold tracking-[3px] uppercase text-[#dbb45f] text-center mb-1">{art.category}</div>
                    <div className="font-['Cinzel',serif] text-sm font-bold text-[#efe3c4] text-center mb-2 leading-tight">{art.name}</div>
                    <div className="w-10 h-px bg-gradient-to-r from-transparent via-[rgba(219,180,95,0.55)] to-transparent mx-auto mb-2" />
                    <div className="text-[10px] text-[#a09880] text-center leading-relaxed flex-1">{art.desc}</div>
                    <div className="mt-3 pt-2 border-t border-[rgba(219,180,95,0.08)] space-y-1">
                      <div className="flex justify-center gap-1 text-[9px] text-[#6a6458]">
                        <span className="text-[8px] uppercase">🔍</span>
                        <span className="text-[#b8a88a]">{art.discoveredBy} ({art.discoveredYear})</span>
                      </div>
                      <div className="flex justify-center gap-1 text-[9px] text-[#6a6458]">
                        <span className="text-[8px] uppercase">🏛️</span>
                        <span className="text-[#dbb45f] text-center">{art.housedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 pb-8">
          {artifacts.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-[#dbb45f]' : 'w-1.5 bg-[rgba(219,180,95,0.2)] border border-[rgba(219,180,95,0.3)]'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Comment Modal Component ────────────────────────────────────────────
function CommentModal({ place, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!place) return null;

  const comments = [...(place.comments || [])].reverse(); // নতুনগুলো উপরে

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    await onSubmit(place._id, name, text);
    setText('');
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0A0703] border border-[rgba(219,180,95,0.15)] rounded-3xl w-full max-w-2xl mx-auto relative max-h-[88vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-[rgba(219,180,95,0.08)] border border-[rgba(219,180,95,0.15)] text-[#efe3c4] text-xl transition-all duration-300 hover:bg-[rgba(219,180,95,0.2)] hover:rotate-90 z-10"
        >✕</button>

        <div className="px-8 py-6 border-b border-[rgba(219,180,95,0.1)]">
          <h2 className="font-['Cinzel',serif] text-2xl text-[#dbb45f]">Comments</h2>
          <p className="text-[#8a8270] font-['Crimson_Pro',serif] italic mt-1">on {place.title}</p>
        </div>

        {/* Existing comments list */}
        <div className="px-8 py-6 overflow-y-auto flex-1 space-y-5">
          {comments.length === 0 ? (
            <p className="text-zinc-500 font-['Crimson_Pro',serif] italic text-center py-6">
              এখনো কোনো কমেন্ট নেই। প্রথম কমেন্টটা আপনিই করুন!
            </p>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="border-b border-[rgba(219,180,95,0.08)] pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-['Cinzel',serif] text-sm text-[#dbb45f]">{c.name}</span>
                  {c.createdAt && (
                    <span className="text-[10px] text-zinc-600">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed font-['Crimson_Pro',serif]">{c.text}</p>
              </div>
            ))
          )}
        </div>

        {/* New comment form */}
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
            className="w-full font-['Cinzel',serif] text-sm tracking-[2px] uppercase border border-[#dbb45f] text-[#dbb45f] px-6 py-3 rounded-xl hover:bg-[rgba(219,180,95,0.1)] transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Share Modal Component ───────────────────────────────────────────────
function ShareModal({ place, onClose, onShare }) {
  if (!place) return null;

  const pageUrl = window.location.href; // এখন যেই পেজে আছেন সেটার URL
  const shareText = `Check out ${place.title} — ${place.description}`;

  const platforms = [
    {
      name: "Facebook",
      icon: "📘",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: "💼",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
    },
    {
      name: "WhatsApp",
      icon: "💬",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + pageUrl)}`,
    },
  ];

  const handlePlatformShare = (url) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
    onShare(place._id); // count বাড়ানো
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      onShare(place._id);
      alert("Link copied!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-[#0A0703] border border-[rgba(219,180,95,0.15)] rounded-3xl w-full max-w-md mx-auto relative p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-[rgba(219,180,95,0.08)] border border-[rgba(219,180,95,0.15)] text-[#efe3c4] text-xl transition-all duration-300 hover:bg-[rgba(219,180,95,0.2)] hover:rotate-90"
        >✕</button>

        <h2 className="font-['Cinzel',serif] text-2xl text-[#dbb45f] mb-1">Share</h2>
        <p className="text-[#8a8270] font-['Crimson_Pro',serif] italic mb-6">{place.title}</p>

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

// ─── Place Card ─────────────────────────────────────────────────────────
function PlaceCard({ place, onOpen }) {
  return (
    <div
      onClick={() => onOpen(place._id)}
      className="group relative rounded-3xl overflow-hidden cursor-pointer border border-[rgba(219,180,95,0.12)] bg-[rgba(255,255,255,0.03)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[rgba(219,180,95,0.4)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={place.cover}
          className="h-[280px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          alt={place.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute top-4 left-4 text-[10px] tracking-[2px] uppercase font-semibold bg-black/50 backdrop-blur px-3 py-1.5 rounded-full text-amber-300 border border-yellow-500/30">
          {place.status}
        </div>
        <div className="absolute bottom-4 right-4 text-[10px] tracking-[1px] font-['Cinzel',serif] text-[#efe3c4]/90 bg-black/40 backdrop-blur px-3 py-1 rounded-full border border-[rgba(219,180,95,0.2)]">
          {place.era}
        </div>
      </div>
      <div className="p-7">
        <span className="text-[10px] tracking-[2px] uppercase font-semibold border border-yellow-500/30 text-yellow-400 px-2 py-0.5 rounded-full">{place.country}</span>
        <h3 className="font-['Cinzel',serif] text-3xl mt-5 text-[#efe3c4] transition-colors duration-300 group-hover:text-[#dbb45f]">{place.title}</h3>
        <p className="text-sm text-zinc-400 mt-3 leading-relaxed line-clamp-2">{place.description}</p>
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-[rgba(219,180,95,0.08)]">
          <div className="flex items-center gap-2 text-xs text-zinc-500 min-w-0">
            <span>🏛️</span>
            <span className="truncate">{place.museum}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-zinc-500 flex-shrink-0 ml-3">
            <span className="flex items-center gap-1">❤️ {place.react}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Timeline Card ───────────────────────────────────────────────────────
function TimelineCard({ place, index, onOpen }) {
  const isFlip = index % 2 === 1;
  return (
    <div className="relative mb-10 md:mb-16 pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12 md:items-center">
      <div className="absolute left-2.5 md:left-1/2 top-6 md:top-1/2 w-3.5 h-3.5 rounded-full bg-[#dbb45f] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_0_5px_#090806,0_0_18px_rgba(219,180,95,0.6)] z-10" />

      {isFlip ? (
        <>
          <div className="hidden md:block" />
          <div
            onClick={() => onOpen(place._id)}
            className="cursor-pointer rounded-2xl p-6 border border-[rgba(219,180,95,0.12)] bg-[rgba(255,255,255,0.03)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(219,180,95,0.45)]"
          >
            <p className="font-['Cinzel',serif] text-sm text-[#dbb45f] tracking-[1px]">{place.era}</p>
            <h3 className="font-['Cinzel',serif] text-2xl mt-2 text-[#efe3c4]">{place.title}</h3>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{place.country}</p>
            <p className="font-['Crimson_Pro',serif] text-sm text-zinc-400 mt-3 leading-relaxed">{place.description}</p>
            <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500">
              <span>🏛️</span><span className="truncate">{place.museum}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            onClick={() => onOpen(place._id)}
            className="cursor-pointer rounded-2xl p-6 border border-[rgba(219,180,95,0.12)] bg-[rgba(255,255,255,0.03)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(219,180,95,0.45)] text-left md:text-right"
          >
            <p className="font-['Cinzel',serif] text-sm text-[#dbb45f] tracking-[1px]">{place.era}</p>
            <h3 className="font-['Cinzel',serif] text-2xl mt-2 text-[#efe3c4]">{place.title}</h3>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{place.country}</p>
            <p className="font-['Crimson_Pro',serif] text-sm text-zinc-400 mt-3 leading-relaxed">{place.description}</p>
            <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500 md:justify-end">
              <span>🏛️</span><span className="truncate">{place.museum}</span>
            </div>
          </div>
          <div className="hidden md:block" />
        </>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────
export default function Asiatica() {
  const [view, setView] = useState('grid'); // 'grid' | 'timeline'
  const [placesData, setPlacesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalPlace, setModalPlace] = useState(null);
  const [commentPlace, setCommentPlace] = useState(null); // ← কমেন্ট মোডাল কোন প্লেসের জন্য
  const [sharePlace, setSharePlace] = useState(null); // ← শেয়ার মোডাল কোন প্লেসের জন্য

  useEffect(() => {
    fetch(`${API_URL}/places`)
      .then(res => res.json())
      .then(data => {
        setPlacesData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const sorted = [...placesData].sort((a, b) => a.yearStart - b.yearStart);

  const openPlace = (id) => {
    setSelectedPlace(placesData.find(p => p._id === id));
  };

  const openArtifacts = (id) => {
    setModalPlace(placesData.find(p => p._id === id));
  };

  const openComments = (id) => {
    setCommentPlace(placesData.find(p => p._id === id));
  };

  const openShare = (id) => {
    setSharePlace(placesData.find(p => p._id === id));
  };

  // react / share — সংখ্যা বাড়ানো
  const bumpStat = async (id, key) => {
    try {
      const res = await fetch(`${API_URL}/places/${id}/${key}`, { method: "PATCH" });
      const updated = await res.json();
      setPlacesData(prev => prev.map(p => p._id === id ? updated : p));
      setSelectedPlace(sp => sp && sp._id === id ? updated : sp);
    } catch (err) {
      console.error(err);
    }
  };
  const handleReact = (id) => bumpStat(id, 'react');
  const handleShareCount = (id) => bumpStat(id, 'share'); // Share Modal থেকে কল হবে

  // নতুন কমেন্ট পোস্ট করা
  const submitComment = async (id, name, text) => {
    try {
      const res = await fetch(`${API_URL}/places/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text }),
      });
      const updated = await res.json();
      setPlacesData(prev => prev.map(p => p._id === id ? updated : p));
      setSelectedPlace(sp => sp && sp._id === id ? updated : sp);
      setCommentPlace(updated); // মোডালেও নতুন কমেন্টসহ আপডেট দেখাবে
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090806] text-[#efe3c4] flex items-center justify-center">
        <p className="font-['Cinzel',serif] tracking-[2px] uppercase text-[#dbb45f]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090806] text-[#efe3c4]" style={{ fontFamily: '"DM Sans", sans-serif' }}>

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(9,8,6,0.6)] to-[rgba(9,8,6,0.85)]" />
        <div className="relative z-10 max-w-6xl mx-auto text-center px-8 pt-20">
          <p className="uppercase tracking-[10px] text-yellow-400 text-sm">Ancient Civilizations</p>
          <h1 className="font-['Cinzel',serif] text-5xl md:text-8xl mt-8 leading-tight text-[#efe3c4]">
            Echoes<br />Across Time
          </h1>
          <p className="font-['Crimson_Pro',serif] italic mt-8 text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Cities buried by sand, empires erased by time — explore the archaeological remains of cultures that once thrived across the continent.
          </p>
          <div className="grid grid-cols-3 gap-px mt-16 border border-yellow-500/15 rounded-2xl overflow-hidden bg-black/40 backdrop-blur max-w-lg mx-auto">
            {[['Sites', '9'], ['Oldest', '9500 BCE'], ['Museums', '9+']].map(([label, val]) => (
              <div key={label} className="p-6 text-center">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</div>
                <div className="font-['Cinzel',serif] text-3xl text-yellow-400 mt-1">{val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GRID / TIMELINE ─────────────────────────────────────────── */}
      <section className="pb-32 pt-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[6px] text-yellow-400 text-xs mb-3">Archaeological Record</p>
            <h2 className="font-['Cinzel',serif] text-4xl md:text-5xl text-[#efe3c4]">Explore Lost Sites</h2>
            <p className="font-['Crimson_Pro',serif] italic text-zinc-500 mt-3">Civilizations that rose, and the reasons they fell</p>
            <div className="flex items-center justify-center gap-3 mt-10">
              {['grid', 'timeline'].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`text-[11px] tracking-[2px] uppercase font-semibold px-5 py-2.5 rounded-full border transition-all duration-200 ${
                    view === v
                      ? 'bg-[rgba(219,180,95,0.12)] border-[rgba(219,180,95,0.6)] text-[#efe3c4]'
                      : 'border-[rgba(219,180,95,0.25)] text-[rgba(239,227,196,0.55)] hover:bg-[rgba(219,180,95,0.12)] hover:border-[rgba(219,180,95,0.6)] hover:text-[#efe3c4]'
                  }`}
                >
                  {v === 'grid' ? 'Grid View' : 'Timeline View'}
                </button>
              ))}
            </div>
          </div>

          {view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-stretch">
              {placesData.map(p => (
                <PlaceCard key={p._id} place={p} onOpen={openPlace} />
              ))}
            </div>
          ) : (
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute left-2.5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[rgba(219,180,95,0.35)] to-transparent md:-translate-x-1/2" />
              {sorted.map((p, i) => (
                <TimelineCard key={p._id} place={p} index={i} onOpen={openPlace} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── ABOUT ────────────────────────────────────────────────────── */}
      <section className="pb-32 border-t border-yellow-500/10">
        <div className="max-w-4xl mx-auto px-8 pt-24 text-center">
          <p className="uppercase tracking-[6px] text-yellow-400 text-xs mb-3">Why They Disappeared</p>
          <h2 className="font-['Cinzel',serif] text-4xl mb-6 text-[#efe3c4]">Patterns of Decline</h2>
          <p className="font-['Crimson_Pro',serif] text-zinc-400 text-lg leading-relaxed">
            Climate shift, river migration, invasion, and overextension recur again and again across these civilizations. Each card lists not just when a culture flourished, but the leading theory for its decline — and where archaeologists later recovered its material memory.
          </p>
        </div>
      </section>

      {/* ─── PLACE DETAIL PANEL ───────────────────────────────────────── */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-[#090806] z-[100] overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-16">
            <button
              onClick={() => setSelectedPlace(null)}
              className="mb-8 flex items-center gap-2 text-[#dbb45f] font-['Cinzel',serif] text-sm tracking-[2px] uppercase hover:opacity-70 transition-opacity"
            >
              ← Back
            </button>
            <div className="relative rounded-3xl overflow-hidden mb-10">
              <img src={selectedPlace.cover} alt={selectedPlace.title} className="w-full h-[50vh] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090806] via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <span className="text-[10px] tracking-[2px] uppercase font-semibold border border-yellow-500/30 text-yellow-400 px-2 py-0.5 rounded-full">{selectedPlace.country}</span>
                <h1 className="font-['Cinzel',serif] text-5xl mt-3 text-[#efe3c4]">{selectedPlace.title}</h1>
                <p className="font-['Crimson_Pro',serif] italic text-zinc-400 mt-1">{selectedPlace.era}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-10">
              <div>
                <h2 className="font-['Cinzel',serif] text-xl text-[#dbb45f] mb-4 tracking-[2px] uppercase">About</h2>
                <p className="font-['Crimson_Pro',serif] text-lg text-zinc-300 leading-relaxed">{selectedPlace.description}</p>
              </div>
              <div>
                <h2 className="font-['Cinzel',serif] text-xl text-[#dbb45f] mb-4 tracking-[2px] uppercase">Decline</h2>
                <p className="font-['Crimson_Pro',serif] text-lg text-zinc-300 leading-relaxed">{selectedPlace.decline}</p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="font-['Cinzel',serif] text-xl text-[#dbb45f] mb-4 tracking-[2px] uppercase">Culture</h2>
              <div className="flex gap-3 flex-wrap">
                {selectedPlace.culture.map(c => (
                  <span key={c} className="text-[10px] tracking-[2px] uppercase border border-yellow-500/25 text-yellow-400/80 px-3 py-1.5 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h2 className="font-['Cinzel',serif] text-xl text-[#dbb45f] mb-3 tracking-[2px] uppercase">Museum</h2>
              <p className="text-zinc-400 font-['Crimson_Pro',serif] text-lg">🏛️ {selectedPlace.museum}</p>
            </div>

            <div className="flex items-center gap-4 mb-10">
              <button
                onClick={() => { openArtifacts(selectedPlace._id); }}
                className="font-['Cinzel',serif] text-sm tracking-[3px] uppercase border border-[#dbb45f] text-[#dbb45f] px-8 py-4 rounded-xl hover:bg-[rgba(219,180,95,0.1)] transition-all duration-300"
              >
                View Artifacts →
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleReact(selectedPlace._id)}
                className="flex items-center gap-2 border border-[rgba(219,180,95,0.2)] text-[#efe3c4] px-5 py-2.5 rounded-xl hover:border-[rgba(219,180,95,0.5)] hover:bg-[rgba(219,180,95,0.08)] transition-all duration-200"
              >
                <span>❤️</span><span>{selectedPlace.react}</span>
              </button>
              <button
                onClick={() => openComments(selectedPlace._id)}
                className="flex items-center gap-2 border border-[rgba(219,180,95,0.2)] text-[#efe3c4] px-5 py-2.5 rounded-xl hover:border-[rgba(219,180,95,0.5)] hover:bg-[rgba(219,180,95,0.08)] transition-all duration-200"
              >
                <span>💬</span><span>{(selectedPlace.comments || []).length}</span>
              </button>
              <button
                onClick={() => openShare(selectedPlace._id)}
                className="flex items-center gap-2 border border-[rgba(219,180,95,0.2)] text-[#efe3c4] px-5 py-2.5 rounded-xl hover:border-[rgba(219,180,95,0.5)] hover:bg-[rgba(219,180,95,0.08)] transition-all duration-200"
              >
                <span>↗</span><span>{selectedPlace.share}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ARTIFACT MODAL ───────────────────────────────────────────── */}
      {modalPlace && (
        <ArtifactModal place={modalPlace} onClose={() => setModalPlace(null)} />
      )}

      {/* ─── COMMENT MODAL ────────────────────────────────────────────── */}
      {commentPlace && (
        <CommentModal
          place={commentPlace}
          onClose={() => setCommentPlace(null)}
          onSubmit={submitComment}
        />
      )}

      {/* ─── SHARE MODAL ──────────────────────────────────────────────── */}
      {sharePlace && (
        <ShareModal
          place={sharePlace}
          onClose={() => setSharePlace(null)}
          onShare={handleShareCount}
        />
      )}

    </div>
  );
}