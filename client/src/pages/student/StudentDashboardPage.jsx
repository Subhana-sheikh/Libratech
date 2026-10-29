import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookMarked, Clock, AlertTriangle, DollarSign, Sparkles,
  ArrowRight, Bookmark, Bell, ChevronRight, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import BookCard from '../../components/books/BookCard.jsx';
import Skeleton, { TableSkeleton, BookCardSkeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export const StudentDashboardPage = () => {
  const { user } = useAuth();

  const [activeLoans, setActiveLoans] = useState([]);
  const [finesSummary, setFinesSummary] = useState({ totalUnpaidAmount: 0 });
  const [recommendations, setRecommendations] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [loansRes, finesRes, recsRes, notifsRes] = await Promise.all([
          api.get('/loans/me'),
          api.get('/fines/me'),
          api.get('/books/recommendations'),
          api.get('/notifications')
        ]);

        if (loansRes.success) setActiveLoans(loansRes.data || []);
        if (finesRes.success && finesRes.data) setFinesSummary(finesRes.data.summary || {});
        if (recsRes.success) setRecommendations(recsRes.data || []);
        if (notifsRes.success && notifsRes.data) {
          setRecentNotifications((notifsRes.data.notifications || []).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const overdueCount = activeLoans.filter(l => l.isOverdue).length;
  const dueSoonCount = activeLoans.filter(l => !l.isOverdue && l.daysRemaining <= 3).length;

  return (
    <div className="space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Scholar'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Student Portal • ID: <span className="font-semibold text-slate-200">{user?.studentId || 'N/A'}</span> • {user?.department || 'University Scholar'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/books">
            <Button variant="secondary" size="sm" icon={BookMarked}>
              Explore Books
            </Button>
          </Link>
          <Link to="/student/assistant">
            <Button variant="primary" size="sm" icon={Sparkles}>
              Ask Assistant
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card padding="p-5" className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Loans</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">{activeLoans.length}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Max limit: 4 books</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FF4B4B]/10 text-[#FF4B4B] flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card padding="p-5" className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Due Soon (≤3d)</p>
              <h3 className={`text-2xl sm:text-3xl font-bold mt-1 ${dueSoonCount > 0 ? 'text-amber-400' : 'text-white'}`}>
                {dueSoonCount}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Return before deadline</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card padding="p-5" className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overdue</p>
              <h3 className={`text-2xl sm:text-3xl font-bold mt-1 ${overdueCount > 0 ? 'text-[#FF4B4B]' : 'text-white'}`}>
                {overdueCount}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Accruing daily fine</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FF4B4B]/10 text-[#FF4B4B] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card padding="p-5" className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unpaid Fines</p>
              <h3 className={`text-2xl sm:text-3xl font-bold mt-1 ${finesSummary.totalUnpaidAmount > 0 ? 'text-[#FF4B4B]' : 'text-emerald-400'}`}>
                ₹{finesSummary.totalUnpaidAmount || 0}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {finesSummary.totalUnpaidAmount > 0 ? 'Pay at circulation desk' : 'Account in good standing'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </Card>

      </div>

      {/* Active Borrowed Books List */}
      <Card>
        <CardHeader
          title="Current Active Loans"
          subtitle="Books currently in your possession and due date milestones."
          action={
            <Link to="/student/loans" className="text-xs font-semibold text-[#FF4B4B] hover:underline">
              View History →
            </Link>
          }
        />

        {loading ? (
          <TableSkeleton rows={3} />
        ) : activeLoans.length === 0 ? (
          <EmptyState
            title="No active loans"
            description="You do not currently have any borrowed books from the library."
            actionLabel="Discover Books to Borrow"
            onAction={() => window.location.href = '/books'}
          />
        ) : (
          <div className="divide-y divide-[#232A3B]">
            {activeLoans.map((loan) => (
              <div key={loan._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-16 rounded-lg bg-[#080B12] overflow-hidden shrink-0 border border-[#232A3B]">
                    {loan.bookId?.coverImageUrl ? (
                      <img src={loan.bookId.coverImageUrl} alt={loan.bookId.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#8B5CF6] bg-[#8B5CF6]/10">
                        {loan.bookId?.title?.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <Link to={`/books/${loan.bookId?._id}`}>
                      <h4 className="text-sm font-semibold text-white hover:text-[#FF4B4B] transition-colors">
                        {loan.bookId?.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5">
                      by {Array.isArray(loan.bookId?.authors) ? loan.bookId.authors.join(', ') : loan.bookId?.authors}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span>Issued: <strong>{new Date(loan.issuedAt).toLocaleDateString()}</strong></span>
                      <span>Accession: <strong className="font-mono text-slate-200">{loan.bookCopyId?.accessionCode || 'N/A'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right Due Date Status */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#232A3B]">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Due Date</span>
                    <span className="text-xs font-bold text-slate-200">
                      {new Date(loan.dueAt).toLocaleDateString()}
                    </span>
                  </div>

                  {loan.isOverdue ? (
                    <Badge variant="danger" size="sm" dot>
                      {loan.overdueDays}d Overdue (₹{loan.projectedFine} fine)
                    </Badge>
                  ) : loan.daysRemaining <= 3 ? (
                    <Badge variant="warning" size="sm" dot>
                      Due in {loan.daysRemaining} day(s)
                    </Badge>
                  ) : (
                    <Badge variant="success" size="sm" dot>
                      {loan.daysRemaining} days remaining
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Grid: Recommended Books + Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Books (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="text-base font-bold text-white">Recommended for You</h3>
            </div>
            <Link to="/student/recommendations" className="text-xs font-semibold text-[#8B5CF6] hover:underline">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BookCardSkeleton />
              <BookCardSkeleton />
            </div>
          ) : recommendations.length === 0 ? (
            <EmptyState
              title="No recommendations yet"
              description="Save or borrow books to generate recommendations based on your disciplines."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.slice(0, 2).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Notifications (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FF4B4B]" />
              <h3 className="text-base font-bold text-white">Due Alerts & Updates</h3>
            </div>
            <Link to="/student/notifications" className="text-xs font-semibold text-[#FF4B4B] hover:underline">
              All alerts →
            </Link>
          </div>

          <Card padding="p-4" className="space-y-3">
            {recentNotifications.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">No recent notifications.</p>
            ) : (
              recentNotifications.map((notif) => (
                <div key={notif._id} className="p-3 bg-[#080B12] rounded-xl border border-[#232A3B] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{notif.title}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{notif.message}</p>
                </div>
              ))
            )}
          </Card>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboardPage;
