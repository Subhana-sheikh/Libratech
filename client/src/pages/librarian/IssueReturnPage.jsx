import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowLeftRight, Search, CheckCircle2, AlertCircle, BookOpen,
  User, Check, Clock, DollarSign, QrCode
} from 'lucide-react';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Alert from '../../components/ui/Alert.jsx';
import BarcodeScannerModal from '../../components/circulation/BarcodeScannerModal.jsx';

export const IssueReturnPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'return' ? 'return' : 'issue';

  const [mode, setMode] = useState(initialMode);
  const [scannerOpen, setScannerOpen] = useState(false);

  // Issue Workflow State
  const [studentSearch, setStudentSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [bookSearch, setBookSearch] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCopyId, setSelectedCopyId] = useState('');
  const [issueLoading, setIssueLoading] = useState(false);

  // Return Workflow State
  const [loanSearch, setLoanSearch] = useState('');
  const [activeLoans, setActiveLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [returnLoading, setReturnLoading] = useState(false);

  // Feedback State
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Search students for issue
  useEffect(() => {
    if (studentSearch.trim().length >= 2) {
      api.get('/users', { role: 'STUDENT', search: studentSearch, limit: 5 })
        .then(res => {
          if (res.success) setStudents(res.data || []);
        })
        .catch(console.error);
    } else {
      setStudents([]);
    }
  }, [studentSearch]);

  // Search books for issue
  useEffect(() => {
    if (bookSearch.trim().length >= 2) {
      api.get('/books', { search: bookSearch, availability: 'available', limit: 5 })
        .then(res => {
          if (res.success) setBooks(res.data || []);
        })
        .catch(console.error);
    } else {
      setBooks([]);
    }
  }, [bookSearch]);

  // Fetch book details when selected (to get copies)
  useEffect(() => {
    if (selectedBook?._id) {
      api.get(`/books/${selectedBook._id}`)
        .then(res => {
          if (res.success && res.data) {
            setSelectedBook(res.data);
            const availableCopies = (res.data.copies || []).filter(c => c.status === 'AVAILABLE');
            if (availableCopies.length > 0) {
              setSelectedCopyId(availableCopies[0]._id);
            }
          }
        })
        .catch(console.error);
    }
  }, [selectedBook?._id]);

  // Search active loans for return
  const searchReturnLoans = async () => {
    try {
      const res = await api.get('/loans', {
        status: 'ACTIVE',
        search: loanSearch,
        limit: 10
      });
      if (res.success) {
        setActiveLoans(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (mode === 'return') {
      searchReturnLoans();
    }
  }, [mode, loanSearch]);

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedBook) {
      setErrorMessage('Please select both a student and an available book.');
      return;
    }

    setIssueLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.post('/loans/issue', {
        userId: selectedStudent._id,
        bookId: selectedBook._id,
        bookCopyId: selectedCopyId || undefined
      });

      if (res.success) {
        setSuccessMessage(`Successfully issued "${selectedBook.title}" to ${selectedStudent.name}. Due date: ${new Date(res.data.dueAt).toLocaleDateString()}.`);
        setSelectedStudent(null);
        setSelectedBook(null);
        setStudentSearch('');
        setBookSearch('');
      } else {
        throw new Error(res.message || 'Issue operation failed.');
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIssueLoading(false);
    }
  };

  const handleReturnSubmit = async (loanId) => {
    if (!loanId) return;

    setReturnLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.post(`/loans/${loanId}/return`);
      if (res.success) {
        const fineInfo = res.data?.fineBreakdown;
        let msg = `Successfully returned "${res.data?.loan?.bookId?.title}". Inventory restored!`;
        if (fineInfo && fineInfo.fineAmount > 0) {
          msg += ` Fine assessed: ₹${fineInfo.fineAmount} (${fineInfo.overdueDays} days late).`;
        }
        setSuccessMessage(msg);
        setSelectedLoan(null);
        searchReturnLoans();
      } else {
        throw new Error(res.message || 'Return operation failed.');
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setReturnLoading(false);
    }
  };

  const handleScanResolved = (result) => {
    if (result.suggestedAction === 'RETURN' && result.activeLoan) {
      setMode('return');
      setSelectedLoan(result.activeLoan);
    } else if (result.book) {
      setMode('issue');
      setSelectedBook(result.book);
      if (result.copy) {
        setSelectedCopyId(result.copy._id);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header with Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Circulation Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Authoritative issue, return, and inventory transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setScannerOpen(true)}
            icon={QrCode}
          >
            Barcode Scanner
          </Button>

          <div className="flex bg-[#151A24] border border-[#232A3B] p-1 rounded-xl">
            <button
              onClick={() => { setMode('issue'); setSearchParams({ mode: 'issue' }); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'issue' ? 'bg-[#FF4B4B] text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Issue Book
            </button>
            <button
              onClick={() => { setMode('return'); setSearchParams({ mode: 'return' }); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'return' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Return Book
            </button>
          </div>
        </div>
      </div>

      {/* Global Alerts */}
      {successMessage && (
        <Alert type="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert type="error" onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {/* ISSUE WORKSPACE */}
      {mode === 'issue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Step 1: Select Student */}
          <Card>
            <CardHeader
              title="1. Select Student Borrower"
              subtitle="Search by name, student ID, or registered email."
            />

            {selectedStudent ? (
              <div className="p-4 bg-[#080B12] rounded-xl border border-[#232A3B] flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedStudent.name}</h4>
                  <p className="text-xs text-slate-400">{selectedStudent.email}</p>
                  <p className="text-xs text-slate-300 mt-1">
                    ID: <strong>{selectedStudent.studentId || 'N/A'}</strong> • Dept: {selectedStudent.department || 'N/A'}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="success" size="sm">Eligible</Badge>
                    <span className="text-[11px] text-slate-400">
                      Active loans: {selectedStudent.activeLoansCount || 0}/4
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStudent(null)}
                  className="text-xs text-slate-400 hover:text-[#FF4B4B]"
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  icon={Search}
                  placeholder="Type student name or ID..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />

                {students.length > 0 && (
                  <div className="divide-y divide-[#232A3B] border border-[#232A3B] rounded-xl overflow-hidden max-h-56 overflow-y-auto bg-[#080B12]">
                    {students.map((stu) => (
                      <div
                        key={stu._id}
                        onClick={() => setSelectedStudent(stu)}
                        className="p-3 hover:bg-[#151A24] cursor-pointer transition-colors text-xs flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-white">{stu.name}</p>
                          <p className="text-slate-400 text-[11px]">{stu.email} • {stu.studentId || 'No ID'}</p>
                        </div>
                        <span className="text-xs font-semibold text-[#FF4B4B]">Select →</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Step 2: Select Book */}
          <Card>
            <CardHeader
              title="2. Select Book to Issue"
              subtitle="Search available titles with active shelf stock."
            />

            {selectedBook ? (
              <div className="p-4 bg-[#080B12] rounded-xl border border-[#232A3B] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedBook.title}</h4>
                    <p className="text-xs text-slate-400">
                      by {Array.isArray(selectedBook.authors) ? selectedBook.authors.join(', ') : selectedBook.authors}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="success" size="sm">
                        {selectedBook.availableCopies} available on shelf
                      </Badge>
                      <span className="text-[11px] text-slate-400">ISBN: {selectedBook.isbn || 'N/A'}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSelectedBook(null); setSelectedCopyId(''); }}
                    className="text-xs text-slate-400 hover:text-[#FF4B4B]"
                  >
                    Change
                  </Button>
                </div>

                {/* Physical copy picker */}
                {selectedBook.copies && (
                  <div className="pt-2 border-t border-[#232A3B]">
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      Assign Copy Accession Code
                    </label>
                    <select
                      value={selectedCopyId}
                      onChange={(e) => setSelectedCopyId(e.target.value)}
                      className="w-full text-xs p-2 bg-[#151A24] text-white rounded-lg border border-[#232A3B] focus:outline-none focus:border-[#FF4B4B]"
                    >
                      {selectedBook.copies
                        .filter(c => c.status === 'AVAILABLE')
                        .map(copy => (
                          <option key={copy._id} value={copy._id}>
                            {copy.accessionCode} — Location: {copy.location}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  icon={Search}
                  placeholder="Type book title or ISBN..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                />

                {books.length > 0 && (
                  <div className="divide-y divide-[#232A3B] border border-[#232A3B] rounded-xl overflow-hidden max-h-56 overflow-y-auto bg-[#080B12]">
                    {books.map((b) => (
                      <div
                        key={b._id}
                        onClick={() => setSelectedBook(b)}
                        className="p-3 hover:bg-[#151A24] cursor-pointer transition-colors text-xs flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-white">{b.title}</p>
                          <p className="text-slate-400 text-[11px]">
                            {b.availableCopies} available • {Array.isArray(b.authors) ? b.authors.join(', ') : b.authors}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-[#FF4B4B]">Select →</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Complete Issue Button */}
            <div className="mt-6 pt-4 border-t border-[#232A3B] flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={handleIssueSubmit}
                loading={issueLoading}
                disabled={!selectedStudent || !selectedBook}
                icon={CheckCircle2}
              >
                Confirm Issue (14 Days)
              </Button>
            </div>
          </Card>

        </div>
      )}

      {/* RETURN WORKSPACE */}
      {mode === 'return' && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Return a Borrowed Book"
              subtitle="Search by student name, book title, loan ID, or accession barcode to process returns and calculate fines."
            />

            <div className="relative max-w-md mb-6">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, book title, or code..."
                value={loanSearch}
                onChange={(e) => setLoanSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#080B12] text-white rounded-xl border border-[#232A3B] focus:outline-none focus:border-[#FF4B4B] placeholder-slate-500"
              />
            </div>

            {activeLoans.length === 0 ? (
              <p className="text-center py-10 text-xs text-slate-400">
                No active loans found matching search criteria.
              </p>
            ) : (
              <div className="divide-y divide-[#232A3B]">
                {activeLoans.map((loan) => (
                  <div key={loan._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{loan.bookId?.title}</h4>
                        <Badge variant="neutral" size="sm">{loan.bookCopyId?.accessionCode || 'ACC-N/A'}</Badge>
                      </div>

                      <p className="text-xs text-slate-400 mt-0.5">
                        Borrower: <strong className="text-slate-200">{loan.userId?.name}</strong> ({loan.userId?.studentId || loan.userId?.email})
                      </p>

                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span>Issued: {new Date(loan.issuedAt).toLocaleDateString()}</span>
                        <span>Due: <strong className={loan.isOverdue ? 'text-[#FF4B4B] font-bold' : 'text-slate-200'}>{new Date(loan.dueAt).toLocaleDateString()}</strong></span>
                        {loan.isOverdue && (
                          <Badge variant="danger" size="sm">{loan.overdueDays}d Late</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Assessed Fine</span>
                        <span className={`text-sm font-bold ${loan.projectedFine > 0 ? 'text-[#FF4B4B]' : 'text-slate-400'}`}>
                          ₹{loan.projectedFine || 0}
                        </span>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleReturnSubmit(loan._id)}
                        loading={returnLoading}
                        className="bg-emerald-600 hover:bg-emerald-500 focus:ring-emerald-500 text-white"
                        icon={CheckCircle2}
                      >
                        Confirm Return
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onResolvedAction={handleScanResolved}
      />

    </div>
  );
};

export default IssueReturnPage;
