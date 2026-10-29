import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create/Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: 'BookOpen' });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({ name: '', description: '', icon: 'BookOpen' });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || 'BookOpen' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    try {
      if (editingCategory) {
        await api.patch(`/categories/${editingCategory._id}`, form);
        setFeedback('Category updated.');
      } else {
        await api.post('/categories', form);
        setFeedback('Category created.');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/categories/${categoryToDelete._id}`);
      if (res.success) {
        setFeedback('Category deleted.');
        setCategoryToDelete(null);
        fetchCategories();
      }
    } catch (err) {
      setFeedback(`Deletion failed: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Academic Categories & Disciplines
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize the university catalogue by subjects, disciplines, and study departments.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={openCreateModal} icon={Plus}>
          Add Category
        </Button>
      </div>

      {feedback && (
        <Alert type="info" onClose={() => setFeedback('')}>
          {feedback}
        </Alert>
      )}

      <Card>
        {loading ? (
          <TableSkeleton rows={4} />
        ) : (
          <div className="divide-y divide-[#232A3B]">
            {categories.map((cat) => (
              <div key={cat._id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF4B4B]/10 text-[#FF4B4B] flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                      <Badge variant="neutral" size="sm">{cat.bookCount || 0} books</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-lg">{cat.description || 'No description provided.'}</p>
                    <span className="text-[10px] text-slate-500 font-mono">Slug: {cat.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-slate-400 hover:text-[#FF4B4B] rounded-lg hover:bg-[#151A24] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCategoryToDelete(cat)}
                    className="p-1.5 text-slate-400 hover:text-[#FF4B4B] rounded-lg hover:bg-[#151A24] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setModalOpen(false)}
          title={editingCategory ? 'Edit Category' : 'Create New Category'}
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <Input
              label="Category Name"
              placeholder="e.g. Data Science & Machine Learning"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Scope and subjects covered..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-2.5 bg-[#151A24] text-white rounded-lg border border-[#232A3B] focus:outline-none focus:border-[#FF4B4B]"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit" loading={saving}>
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"? Categories with active books assigned cannot be deleted.`}
        confirmText="Delete Category"
        loading={deleting}
      />

    </div>
  );
};

export default AdminCategoriesPage;
