import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import './Payments.css';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await dashboardAPI.getPatientData();
                setPayments(response.data.payments || []);
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const getStatusBadge = (status) => {
        const badges = {
            'paid': { text: 'Payé', class: 'badge-paid' },
            'pending': { text: 'En attente', class: 'badge-pending' },
            'overdue': { text: 'En retard', class: 'badge-overdue' },
            'cancelled': { text: 'Annulé', class: 'badge-cancelled' }
        };
        const badge = badges[status] || badges.pending;
        return <span className={badge.class}>{badge.text}</span>;
    };

    const getTypeLabel = (type) => {
        const labels = {
            'devis': 'Devis',
            'facture': 'Facture'
        };
        return labels[type] || type;
    };

    const getTotalPaid = () => {
        return payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    };

    const getTotalPending = () => {
        return payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    };

    const handlePayment = (payment) => {
        // Logique de paiement
        console.log('Paiement pour:', payment);
        alert(`Fonctionnalité de paiement pour ${payment.type} #${payment.id} - À implémenter`);
    };

    const handleDownload = (payment) => {
        // Logique de téléchargement
        console.log('Téléchargement de:', payment);
        alert(`Téléchargement de ${payment.type} #${payment.id} - À implémenter`);
    };

    if (loading) {
        return (
            <div className="glass-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Chargement des paiements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-container">
            <header className="page-header">
                <h1>💳 Paiements</h1>
                <p className="header-subtitle">Gérez vos factures et paiements</p>
            </header>

            <div className="summary-cards">
                <div className="glass-card summary-card paid">
                    <div className="summary-icon">✅</div>
                    <div className="summary-amount">{getTotalPaid()} DH</div>
                    <div className="summary-label">Payés</div>
                </div>
                <div className="glass-card summary-card pending">
                    <div className="summary-icon">⏳</div>
                    <div className="summary-amount">{getTotalPending()} DH</div>
                    <div className="summary-label">En attente</div>
                </div>
                <div className="glass-card summary-card total">
                    <div className="summary-icon">💰</div>
                    <div className="summary-amount">{getTotalPaid() + getTotalPending()} DH</div>
                    <div className="summary-label">Total</div>
                </div>
            </div>

            <div className="payments-list">
                {payments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">💳</div>
                        <h3>Aucun paiement</h3>
                        <p>Vous n'avez pas encore de factures ou paiements</p>
                    </div>
                ) : (
                    payments.map((payment) => (
                        <div key={payment.id} className="glass-card payment-item">
                            <div className="payment-header">
                                <div className="payment-info">
                                    <h3>{getTypeLabel(payment.type)} #{payment.id}</h3>
                                    <div className="payment-date">
                                        📅 {new Date(payment.created_at).toLocaleDateString('fr-FR', { 
                                            day: 'numeric', 
                                            month: 'long', 
                                            year: 'numeric' 
                                        })}
                                    </div>
                                    {payment.description && (
                                        <div className="payment-description">{payment.description}</div>
                                    )}
                                </div>
                                <div className="payment-amount">
                                    <span className="amount">{payment.amount} DH</span>
                                    {getStatusBadge(payment.status)}
                                </div>
                            </div>
                            <div className="payment-details">
                                <div className="detail-row">
                                    <span className="detail-label">Type:</span>
                                    <span className="detail-value">{getTypeLabel(payment.type)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Statut:</span>
                                    <span className="detail-value">{payment.status}</span>
                                </div>
                                {payment.due_date && (
                                    <div className="detail-row">
                                        <span className="detail-label">Échéance:</span>
                                        <span className="detail-value">
                                            📅 {new Date(payment.due_date).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="payment-actions">
                                <button className="glass-button small secondary">
                                    📄 Voir détail
                                </button>
                                {payment.status === 'pending' && (
                                    <button 
                                        className="glass-button small primary"
                                        onClick={() => handlePayment(payment)}
                                    >
                                        💳 Payer maintenant
                                    </button>
                                )}
                                {payment.status === 'paid' && (
                                    <button 
                                        className="glass-button small success"
                                        onClick={() => handleDownload(payment)}
                                    >
                                        📥 Télécharger
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

export default Payments;
