import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, BookMarked, Sparkles, AlertCircle,
  QrCode, Users, Settings, History, Layers, Bookmark, CheckCircle2,
  HelpCircle, ArrowLeftRight, ShieldCheck, DollarSign, PlusCircle, UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const Sidebar = () => {
  const { user, isStudent, isLibrarian, isAdmin } = useAuth();

  const studentLinks = [
    { name: 'Dashboard', to: '/student', icon: LayoutDashboard },
    { name: 'Explore Books', to: '/books', icon: BookOpen },
    { name: 'My Loans', to: '/student/loans', icon: BookMarked },
    { name: 'Saved Books', to: '/student/saved', icon: Bookmark },
    { name: 'Recommendations', to: '/student/recommendations', icon: Sparkles },
    { name: 'Fines & Payments', to: '/student/fines', icon: DollarSign },
    { name: 'Due Date Alerts', to: '/student/notifications', icon: AlertCircle },
    { name: 'Library Assistant', to: '/student/assistant', icon: HelpCircle },
    { name: 'My Profile', to: '/student/profile', icon: UserCheck }
  ];

  const librarianLinks = [
    { name: 'Circulation Desk', to: '/librarian', icon: LayoutDashboard },
    { name: 'Issue & Return', to: '/librarian/issue-return', icon: ArrowLeftRight },
    { name: 'Barcode / QR Scan', to: '/librarian/scan', icon: QrCode },
    { name: 'Active & Overdue Loans', to: '/librarian/loans', icon: History },
    { name: 'Fines Management', to: '/librarian/fines', icon: DollarSign },
    { name: 'Book Catalogue', to: '/books', icon: BookOpen }
  ];

  const adminLinks = [
    { name: 'System Analytics', to: '/admin', icon: LayoutDashboard },
    { name: 'Catalogue & Stock', to: '/admin/books', icon: BookOpen },
    { name: 'Add New Book', to: '/admin/books/new', icon: PlusCircle },
    { name: 'Issue & Return', to: '/librarian/issue-return', icon: ArrowLeftRight },
    { name: 'All Loans & Returns', to: '/admin/loans', icon: History },
    { name: 'Fines & Waivers', to: '/admin/fines', icon: DollarSign },
    { name: 'Barcode / QR Scan', to: '/librarian/scan', icon: QrCode },
    { name: 'Users & Roles', to: '/admin/users', icon: Users },
    { name: 'Categories & Metadata', to: '/admin/categories', icon: Layers },
    { name: 'Circulation Policy', to: '/admin/settings', icon: Settings },
    { name: 'Audit Trail', to: '/admin/activity', icon: History }
  ];

  let currentLinks = [];
  let sectionTitle = 'Navigation';

  if (isAdmin) {
    currentLinks = adminLinks;
    sectionTitle = 'Administration';
  } else if (isLibrarian) {
    currentLinks = librarianLinks;
    sectionTitle = 'Circulation Desk';
  } else if (isStudent) {
    currentLinks = studentLinks;
    sectionTitle = 'Student Portal';
  }

  if (!user || currentLinks.length === 0) return null;

  return (
    <aside className="w-64 bg-[#0A0D15] border-r border-[#232A3B] min-h-[calc(100vh-5rem)] p-4 flex flex-col justify-between hidden lg:flex shrink-0 select-none">
      <div>
        <div className="px-3 py-2">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            {sectionTitle}
          </p>
        </div>

        <nav className="space-y-1 mt-2">
          {currentLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/student' || item.to === '/librarian' || item.to === '/admin'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
                  ${isActive
                    ? 'bg-gradient-to-r from-[#FF4B4B]/20 to-[#8B5CF6]/15 text-white font-extrabold border-l-2 border-[#FF4B4B] shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FF4B4B]' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom info card */}
      <div className="p-3.5 bg-[#151A24] rounded-2xl border border-[#232A3B] space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
          <span>Role Verified</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Signed in as <span className="font-bold text-[#FF4B4B]">{user.role}</span>. Authoritative security policies enforced.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
