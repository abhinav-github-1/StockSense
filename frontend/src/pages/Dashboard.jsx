import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  IndianRupee,
  AlertTriangle,
  Clock,
  RefreshCw,
  ShoppingCart,
  Archive,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {
  getDashboardSummary,
  getRecentTransactions,
  getStockStatus,
  getInventoryValue,
  getExpiringSoonProducts,
  getReorderRecommendations,
  getDeadStockProducts,
} from '../services/dashboardService';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [stockStatus, setStockStatus] = useState(null);
  const [inventoryValue, setInventoryValue] = useState(null);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [reorderRecommendations, setReorderRecommendations] = useState([]);
  const [deadStock, setDeadStock] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

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

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [
        summaryRes,
        transactionsRes,
        statusRes,
        valueRes,
        expiringRes,
        reorderRes,
        deadRes,
      ] = await Promise.all([
        getDashboardSummary(),
        getRecentTransactions(),
        getStockStatus(),
        getInventoryValue(),
        getExpiringSoonProducts(),
        getReorderRecommendations(),
        getDeadStockProducts(),
      ]);

      setSummary(summaryRes);
      setRecentTransactions(transactionsRes || []);
      setStockStatus(statusRes);
      setInventoryValue(valueRes);
      setExpiringSoon((expiringRes || []).slice(0, 5));
      setReorderRecommendations((reorderRes || []).slice(0, 5));
      setDeadStock((deadRes || []).slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Unable to load dashboard data. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <RefreshCw className="spin-icon" size={24} />
        <p style={{ marginLeft: '0.75rem' }}>Loading dashboard intelligence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="placeholder-card">
        <div className="alert-error">{error}</div>
        <button className="btn-primary" style={{ width: 'auto' }} onClick={loadData}>
          Try Again
        </button>
      </div>
    );
  }

  const stockChartData = stockStatus
    ? [
        { name: 'Healthy Stock', value: stockStatus.healthyStockCount },
        { name: 'Low Stock', value: stockStatus.lowStockCount },
        { name: 'Out of Stock', value: stockStatus.outOfStockCount },
      ]
    : [];

  return (
    <div className="dashboard-page">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">StockSense Dashboard</h1>
          <p className="dashboard-subtitle">Overview of inventory operations & intelligence</p>
        </div>
        <button className="btn-refresh" onClick={loadData}>
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-blue">
            <Package size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Products</span>
            <h3 className="kpi-value">{summary?.totalProducts || 0}</h3>
            <span className="kpi-subtext">{summary?.totalCategories || 0} Categories • {summary?.totalSuppliers || 0} Suppliers</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-green">
            <IndianRupee size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Inventory Value</span>
            <h3 className="kpi-value">{formatCurrency(summary?.totalInventoryValue)}</h3>
            <span className="kpi-subtext">{summary?.totalInventoryQuantity || 0} units in stock</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-amber">
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Low Stock Products</span>
            <h3 className="kpi-value">{summary?.lowStockCount || 0}</h3>
            <span className="kpi-subtext">Requires replenishment</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-purple">
            <Clock size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Expiring Soon</span>
            <h3 className="kpi-value">{summary?.expiringSoonCount || 0}</h3>
            <span className="kpi-subtext">Within 30 days</span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="secondary-metrics-grid">
        <div className="metric-box">
          <div className="metric-box-title">
            <AlertCircle size={16} className="text-red" />
            <span>Expired Products</span>
          </div>
          <div className="metric-box-value text-red">{summary?.expiredCount || 0}</div>
        </div>

        <div className="metric-box">
          <div className="metric-box-title">
            <ShoppingCart size={16} className="text-blue" />
            <span>Reorder Recommended</span>
          </div>
          <div className="metric-box-value text-blue">{summary?.reorderRecommendationCount || 0}</div>
        </div>

        <div className="metric-box">
          <div className="metric-box-title">
            <Archive size={16} className="text-amber" />
            <span>Dead Stock Products</span>
          </div>
          <div className="metric-box-value text-amber">{summary?.deadStockCount || 0}</div>
        </div>

        <div className="metric-box">
          <div className="metric-box-title">
            <IndianRupee size={16} className="text-red" />
            <span>Capital Tied in Dead Stock</span>
          </div>
          <div className="metric-box-value">{formatCurrency(summary?.deadStockValue)}</div>
        </div>
      </div>

      {/* Charts & Capital Section */}
      <div className="dashboard-charts-row">
        {/* Stock Status Donut Chart */}
        <div className="dashboard-card flex-1">
          <h3 className="card-title">Stock Health Status</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stockChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.375rem' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Capital & Value Summary Card */}
        <div className="dashboard-card flex-1">
          <h3 className="card-title">Capital Overview</h3>
          <div className="capital-breakdown">
            <div className="capital-item">
              <span className="capital-label">Total Active Inventory Value</span>
              <span className="capital-amount text-green">{formatCurrency(inventoryValue?.totalInventoryValue)}</span>
            </div>
            <div className="capital-divider"></div>
            <div className="capital-item">
              <span className="capital-label">Capital Tied Up in Dead Stock</span>
              <span className="capital-amount text-amber">{formatCurrency(inventoryValue?.deadStockValue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="dashboard-card margin-top">
        <div className="card-header-row">
          <h3 className="card-title">Recent Inventory Transactions</h3>
          <Link to="/transactions" className="view-all-link">View All</Link>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Performed By</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((tx) => (
                  <tr key={tx.transactionId}>
                    <td className="font-semibold">{tx.productName}</td>
                    <td className="text-muted">{tx.sku}</td>
                    <td>
                      <span className={`badge ${tx.type === 'STOCK_IN' ? 'badge-stock-in' : 'badge-stock-out'}`}>
                        {tx.type === 'STOCK_IN' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                        {tx.type}
                      </span>
                    </td>
                    <td>{tx.quantity}</td>
                    <td className="text-muted">{formatDate(tx.transactionDate)}</td>
                    <td>{tx.performedByUsername}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">No recent transactions recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intelligence Previews Row */}
      <div className="previews-grid margin-top">
        {/* Expiring Soon Preview */}
        <div className="dashboard-card">
          <div className="card-header-row">
            <h3 className="card-title">Expiring Soon (Preview)</h3>
            <Link to="/alerts" className="view-all-link">View All</Link>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Expiry Date</th>
                  <th>Days Left</th>
                </tr>
              </thead>
              <tbody>
                {expiringSoon.length > 0 ? (
                  expiringSoon.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td className="text-muted">{formatDate(item.expiryDate)}</td>
                      <td>
                        <span className="badge badge-warning">{item.daysRemaining} days</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">No products expiring soon.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reorder Recommendations Preview */}
        <div className="dashboard-card">
          <div className="card-header-row">
            <h3 className="card-title">Reorder Required (Preview)</h3>
            <Link to="/reorder" className="view-all-link">View All</Link>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current</th>
                  <th>Target</th>
                  <th>Reorder Qty</th>
                </tr>
              </thead>
              <tbody>
                {reorderRecommendations.length > 0 ? (
                  reorderRecommendations.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.productName}</td>
                      <td>{item.currentQuantity}</td>
                      <td>{item.targetStock}</td>
                      <td>
                        <span className="badge badge-info">+{item.recommendedOrderQuantity}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">No reorder recommendations.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dead Stock Preview */}
        <div className="dashboard-card">
          <div className="card-header-row">
            <h3 className="card-title">Dead Stock (Preview)</h3>
            <Link to="/dead-stock" className="view-all-link">View All</Link>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Days Inactive</th>
                  <th>Tied Value</th>
                </tr>
              </thead>
              <tbody>
                {deadStock.length > 0 ? (
                  deadStock.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.productName}</td>
                      <td>{item.currentQuantity}</td>
                      <td>{item.daysSinceLastStockOut} days</td>
                      <td className="font-semibold">{formatCurrency(item.inventoryValue)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">No dead stock detected.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
