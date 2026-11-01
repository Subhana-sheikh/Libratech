import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Search, Edit2, Trash2, Archive, ExternalLink } from 'lucide-react';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { BOOKS_DATA } from '../../data/libraryData.js';

export const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    authors: '',
    isbn: '',
    totalCopies: 1,
    publisher: '',
    publicationYear: ''
  });
  const [saving, setSaving] = useState(false);

  // Delete/Archive Confirmation State
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/books', {
        search,
        page,
        limit: 15
      });
      if (res.success && res.data && res.data.length > 0) {
        setBooks(res.data || []);
        if (res.pagination) setPagination(res.pagination);
      } else {
        setBooks(BOOKS_DATA);
        setPagination({ page: 1, pages: 1, total: BOOKS_DATA.length });
      }
    } catch (err) {
      let filtered = [...BOOKS_DATA];
      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(b => b.title.toLowerCase().includes(q) || b.isbn.toLowerCase().includes(q));
      }
      setBooks(filtered);
      setPagination({ page: 1, pages: 1, total: filtered.length });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, page]);

  const openEditModal = (b) => {
    setEditingBook(b);
    setEditForm({
      title: b.title,
      authors: Array.isArray(b.authors) ? b.authors.join(', ') : b.authors,
      isbn: b.isbn || '',
      totalCopies: b.totalCopies,
      publisher: b.publisher || '',
      publicationYear: b.publicationYear || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingBook) return;

    setSaving(true);
    try {
      const res = await api.patch(`/books/${editingBook._id}`, {
        title: editForm.title,
        authors: editForm.authors.split(',').map(s => s.trim()),
        isbn: editForm.isbn || undefined,
        totalCopies: Number(editForm.totalCopies),
        publisher: editForm.publisher,
        publicationYear: editForm.publicationYear ? Number(editForm.publicationYear) : undefined
      });

      if (res.success) {
        setMessage('Book updated successfully.');
        setEditingBook(null);
        fetchBooks();
      }
    } catch (err) {
      setMessage(`Update failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/books/${bookToDelete._id}`);
      if (res.success) {
        setMessage(res.message || 'Book removed.');
        setBookToDelete(null);
        fetchBooks();
      }
    } catch (err) {
      setMessage(`Deletion error: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Book Catalogue & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage catalogue records, add physical stock, and inspect accession barcodes.
          </p>
        </div>

        <Link to="/admin/books/new">
          <Button variant="primary" size="sm" icon={Plus}>
            Add New Book
          </Button>
        </Link>
      </div>

      {message && (
        <Alert type="info" onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#151A24] text-white rounded-xl border border-[#232A3B] focus:outline-none focus:border-[#FF4B4B] placeholder-slate-500"
        />
      </div>

      {/* Books Table Card */}
      <Card>
        {loading ? (
          <TableSkeleton rows={6} />
        ) : books.length === 0 ? (
          <EmptyState
            title="No books in catalogue"
            description="Add your first book title to start managing university inventory."
            actionLabel="Add New Book"
            onAction={() => window.location.href = '/admin/books/new'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#232A3B] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Title & Author</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">ISBN</th>
                  <th className="pb-3 px-3">Stock (Available / Total)</th>
                  <th className="pb-3 px-3">Loans Count</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232A3B]">
                {books.map((b) => (
                  <tr key={b._id} className="hover:bg-[#151A24]/90 transition-colors">
                    <td className="py-3 px-3">
                      <Link to={`/books/${b._id}`} className="font-semibold text-white hover:text-[#FF4B4B] block line-clamp-1 transition-colors">
                        {b.title}
                      </Link>
                      <span className="text-[11px] text-slate-400">
                        {Array.isArray(b.authors) ? b.authors.join(', ') : b.authors}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="neutral" size="sm">{b.categoryId?.name || 'General'}</Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {b.isbn || 'N/A'}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={b.availableCopies > 0 ? 'success' : 'danger'} size="sm">
                        {b.availableCopies} of {b.totalCopies} on shelf
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200">
                      {b.popularityCount} checkouts
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1 text-slate-400 hover:text-[#FF4B4B] transition-colors"
                        title="Edit Book Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setBookToDelete(b)}
                        className="p-1 text-slate-400 hover:text-[#FF4B4B] transition-colors"
                        title="Archive or Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

      {/* Edit Book Modal */}
      {editingBook && (
        <Modal
          isOpen={true}
          onClose={() => setEditingBook(null)}
          title="Edit Book Details"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <Input
              label="Title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              required
            />
            <Input
              label="Authors (comma-separated)"
              value={editForm.authors}
              onChange={(e) => setEditForm({ ...editForm, authors: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="ISBN"
                value={editForm.isbn}
                onChange={(e) => setEditForm({ ...editForm, isbn: e.target.value })}
              />
              <Input
                label="Total Copies"
                type="number"
                min="1"
                value={editForm.totalCopies}
                onChange={(e) => setEditForm({ ...editForm, totalCopies: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Publisher"
                value={editForm.publisher}
                onChange={(e) => setEditForm({ ...editForm, publisher: e.target.value })}
              />
              <Input
                label="Publication Year"
                type="number"
                value={editForm.publicationYear}
                onChange={(e) => setEditForm({ ...editForm, publicationYear: e.target.value })}
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditingBook(null)}>Cancel</Button>
              <Button variant="primary" type="submit" loading={saving}>Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete / Archive Confirmation */}
      <ConfirmationDialog
        isOpen={!!bookToDelete}
        onClose={() => setBookToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Archive or Delete Book"
        message={`Are you sure you want to delete or archive "${bookToDelete?.title}"? If historical loan records exist for this title, it will be safely archived without breaking audit logs.`}
        confirmText="Confirm Delete/Archive"
        loading={deleting}
      />

    </div>
  );
};

export default AdminBooksPage;
