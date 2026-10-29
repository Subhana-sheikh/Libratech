import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, History, Search, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export const StudentLoansPage = () => {
  const [tab, setTab] = useState('active'); // 'active' | 'history'
  const [activeLoans, setActiveLoans] = useState([]);
  const [historyLoans, setHistoryLoans] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const [activeRes, historyRes] = await Promise.all([
        api.get('/loans/me'),
        api.get('/loans/me/history')
      ]);

      if (activeRes.success) setActiveLoans(activeRes.data || []);
      if (historyRes.success) setHistoryLoans(historyRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const currentList = tab === 'active' ? activeLoans : historyLoans;

  const filtered = currentList.filter(l => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      l.bookId?.title?.toLowerCase().includes(term) ||
      l.bookCopyId?.accessionCode?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Loan Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review active loan due dates and historical circulation records.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#151A24] border border-[#232A3B] p-1 rounded-xl">
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'active' ? 'bg-[#FF4B4B] text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Loans ({activeLoans.length})
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'history' ? 'bg-[#FF4B4B] text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Borrowing History ({historyLoans.length})
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by book title or accession code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#151A24] text-white rounded-xl border border-[#232A3B] focus:outline-none focus:border-[#FF4B4B] placeholder-slate-500"
        />
      </div>

      {/* Content Card */}
      <Card>
        {loading ? (
          <TableSkeleton rows={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={tab === 'active' ? 'No active loans' : 'No past loan history'}
            description={
              tab === 'active'
                ? 'You do not have any active loans. Explore the catalogue to borrow books.'
                : 'You have not returned any books yet.'
            }
            actionLabel="Browse Catalogue"
            onAction={() => window.location.href = '/books'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#232A3B] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Book Title</th>
                  <th className="pb-3 px-3">Accession ID</th>
                  <th className="pb-3 px-3">Issued Date</th>
                  <th className="pb-3 px-3">{tab === 'active' ? 'Due Date' : 'Returned Date'}</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232A3B] text-xs">
                {filtered.map((loan) => (
                  <tr key={loan._id} className="hover:bg-[#151A24]/90 transition-colors">
                    
                    {/* Title */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-11 bg-[#080B12] rounded overflow-hidden shrink-0 border border-[#232A3B]">
                          {loan.bookId?.coverImageUrl ? (
                            <img src={loan.bookId.coverImageUrl} alt={loan.bookId.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-[#FF4B4B] bg-[#FF4B4B]/10">
                              {loan.bookId?.title?.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <Link to={`/books/${loan.bookId?._id}`} className="font-semibold text-white hover:text-[#FF4B4B] transition-colors line-clamp-1">
                            {loan.bookId?.title}
                          </Link>
                          <span className="text-[11px] text-slate-400">
                            {Array.isArray(loan.bookId?.authors) ? loan.bookId.authors.join(', ') : loan.bookId?.authors}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Accession */}
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {loan.bookCopyId?.accessionCode || 'ACC-STD'}
                    </td>

                    {/* Issued */}
                    <td className="py-3 px-3 text-slate-300">
                      {new Date(loan.issuedAt).toLocaleDateString()}
                    </td>

                    {/* Due / Return Date */}
                    <td className="py-3 px-3 font-medium">
                      {tab === 'active' ? (
                        <div>
                          <span className="text-slate-200">{new Date(loan.dueAt).toLocaleDateString()}</span>
                          {loan.isOverdue ? (
                            <span className="block text-[10px] text-[#FF4B4B] font-bold">{loan.overdueDays} days late</span>
                          ) : (
                            <span className="block text-[10px] text-slate-400">{loan.daysRemaining} days left</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-200">
                          {loan.returnedAt ? new Date(loan.returnedAt).toLocaleDateString() : 'N/A'}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {loan.status === 'RETURNED' ? (
                        <Badge variant="neutral" size="sm">Returned</Badge>
                      ) : loan.isOverdue ? (
                        <Badge variant="danger" size="sm" dot>Overdue</Badge>
                      ) : (
                        <Badge variant="success" size="sm" dot>Active</Badge>
                      )}
                    </td>

                    {/* Fine */}
                    <td className="py-3 px-3 text-right font-medium">
                      {tab === 'active' ? (
                        loan.projectedFine > 0 ? (
                          <span className="text-[#FF4B4B] font-bold">₹{loan.projectedFine}</span>
                        ) : (
                          <span className="text-slate-400">₹0</span>
                        )
                      ) : (
                        loan.fineAtReturn > 0 ? (
                          <span className="text-[#FF4B4B] font-bold">₹{loan.fineAtReturn}</span>
                        ) : (
                          <span className="text-slate-400">₹0</span>
                        )
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

export default StudentLoansPage;
