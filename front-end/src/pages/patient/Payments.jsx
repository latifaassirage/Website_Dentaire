import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientDashboard.css';

const Payments = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/patient/data', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPayments(res.data.payments);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };
        fetchPayments();
    }, []);

    return (
        <div className="patient-container">
            <header className="patient-header">
                <h1>💳 Paiements</h1>
            </header>

            <div className="payments-list">
                {payments.map((payment) => (
                    <div key={payment.id} className="payment-item">
                        <div className="payment-details">
                            <h3>Facture {payment.reference}</h3>
                            <p>{new Date(payment.date_facture).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                            })}</p>
                        </div>
                        <div className="payment-amount">
                            <span className="amount">{payment.montant} DH</span>
                            <span className={`status ${payment.statut.toLowerCase()}`}>
                                {payment.statut}
                            </span>
                        </div>
                    </div>
                ))}
                
                {payments.length === 0 && (
                    <div className="no-data">
                        <p>Aucun paiement trouvé</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payments;
