import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Hash, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import LibratechLogo from '../../components/common/LibratechLogo.jsx';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole = location.state?.presetRole || 'STUDENT';
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    const res = await register({
      name: formData.name,
      email: formData.email,
      role: role === 'TEACHER' ? 'TEACHER' : role === 'ADMIN' ? 'ADMIN' : 'STUDENT',
      studentId: formData.studentId || undefined,
      department: formData.department || undefined,
      password: formData.password
    });

    setLoading(false);

    if (res.success) {
      if (role === 'ADMIN') navigate('/admin', { replace: true });
      else if (role === 'TEACHER') navigate('/librarian', { replace: true });
      else navigate('/student', { replace: true });
    } else {
      setError(res.error || 'Registration failed. Please check your information.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 text-white">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <LibratechLogo size="lg" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Register New Account
          </h2>
          <p className="text-xs text-slate-400">
            Select your account type (Admin, Teacher, or Guest/Student) and join Libratech.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#111622] border border-[#232A3B]">
          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
              role === 'ADMIN'
                ? 'bg-[#FF4B4B] text-white shadow-md shadow-[#FF4B4B]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('TEACHER')}
            className={`py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
              role === 'TEACHER'
                ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
              role === 'STUDENT'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Guest / Student</span>
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
                Full Name
              </label>
              <div className="relative flex items-center bg-[#080B12] rounded-xl border border-[#232A3B] focus-within:border-[#FF4B4B] px-3 py-2.5 transition">
                <User className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Dr. Maya Lin"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center bg-[#080B12] rounded-xl border border-[#232A3B] focus-within:border-[#FF4B4B] px-3 py-2.5 transition">
                <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="email"
                  name="email"
                  placeholder={role === 'ADMIN' ? 'admin@university.edu' : role === 'TEACHER' ? 'professor@university.edu' : 'student@university.edu'}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {role === 'ADMIN' ? 'Admin ID / Code' : role === 'TEACHER' ? 'Faculty ID' : 'Student ID'}
                </label>
                <div className="relative flex items-center bg-[#080B12] rounded-xl border border-[#232A3B] focus-within:border-[#FF4B4B] px-3 py-2.5 transition">
                  <Hash className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    name="studentId"
                    placeholder={role === 'ADMIN' ? 'ADM-2024-01' : role === 'TEACHER' ? 'FAC-2024-08' : 'STU-2024-089'}
                    value={formData.studentId}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Department
                </label>
                <div className="relative flex items-center bg-[#080B12] rounded-xl border border-[#232A3B] focus-within:border-[#FF4B4B] px-3 py-2.5 transition">
                  <GraduationCap className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    name="department"
                    placeholder="e.g. Computer Science"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative flex items-center bg-[#080B12] rounded-xl border border-[#232A3B] focus-within:border-[#FF4B4B] px-3 py-2.5 transition">
                  <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative flex items-center bg-[#080B12] rounded-xl border border-[#232A3B] focus-within:border-[#FF4B4B] px-3 py-2.5 transition">
                  <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6] hover:scale-[1.01] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[#FF4B4B]/30 transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : `Register as ${role}`}
            </button>
          </form>

          {/* Login Link */}
          <div className="pt-4 border-t border-[#232A3B] flex items-center justify-between text-xs text-slate-400">
            <span>Already have an account?</span>
            <Link
              to="/login"
              state={{ presetRole: role }}
              className="font-bold text-[#FF4B4B] hover:text-[#FF6E6E] transition"
            >
              Sign In →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
