import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Archive,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Package,
  IndianRupee,
} from 'lucide-react';
import {
  getDeadStockSummary,
  getDeadStockProducts,
} from '../services/deadStockService';

export default function DeadStock() {
  const [summary, setSummary] = useState({
    deadStockCount: 0,
    totalDeadStockQuantity: 0,
    totalDeadStockValue: 0,
  });
  const [deadStockList, setDeadStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No stock-out recorded';
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

  const fetchDeadStockData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sumData, listData] = await Promise.all([
        getDeadStockSummary(),
        getDeadStockProducts(),
      ]);

      setSummary(sumData || { deadStockCount: 0, totalDeadStockQuantity: 0, totalDeadStockValue: 0 });
      setDeadStockList(listData || []);
    } catch (err) {
      console.error('Error fetching dead stock information:', err);
      setError('Unable to load dead stock information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeadStockData();
  }, []);

  return (
    <div className="dead-stock-page">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dead Stock</h1>
          <p className="dashboard-subtitle">Identify inventory items with zero movement over extended periods</p>
        </div>

        <Link to="/products" className="btn-primary" style={{ width: 'auto', marginTop: 0, textDecoration: 'none' }}>
          View Products
        </Link>
      </div>

      {/* Error Banner with Retry */}
      {error && (
        <div className="alert-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
          <button className="btn-refresh" onClick={fetchDeadStockData} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-amber">
            <Archive size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Dead Products</span>
            <span className="kpi-value text-amber">{summary.deadStockCount || 0}</span>
            <span className="kpi-subtext">Unmoved items</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-blue">
            <Package size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Units Held</span>
            <span className="kpi-value text-blue">{summary.totalDeadStockQuantity || 0}</span>
            <span className="kpi-subtext">Total stagnant quantity</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-purple">
            <IndianRupee size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Capital Tied Up</span>
            <span className="kpi-value text-purple">{formatCurrency(summary.totalDeadStockValue)}</span>
            <span className="kpi-subtext">Total inventory value</span>
          </div>
        </div>
      </div>

      {/* Dead Stock Data Table Card */}
      <div className="dashboard-card">
        {loading ? (
          <div className="loading-spinner-container" style={{ height: '220px' }}>
            <RefreshCw className="spin-icon" size={24} />
            <p style={{ marginLeft: '0.75rem' }}>Loading dead stock...</p>
          </div>
        ) : deadStockList.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Current Quantity</th>
                  <th>Last Stock Out</th>
                  <th>Days Since Last Movement</th>
                  <th>Supplier</th>
                  <th>Inventory Value</th>
                </tr>
              </thead>
              <tbody>
                {deadStockList.map((item, idx) => (
                  <tr key={item.productId || idx}>
                    <td className="font-semibold">{item.productName}</td>
                    <td className="text-muted">{item.sku || '—'}</td>
                    <td className="font-semibold">{item.currentQuantity}</td>
                    <td className="text-muted">{formatDate(item.lastStockOutDate)}</td>
                    <td className="font-semibold text-amber">
                      {item.daysSinceLastStockOut != null ? `${item.daysSinceLastStockOut} days` : '—'}
                    </td>
                    <td className="text-muted">{item.supplierName || '—'}</td>
                    <td className="font-semibold text-purple">
                      {formatCurrency(item.inventoryValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted" style={{ padding: '3rem 1rem' }}>
            <CheckCircle size={40} style={{ color: 'var(--success-color)', marginBottom: '0.75rem' }} />
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '0.3rem' }}>No dead stock detected</h3>
            <p style={{ fontSize: '0.9rem' }}>All inventory items have active movement within the threshold.</p>
          </div>
        )}
      </div>
    </div>
  );
}
