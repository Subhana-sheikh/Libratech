import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, GraduationCap, User, Zap, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import LibratechLogo from '../../components/common/LibratechLogo.jsx';

export const LoginPage = () => {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole = location.state?.presetRole || 'ADMIN';
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || null;

  // Auto-fill credentials based on selected role
  useEffect(() => {
    if (selectedRole === 'ADMIN') {
      setEmail('admin@libratech.edu');
      setPassword('Password@123');
    } else if (selectedRole === 'TEACHER') {
      setEmail('teacher@libratech.edu');
      setPassword('Password@123');
    } else {
      setEmail('student@libratech.edu');
      setPassword('Password@123');
    }
  }, [selectedRole]);

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

  const handleQuickOneClick = (role) => {
    quickDemoLogin(role);
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'TEACHER') navigate('/librarian');
    else navigate('/student');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 text-white">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <LibratechLogo size="lg" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Sign In to Libratech Portal
          </h2>
          <p className="text-xs text-slate-400">
            Select your portal role (Admin, Teacher, or Guest/Student) to proceed.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#111622] border border-[#232A3B]">
          <button
            type="button"
            onClick={() => setSelectedRole('ADMIN')}
            className={`py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
              selectedRole === 'ADMIN'
                ? 'bg-[#FF4B4B] text-white shadow-md shadow-[#FF4B4B]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('TEACHER')}
            className={`py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
              selectedRole === 'TEACHER'
                ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('STUDENT')}
            className={`py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
              selectedRole === 'STUDENT'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Guest / Student</span>
          </button>
        </div>

        {/* Role Information Banner & 1-Click Access */}
        <div className="p-4 rounded-2xl bg-[#171E2D] border border-[#232A3B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#FF4B4B] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">
                {selectedRole === 'ADMIN' ? 'Admin Portal Access' : selectedRole === 'TEACHER' ? 'Teacher / Faculty Portal Access' : 'Guest / Student Portal Access'}
              </p>
              <p className="text-[11px] text-slate-400">
                Credentials pre-filled below for instant testing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleQuickOneClick(selectedRole)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:scale-105 transition shrink-0"
          >
            <Zap className="w-3.5 h-3.5" /> 1-Click {selectedRole} Login
          </button>
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
                  placeholder="e.g. admin@libratech.edu"
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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6] hover:scale-[1.01] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[#FF4B4B]/35 transition disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : `Sign In as ${selectedRole}`}
            </button>
          </form>

          {/* Registration link */}
          <div className="pt-4 border-t border-[#232A3B] flex items-center justify-between text-xs text-slate-400">
            <span>Don't have an account?</span>
            <Link
              to="/register"
              state={{ presetRole: selectedRole }}
              className="font-bold text-[#FF4B4B] hover:text-[#FF6E6E] transition"
            >
              Register here →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
