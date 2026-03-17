import React from 'react';
import './PatientDashboard.css';

const Messages = () => {
    return (
        <div className="patient-container">
            <header className="patient-header">
                <h1>💬 Messages</h1>
            </header>

            <div className="messages-list">
                <div className="message-item">
                    <div className="message-header">
                        <h3>Dr. Sophie Martin</h3>
                        <span className="message-date">24 Octobre 2024</span>
                    </div>
                    <div className="message-content">
                        <p>Bonjour Jean-Pierre, votre rendez-vous de demain est confirmé à 14h30. N'oubliez pas d'arriver 10 minutes en avance.</p>
                    </div>
                    <div className="message-actions">
                        <button className="btn-reply">Répondre</button>
                    </div>
                </div>
                
                <div className="message-item">
                    <div className="message-header">
                        <h3>Cabinet Dentaire</h3>
                        <span className="message-date">15 Juillet 2024</span>
                    </div>
                    <div className="message-content">
                        <p>Votre facture pour le détartrage du 15 Juillet est disponible. Vous pouvez la consulter dans la section Paiements.</p>
                    </div>
                    <div className="message-actions">
                        <button className="btn-reply">Répondre</button>
                    </div>
                </div>
                
                <div className="message-item unread">
                    <div className="message-header">
                        <h3>Rappel Automatique</h3>
                        <span className="message-date">Aujourd'hui</span>
                    </div>
                    <div className="message-content">
                        <p>N'oubliez pas votre rendez-vous de demain à 14h30 avec le Dr. Sophie Martin.</p>
                    </div>
                    <div className="message-actions">
                        <button className="btn-reply">Répondre</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
