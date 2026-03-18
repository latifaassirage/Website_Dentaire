import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import './History.css';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await dashboardAPI.getPatientData();
                setHistory(response.data.history || []);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getStatusBadge = (status) => {
        const badges = {
            confirmed: { text: 'Confirmé', class: 'badge-confirmed' },
            pending: { text: 'En attente', class: 'badge-pending' },
            cancelled: { text: 'Annulé', class: 'badge-cancelled' },
            completed: { text: 'Terminé', class: 'badge-completed' }
        };
        const badge = badges[status] || badges.pending;
        return <span className={badge.class}>{badge.text}</span>;
    };

    const getServiceIcon = (service) => {
        const icons = {
            'consultation': '👨‍⚕️',
            'detartrage': '🦷',
            'orthodontie': '🦷',
            'implantologie': '🔧',
            'blanchiment': '✨',
            'conservation': '🛡️',
            'prothese': '🦷',
            'depistage': '🔍',
            'urgence': '🚨'
        };
        return icons[service] || '🦷';
    };

    if (loading) {
        return (
            <div className="glass-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Chargement de l'historique...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-container">
            <header className="page-header">
                <h1>📜 Historique des rendez-vous</h1>
                <p className="header-subtitle">Consultez tous vos rendez-vous passés</p>
            </header>

            <div className="stats-grid">
                <div className="glass-card stat-card">
                    <div className="stat-number">{history.length}</div>
                    <div className="stat-label">Total RDV</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-number">{history.filter(h => h.status === 'completed').length}</div>
                    <div className="stat-label">Terminés</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-number">{history.filter(h => h.status === 'cancelled').length}</div>
                    <div className="stat-label">Annulés</div>
                </div>
            </div>

            <div className="history-list">
                {history.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <h3>Aucun rendez-vous</h3>
                        <p>Vous n'avez pas encore d'historique de rendez-vous</p>
                    </div>
                ) : (
                    history.map((item) => (
                        <div key={item.id} className="glass-card history-item">
                            <div className="history-date">
                                <div className="date-day">
                                    {new Date(item.date_appointment).getDate()}
                                </div>
                                <div className="date-month">
                                    {new Date(item.date_appointment).toLocaleDateString('fr-FR', { month: 'short' })}
                                </div>
                                <div className="date-year">
                                    {new Date(item.date_appointment).getFullYear()}
                                </div>
                            </div>
                            <div className="history-details">
                                <div className="history-header-info">
                                    <div className="service-info">
                                        <span className="service-icon">{getServiceIcon(item.type_soin)}</span>
                                        <h3>{item.type_soin}</h3>
                                    </div>
                                    {getStatusBadge(item.status)}
                                </div>
                                <div className="history-time">
                                    <span className="time-label">Heure:</span>
                                    <span className="time-value">
                                        {new Date(item.date_appointment).toLocaleTimeString('fr-FR', { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </span>
                                </div>
                                {item.notes && (
                                    <div className="history-notes">
                                        <span className="notes-label">Notes:</span>
                                        <span className="notes-value">{item.notes}</span>
                                    </div>
                                )}
                            </div>
                            <div className="history-actions">
                                <button className="glass-button small secondary">
                                    📋 Voir détails
                                </button>
                                {item.status === 'completed' && (
                                    <button className="glass-button small primary">
                                        💳 Payer
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default History;
