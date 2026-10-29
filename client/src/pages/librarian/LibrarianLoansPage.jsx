import React, { useState, useEffect } from 'react';
import { Search, ArrowLeftRight, CheckCircle2, History, AlertTriangle } from 'lucide-react';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Alert from '../../components/ui/Alert.jsx';

export const LibrarianLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/loans', {
        status: status !== 'all' ? status : '',
        search,
        page,
        limit: 15
      });
      if (res.success) {
        setLoans(res.data || []);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [status, search, page]);

  const handleReturnLoan = async (loanId) => {
    try {
      const res = await api.post(`/loans/${loanId}/return`);
      if (res.success) {
        setActionMessage(`Book return confirmed. Inventory restored!`);
        fetchLoans();
      }
    } catch (err) {
      setActionMessage(`Return failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Circulation Records
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor all issued loans, overdue durations, and return timestamps.
        </p>
      </div>

      {actionMessage && (
        <Alert type="info" onClose={() => setActionMessage('')}>
          {actionMessage}
        </Alert>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or book title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#151A24] text-white rounded-xl border border-[#232A3B] focus:outline-none focus:border-[#FF4B4B] placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-[#151A24] border border-[#232A3B] p-1 rounded-xl">
          {['all', 'ACTIVE', 'OVERDUE', 'RETURNED'].map((st) => (
            <button
              key={st}
              onClick={() => { setStatus(st); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                status === st ? 'bg-[#FF4B4B] text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        {loading ? (
          <TableSkeleton rows={5} />
        ) : loans.length === 0 ? (
          <EmptyState
            title="No loan records found"
            description="No loans match the current status filter and search term."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#232A3B] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Borrower</th>
                  <th className="pb-3 px-3">Book Title</th>
                  <th className="pb-3 px-3">Accession ID</th>
                  <th className="pb-3 px-3">Issue Date</th>
                  <th className="pb-3 px-3">Due Date</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Fine</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232A3B]">
                {loans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-[#151A24]/90 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">
                      {loan.userId?.name}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {loan.userId?.studentId || loan.userId?.email}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200">
                      {loan.bookId?.title}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {loan.bookCopyId?.accessionCode || 'ACC-N/A'}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(loan.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-medium">
                      <span className="text-slate-200">{new Date(loan.dueAt).toLocaleDateString()}</span>
                      {loan.isOverdue && (
                        <span className="block text-[10px] text-[#FF4B4B] font-bold">{loan.overdueDays}d overdue</span>
                      )}
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
                    <td className="py-3 px-3 font-semibold">
                      {(loan.fineAtReturn || loan.projectedFine || 0) > 0 ? (
                        <span className="text-[#FF4B4B]">₹{loan.fineAtReturn || loan.projectedFine}</span>
                      ) : (
                        <span className="text-slate-400">₹0</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {loan.status !== 'RETURNED' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleReturnLoan(loan._id)}
                          className="hover:border-emerald-300 hover:text-emerald-400"
                        >
                          Return Book
                        </Button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Returned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          onPageChange={(p) => setPage(p)}
        />
      </Card>
    </div>
  );
};

export default LibrarianLoansPage;
