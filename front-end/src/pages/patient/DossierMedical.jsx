import React from 'react';
import './PatientDashboard.css'; /* Reuse existing patient styles */

const DossierMedical = () => {
    return (
        <div className="patient-layout">
            <aside className="patient-sidebar">
                <div className="patient-logo">🦷 Espace Patient</div>
                <nav>
                    <div className="nav-link">🏠 Mon Profil</div>
                    <div className="nav-link">📅 Mes Rendez-vous</div>
                    <div className="nav-link active">📝 Dossier Médical</div>
                </nav>
            </aside>
            <main className="patient-main">
                <header className="patient-header">
                    <h2>Mon Dossier Médical</h2>
                </header>
                <div className="patient-content">
                    <div className="rdv-card" style={{maxWidth: '100%'}}>
                        <h3>Historique des Soins</h3>
                        <table style={{width: '100%', marginTop: '15px', color: '#f8fafc', textAlign: 'left'}}>
                            <thead>
                                <tr>
                                    <th style={{paddingBottom: '10px', color: '#94a3b8'}}>Date</th>
                                    <th style={{paddingBottom: '10px', color: '#94a3b8'}}>Acte Médical</th>
                                    <th style={{paddingBottom: '10px', color: '#94a3b8'}}>Note du Médecin</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{padding: '10px 0', borderBottom: '1px solid #21262d'}}>05 Mars 2026</td>
                                    <td style={{padding: '10px 0', borderBottom: '1px solid #21262d'}}>Détartrage</td>
                                    <td style={{padding: '10px 0', borderBottom: '1px solid #21262d'}}>RAS, bonne hygiène.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default DossierMedical;
