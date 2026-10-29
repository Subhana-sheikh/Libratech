import React, { useState, useEffect } from 'react';
import { Search, DollarSign, CheckCircle2, ShieldAlert, Edit2 } from 'lucide-react';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Alert from '../../components/ui/Alert.jsx';

export const LibrarianFinesPage = () => {
  const [fines, setFines] = useState([]);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Edit/Payment Modal State
  const [selectedFine, setSelectedFine] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('PAID');
  const [paidAmount, setPaidAmount] = useState(0);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchFines = async () => {
    setLoading(true);
    try {
      const res = await api.get('/fines', {
        status: status !== 'all' ? status : '',
        search,
        page,
        limit: 15
      });
      if (res.success) {
        setFines(res.data || []);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, [status, search, page]);

  const openPaymentModal = (fine) => {
    setSelectedFine(fine);
    setPaymentStatus(fine.status === 'PAID' ? 'PAID' : 'PAID');
    setPaidAmount(fine.amount);
    setNote('');
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    if (!selectedFine) return;

    setSubmitting(true);
    try {
      const res = await api.patch(`/fines/${selectedFine._id}/payment-status`, {
        status: paymentStatus,
        paidAmount: Number(paidAmount),
        note: note || `Payment recorded by staff`
      });

      if (res.success) {
        setFeedback(`Fine record updated successfully.`);
        setSelectedFine(null);
        fetchFines();
      }
    } catch (err) {
      setFeedback(`Failed to update fine: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Fine Management & Auditing
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review assessed library penalties, record student payments, and manage fee adjustments.
        </p>
      </div>

      {feedback && (
        <Alert type="info" onClose={() => setFeedback('')}>
          {feedback}
        </Alert>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or book..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#151A24] text-white rounded-xl border border-[#232A3B] focus:outline-none focus:border-[#FF4B4B] placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-[#151A24] border border-[#232A3B] p-1 rounded-xl">
          {['all', 'UNPAID', 'PAID', 'WAIVED'].map((st) => (
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

      {/* Table Card */}
      <Card>
        {loading ? (
          <TableSkeleton rows={5} />
        ) : fines.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No fine records found"
            description="No fines match the current search or status filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#232A3B] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Student</th>
                  <th className="pb-3 px-3">Book Title</th>
                  <th className="pb-3 px-3">Reason</th>
                  <th className="pb-3 px-3">Amount Due</th>
                  <th className="pb-3 px-3">Recorded Paid</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232A3B]">
                {fines.map((f) => (
                  <tr key={f._id} className="hover:bg-[#151A24]/90 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">
                      {f.userId?.name}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {f.userId?.studentId || f.userId?.email}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-200 font-medium">
                      {f.loanId?.bookId?.title || 'Library Loan'}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {f.reason}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-200">
                      ₹{f.amount}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      ₹{f.paidAmount || 0}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          f.status === 'PAID' ? 'success' :
                          f.status === 'WAIVED' ? 'neutral' :
                          f.status === 'PARTIALLY_PAID' ? 'warning' : 'danger'
                        }
                        size="sm"
                      >
                        {f.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openPaymentModal(f)}
                      >
                        Update Status
                      </Button>
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

      {/* Edit Payment Modal */}
      {selectedFine && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedFine(null)}
          title="Update Fine Payment Status"
        >
          <form onSubmit={handleUpdatePayment} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p>Borrower: <strong>{selectedFine.userId?.name}</strong></p>
              <p>Book: <strong>{selectedFine.loanId?.bookId?.title}</strong></p>
              <p>Assessed Fine: <strong className="text-rose-600">₹{selectedFine.amount}</strong></p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                New Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-slate-200"
              >
                <option value="PAID">PAID (Full payment received)</option>
                <option value="PARTIALLY_PAID">PARTIALLY_PAID</option>
                <option value="WAIVED">WAIVED (Administrative waiver)</option>
                <option value="UNPAID">UNPAID</option>
              </select>
            </div>

            <Input
              label="Paid Amount (₹)"
              type="number"
              min="0"
              max={selectedFine.amount}
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />

            <Input
              label="Audit Note / Reason"
              placeholder="e.g. Paid in cash at desk / Medical excuse waiver"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelectedFine(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={submitting}>
                Save Payment Record
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};

export default LibrarianFinesPage;
