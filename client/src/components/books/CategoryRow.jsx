import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Terminal, Cpu, Globe,
  Database, TrendingUp, BookOpen, Zap, Sparkles, ArrowRight,
  UserCheck, Bookmark, Activity, Brain
} from 'lucide-react';
import { CATEGORIES_DATA } from '../../data/libraryData.js';

const ICON_MAP = {
  Terminal,
  Cpu,
  Globe,
  Database,
  TrendingUp,
  BookOpen,
  Zap,
  Sparkles,
  UserCheck,
  Bookmark,
  Activity,
  Brain
};

export const CategoryRow = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section id="categories" className="relative space-y-4 py-8 group/row">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 px-4 sm:px-8 lg:px-12">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Explore by Category
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40">
              {CATEGORIES_DATA.length} DISCIPLINES
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Curated collections spanning software engineering, machine intelligence, natural sciences, and literature.
          </p>
        </div>

        <Link
          to="/books"
          className="text-xs font-bold text-[#FF4B4B] hover:text-[#FF6E6E] flex items-center gap-1 transition"
        >
          View All Subjects <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Viewport with Left/Right arrows */}
      <div className="relative">
        
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#080B12]/80 hover:bg-[#8B5CF6] border border-white/20 text-white flex items-center justify-center shadow-xl transition-all duration-300 backdrop-blur-md opacity-0 group-hover/row:opacity-100 disabled:opacity-0 disabled:pointer-events-none hover:scale-110"
          title="Scroll Left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Categories Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-8 lg:px-12 py-2"
        >
          {CATEGORIES_DATA.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || BookOpen;

            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/books?category=${cat.slug}`)}
                className="relative flex-none w-64 sm:w-72 h-44 rounded-2xl overflow-hidden cursor-pointer border border-[#232A3B] group/card hover:border-[#FF4B4B]/60 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] select-none"
              >
                {/* Background Image with Dark Vignette Overlay */}
                <img
                  src={cat.bgImage}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/80 to-[#080B12]/40" />

                {/* Card Content */}
                <div className="relative h-full p-5 flex flex-col justify-between z-10">
                  
                  {/* Top Icon and Book Count */}
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white backdrop-blur-md shadow-md"
                      style={{ backgroundColor: `${cat.accentColor}33`, borderColor: cat.accentColor, borderWidth: '1px' }}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: cat.accentColor }} />
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/60 text-slate-300 border border-white/10 backdrop-blur-md">
                      {cat.bookCount}
                    </span>
                  </div>

                  {/* Bottom Text and Action */}
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-white group-hover/card:text-[#FF4B4B] transition-colors leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 leading-normal">
                      {cat.description}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#FF4B4B] pt-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#080B12]/80 hover:bg-[#8B5CF6] border border-white/20 text-white flex items-center justify-center shadow-xl transition-all duration-300 backdrop-blur-md opacity-0 group-hover/row:opacity-100 disabled:opacity-0 disabled:pointer-events-none hover:scale-110"
          title="Scroll Right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>

    </section>
  );
};

export default CategoryRow;
