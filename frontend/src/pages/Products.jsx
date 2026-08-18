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
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';
import { getCategories } from '../services/categoryService';
import { getSuppliers } from '../services/supplierService';
import ProductForm from '../components/products/ProductForm';

export default function Products() {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No expiry';
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

  const getStockStatusTag = (qty, reorderLevel) => {
    if (qty === 0) {
      return <span className="badge badge-out-of-stock">Out of Stock ({qty})</span>;
    }
    if (qty <= reorderLevel) {
      return <span className="badge badge-low-stock">Low Stock ({qty})</span>;
    }
    return <span className="badge badge-in-stock">In Stock ({qty})</span>;
  };

  const loadInitialData = async () => {
    try {
      const [catsRes, supsRes] = await Promise.all([getCategories(), getSuppliers()]);
      setCategories(catsRes || []);
      setSuppliers(supsRes || []);
    } catch (err) {
      console.error('Error loading metadata categories/suppliers:', err);
    }
  };

  const fetchProducts = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts(query);
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Unable to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
    fetchProducts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(searchQuery.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchProducts('');
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (product) => {
    setEditingProduct(product);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setFormLoading(true);
    setFormError('');
    setSuccessMsg('');

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        setSuccessMsg('Product updated successfully.');
      } else {
        await createProduct(payload);
        setSuccessMsg('Product created successfully.');
      }
      setIsFormOpen(false);
      fetchProducts(searchQuery);
    } catch (err) {
      console.error('Error saving product:', err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg && serverMsg.toLowerCase().includes('sku')) {
        setFormError('SKU already exists. Please enter a unique SKU code.');
      } else if (err.response?.status === 403) {
        setFormError('You do not have permission to perform this action.');
      } else {
        setFormError(editingProduct ? 'Unable to update product.' : 'Unable to create product.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    setSuccessMsg('');
    setError('');

    try {
      await deleteProduct(productToDelete.id);
      setSuccessMsg(`Product "${productToDelete.name}" deleted successfully.`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts(searchQuery);
    } catch (err) {
      console.error('Error deleting product:', err);
      setDeleteModalOpen(false);
      if (err.response?.status === 403) {
        setError('You do not have permission to perform this action.');
      } else {
        setError(err.response?.data?.message || 'Unable to delete product.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="products-page">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Products Management</h1>
          <p className="dashboard-subtitle">View, search, and manage inventory products</p>
        </div>

        {isAdmin && (
          <button className="btn-primary" style={{ width: 'auto', marginTop: 0 }} onClick={handleOpenAddForm}>
            <Plus size={18} style={{ marginRight: '0.4rem' }} />
            Add Product
          </button>
        )}
      </div>

      {/* Global Alerts */}
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

      {/* Search Bar */}
      <div className="dashboard-card" style={{ padding: '1rem' }}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="btn-clear-search" onClick={handleClearSearch}>
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="btn-refresh">
            Search
          </button>
        </form>
      </div>

      {/* Products Table Card */}
      <div className="dashboard-card">
        {loading ? (
          <div className="loading-spinner-container" style={{ height: '200px' }}>
            <RefreshCw className="spin-icon" size={24} />
            <p style={{ marginLeft: '0.75rem' }}>Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Reorder Level</th>
                  <th>Expiry Date</th>
                  {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="font-semibold">{p.name}</td>
                    <td className="text-muted">{p.sku}</td>
                    <td>{p.categoryName || 'N/A'}</td>
                    <td>{p.supplierName || 'N/A'}</td>
                    <td className="font-semibold">{formatCurrency(p.price)}</td>
                    <td>{getStockStatusTag(p.quantity, p.reorderLevel)}</td>
                    <td>{p.reorderLevel}</td>
                    <td className="text-muted">{formatDate(p.expiryDate)}</td>
                    {isAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            className="btn-action-edit"
                            title="Edit Product"
                            onClick={() => handleOpenEditForm(p)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="btn-action-delete"
                            title="Delete Product"
                            onClick={() => handleOpenDeleteModal(p)}
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
                <p>No products match your search "{searchQuery}".</p>
                <button
                  className="btn-secondary"
                  style={{ width: 'auto', marginTop: '1rem' }}
                  onClick={handleClearSearch}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <p>No products found in inventory.</p>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        categories={categories}
        suppliers={suppliers}
        loading={formLoading}
        errorMsg={formError}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && productToDelete && (
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
                Are you sure you want to delete <strong>{productToDelete.name}</strong> (SKU: {productToDelete.sku})?
              </p>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                This action cannot be undone.
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
                {deleteLoading ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
