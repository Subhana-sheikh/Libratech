import React, { useState } from 'react';
import { Star, BookOpen, Bookmark, Eye, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';

export const NetflixBookCard = ({
  book,
  onOpenDetails,
  onReadEbook,
  onSaveToggle,
  showProgress = false
}) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(book.isSaved || false);
  const [saving, setSaving] = useState(false);

  const isAvailable = (book.availableCopies ?? 0) > 0;
  const isEbook = Boolean(book.isEbook);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || saving) return;

    setSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/books/${book._id}/save`).catch(() => {});
        setIsSaved(false);
        if (onSaveToggle) onSaveToggle(book._id, false);
      } else {
        await api.post(`/books/${book._id}/save`).catch(() => {});
        setIsSaved(true);
        if (onSaveToggle) onSaveToggle(book._id, true);
      }
    } finally {
      setSaving(false);
    }
  };

  const getBadgeColor = (b) => {
    switch (b) {
      case 'TRENDING': return 'bg-[#FF4B4B] text-white shadow-[#FF4B4B]/40';
      case 'POPULAR': return 'bg-[#8B5CF6] text-white shadow-[#8B5CF6]/40';
      case 'NEW ARRIVAL':
      case 'NEW': return 'bg-emerald-500 text-white shadow-emerald-500/40';
      case 'TOP PICK':
      case 'BESTSELLER': return 'bg-amber-500 text-black font-black shadow-amber-500/40';
      default: return 'bg-[#FF4B4B] text-white';
    }
  };

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(book)}
      className="relative flex-none w-52 sm:w-60 md:w-64 group cursor-pointer select-none transition-all duration-300 transform hover:-translate-y-2 hover:z-30"
    >
      {/* Outer Card Shell */}
      <div className="relative rounded-2xl bg-[#151A24] border border-[#232A3B] overflow-hidden shadow-lg group-hover:shadow-[0_12px_35px_rgba(255,75,75,0.25)] group-hover:border-[#FF4B4B]/50 transition-all duration-300">
        
        {/* Cover Image Container */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#0C101A]">
          <img
            src={book.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Dark cinematic gradient vignette on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#151A24] via-[#151A24]/60 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            {book.badge ? (
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-md ${getBadgeColor(book.badge)}`}>
                {book.badge}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-slate-300 backdrop-blur-md border border-white/10">
                {book.category || book.categoryId?.name || 'Academic'}
              </span>
            )}

            {/* Availability Badge */}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md border ${
              isAvailable
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}>
              {isAvailable ? `${book.availableCopies} Left` : 'Loaned'}
            </span>
          </div>

          {/* Bottom Card Overlay info */}
          <div className="absolute bottom-0 inset-x-0 p-4 z-10 flex flex-col justify-end space-y-2">
            
            {/* Category and Rating */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-[#FF4B4B] uppercase tracking-wider truncate max-w-[65%]">
                {book.category || book.categoryId?.name || 'General Core'}
              </span>
              <div className="flex items-center gap-1 text-amber-400 font-bold text-xs shrink-0">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{book.rating || 4.9}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-sm font-extrabold text-white leading-snug line-clamp-2 group-hover:text-[#FF4B4B] transition-colors">
              {book.title}
            </h3>

            {/* Author */}
            <p className="text-xs text-slate-400 truncate">
              {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
            </p>

            {/* Optional Reading Progress Bar for "Continue Reading" */}
            {showProgress && book.progress !== undefined && (
              <div className="pt-1 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium">
                  <span className="text-[#8B5CF6]">Reading Progress</span>
                  <span>{book.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6]"
                    style={{ width: `${book.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Quick Action Buttons - Always Prominent & Visible */}
            <div className="pt-2 flex items-center gap-2 opacity-100 transition-all duration-200">
              {isEbook && onReadEbook ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReadEbook(book);
                  }}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#FF4B4B] to-[#E03E3E] hover:from-[#FF3333] hover:to-[#FF4B4B] text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#FF4B4B]/35 border border-white/20 transition-all hover:scale-[1.02] cursor-pointer"
                  title="Open Digital Reader"
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" /> Read E-Book
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails && onOpenDetails(book);
                  }}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#8B5CF6]/35 border border-white/20 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 shrink-0" /> Quick View
                </button>
              )}

              {/* Details button if ebook button is showing */}
              {isEbook && onReadEbook && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails && onOpenDetails(book);
                  }}
                  className="p-2 rounded-xl bg-[#1E2538] hover:bg-[#28324C] text-slate-200 hover:text-white border border-slate-600/80 transition shadow-sm cursor-pointer"
                  title="View Book Details"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Bookmark Save Button */}
              {user && (
                <button
                  type="button"
                  onClick={handleToggleSave}
                  disabled={saving}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    isSaved
                      ? 'bg-[#FF4B4B]/25 text-[#FF4B4B] border-[#FF4B4B]/50'
                      : 'bg-[#1E2538] hover:bg-[#28324C] text-slate-200 border-slate-600/80'
                  }`}
                  title={isSaved ? 'Saved in reading list' : 'Add to Wishlist'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default NetflixBookCard;
