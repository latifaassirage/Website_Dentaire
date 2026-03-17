import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardAdmin.css'; /* Reuse existing admin styles */

const PatientsList = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        // Fetch from Backend
        axios.get('http://127.0.0.1:8000/api/admin/patients')
             .then(res => setPatients(res.data))
             .catch(err => console.error(err));
    }, []);

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">🦷 DentalFlow</div>
                <nav>
                    <div className="nav-link">📊 Tableau de Bord</div>
                    <div className="nav-link">📅 Agenda</div>
                    <div className="nav-link active">👥 Patients</div>
                </nav>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <h2>Liste des Patients</h2>
                    <button style={{background: '#0d9488', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
                        + Nouveau Patient
                    </button>
                </header>
                <div className="admin-content">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom Complet</th>
                                    <th>Téléphone</th>
                                    <th>Dernière Visite</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.nom} {p.prenom}</td>
                                        <td>{p.telephone}</td>
                                        <td>{p.derniere_visite || 'Nouveau'}</td>
                                        <td style={{color: '#0d9488', cursor: 'pointer'}}>Consulter</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default PatientsList;
