import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Accueil', icon: '🏠' },
    { path: '/admin/agenda', label: 'Agenda', icon: '📅' },
    { path: '/admin/patients', label: 'Patients', icon: '👥' },
    { path: '/admin/finance', label: 'Finance', icon: '💰' },
    { path: '/admin/config', label: 'Paramètres', icon: '⚙️' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>DentalFlow</h2>
          <span className="admin-badge">Admin</span>
        </div>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`navbar-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="navbar-actions">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-label">Déconnexion</span>
          </button>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
