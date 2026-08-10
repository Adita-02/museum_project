// src/pages/Exhibitions.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';

const exhibitions = [
  {
    id: 1,
    title: 'Egypt: Eternal Tombs',
    period: 'March – September 2026',
    description:
      'Journey into the Valley of the Kings. Over 200 artefacts, including newly discovered sarcophagi and funerary texts.',
    image: 'https://picsum.photos/seed/egypt/600/400',
    status: 'Current',
    region: 'Africa',
  },
  {
    id: 2,
    title: 'Silk Roads: Trade & Faith',
    period: 'July – December 2026',
    description:
      'From Chang\'an to Constantinople – explore the exchange of goods, ideas, and religions along the ancient silk routes.',
    image: 'https://picsum.photos/seed/silkroad/600/400',
    status: 'Upcoming',
    region: 'Asia',
  },
  {
    id: 3,
    title: 'Mesoamerican Cosmos',
    period: 'October 2026 – February 2027',
    description:
      'Maya, Aztec, and Olmec – a vivid display of astronomical knowledge, ritual objects, and monumental sculpture.',
    image: 'https://picsum.photos/seed/meso/600/400',
    status: 'Upcoming',
    region: 'Americas',
  },
  {
    id: 4,
    title: 'Viking Voyages',
    period: 'January – May 2027',
    description:
      'Swords, ships, and sagas. Uncover the Norse expansion through archaeological finds from Scandinavia to Newfoundland.',
    image: 'https://picsum.photos/seed/viking/600/400',
    status: 'Future',
    region: 'Europe',
  },
  {
    id: 5,
    title: 'Early China: Ritual & Power',
    period: 'April – August 2027',
    description:
      'Bronze vessels, oracle bones, and jade – the material culture of the Shang and Zhou dynasties.',
    image: 'https://picsum.photos/seed/chin/600/400',
    status: 'Future',
    region: 'Asia',
  },
  {
    id: 6,
    title: 'Athens & Sparta',
    period: 'September 2027 – January 2028',
    description:
      'The classical world in all its glory: marble statues, pottery, and the birth of democracy.',
    image: 'https://picsum.photos/seed/athens/600/400',
    status: 'Future',
    region: 'Europe',
  },
];

