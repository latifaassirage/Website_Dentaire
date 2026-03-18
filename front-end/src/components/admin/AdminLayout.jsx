import React from 'react';
import Sidebar from './Sidebar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => (
    <div className="admin-layout-wrapper">
        <Sidebar />
        <div className="admin-main-content">
            <header className="top-nav-search">
                <input type="search" placeholder="Rechercher un patient..." />
            </header>
            <div className="page-body-container">
                {children}
            </div>
        </div>
    </div>
);

export default AdminLayout;
