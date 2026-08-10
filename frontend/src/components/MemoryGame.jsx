import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Sparkles, Trophy, RotateCcw, Puzzle, Grid3x3, Timer, Eye, EyeOff,
  Volume2, VolumeX, BookOpen, Star, Award, Zap, Flame, Crown,
  HelpCircle, Globe, Compass 
} from "lucide-react";

/* =========================================================
   ARCHAEUM VAULT GAMES — Memory + Slide + Q&A Quiz
   ========================================================= */

const RELICS = [
  { id: 1,  emoji: "🏛️", name: "Temple",  codex: "Built where the first sunrise touched stone. Said to remember every footfall." },
  { id: 2,  emoji: "📜", name: "Scroll",  codex: "Ink that never fades, even when the world around it does." },
  { id: 3,  emoji: "⚱️", name: "Urn",     codex: "Houses the silence between two heartbeats of the earth." },
  { id: 4,  emoji: "🗿", name: "Statue",  codex: "Its eyes were carved last — so it could see you arriving." },
  { id: 5,  emoji: "🔱", name: "Trident", codex: "Once held by the storm itself. It rains away lies." },
  { id: 6,  emoji: "🪙", name: "Coin",    codex: "Spend it once and time is yours to bargain with." },
  { id: 7,  emoji: "🏺", name: "Vase",    codex: "Holds the memory of seven oceans — none of it water." },
  { id: 8,  emoji: "🛡️", name: "Shield",  codex: "Reflects what its bearer most fears. Stays sharp forever." },
  { id: 9,  emoji: "🗝️", name: "Key",     codex: "Locks have forgotten more than we have remembered." },
  { id: 10, emoji: "🪶", name: "Quill",   codex: "Writes only what is true — politely." },
];

const DIFFICULTY = {
  easy:   { label: "Novice",   pairs: 4, cols: 4, tier: 1 },
  medium: { label: "Adept",    pairs: 6, cols: 4, tier: 2 },
  hard:   { label: "Archivist",pairs: 8, cols: 4, tier: 3 },
};

/* ---------------- Helpers ---------------- */
const shuffleArray = (a) => {
  const s = [...a];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
};
const formatTime = (s) => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
};
const bestKey = (game, diff) => `archaeum.best.${game}.${diff}`;
const codexKey = (game) => `archaeum.codex.${game}`;
const quizBestKey = () => `archaeum.best.quiz`;

/* ---------------- Sound Engine ---------------- */
function useSound() {
  const ctxRef = useRef(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);

  const ensure = () => {
    if (!ctxRef.current) {
      try { ctxRef.current = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { ctxRef.current = null; }
    }
    if (ctxRef.current && ctxRef.current.state === "suspended") ctxRef.current.resume();
  };

  const tone = (freq, dur, type = "sine", vol = 0.07) => {
    if (mutedRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  };

  const sfx = {
    flip:   () => tone(660, 0.09, "triangle"),
    match:  () => { tone(880, 0.12, "sine"); setTimeout(() => tone(1320, 0.15, "sine"), 90); },
    miss:   () => tone(180, 0.18, "sawtooth", 0.05),
    peek:   () => { tone(520, 0.06, "sine"); setTimeout(() => tone(760, 0.08, "sine"), 50); },
    slide:  () => tone(540, 0.06, "square", 0.04),
    win:    () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => {
      tone(f, 0.22, "sine", 0.09); tone(f * 1.5, 0.22, "triangle", 0.04);
    }, i * 130)),
    combo:  (n) => { for (let i = 0; i < Math.min(n, 6); i++) setTimeout(() => tone(880 + i * 140, 0.08, "triangle", 0.06), i * 50); },
    unlock: () => {
      tone(700, 0.1, "sine");
      setTimeout(() => tone(900, 0.15, "sine"), 60);
      setTimeout(() => tone(1200, 0.2, "sine"), 130);
      setTimeout(() => tone(1500, 0.25, "sine"), 200);
    },
    // কুইজের জন্য নতুন সাউন্ড
    correct: () => { tone(880, 0.1, "sine"); setTimeout(() => tone(1100, 0.12, "sine"), 80); },
    wrong: () => tone(200, 0.25, "sawtooth", 0.05),
    quizWin: () => {
      [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => {
        tone(f, 0.2, "sine", 0.08);
        tone(f * 1.25, 0.2, "triangle", 0.04);
      }, i * 100));
    },
  };

  return {
    muted,
    setMuted: (v) => { mutedRef.current = v; setMuted(v); },
    sfx,
    prime: ensure,
  };
}

