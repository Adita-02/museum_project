
// src/pages/Americas.jsx
// Converted from america.html — Navbar & Footer are already global (see Layout in App.jsx),
// so this component only contains the page-specific sections: Hero, Civilizations, Timeline, Visit.
// Local images (usabg.jpg, usa1.jpg ... usa6.jpg, history1.jpg, history2.jpg, m1.jpg, m2.jpg, m3.jpg, usa.jpg)
// are expected inside /public, so they're referenced as absolute paths e.g. "/usa1.jpg".

import { useEffect, useRef, useState } from "react";



const WORKS = [
  {
    tag: "Paleoindian Era",
    titleItalic: "First Americans",
    titlePlain: "Arrive",
    year: "~12,000 BCE",
    desc: "Hunter-gatherers cross the Bering land bridge and spread southward within centuries, becoming the first peoples of an untouched continent stretching from Arctic tundra to Patagonian plains.",
    center: "/m1.jpg",
    left: "/m2.jpg",
    right: "/m3.jpg",
  },
  {
    tag: "North America",
    titleItalic: "Clovis Culture",
    titlePlain: "Peaks",
    year: "~9,500 BCE",
    desc: "Distinctive fluted projectile points appear across the continent — the signature of North America's earliest widespread culture, master hunters who tracked megafauna across the open grasslands.",
    center: "/usa1.jpg",
    left: "/usa2.jpg",
    right: "/usa3.jpg",
  },
  {
    tag: "South America",
    titleItalic: "Norte Chico",
    titlePlain: "Monuments Built",
    year: "~3,000 BCE",
    desc: "Coastal Peru's first great civilisation raises massive platform mounds along river valleys — among the world's earliest urban centres, flourishing without ceramics or writing.",
    center: "/usa4.jpg",
    left: "/usa5.jpg",
    right: "/usa6.jpg",
  },
  {
    tag: "Mesoamerica",
    titleItalic: "Olmec Rise",
    titlePlain: "at San Lorenzo",
    year: "~1,200 BCE",
    desc: "The first major Mesoamerican civilisation emerges, carving colossal basalt heads weighing up to 40 tons and establishing long-distance trade networks that shaped every culture that followed.",
    center: "/usa2.jpg",
    left: "/usabg.jpg",
    right: "/usa1.jpg",
  },
];
const ERAS = ["All", "Paleoindian", "Norte Chico", "Olmec", "Maya", "Aztec", "Inca"];

const INITIAL_REVIEWS = [
  { name: "Helena V.", era: "Ancient Greece", rating: 5, body: "The Athenian Agora was not just a marketplace — it was the beating heart of democracy.", date: "12 Jun 2026", helpful: 7 },
  { name: "Lucius M.", era: "Roman Empire", rating: 5, body: "Rome's greatest achievement wasn't conquest — it was the codification of law.", date: "10 Jun 2026", helpful: 12 },
  { name: "Ingrid S.", era: "Viking Age", rating: 4, body: "Contrary to popular belief, Vikings rarely wore horned helmets. The myth came from 19th century illustrations.", date: "8 Jun 2026", helpful: 9 },
];

const AVATARS = [
  "linear-gradient(135deg,#C8952A,#8A6318)",
  "linear-gradient(135deg,#7A5C28,#C8952A)",
  "linear-gradient(135deg,#5C4420,#E8B84B)",
  "linear-gradient(135deg,#A07030,#C8952A)",
];

function initials(n) {
  return n.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}
