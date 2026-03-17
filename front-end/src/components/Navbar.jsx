import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '15px 8%', background: '#ffffff', boxShadow: '0 2px 15px rgba(0,0,0,0.04)',
      position: 'sticky', top: 0, zIndex: 1000
    }}>
      <div style={{ fontSize: '26px', fontWeight: '800', color: '#00a896', letterSpacing: '-1px' }}>
        Dental<span style={{ color: '#2d3436' }}>Flow</span>
      </div>
      
      <div style={{ display: 'flex', gap: '35px', fontWeight: '600' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#2d3436', fontSize: '15px' }}>Accueil</Link>
        <Link to="/services" style={{ textDecoration: 'none', color: '#2d3436', fontSize: '15px' }}>Services</Link>
        <Link to="/contact" style={{ textDecoration: 'none', color: '#2d3436', fontSize: '15px' }}>Contact</Link>
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link to="/login" style={{ textDecoration: 'none', color: '#00a896', fontWeight: '700' }}>Connexion</Link>
        <Link to="/register" className="btn-dental" style={{ textDecoration: 'none', padding: '10px 22px' }}>S'inscrire</Link>
      </div>
    </nav>
  );
};

export default Navbar;
