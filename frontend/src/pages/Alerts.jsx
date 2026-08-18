import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  XCircle,
  RefreshCw,
  ArrowRight,
  PackageCheck,
} from 'lucide-react';
import {
  getAlertSummary,
  getLowStockAlerts,
  getExpiringSoonAlerts,
  getExpiredAlerts,
} from '../services/alertService';

export default function Alerts() {
  const [activeTab, setActiveTab] = useState('lowStock'); // 'lowStock' | 'expiringSoon' | 'expired'
  const [summary, setSummary] = useState({
    lowStockCount: 0,
    expiringSoonCount: 0,
    expiredCount: 0,
  });

  const [lowStockList, setLowStockList] = useState([]);
  const [expiringSoonList, setExpiringSoonList] = useState([]);
  const [expiredList, setExpiredList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const fetchAlertsData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sumData, lowData, expSoonData, expiredData] = await Promise.all([
        getAlertSummary(),
        getLowStockAlerts(),
        getExpiringSoonAlerts(),
        getExpiredAlerts(),
      ]);

      setSummary(sumData || { lowStockCount: 0, expiringSoonCount: 0, expiredCount: 0 });
      setLowStockList(lowData || []);
      setExpiringSoonList(expSoonData || []);
      setExpiredList(expiredData || []);
    } catch (err) {
      console.error('Error fetching inventory alerts:', err);
      setError('Unable to load inventory alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsData();
  }, []);

  return (
    <div className="alerts-page">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Inventory Alerts</h1>
          <p className="dashboard-subtitle">Products requiring attention due to low stock or expiry</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/products" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            View Products
          </Link>
          <Link to="/reorder" className="btn-primary" style={{ width: 'auto', marginTop: 0, textDecoration: 'none' }}>
            View Reorders <ArrowRight size={16} style={{ marginLeft: '0.4rem' }} />
          </Link>
        </div>
      </div>

      {/* Error Banner with Retry */}
      {error && (
        <div className="alert-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
          <button className="btn-refresh" onClick={fetchAlertsData} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="kpi-grid">
        <div
          className={`kpi-card ${activeTab === 'lowStock' ? 'active-tab-card' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('lowStock')}
        >
          <div className="kpi-icon-wrapper bg-amber">
            <AlertTriangle size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Low Stock</span>
            <span className="kpi-value text-amber">{summary.lowStockCount || 0}</span>
            <span className="kpi-subtext">Below reorder threshold</span>
          </div>
        </div>

        <div
          className={`kpi-card ${activeTab === 'expiringSoon' ? 'active-tab-card' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('expiringSoon')}
        >
          <div className="kpi-icon-wrapper bg-blue">
            <Clock size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Expiring Soon</span>
            <span className="kpi-value text-blue">{summary.expiringSoonCount || 0}</span>
            <span className="kpi-subtext">Expiring within 30 days</span>
          </div>
        </div>

        <div
          className={`kpi-card ${activeTab === 'expired' ? 'active-tab-card' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('expired')}
        >
          <div className="kpi-icon-wrapper bg-purple" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger-color)' }}>
            <XCircle size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Expired</span>
            <span className="kpi-value text-red">{summary.expiredCount || 0}</span>
            <span className="kpi-subtext">Past shelf life date</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="dashboard-card" style={{ padding: '0.75rem 1rem' }}>
        <div className="tabs-bar">
          <button
            className={`tab-btn ${activeTab === 'lowStock' ? 'active' : ''}`}
            onClick={() => setActiveTab('lowStock')}
          >
            <AlertTriangle size={16} />
            Low Stock ({summary.lowStockCount || 0})
          </button>

          <button
            className={`tab-btn ${activeTab === 'expiringSoon' ? 'active' : ''}`}
            onClick={() => setActiveTab('expiringSoon')}
          >
            <Clock size={16} />
            Expiring Soon ({summary.expiringSoonCount || 0})
          </button>

          <button
            className={`tab-btn ${activeTab === 'expired' ? 'active' : ''}`}
            onClick={() => setActiveTab('expired')}
          >
            <XCircle size={16} />
            Expired ({summary.expiredCount || 0})
          </button>
        </div>
      </div>

      {/* Main Alerts Data Table Card */}
      <div className="dashboard-card">
        {loading ? (
          <div className="loading-spinner-container" style={{ height: '220px' }}>
            <RefreshCw className="spin-icon" size={24} />
            <p style={{ marginLeft: '0.75rem' }}>Loading alerts...</p>
          </div>
        ) : (
          <div>
            {/* LOW STOCK TAB CONTENT */}
            {activeTab === 'lowStock' && (
              lowStockList.length > 0 ? (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Current Quantity</th>
                        <th>Reorder Level</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockList.map((item, idx) => (
                        <tr key={item.productId || idx}>
                          <td className="font-semibold">{item.productName}</td>
                          <td className="text-muted">{item.sku || '—'}</td>
                          <td className="font-semibold text-amber">{item.currentQuantity}</td>
                          <td className="text-muted">{item.reorderLevel}</td>
                          <td>
                            <span className="badge badge-warning">LOW STOCK</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted" style={{ padding: '3rem 1rem' }}>
                  <PackageCheck size={36} style={{ color: 'var(--success-color)', marginBottom: '0.5rem' }} />
                  <p>No low-stock products.</p>
                </div>
              )
            )}

            {/* EXPIRING SOON TAB CONTENT */}
            {activeTab === 'expiringSoon' && (
              expiringSoonList.length > 0 ? (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Quantity</th>
                        <th>Expiry Date</th>
                        <th>Days Remaining</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expiringSoonList.map((item, idx) => (
                        <tr key={item.productId || idx}>
                          <td className="font-semibold">{item.productName}</td>
                          <td className="text-muted">{item.sku || '—'}</td>
                          <td>{item.currentQuantity}</td>
                          <td className="text-muted">{formatDate(item.expiryDate)}</td>
                          <td className="font-semibold text-blue">
                            {item.daysRemaining != null ? `${item.daysRemaining} days` : '—'}
                          </td>
                          <td>
                            <span className="badge badge-info">EXPIRING SOON</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted" style={{ padding: '3rem 1rem' }}>
                  <PackageCheck size={36} style={{ color: 'var(--success-color)', marginBottom: '0.5rem' }} />
                  <p>No products are expiring within the alert period.</p>
                </div>
              )
            )}

            {/* EXPIRED TAB CONTENT */}
            {activeTab === 'expired' && (
              expiredList.length > 0 ? (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Quantity</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expiredList.map((item, idx) => (
                        <tr key={item.productId || idx}>
                          <td className="font-semibold">{item.productName}</td>
                          <td className="text-muted">{item.sku || '—'}</td>
                          <td>{item.currentQuantity}</td>
                          <td className="text-muted">{formatDate(item.expiryDate)}</td>
                          <td>
                            <span className="badge badge-out-of-stock">EXPIRED</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted" style={{ padding: '3rem 1rem' }}>
                  <PackageCheck size={36} style={{ color: 'var(--success-color)', marginBottom: '0.5rem' }} />
                  <p>No expired products.</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
