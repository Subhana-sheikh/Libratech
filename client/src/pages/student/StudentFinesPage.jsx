import React, { useState, useEffect } from 'react';
import { DollarSign, ShieldAlert, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export const StudentFinesPage = () => {
  const [fines, setFines] = useState([]);
  const [summary, setSummary] = useState({ totalFinesCount: 0, totalUnpaidAmount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/fines/me')
      .then(res => {
        if (res.success && res.data) {
          setFines(res.data.fines || []);
          setSummary(res.data.summary || {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Fines & Payment Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review overdue loan fees, payment status, and audit history.
        </p>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Card padding="p-5" className="sm:col-span-2 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Outstanding Fine Balance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-extrabold ${summary.totalUnpaidAmount > 0 ? 'text-[#FF4B4B]' : 'text-emerald-400'}`}>
                ₹{summary.totalUnpaidAmount || 0}
              </span>
              <span className="text-xs text-slate-400">
                across {fines.filter(f => f.status === 'UNPAID' || f.status === 'PARTIALLY_PAID').length} unpaid item(s)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Fines must be settled at the library circulation desk with librarian staff to maintain borrowing privileges.
            </p>
          </div>

          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
            summary.totalUnpaidAmount > 0 ? 'bg-[#FF4B4B]/10 text-[#FF4B4B]' : 'bg-emerald-500/10 text-emerald-400'
          }`}>
            <DollarSign className="w-8 h-8" />
          </div>
        </Card>

        <Card padding="p-5" className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Circulation Fine Policy
          </span>
          <div className="text-xs text-slate-300 space-y-1">
            <p>• Daily fine: <strong>₹5 per day</strong></p>
            <p>• Grace period: <strong>0 days</strong></p>
            <p>• Maximum cap: <strong>₹500 / book</strong></p>
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            *Due date itself is fine-free.
          </span>
        </Card>

      </div>

      {/* Fine Records Table */}
      <Card>
        <CardHeader
          title="Fine History"
          subtitle="Itemized breakdown of fines assessed for overdue book returns."
        />

        {loading ? (
          <TableSkeleton rows={4} />
        ) : fines.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No fines recorded"
            description="Your account is completely clear of overdue fines. Keep returning books on time!"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#232A3B] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Book Title</th>
                  <th className="pb-3 px-3">Reason</th>
                  <th className="pb-3 px-3">Total Amount</th>
                  <th className="pb-3 px-3">Paid Amount</th>
                  <th className="pb-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232A3B] text-xs">
                {fines.map((fine) => (
                  <tr key={fine._id} className="hover:bg-[#151A24]/90 transition-colors">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(fine.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {fine.loanId?.bookId?.title || 'Library Loan Item'}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {fine.reason}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-200">
                      ₹{fine.amount}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      ₹{fine.paidAmount || 0}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Badge
                        variant={
                          fine.status === 'PAID' ? 'success' :
                          fine.status === 'WAIVED' ? 'neutral' :
                          fine.status === 'PARTIALLY_PAID' ? 'warning' : 'danger'
                        }
                        size="sm"
                      >
                        {fine.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  );
};

export default StudentFinesPage;
