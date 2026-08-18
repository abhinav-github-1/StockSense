import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';
import CategoryForm from '../components/categories/CategoryForm';

export default function Categories() {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const fetchCategoriesList = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Unable to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesList();
  }, []);

  const handleOpenAddForm = () => {
    setEditingCategory(null);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (category) => {
    setEditingCategory(category);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setFormLoading(true);
    setFormError('');
    setSuccessMsg('');

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, payload);
        setSuccessMsg('Category updated successfully.');
      } else {
        await createCategory(payload);
        setSuccessMsg('Category created successfully.');
      }
      setIsFormOpen(false);
      fetchCategoriesList();
    } catch (err) {
      console.error('Error saving category:', err);
      if (err.response?.status === 403) {
        setFormError('You do not have permission to perform this action.');
      } else {
        setFormError(err.response?.data?.message || (editingCategory ? 'Unable to update category.' : 'Unable to create category.'));
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);
    setSuccessMsg('');
    setError('');

    try {
      await deleteCategory(categoryToDelete.id);
      setSuccessMsg(`Category "${categoryToDelete.name}" deleted successfully.`);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategoriesList();
    } catch (err) {
      console.error('Error deleting category:', err);
      setDeleteModalOpen(false);
      if (err.response?.status === 409) {
        setError('This category cannot be deleted because it is being used by products.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to perform this action.');
      } else {
        setError(err.response?.data?.message || 'Unable to delete category.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="categories-page">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Categories</h1>
          <p className="dashboard-subtitle">Organize products into manageable categories</p>
        </div>

        {isAdmin && (
          <button className="btn-primary" style={{ width: 'auto', marginTop: 0 }} onClick={handleOpenAddForm}>
            <Plus size={18} style={{ marginRight: '0.4rem' }} />
            Add Category
          </button>
        )}
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="dashboard-card" style={{ padding: '1rem' }}>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search categories by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="btn-clear-search" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Categories Table Card */}
      <div className="dashboard-card">
        {loading ? (
          <div className="loading-spinner-container" style={{ height: '200px' }}>
            <RefreshCw className="spin-icon" size={24} />
            <p style={{ marginLeft: '0.75rem' }}>Loading categories...</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Created Date</th>
                  {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((c) => (
                  <tr key={c.id}>
                    <td className="font-semibold">{c.name}</td>
                    <td className="text-muted">{c.description || '—'}</td>
                    <td className="text-muted">{formatDate(c.createdAt)}</td>
                    {isAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            className="btn-action-edit"
                            title="Edit Category"
                            onClick={() => handleOpenEditForm(c)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="btn-action-delete"
                            title="Delete Category"
                            onClick={() => handleOpenDeleteModal(c)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted" style={{ padding: '3rem 1rem' }}>
            {searchQuery ? (
              <div>
                <p>No matching categories found for "{searchQuery}".</p>
                <button
                  className="btn-secondary"
                  style={{ width: 'auto', marginTop: '1rem' }}
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <p>No categories found.</p>
            )}
          </div>
        )}
      </div>

      {/* Modal Form */}
      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCategory}
        loading={formLoading}
        errorMsg={formError}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && categoryToDelete && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="btn-close" onClick={() => setDeleteModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '1rem 0' }}>
              <p>
                Are you sure you want to delete category <strong>{categoryToDelete.name}</strong>?
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
