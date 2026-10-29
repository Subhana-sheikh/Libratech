import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Plus, CheckCircle2 } from 'lucide-react';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Alert from '../../components/ui/Alert.jsx';

export const AdminNewBookPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    isbn: '',
    categoryId: '',
    description: '',
    subjects: '',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    language: 'English',
    totalCopies: 3,
    coverImageUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories')
      .then(res => {
        if (res.success && res.data) {
          setCategories(res.data);
          if (res.data.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: res.data[0]._id }));
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.authors || !formData.categoryId) {
      setError('Title, author(s), and category are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/books', {
        ...formData,
        totalCopies: Number(formData.totalCopies),
        publicationYear: formData.publicationYear ? Number(formData.publicationYear) : undefined
      });

      if (res.success) {
        navigate('/admin/books');
      } else {
        throw new Error(res.message || 'Failed to add book');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          to="/admin/books"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#FF4B4B] mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalogue
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Add New Book to Catalogue
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Provide bibliographic details and specify physical copy inventory.
        </p>
      </div>

      <Card>
        {error && (
          <Alert type="error" onClose={() => setError('')} className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Book Title"
            name="title"
            placeholder="e.g. Distributed Systems: Principles and Paradigms"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Authors (comma-separated)"
              name="authors"
              placeholder="e.g. Andrew S. Tanenbaum, Maarten van Steen"
              value={formData.authors}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full text-sm p-2.5 bg-[#151A24] text-white rounded-lg border border-[#232A3B] focus:outline-none focus:border-[#FF4B4B]"
                required
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="ISBN"
              name="isbn"
              placeholder="e.g. 978-0132350884"
              value={formData.isbn}
              onChange={handleChange}
            />

            <Input
              label="Publisher"
              name="publisher"
              placeholder="e.g. Pearson / MIT Press"
              value={formData.publisher}
              onChange={handleChange}
            />

            <Input
              label="Year of Publication"
              name="publicationYear"
              type="number"
              value={formData.publicationYear}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Initial Physical Copies to Add"
              name="totalCopies"
              type="number"
              min="1"
              max="50"
              helperText="Individual accession barcodes will be created automatically"
              value={formData.totalCopies}
              onChange={handleChange}
              required
            />

            <Input
              label="Cover Image URL (Optional)"
              name="coverImageUrl"
              placeholder="https://..."
              value={formData.coverImageUrl}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description & Synopsis
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Detailed description, overview of topics covered..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 text-sm bg-[#151A24] text-white rounded-xl border border-[#232A3B] focus:outline-none focus:border-[#FF4B4B] placeholder-slate-500"
            />
          </div>

          <Input
            label="Subjects / Tags (comma-separated)"
            name="subjects"
            placeholder="e.g. Cloud Computing, Networks, Concurrency"
            value={formData.subjects}
            onChange={handleChange}
          />

          <div className="pt-4 border-t border-[#232A3B] flex justify-end gap-3">
            <Link to="/admin/books">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" variant="primary" loading={loading} icon={Plus}>
              Save and Generate Physical Copies
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminNewBookPage;