const Exhibitions = () => {
  const [filter, setFilter] = useState('All');
  const [filtered, setFiltered] = useState(exhibitions);

  useEffect(() => {
    if (filter === 'All') {
      setFiltered(exhibitions);
    } else {
      setFiltered(exhibitions.filter((ex) => ex.status === filter));
    }
  }, [filter]);

  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filtered]);

  return (
    <div className="min-h-screen bg-[#050403] text-[#e6d3a0] pb-24 px-4 md:px-8 lg:px-12 font-sans overflow-x-hidden selection:bg-[#c9a84c] selection:text-black">
      
      {/* ─── RADIAL BACKGROUND ─── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#1a120b_0%,#090704_60%,#050403_100%)] -z-20"></div>

      {/* ─── NAVBAR SPACER ─── */}
      <div className="h-28 md:h-36"></div>

      {/* ─── HERO SECTION  ─── */}
      <section className="relative w-full flex flex-col items-center text-center pt-10 md:pt-16 pb-6 md:pb-8 mb-16 md:mb-24">
        <div className="w-full max-w-5xl px-4 md:px-6">
          <span className="block mb-5 text-[10px] md:text-xs tracking-[8px] uppercase text-[#c9a84c] font-semibold opacity-80">
            Archæum Galleries
          </span>

          <h1 className="font-['Cinzel'] text-4xl md:text-6xl lg:text-7xl font-medium uppercase leading-tight tracking-[4px] text-[#e6d3a0]">
            Where History
            <span className="block mt-4 text-2xl md:text-4xl lg:text-5xl font-light tracking-[8px] text-[rgba(212,196,160,0.72)]">
              Comes to Life
            </span>
          </h1>

          <div className="flex items-center justify-center gap-5 my-10">
            <div className="w-20 md:w-32 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/70"></div>
            <span className="text-[#c9a84c] text-lg">◆</span>
            <div className="w-20 md:w-32 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/70"></div>
          </div>
        </div>
      </section>

      {/* ─── FILTER BAR ─── */}
      <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-6 mb-12 md:mb-16">
        <div className="flex flex-wrap gap-3 md:gap-4">
          {['All', 'Current', 'Upcoming', 'Future'].map((label) => (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className={`px-5 py-2 rounded-none text-[9px] tracking-[3px] uppercase font-bold border transition-all duration-300 cursor-pointer ${
                filter === label
                  ? 'bg-[rgba(201,168,76,0.12)] border-[#c9a84c] text-[#fff] shadow-[0_0_15px_rgba(201,168,76,0.3)]'
                  : 'bg-transparent border-[rgba(201,168,76,0.2)] text-[rgba(212,196,160,0.5)] hover:border-[rgba(201,168,76,0.5)] hover:text-[#e6d3a0]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── EXHIBITION GRID ─── */}
      <section className="max-w-7xl mx-auto relative z-10 px-4 md:px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-[rgba(201,168,76,0.15)] bg-[rgba(15,12,8,0.3)]">
            <p className="text-[rgba(212,196,160,0.4)] tracking-[3px] uppercase text-xs">
              No exhibitions in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((ex, index) => (
              <div
                key={ex.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className="group opacity-0 translate-y-8 transition-all duration-700 ease-out w-full"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="relative overflow-hidden bg-[rgba(16,13,9,0.55)] backdrop-blur-md border border-[rgba(201,168,76,0.18)] transition-all duration-500 hover:bg-[rgba(22,18,13,0.7)] hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] hover:border-[rgba(201,168,76,0.45)] w-full h-full flex flex-col">
                  
                  {/* Classical Gold Corners */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[rgba(201,168,76,0.4)] group-hover:border-[#c9a84c] transition-colors"></div>
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[rgba(201,168,76,0.4)] group-hover:border-[#c9a84c] transition-colors"></div>
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[rgba(201,168,76,0.4)] group-hover:border-[#c9a84c] transition-colors"></div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[rgba(201,168,76,0.4)] group-hover:border-[#c9a84c] transition-colors"></div>

                  {/* Image Display Case */}
                  <div className="relative h-52 overflow-hidden bg-[#100c08] border-b border-[rgba(201,168,76,0.15)] flex-shrink-0">
                    <img
                      src={ex.image}
                      alt={ex.title}
                      className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://picsum.photos/seed/fallback/600/400';
                      }}
                    />
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 bg-[rgba(5,4,3,0.85)] backdrop-blur-sm px-3 py-1 border border-[rgba(201,168,76,0.25)] text-[8px] tracking-[2px] uppercase">
                      <span
                        className={
                          ex.status === 'Current'
                            ? 'text-[#c9a84c] font-bold'
                            : ex.status === 'Upcoming'
                            ? 'text-[rgba(201,168,76,0.7)]'
                            : 'text-[rgba(212,196,160,0.4)]'
                        }
                      >
                        {ex.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-[8px] tracking-[2.5px] uppercase text-[rgba(212,196,160,0.4)] mb-2">
                      <span className="text-[#c9a84c]">{ex.region}</span>
                      <span className="text-[rgba(201,168,76,0.3)]">|</span>
                      <span>{ex.period}</span>
                    </div>
                    <h3 className="font-['Cinzel'] text-[#e6d3a0] text-base md:text-lg leading-tight mb-3 group-hover:text-white transition-colors">
                      {ex.title}
                    </h3>
                    <p className="text-[rgba(212,196,160,0.65)] text-xs font-light leading-relaxed min-h-[54px] line-clamp-3 flex-grow">
                      {ex.description}
                    </p>
                    <div className="mt-6 pt-4 border-t border-[rgba(201,168,76,0.12)] flex justify-between items-center mt-auto">
                      <Link
                        to={`/exhibitions/${ex.id}`}
                        className="text-[9px] tracking-[3px] uppercase text-[#c9a84c] hover:text-[#e6d3a0] transition-colors no-underline font-bold"
                      >
                        Learn More →
                      </Link>
                      <span className="text-[10px] text-[rgba(201,168,76,0.25)]">◆</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Exhibitions;