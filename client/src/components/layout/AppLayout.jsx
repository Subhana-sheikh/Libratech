import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import MobileNav from './MobileNav.jsx';
import Footer from './Footer.jsx';
import AssistantChatDrawer from '../assistant/AssistantChatDrawer.jsx';

export const AppLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#080B12] text-slate-100">
      <Navbar
        onToggleMobileMenu={() => setMobileNavOpen(true)}
        onToggleAssistant={() => setAssistantOpen(true)}
      />

      {isHome ? (
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      )}

      <Footer />

      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <AssistantChatDrawer isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  );
};

export default AppLayout;
