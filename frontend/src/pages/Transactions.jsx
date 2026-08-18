import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { getProducts } from '../services/productService';
import {
  getTransactions,
  getTransactionsByProduct,
  stockIn,
  stockOut,
} from '../services/transactionService';
import TransactionForm from '../components/transactions/TransactionForm';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('STOCK_IN');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const loadProductsList = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products list:', err);
    }
  };

  const fetchTransactionsList = async (prodId = '') => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (prodId) {
        data = await getTransactionsByProduct(prodId);
      } else {
        data = await getTransactions();
      }
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Unable to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductsList();
    fetchTransactionsList('');
  }, []);

  const handleFilterChange = (e) => {
    const prodId = e.target.value;
    setSelectedProductId(prodId);
    fetchTransactionsList(prodId);
  };

  const handleOpenStockIn = () => {
    setTransactionType('STOCK_IN');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenStockOut = () => {
    setTransactionType('STOCK_OUT');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setFormLoading(true);
    setFormError('');
    setSuccessMsg('');

    try {
      if (transactionType === 'STOCK_IN') {
        await stockIn(payload);
        setSuccessMsg('Stock added successfully.');
      } else {
        await stockOut(payload);
        setSuccessMsg('Stock removed successfully.');
      }
      setIsModalOpen(false);
      
      // Refresh transactions and product quantities
      fetchTransactionsList(selectedProductId);
      loadProductsList();
    } catch (err) {
      console.error('Transaction error:', err);
      const msg = err.response?.data?.message;
      if (msg) {
        setFormError(msg);
      } else if (err.response?.status === 403) {
        setFormError('You do not have permission to perform this action.');
      } else {
        setFormError('Unable to process the transaction.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const selectedProductObj = products.find((p) => String(p.id) === String(selectedProductId));

  return (
    <div className="transactions-page">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            {selectedProductObj
              ? `Transaction History — ${selectedProductObj.name}`
              : 'Inventory Transactions'}
          </h1>
          <p className="dashboard-subtitle">Track and record stock movement across your inventory</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn-primary"
            style={{ width: 'auto', marginTop: 0, backgroundColor: 'var(--success-color)' }}
            onClick={handleOpenStockIn}
          >
            <ArrowUpRight size={18} style={{ marginRight: '0.3rem' }} />
            Stock In
          </button>
          <button
            className="btn-danger"
            style={{ width: 'auto', marginTop: 0 }}
            onClick={handleOpenStockOut}
          >
            <ArrowDownLeft size={18} style={{ marginRight: '0.3rem' }} />
            Stock Out
          </button>
        </div>
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

      {/* Filter Section */}
      <div className="dashboard-card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Filter size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Filter by Product:</span>
          </div>
          <select
            className="form-input"
            style={{ maxWidth: '320px', flex: 1 }}
            value={selectedProductId}
            onChange={handleFilterChange}
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
          {selectedProductId && (
            <button
              className="btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              onClick={() => {
                setSelectedProductId('');
                fetchTransactionsList('');
              }}
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="dashboard-card">
        {loading ? (
          <div className="loading-spinner-container" style={{ height: '200px' }}>
            <RefreshCw className="spin-icon" size={24} />
            <p style={{ marginLeft: '0.75rem' }}>Loading transactions...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Date & Time</th>
                  <th>Performed By</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id || tx.transactionId}>
                    <td className="font-semibold">{tx.productName}</td>
                    <td className="text-muted">{tx.sku || '—'}</td>
                    <td>
                      <span className={`badge ${tx.type === 'STOCK_IN' ? 'badge-stock-in' : 'badge-stock-out'}`}>
                        {tx.type === 'STOCK_IN' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="font-semibold">
                      {tx.type === 'STOCK_IN' ? (
                        <span className="text-green">+{tx.quantity}</span>
                      ) : (
                        <span className="text-red">-{tx.quantity}</span>
                      )}
                    </td>
                    <td className="text-muted">{formatDateTime(tx.transactionDate)}</td>
                    <td>{tx.performedByUsername || 'system'}</td>
                    <td className="text-muted">{tx.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted" style={{ padding: '3rem 1rem' }}>
            {selectedProductId ? (
              <p>No transactions found for this product.</p>
            ) : (
              <p>No inventory transactions yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Modal Form */}
      <TransactionForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        type={transactionType}
        products={products}
        preselectedProductId={selectedProductId}
        loading={formLoading}
        errorMsg={formError}
      />
    </div>
  );
}
