import React, { useState, useEffect } from 'react';
import { Bookmark, BookOpen } from 'lucide-react';
import api from '../../services/api.js';
import BookCard from '../../components/books/BookCard.jsx';
import { BookCardSkeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export const StudentSavedPage = () => {
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await api.get('/books/saved');
      if (res.success) {
        setSavedBooks(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleSaveToggle = (bookId, isSaved) => {
    if (!isSaved) {
      setSavedBooks(prev => prev.filter(b => b._id !== bookId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Saved Reading List
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Books and research materials bookmarked for your future study.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : savedBooks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved books yet"
          description="Click the bookmark icon on any book in the catalogue to save it to your reading list."
          actionLabel="Browse Catalogue"
          onAction={() => window.location.href = '/books'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSavedPage;
