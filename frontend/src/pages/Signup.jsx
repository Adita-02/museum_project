// src/pages/Signup.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";

/* ════════════════════════════════════════════════════════════════════
   FLOATING GOLD PARTICLES  ·  animation canvas overlay
   ════════════════════════════════════════════════════════════════════ */
function FloatingParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;
    const particles = [];
    const count = 90;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.4,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.55 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        hue: Math.random() > 0.85 ? "warm" : "gold",
      });
    }

    let frameId;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const col =
          p.hue === "warm"
            ? `rgba(232, 198, 120, ${alpha})`
            : `rgba(201, 168, 76, ${alpha})`;
        ctx.fillStyle = col;
        ctx.fill();
      });
      frameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   MUSEUM CREST  ·  animated SVG emblem with Æ monolith
   ════════════════════════════════════════════════════════════════════ */
function MuseumCrest() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-12 w-12 text-[var(--gold)] drop-shadow-[0_0_18px_rgba(201,168,76,.35)]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="crest-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8c678" />
          <stop offset="50%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#8a6a1f" />
        </linearGradient>
      </defs>

      {/* Outer ring */}
      <circle
        cx="60"
        cy="60"
        r="56"
        stroke="url(#crest-grad)"
        strokeWidth="0.6"
        opacity="0.7"
      />
      <circle
        cx="60"
        cy="60"
        r="50"
        stroke="url(#crest-grad)"
        strokeWidth="0.4"
        opacity="0.4"
        strokeDasharray="2 4"
      />

      {/* Top star */}
      <g opacity="0.85">
        <path
          d="M60 18 L62 24 L68 24 L63 28 L65 34 L60 30 L55 34 L57 28 L52 24 L58 24 Z"
          fill="url(#crest-grad)"
          stroke="none"
        />
      </g>

      {/* Inner hex frame */}
      <path
        d="M60 32 L84 46 L84 74 L60 88 L36 74 L36 46 Z"
        stroke="url(#crest-grad)"
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* Æ monolith */}
      <text
        x="60"
        y="70"
        textAnchor="middle"
        fontSize="36"
        fontFamily="Cinzel, serif"
        fontWeight="600"
        fill="url(#crest-grad)"
        stroke="none"
      >
        Æ
      </text>

      {/* Bottom flourish */}
      <path
        d="M44 96 Q60 100 76 96"
        stroke="url(#crest-grad)"
        strokeWidth="0.6"
        opacity="0.6"
      />
      <circle cx="60" cy="98" r="0.8" fill="url(#crest-grad)" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ORNAMENTAL DIVIDER
   ════════════════════════════════════════════════════════════════════ */
