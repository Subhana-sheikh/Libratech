import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Bookmark, ArrowLeft, CheckCircle2, AlertCircle,
  Building, Calendar, Globe, Hash, Layers, ShieldCheck, Star, MapPin, Sparkles
} from 'lucide-react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import EbookReaderModal from '../../components/books/EbookReaderModal.jsx';
import NetflixBookCard from '../../components/books/NetflixBookCard.jsx';
import { BOOKS_DATA } from '../../data/libraryData.js';

export const BookDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);

  const fetchBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/books/${id}`);
      if (res.success && res.data) {
        setBook(res.data);
        setIsSaved(res.data.isSaved || false);
      } else {
        // Fallback to BOOKS_DATA lookup
        const found = BOOKS_DATA.find(b => b._id === id);
        if (found) {
          setBook(found);
          setIsSaved(found.isSaved || false);
        } else {
          throw new Error('Book record not found');
        }
      }
    } catch (err) {
      // Fallback
      const found = BOOKS_DATA.find(b => b._id === id);
      if (found) {
        setBook(found);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    window.scrollTo(0, 0);
  }, [id]);

  const handleToggleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/books/${id}/save`).catch(() => {});
        setIsSaved(false);
      } else {
        await api.post(`/books/${id}/save`).catch(() => {});
        setIsSaved(true);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-8">
        <div className="w-28 h-6 bg-[#151A24] rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-96 rounded-3xl bg-[#151A24] animate-pulse" />
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 w-3/4 bg-[#151A24] rounded-xl animate-pulse" />
            <div className="h-5 w-1/2 bg-[#151A24] rounded-xl animate-pulse" />
            <div className="h-40 bg-[#151A24] rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="text-center py-20 space-y-4 max-w-md mx-auto text-white">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white">Book Not Available</h3>
        <p className="text-xs text-slate-400">{error || 'The requested catalogue record could not be found.'}</p>
        <Link to="/books">
          <button className="px-5 py-2.5 rounded-xl bg-[#FF4B4B] text-white text-xs font-bold uppercase tracking-wider">
            Back to Catalogue
          </button>
        </Link>
      </div>
    );
  }

  const isAvailable = (book.availableCopies ?? 0) > 0;

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-6 text-white">
      
      {/* Back button */}
      <div>
        <Link
          to="/books"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#FF4B4B] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </Link>
      </div>

      {/* Main Book Detail Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
        
        {/* Cover Column */}
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-[#151A24] border border-[#232A3B] shadow-2xl aspect-[3/4] flex items-center justify-center group">
            <img
              src={book.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${
                isAvailable ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}>
                {isAvailable ? `${book.availableCopies} available` : 'Loaned Out'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5">
            <button
              onClick={() => setReaderOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4B4B] to-[#E03E3E] hover:from-[#FF3333] hover:to-[#FF4B4B] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF4B4B]/30 hover:scale-[1.02] transition"
            >
              <BookOpen className="w-4 h-4" /> Read E-Book in Browser
            </button>

            <button
              onClick={handleToggleSave}
              disabled={saving}
              className={`w-full py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                isSaved
                  ? 'bg-[#FF4B4B]/20 text-[#FF4B4B] border-[#FF4B4B]/40'
                  : 'bg-[#151A24] hover:bg-[#1E2535] text-slate-300 border-[#232A3B]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-[#FF4B4B]' : ''}`} />
              <span>{isSaved ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>

            <div className="p-3 bg-[#151A24] rounded-2xl border border-[#232A3B] text-[11px] text-slate-400 text-center">
              Physical copies are issued at the central desk via instant barcode scanning.
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/30">
                {book.category || book.categoryId?.name || 'Academic Core'}
              </span>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{book.rating || 4.9}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              {book.title}
            </h1>

            <p className="text-sm font-medium text-slate-300 mt-2">
              By <span className="text-white font-bold">{Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</span>
            </p>
          </div>

          {/* Stock status callout */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isAvailable ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center gap-3">
              {isAvailable ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <div>
                <p className="text-xs font-bold">
                  {isAvailable
                    ? `${book.availableCopies} of ${book.totalCopies} copies ready for checkout`
                    : 'All physical copies currently checked out'}
                </p>
                <p className="text-[11px] opacity-80 mt-0.5">
                  Shelf Location: {book.shelfLocation || 'Main Campus Library Stacks'}
                </p>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Description & Summary
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {book.description || 'Comprehensive university reference text covering foundational theory, design patterns, empirical methodologies, and industry applications.'}
            </p>
          </div>

          {/* Metadata Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 bg-[#151A24] rounded-2xl border border-[#232A3B]">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">ISBN</span>
              <span className="font-mono font-bold text-slate-200 mt-0.5 block">{book.isbn || '978-0134494166'}</span>
            </div>

            <div className="p-3.5 bg-[#151A24] rounded-2xl border border-[#232A3B]">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Publisher</span>
              <span className="font-semibold text-slate-200 mt-0.5 truncate block">{book.publisher || 'Academic Press'}</span>
            </div>

            <div className="p-3.5 bg-[#151A24] rounded-2xl border border-[#232A3B]">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Published Year</span>
              <span className="font-bold text-slate-200 mt-0.5 block">{book.publicationYear || '2023'}</span>
            </div>
          </div>

          {/* Subjects */}
          {book.subjects && book.subjects.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Subjects & Keywords
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {book.subjects.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-[#151A24] text-slate-300 px-3 py-1 rounded-xl border border-[#232A3B]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Interactive Ebook Reader Modal */}
      <EbookReaderModal
        isOpen={readerOpen}
        onClose={() => setReaderOpen(false)}
        book={book}
      />

    </div>
  );
};

export default BookDetailPage;
