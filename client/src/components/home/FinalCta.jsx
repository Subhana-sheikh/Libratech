import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export const FinalCta = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FF4B4B]/20 via-[#151A24] to-[#8B5CF6]/25 border border-[#232A3B] p-10 sm:p-16 lg:p-20 text-center space-y-6 shadow-2xl">
        
        {/* Glow ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-[#FF4B4B]/25 to-[#8B5CF6]/25 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-black uppercase tracking-wider text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4B4B]" />
            <span>JOIN THOUSANDS OF READERS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Your Next Favorite Book Is Waiting.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Step into a smarter reading experience with Libratech. Borrow books with real-time stock tracking or read e-books instantly.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/register">
            <button className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#FF4B4B] via-[#E11D48] to-[#8B5CF6] hover:scale-105 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#FF4B4B]/35 flex items-center gap-2 transition-all">
              <span>Start Exploring Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>

          <Link to="/books">
            <button className="px-7 py-4 rounded-2xl bg-[#080B12] hover:bg-[#151A24] text-slate-200 hover:text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-[#232A3B] hover:border-white/20 transition flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              <span>Browse All Books</span>
            </button>
          </Link>
        </div>

      </div>

    </section>
  );
};

export default FinalCta;
