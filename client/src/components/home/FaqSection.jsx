import React, { useState } from 'react';
import { ChevronDown, Plus, Minus, HelpCircle } from 'lucide-react';
import { FAQS_DATA } from '../../data/libraryData.js';

export const FaqSection = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-4xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
          COMMON QUESTIONS
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-400">
          Everything you need to know about borrowing, e-books, and circulation policies.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQS_DATA.map((faq, idx) => {
          const isOpen = openIdx === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl bg-[#151A24] border border-[#232A3B] overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-white hover:text-[#FF4B4B] transition"
              >
                <span className="text-sm sm:text-base font-bold tracking-tight">
                  {faq.question}
                </span>
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-slate-300">
                  {isOpen ? <Minus className="w-4 h-4 text-[#FF4B4B]" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-[#232A3B]/60 pt-4 animate-in fade-in duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default FaqSection;
