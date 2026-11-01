import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Bell, Sparkles, User as UserIcon, LogOut,
  Menu, X, ChevronDown, Check, BookOpen, Layers, Bookmark,
  Barcode as BarcodeIcon, ShieldCheck, GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import LibratechLogo from '../common/LibratechLogo.jsx';

export const Navbar = ({ onToggleMobileMenu, onToggleAssistant, onOpenBarcode, onOpenWelcome }) => {
  const { user, logout, isStudent, isStaff, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  // Monitor scroll for glass background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when expanded
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (e) {
      // Non-blocking
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Outside click close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date() })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const getPortalLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'LIBRARIAN') return '/librarian';
    return '/student/loans';
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled
        ? 'bg-[#080B12]/90 backdrop-blur-xl border-b border-[#232A3B]/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
        : 'bg-[#080B12]/80 backdrop-blur-md border-b border-[#232A3B]/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Left: Hamburger + LIBRATECH Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onToggleMobileMenu && (
              <button
                onClick={onToggleMobileMenu}
                className="xl:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <LibratechLogo size="md" />
          </div>

          {/* Center: Navigation Links (Visible on xl screens 1280px+ to ensure zero overflow on laptops) */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-7 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Link
              to="/"
              className={`transition hover:text-white ${location.pathname === '/' ? 'text-[#FF4B4B]' : ''}`}
            >
              Home
            </Link>

            <Link
              to="/books"
              className={`transition hover:text-white ${location.pathname === '/books' ? 'text-[#FF4B4B]' : ''}`}
            >
              Explore Books
            </Link>

            <a
              href="/#categories"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="transition hover:text-white"
            >
              Categories
            </a>

            <a
              href="/#ebooks"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('ebooks')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="transition hover:text-white flex items-center gap-1"
            >
              <span>E-Books</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            </a>

            <Link
              to={getPortalLink()}
              className="transition hover:text-white"
            >
              My Library
            </Link>

            <a
              href="/#about"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="transition hover:text-white"
            >
              About Us
            </a>
          </nav>

          {/* Right: Search, Notifications, Barcode, AI Assistant, Auth CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink">
            
            {/* Expandable Search Field */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <div className="relative flex items-center bg-[#151A24] border border-[#FF4B4B]/60 rounded-xl px-3 py-1.5 shadow-lg w-44 sm:w-64 animate-in fade-in zoom-in-95 duration-200">
                    <Search className="w-4 h-4 text-[#FF4B4B] shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search catalogue..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-2 text-xs text-white placeholder:text-slate-500 bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                  title="Search Books"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Notification Bell Dropdown */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4B4B] shadow-[0_0_8px_#FF4B4B] animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#151A24] border border-[#232A3B] shadow-2xl p-4 text-xs space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-[#232A3B]">
                      <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">
                        Notifications ({unreadCount})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-[#FF4B4B] hover:underline font-bold"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-center py-6 text-slate-400">No notifications yet.</p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n._id}
                            className={`p-2.5 rounded-xl border transition ${
                              n.readAt
                                ? 'bg-[#080B12]/40 border-[#232A3B]/40 text-slate-400'
                                : 'bg-[#1C2230] border-[#FF4B4B]/30 text-white'
                            }`}
                          >
                            <p className="font-bold">{n.title}</p>
                            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <Link
                      to="/student/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="block text-center pt-2 text-[#8B5CF6] hover:text-[#A78BFA] font-bold text-[11px]"
                    >
                      View All Alerts →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Barcode Scanner Trigger Button */}
            {onOpenBarcode && (
              <button
                type="button"
                onClick={onOpenBarcode}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-[#1E2538] hover:bg-[#28324C] border border-slate-600/80 hover:border-[#FF4B4B]/70 text-white transition text-xs font-black shadow-md cursor-pointer shrink-0"
                title="Universal Barcode & ISBN Scanner"
              >
                <BarcodeIcon className="w-4 h-4 text-[#FF4B4B]" />
                <span className="hidden md:inline">Barcode</span>
              </button>
            )}

            {/* AI Assistant Drawer Trigger */}
            {onToggleAssistant && (
              <button
                onClick={onToggleAssistant}
                className="hidden lg:flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6]/25 to-[#FF4B4B]/25 border border-[#8B5CF6]/50 text-white hover:brightness-110 transition text-xs font-black shadow-md shrink-0"
                title="AI Library Assistant"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span className="hidden 2xl:inline">AI Assistant</span>
              </button>
            )}

            {/* Direct Admin Panel Pill if Logged In as Admin */}
            {user && user.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#FF4B4B]/20 border border-[#FF4B4B]/50 hover:bg-[#FF4B4B]/30 text-white font-black text-xs shadow-md transition shrink-0"
                title="Go to Admin Control Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF4B4B]" />
                <span className="hidden lg:inline">Admin Panel</span>
              </Link>
            )}

            {/* Auth Buttons: Sign In / Prominent Get Started OR Profile Dropdown */}
            {user ? (
              <div className="relative min-w-0" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:px-2.5 sm:py-2 rounded-xl bg-[#1E2538] hover:bg-[#28324C] border border-slate-600/80 transition shadow-sm cursor-pointer min-w-0 max-w-[130px] sm:max-w-[170px]"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF4B4B] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-black text-white truncate min-w-0">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#151A24] border border-[#232A3B] shadow-2xl p-2 text-xs space-y-1 z-50 animate-in fade-in duration-150">
                    <div className="p-3 border-b border-[#232A3B] mb-1">
                      <p className="font-extrabold text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#FF4B4B]/20 text-[#FF4B4B]">
                        {user.role}
                      </span>
                    </div>

                    {user.role === 'STUDENT' && (
                      <>
                        <Link
                          to="/student"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-semibold"
                        >
                          Student Dashboard
                        </Link>
                        <Link
                          to="/student/loans"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-semibold"
                        >
                          My Loans & Fines
                        </Link>
                        <Link
                          to="/student/saved"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-semibold"
                        >
                          Wishlist & Saved
                        </Link>
                      </>
                    )}

                    {user.role === 'LIBRARIAN' && (
                      <Link
                        to="/librarian"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-semibold"
                      >
                        Circulation Console
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-semibold"
                      >
                        Admin Control Panel
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-bold transition pt-2 border-t border-[#232A3B]"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-2.5">
                {onOpenWelcome && (
                  <button
                    type="button"
                    onClick={onOpenWelcome}
                    className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl bg-[#1E2538] hover:bg-[#28324C] border border-slate-600/80 text-white font-extrabold text-xs transition shadow-sm"
                    title="Choose Portal Role (Admin, Teacher, Guest)"
                  >
                    <span>Roles</span>
                  </button>
                )}

                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-black text-white hover:text-[#FF4B4B] transition rounded-xl hover:bg-white/5"
                >
                  Sign In
                </Link>

                <Link to="/register">
                  <button className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6] hover:scale-105 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-[#FF4B4B]/35 border border-white/20 cursor-pointer">
                    Get Started
                  </button>
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
