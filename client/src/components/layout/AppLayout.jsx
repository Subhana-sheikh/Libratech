import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import MobileNav from './MobileNav.jsx';
import Footer from './Footer.jsx';
import AssistantChatDrawer from '../assistant/AssistantChatDrawer.jsx';
import WelcomeGatewayModal from '../common/WelcomeGatewayModal.jsx';
import BarcodeModal from '../circulation/BarcodeModal.jsx';
import EbookReaderModal from '../books/EbookReaderModal.jsx';
import BookDetailsModal from '../books/BookDetailsModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const AppLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [readerBook, setReaderBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const isHome = location.pathname === '/';

  // Show Welcome Gateway Modal once per browser session if not signed in
  useEffect(() => {
    const prompted = sessionStorage.getItem('libratech_welcome_prompted');
    if (!user && !prompted) {
      // Small timeout so user sees the page render first
      const t = setTimeout(() => {
        setWelcomeModalOpen(true);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [user]);

  const handleCloseWelcome = () => {
    sessionStorage.setItem('libratech_welcome_prompted', 'true');
    setWelcomeModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B12] text-slate-100 w-full max-w-full overflow-x-hidden">
      <Navbar
        onToggleMobileMenu={() => setMobileNavOpen(true)}
        onToggleAssistant={() => setAssistantOpen(true)}
        onOpenBarcode={() => setBarcodeModalOpen(true)}
        onOpenWelcome={() => setWelcomeModalOpen(true)}
      />

      {isHome ? (
        <main className="flex-1 w-full min-w-0">
          <Outlet />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto min-w-0 overflow-hidden">
          <Sidebar />
          <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-7 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      )}

      <Footer />

      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <AssistantChatDrawer isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />

      {/* Global Welcome / Role Gateway Modal */}
      <WelcomeGatewayModal
        isOpen={welcomeModalOpen}
        onClose={handleCloseWelcome}
      />

      {/* Global Universal Barcode Scanner & Lookup Modal */}
      <BarcodeModal
        isOpen={barcodeModalOpen}
        onClose={() => setBarcodeModalOpen(false)}
        onOpenReader={(b) => setReaderBook(b)}
        onOpenDetails={(b) => setSelectedBook(b)}
      />

      {/* Global E-Book Reader Modal */}
      <EbookReaderModal
        isOpen={Boolean(readerBook)}
        onClose={() => setReaderBook(null)}
        book={readerBook}
      />

      {/* Global Book Details Modal */}
      <BookDetailsModal
        isOpen={Boolean(selectedBook)}
        onClose={() => setSelectedBook(null)}
        book={selectedBook}
        onReadEbook={(b) => setReaderBook(b)}
      />
    </div>
  );
};

export default AppLayout;
