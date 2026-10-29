import React from 'react';
import { Search, ArrowLeftRight, BookOpen, Sparkles, Shield, Cpu } from 'lucide-react';

export const WhyLibratech = () => {
  const features = [
    {
      title: 'Smart Book Discovery',
      description: 'Find any title, author, subject, or ISBN with sub-millisecond debounced search and multi-facet disciplinary filters.',
      icon: Search,
      badge: 'INTELLIGENT SEARCH',
      accent: 'from-[#FF4B4B] to-[#E03E3E]'
    },
    {
      title: 'Easy Borrowing Management',
      description: 'Borrow with physical barcode accession codes, track calendar due dates, and experience zero double-return friction.',
      icon: ArrowLeftRight,
      badge: 'ATOMIC CIRCULATION',
      accent: 'from-[#8B5CF6] to-[#7C3AED]'
    },
    {
      title: 'Digital Reading Experience',
      description: 'Instant in-browser e-book reader with customizable typography, dark & sepia reading modes, and reading progress sync.',
      icon: BookOpen,
      badge: 'SEAMLESS E-READER',
      accent: 'from-[#06B6D4] to-[#0891B2]'
    },
    {
      title: 'Personalized Recommendations',
      description: 'Grounded algorithmic matching based on your real borrowing history, category preferences, and trending university texts.',
      icon: Sparkles,
      badge: 'ALGORITHMIC PICKS',
      accent: 'from-[#10B981] to-[#059669]'
    }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-12">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-[#FF4B4B]/15 text-[#FF4B4B] border border-[#FF4B4B]/30">
          WHY CHOOSE LIBRATECH
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Designed for the Modern Mind.
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Combining the cinematic discovery of Netflix with authoritative academic inventory management.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;

          return (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-[#151A24] border border-[#232A3B] hover:border-[#FF4B4B]/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.accent} flex items-center justify-center text-white shadow-lg shadow-black/40 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>

                <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block">
                  {feat.badge}
                </span>

                <h3 className="text-lg font-extrabold text-white group-hover:text-[#FF4B4B] transition-colors">
                  {feat.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#232A3B]/60 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold">Enterprise Grade</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default WhyLibratech;
