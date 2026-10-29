import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';

export const BookFilterBar = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories = [],
  availability,
  onAvailabilityChange,
  sort,
  onSortChange,
  onClearFilters
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const hasActiveFilters = search || (category && category !== 'all') || availability !== 'all' || sort !== 'newest';

  const suggestions = [
    'Distributed Systems',
    'Deep Learning',
    'Atomic Habits',
    'Clean Code',
    'Algorithms',
    'Python',
    'Startups'
  ];

  return (
    <div className="bg-[#151A24] rounded-3xl border border-[#232A3B] p-5 sm:p-6 shadow-2xl mb-8 space-y-5 text-white">
      
      {/* Top Search Input with Suggestions */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, author, ISBN, or topic..."
            value={search}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-10 py-3 text-sm bg-[#080B12] text-white rounded-2xl border border-[#232A3B] focus:outline-none focus:border-[#FF4B4B] transition-all placeholder:text-slate-500 shadow-inner"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Quick Suggestions Chips under Search on Focus */}
          {showSuggestions && !search && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2.5">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 text-[#FF4B4B]" /> Quick suggestions:
              </span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onSearchChange(s);
                    setShowSuggestions(false);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-[#FF4B4B]/20 hover:text-[#FF4B4B] text-slate-300 border border-white/5 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-bold text-[#FF4B4B] hover:text-[#FF6E6E] shrink-0 self-end sm:self-auto px-3 py-2 rounded-xl bg-[#FF4B4B]/10 border border-[#FF4B4B]/20 transition"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Categories & Sorting Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#232A3B]">
        
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 no-scrollbar">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
              (!category || category === 'all')
                ? 'bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6] text-white shadow-md shadow-[#FF4B4B]/30'
                : 'bg-[#080B12] text-slate-400 hover:text-white border border-[#232A3B]'
            }`}
          >
            All Disciplines
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id || cat.slug}
              onClick={() => onCategoryChange(cat.slug)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
                category === cat.slug
                  ? 'bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6] text-white shadow-md shadow-[#FF4B4B]/30'
                  : 'bg-[#080B12] text-slate-400 hover:text-white border border-[#232A3B]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Right: Availability & Sort Dropdowns */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          {/* Availability */}
          <select
            value={availability}
            onChange={(e) => onAvailabilityChange(e.target.value)}
            className="text-xs py-2 px-3 bg-[#080B12] border border-[#232A3B] rounded-xl text-slate-300 font-semibold focus:outline-none focus:border-[#FF4B4B]"
          >
            <option value="all">All Copies</option>
            <option value="available">In Stock Only</option>
            <option value="unavailable">Checked Out</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs py-2 px-3 bg-[#080B12] border border-[#232A3B] rounded-xl text-slate-300 font-semibold focus:outline-none focus:border-[#FF4B4B]"
          >
            <option value="newest">Newest Additions</option>
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="title">Title (A-Z)</option>
            <option value="author">Author (A-Z)</option>
          </select>
        </div>

      </div>

    </div>
  );
};

export default BookFilterBar;
