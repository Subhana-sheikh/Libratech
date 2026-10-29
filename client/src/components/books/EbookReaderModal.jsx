import React, { useState, useEffect } from 'react';
import {
  X, BookOpen, ChevronLeft, ChevronRight, Sun, Moon,
  Type, List, Bookmark, CheckCircle2, Maximize2, Minimize2
} from 'lucide-react';

export const EbookReaderModal = ({ isOpen, onClose, book, initialChapter = 0 }) => {
  if (!isOpen || !book) return null;

  const [currentChapterIdx, setCurrentChapterIdx] = useState(initialChapter);
  const [fontSize, setFontSize] = useState(18); // px
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light' | 'sepia'
  const [tocOpen, setTocOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chapters = book.ebookContent && book.ebookContent.length > 0
    ? book.ebookContent
    : [
        {
          title: 'Introduction & Core Fundamentals',
          content: `${book.description}\n\nWelcome to the digital edition of "${book.title}" by ${Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}. This interactive reader provides instantaneous access to reference materials, curated study summaries, and core chapters.`
        },
        {
          title: 'Chapter 1: Foundational Theory & Methodology',
          content: `In modern technical inquiry, understanding underlying systems architecture and primary principles is essential. As readers explore this volume, key abstractions are deconstructed into practical patterns.\n\nWhether focusing on computational complexity, statistical modeling, or domain architectures, systematic study allows students and researchers to build durable, scalable mastery.`
        }
      ];

  const currentChapter = chapters[currentChapterIdx] || chapters[0];
  const progressPercent = Math.round(((currentChapterIdx + 1) / chapters.length) * 100);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentChapterIdx < chapters.length - 1) {
        setCurrentChapterIdx(prev => prev + 1);
      }
      if (e.key === 'ArrowLeft' && currentChapterIdx > 0) {
        setCurrentChapterIdx(prev => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapterIdx, chapters.length, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const themeStyles = {
    dark: 'bg-[#080B12] text-slate-200 border-[#232A3B]',
    sepia: 'bg-[#FBF0D9] text-[#5F4B32] border-[#E8D4B4]',
    light: 'bg-[#FFFFFF] text-slate-800 border-slate-200'
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Top Reader Bar */}
      <header className="h-16 px-4 sm:px-8 border-b border-white/10 bg-[#080B12]/95 backdrop-blur-md flex items-center justify-between text-white select-none">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
            title="Exit Reader"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {book.title}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
            </p>
          </div>
        </div>

        {/* Reader Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Table of Contents button */}
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className={`p-2 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold ${tocOpen ? 'bg-[#FF4B4B] text-white' : 'bg-white/5 hover:bg-white/10 text-slate-300'}`}
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Contents</span>
          </button>

          {/* Font Size decrease / increase */}
          <div className="hidden sm:flex items-center bg-white/5 rounded-xl border border-white/10 p-1">
            <button
              onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
              className="px-2 py-1 text-xs font-bold text-slate-300 hover:text-white rounded hover:bg-white/10"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-[11px] font-mono text-slate-400 px-1.5">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
              className="px-2 py-1 text-xs font-bold text-slate-300 hover:text-white rounded hover:bg-white/10"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-1">
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg transition ${theme === 'dark' ? 'bg-[#151A24] text-[#FF4B4B]' : 'text-slate-400 hover:text-white'}`}
              title="Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${theme === 'sepia' ? 'bg-[#FBF0D9] text-[#5F4B32]' : 'text-slate-400 hover:text-white'}`}
              title="Sepia Theme"
            >
              S
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-lg transition ${theme === 'light' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
              title="Light Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition hidden md:flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Reading Canvas */}
      <div className="flex-1 relative overflow-hidden flex">
        
        {/* Table of Contents Drawer */}
        {tocOpen && (
          <aside className="w-72 bg-[#0C101A] border-r border-white/10 p-5 overflow-y-auto shrink-0 animate-in slide-in-from-left duration-200 z-20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Table of Contents</span>
              <button onClick={() => setTocOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentChapterIdx(idx);
                    setTocOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium transition ${
                    currentChapterIdx === idx
                      ? 'bg-[#FF4B4B]/15 text-[#FF4B4B] border border-[#FF4B4B]/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <p className="line-clamp-2">{ch.title}</p>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Content Container */}
        <main className={`flex-1 overflow-y-auto px-6 sm:px-16 lg:px-32 py-12 transition-colors duration-200 ${themeStyles[theme]}`}>
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Chapter Header */}
            <div className="space-y-2 pb-6 border-b border-current opacity-20">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF4B4B]">
                Chapter {currentChapterIdx + 1} of {chapters.length}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {currentChapter.title}
              </h1>
            </div>

            {/* Reading Text */}
            <div
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
              className="space-y-6 font-serif whitespace-pre-line tracking-normal select-text"
            >
              {currentChapter.content}
            </div>

            {/* Bottom Chapter Navigation */}
            <div className="pt-12 border-t border-current opacity-20 flex items-center justify-between gap-4">
              <button
                disabled={currentChapterIdx === 0}
                onClick={() => setCurrentChapterIdx(prev => prev - 1)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Chapter
              </button>

              <span className="text-xs font-sans opacity-60">
                {progressPercent}% completed
              </span>

              <button
                disabled={currentChapterIdx === chapters.length - 1}
                onClick={() => setCurrentChapterIdx(prev => prev + 1)}
                className="px-4 py-2.5 rounded-xl bg-[#FF4B4B] hover:bg-[#FF3333] disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-[#FF4B4B]/20"
              >
                Next Chapter <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Progress Bar */}
      <footer className="h-2 bg-white/5 relative">
        <div
          className="h-full bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </footer>

    </div>
  );
};

export default EbookReaderModal;
