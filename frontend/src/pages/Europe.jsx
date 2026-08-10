
// src/pages/Europe.jsx
// Converted from europe.html. Uses its own EuropeNav (not the global Navbar) but
// still reuses the shared global <Footer /> since europe.html's footer markup is
// identical to the site-wide footer already built into archaeum.css.
//
// Requires: npm install leaflet
// Images (europe1.jpg ... europe6.jpg) are expected in /public.

import { useEffect, useRef, useState } from "react";




const TICKER_WORDS = [
  "Renaissance", "Baroque", "Romanticism", "Impressionism", "Neoclassicism",
  "Gothic Revival", "Chiaroscuro", "Oil Painting", "Fresco Simulation", "Museum Quality",
];

const MOSAIC = [
  { img: "/europe6.jpg", alt: "Europe History", main: true, tag: "Baroque · Venice", title: "Grand Canal at Dusk" },
  { img: "/europe1.jpg", alt: "Paris Night", tag: "Impressionist · Paris" },
  { img: "/europe2.jpg", alt: "Tuscany", tag: "Renaissance · Tuscany" },
  { img: "/europe4.jpg", alt: "Colosseum", tag: "Neoclassical · Rome" },
  { img: "/europe5.jpg", alt: "Rome", tag: "Chiaroscuro · Rome" },
];

const PHONE_CARDS = [
  { icon: "🏛️", era: "City States", title: "Greek & Roman City States", desc: "Explore Athens, Sparta, and Rome — where democracy, philosophy, and empire-building shaped Western civilization forever.", tag: "600 BC – 476 AD" },
  { icon: "⚔️", era: "Warfare", title: "Classical Warfare & Empires", desc: "Legions, hoplites, and imperial strategy expanded territories across Europe, North Africa, and the Mediterranean.", tag: "499 BC – 200 AD" },
  { icon: "🏺", era: "Heritage", title: "Archaeological Heritage", desc: "Ancient ruins, artifacts, and inscriptions reveal the daily life and culture of the earliest Europeans.", tag: "3000 BC +" },
  { icon: "📜", era: "Philosophy", title: "Philosophy & Knowledge", desc: "From Socrates to Aristotle and Cicero — ancient thinkers shaped ethics, politics, and the foundations of science.", tag: "470 – 65 BC" },
  { icon: "🚢", era: "Trade", title: "Ancient Trade Networks", desc: "Mediterranean routes connected Europe, Asia, and Africa — forming early global exchange systems of goods and ideas.", tag: "800 BC – 300 AD" },
  { icon: "🌍", era: "Culture", title: "Cultural Foundations", desc: "Mythology, religion, and storytelling shaped the very identity of ancient Europe across countless generations.", tag: "1200 BC +" },
];

const MAP_MARKERS = [
  { pos: [37.9838, 23.7275], html: "<b>Ancient Greece 🇬🇷</b><br>Birthplace of democracy, philosophy, and Olympic Games." },
  { pos: [41.9028, 12.4964], html: "<b>Roman Empire 🏛️</b><br>Roads, law, architecture shaped Europe." },
  { pos: [59.3293, 18.0686], html: "<b>Viking Age ⚔️</b><br>Seafaring explorers, trade routes, and settlements." },
  { pos: [51.1789, -1.8262], html: "<b>Stonehenge 🪨</b><br>Mysterious prehistoric monument in England." },
];

function FadeUp({ children, className = "", style = {}, as: Tag = "div" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`eur-fade-up ${visible ? "visible" : ""} ${className}`} style={style}>
      {children}
    </Tag>
  );
}

