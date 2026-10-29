import React, { useState, useEffect } from 'react';
import { Sparkles, Info } from 'lucide-react';
import api from '../../services/api.js';
import BookCard from '../../components/books/BookCard.jsx';
import { BookCardSkeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Alert from '../../components/ui/Alert.jsx';

export const StudentRecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/books/recommendations')
      .then(res => {
        if (res.success) setRecommendations(res.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-[#8B5CF6]" />
          Recommended for You
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Personalized titles selected based on your discipline, saved reading list, and circulation popularity.
        </p>
      </div>

      <Alert type="info">
        Recommendations match your borrowed and saved subjects with high-demand academic texts from the library collection.
      </Alert>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No recommendations yet"
          description="Borrow or save books to help tailor recommendations to your academic interests."
          actionLabel="Explore Catalogue"
          onAction={() => window.location.href = '/books'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentRecommendationsPage;
