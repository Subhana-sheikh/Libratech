import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import HeroSection from '../../components/home/HeroSection.jsx';
import BookCarouselRow from '../../components/books/BookCarouselRow.jsx';
import CategoryRow from '../../components/books/CategoryRow.jsx';
import EbooksShowcase from '../../components/home/EbooksShowcase.jsx';
import WhyLibratech from '../../components/home/WhyLibratech.jsx';
import HowItWorks from '../../components/home/HowItWorks.jsx';
import CommunitySection from '../../components/home/CommunitySection.jsx';
import FaqSection from '../../components/home/FaqSection.jsx';
import FinalCta from '../../components/home/FinalCta.jsx';
import BookDetailsModal from '../../components/books/BookDetailsModal.jsx';
import EbookReaderModal from '../../components/books/EbookReaderModal.jsx';
import { BOOKS_DATA } from '../../data/libraryData.js';

export const HomePage = () => {
  const navigate = useNavigate();

  const [allBooks, setAllBooks] = useState(BOOKS_DATA);
  const [selectedBook, setSelectedBook] = useState(null);
  const [readerBook, setReaderBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch real database books if available and merge with curated dataset
  useEffect(() => {
    const fetchApiBooks = async () => {
      try {
        const res = await api.get('/books', { limit: 20 });
        if (res.success && res.data && res.data.length > 0) {
          // Merge API books with local curated metadata (ratings, covers, etc.)
          const apiBooks = res.data.map((b, idx) => ({
            ...b,
            category: b.categoryId?.name || 'Computer Science',
            rating: b.rating || (4.8 + ((idx % 3) * 0.08)).toFixed(1),
            reviewCount: b.reviewCount || (850 + idx * 120),
            matchPercentage: b.matchPercentage || (95 + (idx % 5)),
            isEbook: true,
            badge: idx % 3 === 0 ? 'TRENDING' : idx % 3 === 1 ? 'POPULAR' : 'NEW ARRIVAL',
            progress: idx === 0 ? 74 : idx === 1 ? 42 : undefined,
            coverImageUrl: b.coverImageUrl || BOOKS_DATA[idx % BOOKS_DATA.length]?.coverImageUrl
          }));

          // Unique by ID / Title
          const existingTitles = new Set(apiBooks.map(b => b.title.toLowerCase()));
          const extraCurated = BOOKS_DATA.filter(b => !existingTitles.has(b.title.toLowerCase()));
          setAllBooks([...apiBooks, ...extraCurated]);
        }
      } catch (err) {
        // Fallback to BOOKS_DATA
        console.warn('API books fetch fallback to curated dataset:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApiBooks();
  }, []);

  // Filter collections for Netflix rows
  const trendingBooks = allBooks.filter(b => b.isTrending || b.badge === 'TRENDING' || b.badge === 'POPULAR').slice(0, 8);
  const recommendedBooks = allBooks.filter(b => b.isRecommended !== false).slice(2, 10);
  const recentlyAddedBooks = allBooks.filter(b => b.isRecentlyAdded || b.badge === 'NEW ARRIVAL' || b.publicationYear >= 2021).slice(0, 8);
  const continueReadingBooks = allBooks.filter(b => b.progress !== undefined && b.progress > 0).slice(0, 6);
  const editorsPicks = allBooks.filter(b => b.isEditorsPick || b.rating >= 4.9).slice(0, 8);

  const featuredEbook = allBooks.find(b => b.isEbook) || BOOKS_DATA[0];

  const handleOpenDetails = (book) => {
    setSelectedBook(book);
  };

  const handleOpenReader = (book) => {
    setReaderBook(book);
  };

  return (
    <div className="w-full bg-[#080B12] text-white overflow-hidden space-y-6 sm:space-y-10">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <HeroSection
        onExploreClick={() => navigate('/books')}
        stats={{
          books: '10,000+',
          readers: '2,500+',
          categories: '500+'
        }}
      />

      {/* 2. NETFLIX ROW: TRENDING THIS WEEK */}
      <BookCarouselRow
        title="Trending This Week"
        subtitle="The most borrowed and researched university texts across disciplines."
        badge="TOP CHARTS"
        books={trendingBooks.length > 0 ? trendingBooks : allBooks.slice(0, 6)}
        onOpenDetails={handleOpenDetails}
        onReadEbook={handleOpenReader}
      />

      {/* 3. NETFLIX ROW: RECOMMENDED FOR YOU */}
      <BookCarouselRow
        title="Recommended For You"
        subtitle="Handpicked for your next great read."
        badge="CURATED PICKS"
        books={recommendedBooks.length > 0 ? recommendedBooks : allBooks.slice(4, 10)}
        onOpenDetails={handleOpenDetails}
        onReadEbook={handleOpenReader}
      />

      {/* 4. EXPLORE BY CATEGORY */}
      <CategoryRow />

      {/* 5. NETFLIX ROW: CONTINUE READING (WITH READING PROGRESS BARS) */}
      {continueReadingBooks.length > 0 && (
        <BookCarouselRow
          title="Continue Reading"
          subtitle="Jump right back into your active chapter and bookmarks."
          badge="IN PROGRESS"
          books={continueReadingBooks}
          onOpenDetails={handleOpenDetails}
          onReadEbook={handleOpenReader}
          showProgress={true}
        />
      )}

      {/* 6. NETFLIX ROW: RECENTLY ADDED */}
      <BookCarouselRow
        title="Recently Added"
        subtitle="Fresh additions to the university catalogue with latest editions."
        badge="NEW ARRIVALS"
        books={recentlyAddedBooks.length > 0 ? recentlyAddedBooks : allBooks.slice(2, 8)}
        onOpenDetails={handleOpenDetails}
        onReadEbook={handleOpenReader}
      />

      {/* 7. DIGITAL E-BOOKS SHOWCASE */}
      <EbooksShowcase
        featuredEbook={featuredEbook}
        onOpenReader={handleOpenReader}
      />

      {/* 8. NETFLIX ROW: EDITOR'S PICKS */}
      <BookCarouselRow
        title="Editor's Picks"
        subtitle="Award-winning foundational monographs and enduring classics."
        badge="STAFF SELECTION"
        books={editorsPicks.length > 0 ? editorsPicks : allBooks.slice(1, 7)}
        onOpenDetails={handleOpenDetails}
        onReadEbook={handleOpenReader}
      />

      {/* 9. WHY LIBRATECH */}
      <WhyLibratech />

      {/* 10. HOW IT WORKS */}
      <HowItWorks />

      {/* 11. COMMUNITY SECTION */}
      <CommunitySection />

      {/* 12. FAQ SECTION */}
      <FaqSection />

      {/* 13. FINAL CALL TO ACTION */}
      <FinalCta />

      {/* Interactive Book Details Modal */}
      <BookDetailsModal
        isOpen={Boolean(selectedBook)}
        onClose={() => setSelectedBook(null)}
        book={selectedBook}
        onReadEbook={handleOpenReader}
        onSelectBook={handleOpenDetails}
        allBooks={allBooks}
      />

      {/* Interactive E-Book Reader Modal */}
      <EbookReaderModal
        isOpen={Boolean(readerBook)}
        onClose={() => setReaderBook(null)}
        book={readerBook}
      />

    </div>
  );
};

export default HomePage;
