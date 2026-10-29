import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import NetflixBookCard from './NetflixBookCard.jsx';

export const BookCarouselRow = ({
  title,
  subtitle,
  badge,
  books = [],
  onOpenDetails,
  onReadEbook,
  onSaveToggle,
  showProgress = false
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -480 : 480;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  if (!books || books.length === 0) return null;

  return (
    <section className="relative space-y-4 py-4 group/row">
      
      {/* Row Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 px-4 sm:px-8 lg:px-12">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover/row:text-[#FF4B4B] transition-colors">
              {title}
            </h2>
            {badge && (
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#FF4B4B]/20 text-[#FF4B4B] border border-[#FF4B4B]/40">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Small count hint */}
        <span className="text-xs text-slate-500 hidden sm:inline">
          {books.length} titles
        </span>
      </div>

      {/* Horizontal Carousel Viewport */}
      <div className="relative">
        
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#080B12]/80 hover:bg-[#FF4B4B] border border-white/20 text-white flex items-center justify-center shadow-xl transition-all duration-300 backdrop-blur-md opacity-0 group-hover/row:opacity-100 disabled:opacity-0 disabled:pointer-events-none hover:scale-110`}
          title="Scroll Left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrolling Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-8 lg:px-12 py-2"
        >
          {books.map((book) => (
            <NetflixBookCard
              key={book._id}
              book={book}
              onOpenDetails={onOpenDetails}
              onReadEbook={onReadEbook}
              onSaveToggle={onSaveToggle}
              showProgress={showProgress}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#080B12]/80 hover:bg-[#FF4B4B] border border-white/20 text-white flex items-center justify-center shadow-xl transition-all duration-300 backdrop-blur-md opacity-0 group-hover/row:opacity-100 disabled:opacity-0 disabled:pointer-events-none hover:scale-110`}
          title="Scroll Right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>

    </section>
  );
};

export default BookCarouselRow;