/* ---------------- Common Components ---------------- */
function StatPill({ label, value, icon, glow, accent }) {
  return (
    <div className={`flex flex-col items-center gap-1 bg-neutral-900/60 backdrop-blur-xl px-4 sm:px-6 py-3 rounded-2xl border shadow-lg transition-all min-w-[100px] sm:min-w-[110px] ${
      glow ? "border-amber-400/60 shadow-[0_0_25px_-5px_rgba(245,158,11,0.55)] scale-105" : "border-neutral-800/60"
    }`}>
      <span className="text-neutral-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
        {icon}
        <span>{label}</span>
      </span>
      <span className={`text-lg sm:text-xl font-extrabold tabular-nums leading-none ${accent || "text-amber-400"}`}>{value}</span>
    </div>
  );
}

function CodexToast({ relic }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 100);
    return () => clearTimeout(t);
  }, []);
  if (!relic) return null;
  return (
    <div className={`pointer-events-none fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
      visible ? "opacity-100 -translate-y-0" : "opacity-0 -translate-y-4"
    }`}>
      <div className="px-5 py-3 rounded-2xl bg-neutral-900/85 backdrop-blur-xl border border-amber-500/40 shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)] flex items-center gap-3">
        <div className="text-3xl drop-shadow-lg">{relic.emoji}</div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">Codex entry unlocked</span>
          <span className="text-neutral-200 font-bold">{relic.name}</span>
        </div>
        <BookOpen className="text-amber-400 ml-1" size={18} />
      </div>
    </div>
  );
}

function MotivationPopup({ onClose, title, messages }) {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const imgSrc = `https://source.unsplash.com/featured/800x600/?motivation,inspire,success&${Date.now()}`;
    setImageUrl(imgSrc);
    setLoading(false);
  }, []);

  const msg = messages || ["🏆 You unlocked the archives!", "Wear a smile and have friends.", "Slow down and enjoy life."];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.5s_ease-out]">
      <div className="relative max-w-lg w-full bg-neutral-900/95 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-amber-400">Loading inspiration...</div>
        ) : (
          <>
            <img
              src={imageUrl}
              alt="Motivation"
              className="w-full h-56 object-cover"
              onError={(e) => e.target.src = "https://i.pinimg.com/736x/f0/50/43/f050435a6ac67841d185444d8d0f81d0.jpg"}
            />
            <div className="p-8 text-center">
              <div className="mb-4 font-['Caveat',cursive] text-3xl text-amber-200 tracking-wide">
                ✨ {title || "Congratulations!"}
              </div>
              <div className="space-y-2 text-center font-['Caveat',cursive] text-xl text-neutral-300 leading-relaxed">
                {msg.map((m, i) => <p key={i} className={i === 0 ? "text-amber-300 text-2xl" : "text-amber-200/80"}>{m}</p>)}
              </div>
              <p className="mt-4 text-sm text-neutral-400 italic border-t border-amber-500/20 pt-4">
                {[
                  "“The secret of getting ahead is getting started.”",
                  "“Success is not final, failure is not fatal: it is the courage to continue that counts.”",
                  "“Believe you can and you're halfway there.”",
                  "“The only impossible journey is the one you never begin.”",
                ][Math.floor(Math.random() * 4)]}
              </p>
              <button
                onClick={onClose}
                className="mt-6 inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 transition-all shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]"
              >
                <RotateCcw size={18} /> Play Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmberField() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      c.width = c.offsetWidth * dpr;
      c.height = c.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    const embers = Array.from({ length: 38 }, () => ({
      x: Math.random() * c.offsetWidth,
      y: Math.random() * c.offsetHeight,
      r: Math.random() * 1.8 + 0.4,
      vy: -(Math.random() * 0.45 + 0.18),
      vx: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.55 + 0.25,
      ph: Math.random() * Math.PI * 2,
    }));
    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, c.offsetWidth, c.offsetHeight);
      embers.forEach(e => {
        e.y += e.vy;
        e.x += e.vx + Math.sin((e.y + e.ph) * 0.02) * 0.22;
        if (e.y < -10) { e.y = c.offsetHeight + 10; e.x = Math.random() * c.offsetWidth; }
        const flicker = e.a * (0.65 + 0.35 * Math.sin(Date.now() / 420 + e.ph));
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${flicker})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(251, 191, 36, 0.4)";
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" />;
}

/* =========================================================
   QUIZ CHALLENGE (General Knowledge – Continents & Artifacts)
   ========================================================= */
