import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Heart, Sparkles, Github, Twitter, Linkedin } from 'lucide-react';
import LibratechLogo from '../common/LibratechLogo.jsx';

export const Footer = () => {
  return (
    <footer className="bg-[#05070B] border-t border-[#232A3B] mt-auto text-slate-400 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <LibratechLogo size="md" />

            <div className="space-y-1 text-xs">
              <p className="font-bold text-slate-300">
                "Your World of Knowledge, One Click Away."
              </p>
              <p className="text-[#FF4B4B] font-semibold text-[11px] tracking-wide">
                Discover. Read. Learn. Grow.
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The next-generation digital library platform inspired by Netflix discovery, combining real-time physical inventory tracking with instant digital reading.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Libratech OS v2.0 • All Systems Operational</span>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF4B4B]/20 to-[#8B5CF6]/20 border border-[#FF4B4B]/35 text-white font-black text-xs shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4B4B]" />
                <span>Made by @subhana sheikh</span>
              </div>
            </div>
          </div>

          {/* Quick Discovery */}
          <div className="space-y-3">
            <h5 className="text-xs font-black text-white uppercase tracking-widest">
              Discovery
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/books" className="hover:text-[#FF4B4B] transition">Explore All Books</Link>
              </li>
              <li>
                <Link to="/books?category=computer-science" className="hover:text-[#FF4B4B] transition">Computer Science</Link>
              </li>
              <li>
                <Link to="/books?category=ai-ml" className="hover:text-[#FF4B4B] transition">Artificial Intelligence</Link>
              </li>
              <li>
                <Link to="/books?category=web-development" className="hover:text-[#FF4B4B] transition">Web Development</Link>
              </li>
              <li>
                <Link to="/books?availability=available" className="hover:text-[#FF4B4B] transition">In-Stock Books</Link>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div className="space-y-3">
            <h5 className="text-xs font-black text-white uppercase tracking-widest">
              Workspaces
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-[#FF4B4B] transition">Student Portal</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#FF4B4B] transition">Circulation Desk</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#FF4B4B] transition">Administrator Suite</Link>
              </li>
              <li>
                <Link to="/student/assistant" className="hover:text-[#FF4B4B] transition">AI Research Assistant</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#FF4B4B] transition">Student Registration</Link>
              </li>
            </ul>
          </div>

          {/* Trust & Circulation */}
          <div className="space-y-3">
            <h5 className="text-xs font-black text-white uppercase tracking-widest">
              Integrity & Trust
            </h5>
            <div className="p-4 rounded-2xl bg-[#151A24] border border-[#232A3B] space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
                <span>Atomic Inventory</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Every physical copy tracked with accession barcodes, server-enforced fine boundary caps, and zero duplicate loan returns.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Socials & Legal */}
        <div className="mt-12 pt-8 border-t border-[#232A3B] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p className="font-semibold text-slate-300">
            © {new Date().getFullYear()} LIBRATECH Systems · Made with <Heart className="w-3.5 h-3.5 inline text-[#FF4B4B] mx-0.5 fill-current" /> by <span className="text-[#FF4B4B] font-extrabold tracking-wide">@subhana sheikh</span>
          </p>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Circulation Rules</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3 text-slate-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:text-white transition">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:text-white transition">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:text-white transition">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
