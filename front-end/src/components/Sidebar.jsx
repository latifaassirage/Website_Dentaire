import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const role = localStorage.getItem('userRole') || 'patient';
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Utilisateur' };

  const links = role === 'admin' 
    ? [
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/admin/agenda', icon: '📅', label: 'Agenda Interactif' },
        { path: '/admin/patients', icon: '👥', label: 'Dossiers Patients' },
        { path: '/admin/waiting-list', icon: '⏳', label: 'Liste d\'Attente' },
        { path: '/admin/finance', icon: '💰', label: 'Gestion Financière' },
        { path: '/admin/config', icon: '⚙️', label: 'Configuration' }
      ]
    : [
        { path: '/patient/dashboard', icon: '🏠', label: 'Accueil' },
        { path: '/patient/booking', icon: '✨', label: 'Prendre RDV' },
        { path: '/patient/documents', icon: '📂', label: 'Coffre-fort Docs' },
        { path: '/patient/info', icon: '👤', label: 'Mon Profil' }
      ];

  return (
    <div className="sidebar" style={{ width: '260px', height: '100vh', background: '#fff', borderRight: '1px solid #eee', position: 'fixed' }}>
      <div style={{ padding: '30px', color: '#00a896', fontWeight: 'bold', fontSize: '22px' }}>DentalFlow.</div>
      <div style={{ padding: '0 20px 20px', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e0f7f4', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00a896', fontWeight: 'bold' }}>{user.name.charAt(0)}</div>
        <div style={{ fontWeight: '600', fontSize: '14px' }}>{user.name}</div>
        <div style={{ fontSize: '11px', color: 'gray' }}>{role.toUpperCase()}</div>
      </div>
      <nav style={{ padding: '10px' }}>
        {links.map(link => (
          <Link key={link.path} to={link.path} style={{ display: 'flex', alignItems: 'center', padding: '12px 15px', textDecoration: 'none', color: location.pathname === link.path ? '#00a896' : '#636e72', background: location.pathname === link.path ? '#f0fcfb' : 'transparent', borderRadius: '10px', marginBottom: '5px', fontWeight: location.pathname === link.path ? '600' : '400' }}>
            <span style={{ marginRight: '12px' }}>{link.icon}</span> {link.label}
          </Link>
        ))}
      </nav>
      <div style={{ position: 'absolute', bottom: '20px', width: '100%', padding: '0 20px' }}>
         <button onClick={() => { localStorage.clear(); window.location.href='/'; }} style={{ width: '100%', padding: '10px', border: 'none', background: '#fff0f0', color: '#e74c3c', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Déconnexion</button>
      </div>
    </div>
  );
};

export default Sidebar;
