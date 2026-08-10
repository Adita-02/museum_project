import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";

const CIVILIZATIONS = [
  { glyph: "𓂀",  name: "Ancient Egypt" },
  { glyph: "𒀭",  name: "Mesopotamia" },
  { glyph: "Ω",   name: "Ancient Greece" },
  { glyph: "SPQR", name: "Roman Empire" },
  { glyph: "龙",  name: "Ancient China" },
  { glyph: "𑀩",  name: "Indus Valley" },
  { glyph: "𐎯",  name: "Persian Empire" },
  { glyph: "ᚱ",   name: "Norse Realms" },
  { glyph: "𓃭",  name: "Kingdom of Kush" },
];

const NAV_LINKS = [
  { label: "The Collection",     to: "/gallery" },
  { label: "Expeditions",        to: "/civs" },
  { label: "Curatorial Journal", to: "/timeline" },
  { label: "The Keepers",        to: "/team" },
];

const QUICK_GLYPHS = [
  { glyph: "𓂀", title: "Egypt" },
  { glyph: "𒀭", title: "Mesopotamia" },
  { glyph: "Ω",  title: "Greece" },
  { glyph: "龙", title: "China" },
];

/* ─── Rotating Emblem ────────────────────────── */
function Emblem() {
  return (
    <div className="arc-emblem" aria-hidden="true">
      <svg viewBox="0 0 56 56" className="arc-ring-a">
        <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(232,213,154,.85)" strokeWidth=".9" strokeDasharray="1 4" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 56 56" className="arc-ring-b">
        <circle cx="28" cy="28" r="19" fill="none" stroke="rgba(201,168,76,.6)" strokeWidth=".7" strokeDasharray="5 2.5" />
      </svg>
      <svg viewBox="0 0 56 56" className="arc-ring-dots">
        <circle cx="28" cy="4"  r="1.5" fill="#e8d59a" />
        <circle cx="28" cy="52" r="1.5" fill="#e8d59a" />
        <circle cx="4"  cy="28" r="1.5" fill="#e8d59a" />
        <circle cx="52" cy="28" r="1.5" fill="#e8d59a" />
      </svg>
      <div className="arc-ring-bg" />
      <div className="arc-orbit" />
      <div className="arc-seal">Æ</div>
    </div>
  );
}

/* ─── Ornament Divider ───────────────────────── */
function Divider() {
  return (
    <div className="arc-divider" aria-hidden="true">
      <div className="arc-rule arc-rule-l" />
      <span className="arc-divider-dot">·</span>
      <span className="arc-divider-diamond" />
      <span className="arc-divider-dot">·</span>
      <div className="arc-rule arc-rule-r" />
    </div>
  );
}

/* ─── Field Label ────────────────────────────── */
function FieldLabel({ children, hint }) {
  return (
    <div className="arc-field-label">
      <span className="arc-field-label-main">{children}</span>
      {hint && <span className="arc-field-label-hint">{hint}</span>}
    </div>
  );
}

