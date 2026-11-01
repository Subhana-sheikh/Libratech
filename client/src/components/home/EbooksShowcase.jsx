import React from 'react';
import { BookOpen, Sparkles, Moon, Type, Smartphone, Check, ArrowRight } from 'lucide-react';

export const EbooksShowcase = ({ onOpenReader, featuredEbook }) => {
  return (
    <section id="ebooks" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#151A24] via-[#0E121B] to-[#151A24] border border-[#232A3B] p-8 sm:p-12 lg:p-16 shadow-2xl">
        
        {/* Glow ambient effects */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#FF4B4B]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#8B5CF6]/25 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text & Benefits */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-xs font-black uppercase tracking-wider text-[#A78BFA]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DIGITAL READING ROOM</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Instant E-Books.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6]">
                Zero Waiting.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Immerse yourself in textbooks and papers directly in your browser. Customize font sizing, toggle between night, sepia, and light reading themes, and pick up right where you left off across any device.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <Moon className="w-4 h-4 text-[#8B5CF6]" />
                <span className="font-semibold">OLED Dark & Sepia Modes</span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <Type className="w-4 h-4 text-[#FF4B4B]" />
                <span className="font-semibold">Fluid Typography Sizing</span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">Mobile & Tablet Optimized</span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">Interactive Table of Contents</span>
              </div>
            </div>

            {/* Button */}
            {featuredEbook && onOpenReader && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenReader(featuredEbook)}
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#FF4B4B] via-[#E11D48] to-[#FF3333] hover:from-[#FF3333] hover:to-[#FF4B4B] text-white font-black text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-[#FF4B4B]/35 hover:scale-105 transition border border-white/20 cursor-pointer"
                >
                  <BookOpen className="w-5 h-5 text-white" />
                  <span>Launch Live E-Book Reader Demo</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Right Visual: Reader Preview Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-[#080B12] border border-[#232A3B] p-5 shadow-2xl space-y-4">
              
              {/* Window Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-[#232A3B]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF4B4B]" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[11px] font-mono text-slate-400">reader.libratech.edu</span>
              </div>

              {/* Reader Mockup Text */}
              <div className="space-y-3 font-serif text-xs text-slate-300 leading-relaxed p-2 select-none">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#FF4B4B] block">
                  Chapter 1 • Foundations
                </span>
                <h4 className="font-sans text-base font-extrabold text-white">
                  {featuredEbook?.title || 'Designing Data-Intensive Applications'}
                </h4>
                <p className="line-clamp-4 text-slate-400">
                  Data models are the core abstraction upon which modern software is constructed. By decomposing monolithic layers into reliable, scalable distributed nodes, we unlock fault-tolerant computation across global clusters.
                </p>
                <div className="pt-2 flex items-center justify-between font-sans text-[10px] text-slate-500 border-t border-[#232A3B]">
                  <span>Progress: 74%</span>
                  <span className="text-emerald-400">Reading in Dark Mode</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

export default EbooksShowcase;
