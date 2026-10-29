import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight, BookOpen } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';

export const BookCard = ({ book, onSaveToggle }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(book.isSaved || false);
  const [saving, setSaving] = useState(false);

  const isAvailable = book.availableCopies > 0;

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || saving) return;

    setSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/books/${book._id}/save`);
        setIsSaved(false);
        if (onSaveToggle) onSaveToggle(book._id, false);
      } else {
        await api.post(`/books/${book._id}/save`);
        setIsSaved(true);
        if (onSaveToggle) onSaveToggle(book._id, true);
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Book Cover Thumbnail Area */}
        <div className="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center">
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-slate-100 text-indigo-700">
              <BookOpen className="w-10 h-10 opacity-40 mb-2" />
              <span className="text-xl font-bold tracking-wider">
                {book.title.substring(0, 3).toUpperCase()}
              </span>
            </div>
          )}

          {/* Availability status overlay */}
          <div className="absolute top-3 left-3">
            <Badge
              variant={isAvailable ? 'success' : 'danger'}
              size="sm"
              dot
              className="bg-white/95 backdrop-blur-xs shadow-xs"
            >
              {isAvailable ? `${book.availableCopies} in stock` : 'Out of stock'}
            </Badge>
          </div>

          {/* Bookmark Button */}
          {user && (
            <button
              onClick={handleToggleSave}
              disabled={saving}
              className={`
                absolute top-3 right-3 p-2 rounded-xl transition-all shadow-xs
                ${isSaved
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/95 backdrop-blur-xs text-slate-500 hover:text-indigo-600 hover:bg-white'
                }
              `}
              title={isSaved ? 'Saved in reading list' : 'Save for later'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5">
          <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider mb-1 truncate">
            {book.categoryId?.name || 'General'}
          </p>

          <Link to={`/books/${book._id}`}>
            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 line-clamp-1 transition-colors">
              {book.title}
            </h4>
          </Link>

          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            by {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
          </p>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {book.description || 'No summary provided.'}
          </p>
        </div>
      </div>

      {/* Footer info & CTA */}
      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          <strong className="text-slate-800">{book.totalCopies}</strong> total copies
        </span>

        <Link
          to={`/books/${book._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:gap-1.5 transition-all"
        >
          View details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
