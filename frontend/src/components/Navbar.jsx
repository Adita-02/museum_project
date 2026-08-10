// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';

// ─── Rotating Emblem (matches the footer) ────────────────────────────
function NavbarEmblem() {
  return (
    <div className="navbar-emblem" aria-hidden="true">
      <svg viewBox="0 0 56 56" className="mini-spin">
        <circle cx="28" cy="28" r="24" fill="none"
                stroke="rgba(232,213,154,.85)" strokeWidth=".9"
                strokeDasharray="1 4" strokeLinecap="round"/>
      </svg>
      <svg viewBox="0 0 56 56" className="mini-spin-rev">
        <circle cx="28" cy="28" r="19" fill="none"
                stroke="rgba(201,168,76,.6)" strokeWidth=".7"
                strokeDasharray="5 2.5"/>
      </svg>
      <svg viewBox="0 0 56 56" className="mini-spin-slow">
        <circle cx="28" cy="4"  r="1.5" fill="#e8d59a"/>
        <circle cx="28" cy="52" r="1.5" fill="#e8d59a"/>
        <circle cx="4"  cy="28" r="1.5" fill="#e8d59a"/>
        <circle cx="52" cy="28" r="1.5" fill="#e8d59a"/>
      </svg>
      <div className="mini-ring-bg" />
      <div className="mini-orbit" />
      <div className="mini-seal">Æ</div>
    </div>
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => setDropdownOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    closeDropdown();
  }, [location.pathname]);

  // ─── Navigation handler ──────────────────────────────────────────
  const handleNav = (page, e) => {
    e.preventDefault();
    closeDropdown();
    const routes = {
      home: '/',
      gallery: '/gallery',
      exhibitions: '/exhibitions',   // ← NEW
      civs: '/civs',
      team: '/team',
      africa: '/africa',
      asia: '/asia',
      europe: '/europe',
      americas: '/americas',
    };
    navigate(routes[page] || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Active page detection ──────────────────────────────────────
  const getActivePage = () => {
    const path = location.pathname;
    const map = {
      '/': 'home',
      '/gallery': 'gallery',
      '/exhibitions': 'exhibitions',   // ← NEW
      '/civs': 'civs',
      '/team': 'team',
      '/africa': 'africa',
      '/asia': 'asia',
      '/europe': 'europe',
      '/americas': 'americas',
    };
    return map[path] || 'home';
  };

  const activePage = getActivePage();

  const openSearchModal = () => {
    window.open("https://www.google.com", "_blank");
  };

  return (
    <>
      {/* ─── Emblem styles (unchanged) ──────────────────────────── */}
      <style>{`
        @keyframes ringSpin   { to { transform: rotate(360deg); } }
        @keyframes orbitSpin  { to { transform: rotate(360deg); } }
        @keyframes orbitPulse {
          0%, 100% { opacity: .45; transform: scale(.92); }
          50%      { opacity: 1;   transform: scale(1.18); }
        }
        .navbar-emblem {
          position: relative;
          width: 38px; height: 38px;
          flex-shrink: 0;
          filter: drop-shadow(0 0 10px rgba(201,168,76,.30));
        }
        .navbar-emblem svg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          overflow: visible;
        }
        .mini-spin     { animation: ringSpin 18s linear infinite;          transform-origin: 50% 50%; }
        .mini-spin-rev { animation: ringSpin 13s linear infinite reverse; transform-origin: 50% 50%; }
        .mini-spin-slow{ animation: ringSpin 30s linear infinite;          transform-origin: 50% 50%; }
        .mini-orbit {
          position: absolute; inset: 0; border-radius: 50%;
          animation: orbitSpin 9s linear infinite;
          pointer-events: none;
        }
        .mini-orbit::after {
          content: ""; position: absolute;
          top: -2.5px; left: 50%; width: 5px; height: 5px;
          margin-left: -2.5px; border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fff3c2, #c9a84c 55%, #6b4d10 100%);
          box-shadow: 0 0 7px rgba(232,213,154,.9), 0 0 14px rgba(201,168,76,.55);
          animation: orbitPulse 3.5s ease-in-out infinite;
        }
        .mini-seal {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif; font-size: 16px;
          color: #e8d59a; pointer-events: none;
          text-shadow: 0 0 8px rgba(232,213,154,.45);
        }
        .mini-ring-bg {
          position: absolute; inset: 7px; border-radius: 50%;
          background:
            radial-gradient(circle at 35% 30%, rgba(255,235,180,.10), transparent 60%),
            radial-gradient(circle at 50% 50%, #1a140b, #0a0805 75%);
          border: 1px solid rgba(201,168,76,.35);
          pointer-events: none;
        }
      `}</style>

      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-100 px-6 lg:px-10 transition-all duration-300 ${
          isScrolled
            ? 'bg-[rgba(9,7,4,0.97)] backdrop-blur-md border-b border-[rgba(201,168,76,0.18)]'
            : 'bg-transparent'
        }`}
      >
        <div className="nav-inner flex items-center justify-between h-[72px] max-w-[1400px] mx-auto">
          {/* Logo */}
          <div
            className="nav-logo flex items-center gap-3 flex-shrink-0 cursor-none no-underline"
            onClick={() => navigate('/')}
          >
            <NavbarEmblem />
            <div className="nav-logo-text flex flex-col whitespace-nowrap">
              <span className="nav-logo-name font-['Cinzel',serif] text-[17px] text-[var(--gold-light)] tracking-[3px] leading-none">
                ARCHÆUM
              </span>
              <span className="nav-logo-sub text-[9px] tracking-[4px] uppercase text-[rgba(201,168,76,0.35)] mt-[3px]">
                The Museum of world Archeology
              </span>
            </div>
          </div>

          {/* ─── Navigation Links ─────────────────────────────────── */}
          <ul className="nav-links flex gap-5 list-none items-center flex-nowrap">
            <li className="flex-shrink-0">
              <a
                href="#"
                className={`text-[9px] tracking-[2.5px] uppercase text-[rgba(212,196,160,0.7)] transition-all duration-200 no-underline font-semibold cursor-none px-2 py-1.5 rounded relative whitespace-nowrap ${
                  activePage === 'home' ? 'text-[var(--gold-light)]' : ''
                }`}
                onClick={(e) => handleNav('home', e)}
              >
                Home
                <span className={`absolute bottom-0.5 left-2 right-2 h-px bg-[var(--gold)] transition-transform duration-200 origin-center ${
                  activePage === 'home' ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </a>
            </li>

            <li className="flex-shrink-0">
              <a
                href="#"
                className={`text-[9px] tracking-[2.5px] uppercase text-[rgba(212,196,160,0.7)] transition-all duration-200 no-underline font-semibold cursor-none px-2 py-1.5 rounded relative whitespace-nowrap ${
                  activePage === 'gallery' ? 'text-[var(--gold-light)]' : ''
                }`}
                onClick={(e) => handleNav('gallery', e)}
              >
                Gallery
                <span className={`absolute bottom-0.5 left-2 right-2 h-px bg-[var(--gold)] transition-transform duration-200 origin-center ${
                  activePage === 'gallery' ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </a>
            </li>

            <li className="flex-shrink-0">
              <a
                href="#"
                className={`text-[9px] tracking-[2.5px] uppercase text-[rgba(212,196,160,0.7)] transition-all duration-200 no-underline font-semibold cursor-none px-2 py-1.5 rounded relative whitespace-nowrap ${
                  activePage === 'civs' ? 'text-[var(--gold-light)]' : ''
                }`}
                onClick={(e) => handleNav('civs', e)}
              >
                Civilizations
                <span className={`absolute bottom-0.5 left-2 right-2 h-px bg-[var(--gold)] transition-transform duration-200 origin-center ${
                  activePage === 'civs' ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </a>
            </li>

            {/* ─── NEW: Exhibitions link ──────────────────────────── */}
            <li className="flex-shrink-0">
              <a
                href="#"
                className={`text-[9px] tracking-[2.5px] uppercase text-[rgba(212,196,160,0.7)] transition-all duration-200 no-underline font-semibold cursor-none px-2 py-1.5 rounded relative whitespace-nowrap ${
                  activePage === 'exhibitions' ? 'text-[var(--gold-light)]' : ''
                }`}
                onClick={(e) => handleNav('exhibitions', e)}
              >
                Exhibitions
                <span className={`absolute bottom-0.5 left-2 right-2 h-px bg-[var(--gold)] transition-transform duration-200 origin-center ${
                  activePage === 'exhibitions' ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </a>
            </li>

            {/* Regions Dropdown (unchanged) */}
            <li className="nav-dropdown relative cursor-none flex-shrink-0" ref={dropdownRef}>
              <a
                href="#"
                className="text-[9px] tracking-[2.5px] uppercase text-[rgba(212,196,160,0.7)] transition-all duration-200 no-underline font-semibold cursor-none px-2 py-1.5 rounded relative flex items-center whitespace-nowrap"
                onClick={toggleDropdown}
              >
                Regions
                <span className="arrow inline-block ml-1 text-[8px] transition-transform duration-200 opacity-50"
                      style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
              </a>
              <ul className={`dropdown-menu absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 min-w-[160px] bg-[rgba(9,7,4,0.98)] backdrop-blur-md border border-[rgba(201,168,76,0.25)] rounded-xl py-2 shadow-2xl list-none z-150 transition-all duration-200 ${
                dropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'
              }`} style={{ pointerEvents: dropdownOpen ? 'auto' : 'none' }}>
                <li className="dm-label px-5 py-1.5 text-[8px] tracking-[3px] uppercase text-[rgba(201,168,76,0.3)] pointer-events-none">
                  Explore by Region
                </li>
                <li><a href="#" className="block px-5 py-2 text-[10px] tracking-[2px] uppercase text-[rgba(212,196,160,0.7)] no-underline cursor-pointer transition-all duration-200 hover:text-[var(--gold-light)] hover:bg-[rgba(201,168,76,0.08)] hover:pl-7 relative" onClick={(e) => { handleNav('africa', e); closeDropdown(); }}><span className="reg-icon mr-2 text-[13px]">𓃀</span> Africa</a></li>
                <li><a href="#" className="block px-5 py-2 text-[10px] tracking-[2px] uppercase text-[rgba(212,196,160,0.7)] no-underline cursor-pointer transition-all duration-200 hover:text-[var(--gold-light)] hover:bg-[rgba(201,168,76,0.08)] hover:pl-7 relative" onClick={(e) => { handleNav('asia', e); closeDropdown(); }}><span className="reg-icon mr-2 text-[13px]">𒀭</span> Asia</a></li>
                <li><a href="#" className="block px-5 py-2 text-[10px] tracking-[2px] uppercase text-[rgba(212,196,160,0.7)] no-underline cursor-pointer transition-all duration-200 hover:text-[var(--gold-light)] hover:bg-[rgba(201,168,76,0.08)] hover:pl-7 relative" onClick={(e) => { handleNav('europe', e); closeDropdown(); }}><span className="reg-icon mr-2 text-[13px]">🏛️</span> Europe</a></li>
                <li><a href="#" className="block px-5 py-2 text-[10px] tracking-[2px] uppercase text-[rgba(212,196,160,0.7)] no-underline cursor-pointer transition-all duration-200 hover:text-[var(--gold-light)] hover:bg-[rgba(201,168,76,0.08)] hover:pl-7 relative" onClick={(e) => { handleNav('americas', e); closeDropdown(); }}><span className="reg-icon mr-2 text-[13px]">🗿</span> Americas</a></li>
                <li className="dm-divider h-px bg-[rgba(201,168,76,0.1)] my-1.5 mx-3.5"></li>
                <li><a href="#" className="block px-5 py-2 text-[9px] tracking-[2px] uppercase text-[rgba(201,168,76,0.5)] no-underline cursor-pointer transition-all duration-200 hover:text-[var(--gold-light)] hover:bg-[rgba(201,168,76,0.08)] hover:pl-7 relative" onClick={(e) => { handleNav('civs', e); closeDropdown(); }}>All Civilizations →</a></li>
              </ul>
            </li>

            {/* Team link (moved to the end) */}
            <li className="flex-shrink-0">
              <a
                href="#"
                className={`nav-team-link text-[var(--gold)] border border-[rgba(201,168,76,0.5)] rounded-full px-3 py-1 bg-[rgba(201,168,76,0.1)] font-bold text-[9px] tracking-[2.5px] uppercase no-underline transition-all duration-200 cursor-none hover:bg-[rgba(201,168,76,0.2)] hover:border-[var(--gold)] whitespace-nowrap ${
                  activePage === 'team' ? 'bg-[rgba(201,168,76,0.2)] border-[var(--gold)]' : ''
                }`}
                onClick={(e) => handleNav('team', e)}
              >
                Team
              </a>
            </li>
          </ul>

          {/* Right side: Search + Login/Signup */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              className="nav-search-btn flex items-center gap-2 bg-[rgba(201,168,76,0.07)] border border-[rgba(201,168,76,0.2)] rounded-full px-3 py-1.5 text-[10px] tracking-[2px] uppercase text-[rgba(212,196,160,0.5)] transition-all duration-200 cursor-none font-['Cinzel',serif] hover:bg-[rgba(201,168,76,0.14)] hover:border-[rgba(201,168,76,0.4)] hover:text-[var(--gold-light)] whitespace-nowrap pointer-events-auto"
              onClick={openSearchModal}
            >
              <span className="nav-search-icon text-sm opacity-70">⌕</span> Search
            </button>

            <div className="flex items-center gap-2 text-[9px] tracking-[2.5px] uppercase font-semibold flex-shrink-0 pointer-events-auto">
              <span onClick={() => navigate('/login')} className="text-[rgba(212,196,160,0.7)] hover:text-[var(--gold-light)] transition-colors no-underline whitespace-nowrap cursor-pointer">Login</span>
              <span className="text-[rgba(212,196,160,0.3)]">|</span>
              <span onClick={() => navigate('/signup')} className="text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors no-underline whitespace-nowrap cursor-pointer">Sign Up</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;