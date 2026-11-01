import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera, Search, X, CheckCircle, AlertCircle, ArrowRight,
  BookOpen, Sparkles, RefreshCw, Barcode as BarcodeIcon, ShieldCheck
} from 'lucide-react';
import { BOOKS_DATA } from '../../data/libraryData.js';

export const BarcodeModal = ({ isOpen, onClose, onOpenReader, onOpenDetails }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'manual' | 'camera'
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [resolvedBook, setResolvedBook] = useState(null);

  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setScanError(null);
    setIsScanning(true);
    try {
      const html5QrCode = new Html5Qrcode('camera-reader-viewport');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          stopCamera();
          lookupBarcode(decodedText);
        },
        () => {}
      );
    } catch (err) {
      console.warn('Camera scanner init issue:', err);
      setScanError('Camera permission not granted or device has no camera. Please enter barcode or click a demo sample below.');
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (e) {}
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  const handleClose = () => {
    stopCamera();
    setResolvedBook(null);
    setScanError(null);
    onClose();
  };

  const lookupBarcode = (code) => {
    const query = (code || manualCode).trim().toLowerCase();
    if (!query) return;

    // Search BOOKS_DATA by barcode, isbn, accession, or title snippet
    const matched = BOOKS_DATA.find(b =>
      (b.barcode && b.barcode.toLowerCase() === query) ||
      (b.isbn && b.isbn.toLowerCase().replace(/-/g, '') === query.replace(/-/g, '')) ||
      (b.barcode && b.barcode.toLowerCase().includes(query)) ||
      (b.isbn && b.isbn.toLowerCase().includes(query)) ||
      b.title.toLowerCase().includes(query)
    );

    if (matched) {
      setResolvedBook(matched);
      setScanError(null);
    } else {
      setResolvedBook(null);
      setScanError(`No book found matching code "${code || manualCode}". Try clicking one of the sample barcodes below.`);
    }
  };

  const demoCodes = [
    { label: 'Data Science (Pandas)', code: 'BC-DS-101', category: 'Data Science' },
    { label: 'Machine Learning', code: 'BC-DS-102', category: 'Data Science' },
    { label: 'Full-Stack React', code: 'BC-WD-201', category: 'Web Development' },
    { label: 'Steve Jobs Bio', code: 'BC-BIO-301', category: 'Biography' },
    { label: 'Human Physiology', code: 'BC-MED-401', category: 'Physiology' },
    { label: 'Thinking Fast & Slow', code: 'BC-PSY-501', category: 'Psychology' },
    { label: 'Designing Data-Intensive', code: 'BC-CS-001', category: 'Computer Science' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#151A24] border border-[#232A3B] rounded-3xl shadow-2xl overflow-hidden my-auto text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#1C2230] to-[#151A24] border-b border-[#232A3B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4B4B] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-[#FF4B4B]/20">
              <BarcodeIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Library Barcode & ISBN Scanner
              </h3>
              <p className="text-xs text-slate-400">
                Instantly scan or lookup university catalogue books by barcode
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#232A3B] px-6 bg-[#0E131F]/60 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('demo'); stopCamera(); }}
            className={`py-3 px-4 border-b-2 transition ${activeTab === 'demo' ? 'border-[#FF4B4B] text-white font-black' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            ⚡ Quick Sample Barcodes
          </button>
          <button
            onClick={() => { setActiveTab('manual'); stopCamera(); }}
            className={`py-3 px-4 border-b-2 transition ${activeTab === 'manual' ? 'border-[#FF4B4B] text-white font-black' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            🔍 Manual Code Search
          </button>
          <button
            onClick={() => { setActiveTab('camera'); startCamera(); }}
            className={`py-3 px-4 border-b-2 transition ${activeTab === 'camera' ? 'border-[#FF4B4B] text-white font-black' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            📷 Live Camera Scanner
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {scanError && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{scanError}</span>
            </div>
          )}

          {/* TAB 1: DEMO SAMPLE BARCODES */}
          {activeTab === 'demo' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 font-medium">
                Click any real catalogue barcode below to test instant book lookup:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {demoCodes.map((d) => (
                  <button
                    key={d.code}
                    onClick={() => lookupBarcode(d.code)}
                    className="p-3 rounded-2xl bg-[#1C2230] hover:bg-[#252E42] border border-[#2B354C] hover:border-[#FF4B4B]/60 text-left transition flex items-center justify-between group shadow-sm"
                  >
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-[#FF4B4B] transition-colors">
                        {d.label}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 inline-block">
                        Barcode: {d.code}
                      </span>
                    </div>
                    <span className="px-2 py-1 rounded bg-[#FF4B4B]/15 text-[#FF4B4B] text-[10px] font-black group-hover:bg-[#FF4B4B] group-hover:text-white transition">
                      Scan →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL ENTRY */}
          {activeTab === 'manual' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                lookupBarcode(manualCode);
              }}
              className="space-y-3"
            >
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Enter Barcode, Accession Number, or ISBN-13
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. BC-DS-101 or 978-1098104030"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#080B12] border border-[#232A3B] focus:border-[#FF4B4B] text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF4B4B] to-[#E03E3E] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF4B4B]/30 hover:scale-[1.02] transition"
                >
                  Lookup
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CAMERA SCANNER */}
          {activeTab === 'camera' && (
            <div className="bg-[#080B12] rounded-2xl p-4 border border-[#232A3B] flex flex-col items-center justify-center min-h-[220px]">
              <div id="camera-reader-viewport" className="w-full max-w-sm rounded-xl overflow-hidden" />
              {!isScanning && (
                <button
                  onClick={startCamera}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-[#FF4B4B] text-white font-bold text-xs uppercase tracking-wider"
                >
                  Restart Camera
                </button>
              )}
            </div>
          )}

          {/* RESOLVED BOOK RESULT */}
          {resolvedBook && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1C2230] to-[#171D2B] border border-[#FF4B4B]/40 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#232A3B]">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verified Catalogue Book Matched</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  {resolvedBook.barcode || resolvedBook.isbn}
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <img
                  src={resolvedBook.coverImageUrl}
                  alt={resolvedBook.title}
                  className="w-16 h-24 object-cover rounded-xl shadow-md border border-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase text-[#FF4B4B]">
                    {resolvedBook.category}
                  </span>
                  <h4 className="text-sm font-extrabold text-white truncate">
                    {resolvedBook.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    By {Array.isArray(resolvedBook.authors) ? resolvedBook.authors.join(', ') : resolvedBook.authors}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    📍 Location: <strong className="text-white">{resolvedBook.shelfLocation || 'Main Stack CS-01'}</strong> ·{' '}
                    <strong className="text-emerald-400">{resolvedBook.availableCopies} Copies Available</strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons for Scanned Book */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                {onOpenReader && resolvedBook.isEbook && (
                  <button
                    onClick={() => {
                      handleClose();
                      onOpenReader(resolvedBook);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF4B4B] to-[#E03E3E] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#FF4B4B]/35 hover:scale-[1.02] transition"
                  >
                    <BookOpen className="w-4 h-4" /> Read E-Book Now
                  </button>
                )}

                {onOpenDetails && (
                  <button
                    onClick={() => {
                      handleClose();
                      onOpenDetails(resolvedBook);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-[#1E2538] hover:bg-[#28324C] text-white font-bold text-xs uppercase tracking-wider border border-slate-600 transition"
                  >
                    Full Book Details
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BarcodeModal;

