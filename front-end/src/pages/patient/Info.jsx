import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientDashboard.css';

const Info = () => {
    const [info, setInfo] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        const fetchInfo = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/patient/data', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInfo(res.data.info);
                setFormData({ 
                    name: res.data.info.name, 
                    email: res.data.info.email, 
                    password: '' 
                });
            } catch (error) {
                console.error('Error fetching info:', error);
            }
        };
        fetchInfo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://127.0.0.1:8000/api/user/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInfo({ ...info, name: formData.name, email: formData.email });
            setIsEditing(false);
            alert('Informations mises à jour avec succès!');
        } catch (error) {
            console.error('Error updating info:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    return (
        <div className="patient-container">
            <header className="patient-header">
                <h1>ℹ️ Informations du compte</h1>
                <button 
                    className="btn-edit" 
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? 'Annuler' : 'Modifier'}
                </button>
            </header>

            {isEditing ? (
                <form className="edit-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nom complet:</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Nouveau mot de passe:</label>
                        <input 
                            type="password" 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="Laisser vide pour ne pas changer"
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-save">Sauvegarder</button>
                        <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                            Annuler
                        </button>
                    </div>
                </form>
            ) : (
                <div className="info-sections">
                    <div className="info-section">
                        <h3>Informations personnelles</h3>
                        <div className="info-item">
                            <label>Nom complet:</label>
                            <span>{info.name}</span>
                        </div>
                        <div className="info-item">
                            <label>Email:</label>
                            <span>{info.email}</span>
                        </div>
                        <div className="info-item">
                            <label>Date d'inscription:</label>
                            <span>{info.created_at}</span>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Informations médicales</h3>
                        <div className="info-item">
                            <label>Groupe sanguin:</label>
                            <span>O+</span>
                        </div>
                        <div className="info-item">
                            <label>Allergies:</label>
                            <span>Aucune connue</span>
                        </div>
                        <div className="info-item">
                            <label>Médicaments:</label>
                            <span>Aucun</span>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Préférences</h3>
                        <div className="info-item">
                            <label>Langue préférée:</label>
                            <span>Français</span>
                        </div>
                        <div className="info-item">
                            <label>Notifications:</label>
                            <span>Activées</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Info;
