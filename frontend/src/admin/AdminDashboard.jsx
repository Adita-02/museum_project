import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Calendar,
  ChevronDown,
  Share,
  Plus,
  Receipt,
  ArrowUpRight,
  PackageCheck,
  Bell,
  Search,
  TrendingUp,
  Landmark, // ← new import
} from "lucide-react";

// ───────────────────────────────────────────────────────────────────────────
// One-time font load. Move this <link> into your root index.html so it
// doesn't re-inject on every mount.
// ───────────────────────────────────────────────────────────────────────────
function useLedgerFonts() {
  useEffect(() => {
    if (document.getElementById("ledger-fonts")) return;
    const link = document.createElement("link");
    link.id = "ledger-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

// Animations + paper-grain + chart draw-in
function useLedgerStyles() {
  useEffect(() => {
    if (document.getElementById("ledger-styles")) return;
    const style = document.createElement("style");
    style.id = "ledger-styles";
    style.textContent = `
      @keyframes ledger-rise { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      @keyframes ledger-draw { from{stroke-dashoffset:1200} to{stroke-dashoffset:0} }
      @keyframes ledger-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(138,154,95,.55)} 50%{box-shadow:0 0 0 6px rgba(138,154,95,0)} }
      @keyframes ledger-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      @keyframes ledger-fadein { from{opacity:0} to{opacity:1} }
      .ledger-rise { animation: ledger-rise .6s cubic-bezier(.2,.7,.2,1) both; }
      .ledger-rise-1 { animation-delay: .04s; }
      .ledger-rise-2 { animation-delay: .10s; }
      .ledger-rise-3 { animation-delay: .16s; }
      .ledger-rise-4 { animation-delay: .22s; }
      .ledger-rise-5 { animation-delay: .28s; }
      .ledger-pulse  { animation: ledger-pulse 1.8s ease-out infinite; }
      .ledger-draw-line { stroke-dasharray:1200; stroke-dashoffset:1200; animation: ledger-draw 1.4s cubic-bezier(.6,.05,.2,1) forwards; }
      .ledger-grain {
        background-image:
          radial-gradient(rgba(201,163,92,0.06) 1px, transparent 1px),
          radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px);
        background-size: 3px 3px, 7px 7px;
        background-position: 0 0, 1px 2px;
      }
      .ledger-shimmer {
        background: linear-gradient(90deg, rgba(201,163,92,.04) 0%, rgba(201,163,92,.12) 50%, rgba(201,163,92,.04) 100%);
        background-size: 200% 100%;
        animation: ledger-shimmer 1.6s ease-in-out infinite;
      }
      .ledger-row { position: relative; }
      .ledger-row::before {
        content:""; position:absolute; left:0; top:0; bottom:0; width:0;
        background: linear-gradient(180deg, transparent, #c9a35c, transparent);
        transition: width .25s ease;
      }
      .ledger-row:hover::before { width: 2px; }
      .ledger-chart-point { transition: r .2s ease, fill .2s ease; }
      .ledger-chart-point:hover { r: 5; fill: #c9a35c; }
    `;
    document.head.appendChild(style);
  }, []);
}

// ───────────────────────────────────────────────────────────────────────────
// Asset library: stable Unsplash IDs + the locally-generated splash banner.
// Replace any of these with a path in your /public folder if you'd rather
// host locally.
// ───────────────────────────────────────────────────────────────────────────
const SPLASH_HERO =
  "https://images.unsplash.com/photo-1565060169187-5284a3da7929?w=1600&q=80&auto=format";

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=160&q=80&auto=format",
  "https://images.unsplash.com/photo-1583407723467-9b2d22504873?w=160&q=80&auto=format",
  "https://images.unsplash.com/photo-1606939677937-b76f1c0dba99?w=160&q=80&auto=format",
  "https://images.unsplash.com/photo-1603584173870-7b8235023498?w=160&q=80&auto=format",
  "https://images.unsplash.com/photo-1544967082-d9d4d6b8aac4?w=160&q=80&auto=format",
];
// nice deterministic avatar set, keyed by name so it stays stable per order
const AVATAR_IMAGES = {
  default1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format",
  default2: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format",
  default3: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format",
  default4: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format",
};

// Fallback when an image fails — colored initials in a soft square
function ImageOrInitials({ src, alt, name = "", className = "" }) {
  const [err, setErr] = useState(false);
  const initials = (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "·";
  if (err || !src) {
    return (
      <div
        className={`flex items-center justify-center text-[10px] font-medium text-[#c9a35c] bg-[#c9a35c]/10 border border-[#c9a35c]/25 ${className}`}
        style={{ fontFamily: "'Fraunces', serif" }}
        aria-label={alt}
      >
        {initials}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErr(true)}
      className={`object-cover bg-[#c9a35c]/5 ${className}`}
    />
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Main dashboard
// ───────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth();
  useLedgerFonts();
  useLedgerStyles();

   const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // প্রতি মিনিটে আপডেট
    return () => clearInterval(timer);
  }, []);

  const hour = now.getHours();
  const greeting =
    hour < 5 ? "Good night" :
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" :
    hour < 21 ? "Good evening" : "Good night";

  const onlineLabel = now.toLocaleString("en-US", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(",", " ·");


  const [artifacts, setArtifacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [civilizations, setCivilizations] = useState([]); // ← new state
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("Weekly");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [artifactsRes, ordersRes, civRes] = await Promise.all([
          api.get("/artifacts"),
          api.get("/orders").catch(() => ({ data: [] })),
          api.get("/civilizations"), // ← new API call
        ]);
        setArtifacts(artifactsRes.data || []);
        setOrders(ordersRes.data || []);
        setCivilizations(civRes.data || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalArtifacts = artifacts.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => (o.status || "").toLowerCase() === "pending"
  ).length;
  const lowStock = artifacts.filter((a) => Number(a.stock) <= 5).length;

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    [orders]
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5),
    [orders]
  );

  const chartData = [
    { label: "Mon", value: 45 },
    { label: "Tue", value: 78 },
    { label: "Wed", value: 62 },
    { label: "Thu", value: 92 },
    { label: "Fri", value: 70 },
    { label: "Sat", value: 85 },
    { label: "Sun", value: 55 },
  ];
  const maxValue = Math.max(...chartData.map((d) => d.value));

  const fmt = (n) =>
    `$${(Number(n) || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "—";

  const statusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return "text-[#8a9a5f] border-[#8a9a5f]/40 bg-[#8a9a5f]/[0.07]";
      case "shipped":
        return "text-[#9db3c9] border-[#9db3c9]/40 bg-[#9db3c9]/[0.07]";
      case "pending":
        return "text-[#c9a35c] border-[#c9a35c]/40 bg-[#c9a35c]/[0.09]";
      default:
        return "text-[#8c8577] border-[#8c8577]/30 bg-[#8c8577]/[0.05]";
    }
  };

  // Stable avatar key per order (so the same order always shows same face)
  const avatarFor = (seed = "") => {
    const keys = Object.keys(AVATAR_IMAGES);
    const sum = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
    return AVATAR_IMAGES[keys[sum % keys.length]];
  };
  const productFor = (seed = "") => {
    const sum = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
    return PRODUCT_IMAGES[sum % PRODUCT_IMAGES.length];
  };

  return (
    <div
      className="min-h-full bg-[#0b0a08] text-[#ede7da] ledger-grain"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* page vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(201,163,92,.06), transparent 55%), radial-gradient(ellipse at bottom, rgba(0,0,0,.5), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto space-y-4">
        {/* ───────── SPLASH HERO ───────── */}
        <SplashHero
  name={user?.name || "Admin"}
  greeting={greeting}         
  online={onlineLabel}        
  search={search}
  setSearch={setSearch}
  loading={loading}
  fmt={fmt}
  totalRevenue={totalRevenue}
  civilizationsCount={civilizations.length}
/>

        {/* ───────── STAT CARDS (dense row, under the splash) ───────── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 -mt-6 relative z-20">
          <div className="ledger-rise ledger-rise-1">
            <StatCard
              fig="01"
              title="Total Revenue"
              value={loading ? "…" : fmt(totalRevenue)}
              tone="up"
              note="+12.5% vs last period"
              icon={<TrendingUp size={12} />}
            />
          </div>
          <div className="ledger-rise ledger-rise-2">
            <StatCard
              fig="02"
              title="Orders"
              value={loading ? "…" : totalOrders}
              tone="neutral"
              note={`${pendingOrders} pending`}
            />
          </div>
          <div className="ledger-rise ledger-rise-3">
            <StatCard
              fig="03"
              title="Artifacts"
              value={loading ? "…" : totalArtifacts}
              tone="down"
              note={`${lowStock} low stock`}
            />
          </div>
          <div className="ledger-rise ledger-rise-4">
            <StatCard
              fig="04"
              title="Customers"
              value={loading ? "…" : new Set(orders.map((o) => o.customerName)).size}
              tone="up"
              note="+8 new"
            />
          </div>
          {/* ← new 5th stat card for Civilizations */}
          <div className="ledger-rise ledger-rise-5">
            <StatCard
              fig="05"
              title="Civilizations"
              value={loading ? "…" : civilizations.length}
              tone="neutral"
              note={`${civilizations.filter(c => c.continent === "americas").length} in Americas`}
              icon={<Landmark size={12} />}
            />
          </div>
        </div>

        {/* ───────── CHART + QUICK ACTIONS (rendered as a single dense row) ───────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
          <div className="ledger-rise ledger-rise-3 border border-[#c9a35c]/15 rounded-lg p-4 hover:border-[#c9a35c]/30 transition-colors bg-[#0b0a08]/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] tracking-[0.2em] text-[#c9a35c]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  WEEKLY YIELD LOG
                </span>
                <span
                  className="text-[10px] tracking-[0.15em] text-[#8c8577]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  · units
                </span>
              </div>
              <div className="flex border border-[#c9a35c]/15 rounded-md overflow-hidden text-[11px]">
                {["Weekly", "Monthly"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-2.5 py-1 transition-colors ${
                      period === p
                        ? "bg-[#c9a35c] text-[#0b0a08]"
                        : "text-[#8c8577] hover:text-[#ede7da] hover:bg-[#c9a35c]/[0.06]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[150px] w-full">
              <Chart chartData={chartData} maxValue={maxValue} />
            </div>
          </div>

          {/* Quick actions as 4 image-rich mini cards in a 2×2 grid */}
          <div className="grid grid-cols-2 gap-3 ledger-rise ledger-rise-4">
            <ActionCard
              to="/admin/products/add"
              icon={<Plus size={14} />}
              label="Add Artifact"
              hint="Catalog a new piece"
              image={PRODUCT_IMAGES[0]}
            />
            <ActionCard
              to="/admin/orders"
              icon={<Receipt size={14} />}
              label="View Orders"
              hint={`${pendingOrders} pending`}
              image={PRODUCT_IMAGES[1]}
            />
            <ActionCard
              icon={<Share size={14} />}
              label="Export"
              hint="CSV · PDF"
              image={PRODUCT_IMAGES[2]}
              onClick={() => {}}
            />
            <ActionCard
              icon={<Calendar size={14} />}
              label="Schedule"
              hint="Curator log"
              image={PRODUCT_IMAGES[3]}
              onClick={() => {}}
            />
          </div>
        </div>

        {/* ───────── RECENT ORDERS (compact, with thumbs + avatars) ───────── */}
        <div className="ledger-rise ledger-rise-5 border border-[#c9a35c]/15 rounded-lg overflow-hidden bg-[#0b0a08]/40 hover:border-[#c9a35c]/30 transition-colors">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#c9a35c]/15">
            <div className="flex items-center gap-2">
              <PackageCheck size={14} className="text-[#c9a35c]" />
              <h3 className="text-sm text-[#ede7da]">Recent Orders</h3>
              <span
                className="px-1.5 py-0.5 rounded-full text-[10px] border border-[#c9a35c]/20 text-[#8c8577]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {recentOrders.length}
              </span>
            </div>
            <Link
              to="/admin/orders"
              className="text-[11px] text-[#c9a35c] hover:text-[#dab876] flex items-center gap-1 group"
            >
              View All
              <ArrowUpRight
                size={11}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>
          </div>

          {loading ? (
            <SkeletonRows />
          ) : recentOrders.length === 0 ? (
            <EmptyState />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="text-left text-[10px] tracking-[0.15em] text-[#8c8577] border-b border-[#c9a35c]/10"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <th className="px-4 py-2 font-normal">Item</th>
                  <th className="px-4 py-2 font-normal">Customer</th>
                  <th className="px-4 py-2 font-normal text-right">Amount</th>
                  <th className="px-4 py-2 font-normal">Status</th>
                  <th className="px-4 py-2 font-normal">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c9a35c]/8">
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="ledger-row hover:bg-[#c9a35c]/[0.05] transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <ImageOrInitials
                          src={productFor(order._id || order.id)}
                          alt="artifact"
                          name={(order.items?.[0]?.name) || "A"}
                          className="h-9 w-9 rounded border border-[#c9a35c]/20"
                        />
                        <div className="min-w-0">
                          <p
                            className="text-xs text-[#8c8577] truncate"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            #{order._id?.slice(-6) || "N/A"}
                          </p>
                          <p className="text-[11px] text-[#8c8577]/70 truncate">
                            {order.items?.[0]?.name || "Custom order"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <ImageOrInitials
                          src={avatarFor(order.customerName || order._id)}
                          alt={order.customerName || "Guest"}
                          name={order.customerName || "Guest"}
                          className="h-6 w-6 rounded-full border border-[#c9a35c]/20"
                        />
                        <span className="text-[#ede7da] text-[13px]">
                          {order.customerName || "Guest"}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-4 py-2.5 text-right text-[#c9a35c]"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {fmt(order.total)}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] border ${statusStyle(
                          order.status
                        )}`}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[#8c8577] text-[11px] tabular-nums">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ───────── RECENT CIVILIZATIONS ───────── */}
        <div className="ledger-rise ledger-rise-5 border border-[#c9a35c]/15 rounded-lg overflow-hidden bg-[#0b0a08]/40 hover:border-[#c9a35c]/30 transition-colors">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#c9a35c]/15">
            <div className="flex items-center gap-2">
              <Landmark size={14} className="text-[#c9a35c]" />
              <h3 className="text-sm text-[#ede7da]">Recent Civilizations</h3>
              <span
                className="px-1.5 py-0.5 rounded-full text-[10px] border border-[#c9a35c]/20 text-[#8c8577]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {civilizations.length}
              </span>
            </div>
            <Link
              to="/admin/civilizations"
              className="text-[11px] text-[#c9a35c] hover:text-[#dab876] flex items-center gap-1 group"
            >
              View All
              <ArrowUpRight
                size={11}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>
          </div>

          {loading ? (
            <SkeletonRows />
          ) : civilizations.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p
                className="text-[10px] tracking-[0.3em] text-[#c9a35c]/60 mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                ◆
              </p>
              <p className="text-sm text-[#8c8577]">No civilizations seeded yet.</p>
              <p className="text-[11px] text-[#8c8577]/60 mt-1">
                Run <code className="bg-[#c9a35c]/10 px-1.5 py-0.5 rounded text-[#c9a35c]">node seedCivilizations.js</code> to populate.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
              {civilizations.slice(0, 6).map((civ) => (
                <div
                  key={civ._id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#c9a35c]/10 hover:border-[#c9a35c]/30 transition-all bg-[#0b0a08]/30"
                >
                  <img
                    src={civ.img}
                    alt={civ.name}
                    loading="lazy"
                    className="h-12 w-12 rounded object-cover border border-[#c9a35c]/20"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#ede7da] truncate">{civ.name}</p>
                    <p
                      className="text-[10px] text-[#8c8577] truncate"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {civ.era} · {civ.region}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#c9a35c]/60 border border-[#c9a35c]/20 rounded px-1.5 py-0.5">
                    {civ.continent}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* compact footer */}
        <div className="flex items-center justify-between text-[10px] tracking-[0.25em] text-[#8c8577]/60 pt-0.5">
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>FOLIO · I</span>
          <span
            className="flex items-center gap-1.5"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="h-px w-5 bg-[#c9a35c]/30" />
            END OF DUMP
            <span className="h-px w-5 bg-[#c9a35c]/30" />
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>P. 01 / 01</span>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Splash hero — the "wow" panel. Background photo + welcome text overlay,
// search input + small revenue chip · all anchored in a single dense band.
// ───────────────────────────────────────────────────────────────────────────
function SplashHero({ name, greeting, online, search, setSearch, loading, fmt, totalRevenue, civilizationsCount })  {
  return (
    <section
      className="ledger-rise relative rounded-xl overflow-hidden border border-[#c9a35c]/20 h-[180px] sm:h-[210px]"
    >
      {/* background image */}
      <img
        src={SPLASH_HERO}
        alt="curator desk"
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
      {/* tonal overlay so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,10,8,0.92) 0%, rgba(11,10,8,0.78) 38%, rgba(11,10,8,0.35) 70%, rgba(11,10,8,0.15) 100%)",
        }}
        aria-hidden="true"
      />
      {/* small ornamental corner brackets */}
      <CornerBrackets />

      <div className="relative h-full flex flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p
              className="text-[10px] tracking-[0.3em] text-[#c9a35c]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              CURATOR · DASHBOARD
            </p>
            <span className="h-3 w-px bg-[#c9a35c]/40" />
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#8a9a5f] ledger-pulse" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#8a9a5f]" />
              </span>
              <p
                className="text-[10px] tracking-[0.2em] text-[#8c8577]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                LIVE · {online}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <SearchBar value={search} onChange={setSearch} />
            <button className="relative p-2 rounded-md border border-[#c9a35c]/30 text-[#c9a35c] backdrop-blur-sm hover:bg-[#c9a35c]/[0.1] transition-colors">
              <Bell size={14} />
              <span className="absolute -top-1 -right-1 inline-flex h-1.5 w-1.5 rounded-full bg-[#c9a35c]" />
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <h1
              className="text-3xl sm:text-4xl text-[#ede7da] tracking-tight leading-[1.05]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              {greeting},
              <br />
              <span className="text-[#c9a35c] italic">{name}.</span>
            </h1>
            <p className="text-[12px] text-[#8c8577] mt-2 max-w-md">
              {loading ? "…" : `${civilizationsCount} civilizations`} · {loading ? "…" : fmt(totalRevenue)} in this period.
              Quietly brilliant.
            </p>
          </div>

          {/* mini revenue chip, floating on the photo */}
          <div className="hidden md:flex flex-col items-end text-right">
            <p
              className="text-[10px] tracking-[0.2em] text-[#8c8577]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              PERIOD REVENUE
            </p>
            <p
              className="text-2xl text-[#ede7da] tabular-nums"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              {loading ? "…" : fmt(totalRevenue)}
            </p>
            <p
              className="text-[10px] text-[#8a9a5f] flex items-center gap-1"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <TrendingUp size={10} /> +12.5% vs last week
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search
        size={12}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8c8577]"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e?.target?.value ?? "")}
        placeholder="Search artifacts…"
        className="pl-7 pr-3 py-1.5 w-[180px] text-[11px] rounded-md bg-[#0b0a08]/60 backdrop-blur-sm border border-[#c9a35c]/25 text-[#ede7da] placeholder:text-[#8c8577] focus:outline-none focus:border-[#c9a35c]/50"
      />
    </div>
  );
}

function CornerBrackets() {
  const common = "absolute h-3 w-3 border-[#c9a35c]/50";
  return (
    <>
      <span className={`${common} top-2 left-2 border-l border-t`} />
      <span className={`${common} top-2 right-2 border-r border-t`} />
      <span className={`${common} bottom-2 left-2 border-l border-b`} />
      <span className={`${common} bottom-2 right-2 border-r border-b`} />
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Action card: tiny image + label, used in the 2×2 quick-action grid.
// ───────────────────────────────────────────────────────────────────────────
function ActionCard({ to, onClick, icon, label, hint, image }) {
  const Wrapper = to ? Link : "button";
  const props = to ? { to } : { onClick: onClick || (() => {}) };
  return (
    <Wrapper
      {...props}
      className="group relative overflow-hidden rounded-lg border border-[#c9a35c]/15 hover:border-[#c9a35c]/40 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-10px_rgba(201,163,92,.4)] bg-[#0b0a08]/50 h-[88px] text-left"
    >
      <img
        src={image}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(11,10,8,.92) 0%, rgba(11,10,8,.55) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="relative h-full p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[#c9a35c]">{icon}</span>
          <ArrowUpRight
            size={11}
            className="text-[#8c8577] group-hover:text-[#c9a35c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
          />
        </div>
        <div>
          <p className="text-[13px] text-[#ede7da] group-hover:text-[#c9a35c] transition-colors leading-tight">
            {label}
          </p>
          <p
            className="text-[10px] text-[#8c8577] mt-0.5 leading-tight"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {hint}
          </p>
        </div>
      </div>
    </Wrapper>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Stat card — fig label + dot + value + title + note, all tightly packed.
// ───────────────────────────────────────────────────────────────────────────
function StatCard({ fig, title, value, tone, note, icon }) {
  const toneMap = {
    up: { color: "#8a9a5f", label: "↗" },
    down: { color: "#a8593a", label: "↘" },
    neutral: { color: "#c9a35c", label: "—" },
  };
  const t = toneMap[tone] || toneMap.neutral;
  return (
    <div className="relative border border-[#c9a35c]/15 rounded-lg p-3 hover:border-[#c9a35c]/45 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(201,163,92,.35)] transition-all bg-[#0b0a08]/70 backdrop-blur-sm">
      <span
        className="absolute top-1.5 right-1.5 text-[8px] text-[#c9a35c]/30 select-none"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        aria-hidden="true"
      >
        {fig}
      </span>
      <div className="flex items-center justify-between mb-1.5">
        <p
          className="text-[10px] tracking-[0.15em] text-[#8c8577]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          FIG. {fig}
        </p>
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: t.color, boxShadow: `0 0 6px ${t.color}88` }}
        />
      </div>
      <div className="flex items-baseline justify-between mb-0.5">
        <p
          className="text-xl text-[#ede7da] tabular-nums"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
        >
          {value}
        </p>
        {icon && <span className="text-[#c9a35c]/70">{icon}</span>}
      </div>
      <p className="text-[11px] text-[#8c8577] leading-tight">{title}</p>
      {note && (
        <p
          className="text-[10px] flex items-center gap-1 mt-1"
          style={{ color: t.color, fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span aria-hidden="true">{t.label}</span>
          <span className="truncate">{note}</span>
        </p>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Chart — minimal, dashed grid, drawn-in line, peak label.
// ───────────────────────────────────────────────────────────────────────────
function Chart({ chartData, maxValue }) {
  const W = 600;
  const H = 150;
  const leftPad = 8;
  const rightPad = 8;
  const topPad = 18;
  const bottomPad = 16;
  const innerH = H - topPad - bottomPad;
  const innerW = W - leftPad - rightPad;

  const points = chartData.map((d, i) => {
    const x = leftPad + (i / (chartData.length - 1)) * innerW;
    const y = topPad + innerH - (d.value / maxValue) * innerH;
    return { x, y, ...d };
  });
  const pathLine = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const pathArea = `${pathLine} L ${points[points.length - 1].x.toFixed(1)} ${topPad + innerH} L ${points[0].x.toFixed(1)} ${topPad + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a35c" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#c9a35c" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t, i) => {
        const y = topPad + innerH - t * innerH;
        return (
          <line
            key={i}
            x1={leftPad}
            y1={y}
            x2={W - rightPad}
            y2={y}
            stroke={i === 2 ? "rgba(201,163,92,.18)" : "rgba(201,163,92,.06)"}
            strokeWidth="1"
            strokeDasharray={i === 2 ? "0" : "2,3"}
          />
        );
      })}
      <path d={pathArea} fill="url(#areaGrad)" />
      <path
        d={pathLine}
        stroke="#c9a35c"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ledger-draw-line"
      />
      {points.map((p, i) => {
        const isPeak = p.value === maxValue;
        return (
          <g key={i} className="cursor-pointer">
            {isPeak && (
              <>
                <line
                  x1={p.x}
                  y1={p.y - 6}
                  x2={p.x}
                  y2={topPad - 2}
                  stroke="rgba(201,163,92,.4)"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text
                  x={p.x}
                  y={topPad - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#c9a35c"
                  fontFamily="'Fraunces', serif"
                  fontStyle="italic"
                >
                  peak · {p.value}
                </text>
              </>
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#0b0a08"
              stroke="#c9a35c"
              strokeWidth="1.5"
              className="ledger-chart-point"
            />
          </g>
        );
      })}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={H - 5}
          textAnchor="middle"
          fontSize="9"
          fill="#8c8577"
          fontFamily="'JetBrains Mono', monospace"
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}

function SkeletonRows() {
  return (
    <div className="p-4 space-y-2.5">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 items-center">
          <div className="h-7 w-7 rounded ledger-shimmer" />
          <div className="h-3 w-20 rounded ledger-shimmer" />
          <div className="h-3 w-28 rounded ledger-shimmer" />
          <div className="h-3 w-16 rounded ledger-shimmer ml-auto" />
          <div className="h-3 w-20 rounded ledger-shimmer" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-4 py-10 text-center">
      <p
        className="text-[10px] tracking-[0.3em] text-[#c9a35c]/60 mb-2"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        ◆
      </p>
      <p className="text-sm text-[#8c8577]">No orders placed yet.</p>
      <p className="text-[11px] text-[#8c8577]/60 mt-1">
        New entries will appear here as they come in.
      </p>
    </div>
  );
}