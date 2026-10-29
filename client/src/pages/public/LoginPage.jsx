import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import LibratechLogo from '../../components/common/LibratechLogo.jsx';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success && res.user) {
      if (from) {
        navigate(from, { replace: true });
      } else if (res.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (res.user.role === 'LIBRARIAN') {
        navigate('/librarian');
      } else {
        navigate('/student');
      }
    } else {
      setError(res.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 text-white">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <LibratechLogo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-xs text-slate-400">
            Access your university library loans, reading lists, and digital e-books.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#151A24] p-6 sm:p-8 rounded-3xl border border-[#232A3B] shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center bg-[#080B12] rounded-xl border border-[#232A3B] focus-within:border-[#FF4B4B] px-3 py-2.5 transition">
                <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="email"
                  placeholder="e.g. scholar@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-bold text-[#FF4B4B] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center bg-[#080B12] rounded-xl border border-[#232A3B] focus-within:border-[#FF4B4B] px-3 py-2.5 transition">
                <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6] hover:scale-[1.02] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[#FF4B4B]/30 transition disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Library'}
            </button>
          </form>

          {/* Registration link */}
          <div className="pt-4 border-t border-[#232A3B] text-center text-xs text-slate-400">
            <span>New student? </span>
            <Link
              to="/register"
              className="font-bold text-[#FF4B4B] hover:text-[#FF6E6E] transition"
            >
              Register your account →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
