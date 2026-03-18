import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import './PatientDashboard.css';

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
        switch(status) {
            case 'confirmed': return <span className="badge badge-success">Confirmé</span>;
            case 'pending': return <span className="badge badge-warning">En attente</span>;
            case 'cancelled': return <span className="badge badge-danger">Annulé</span>;
            case 'completed': return <span className="badge badge-info">Terminé</span>;
            default: return <span className="badge">{status}</span>;
        }
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
            <div className="patient-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement de l'historique...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="patient-container">
            <header className="patient-header">
                <h1>📜 Historique des rendez-vous</h1>
                <p className="header-subtitle">Consultez tous vos rendez-vous passés</p>
            </header>

            <div className="history-stats">
                <div className="stat-card">
                    <div className="stat-number">{history.length}</div>
                    <div className="stat-label">Total RDV</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{history.filter(h => h.status === 'completed').length}</div>
                    <div className="stat-label">Terminés</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{history.filter(h => h.status === 'cancelled').length}</div>
                    <div className="stat-label">Annulés</div>
                </div>
            </div>

            <div className="history-list">
                {history.length === 0 ? (
                    <div className="no-data">
                        <div className="no-data-icon">📅</div>
                        <h3>Aucun rendez-vous</h3>
                        <p>Vous n'avez pas encore d'historique de rendez-vous</p>
                    </div>
                ) : (
                    history.map((item) => (
                        <div key={item.id} className="history-item">
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
                                <button className="btn-secondary">
                                    📋 Voir détails
                                </button>
                                {item.status === 'completed' && (
                                    <button className="btn-dental">
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
