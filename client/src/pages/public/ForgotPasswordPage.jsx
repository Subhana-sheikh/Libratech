import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import LibratechLogo from '../../components/common/LibratechLogo.jsx';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4 text-white">
      <div className="w-full max-w-md space-y-6">
        
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <LibratechLogo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Account Recovery
          </h2>
          <p className="text-xs text-slate-400">
            Request a password reset for your university library account.
          </p>
        </div>

        <div className="bg-[#151A24] p-6 sm:p-8 rounded-3xl border border-[#232A3B] shadow-2xl space-y-5">
          {submitted ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Recovery Instructions Sent</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  If an account exists for <span className="font-semibold text-[#FF4B4B]">{email}</span>, password reset guidance has been dispatched. You can also visit the central library desk with your student ID for instant credential renewal.
                </p>
              </div>

              <div className="pt-2">
                <Link to="/login">
                  <button className="w-full py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#8B5CF6]/30">
                    Return to Sign In
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your university email address below. We'll verify your enrollment and send you recovery steps.
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Registered Email Address
                </label>
                <div className="relative flex items-center bg-[#080B12] rounded-xl border border-[#232A3B] focus-within:border-[#FF4B4B] px-3 py-2.5 transition">
                  <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="email"
                    placeholder="e.g. yourname@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                {loading ? 'Verifying...' : 'Send Password Reset Request'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
