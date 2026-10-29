import React from 'react';
import { Search, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Discover Your Book',
      description: 'Explore curated horizontal carousels, filter by discipline, search keywords, and preview book synopses with one click.',
      icon: Search,
      glow: '#FF4B4B'
    },
    {
      step: '02',
      title: 'Borrow or Read Digitally',
      description: 'Access the instant digital E-Book Reader in your browser or reserve a physical copy for rapid barcode pickup at the desk.',
      icon: BookOpen,
      glow: '#8B5CF6'
    },
    {
      step: '03',
      title: 'Learn Something Amazing',
      description: 'Track reading progress, annotate reference chapters, manage loan due dates effortlessly, and elevate your intellect.',
      icon: GraduationCap,
      glow: '#10B981'
    }
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
          THREE SIMPLE STEPS
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          How Libratech Works
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          From discovery to mastery in just three seamless moments.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;

          return (
            <div
              key={idx}
              className="relative p-8 rounded-3xl bg-[#151A24] border border-[#232A3B] hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2 group shadow-xl"
            >
              {/* Step Number Watermark */}
              <span className="absolute top-4 right-6 text-5xl font-black text-white/5 font-mono select-none group-hover:text-white/10 transition-colors">
                {s.step}
              </span>

              <div className="space-y-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-300"
                  style={{ backgroundColor: `${s.glow}25`, border: `1px solid ${s.glow}` }}
                >
                  <Icon className="w-7 h-7" style={{ color: s.glow }} />
                </div>

                <h3 className="text-xl font-extrabold text-white group-hover:text-[#FF4B4B] transition-colors">
                  {s.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default HowItWorks;