function OrnamentalDivider({ width = "w-32" }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${width}`}>
      <svg viewBox="0 0 40 8" className="h-2 flex-1" preserveAspectRatio="none">
        <path
          d="M0 4 L6 4 L6 1 L10 1 L10 7 L14 7 L14 1 L18 1 L18 4 L24 4"
          stroke="rgba(201,168,76,0.45)"
          strokeWidth="0.7"
          fill="none"
        />
        <path
          d="M16 4 L40 4"
          stroke="rgba(201,168,76,0.3)"
          strokeWidth="0.5"
        />
      </svg>
      <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 shrink-0">
        <rect
          x="3"
          y="3"
          width="8"
          height="8"
          transform="rotate(45 7 7)"
          stroke="rgba(232,198,120,0.7)"
          strokeWidth="0.7"
          fill="rgba(232,198,120,0.05)"
        />
        <circle cx="7" cy="7" r="1.4" fill="rgba(232,198,120,0.85)" />
      </svg>
      <svg
        viewBox="0 0 40 8"
        className="h-2 flex-1"
        preserveAspectRatio="none"
        style={{ transform: "scaleX(-1)" }}
      >
        <path
          d="M0 4 L6 4 L6 1 L10 1 L10 7 L14 7 L14 1 L18 1 L18 4 L24 4"
          stroke="rgba(201,168,76,0.45)"
          strokeWidth="0.7"
          fill="none"
        />
        <path
          d="M16 4 L40 4"
          stroke="rgba(201,168,76,0.3)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CORNER ORNAMENT
   ════════════════════════════════════════════════════════════════════ */
function CornerOrnament({ position }) {
  const map = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  };
  return (
    <svg
      viewBox="0 0 60 60"
      className={`absolute ${map[position]} h-14 w-14 opacity-70 pointer-events-none`}
    >
      <defs>
        <linearGradient id={`corner-${position}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8c678" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d="M4 26 L4 4 L26 4"
        stroke={`url(#corner-${position})`}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M4 36 L4 50 M14 4 L36 4"
        stroke={`url(#corner-${position})`}
        strokeWidth="0.4"
        fill="none"
        opacity="0.6"
      />
      <rect
        x="11"
        y="11"
        width="6"
        height="6"
        transform="rotate(45 14 14)"
        stroke={`url(#corner-${position})`}
        strokeWidth="0.7"
        fill="none"
      />
      <circle cx="14" cy="14" r="1.2" fill="#e8c678" opacity="0.8" />
      <circle cx="36" cy="4" r="1.2" fill="#e8c678" opacity="0.4" />
      <circle cx="4" cy="36" r="1.2" fill="#e8c678" opacity="0.4" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ICONS
   ════════════════════════════════════════════════════════════════════ */
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 8 L12 13 L21 8" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11 V7 a4 4 0 0 1 8 0 V11" />
    <circle cx="12" cy="16" r="1.4" fill="currentColor" />
    <path d="M12 17 V19" />
  </svg>
);

/* ════════════════════════════════════════════════════════════════════
   GLOW INPUT
   ════════════════════════════════════════════════════════════════════ */
function GlowInput({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  autoComplete = "off",
  icon: Icon,
}) {
  const isFilled = value && value.length > 0;
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`
        relative rounded-xl border transition-all duration-500
        ${
          focused
            ? "border-[var(--gold)] shadow-[0_0_40px_rgba(201,168,76,.12),inset_0_0_20px_rgba(201,168,76,.04)]"
            : "border-[rgba(201,168,76,.08)] hover:border-[rgba(201,168,76,.25)]"
        }
        bg-[rgba(201,168,76,.02)]
        focus-within:border-[var(--gold)]
        focus-within:bg-[rgba(11,9,6,.55)]
        focus-within:shadow-[0_0_40px_rgba(201,168,76,.1)]
        overflow-hidden
      `}
    >
      <div
        className={`
          absolute inset-0 transition-opacity duration-500 pointer-events-none
          bg-gradient-to-r from-transparent via-[rgba(201,168,76,.06)] to-transparent
          ${focused ? "opacity-100" : "opacity-0"}
        `}
      />

      <div className="relative flex items-center gap-3 px-5 py-4">
        <div
          className={`
            shrink-0 transition-all duration-500
            ${
              focused
                ? "text-[var(--gold-light)] scale-110"
                : isFilled
                ? "text-[var(--gold)]"
                : "text-[rgba(212,196,160,.25)]"
            }
          `}
        >
          <Icon />
        </div>

        <div
          className={`
            shrink-0 flex h-4 w-4 items-center justify-center rounded-full border
            transition-all duration-300
            ${
              isFilled
                ? "border-[var(--gold)] bg-[var(--gold)] shadow-[0_0_14px_rgba(201,168,76,.45)]"
                : "border-[rgba(201,168,76,.2)] bg-transparent"
            }
          `}
        >
          {isFilled && (
            <svg
              className="h-2.5 w-2.5 text-[#0a0805]"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          )}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="
            w-full bg-transparent
            text-[14px] font-['Cinzel',serif] tracking-[0.4px]
            text-[var(--sand)]
            placeholder:text-[rgba(212,196,160,.18)]
            placeholder:font-sans placeholder:tracking-normal
            focus:outline-none
          "
        />
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full overflow-hidden">
        <div
          className={`
            h-full bg-gradient-to-r from-transparent via-[var(--gold-light)] to-transparent
            transition-transform duration-[1500ms] ease-out
            ${focused ? "translate-x-0" : "-translate-x-full"}
          `}
          style={{ width: "60%", margin: "0 auto" }}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DECORATIVE RING
   ════════════════════════════════════════════════════════════════════ */
