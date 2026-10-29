import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, LogOut, BookOpen, Sparkles, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import LibratechLogo from '../common/LibratechLogo.jsx';

export const MobileNav = ({ isOpen, onClose }) => {
  const { user, logout, isStudent, isLibrarian, isAdmin } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden select-none">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 bg-[#080B12] border-r border-[#232A3B] shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 text-white">
        <div>
          
          {/* Top Logo & Close */}
          <div className="flex items-center justify-between pb-5 border-b border-[#232A3B] mb-5">
            <LibratechLogo size="sm" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Status Card */}
          {user && (
            <div className="p-3.5 bg-[#151A24] rounded-2xl mb-5 border border-[#232A3B]">
              <p className="text-xs font-extrabold text-white">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#FF4B4B]/20 text-[#FF4B4B] border border-[#FF4B4B]/30">
                {user.role}
              </span>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-bold uppercase tracking-wider">
            <NavLink
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
            >
              Home
            </NavLink>

            <NavLink
              to="/books"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
            >
              Explore Catalogue
            </NavLink>

            {isStudent && (
              <>
                <NavLink to="/student" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition">
                  Student Dashboard
                </NavLink>
                <NavLink to="/student/loans" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition">
                  My Loans & Due Dates
                </NavLink>
                <NavLink to="/student/saved" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition">
                  Saved Reading List
                </NavLink>
                <NavLink to="/student/fines" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition">
                  Fines & Payments
                </NavLink>
                <NavLink to="/student/assistant" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#FF4B4B] hover:bg-[#FF4B4B]/10 font-bold">
                  <Sparkles className="w-4 h-4 text-[#FF4B4B]" />
                  <span>AI Assistant</span>
                </NavLink>
              </>
            )}

            {isLibrarian && (
              <>
                <NavLink to="/librarian" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition">
                  Circulation Overview
                </NavLink>
                <NavLink to="/librarian/issue-return" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition">
                  Issue / Return Books
                </NavLink>
                <NavLink to="/librarian/scan" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition">
                  Barcode Scanner
                </NavLink>
                <NavLink to="/librarian/loans" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition">
                  Active Loans
                </NavLink>
              </>
            )}

            {isAdmin && (
              <>
                <NavLink to="/admin" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition">
                  Admin Analytics
                </NavLink>
                <NavLink to="/admin/books" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition">
                  Catalogue & Stock
                </NavLink>
                <NavLink to="/admin/users" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition">
                  Users & Roles
                </NavLink>
                <NavLink to="/admin/settings" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition">
                  Circulation Policy
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Bottom CTA / Sign out */}
        <div className="pt-6 border-t border-[#232A3B]">
          {user ? (
            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs font-extrabold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <div className="space-y-2">
              <Link to="/login" onClick={onClose} className="block text-center py-3 text-xs font-bold text-white bg-[#151A24] border border-[#232A3B] rounded-xl hover:border-white/20 transition">
                Sign In
              </Link>
              <Link to="/register" onClick={onClose} className="block text-center py-3 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6] rounded-xl shadow-lg shadow-[#FF4B4B]/30 transition">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
