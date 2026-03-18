import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import './PatientDashboard.css';

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
        switch(status) {
            case 'paid': return <span className="badge badge-success">Payé</span>;
            case 'pending': return <span className="badge badge-warning">En attente</span>;
            case 'overdue': return <span className="badge badge-danger">En retard</span>;
            case 'cancelled': return <span className="badge badge-secondary">Annulé</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    const getTypeLabel = (type) => {
        switch(type) {
            case 'devis': return 'Devis';
            case 'facture': return 'Facture';
            default: return type;
        }
    };

    const getTotalPaid = () => {
        return payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    };

    const getTotalPending = () => {
        return payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    };

    if (loading) {
        return (
            <div className="patient-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement des paiements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="patient-container">
            <header className="patient-header">
                <h1>💳 Paiements</h1>
                <p className="header-subtitle">Gérez vos factures et paiements</p>
            </header>

            <div className="payments-summary">
                <div className="summary-card paid">
                    <div className="summary-amount">{getTotalPaid()} DH</div>
                    <div className="summary-label">Payés</div>
                </div>
                <div className="summary-card pending">
                    <div className="summary-amount">{getTotalPending()} DH</div>
                    <div className="summary-label">En attente</div>
                </div>
                <div className="summary-card total">
                    <div className="summary-amount">{getTotalPaid() + getTotalPending()} DH</div>
                    <div className="summary-label">Total</div>
                </div>
            </div>

            <div className="payments-list">
                {payments.length === 0 ? (
                    <div className="no-data">
                        <div className="no-data-icon">💳</div>
                        <h3>Aucun paiement</h3>
                        <p>Vous n'avez pas encore de factures ou paiements</p>
                    </div>
                ) : (
                    payments.map((payment) => (
                        <div key={payment.id} className="payment-item">
                            <div className="payment-header">
                                <div className="payment-info">
                                    <h3>{getTypeLabel(payment.type)} #{payment.id}</h3>
                                    <div className="payment-date">
                                        {new Date(payment.created_at).toLocaleDateString('fr-FR', { 
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
                                            {new Date(payment.due_date).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="payment-actions">
                                <button className="btn-secondary">
                                    📄 Voir détail
                                </button>
                                {payment.status === 'pending' && (
                                    <button className="btn-dental">
                                        💳 Payer maintenant
                                    </button>
                                )}
                                {payment.status === 'paid' && (
                                    <button className="btn-success">
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