function DecorativeRing({ className = "", delay = 0 }) {
  return (
    <div
      className={`absolute rounded-full border border-[rgba(201,168,76,.04)] animate-[spin_20s_linear_infinite] ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   SOCIAL BUTTON
   ════════════════════════════════════════════════════════════════════ */
function SocialButton({ provider }) {
  const icons = {
    Google: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.478 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
      </svg>
    ),
    Github: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.225-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    Apple: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M17.05 12.04c-.03-2.86 2.34-4.23 2.45-4.3-1.34-1.95-3.42-2.22-4.16-2.25-1.77-.18-3.45 1.04-4.35 1.04-.9 0-2.28-1.02-3.75-.99-1.93.03-3.71 1.12-4.7 2.85-2 3.46-.51 8.58 1.44 11.39.96 1.38 2.1 2.92 3.58 2.87 1.44-.06 1.98-.92 3.72-.92 1.74 0 2.22.92 3.75.89 1.55-.03 2.53-1.4 3.48-2.78 1.1-1.6 1.55-3.15 1.58-3.23-.03-.01-3.02-1.16-3.05-4.57zM14.4 3.88c.79-.96 1.32-2.29 1.17-3.62-1.13.05-2.5.75-3.31 1.71-.73.84-1.36 2.18-1.19 3.49 1.26.1 2.55-.64 3.33-1.58z" />
      </svg>
    ),
  };
  return (
    <button
      type="button"
      className="
        group relative flex h-12 w-12
        items-center justify-center
        rounded-full
        border border-[rgba(201,168,76,.10)]
        bg-gradient-to-br from-[rgba(201,168,76,.03)] to-transparent
        text-[rgba(212,196,160,.4)]
        transition-all duration-300
        hover:border-[rgba(201,168,76,.35)]
        hover:from-[rgba(201,168,76,.1)]
        hover:text-[var(--gold-light)]
        hover:shadow-[0_0_30px_rgba(201,168,76,.18)]
        hover:-translate-y-0.5
      "
      title={`Continue with ${provider}`}
    >
      <span className="absolute inset-0 rounded-full bg-[rgba(201,168,76,.08)] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
      <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">
        {icons[provider]}
      </span>
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════ */
export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      console.log('📤 Signup attempt:', form.email);
      const res = await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      
      console.log('📥 Signup response:', res.data);
      setMsg(res.data.message || "Account created successfully!");
      
      // ✅ Signup成功后 Login page এ redirect করুন
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      console.error('❌ Signup error:', err.response?.data);
      setMsg(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ─────────  WebGL shader background  ───────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(() => {
      canvas.width = canvas.clientWidth || 1280;
      canvas.height = canvas.clientHeight || 720;
    });
    resizeObserver.observe(canvas);
    canvas.width = canvas.clientWidth || 1280;
    canvas.height = canvas.clientHeight || 720;
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    const vs = `attribute vec2 a_position;varying vec2 v_texCoord;void main(){v_texCoord=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;

    const fs = `precision highp float;varying vec2 v_texCoord;uniform float u_time;uniform vec2 u_resolution;
            vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
            vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
            vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
            float snoise(vec2 v){const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;m*=1.79284291400159-.85373472095314*(a0*a0+h*h);vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(m,g);}
            void main(){vec2 uv=v_texCoord;vec2 p=uv*2.-1.;p.x*=u_resolution.x/u_resolution.y;
                float t=u_time*.035;
                float n=snoise(p*1.8+t);
                n+=0.6*snoise(p*3.5-t*0.7);
                n+=0.3*snoise(p*7.0+t*1.2);
                n+=0.15*snoise(p*14.0-t*2.1);
                vec3 bg1=vec3(.015,.012,.008);
                vec3 bg2=vec3(.035,.025,.015);
                float grad=uv.y*.7+.3;
                vec3 bg=mix(bg1,bg2,grad);
                vec3 gold1=vec3(.78,.65,.3);
                vec3 gold2=vec3(.55,.42,.15);
                float waves=smoothstep(.35,.75,n)*0.25;
                float glow=exp(-abs(n)*3.0)*0.15;
                float sparkle=pow(max(0.,snoise(uv*60.+u_time*.3)),12.);
                float sparkle2=pow(max(0.,snoise(uv*100.-u_time*.4+10.)),16.);
                vec3 goldMix=mix(gold2,gold1,waves*2.0+0.3);
                vec3 col=bg+goldMix*waves+gold1*glow;
                col+=gold1*sparkle*0.8;
                col+=gold1*sparkle2*0.4;
                float vig=1.-smoothstep(.2,1.8,length(p));
                col*=vig;
                float vignette=1.-smoothstep(.6,1.4,length(p));
                col*=0.85+vignette*0.15;
                float haze=smoothstep(.8,1.2,length(p))*0.06;
                col+=bg1*haze;
                gl_FragColor=vec4(col,1.);
            }`;

    const mkShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    let frameId;
    const render = (t) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTime, t * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameId = requestAnimationFrame(render);
    };
    render(0);
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);

  /* ─────────  Render  ───────── */
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0805] flex items-center justify-center px-4 py-12 font-sans">
      {/* WebGL shader background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ display: "block" }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Slow rotating rings */}
      <DecorativeRing
        className="w-[800px] h-[800px] -top-[400px] -right-[200px] opacity-30"
        delay={0}
      />
      <DecorativeRing
        className="w-[600px] h-[600px] -bottom-[300px] -left-[200px] opacity-20"
        delay={5}
      />
      <DecorativeRing
        className="w-[400px] h-[400px] top-[10%] left-[5%] opacity-10"
        delay={10}
      />
      <DecorativeRing
        className="w-[300px] h-[300px] bottom-[20%] right-[8%] opacity-15"
        delay={3}
      />

      {/* Aurora glow behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
        <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(201,168,76,.18)_0%,_rgba(201,168,76,.04)_40%,_transparent_70%)] blur-3xl animate-[auraPulse_6s_ease-in-out_infinite]" />
      </div>

      {/* ROW 0 — above-card ornament */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 animate-[fadeIn_1s_ease-out_0.2s_both]">
        <div className="hidden md:flex items-center gap-3 opacity-60">
          <span className="font-['Cinzel',serif] text-[10px] tracking-[6px] text-[var(--gold-light)]/70">
            Æ ARCHÆUM
          </span>
          <span className="h-px w-12 bg-[var(--gold)]/30" />
          <span className="font-['Cinzel',serif] text-[10px] tracking-[4px] text-[rgba(212,196,160,.4)]">
            ARCHIVES ONLINE
          </span>
        </div>
      </div>

      {/* Main card */}
      <div
        className="
          relative z-10 w-full max-w-5xl
          animate-[fadeIn_0.9s_ease-out]
          transition-transform duration-700 hover:-translate-y-1
        "
        style={{ perspective: "1200px" }}
      >
        <div
          className="
            relative
            grid grid-cols-1 md:grid-cols-2
            overflow-hidden
            rounded-3xl
            border border-[rgba(201,168,76,.10)]
            bg-gradient-to-b
              from-[#1a140b]/95
              via-[#110e09]/95
              to-[#0a0805]/95
            shadow-[0_60px_120px_rgba(0,0,0,.95),inset_0_1px_0_rgba(201,168,76,.08),0_0_0_1px_rgba(201,168,76,.02)]
            backdrop-blur-2xl
            min-h-[720px]
          "
        >
          {/* Gold top shimmer line */}
          <div className="absolute top-0 left-0 h-[1px] w-full z-30 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-[var(--gold)]/60 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
          </div>
          {/* Gold bottom line */}
          <div className="absolute bottom-0 left-0 h-[1px] w-full z-30 bg-gradient-to-r from-transparent via-[var(--gold)]/15 to-transparent" />

          {/* Ornamental corner brackets */}
          <CornerOrnament position="top-left" />
          <CornerOrnament position="top-right" />
          <CornerOrnament position="bottom-left" />
          <CornerOrnament position="bottom-right" />

          {/* ─────────────── LEFT PANEL · MUSEUM VISUAL ─────────────── */}
          <div className="relative hidden md:flex flex-col justify-end p-10 overflow-hidden bg-[#0a0805] min-h-[400px]">
            <img
              src="museum-hero.jpeg"
              alt="ARCHÆUM museum"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[20s] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0805] via-[#0a0805]/70 to-[#0a0805]/10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0d0a06] to-transparent" />

            <div className="relative z-10">
              <div className="mb-2">
                <span className="font-['Cinzel',serif] text-[11px] tracking-[6px] text-[var(--gold-light)]/60 uppercase">
                  Æ Archæum
                </span>
              </div>
              <h2 className="font-['Cinzel',serif] text-[34px] leading-[1.1] text-[var(--sand)] font-medium">
                Join the Archæum,
                <br />
              </h2>
              <p className="mt-3 text-[14px] font-['Crimson_Pro',serif] italic text-[rgba(212,196,160,.55)] max-w-xs leading-relaxed">
                Begin your journey through history. Apply for your patron pass
                today.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-[2px] w-12 bg-gradient-to-r from-[var(--gold)]/40 to-transparent" />
                <span className="text-[10px] tracking-[3px] text-[rgba(212,196,160,.25)] uppercase font-['Cinzel',serif]">
                  Preserving History Forever
                </span>
              </div>
            </div>
          </div>

          {/* ─────────────── RIGHT PANEL · FORM ─────────────── */}
          <div className="relative px-6 sm:px-10 lg:px-12 py-10 sm:py-14 flex flex-col justify-center min-h-[500px]">
            {/* Centre warm glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[var(--gold)]/[0.05] rounded-full blur-[120px] pointer-events-none" />

            {/* Mobile-only brand */}
            <div className="flex items-center justify-center gap-3 mb-6 md:hidden">
              <MuseumCrest />
              <span className="font-['Cinzel',serif] text-lg font-bold tracking-[5px] text-[var(--gold-light)]">
                Æ ARCHÆUM
              </span>
            </div>

            {/* Header — crest + title + divider */}
            <div className="text-center mb-8 animate-[fadeIn_0.6s_ease-out_0.2s_both]">
              <div className="flex justify-center mb-4">
                <MuseumCrest />
              </div>

              <h1 className="font-['Cinzel',serif] text-[28px] tracking-[6px] text-[var(--gold-light)] leading-tight">
                Request Entry
              </h1>
              <p className="mt-1.5 font-['Cinzel',serif] text-[10px] tracking-[4px] text-[rgba(212,196,160,.4)] uppercase">
                Apply for your patron pass
              </p>

              <div className="mt-5 flex justify-center">
                <OrnamentalDivider width="w-48" />
              </div>
            </div>

            {/* Message */}
            {msg && (
              <div
                className={`
                  mb-6 rounded-xl border px-5 py-3.5 text-center text-xs tracking-wide font-sans
                  animate-[fadeIn_0.4s_ease-out] flex items-center justify-center gap-2.5
                  ${
                    msg.toLowerCase().includes("success") || msg.toLowerCase().includes("created")
                      ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300/95"
                      : "border-red-500/20 bg-red-500/[0.06] text-red-300/95"
                  }
                `}
              >
                {msg.toLowerCase().includes("success") || msg.toLowerCase().includes("created") ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8 v4 M12 16 h.01" />
                  </svg>
                )}
                {msg}
              </div>
            )}

            {/* ─── FORM ─── */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6 animate-[fadeIn_0.6s_ease-out_0.4s_both]"
            >
              {/* Name Input */}
              <GlowInput
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                icon={UserIcon}
              />

              {/* Email Input */}
              <GlowInput
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                icon={MailIcon}
              />

              {/* Password Input */}
              <GlowInput
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                icon={LockIcon}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  group/btn relative w-full
                  overflow-hidden rounded-xl
                  bg-gradient-to-r from-[#a07a2a] via-[#e8c678] via-[#d2aa4e] to-[#a07a2a]
                  py-4.5 px-6
                  text-[11px] font-bold uppercase tracking-[5px]
                  text-[#0a0805]
                  transition-all duration-500
                  hover:-translate-y-0.5
                  hover:shadow-[0_18px_50px_rgba(201,168,76,.35),inset_0_1px_0_rgba(255,255,255,.25)]
                  active:scale-[.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-3
                  ring-1 ring-inset ring-[rgba(255,255,255,.1)]
                  mt-2
                "
              >
                <div
                  className="
                    absolute inset-0 -translate-x-full
                    bg-gradient-to-r from-transparent via-white/40 to-transparent
                    transition-transform duration-[1.6s] ease-in-out
                    group-hover/btn:translate-x-full
                  "
                />
                <div
                  className="
                    absolute inset-0 opacity-0 group-hover/btn:opacity-100
                    bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,.18)_0%,_transparent_70%)]
                    transition-opacity duration-500
                  "
                />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                <span className="relative z-10 flex items-center gap-3">
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating Account…
                    </>
                  ) : (
                    <>
                      Request Entry
                      <span className="text-[#0a0805]/70 group-hover/btn:translate-x-1.5 transition-transform duration-300 inline-block">
                        →
                      </span>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* ─── DIVIDER ─── */}
            <div className="my-8 flex items-center gap-4 animate-[fadeIn_0.6s_ease-out_0.6s_both]">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(201,168,76,.15)]" />
              <span className="font-['Cinzel',serif] text-[9px] tracking-[3px] text-[rgba(212,196,160,.25)] uppercase whitespace-nowrap">
                · Or continue with ·
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(201,168,76,.15)]" />
            </div>

            {/* ─── SOCIAL LOGINS ─── */}
            <div
              className="flex items-center justify-center gap-5 animate-[fadeIn_0.6s_ease-out_0.8s_both]"
            >
              <SocialButton provider="Google" />
              <SocialButton provider="Github" />
              <SocialButton provider="Apple" />
            </div>

            {/* ─── FOOTER ─── */}
            <div className="mt-8 text-center animate-[fadeIn_0.6s_ease-out_1s_both]">
              <p className="font-['Crimson_Pro',serif] text-[13px] text-[rgba(212,196,160,.4)]">
                Already a patron?{" "}
                <Link
                  to="/login"
                  className="
                    font-['Cinzel',serif] text-[10px] tracking-[3px] text-[var(--gold)]
                    hover:text-[var(--gold-light)]
                    transition-all duration-300
                    underline underline-offset-4 decoration-[rgba(201,168,76,.25)]
                    hover:decoration-[rgba(201,168,76,.6)]
                  "
                >
                  Sign In →
                </Link>
              </p>

              <div className="mt-5 flex items-center justify-center gap-3">
                <svg viewBox="0 0 40 8" className="h-2 opacity-50">
                  <path
                    d="M0 4 L40 4"
                    stroke="rgba(201,168,76,0.3)"
                    strokeWidth="0.5"
                  />
                </svg>
                <svg viewBox="0 0 40 8" className="h-2 opacity-50">
                  <path
                    d="M0 4 L40 4"
                    stroke="rgba(201,168,76,0.3)"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes auraPulse {
          0%, 100% { transform: scale(1); opacity: .9; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .py-4.5 {
          padding-top: 18px;
          padding-bottom: 18px;
        }
      `}</style>
    </div>
  );
}