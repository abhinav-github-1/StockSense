import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Package,
} from 'lucide-react';
import { getReorderRecommendations } from '../services/reorderService';

export default function Reorder() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
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

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getReorderRecommendations();
      setRecommendations(data || []);
    } catch (err) {
      console.error('Error fetching reorder recommendations:', err);
      setError('Unable to load reorder recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const totalRecommendedUnits = recommendations.reduce(
    (sum, item) => sum + (item.recommendedOrderQuantity || 0),
    0
  );

  return (
    <div className="reorder-page">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Reorder Recommendations</h1>
          <p className="dashboard-subtitle">Products that may need replenishment based on current inventory levels</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/alerts" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            View Alerts
          </Link>
          <Link to="/products" className="btn-primary" style={{ width: 'auto', marginTop: 0, textDecoration: 'none' }}>
            View Products
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
          <button className="btn-refresh" onClick={fetchRecommendations} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Metric Summary Cards */}
      <div className="secondary-metrics-grid">
        <div className="metric-box">
          <div className="metric-box-title">
            <ShoppingBag size={18} className="text-blue" />
            <span>Products Requiring Reorder</span>
          </div>
          <div className="metric-box-value text-blue">{recommendations.length} products</div>
        </div>

        <div className="metric-box">
          <div className="metric-box-title">
            <Package size={18} className="text-amber" />
            <span>Total Recommended Units</span>
          </div>
          <div className="metric-box-value text-amber">{totalRecommendedUnits} units</div>
        </div>
      </div>

      {/* Reorder Data Table Card */}
      <div className="dashboard-card">
        {loading ? (
          <div className="loading-spinner-container" style={{ height: '220px' }}>
            <RefreshCw className="spin-icon" size={24} />
            <p style={{ marginLeft: '0.75rem' }}>Loading reorder recommendations...</p>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Current Stock</th>
                  <th>Reorder Level</th>
                  <th>Target Stock</th>
                  <th>Recommended Order</th>
                  <th>Supplier</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((item, idx) => (
                  <tr key={item.productId || idx}>
                    <td className="font-semibold">{item.productName}</td>
                    <td className="text-muted">{item.sku || '—'}</td>
                    <td className="font-semibold text-amber">{item.currentQuantity}</td>
                    <td className="text-muted">{item.reorderLevel}</td>
                    <td className="text-muted">{item.targetStock || '—'}</td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.85rem', padding: '0.3rem 0.65rem' }}>
                        +{item.recommendedOrderQuantity} units
                      </span>
                    </td>
                    <td className="text-muted">{item.supplierName || '—'}</td>
                    <td className="text-muted">{formatDate(item.expiryDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted" style={{ padding: '3rem 1rem' }}>
            <CheckCircle size={40} style={{ color: 'var(--success-color)', marginBottom: '0.75rem' }} />
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '0.3rem' }}>All products are sufficiently stocked</h3>
            <p style={{ fontSize: '0.9rem' }}>No replenishment orders are needed at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