const QUIZ_QUESTIONS = [
  { q: "The Great Wall of China is located on which continent?", options: ["Asia", "Europe", "Africa", "South America"], correct: 0, hint: "It spans across northern China.", emoji: "🏯" },
  { q: "The Pyramids of Giza are located on which continent?", options: ["Africa", "Asia", "Europe", "South America"], correct: 0, hint: "They stand on the Giza Plateau near Cairo.", emoji: "🔺" },
  { q: "The Taj Mahal is located in which country?", options: ["India", "Pakistan", "Bangladesh", "Nepal"], correct: 0, hint: "It was built by Emperor Shah Jahan in Agra.", emoji: "🕌" },
  { q: "The Rosetta Stone is housed in which museum?", options: ["British Museum", "Louvre Museum", "Egyptian Museum", "Metropolitan Museum"], correct: 0, hint: "It resides in London since 1802.", emoji: "🪨" },
  { q: "The ancient city of Petra is located in which country?", options: ["Jordan", "Egypt", "Greece", "Turkey"], correct: 0, hint: "It's carved into red sandstone cliffs.", emoji: "🏛️" },
  { q: "The Terracotta Army was discovered in which country?", options: ["China", "Japan", "Korea", "India"], correct: 0, hint: "It guards the tomb of Emperor Qin Shi Huang.", emoji: "⚔️" },
  { q: "The Sphinx is located in which country?", options: ["Egypt", "Greece", "Italy", "Turkey"], correct: 0, hint: "It guards the Giza Plateau near the pyramids.", emoji: "🦁" },
  { q: "The Parthenon is located in which city?", options: ["Athens", "Rome", "Cairo", "Istanbul"], correct: 0, hint: "It sits atop the Acropolis in Greece.", emoji: "🏛️" },
  { q: "The Code of Hammurabi is displayed in which museum?", options: ["Louvre Museum", "British Museum", "Egyptian Museum", "Pergamon Museum"], correct: 0, hint: "It's a stele from ancient Babylon, now in Paris.", emoji: "📜" },
  { q: "Machu Picchu is located on which continent?", options: ["South America", "North America", "Asia", "Africa"], correct: 0, hint: "It's high in the Andes Mountains of Peru.", emoji: "🏔️" },
  { q: "The Dead Sea Scrolls are housed in which museum?", options: ["Israel Museum", "British Museum", "Louvre", "Metropolitan Museum"], correct: 0, hint: "They are displayed in the Shrine of the Book in Jerusalem.", emoji: "📜" },
  { q: "The Great Zimbabwe ruins are located on which continent?", options: ["Africa", "Asia", "Europe", "South America"], correct: 0, hint: "They are in southeastern Africa, near Masvingo.", emoji: "🏚️" },
  { q: "Angkor Wat is located in which country?", options: ["Cambodia", "Thailand", "Vietnam", "Laos"], correct: 0, hint: "It is the largest religious monument in the world.", emoji: "🛕" },
  { q: "The Benin Bronzes originated from which continent?", options: ["Africa", "Asia", "Europe", "South America"], correct: 0, hint: "They are from the Kingdom of Benin, now in Nigeria.", emoji: "🥉" },
  { q: "The Mona Lisa is displayed in which museum?", options: ["Louvre Museum", "British Museum", "Uffizi Gallery", "Prado Museum"], correct: 0, hint: "It's the world's most famous painting in Paris.", emoji: "🎨" },
  { q: "The Bust of Nefertiti is in which museum?", options: ["Neues Museum (Berlin)", "British Museum", "Louvre", "Egyptian Museum"], correct: 0, hint: "It was discovered in 1912 at Amarna.", emoji: "👑" },
  { q: "The mask of Tutankhamun is in which museum?", options: ["Egyptian Museum (Cairo)", "British Museum", "Louvre", "Metropolitan Museum"], correct: 0, hint: "It was found in the Valley of the Kings.", emoji: "🎭" },
  { q: "The Elgin Marbles are in which museum?", options: ["British Museum", "Louvre", "Acropolis Museum", "Metropolitan Museum"], correct: 0, hint: "They were removed from the Parthenon in Athens.", emoji: "🏛️" },
  { q: "The Statue of David is in which museum?", options: ["Galleria dell'Accademia (Florence)", "Uffizi", "Vatican", "Louvre"], correct: 0, hint: "Michelangelo's masterpiece is in Florence.", emoji: "🗿" },
  { q: "The Venus de Milo is housed in which museum?", options: ["Louvre Museum", "British Museum", "Metropolitan", "Uffizi"], correct: 0, hint: "This ancient Greek statue is in Paris.", emoji: "♀️" },
];