/* ─── Main Footer ────────────────────────────── */
const Footer = () => {
  const [scrollPct, setScrollPct] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ submitting: false, msg: "", success: false });

  const tickerRef = useRef(null);

  // Scroll progress (top bar)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const denom = h.scrollHeight - h.clientHeight;
      const pct = denom > 0 ? (h.scrollTop / denom) * 100 : 0;
      setScrollPct(Math.min(100, Math.max(0, pct)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pause heavy animations when footer is offscreen / reduced motion is preferred
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tickerRef.current?.classList.add("arc-idle");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) =>
        tickerRef.current?.classList.toggle("arc-idle", !entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (tickerRef.current) io.observe(tickerRef.current);
    return () => io.disconnect();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleFeedback = (e) =>
    setFeedback({ ...feedback, [e.target.name]: e.target.value });

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!feedback.message.trim()) return;
    setStatus({ submitting: true, msg: "", success: false });
    try {
      await api.post("/suggestions", {
        page: "footer",
        name: feedback.name.trim() || "Anonymous",
        email: feedback.email.trim() || "",
        topic: "General Feedback",
        description: feedback.message.trim(),
        type: "feedback",
      });
      setStatus({
        submitting: false,
        msg: "Thank you — your feedback has been recorded.",
        success: true,
      });
      setFeedback({ name: "", email: "", message: "" });
      setTimeout(() => {
        setShowFeedback(false);
        setStatus({ submitting: false, msg: "", success: false });
      }, 4000);
    } catch {
      setStatus({
        submitting: false,
        msg: "Something went wrong. Please try again.",
        success: false,
      });
    }
  };

  return (
    <footer className="arc-footer">
      {/* ── CSS via dangerouslySetInnerHTML so it NEVER gets stripped by React/build ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Tokens ───────────────────────── */
        .arc-footer {
          --gold:       #c9a84c;
          --gold-light: #e8d59a;
          --sand:       #d4c4a0;
          position: relative;
          overflow: hidden;
          margin-top: 3rem;
          border-top: 1px solid rgba(201, 168, 76, 0.1);
          background: #0c0a06;
          color: var(--sand);
          font-family: "Cinzel", serif, system-ui;
        }
        .arc-inner { position: relative; z-index: 10; }

        /* Pause all animations when footer is offscreen */
        .arc-idle, .arc-idle * { animation-play-state: paused !important; }

        /* ── Keyframes ──────────────────── */
        @keyframes arcSpin       { to { transform: rotate(360deg);  } }
        @keyframes arcSpinRev    { to { transform: rotate(-360deg); } }
        @keyframes arcOrbitPulse {
          0%, 100% { opacity: 0.45; transform: scale(0.92); }
          50%      { opacity: 1;    transform: scale(1.18); }
        }
        @keyframes arcGlowPulse {
          0%, 100% {
            box-shadow:
              0 0 0 0 rgba(201, 168, 76, 0.0),
              inset 0 0 0 1px rgba(201, 168, 76, 0.35);
          }
          50% {
            box-shadow:
              0 0 24px 2px rgba(201, 168, 76, 0.18),
              inset 0 0 0 1px rgba(232, 213, 154, 0.55);
          }
        }
        @keyframes arcFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes arcTickerSheen {
          0%   { transform: translateX(-120%); opacity: 0; }
          15%  { opacity: 0.55; }
          85%  { opacity: 0.35; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes arcCornerBreath {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
        @keyframes arcTickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── Progress bar ────────────────── */
        .arc-progress {
          position: absolute;
          top: 0; left: 0;
          height: 2px;
          background: linear-gradient(90deg, #6b4d10, #e8d59a, #c9a84c);
          box-shadow: 0 0 8px rgba(232, 213, 154, 0.7);
          z-index: 30;
          transition: width 120ms ease-out;
        }

        /* ── Ambient glow ────────────────── */
        .arc-ambient, .arc-ambient-2 {
          position: absolute;
          pointer-events: none;
          z-index: 0;
        }
        .arc-ambient {
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 800px; height: 400px;
          background: radial-gradient(circle at center, rgba(201, 168, 76, 0.06) 0%, transparent 70%);
        }
        .arc-ambient-2 {
          bottom: -8rem; right: -8rem;
          width: 500px; height: 500px;
          background: radial-gradient(circle at center, rgba(201, 168, 76, 0.04) 0%, transparent 70%);
        }

        /* ── Emblem ──────────────────────── */
        .arc-emblem {
          position: relative;
          width: 44px; height: 44px;
          flex-shrink: 0;
          filter: drop-shadow(0 0 12px rgba(201, 168, 76, 0.30));
          transform: translateZ(0);
        }
        .arc-emblem svg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          overflow: visible;
        }
        .arc-ring-a    { animation: arcSpin     18s linear infinite; transform-origin: 50% 50%; }
        .arc-ring-b    { animation: arcSpinRev  13s linear infinite; transform-origin: 50% 50%; }
        .arc-ring-dots { animation: arcSpin     30s linear infinite; transform-origin: 50% 50%; }

        .arc-ring-bg {
          position: absolute; inset: 7px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 35% 30%, rgba(255, 235, 180, 0.10), transparent 60%),
            radial-gradient(circle at 50% 50%, #1a140b, #0a0805 75%);
          border: 1px solid rgba(201, 168, 76, 0.35);
        }
        .arc-orbit {
          position: absolute; inset: 0;
          border-radius: 50%;
          animation: arcSpin 9s linear infinite;
          pointer-events: none;
        }
        .arc-orbit::after {
          content: "";
          position: absolute;
          top: -2.5px; left: 50%;
          width: 5px; height: 5px;
          margin-left: -2.5px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fff3c2, #c9a84c 55%, #6b4d10 100%);
          box-shadow:
            0 0 7px rgba(232, 213, 154, 0.9),
            0 0 14px rgba(201, 168, 76, 0.55);
          animation: arcOrbitPulse 3.5s ease-in-out infinite;
        }
        .arc-seal {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: "Cinzel", serif;
          font-size: 18px;
          color: var(--gold-light);
          text-shadow: 0 0 8px rgba(232, 213, 154, 0.45);
        }

        /* ── Ticker ──────────────────────── */
        .arc-ticker {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(201, 168, 76, 0.1);
          /* padding and margin-bottom are now controlled by inline styles for reduced height */
          background:
            radial-gradient(ellipse at 50% 50%, rgba(201, 168, 76, 0.06) 0%, transparent 70%),
            linear-gradient(180deg,
              rgba(201, 168, 76, 0.04)  0%,
              rgba(201, 168, 76, 0.015) 50%,
              rgba(201, 168, 76, 0.04)  100%);
          box-shadow:
            inset 0 1px 0 rgba(232, 213, 154, 0.06),
            inset 0 -1px 0 rgba(232, 213, 154, 0.06);
        }
        .arc-ticker::before,
        .arc-ticker::after {
          content: "";
          position: absolute; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(201, 168, 76, 0.45) 20%,
            rgba(232, 213, 154, 0.7) 50%,
            rgba(201, 168, 76, 0.45) 80%,
            transparent 100%);
          z-index: 5;
          pointer-events: none;
        }
        .arc-ticker::before { top: 0; }
        .arc-ticker::after  { bottom: 0; }

        .arc-ticker-mask-l, .arc-ticker-mask-r {
          position: absolute; top: 0; bottom: 0;
          width: 10%;
          pointer-events: none;
          z-index: 18;
        }
        .arc-ticker-mask-l { left:  0; background: linear-gradient( 90deg, #0c0a06 0%, #0c0a06 35%, rgba(12, 10, 6, 0.5) 70%, transparent 100%); }
        .arc-ticker-mask-r { right: 0; background: linear-gradient(270deg, #0c0a06 0%, #0c0a06 35%, rgba(12, 10, 6, 0.5) 70%, transparent 100%); }

        .arc-ticker-edge {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 22px; height: 22px;
          z-index: 22;
          display: flex; align-items: center; justify-content: center;
          color: rgba(232, 213, 154, 0.7);
          background:
            radial-gradient(circle at 35% 30%, rgba(232, 213, 154, 0.10), transparent 65%),
            linear-gradient(180deg, #15120d 0%, #0c0a06 100%);
          border: 1px solid rgba(201, 168, 76, 0.45);
          border-radius: 50%;
          font-size: 11px;
          animation: arcCornerBreath 3.5s ease-in-out infinite;
        }
        .arc-ticker-edge-l { left:  8px; }
        .arc-ticker-edge-r { right: 8px; }

        .arc-ticker-sheen {
          position: absolute; top: 0; bottom: 0;
          width: 35%;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(232, 213, 154, 0.10) 45%,
            rgba(255, 243, 194, 0.18) 50%,
            rgba(232, 213, 154, 0.10) 55%,
            transparent 100%);
          filter: blur(4px);
          animation: arcTickerSheen 9s linear infinite;
          pointer-events: none;
          z-index: 15;
        }

        .arc-ticker-track {
          display: flex;
          gap: 3rem;
          width: max-content;
          position: relative;
          z-index: 10;
          animation: arcTickerScroll 55s linear infinite;
        }
        .arc-ticker-track:hover { animation-play-state: paused; }

        .arc-ticker-item {
          font-family: "Cinzel", serif;
          font-size: 11.5px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          padding: 4px 2px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
          color: rgba(232, 213, 154, 0.85);
          text-shadow: 0 0 14px rgba(201, 168, 76, 0.18);
          transition: color 0.3s ease, text-shadow 0.3s ease;
        }
        .arc-ticker-item:hover {
          color: #fff3c2;
          text-shadow: 0 0 18px rgba(232, 213, 154, 0.55);
        }
        .arc-ticker-glyph {
          font-size: 20px;
          color: var(--gold);
          filter: drop-shadow(0 0 6px rgba(232, 213, 154, 0.45));
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, rgba(232, 213, 154, 0.10), transparent 70%);
        }
        .arc-ticker-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(201, 168, 76, 0.55);
          box-shadow: 0 0 8px rgba(232, 213, 154, 0.4);
        }

        /* ── Divider ──────────────────────── */
        .arc-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 1.5rem 0;
          user-select: none;
        }
        .arc-rule       { height: 1px; width: 80px; }
        .arc-rule-l     { background: linear-gradient(to right,  transparent, rgba(201, 168, 76, 0.45)); }
        .arc-rule-r     { background: linear-gradient(to left,   transparent, rgba(201, 168, 76, 0.45)); }
        .arc-divider-dot   { color: var(--gold); font-size: 1.2rem; line-height: 1; }
        .arc-divider-diamond {
          width: 6px; height: 6px;
          transform: rotate(45deg);
          border: 1px solid rgba(201, 168, 76, 0.55);
        }

        /* ── Field label ──────────────────── */
        .arc-field-label {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 0.625rem;
        }
        .arc-field-label-main {
          font-family: "Cinzel", serif;
          font-size: 9.5px;
          letter-spacing: 2.6px;
          text-transform: uppercase;
          color: rgba(201, 168, 76, 0.6);
        }
        .arc-field-label-hint {
          font-family: "Cinzel", serif;
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(212, 196, 160, 0.3);
        }

        /* ── Quick glyph (brand column) ───── */
        .arc-quick-glyph {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(201, 168, 76, 0.2);
          background: rgba(201, 168, 76, 0.02);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          color: rgba(201, 168, 76, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .arc-quick-glyph:hover,
        .arc-quick-glyph:focus-visible {
          border-color: var(--gold);
          color: var(--gold);
          background: rgba(201, 168, 76, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 0 15px rgba(201, 168, 76, 0.2);
          outline: none;
        }

        /* ── Feedback card ────────────────── */
        .arc-card {
          position: relative;
          background:
            radial-gradient(circle at 50% 0%, rgba(232, 213, 154, 0.05) 0%, transparent 55%),
            linear-gradient(180deg, #15120d 0%, #0c0a06 100%);
          border: 1px solid rgba(201, 168, 76, 0.35);
          border-radius: 16px;
          box-shadow:
            inset 0 1px 0 rgba(232, 213, 154, 0.08),
            0 0 0 1px rgba(201, 168, 76, 0.04),
            0 18px 50px rgba(0, 0, 0, 0.55),
            0 0 30px rgba(201, 168, 76, 0.06);
          overflow: hidden;
        }
        .arc-card::before {
          content: "";
          position: absolute; inset: 0;
          border-radius: 16px;
          background-image: repeating-linear-gradient(
            135deg,
            rgba(201, 168, 76, 0.018) 0px,
            rgba(201, 168, 76, 0.018) 1px,
            transparent 1px,
            transparent 9px);
          pointer-events: none;
        }
        .arc-card::after {
          content: "";
          position: absolute; inset: 0;
          border-radius: 16px;
          padding: 1px;
          background: linear-gradient(135deg,
            rgba(232, 213, 154, 0.55),
            rgba(201, 168, 76, 0.08) 35%,
            rgba(0, 0, 0, 0) 60%,
            rgba(201, 168, 76, 0.35));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0.0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          pointer-events: none;
        }
        .arc-card:hover { animation: arcGlowPulse 2.6s ease-in-out infinite; }

        .arc-card-inner {
          position: relative;
          z-index: 10;
          padding: 2rem 2rem 1.5rem;
        }
        @media (min-width: 768px) {
          .arc-card-inner { padding: 2.5rem 3rem 1.75rem; }
        }

        .arc-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .arc-icon-tile {
          width: 48px; height: 48px;
          border-radius: 12px;
          border: 1px solid rgba(201, 168, 76, 0.45);
          background:
            radial-gradient(circle at 35% 30%, rgba(232, 213, 154, 0.10), transparent 60%),
            linear-gradient(180deg, rgba(201, 168, 76, 0.06), rgba(201, 168, 76, 0.02));
          display: flex; align-items: center; justify-content: center;
          color: var(--gold-light);
          box-shadow:
            inset 0 1px 0 rgba(232, 213, 154, 0.15),
            0 0 14px rgba(201, 168, 76, 0.18);
          flex-shrink: 0;
        }
        .arc-card-title {
          margin: 0;
          font-family: "Cinzel", serif;
          font-size: 15px;
          letter-spacing: 2.6px;
          text-transform: uppercase;
          color: var(--gold-light);
          line-height: 1;
        }
        .arc-card-sub {
          margin: 8px 0 0;
          font-family: "Cinzel", serif;
          font-size: 9px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: rgba(201, 168, 76, 0.45);
        }
        .arc-card-rule {
          height: 1px;
          background: linear-gradient(90deg,
            rgba(201, 168, 76, 0.55),
            rgba(201, 168, 76, 0.10) 60%,
            transparent);
          margin-top: 1rem;
        }
        .arc-card-intro {
          font-family: "Crimson Pro", serif;
          font-style: italic;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(212, 196, 160, 0.8);
          margin: 1.5rem 0 2rem;
        }

        /* ── Feedback CTA ────────────────── */
        .arc-cta {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 16px 24px;
          border: 1px solid rgba(201, 168, 76, 0.55);
          border-radius: 12px;
          background: transparent;
          color: var(--gold-light);
          font-family: "Cinzel", serif;
          font-size: 13px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.36s ease;
          overflow: hidden;
          isolation: isolate;
          box-shadow:
            inset 0 1px 0 rgba(232, 213, 154, 0.08),
            0 6px 16px rgba(0, 0, 0, 0.35);
        }
        .arc-cta::before {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(232, 213, 154, 0.20), rgba(201, 168, 76, 0.07) 60%);
          opacity: 0;
          transition: opacity 0.36s ease;
          z-index: -1;
        }
        .arc-cta::after {
          content: "";
          position: absolute;
          left: 12px; right: 12px; bottom: 8px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(232, 213, 154, 0.7), transparent);
          opacity: 0;
          transition: opacity 0.36s ease;
        }
        .arc-cta:hover, .arc-cta:focus-visible {
          border-color: var(--gold);
          color: #fff3c2;
          transform: translateY(-1px);
          box-shadow:
            0 0 26px rgba(201, 168, 76, 0.30),
            inset 0 0 14px rgba(201, 168, 76, 0.18),
            0 8px 22px rgba(0, 0, 0, 0.5);
          outline: none;
        }
        .arc-cta:hover::before, .arc-cta:focus-visible::before { opacity: 1; }
        .arc-cta:hover::after,  .arc-cta:focus-visible::after  { opacity: 0.9; }
        .arc-cta-left   { display: inline-flex; align-items: center; gap: 12px; }
        .arc-cta-arrow  { display: inline-block; font-size: 1.1rem; transition: transform 0.36s ease; }
        .arc-cta-arrow-open { transform: rotate(90deg); }

        /* feedback panel */
        .arc-feedback-panel {
          margin-top: 2rem;
          animation: arcFadeUp 0.3s ease both;
        }
        .arc-thanks-wrap  { text-align: center; padding: 1.5rem 1rem; }
        .arc-thanks-icon  { font-size: 2.5rem; color: var(--gold); margin-bottom: 0.75rem; }
        .arc-thanks-msg   {
          color: var(--gold-light);
          font-family: "Cinzel", serif;
          font-size: 1rem;
          letter-spacing: 0.05em;
        }
        .arc-thanks-sub   {
          color: rgba(212, 196, 160, 0.55);
          font-size: 13px;
          margin-top: 0.5rem;
          font-style: italic;
          font-family: "Crimson Pro", serif;
        }

        /* ── Form ─────────────────────────── */
        .arc-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .arc-form-rule {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(212, 196, 160, 0.5);
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-family: "Cinzel", serif;
        }
        .arc-form-rule-line { flex: 1; height: 1px; background: rgba(201, 168, 76, 0.35); max-width: 40px; }

        .arc-input {
          width: 100%;
          background: rgba(201, 168, 76, 0.04);
          border: 1px solid rgba(201, 168, 76, 0.22);
          color: var(--sand);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.3s ease;
        }
        .arc-input::placeholder {
          color: rgba(212, 196, 160, 0.28);
          letter-spacing: 1px;
          font-size: 11px;
        }
        .arc-input:focus, .arc-input:focus-visible {
          outline: none;
          border-color: var(--gold);
          background: rgba(201, 168, 76, 0.07);
          box-shadow:
            0 0 0 3px rgba(201, 168, 76, 0.08),
            0 0 18px rgba(201, 168, 76, 0.15);
        }
        .arc-textarea { resize: none; line-height: 1.5; }

        .arc-submit {
          position: relative;
          width: 100%;
          padding: 14px 18px;
          border: 0;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--gold) 0%, #b08d3a 100%);
          color: #0d0b07;
          font-family: "Cinzel", serif;
          font-size: 12px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow:
            inset 0 1px 0 rgba(232, 213, 154, 0.4),
            0 6px 18px rgba(0, 0, 0, 0.35);
        }
        .arc-submit:hover:not(:disabled),
        .arc-submit:focus-visible:not(:disabled) {
          box-shadow:
            inset 0 1px 0 rgba(232, 213, 154, 0.4),
            0 0 32px rgba(201, 168, 76, 0.35);
          transform: translateY(-1px);
          outline: none;
        }
        .arc-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .arc-submit-inner { position: relative; z-index: 10; }

        .arc-error {
          text-align: center;
          font-size: 0.9rem;
          color: rgba(248, 113, 113, 0.85);
          animation: arcFadeUp 0.3s ease both;
          padding-top: 0.25rem;
        }
        .arc-card-seal {
          font-family: "Cinzel", serif;
          font-size: 9px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(201, 168, 76, 0.55);
          margin: 1.5rem 0 0;
          padding-top: 0.75rem;
          text-align: center;
        }

        /* ── Side blocks (Hours, Nav) ─────── */
        .arc-side {
          border-left: 1px solid rgba(201, 168, 76, 0.18);
          padding-left: 1.75rem;
        }
        .arc-side-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 0.75rem;
        }
        .arc-side-glyph { color: var(--gold); font-size: 1rem; line-height: 1; }
        .arc-side-title {
          margin: 0;
          font-family: "Cinzel", serif;
          color: var(--gold);
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .arc-hours-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin: 0 0 0.75rem;
          padding: 0;
        }
        .arc-hours-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(201, 168, 76, 0.06);
        }
        .arc-hours-row dt {
          font-size: 0.8rem;
          color: rgba(212, 196, 160, 0.7);
          font-family: "Cinzel", serif;
          margin: 0;
        }
        .arc-hours-row dd {
          font-size: 0.8rem;
          letter-spacing: 1px;
          color: rgba(201, 168, 76, 0.85);
          font-family: "Cinzel", serif;
          font-weight: 500;
          margin: 0;
        }
        .arc-hours-note {
          font-size: 10px;
          letter-spacing: 1px;
          color: rgba(201, 168, 76, 0.55);
          font-style: italic;
          font-family: "Cinzel", serif;
          margin: 0;
        }

        .arc-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        .arc-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: "Cinzel", serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(212, 196, 160, 0.6);
          text-decoration: none;
          cursor: pointer;
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .arc-nav-link:hover, .arc-nav-link:focus-visible {
          color: var(--gold);
          transform: translateX(2px);
          outline: none;
        }
        .arc-nav-bullet {
          font-size: 8px;
          color: var(--gold);
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .arc-nav-link:hover .arc-nav-bullet,
        .arc-nav-link:focus-visible .arc-nav-bullet {
          opacity: 1;
          transform: translateX(0);
        }

        /* ── Back-to-top ──────────────────── */
        .arc-back-top {
          position: relative;
          padding: 14px 36px;
          border-radius: 999px;
          border: 1px solid rgba(201, 168, 76, 0.35);
          background:
            radial-gradient(circle at 50% 0%, rgba(232, 213, 154, 0.10), transparent 60%),
            rgba(201, 168, 76, 0.05);
          font-family: "Cinzel", serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(212, 196, 160, 0.75);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          min-width: 220px;
          transition: all 0.36s ease;
        }
        .arc-back-top:hover, .arc-back-top:focus-visible {
          border-color: var(--gold);
          color: var(--gold-light);
          background:
            radial-gradient(circle at 50% 0%, rgba(232, 213, 154, 0.20), transparent 60%),
            rgba(201, 168, 76, 0.10);
          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.45),
            0 0 22px rgba(201, 168, 76, 0.3);
          letter-spacing: 4px;
          outline: none;
        }
        .arc-back-arrow { font-size: 1.1rem; transition: transform 0.3s ease; }
        .arc-back-top:hover .arc-back-arrow { transform: translateY(-2px); }

        /* ── Responsive ───────────────────── */
        @media (max-width: 768px) {
          .arc-ticker-track { animation-duration: 35s; }
        }

        /* ── Reduced motion ───────────────── */
        @media (prefers-reduced-motion: reduce) {
          .arc-ring-a, .arc-ring-b, .arc-ring-dots,
          .arc-orbit, .arc-orbit::after,
          .arc-ticker-edge, .arc-ticker-sheen, .arc-ticker-track,
          .arc-card:hover {
            animation: none !important;
          }
        }
      ` }} />

      {/* Scroll progress */}
      <div className="arc-progress" style={{ width: `${scrollPct}%` }} aria-hidden="true" />

      {/* Ambient glow */}
      <div className="arc-ambient" aria-hidden="true" />
      <div className="arc-ambient-2" aria-hidden="true" />

      <div className="arc-inner">
        {/* ── Civilization Ticker ──────────────────────────────── */}
        <div
          className="arc-ticker"
          ref={tickerRef}
          aria-label="Featured civilizations"
          style={{
            paddingTop:    ".5rem",   
            paddingBottom: "1rem",    
            marginBottom:  "1rem",
          }}
        >
          <div className="arc-ticker-mask-l" aria-hidden="true" />
          <div className="arc-ticker-mask-r" aria-hidden="true" />
          <div className="arc-ticker-edge arc-ticker-edge-l" aria-hidden="true">·</div>
          <div className="arc-ticker-edge arc-ticker-edge-r" aria-hidden="true">·</div>
          <div className="arc-ticker-sheen" aria-hidden="true" />

          <div className="arc-ticker-track">
            {[...CIVILIZATIONS, ...CIVILIZATIONS].map((c, i) => (
              <React.Fragment key={i}>
                <span className="arc-ticker-item">
                  <span className="arc-ticker-glyph">{c.glyph}</span>
                  {c.name}
                </span>
                <span className="arc-ticker-dot" aria-hidden="true" />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Main Content ─────────────────────────────────────── */}
        <div
          className="px-6 md:px-12 max-w-[1400px] mx-auto"
          style={{
            paddingTop:    "0.5rem",     
            paddingBottom: "1rem",     
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.5fr_1fr] gap-12 lg:gap-16">
            {/* Brand column – now always left-aligned */}
            <div className="flex flex-col items-start text-left gap-8">
              <div className="flex items-center justify-start gap-3 font-['Cinzel',serif] text-[24px] md:text-[28px] text-[var(--gold-light)] tracking-[3px]">
                <Emblem />
                <div>
                  ARCHÆUM
                  <span className="block text-[9px] tracking-[4px] text-[rgba(201,168,76,0.4)] mt-1 font-['DM_Sans',sans-serif]">
                    World Museum of Archaeology
                  </span>
                </div>
              </div>
              <p className="font-['Crimson_Pro',serif] text-[15px] text-[rgba(212,196,160,0.55)] leading-relaxed max-w-[320px]">
                A digital journey through 5,000 years of human civilization —
                artifacts, stories, and discoveries preserved for the modern world.
              </p>
              <div className="flex gap-3">
                {QUICK_GLYPHS.map((c, i) => (
                  <div key={i} title={c.title} className="arc-quick-glyph">
                    {c.glyph}
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Card */}
            <div className="arc-card">
              <div className="arc-card-inner">
                <div className="arc-card-header">
                  <span className="arc-icon-tile">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16v11H8l-4 4V4z" />
                      <line x1="8" y1="8" x2="16" y2="8" />
                      <line x1="8" y1="11" x2="13" y2="11" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="arc-card-title">Anonymous Feedback</h3>
                    <p className="arc-card-sub">Whisper to the Curator</p>
                  </div>
                </div>

                <div className="arc-card-rule" />

                <p className="arc-card-intro">
                  Share ideas, report bugs, or leave honest feedback about the collection.
                </p>

                <button
                  type="button"
                  onClick={() => setShowFeedback((v) => !v)}
                  className="arc-cta"
                  aria-expanded={showFeedback}
                  aria-controls="footer-feedback-panel"
                >
                  <span className="arc-cta-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    {showFeedback ? "Close Form" : "Leave Anonymous Feedback"}
                  </span>
                  <span className={`arc-cta-arrow ${showFeedback ? "arc-cta-arrow-open" : ""}`}>→</span>
                </button>

                {showFeedback && (
                  <div id="footer-feedback-panel" className="arc-feedback-panel">
                    {status.success ? (
                      <div className="arc-thanks-wrap">
                        <div className="arc-thanks-icon">✦</div>
                        <p className="arc-thanks-msg">{status.msg}</p>
                        <p className="arc-thanks-sub">Your voice helps us improve.</p>
                      </div>
                    ) : (
                      <form onSubmit={submitFeedback} className="arc-form">
                        <div className="arc-form-rule">
                          <span className="arc-form-rule-line" />
                          <span>Share your thoughts</span>
                          <span className="arc-form-rule-line" />
                        </div>

                        <div>
                          <FieldLabel hint="optional">Name</FieldLabel>
                          <input
                            type="text"
                            name="name"
                            placeholder="Leave blank to stay anonymous"
                            value={feedback.name}
                            onChange={handleFeedback}
                            className="arc-input"
                          />
                        </div>

                        <div>
                          <FieldLabel hint="optional">Email</FieldLabel>
                          <input
                            type="email"
                            name="email"
                            placeholder="For reply only — never displayed"
                            value={feedback.email}
                            onChange={handleFeedback}
                            className="arc-input"
                          />
                        </div>

                        <div>
                          <FieldLabel>Message</FieldLabel>
                          <textarea
                            name="message"
                            rows={4}
                            placeholder="Tell us what's on your mind…"
                            value={feedback.message}
                            onChange={handleFeedback}
                            required
                            className="arc-input arc-textarea"
                          />
                        </div>

                        <button type="submit" disabled={status.submitting} className="arc-submit">
                          <span className="arc-submit-inner">
                            {status.submitting ? "Submitting…" : "Send Feedback"}
                          </span>
                        </button>

                        {status.msg && !status.success && (
                          <p className="arc-error">{status.msg}</p>
                        )}
                      </form>
                    )}
                  </div>
                )}

                <p className="arc-card-seal">Sealed by the Archivist</p>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-10">
              <div className="arc-side">
                <div className="arc-side-head">
                  <span className="arc-side-glyph">·</span>
                  <h4 className="arc-side-title">Visiting Hours</h4>
                </div>
                <dl className="arc-hours-list">
                  <div className="arc-hours-row">
                    <dt>Mon — Fri</dt>
                    <dd>09:00 — 18:00</dd>
                  </div>
                  <div className="arc-hours-row">
                    <dt>Sat — Sun</dt>
                    <dd>10:00 — 20:00</dd>
                  </div>
                </dl>
                <p className="arc-hours-note">Last entry 45m before closing</p>
              </div>

              <div className="arc-side">
                <div className="arc-side-head">
                  <span className="arc-side-glyph">·</span>
                  <h4 className="arc-side-title">Navigation</h4>
                </div>
                <ul className="arc-nav-list">
                  {NAV_LINKS.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="arc-nav-link">
                        <span className="arc-nav-bullet">🜚</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Fine Print ────────────────────────────────────────── */}
        <div
          className="px-6 md:px-12 max-w-[1400px] mx-auto flex flex-col items-center text-center border-t border-[rgba(201,168,76,0.12)]"
          style={{
            paddingTop:    "0.25rem",     
            paddingBottom: "2rem",   
            gap:           "1rem",  
          }}
        >
          <Divider />

          <p className="font-['Cinzel',serif] text-[11px] text-[rgba(201,168,76,0.7)] tracking-[3px] uppercase italic">
            Preserving the ancient world for the digital age
          </p>

          <div className="flex flex-col items-center gap-5">
            <p className="font-['DM_Sans',sans-serif] text-[9px] text-[rgba(212,196,160,0.45)] tracking-[0.25em] uppercase">
              © 2026 Archæum Museum. All rights reserved.
            </p>

            <button onClick={scrollToTop} className="arc-back-top">
              <span className="arc-back-arrow">↑</span>
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;