import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, BookOpen, Sparkles, ArrowRight, Star,
  ShieldCheck, TrendingUp, Users, Layers, Play
} from 'lucide-react';

export const HeroSection = ({
  onExploreClick,
  onOpenFeatured,
  stats = { books: '10,000+', readers: '2,500+', categories: '500+' }
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#080B12] text-white pt-8 pb-16 sm:pb-24">
      
      {/* Cinematic Ambient Background Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF4B4B]/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#232A3B_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />

      {/* Hero Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[75vh]">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10">
            
            {/* Small Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151A24]/90 border border-[#FF4B4B]/30 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF4B4B] animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-200">
                YOUR SMART DIGITAL LIBRARY
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] font-sans">
              A Universe of Knowledge,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B4B] via-[#E11D48] to-[#8B5CF6] drop-shadow-[0_4px_20px_rgba(255,75,75,0.4)]">
                Waiting for You.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Discover thousands of books, explore new ideas, and unlock your next chapter with Libratech — your intelligent companion for reading and learning.
            </p>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl">
              <div className="relative flex items-center bg-[#151A24]/95 border border-[#232A3B] focus-within:border-[#FF4B4B] rounded-2xl p-2 shadow-2xl transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search title, author, subject, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-white placeholder:text-slate-500 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4B4B] to-[#E03E3E] hover:from-[#FF3333] hover:to-[#FF4B4B] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#FF4B4B]/30 shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link to="/books">
                <button className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4B4B] via-[#E11D48] to-[#8B5CF6] hover:scale-105 text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF4B4B]/35 transition-all duration-300">
                  <span>Explore Books</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <button
                onClick={() => {
                  const ebooksEl = document.getElementById('ebooks') || document.getElementById('categories');
                  if (ebooksEl) ebooksEl.scrollIntoView({ behavior: 'smooth' });
                  else navigate('/books');
                }}
                className="px-6 py-3.5 rounded-2xl bg-[#151A24] hover:bg-[#1E2535] text-slate-200 hover:text-white font-bold text-sm border border-[#232A3B] hover:border-[#8B5CF6]/50 transition flex items-center gap-2 shadow-md"
              >
                <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
                <span>Discover E-Books</span>
              </button>
            </div>

            {/* Compact Sample/Demo Statistics */}
            <div className="pt-4 border-t border-[#232A3B]/80 flex flex-wrap items-center gap-8 sm:gap-12 text-slate-300">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {stats.books}
                </p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                  Curated Books
                </p>
              </div>

              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#FF4B4B] tracking-tight">
                  {stats.readers}
                </p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                  Active Readers
                </p>
              </div>

              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#8B5CF6] tracking-tight">
                  {stats.categories}
                </p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                  Disciplines & Subjects
                </p>
              </div>
            </div>

          </div>

          {/* Right Hero Column: 3D-Style Layered Composition */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Glowing Backdrop Ring */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-[#FF4B4B]/30 to-[#8B5CF6]/30 blur-2xl pointer-events-none" />

            <div className="relative w-full max-w-md perspective-[1200px]">
              
              {/* Primary Central Featured Book Card */}
              <div className="relative rounded-3xl bg-[#151A24] border border-[#232A3B] p-4 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10 transform sm:rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600"
                    alt="Designing Data-Intensive Applications"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-transparent to-transparent opacity-90" />
                  
                  {/* Floating Badges on Cover */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#FF4B4B] text-white shadow-lg shadow-[#FF4B4B]/40">
                      ★ #1 TRENDING
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 space-y-1">
                    <span className="text-[11px] font-bold text-[#8B5CF6] uppercase tracking-wider">
                      Computer Science
                    </span>
                    <h3 className="text-base font-extrabold text-white leading-tight">
                      Designing Data-Intensive Applications
                    </h3>
                    <p className="text-xs text-slate-300">
                      By Martin Kleppmann • 99% Reader Match
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Book 2 (Background Left Tilt) */}
              <div className="absolute -top-6 -left-6 sm:-left-10 w-44 sm:w-52 h-64 sm:h-72 rounded-2xl bg-[#151A24] border border-[#232A3B] p-2 shadow-2xl z-0 transform -rotate-12 opacity-80 hidden sm:block pointer-events-none">
                <img
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600"
                  alt="Deep Learning"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Floating Book 3 (Background Right Tilt) */}
              <div className="absolute -bottom-6 -right-6 sm:-right-8 w-44 sm:w-52 h-64 sm:h-72 rounded-2xl bg-[#151A24] border border-[#232A3B] p-2 shadow-2xl z-0 transform rotate-12 opacity-75 hidden sm:block pointer-events-none">
                <img
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"
                  alt="Atomic Habits"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Floating Pill Badge: Instant Access */}
              <div className="absolute -bottom-4 left-6 z-20 px-3.5 py-2 rounded-xl bg-[#151A24]/95 border border-[#FF4B4B]/40 shadow-xl backdrop-blur-md flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-white">⚡ Instant E-Book Reader</span>
              </div>

              {/* Floating Pill Badge: AI Assistant */}
              <div className="absolute -top-4 right-6 z-20 px-3.5 py-2 rounded-xl bg-[#151A24]/95 border border-[#8B5CF6]/40 shadow-xl backdrop-blur-md flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-xs font-bold text-white">AI Research Assistant</span>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Cinematic Bottom Fade Transition */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#080B12] to-transparent pointer-events-none" />

    </div>
  );
};

export default HeroSection;