export default function Europe() {
  /* ---------- ticker ---------- */
  const API_BASE = "http://localhost:5001/api";
  const tickerLoop = [...TICKER_WORDS, ...TICKER_WORDS];

  /* ---------- suggest a topic form ---------- */
  const [suggestForm, setSuggestForm] = useState({ name: "", email: "", topic: "", description: "" });
  const [suggestSubmitting, setSuggestSubmitting] = useState(false);
  const [suggestMsg, setSuggestMsg] = useState({ text: "", type: "" });

  const handleSuggestChange = (e) =>
    setSuggestForm({ ...suggestForm, [e.target.name]: e.target.value });

  const handleSuggestSubmit = async (e) => {
    e.preventDefault();
    if (!suggestForm.name.trim() || !suggestForm.topic.trim()) return;
    setSuggestSubmitting(true);
    setSuggestMsg({ text: "", type: "" });
    try {
      const res = await fetch(`${API_BASE}/suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: "europe", ...suggestForm }),
      });
      if (!res.ok) throw new Error("Submit failed");
      setSuggestForm({ name: "", email: "", topic: "", description: "" });
      setSuggestMsg({ text: "Thank you! We'll review your suggestion soon.", type: "success" });
    } catch (err) {
      setSuggestMsg({ text: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setSuggestSubmitting(false);
    }
  };

  /* ---------- phone carousel ---------- */
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const cardRefs = useRef([]);
  const [current, setCurrent] = useState(2);
  const dragRef = useRef({ startX: 0, startTX: 0, isDragging: false });

  const getTX = () => {
    if (!trackRef.current) return 0;
    const mat = new DOMMatrix(getComputedStyle(trackRef.current).transform);
    return mat.m41;
  };

  const scrollToActive = (animated = true) => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    const cardEl = cardRefs.current[current];
    if (!wrap || !track || !cardEl) return;
    const wrapW = wrap.offsetWidth;
    const cardL = cardEl.offsetLeft;
    const cardW = cardEl.offsetWidth;
    const target = -(cardL - wrapW / 2 + cardW / 2);
    track.style.transition = animated ? "transform 0.45s cubic-bezier(0.23,1,0.32,1)" : "none";
    track.style.transform = `translateX(${target}px)`;
  };

  const goTo = (idx) => {
    if (idx < 0 || idx >= PHONE_CARDS.length) return;
    setCurrent(idx);
  };

  useEffect(() => {
    scrollToActive(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  useEffect(() => {
    requestAnimationFrame(() => scrollToActive(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTrackMouseDown = (e) => {
    dragRef.current.isDragging = false;
    dragRef.current.startX = e.clientX;
    dragRef.current.startTX = getTX();
    trackRef.current.style.transition = "none";
    trackRef.current.style.cursor = "grabbing";
  };
  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.startX) return;
      const dx = e.clientX - dragRef.current.startX;
      if (Math.abs(dx) > 5) dragRef.current.isDragging = true;
      if (trackRef.current) trackRef.current.style.transform = `translateX(${dragRef.current.startTX + dx}px)`;
    };
    const onUp = (e) => {
      if (!dragRef.current.startX) return;
      if (trackRef.current) trackRef.current.style.cursor = "grab";
      const dx = e.clientX - dragRef.current.startX;
      dragRef.current.startX = 0;
      if (Math.abs(dx) > 50) {
        goTo(dx < 0 ? Math.min(current + 1, PHONE_CARDS.length - 1) : Math.max(current - 1, 0));
      } else {
        scrollToActive(true);
      }
      setTimeout(() => (dragRef.current.isDragging = false), 60);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const onTouchStart = (e) => {
    dragRef.current.touchStartX = e.touches[0].clientX;
    dragRef.current.startTX = getTX();
    trackRef.current.style.transition = "none";
  };
  const onTouchMove = (e) => {
    const dx = e.touches[0].clientX - dragRef.current.touchStartX;
    trackRef.current.style.transform = `translateX(${dragRef.current.startTX + dx}px)`;
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - dragRef.current.touchStartX;
    if (Math.abs(dx) > 40) {
      goTo(dx < 0 ? Math.min(current + 1, PHONE_CARDS.length - 1) : Math.max(current - 1, 0));
    } else {
      scrollToActive(true);
    }
  };

  const cardClass = (i) => {
    const d = Math.abs(i - current);
    if (d === 0) return "active";
    if (d === 1) return "side";
    return "far";
  };

  /* ---------- Leaflet map ---------- */
  const mapElRef = useRef(null);
  const mapInstance = useRef(null);
  useEffect(() => {
    if (mapInstance.current || !mapElRef.current) return;
    const map = L.map(mapElRef.current).setView([54.526, 15.2551], 4);
    mapInstance.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap & CARTO",
      subdomains: "abcd",
      maxZoom: 18,
    }).addTo(map);

    const icon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    MAP_MARKERS.forEach((m) => {
      L.marker(m.pos, { icon }).addTo(map).bindPopup(m.html);
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <>
  

      {/* HERO */}
      <section className="eur-hero-section">
        <div className="eur-hero-bg" style={{ backgroundImage: "linear-gradient(to bottom, rgba(15,10,4,0.3) 0%, rgba(15,10,4,0.0) 30%, rgba(15,10,4,0.55) 70%, rgba(15,10,4,1) 100%), url('/europe3.jpg')" }} />
        <div className="eur-hero-overlay" />

      <div
  className="relative z-10 w-full px-6 md:px-16 pb-8"
  style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "110px" }}
>
          <div className="max-w-2xl">
            <h1 className="eur-hero-headline mb-6">
              Discover the Story of
              <br />
              <em>Europe Through Time</em>
            </h1>

            <p style={{ fontSize: "1.05rem", color: "#C8A86A", maxWidth: 480, lineHeight: 1.7, marginBottom: "2rem" }}>
              From Ancient Greece and the Roman Empire to the Renaissance and Modern Europe, explore the events,
              empires, cultures, and people that shaped the continent.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <button className="eur-btn-gold" onClick={() => document.getElementById("ticker")?.scrollIntoView({ behavior: "smooth" })}>
                Explore Europe Collection
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {[
                ["120M+", "Active Users"],
                ["55k+", "Daily Artworks"],
                ["25+", "AI Fine Art Styles"],
              ].map(([n, l], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                  {i > 0 && <div className="eur-stat-divider" />}
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 700, color: "#E8B84B" }}>{n}</div>
                    <div style={{ fontSize: "0.72rem", color: "#9E8A6A", letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="eur-ticker-wrap">
        <div className="eur-ticker-inner" id="ticker">
          {tickerLoop.map((w, i) => (
            <span key={i}>
              {w}
              <span className="gold"> ✦ </span>
            </span>
          ))}
        </div>
      </div>

      {/* GALLERY MOSAIC */}
     <section className="px-6 md:px-16 py-20" style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <FadeUp className="mb-10">
          <div className="eur-section-eyebrow">European Masterworks</div>
          <div className="flex items-end justify-between">
            <h2 className="eur-section-heading max-w-lg">
              All you need to reconstruct the echoes of Ancient Europe—no brush, no era, only vision.
            </h2>
          </div>
        </FadeUp>

        <FadeUp className="eur-gallery-mosaic">
          {MOSAIC.map((m, i) => (
            <div className={`eur-art-card ${m.main ? "eur-main-img" : ""}`} key={i}>
              <img src={m.img} alt={m.alt} />
              <div className="eur-art-card-overlay">
                <div style={{ fontSize: m.main ? "0.68rem" : "0.62rem", color: "#C8952A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: m.main ? "0.25rem" : 0 }}>
                  {m.tag}
                </div>
                {m.title && <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", color: "#F2E4C4" }}>{m.title}</div>}
              </div>
            </div>
          ))}
        </FadeUp>
      </section>

      {/* PHONE CAROUSEL */}
      <section className="eur-carousel-section" id="ancientEurope">
        <FadeUp className="eur-cs-header">
          <div className="eur-cs-eyebrow">Ancient Europe</div>
          <h2 className="eur-cs-heading">
            Rise of Early <em>Civilizations</em>
          </h2>
          <p className="eur-cs-sub">Drag or swipe to journey through the ancient world</p>
        </FadeUp>

        <div className="eur-phone-track-wrap" ref={wrapRef}>
          <div className="eur-fade-edge-left" />
          <div className="eur-fade-edge-right" />

          <button className="eur-arrow-btn eur-arrow-left" onClick={() => goTo(current - 1)}>
            &#8592;
          </button>
          <button className="eur-arrow-btn eur-arrow-right" onClick={() => goTo(current + 1)}>
            &#8594;
          </button>

          <div
            className="eur-phone-track"
            ref={trackRef}
            onMouseDown={onTrackMouseDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {PHONE_CARDS.map((c, i) => (
              <div
                className={`eur-phone-card ${cardClass(i)}`}
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                onClick={() => !dragRef.current.isDragging && goTo(i)}
              >
                <div className="eur-pc-glow" />
                <div className="eur-pc-noise" />
                <div className="eur-pc-icon-wrap">{c.icon}</div>
                <div className="eur-pc-content">
                  <div className="eur-pc-era">{c.era}</div>
                  <div className="eur-pc-title">{c.title}</div>
                  <div className="eur-pc-divider" />
                  <div className="eur-pc-desc">{c.desc}</div>
                  <div className="eur-pc-tag">{c.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="eur-carousel-dots">
          {PHONE_CARDS.map((_, i) => (
            <div key={i} className={`eur-c-dot ${i === current ? "active" : ""}`} onClick={() => goTo(i)} />
          ))}
        </div>
      </section>

      {/* SUGGEST A TOPIC */}
      <section className="px-6 md:px-16 py-20" style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <FadeUp className="eur-suggest-section">
          <div className="eur-suggest-text">
            <div className="eur-section-eyebrow">Have an Idea?</div>
            <h2 className="eur-section-heading">
              Suggest a <em style={{ fontStyle: "italic", color: "#E8B84B" }}>Topic or Civilization</em>
            </h2>
            <p>
              Is there a European era, empire, or civilization you'd love to see reconstructed?
              Share it with us — your suggestion could shape our next collection.
            </p>
          </div>
          <div className="eur-suggest-card">
            <form onSubmit={handleSuggestSubmit}>
              <div className="eur-form-group">
                <label>Your Name</label>
                <input
                  className="eur-form-input"
                  name="name"
                  value={suggestForm.name}
                  onChange={handleSuggestChange}
                  placeholder="e.g. Rafiul Islam"
                  required
                />
              </div>
              <div className="eur-form-group">
                <label>Email (optional)</label>
                <input
                  className="eur-form-input"
                  type="email"
                  name="email"
                  value={suggestForm.email}
                  onChange={handleSuggestChange}
                  placeholder="you@example.com"
                />
              </div>
              <div className="eur-form-group">
                <label>Topic / Civilization</label>
                <input
                  className="eur-form-input"
                  name="topic"
                  value={suggestForm.topic}
                  onChange={handleSuggestChange}
                  placeholder="e.g. Byzantine Empire"
                  required
                />
              </div>
              <div className="eur-form-group">
                <label>Why should we cover this? (optional)</label>
                <textarea
                  className="eur-form-textarea"
                  name="description"
                  value={suggestForm.description}
                  onChange={handleSuggestChange}
                  placeholder="Tell us a bit more..."
                  rows={3}
                />
              </div>
              <button type="submit" className="eur-btn-gold eur-form-submit" disabled={suggestSubmitting}>
                {suggestSubmitting ? "Submitting..." : "Submit Suggestion"}
              </button>
              {suggestMsg.text && (
                <p className={`eur-form-msg ${suggestMsg.type}`}>{suggestMsg.text}</p>
              )}
            </form>
          </div>
        </FadeUp>
      </section>

      </>
    
  );
}