function QuizChallenge({ sound }) {
  const [questions, setQuestions] = useState(() => shuffleArray([...QUIZ_QUESTIONS]));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [best, setBest] = useState(() => {
    try { return JSON.parse(localStorage.getItem(quizBestKey()) || "null"); } catch { return null; }
  });
  const [showMotivation, setShowMotivation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const current = questions[index];
  const total = questions.length;
  const isLast = index === total - 1;

  const handleSelect = (idx) => {
    if (answered || gameOver) return;
    sound.prime();
    setSelected(idx);
    setAnswered(true);
    const correct = idx === current.correct;
    if (correct) {
      sound.sfx.correct();
      const add = 10 + Math.min(streak, 5) * 2; // বোনাস
      setScore(s => s + add);
      setStreak(s => s + 1);
      setMaxStreak(s => Math.max(s, streak + 1));
    } else {
      sound.sfx.wrong();
      setStreak(0);
    }
    setTimeout(() => {
      if (isLast) {
        setGameOver(true);
        const bonus = streak >= 5 ? 50 : streak >= 3 ? 25 : 0;
        const finalScore = score + (correct ? 10 + Math.min(streak, 5) * 2 : 0) + bonus;
        setScore(finalScore);
        setBest(prev => {
          const next = prev == null ? { score: finalScore, total: total, ts: Date.now() } : (finalScore > prev.score ? { score: finalScore, total: total, ts: Date.now() } : prev);
          try { localStorage.setItem(quizBestKey(), JSON.stringify(next)); } catch {}
          return next;
        });
        setTimeout(() => sound.sfx.quizWin(), 200);
        setTimeout(() => setShowMotivation(true), 800);
      } else {
        setIndex(i => i + 1);
        setSelected(null);
        setAnswered(false);
        setShowHint(false);
      }
    }, correct ? 600 : 1000);
  };

  const reset = () => {
    setQuestions(shuffleArray([...QUIZ_QUESTIONS]));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setAnswered(false);
    setGameOver(false);
    setShowHint(false);
    setShowMotivation(false);
    setStreak(0);
    setMaxStreak(0);
  };

  if (gameOver) {
    const pct = Math.round((score / (total * 10)) * 100);
    const stars = pct >= 80 ? 3 : pct >= 50 ? 2 : pct >= 30 ? 1 : 0;
    return (
      <div className="w-full flex flex-col items-center">
        {showMotivation && <MotivationPopup onClose={() => setShowMotivation(false)} title="🏛️ Archæum Scholar!" messages={[`🎯 You scored ${score} / ${total*10} points!`, `⭐ ${stars} stars — knowledge unearthed!`, "The archives honor your wisdom."]} />}
        <div className="text-center max-w-md mx-auto bg-neutral-900/60 backdrop-blur-md p-8 rounded-3xl border border-amber-500/30 shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]">
          <div className="text-5xl mb-4">🏛️</div>
          <h3 className="text-2xl font-bold text-amber-300 mb-2">Quiz Complete!</h3>
          <p className="text-neutral-400 text-sm mb-2">You unearthed <span className="text-amber-400 font-bold">{score}</span> points from <span className="text-amber-400 font-bold">{total}</span> questions.</p>
          <div className="flex justify-center gap-2 mb-4">
            {[1,2,3].map(s => <Star key={s} className={s <= stars ? "text-amber-400 fill-amber-400" : "text-neutral-700"} size={28} />)}
          </div>
          <p className="text-xs text-neutral-500">Best: {best ? `${best.score} pts` : "—"} • Streak: {maxStreak}</p>
          <button onClick={reset} className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest bg-amber-500 text-neutral-950 rounded-xl hover:bg-amber-400 transition-all shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]">
            <RotateCcw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-wrap justify-center items-center gap-3 mb-6 w-full">
        <StatPill label="Score" value={score} icon={<Trophy size={14} />} glow={score > 0} />
        <StatPill label="Question" value={`${index+1}/${total}`} icon={<Compass size={14} />} />
        <StatPill label="Streak" value={streak > 1 ? `🔥${streak}` : "—"} glow={streak > 1} accent="text-amber-300" />
        <StatPill label="Best" value={best ? best.score : "—"} icon={<Award size={14} />} />
      </div>

      <div className="w-full max-w-2xl bg-neutral-900/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-neutral-800/60 shadow-xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl sm:text-5xl drop-shadow-lg">{current.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-widest mb-1">
              <Globe size={12} /> <span>Artifact Knowledge</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-neutral-100 leading-snug">{current.q}</p>
          </div>
        </div>

        <div className="space-y-3">
          {current.options.map((opt, idx) => {
            let cls = "w-full text-left px-5 py-3.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 border ";
            if (!answered) {
              cls += "bg-neutral-800/40 border-neutral-700/50 text-neutral-200 hover:bg-amber-500/20 hover:border-amber-500/40 hover:scale-[1.02]";
            } else if (idx === current.correct) {
              cls += "bg-emerald-500/20 border-emerald-400/60 text-emerald-200 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]";
            } else if (selected === idx && idx !== current.correct) {
              cls += "bg-red-500/20 border-red-400/60 text-red-200 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]";
            } else {
              cls += "bg-neutral-800/20 border-neutral-700/30 text-neutral-500";
            }
            return (
              <button key={idx} onClick={() => handleSelect(idx)} disabled={answered} className={cls}>
                <span className="flex items-center gap-3">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    answered && idx === current.correct ? "bg-emerald-500/30 text-emerald-200" :
                    answered && selected === idx && idx !== current.correct ? "bg-red-500/30 text-red-200" :
                    "bg-neutral-700/30 text-neutral-500"
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800/60">
          <button onClick={() => { setShowHint(s => !s); sound.prime(); }} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-amber-400 transition-all">
            <HelpCircle size={14} /> {showHint ? "Hide" : "Show"} Hint
          </button>
          {showHint && <span className="text-xs text-neutral-400 italic">💡 {current.hint}</span>}
          <span className="text-[10px] text-neutral-600 uppercase tracking-widest">
            {streak > 1 ? `🔥 ${streak} streak` : "keep going"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Memory Match ---------------- */
function MemoryMatch({ difficulty, sound }) {
  const cfg = DIFFICULTY[difficulty];
  const pairCount = cfg.pairs;
  const relicsPool = useMemo(() => RELICS.slice(0, pairCount), [pairCount]);

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [combo, setCombo] = useState(0);
  const [peakCombo, setPeakCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try { return JSON.parse(localStorage.getItem(bestKey("memory", difficulty)) || "null"); }
    catch { return null; }
  });
  const [unlocked, setUnlocked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(codexKey("memory")) || "[]"); } catch { return []; }
  });
  const [toast, setToast] = useState(null);
  const [peeked, setPeeked] = useState(false);
  const [peekActive, setPeekActive] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(2);
  const [showMotivation, setShowMotivation] = useState(false);

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    if (!running || gameOver) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, gameOver]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    setIsLocked(true);
    const [i, j] = flipped;
    const a = cards[i], b = cards[j];
    if (a?.id === b?.id) {
      setMatched(prev => [...prev, a.id]);
      setCombo(c => {
        const nx = c + 1;
        setPeakCombo(p => Math.max(p, nx));
        if (nx >= 2) sound.sfx.combo(nx);
        return nx;
      });
      setScore(s => s + 100 + Math.max(0, combo * 25) - Math.max(0, seconds * 2));
      sound.sfx.match();
      const isNew = !unlocked.includes(a.id);
      if (isNew) {
        const relic = RELICS.find(r => r.id === a.id);
        setUnlocked(prev => {
          const next = [...prev, a.id];
          try { localStorage.setItem(codexKey("memory"), JSON.stringify(next)); } catch {}
          return next;
        });
        setToast({ ...relic, ts: Date.now() });
        sound.sfx.unlock();
        setTimeout(() => setToast(null), 2400);
      }
      setTimeout(() => {
        setFlipped([]); setIsLocked(false);
      }, isNew ? 700 : 350);
    } else {
      sound.sfx.miss();
      setCombo(0);
      setTimeout(() => { setFlipped([]); setIsLocked(false); }, 900);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length === pairCount && cards.length > 0 && !gameOver) {
      setRunning(false); 
      setGameOver(true);
      const finalScore = computeFinalScore({ moves, seconds, peakCombo, matches: pairCount, difficulty });
      setScore(finalScore);
      setBest(prev => {
        const next = prev == null
          ? { score: finalScore, moves, time: seconds, tier: starTier(finalScore, pairCount), ts: Date.now() }
          : (finalScore > prev.score
              ? { score: finalScore, moves, time: seconds, tier: starTier(finalScore, pairCount), ts: Date.now() }
              : prev);
        try { localStorage.setItem(bestKey("memory", difficulty), JSON.stringify(next)); } catch {}
        return next;
      });
      setTimeout(() => sound.sfx.win(), 200);
      setTimeout(() => setShowMotivation(true), 800);
    }
  }, [matched, gameOver, cards.length]);

  const computeFinalScore = ({ moves, seconds, peakCombo, matches, difficulty }) => {
    const expected = matches * 2;
    const base = 1000;
    const moveBonus = Math.max(0, (expected * 2 - moves) * 25);
    const timeBonus = Math.max(0, (90 - seconds) * 5);
    const comboBonus = peakCombo >= 2 ? (peakCombo - 1) * 80 : 0;
    const diffMul = DIFFICULTY[difficulty].tier;
    return Math.max(0, Math.round((base + moveBonus + timeBonus + comboBonus) * diffMul));
  };

  const starTier = (sc, m) => {
    if (sc >= 5000) return 3;
    if (sc >= 2800) return 2;
    if (sc >= 1000) return 1;
    return 0;
  };

  const handleCardClick = (index) => {
    sound.prime();
    if (isLocked || gameOver || peekActive) return;
    if (flipped.includes(index)) return;
    if (matched.includes(cards[index].id)) return;
    if (!running) setRunning(true);
    sound.sfx.flip();
    setFlipped(prev => [...prev, index]);
  };

  const handlePeek = () => {
    if (peekActive || peeked || hintsLeft <= 0 || gameOver) return;
    sound.prime();
    sound.sfx.peek();
    setPeeked(true); setHintsLeft(h => h - 1); setPeekActive(true);
    setTimeout(() => setPeekActive(false), 1100);
  };

  const resetGame = () => {
    const doubled = relicsPool.flatMap(r => [
      { ...r, uniqueId: `${r.id}-a` },
      { ...r, uniqueId: `${r.id}-b` },
    ]);
    setCards(shuffleArray(doubled));
    setFlipped([]); setMatched([]); setMoves(0);
    setIsLocked(false); setGameOver(false);
    setSeconds(0); setRunning(false);
    setCombo(0); setPeakCombo(0); setScore(0);
    setPeeked(false); setPeekActive(false); setHintsLeft(2);
    setShowMotivation(false);
    setTimeout(() => setPeekActive(true), 250);
    setTimeout(() => setPeekActive(false), 1850);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {toast && <CodexToast relic={toast} />}
      {showMotivation && <MotivationPopup onClose={() => setShowMotivation(false)} title="🏺 Relic Collector!" messages={[`🎯 Score: ${score}`, `⭐ ${starTier(score, pairCount)} stars — archives restored!`, "The vault remembers your name."]} />}

      <div className="flex flex-wrap justify-center items-center gap-3 mb-6 w-full">
        <StatPill label="Moves" value={moves} />
        <StatPill label="Time" value={formatTime(seconds)} icon={<Timer size={14} />} />
        <StatPill label="Combo" value={combo > 1 ? `x${combo}` : "—"} glow={combo > 1} accent="text-amber-300" />
        <StatPill label="Score" value={score} icon={<Zap size={14} />} glow={score > 0} />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handlePeek}
          disabled={peekActive || peeked || hintsLeft <= 0 || gameOver}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
            peekActive || peeked || hintsLeft <= 0 || gameOver
              ? "bg-neutral-900/30 text-neutral-700 border-neutral-800/40 cursor-not-allowed"
              : "bg-neutral-900/60 text-amber-400 border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-400/60"
          }`}
        >
          <Eye size={14} /> Peek ({hintsLeft})
        </button>
        <span className="text-[10px] uppercase tracking-widest text-neutral-600 font-bold">
          {cfg.label} • {pairCount} pairs
        </span>
      </div>

      <div
        className="grid gap-3 sm:gap-4 place-items-center"
        style={{ gridTemplateColumns: `repeat(${cfg.cols}, minmax(0, 1fr))` }}
      >
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || peekActive;
          const isMatched = matched.includes(card.id);
          const showFront = isFlipped || isMatched;

          return (
            <div
              key={card.uniqueId}
              onClick={() => handleCardClick(index)}
              className={`relative w-16 h-16 sm:w-22 sm:h-22 md:w-24 md:h-24 cursor-pointer transition-all duration-500 [transform-style:preserve-3d] ${
                isMatched ? "opacity-40 scale-90" : "hover:scale-105 hover:-translate-y-1"
              } ${showFront ? "[transform:rotateY(180deg)]" : ""}`}
            >
              <div className="absolute inset-0 rounded-2xl bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 shadow-xl flex items-center justify-center transition-colors hover:border-amber-500/40 hover:bg-neutral-800/80 [backface-visibility:hidden]">
                <div className="w-10 h-10 rounded-full border border-neutral-700/50 flex items-center justify-center bg-neutral-950/30">
                  <span className="text-amber-500/40 font-serif text-xl">Æ</span>
                </div>
              </div>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/20 to-neutral-900/90 backdrop-blur-md border shadow-[0_0_25px_-5px_rgba(245,158,11,0.25)] flex items-center justify-center text-2xl sm:text-3xl md:text-4xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                isMatched ? "border-amber-300/60" : "border-amber-500/40"
              }`}>
                <span className="drop-shadow-2xl">{card.emoji}</span>
              </div>
            </div>
          );
        })}
      </div>

      {!gameOver && cards.length > 0 && (
        <button
          onClick={resetGame}
          className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-900/50 border border-neutral-800/60 rounded-xl hover:text-amber-400 hover:border-amber-500/30 hover:bg-neutral-900/80 transition-all duration-300"
        >
          <RotateCcw size={14} /> Restart
        </button>
      )}
    </div>
  );
}

