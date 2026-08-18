import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const { username, role, logout } = useAuth();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand-header">
          <span>📦 StockSense</span>
        </div>
        <nav className="nav-menu">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Dashboard
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Products
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Categories
          </NavLink>
          <NavLink to="/suppliers" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Suppliers
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Transactions
          </NavLink>
          <NavLink to="/alerts" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Alerts
          </NavLink>
          <NavLink to="/reorder" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Reorder Recommendations
          </NavLink>
          <NavLink to="/dead-stock" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Dead Stock
          </NavLink>
        </nav>
      </aside>

      <div className="main-wrapper">
        <header className="top-header">
          <div className="user-badge">
            <span>👤 {username}</span>
            <span className="role-tag">{role}</span>
          </div>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