function stars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export default function Americas() {
  /* ---------- hero parallax ---------- */
  const heroBgRef = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => heroBgRef.current?.classList.add("loaded"), 100);
    const onScroll = () => {
      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `translateY(${window.scrollY * 0.28}px) scale(1.04)`;
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ---------- civilizations swipe track ---------- */
  const trackRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = (e) => {
    dragState.current.isDown = true;
    trackRef.current.classList.add("grabbing");
    dragState.current.startX = e.pageX - trackRef.current.offsetLeft;
    dragState.current.scrollLeft = trackRef.current.scrollLeft;
  };
  const onMouseLeaveOrUp = () => {
    dragState.current.isDown = false;
    trackRef.current?.classList.remove("grabbing");
  };
  const onMouseMove = (e) => {
    if (!dragState.current.isDown) return;
    e.preventDefault();
    trackRef.current.scrollLeft =
      dragState.current.scrollLeft - (e.pageX - trackRef.current.offsetLeft - dragState.current.startX) * 1.5;
  };
  const onScrollTrack = () => {
    const idx = Math.round(trackRef.current.scrollLeft / (310 + 20));
    setActiveDot(idx);
  };
  const goToCard = (i) => {
    trackRef.current.scrollTo({ left: i * (310 + 20), behavior: "smooth" });
  };

  /* ---------- timeline gallery ---------- */
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const goTo = (idx) => {
    setFading(true);
    setTimeout(() => {
      setCurrent((idx + WORKS.length) % WORKS.length);
      setFading(false);
    }, 270);
  };
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goTo(current - 1);
      if (e.key === "ArrowRight") goTo(current + 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current]);
  const work = WORKS[current];

  /* ---------- timeline reveal-on-scroll (kept for any .tl-item usage) ---------- */
  useEffect(() => {
    const items = document.querySelectorAll(".tl-item");
    if (!items.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("vis"), i * 90);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((i) => obs.observe(i));
    return () => obs.disconnect();
  }, []);
const API_BASE = import.meta.env.VITE_API_URL;
//heeloo//
  const [civilizations, setCivilizations] = useState([]);
useEffect(() => {
  fetch(`${API_BASE}/civilizations/americas`)
    .then((res) => res.json())
    .then((data) => setCivilizations(data))
    .catch((err) => console.error("Failed to load civilizations:", err));
}, []);
// ... component er ভিতরে ...

const [reviews, setReviews] = useState([]);
const [activeFilter, setActiveFilter] = useState("All");
const [name, setName] = useState("");
const [era, setEra] = useState("");
const [rating, setRating] = useState(0);
const [hoverRating, setHoverRating] = useState(0);
const [body, setBody] = useState("");
const [toastOn, setToastOn] = useState(false);

// prothombar load hoile Atlas theke review niye ashbe
useEffect(() => {
  fetch(`${API_BASE}/reviews/americas`)
    .then((res) => res.json())
    .then((data) => setReviews(data))
    .catch((err) => console.error("Failed to load reviews:", err));
}, []);

const filtered = activeFilter === "All" ? reviews : reviews.filter((r) => r.era === activeFilter);
const avgRating = reviews.length
  ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
  : "—";
const eraCount = new Set(reviews.map((r) => r.era)).size;