/* ---------------- Slide Puzzle ---------------- */
function SlidePuzzle({ difficulty, sound }) {
  const SIZE = 3 + DIFFICULTY[difficulty].tier - 1; // 3,4,5
  const TOTAL = SIZE * SIZE;
  const BLANK = null;
  const TYPE_A = "🏛️";
  const TYPE_B = "🔱";

  const checkWin = (arr) => {
    const lines = [];
    for (let i = 0; i < SIZE; i++) {
      lines.push([...Array(SIZE)].map((_, j) => i * SIZE + j));
      lines.push([...Array(SIZE)].map((_, j) => j * SIZE + i));
    }
    lines.push([...Array(SIZE)].map((_, i) => i * SIZE + i));
    lines.push([...Array(SIZE)].map((_, i) => i * SIZE + (SIZE - 1 - i)));
    return lines.some(([a, ...rest]) => {
      const head = arr[a];
      if (head === BLANK) return false;
      return rest.every(b => arr[b] === head);
    });
  };

  const makeShuffled = () => {
    const half = Math.floor(TOTAL / 2);
    let arr;
    let tries = 0;
    do {
      const base = [
        ...Array(half).fill(TYPE_A),
        ...Array(TOTAL - half - 1).fill(TYPE_B),
        BLANK,
      ];
      arr = shuffleArray(base);
      tries++;
    } while (checkWin(arr) && tries < 50);
    return arr;
  };

  const [tiles, setTiles] = useState(makeShuffled);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [best, setBest] = useState(() => {
    try { return JSON.parse(localStorage.getItem(bestKey("slide", difficulty)) || "null"); }
    catch { return null; }
  });
  const [showMotivation, setShowMotivation] = useState(false);

  useEffect(() => { reset(); }, [difficulty]);

  useEffect(() => {
    if (!running || solved) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, solved]);

  useEffect(() => {
    if (checkWin(tiles)) {
      setSolved(true); setRunning(false);
      const finalScore = Math.max(0, Math.round((5000 + Math.max(0, 120 - seconds) * 25 + Math.max(0, 80 - moves) * 30) / DIFFICULTY[difficulty].tier));
      setBest(prev => {
        const next = prev == null
          ? { score: finalScore, moves, time: seconds, ts: Date.now() }
          : (finalScore > prev.score ? { score: finalScore, moves, time: seconds, ts: Date.now() } : prev);
        try { localStorage.setItem(bestKey("slide", difficulty), JSON.stringify(next)); } catch {}
        return next;
      });
      setTimeout(() => sound.sfx.win(), 200);
      setTimeout(() => setShowMotivation(true), 800);
    }
  }, [tiles]);

  const move = (index) => {
    if (solved) return;
    sound.prime();
    const blankIndex = tiles.indexOf(BLANK);
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const br = Math.floor(blankIndex / SIZE);
    const bc = blankIndex % SIZE;
    const adjacent =
      (row === br && Math.abs(col - bc) === 1) ||
      (col === bc && Math.abs(row - br) === 1);
    if (!adjacent) return;
    if (!running) setRunning(true);
    sound.sfx.slide();
    const next = [...tiles];
    [next[index], next[blankIndex]] = [next[blankIndex], next[index]];
    setTiles(next);
    setMoves(m => m + 1);
  };

  const reset = () => {
    setTiles(makeShuffled());
    setMoves(0); setSeconds(0); setRunning(false); setSolved(false);
    setShowHelp(false);
    setShowMotivation(false);
  };

  const validMoves = useMemo(() => {
    const bi = tiles.indexOf(BLANK);
    const r = Math.floor(bi / SIZE), c = bi % SIZE;
    const adj = new Set();
    if (r > 0)    adj.add(bi - SIZE);
    if (r < SIZE - 1) adj.add(bi + SIZE);
    if (c > 0)    adj.add(bi - 1);
    if (c < SIZE - 1) adj.add(bi + 1);
    return adj;
  }, [tiles, SIZE]);

  return (
    <div className="w-full flex flex-col items-center">
      {showMotivation && <MotivationPopup onClose={() => setShowMotivation(false)} title="🔱 Slab Restored!" messages={[`🎯 Score: ${best?.score || 0}`, `⚡ ${moves} moves • ${formatTime(seconds)}`, "The vault is whole again."]} />}

      <p className="text-neutral-500 text-xs mb-6 text-center max-w-xs">
        Slide the relics — line up <span className="text-amber-400 font-bold">{SIZE}</span> matching emojis in any row, column, or diagonal to restore the slab.
      </p>

      <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
        <StatPill label="Moves" value={moves} />
        <StatPill label="Time" value={formatTime(seconds)} icon={<Timer size={14} />} />
        <StatPill label="Best" value={best ? best.score : "—"} icon={<Award size={14} />} />
      </div>

      <div className={`grid bg-neutral-900/60 p-3 sm:p-4 rounded-2xl border shadow-xl transition-all ${
        solved ? "border-amber-400/70 shadow-[0_0_40px_-5px_rgba(245,158,11,0.5)]" : "border-neutral-800/60"
      }`} style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`, gap: SIZE >= 5 ? "0.4rem" : "0.5rem" }}>
        {tiles.map((val, index) => {
          const isBlank = val === BLANK;
          const isValid = validMoves.has(index) && !isBlank;
          return (
            <div
              key={index}
              onClick={() => move(index)}
              className={`rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
                SIZE >= 5 ? "w-14 h-14 sm:w-16 sm:h-16 text-2xl" : "w-20 h-20 sm:w-24 sm:h-24 text-3xl sm:text-4xl"
              } ${
                isBlank
                  ? "bg-transparent border border-dashed border-neutral-800/30"
                  : isValid
                    ? "bg-gradient-to-br from-amber-500/30 to-neutral-900/90 border border-amber-400/70 hover:scale-[1.05] shadow-[0_0_18px_-5px_rgba(245,158,11,0.45)]"
                    : "bg-gradient-to-br from-amber-500/15 to-neutral-900/90 border border-amber-500/30 hover:scale-[1.04] hover:border-amber-400/60 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)]"
              } ${showHelp && isValid ? "animate-pulse" : ""}`}
            >
              {!isBlank && <span className="drop-shadow-2xl">{val}</span>}
              {showHelp && isBlank && <span className="text-neutral-700 text-xs">·</span>}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => { sound.prime(); setShowHelp(s => !s); }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
            showHelp
              ? "bg-amber-500/20 text-amber-300 border-amber-400/60"
              : "bg-neutral-900/60 text-neutral-400 border-neutral-800/60 hover:text-amber-400 hover:border-amber-500/30"
          }`}
        >
          {showHelp ? <EyeOff size={14} /> : <Eye size={14} />}
          {showHelp ? "Hide Hints" : "Show Hints"}
        </button>
      </div>

      {!solved && (
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-900/50 border border-neutral-800/60 rounded-xl hover:text-amber-400 hover:border-amber-500/30 hover:bg-neutral-900/80 transition-all duration-300"
        >
          <RotateCcw size={14} /> Shuffle
        </button>
      )}
    </div>
  );
}

