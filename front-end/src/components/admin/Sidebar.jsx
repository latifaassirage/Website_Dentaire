import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const adminData = { name: "Dr. Martin", role: "Chirurgien Dentiste" };

    const menuItems = [
        { path: '/admin/dashboard', icon: '📊', label: 'Accueil' },
        { path: '/admin/agenda', icon: '📅', label: 'Agenda' },
        { path: '/admin/patients', icon: '👥', label: 'Patients' },
        { path: '/admin/finance', icon: '💰', label: 'Finance' },
        { path: '/admin/parameters', icon: '⚙️', label: 'Paramètres' },
    ];

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <div className="admin-avatar">{adminData.name.charAt(4)}</div>
                <h4>{adminData.name}</h4>
                <p>{adminData.role}</p>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button onClick={() => { localStorage.clear(); window.location.href='/'; }}>🚪 Déconnexion</button>
            </div>
        </div>
    );
};

export default Sidebar;