// helpful button click korle backend update hobe
const markHelpful = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/reviews/${id}/helpful`, { method: "PATCH" });
    const updated = await res.json();
    setReviews((prev) => prev.map((r) => (r._id === id ? updated : r)));
  } catch (err) {
    console.error("Failed to mark helpful:", err);
  }
};

// notun chronicle submit korle backend e POST hobe
const submitChronicle = async () => {
  if (!name.trim() || !era || !body.trim() || !rating) return;
  try {
    const res = await fetch(`${API_BASE}/reviews/americas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), era, rating, body: body.trim() }),
    });
    const newReview = await res.json();
    setReviews((prev) => [newReview, ...prev]);
    setActiveFilter("All");
    setToastOn(true);
    setTimeout(() => setToastOn(false), 2800);
    setName("");
    setEra("");
    setBody("");
    setRating(0);
  } catch (err) {
    console.error("Failed to submit review:", err);
  }
};

  return (
    <>
  
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-img" id="heroBg" ref={heroBgRef} style={{ backgroundImage: "url('/usabg.jpg')" }} />
        <div className="hero-overlay" />
        <div className="hero-bg-text">AMERICA</div>

        <div className="hero-content">
          <p className="hero-eyebrow">Ancient Americas · 12,000 BCE – 1500 CE</p>

          <h1 className="hero-title">
            Legacy of the
            <br />
            Ancient Americas
          </h1>

          <p className="hero-sub">
            Discover the remarkable civilizations that shaped the Americas—from the first Paleo-Indians and the
            Olmec heartlands to the magnificent Maya cities, Aztec temples, and Inca mountain kingdoms.
          </p>

          <div className="hero-actions">
            <button
              className="btn-gold"
              onClick={() => document.getElementById("civilizations").scrollIntoView({ behavior: "smooth" })}
            >
              Explore Civilizations
            </button>
            <button
              className="btn-outline"
              onClick={() => document.getElementById("visit").scrollIntoView({ behavior: "smooth" })}
            >
              Share your knowledge
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hn">14,000+</div>
              <div className="hl">Years of History</div>
            </div>
            <div className="hero-stat">
              <div className="hn">500+</div>
              <div className="hl">Artifacts Preserved</div>
            </div>
            <div className="hero-stat">
              <div className="hn">5</div>
              <div className="hl">Great Civilizations</div>
            </div>
            <div className="hero-stat">
              <div className="hn">2</div>
              <div className="hl">American Continents</div>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <span className="scroll-lbl">Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* CIVILIZATIONS SWIPE */}
      <section id="civilizations">
        <div className="civ-header">
          <div className="so" style={{ justifyContent: "flex-start" }}>
            Featured Civilizations
          </div>
          <h2 className="st">Builders of the Ancient World</h2>
          <p className="sd" style={{ textAlign: "left", marginTop: 6 }}>
            Six civilizations across 14 millennia
          </p>
          <div className="civ-hint">
            <span>&#8592;</span> drag to explore <span>&#8594;</span>
          </div>
        </div>

        <div
          className="swipe-track"
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeaveOrUp}
          onMouseUp={onMouseLeaveOrUp}
          onMouseMove={onMouseMove}
          onScroll={onScrollTrack}
        >
        {civilizations.map((c) => (
  <div className="civ-card" key={c._id}>
              <div className="civ-card-top">
                <div className="civ-top-glow" />
                <img src={c.img} alt={c.name} />
                <div className="civ-era">{c.era}</div>
              </div>
              <div className="civ-body">
                <div className="civ-period">{c.period}</div>
                <div className="civ-name">{c.name}</div>
                <p className="civ-desc">{c.desc}</p>
                <div className="civ-foot">
                  <span className="civ-region">{c.region}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="swipe-dots" id="swipeDots">
          {civilizations.map((_, i) => (
            <div
              key={i}
              className={`swipe-dot ${i === activeDot ? "active" : ""}`}
              onClick={() => goToCard(i)}
            />
          ))}
        </div>
      </section>

      {/* TIMELINE — painting gallery */}
      <section className="gallery-section" id="timeline">
        <div className="gallery-backdrop" />

        <div className="relative z-10 text-center mb-10 px-4">
          <span className="block text-[0.7rem] tracking-[0.35em] uppercase text-[#c9a84c] mb-3">
            Historical Journey
          </span>
          <h2 className="font-['Cinzel'] text-4xl md:text-5xl lg:text-6xl font-bold text-[#e8c97a]">
            American History Timeline
          </h2>
        </div>

        <div className="gallery-panel">
          <div className="gallery-text" style={{ opacity: fading ? 0 : 1, transition: "opacity .3s ease" }}>
            <span className="gallery-era-tag">{work.tag}</span>
            <span className="gallery-title-italic">{work.titleItalic}</span>
            <span className="gallery-title-plain">{work.titlePlain}</span>
            <p className="gallery-year">{work.year}</p>
            <p className="gallery-desc">{work.desc}</p>
            <a href="#" className="gallery-discover" onClick={(e) => e.preventDefault()}>
              Explore era
            </a>

            <div className="gallery-nav">
              <button aria-label="Previous" onClick={() => goTo(current - 1)}>
                &#8592;
              </button>
              <button aria-label="Next" onClick={() => goTo(current + 1)}>
                &#8594;
              </button>
            </div>

            <p className="gallery-counter">
              {current + 1} of {WORKS.length}
            </p>
          </div>

          <div className="gallery-paintings" style={{ opacity: fading ? 0 : 1, transition: "opacity .42s ease" }}>
            <div className="painting painting-left">
              <img src={work.left} alt="" />
            </div>
            <div className="painting painting-center">
              <img src={work.center} alt={`${work.titleItalic} ${work.titlePlain}`} />
            </div>
            <div className="painting painting-right">
              <img src={work.right} alt="" />
            </div>

            <div className="gallery-dots">
              {WORKS.map((_, i) => (
                <div key={i} className={`gallery-dot ${i === current ? "active" : ""}`} onClick={() => goTo(i)} />
              ))}
            </div>
          </div>

          <div className="gallery-progress-wrap">
            <div className="gallery-progress-fill" style={{ width: `${((current + 1) / WORKS.length) * 100}%` }} />
          </div>
        </div>
      </section>

      {/* VISIT — community chronicles */}
      <section id="visit">
        <div className="sh">
          <div className="so">Community Scrolls</div>
          <h2 className="st">
            Share Your{" "}
            <em style={{ fontStyle: "italic", color: "#E8B84B" }}>Historical Knowledge</em>
          </h2>
          <p className="sd">Share insights, facts, or stories — every voice adds to the chronicle.</p>
        </div>

        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 44, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Cinzel,serif", fontSize: "2rem", color: "#E8B84B" }}>{reviews.length}</div>
            <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#9E8A6A" }}>
              Chronicles
            </div>
          </div>
          <div style={{ width: 1, background: "rgba(200,149,42,.18)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Cinzel,serif", fontSize: "2rem", color: "#E8B84B" }}>{avgRating}</div>
            <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#9E8A6A" }}>
              Avg. Rating
            </div>
          </div>
          <div style={{ width: 1, background: "rgba(200,149,42,.18)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Cinzel,serif", fontSize: "2rem", color: "#E8B84B" }}>{eraCount}</div>
            <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#9E8A6A" }}>
              Eras Covered
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 1100, margin: "0 auto" }}>
          {/* FORM */}
          <div
            style={{
              background: "linear-gradient(160deg,#1a140d,#0c0906)",
              border: "1px solid rgba(200,149,42,.2)",
              borderRadius: 16,
              padding: "28px 26px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: "linear-gradient(90deg,transparent,rgba(200,149,42,.5),transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(26,20,13,.97)",
                border: "1px solid rgba(200,149,42,.4)",
                borderRadius: 8,
                padding: "10px 16px",
                fontSize: 12,
                color: "#E8B84B",
                opacity: toastOn ? 1 : 0,
                transform: toastOn ? "translateY(0)" : "translateY(-8px)",
                transition: "all .35s",
                pointerEvents: "none",
              }}
            >
              ✦ Chronicle recorded!
            </div>

            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "#E7D2A3", marginBottom: 18 }}>
              Add Your Chronicle
            </div>

            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 10,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "rgba(200,149,42,.65)",
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                Your Name
              </label>
              <input
                type="text"
                maxLength={40}
                placeholder="e.g. Marcus Aurelius"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="si"
                style={{ padding: "10px 14px", fontSize: 13 }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 10,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "rgba(200,149,42,.65)",
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                Historical Era
              </label>
              <select
                value={era}
                onChange={(e) => setEra(e.target.value)}
                className="si"
                style={{ padding: "10px 14px", fontSize: 13, cursor: "pointer" }}
              >
                <option value="" disabled>
                  Select an era…
                </option>
               {[
  "Paleoindian", "Norte Chico", "Olmec", "Maya", "Aztec", "Inca",
].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 10,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "rgba(200,149,42,.65)",
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                Your Rating
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => setRating(v)}
                    onMouseOver={() => setHoverRating(v)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      fontSize: 22,
                      cursor: "pointer",
                      color: v <= (hoverRating || rating) ? "#C8952A" : "rgba(200,149,42,.2)",
                      background: "none",
                      border: "none",
                      padding: 0,
                      lineHeight: 1,
                      transition: "color .15s,transform .15s",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 4 }}>
              <label
                style={{
                  fontSize: 10,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "rgba(200,149,42,.65)",
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                Your Chronicle
              </label>
              <textarea
                maxLength={400}
                placeholder="Share a historical fact, insight, or story…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="si"
                style={{ padding: "10px 14px", fontSize: 13, resize: "vertical", minHeight: 90, lineHeight: 1.6 }}
              />
              <div style={{ fontSize: 10, color: "rgba(200,149,42,.35)", textAlign: "right", marginTop: 4 }}>
                {400 - body.length} characters remaining
              </div>
            </div>

            <button
              onClick={submitChronicle}
              style={{
                width: "100%",
                marginTop: 18,
                background: "linear-gradient(135deg,#C8952A,#E8B84B)",
                color: "#0F0A04",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: 8,
                padding: 12,
                cursor: "pointer",
                transition: "opacity .2s,transform .15s",
              }}
            >
              ✦ Record Chronicle
            </button>
          </div>

          {/* FEED */}
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {ERAS.map((e) => (
                <button
                  key={e}
                  onClick={() => setActiveFilter(e)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 20,
                    fontSize: 10,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: `1px solid rgba(200,149,42,${e === activeFilter ? ".45" : ".2"})`,
                    color: e === activeFilter ? "#E8B84B" : "rgba(200,149,42,.5)",
                    background: e === activeFilter ? "rgba(200,149,42,.12)" : "transparent",
                    transition: "all .2s",
                  }}
                >
                  {e === "All" ? "All" : e.split(" ")[0]}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: 520, overflowY: "auto", paddingRight: 4 }}>
              {filtered.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "rgba(200,149,42,.28)",
                    fontFamily: "'Playfair Display',serif",
                    fontStyle: "italic",
                    border: "1px dashed rgba(200,149,42,.12)",
                    borderRadius: 12,
                  }}
                >
                  No chronicles yet for this era.
                  <br />
                  Be the first to share your knowledge.
                </div>
              ) : (
                filtered.map((r) => {
                  const originalIndex = reviews.indexOf(r);
                  return (
                    <div
                     key={r._id}
                      style={{
                        background: "linear-gradient(150deg,#1a140d,#0c0906)",
                        border: "1px solid rgba(200,149,42,.14)",
                        borderRadius: 12,
                        padding: "18px 20px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 1,
                          background: "linear-gradient(90deg,transparent,rgba(200,149,42,.3),transparent)",
                        }}
                      />
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: AVATARS[originalIndex % AVATARS.length],
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "'Playfair Display',serif",
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#0F0A04",
                              flexShrink: 0,
                            }}
                          >
                            {initials(r.name)}
                          </div>
                          <div>
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 700, color: "#E7D2A3" }}>
                              {r.name}
                            </div>
                            <div style={{ fontSize: 10, color: "#9E8A6A", marginTop: 2 }}>
  {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: "#C8952A", letterSpacing: 1, whiteSpace: "nowrap" }}>{stars(r.rating)}</div>
                      </div>
                      <div
                        style={{
                          display: "inline-block",
                          padding: "2px 10px",
                          borderRadius: 20,
                          fontSize: 9,
                          letterSpacing: ".12em",
                          textTransform: "uppercase",
                          background: "rgba(200,149,42,.09)",
                          border: "1px solid rgba(200,149,42,.2)",
                          color: "rgba(200,149,42,.7)",
                          marginBottom: 8,
                        }}
                      >
                        {r.era}
                      </div>
                      <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 13, color: "#C8A86A", lineHeight: 1.7, margin: 0 }}>
                        "{r.body}"
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 12,
                          paddingTop: 10,
                          borderTop: "1px solid rgba(200,149,42,.08)",
                        }}
                      >
                        <button
                          onClick={() => markHelpful(r._id)}
                          style={{
                            fontSize: 10,
                            color: "rgba(200,149,42,.4)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          👍 Helpful ({r.helpful})
                        </button>
                        <span style={{ fontSize: 10, color: "rgba(200,149,42,.25)" }}>{r.era}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
       </div>
      </section>
     
    </>
  );
}