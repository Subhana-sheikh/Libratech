import React from 'react';
import { User, Mail, Hash, GraduationCap, ShieldCheck, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';

export const StudentProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review your enrolled university library credentials and borrowing eligibility.
        </p>
      </div>

      <Card>
        <div className="flex items-center gap-4 pb-6 border-b border-[#232A3B]">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF4B4B] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-2xl uppercase shadow-lg shadow-[#FF4B4B]/30">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user.name}</h3>
            <p className="text-xs text-slate-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="info">{user.role}</Badge>
              <Badge variant="success" dot>Active Library Scholar</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-xs">
          <div className="p-4 bg-[#080B12] rounded-xl space-y-1 border border-[#232A3B]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student ID</span>
            <p className="font-mono font-semibold text-slate-200 text-sm">{user.studentId || 'Not assigned'}</p>
          </div>

          <div className="p-4 bg-[#080B12] rounded-xl space-y-1 border border-[#232A3B]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department / Course</span>
            <p className="font-semibold text-slate-200 text-sm">{user.department || 'General Studies'}</p>
          </div>

          <div className="p-4 bg-[#080B12] rounded-xl space-y-1 border border-[#232A3B]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Borrowing Limit</span>
            <p className="font-semibold text-slate-200 text-sm">Up to 4 active book loans</p>
          </div>

          <div className="p-4 bg-[#080B12] rounded-xl space-y-1 border border-[#232A3B]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Standard Loan Duration</span>
            <p className="font-semibold text-slate-200 text-sm">14 calendar days / book</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentProfilePage;
