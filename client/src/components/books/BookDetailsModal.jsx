import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X, Star, BookOpen, Bookmark, ShieldCheck, CheckCircle2,
  Clock, MapPin, Hash, Building2, Calendar, Share2, Sparkles, ArrowRight,
  Barcode as BarcodeIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';

export const BookDetailsModal = ({
  isOpen,
  onClose,
  book,
  onReadEbook,
  onSelectBook,
  allBooks = []
}) => {
  if (!isOpen || !book) return null;

  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(book.isSaved || false);
  const [saving, setSaving] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);

  const isAvailable = (book.availableCopies ?? 0) > 0;
  const similarBooks = allBooks
    .filter(b => b._id !== book._id && (b.categorySlug === book.categorySlug || b.category === book.category))
    .slice(0, 3);

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/books/${book._id}/save`).catch(() => {});
        setIsSaved(false);
      } else {
        await api.post(`/books/${book._id}/save`).catch(() => {});
        setIsSaved(true);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBorrowRequest = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBorrowSuccess(true);
    setTimeout(() => {
      setBorrowSuccess(false);
      navigate(user.role === 'STUDENT' ? '/student/loans' : '/librarian/issue-return');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      
      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-4xl bg-[#151A24] border border-[#232A3B] rounded-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#080B12]/80 hover:bg-[#080B12] text-slate-300 hover:text-white border border-[#232A3B] transition shadow-lg cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner with ambient gradient */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-b from-[#1C2230] to-[#151A24]">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
            
            {/* Book Cover Image with Glow */}
            <div className="relative w-44 sm:w-52 shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src={book.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'}
                alt={book.title}
                className="w-full h-64 sm:h-72 object-cover"
              />
              {book.badge && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#FF4B4B] text-white shadow-md">
                  {book.badge}
                </span>
              )}
            </div>

            {/* Core Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/30">
                  {book.category || book.categoryId?.name || 'Academic Core'}
                </span>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{book.rating || 4.9}</span>
                  <span className="text-slate-400 text-[10px]">({book.reviewCount || 120})</span>
                </div>

                {book.matchPercentage && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                    {book.matchPercentage}% Match
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {book.title}
                </h2>
                <p className="text-sm font-medium text-slate-300 mt-1">
                  By {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
                </p>
              </div>

              {/* Status and Shelf Location Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold ${isAvailable ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
                  <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                  {isAvailable ? `${book.availableCopies} Copies Available on Shelf` : 'All Copies Currently Checked Out'}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-[#FF4B4B]" />
                  {book.shelfLocation || 'Main Campus Library Stacks'}
                </span>
              </div>

              {/* Action Buttons with High Contrast */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {book.isEbook && onReadEbook && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onReadEbook(book);
                    }}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF4B4B] to-[#E03E3E] hover:from-[#FF3333] hover:to-[#FF4B4B] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF4B4B]/35 hover:scale-[1.02] transition border border-white/20 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" /> Read E-Book Now
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleBorrowRequest}
                  disabled={!isAvailable && user?.role === 'STUDENT'}
                  className={`px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition border border-white/10 cursor-pointer ${
                    borrowSuccess
                      ? 'bg-emerald-600 text-white'
                      : isAvailable
                      ? 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/35'
                      : 'bg-white/10 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {borrowSuccess ? 'Borrow Requested!' : isAvailable ? 'Request Physical Copy' : 'Reserve Next Copy'}
                </button>

                <button
                  type="button"
                  onClick={handleToggleSave}
                  disabled={saving}
                  className={`px-4 py-3.5 rounded-xl border transition flex items-center gap-2 text-xs font-bold cursor-pointer ${
                    isSaved
                      ? 'bg-[#FF4B4B]/25 text-[#FF4B4B] border-[#FF4B4B]/50'
                      : 'bg-[#1E2538] hover:bg-[#28324C] text-white border-slate-600/80 shadow-md'
                  }`}
                  title={isSaved ? 'Saved to reading list' : 'Add to Wishlist'}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Content Tabs / Metadata Area */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Book Overview</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {book.description || 'Comprehensive university reference text covering foundational theory, design patterns, empirical methodologies, and industry applications.'}
            </p>
          </div>

          {/* Barcode & Circulation Identification Card */}
          <div className="p-4 rounded-2xl bg-[#0C101A] border border-[#232A3B] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-md">
                {/* Visual Barcode Graphic */}
                <div className="flex items-center gap-[2.5px] h-9 px-1">
                  {[2,1,3,1,2,3,1,2,1,3,2,1,2,3,1,2,1,3,2,1,3,1,2,3].map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-black h-full rounded-xs"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono font-bold text-black tracking-widest mt-0.5">
                  {book.barcode || book.isbn?.replace(/[^0-9]/g, '').slice(0, 10) || 'BC-LIB-101'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-[#FF4B4B] tracking-wider block">
                  Library Circulation Accession
                </span>
                <p className="text-xs font-bold text-white mt-0.5">
                  Barcode: <strong className="font-mono text-[#8B5CF6]">{book.barcode || 'BC-CAT-099'}</strong>
                </p>
                <p className="text-[11px] text-slate-400">
                  Scan at self-checkout or circulation desk to borrow physical copy.
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-300 font-mono px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
              ISBN-13: {book.isbn || '978-0134494166'}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-[#080B12] rounded-xl border border-[#232A3B]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Barcode / Code</span>
              <p className="font-mono font-bold text-emerald-400 mt-0.5">{book.barcode || 'BC-LIB-01'}</p>
            </div>

            <div className="p-3.5 bg-[#080B12] rounded-xl border border-[#232A3B]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Publisher</span>
              <p className="font-medium text-slate-200 mt-0.5 truncate">{book.publisher || 'Academic Press'}</p>
            </div>

            <div className="p-3.5 bg-[#080B12] rounded-xl border border-[#232A3B]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Published Year</span>
              <p className="font-bold text-slate-200 mt-0.5">{book.publicationYear || '2023'}</p>
            </div>

            <div className="p-3.5 bg-[#080B12] rounded-xl border border-[#232A3B]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Loan Limit</span>
              <p className="font-bold text-slate-200 mt-0.5">14 Calendar Days</p>
            </div>
          </div>

          {/* Similar Books Row */}
          {similarBooks.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF4B4B]" /> Similar In This Discipline
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarBooks.map(sim => (
                  <div
                    key={sim._id}
                    onClick={() => onSelectBook && onSelectBook(sim)}
                    className="p-3 bg-[#080B12] hover:bg-[#1C2230] border border-[#232A3B] hover:border-[#8B5CF6]/50 rounded-xl flex items-center gap-3 cursor-pointer transition group"
                  >
                    <img
                      src={sim.coverImageUrl}
                      alt={sim.title}
                      className="w-12 h-16 object-cover rounded-lg shrink-0 border border-white/10"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-[#FF4B4B] line-clamp-1 transition-colors">
                        {sim.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {Array.isArray(sim.authors) ? sim.authors[0] : sim.authors}
                      </p>
                      <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">
                        ★ {sim.rating || 4.9}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default BookDetailsModal;
