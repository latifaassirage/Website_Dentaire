import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import './DashboardAdmin.css';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    monthlyRevenue: 0,
    revenueChange: 0,
    fillRate: 0,
    waitingList: 0,
    unpaidInvoices: 0,
    unpaidPatients: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="content-body">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-body">
      <h2>Tableau de Bord</h2>
      <div className="stats-grid">
        <div className="glass-card">
          <p className="stat-label">CA Mensuel</p>
          <h2 className="stat-value revenue">{stats.monthlyRevenue.toLocaleString()} MAD</h2>
          <span className={`stat-change ${stats.revenueChange >= 0 ? 'positive' : 'negative'}`}>
            {stats.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueChange)}% vs mois dernier
          </span>
        </div>
        <div className="glass-card">
          <p className="stat-label">Taux de Remplissage</p>
          <h2 className="stat-value">{stats.fillRate}%</h2>
          <span className={`stat-status ${stats.fillRate >= 85 ? 'optimal' : 'warning'}`}>
            {stats.fillRate >= 85 ? 'Optimal' : 'À améliorer'}
          </span>
        </div>
        <div className="glass-card">
          <p className="stat-label">En Liste d'Attente</p>
          <h2 className="stat-value waiting">{stats.waitingList}</h2>
          <span className={`stat-status ${stats.waitingList > 10 ? 'priority' : 'normal'}`}>
            {stats.waitingList > 10 ? 'Prioritaire' : 'Normal'}
          </span>
        </div>
        <div className="glass-card">
          <p className="stat-label">Factures Impayées</p>
          <h2 className="stat-value unpaid">{stats.unpaidInvoices.toLocaleString()} DH</h2>
          <span className="stat-patients">{stats.unpaidPatients} patients</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