/* ---------------- Root ---------------- */
export default function ArchaeumGames() {
  const [mode, setMode] = useState("quiz"); // ডিফল্ট Q&A
  const [difficulty, setDifficulty] = useState("medium");
  const sound = useSound();

  useEffect(() => {
    sound.prime();
  }, [mode, sound]);

  const modes = [
    { id: "quiz", label: "Q&A", icon: <Compass size={16} /> },
    { id: "memory", label: "Memory", icon: <Grid3x3 size={16} /> },
    { id: "slide", label: "Slide", icon: <Puzzle size={16} /> },
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 font-sans bg-neutral-950 text-neutral-100 overflow-hidden">
      <EmberField />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.08),transparent_60%)]" />

      <div className="relative w-full max-w-3xl flex flex-col items-center">
        <div className="flex flex-col items-center gap-3 text-center mb-6">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]">
            <Sparkles className="text-amber-400" size={24} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-snug bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-tight">
            Archæum Vault Games
          </h2>
          <p className="text-neutral-500 text-sm max-w-md">
            Unlock the archives — match relics, solve puzzles, or test your knowledge.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => sound.setMuted(!sound.muted)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-900/60 border border-neutral-800/60 text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 transition-all"
            aria-label={sound.muted ? "Unmute" : "Mute"}
          >
            {sound.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          {/* Difficulty buttons শুধু মেমরি ও স্লাইডের জন্য */}
          {mode !== "quiz" && (
            <div className="flex gap-1 bg-neutral-900/60 p-1 rounded-xl border border-neutral-800/60">
              {Object.entries({ easy: 1, medium: 2, hard: 3 }).map(([key, tier]) => (
                <button
                  key={key}
                  onClick={() => { sound.prime(); setDifficulty(key); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                    difficulty === key
                      ? "bg-amber-500/90 text-neutral-950 shadow-[0_0_15px_-3px_rgba(245,158,11,0.5)]"
                      : "text-neutral-400 hover:text-amber-400"
                  }`}
                >
                  {tier === 3 ? <Crown size={12} /> : tier === 2 ? <Flame size={12} /> : <Zap size={12} />}
                  {key}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-8 bg-neutral-900/60 p-1.5 rounded-2xl border border-neutral-800/60">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => { sound.prime(); setMode(m.id); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === m.id
                  ? "bg-amber-500 text-neutral-950 shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)]"
                  : "text-neutral-400 hover:text-amber-400"
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        <div className="w-full">
          {mode === "memory" && <MemoryMatch key={`memory-${difficulty}`} difficulty={difficulty} sound={sound} />}
          {mode === "slide" && <SlidePuzzle key={`slide-${difficulty}`} difficulty={difficulty} sound={sound} />}
          {mode === "quiz" && <QuizChallenge sound={sound} />}
        </div>

        <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-neutral-700 font-bold">
          "Those who remember, restore."
        </p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}