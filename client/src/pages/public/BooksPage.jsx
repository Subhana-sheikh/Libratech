import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api.js';
import NetflixBookCard from '../../components/books/NetflixBookCard.jsx';
import BookFilterBar from '../../components/books/BookFilterBar.jsx';
import BookDetailsModal from '../../components/books/BookDetailsModal.jsx';
import EbookReaderModal from '../../components/books/EbookReaderModal.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { BOOKS_DATA, CATEGORIES_DATA } from '../../data/libraryData.js';
import { BookOpen, Sparkles } from 'lucide-react';

export const BooksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [availability, setAvailability] = useState(searchParams.get('availability') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [books, setBooks] = useState(BOOKS_DATA);
  const [categories, setCategories] = useState(CATEGORIES_DATA);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: BOOKS_DATA.length });
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedBook, setSelectedBook] = useState(null);
  const [readerBook, setReaderBook] = useState(null);

  // Sync state with URL params
  useEffect(() => {
    const s = searchParams.get('search') || '';
    const c = searchParams.get('category') || 'all';
    const a = searchParams.get('availability') || 'all';
    const so = searchParams.get('sort') || 'newest';
    const p = parseInt(searchParams.get('page') || '1', 10);

    setSearch(s);
    setCategory(c);
    setAvailability(a);
    setSort(so);
    setPage(p);
  }, [searchParams]);

  // Load API categories
  useEffect(() => {
    api.get('/categories')
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch books with debounced search
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    const timer = setTimeout(() => {
      api.get('/books', {
        search,
        category: category !== 'all' ? category : '',
        availability,
        sort,
        page,
        limit: 12
      })
        .then(res => {
          if (!isCancelled && res.success && res.data && res.data.length > 0) {
            const apiMapped = res.data.map((b, idx) => ({
              ...b,
              category: b.categoryId?.name || 'Academic Core',
              rating: b.rating || (4.8 + ((idx % 3) * 0.08)).toFixed(1),
              reviewCount: b.reviewCount || (800 + idx * 100),
              isEbook: true,
              badge: idx % 3 === 0 ? 'TRENDING' : idx % 3 === 1 ? 'POPULAR' : 'NEW ARRIVAL',
              coverImageUrl: b.coverImageUrl || BOOKS_DATA[idx % BOOKS_DATA.length]?.coverImageUrl
            }));
            setBooks(apiMapped);
            if (res.pagination) setPagination(res.pagination);
          } else if (!isCancelled) {
            // Local client-side search & filtering fallback on BOOKS_DATA
            let filtered = [...BOOKS_DATA];
            if (search.trim()) {
              const q = search.toLowerCase();
              filtered = filtered.filter(b =>
                b.title.toLowerCase().includes(q) ||
                b.authors.some(a => a.toLowerCase().includes(q)) ||
                b.isbn.toLowerCase().includes(q) ||
                (b.barcode && b.barcode.toLowerCase().includes(q)) ||
                b.description.toLowerCase().includes(q)
              );
            }
            if (category && category !== 'all') {
              filtered = filtered.filter(b => b.categorySlug === category);
            }
            if (availability === 'available') {
              filtered = filtered.filter(b => b.availableCopies > 0);
            } else if (availability === 'unavailable') {
              filtered = filtered.filter(b => b.availableCopies <= 0);
            }
            setBooks(filtered);
            setPagination({ page: 1, pages: 1, total: filtered.length });
          }
        })
        .catch(() => {
          // Fallback to local filtering
          let filtered = [...BOOKS_DATA];
          if (search.trim()) {
            const q = search.toLowerCase();
            filtered = filtered.filter(b =>
              b.title.toLowerCase().includes(q) ||
              b.authors.some(a => a.toLowerCase().includes(q)) ||
              b.isbn.toLowerCase().includes(q) ||
              (b.barcode && b.barcode.toLowerCase().includes(q)) ||
              b.description.toLowerCase().includes(q)
            );
          }
          if (category && category !== 'all') {
            filtered = filtered.filter(b => b.categorySlug === category);
          }
          setBooks(filtered);
          setPagination({ page: 1, pages: 1, total: filtered.length });
        })
        .finally(() => {
          if (!isCancelled) setLoading(false);
        });
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [search, category, availability, sort, page]);

  const updateParam = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'all') {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.set('page', '1');
      setPage(1);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('all');
    setAvailability('all');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="space-y-8 py-6 text-white min-h-[85vh]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF4B4B] animate-pulse" />
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Catalogue Explorer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search across textbooks, research monographs, and digital e-books.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-400">
          Showing <span className="text-white">{books.length}</span> results
        </div>
      </div>

      {/* Filter Bar */}
      <BookFilterBar
        search={search}
        onSearchChange={(val) => updateParam('search', val)}
        category={category}
        onCategoryChange={(val) => updateParam('category', val)}
        categories={categories}
        availability={availability}
        onAvailabilityChange={(val) => updateParam('availability', val)}
        sort={sort}
        onSortChange={(val) => updateParam('sort', val)}
        onClearFilters={handleClearFilters}
      />

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-[#151A24] border border-[#232A3B] animate-pulse" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#151A24] border border-[#232A3B] space-y-4 max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Books Found</h3>
          <p className="text-xs text-slate-400">
            We couldn't find any books matching "{search}". Try searching another title, author, or reset the filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 rounded-xl bg-[#FF4B4B] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF4B4B]/30"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <NetflixBookCard
              key={book._id}
              book={book}
              onOpenDetails={(b) => setSelectedBook(b)}
              onReadEbook={(b) => setReaderBook(b)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(p) => updateParam('page', String(p))}
          />
        </div>
      )}

      {/* Interactive Details Modal */}
      <BookDetailsModal
        isOpen={Boolean(selectedBook)}
        onClose={() => setSelectedBook(null)}
        book={selectedBook}
        onReadEbook={(b) => setReaderBook(b)}
        onSelectBook={(b) => setSelectedBook(b)}
        allBooks={books}
      />

      {/* Interactive Ebook Reader Modal */}
      <EbookReaderModal
        isOpen={Boolean(readerBook)}
        onClose={() => setReaderBook(null)}
        book={readerBook}
      />

    </div>
  );
};

export default BooksPage;
