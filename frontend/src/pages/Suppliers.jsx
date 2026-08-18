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
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../services/supplierService';
import SupplierForm from '../components/suppliers/SupplierForm';

export default function Suppliers() {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
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

  const fetchSuppliersList = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSuppliers();
      setSuppliers(data || []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Unable to load suppliers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliersList();
  }, []);

  const handleOpenAddForm = () => {
    setEditingSupplier(null);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (supplier) => {
    setEditingSupplier(supplier);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setFormLoading(true);
    setFormError('');
    setSuccessMsg('');

    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, payload);
        setSuccessMsg('Supplier updated successfully.');
      } else {
        await createSupplier(payload);
        setSuccessMsg('Supplier created successfully.');
      }
      setIsFormOpen(false);
      fetchSuppliersList();
    } catch (err) {
      console.error('Error saving supplier:', err);
      if (err.response?.status === 403) {
        setFormError('You do not have permission to perform this action.');
      } else {
        setFormError(err.response?.data?.message || (editingSupplier ? 'Unable to update supplier.' : 'Unable to create supplier.'));
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDeleteModal = (supplier) => {
    setSupplierToDelete(supplier);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!supplierToDelete) return;
    setDeleteLoading(true);
    setSuccessMsg('');
    setError('');

    try {
      await deleteSupplier(supplierToDelete.id);
      setSuccessMsg(`Supplier "${supplierToDelete.name}" deleted successfully.`);
      setDeleteModalOpen(false);
      setSupplierToDelete(null);
      fetchSuppliersList();
    } catch (err) {
      console.error('Error deleting supplier:', err);
      setDeleteModalOpen(false);
      if (err.response?.status === 409) {
        setError('This supplier cannot be deleted because it is associated with products.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to perform this action.');
      } else {
        setError(err.response?.data?.message || 'Unable to delete supplier.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.phone && s.phone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="suppliers-page">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Suppliers</h1>
          <p className="dashboard-subtitle">Manage your inventory suppliers</p>
        </div>

        {isAdmin && (
          <button className="btn-primary" style={{ width: 'auto', marginTop: 0 }} onClick={handleOpenAddForm}>
            <Plus size={18} style={{ marginRight: '0.4rem' }} />
            Add Supplier
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
            placeholder="Search suppliers by name, email, or phone..."
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

      {/* Suppliers Table Card */}
      <div className="dashboard-card">
        {loading ? (
          <div className="loading-spinner-container" style={{ height: '200px' }}>
            <RefreshCw className="spin-icon" size={24} />
            <p style={{ marginLeft: '0.75rem' }}>Loading suppliers...</p>
          </div>
        ) : filteredSuppliers.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Supplier Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Created Date</th>
                  {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((s) => (
                  <tr key={s.id}>
                    <td className="font-semibold">{s.name}</td>
                    <td className="text-muted">{s.email || '—'}</td>
                    <td className="text-muted">{s.phone || '—'}</td>
                    <td className="text-muted">{s.address || '—'}</td>
                    <td className="text-muted">{formatDate(s.createdAt)}</td>
                    {isAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            className="btn-action-edit"
                            title="Edit Supplier"
                            onClick={() => handleOpenEditForm(s)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="btn-action-delete"
                            title="Delete Supplier"
                            onClick={() => handleOpenDeleteModal(s)}
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
                <p>No matching suppliers found for "{searchQuery}".</p>
                <button
                  className="btn-secondary"
                  style={{ width: 'auto', marginTop: '1rem' }}
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <p>No suppliers found.</p>
            )}
          </div>
        )}
      </div>

      {/* Modal Form */}
      <SupplierForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSupplier}
        loading={formLoading}
        errorMsg={formError}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && supplierToDelete && (
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
                Are you sure you want to delete supplier <strong>{supplierToDelete.name}</strong>?
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
                {deleteLoading ? 'Deleting...' : 'Delete Supplier'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
