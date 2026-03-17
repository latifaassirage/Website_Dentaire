import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientDashboard.css';

const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/patient/data', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(res.data.history);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="patient-container">
            <header className="patient-header">
                <h1>📜 Historique des rendez-vous</h1>
            </header>

            <div className="history-list">
                {history.map((item) => (
                    <div key={item.id} className="history-item">
                        <div className="history-date">
                            {new Date(item.date_appointment).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                            })}
                        </div>
                        <div className="history-details">
                            <h3>{item.type_soin}</h3>
                            <p>{new Date(item.date_appointment).toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}</p>
                            <span className={`status ${item.status}`}>
                                {item.status === 'confirmed' ? 'Confirmé' : item.status === 'pending' ? 'En attente' : item.status}
                            </span>
                        </div>
                    </div>
                ))}
                
                {history.length === 0 && (
                    <div className="no-data">
                        <p>Aucun rendez-vous trouvé</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
