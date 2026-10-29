import React from 'react';
import { Star, Quote, Heart } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../../data/libraryData.js';

export const CommunitySection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-[#FF4B4B]/15 text-[#FF4B4B] border border-[#FF4B4B]/30">
          STUDENT & SCHOLAR VOICES
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          A Community That Loves Knowledge
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          Over 2,500 students, researchers, and faculty members read, study, and research daily on Libratech.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {TESTIMONIALS_DATA.map((t) => (
          <div
            key={t.id}
            className="p-7 rounded-3xl bg-[#151A24] border border-[#232A3B] hover:border-[#8B5CF6]/50 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between space-y-6 shadow-xl"
          >
            <div className="space-y-4">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "{t.text}"
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#232A3B]">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border border-[#FF4B4B]/40"
              />
              <div>
                <h4 className="text-sm font-extrabold text-white">{t.name}</h4>
                <p className="text-[11px] text-slate-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default CommunitySection;
