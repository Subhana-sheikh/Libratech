import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, GraduationCap, User, ArrowRight, X,
  Sparkles, BookOpen, CheckCircle2, Lock, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import LibratechLogo from './LibratechLogo.jsx';

export const WelcomeGatewayModal = ({ isOpen, onClose }) => {
  const { user, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  if (!isOpen || user) return null;

  const handleAdminSelect = () => {
    quickDemoLogin('ADMIN');
    onClose();
    navigate('/admin');
  };

  const handleTeacherSelect = () => {
    quickDemoLogin('TEACHER');
    onClose();
    navigate('/librarian');
  };

  const handleGuestSelect = () => {
    onClose();
    // User can explore directly as guest
  };

  const handleLoginRedirect = (presetRole) => {
    onClose();
    navigate('/login', { state: { presetRole } });
  };

  const handleRegisterRedirect = (presetRole) => {
    onClose();
    navigate('/register', { state: { presetRole } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-[#151A24] border border-[#232A3B] rounded-3xl shadow-2xl overflow-hidden my-auto text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Header */}
        <div className="relative px-6 py-6 sm:px-8 sm:py-7 bg-gradient-to-r from-[#1C2230] via-[#1A1829] to-[#151A24] border-b border-[#232A3B]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
            title="Explore as Guest / Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <LibratechLogo size="md" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF4B4B]/20 text-[#FF4B4B] text-[10px] font-black uppercase tracking-wider mb-1 border border-[#FF4B4B]/30">
                <Sparkles className="w-3 h-3" /> Welcome to Libratech Portal
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Please Select Your Role to Continue
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose how you wish to access the digital catalogue, administration, and reading suite.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. ADMIN ROLE */}
            <div className="p-5 rounded-2xl bg-[#1C2230] border border-[#2B354C] hover:border-[#FF4B4B]/70 transition-all duration-200 flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FF4B4B]/15 text-[#FF4B4B] border border-[#FF4B4B]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-[#FF4B4B] transition-colors">
                    Admin Portal
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Control catalogue inventory, add new books, configure loan rules, and view audit metrics.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleAdminSelect}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FF4B4B] to-[#E03E3E] hover:from-[#FF3333] hover:to-[#FF4B4B] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#FF4B4B]/30 transition"
                >
                  <Zap className="w-3.5 h-3.5" /> 1-Click Admin Access
                </button>
                <button
                  type="button"
                  onClick={() => handleLoginRedirect('ADMIN')}
                  className="w-full py-1.5 text-[11px] font-bold text-slate-400 hover:text-white transition text-center"
                >
                  Sign in with password →
                </button>
              </div>
            </div>

            {/* 2. TEACHER / FACULTY ROLE */}
            <div className="p-5 rounded-2xl bg-[#1C2230] border border-[#2B354C] hover:border-[#8B5CF6]/70 transition-all duration-200 flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-[#8B5CF6] transition-colors">
                    Teacher / Faculty
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Faculty book loans, course reserve requests, syllabus reading lists, and circulation desk.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleTeacherSelect}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#8B5CF6]/30 transition"
                >
                  <Zap className="w-3.5 h-3.5" /> 1-Click Teacher Access
                </button>
                <div className="flex items-center justify-between text-[11px] font-bold pt-1 px-1">
                  <button
                    type="button"
                    onClick={() => handleLoginRedirect('TEACHER')}
                    className="text-slate-400 hover:text-white transition"
                  >
                    Sign In
                  </button>
                  <span className="text-slate-600">·</span>
                  <button
                    type="button"
                    onClick={() => handleRegisterRedirect('TEACHER')}
                    className="text-[#8B5CF6] hover:underline"
                  >
                    Register Faculty
                  </button>
                </div>
              </div>
            </div>

            {/* 3. GUEST / STUDENT ROLE */}
            <div className="p-5 rounded-2xl bg-[#1C2230] border border-[#2B354C] hover:border-emerald-500/70 transition-all duration-200 flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                    Guest / Student
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Browse books, test barcode scanner, read e-books instantly, and track personal borrow history.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleGuestSelect}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition"
                >
                  Explore as Guest
                </button>
                <div className="flex items-center justify-between text-[11px] font-bold pt-1 px-1">
                  <button
                    type="button"
                    onClick={() => handleLoginRedirect('STUDENT')}
                    className="text-slate-400 hover:text-white transition"
                  >
                    Student Login
                  </button>
                  <span className="text-slate-600">·</span>
                  <button
                    type="button"
                    onClick={() => handleRegisterRedirect('STUDENT')}
                    className="text-emerald-400 hover:underline"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Notice Info Bar */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-400">
              💡 Want to browse freely without logging in right now?{' '}
              <button
                type="button"
                onClick={handleGuestSelect}
                className="font-bold text-[#FF4B4B] hover:underline"
              >
                Click here to continue exploring as Guest →
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WelcomeGatewayModal;

