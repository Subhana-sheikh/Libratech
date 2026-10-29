import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftRight, BookOpen, Clock, AlertTriangle, QrCode,
  CheckCircle2, DollarSign, History, Search, ArrowRight
} from 'lucide-react';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';

export const LibrarianDashboardPage = () => {
  const [stats, setStats] = useState({
    totalTitles: 0,
    totalCopies: 0,
    availableCopies: 0,
    activeLoans: 0,
    overdueLoans: 0,
    outstandingFines: 0
  });
  const [recentLoans, setRecentLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const [overviewRes, loansRes] = await Promise.all([
          api.get('/admin/analytics/overview'),
          api.get('/loans', { limit: 6 })
        ]);

        if (overviewRes.success && overviewRes.data) {
          setStats(overviewRes.data);
        }
        if (loansRes.success && loansRes.data) {
          setRecentLoans(loansRes.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Circulation Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Issue and return workflow, loan records monitoring, and fine administration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/librarian/scan">
            <Button variant="secondary" size="sm" icon={QrCode}>
              Scan Barcode
            </Button>
          </Link>
          <Link to="/librarian/issue-return">
            <Button variant="primary" size="sm" icon={ArrowLeftRight}>
              Issue / Return Desk
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Loans</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{stats.activeLoans}</h3>
          <p className="text-[11px] text-[#FF4B4B] mt-0.5">Checked out to students</p>
        </Card>

        <Card padding="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overdue Loans</p>
          <h3 className={`text-2xl sm:text-3xl font-extrabold mt-1 ${stats.overdueLoans > 0 ? 'text-[#FF4B4B]' : 'text-white'}`}>
            {stats.overdueLoans}
          </h3>
          <p className="text-[11px] text-[#FF4B4B] mt-0.5">Accruing daily fines</p>
        </Card>

        <Card padding="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available on Shelf</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{stats.availableCopies}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Ready for immediate issue</p>
        </Card>

        <Card padding="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unpaid Fines</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">₹{stats.outstandingFines || 0}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Outstanding balance</p>
        </Card>
      </div>

      {/* Quick Circulation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/librarian/issue-return?mode=issue" className="block">
          <Card padding="p-5" hover className="border-[#232A3B] bg-[#151A24]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF4B4B]/10 text-[#FF4B4B] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Issue a Book</h4>
                <p className="text-xs text-slate-400">Scan or select student and book</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/librarian/issue-return?mode=return" className="block">
          <Card padding="p-5" hover className="border-[#232A3B] bg-[#151A24]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Return a Book</h4>
                <p className="text-xs text-slate-400">Calculate fine and restore stock</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/librarian/scan" className="block">
          <Card padding="p-5" hover className="border-[#232A3B] bg-[#151A24]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Scan Barcode / QR</h4>
                <p className="text-xs text-slate-400">Fast physical copy resolution</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Loans */}
      <Card>
        <CardHeader
          title="Recent Circulation Activity"
          subtitle="Real-time issue and return events processed through the desk."
          action={
            <Link to="/librarian/loans" className="text-xs font-semibold text-[#FF4B4B] hover:underline">
              View all loans →
            </Link>
          }
        />

        {loading ? (
          <TableSkeleton rows={4} />
        ) : recentLoans.length === 0 ? (
          <p className="text-center py-8 text-xs text-slate-400">No circulation records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#232A3B] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Student</th>
                  <th className="pb-3 px-3">Book Title</th>
                  <th className="pb-3 px-3">Accession ID</th>
                  <th className="pb-3 px-3">Due Date</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232A3B]">
                {recentLoans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-[#151A24]/90 transition-colors">
                    <td className="py-3 px-3 font-medium text-white">
                      {loan.userId?.name}
                      <span className="block text-[10px] text-slate-400">{loan.userId?.studentId || loan.userId?.email}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {loan.bookId?.title}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {loan.bookCopyId?.accessionCode || 'ACC-N/A'}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(loan.dueAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          loan.status === 'RETURNED' ? 'neutral' :
                          loan.isOverdue ? 'danger' : 'success'
                        }
                        size="sm"
                        dot
                      >
                        {loan.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right font-medium">
                      {(loan.fineAtReturn || loan.projectedFine || 0) > 0 ? (
                        <span className="text-[#FF4B4B] font-bold">
                          ₹{loan.fineAtReturn || loan.projectedFine}
                        </span>
                      ) : (
                        <span className="text-slate-400">₹0</span>
                      )}
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

export default LibrarianDashboardPage;
