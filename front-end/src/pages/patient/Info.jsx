import React, { useState, useEffect } from 'react';
import { dashboardAPI, userAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import './PatientDashboard.css';

const Info = () => {
    const [info, setInfo] = useState({});
    const [medicalInfo, setMedicalInfo] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await dashboardAPI.getPatientData();
                const patientData = response.data;
                
                setInfo(patientData.info || {});
                setFormData({ 
                    name: patientData.info?.name || user?.name || '', 
                    email: patientData.info?.email || user?.email || '',
                    phone: patientData.info?.phone || user?.phone || '',
                    password: '' 
                });

                // Simuler les informations médicales (à remplacer par vraie API)
                setMedicalInfo({
                    bloodType: 'O+',
                    allergies: 'Aucune connue',
                    medications: 'Aucun',
                    medicalHistory: 'Aucun antécédent médical particulier',
                    emergencyContact: 'À compléter',
                    emergencyPhone: 'À compléter',
                    doctor: 'Dr. Martin',
                    lastVisit: patientData.info?.created_at || new Date().toISOString()
                });
            } catch (error) {
                console.error('Error fetching info:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await userAPI.updateProfile(formData);

            if (response.data.success) {
                setInfo({ ...info, name: formData.name, email: formData.email, phone: formData.phone });
                setIsEditing(false);
                alert('Informations mises à jour avec succès!');
            } else {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Error updating info:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const handleMedicalInfoUpdate = () => {
        alert('Fonctionnalité de mise à jour des informations médicales à implémenter');
    };

    if (loading) {
        return (
            <div className="patient-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement des informations...</p>
                </div>
            </div>
        );
    }

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
                    <div className="form-section">
                        <h3>Informations personnelles</h3>
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
                            <label>Téléphone:</label>
                            <input 
                                type="tel" 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-save">💾 Sauvegarder</button>
                        <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                            ❌ Annuler
                        </button>
                    </div>
                </form>
            ) : (
                <div className="info-sections">
                    <div className="info-section">
                        <h3>👤 Informations personnelles</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Nom complet:</label>
                                <span>{info.name || 'Non renseigné'}</span>
                            </div>
                            <div className="info-item">
                                <label>Email:</label>
                                <span>{info.email || 'Non renseigné'}</span>
                            </div>
                            <div className="info-item">
                                <label>Téléphone:</label>
                                <span>{info.phone || 'Non renseigné'}</span>
                            </div>
                            <div className="info-item">
                                <label>Date d'inscription:</label>
                                <span>{info.created_at ? new Date(info.created_at).toLocaleDateString('fr-FR') : 'Non renseigné'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>🏥 Informations médicales</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Groupe sanguin:</label>
                                <span>{medicalInfo.bloodType}</span>
                            </div>
                            <div className="info-item">
                                <label>Allergies:</label>
                                <span>{medicalInfo.allergies}</span>
                            </div>
                            <div className="info-item">
                                <label>Médicaments:</label>
                                <span>{medicalInfo.medications}</span>
                            </div>
                            <div className="info-item">
                                <label>Antécédents:</label>
                                <span>{medicalInfo.medicalHistory}</span>
                            </div>
                            <div className="info-item">
                                <label>Contact d'urgence:</label>
                                <span>{medicalInfo.emergencyContact}</span>
                            </div>
                            <div className="info-item">
                                <label>Tél. d'urgence:</label>
                                <span>{medicalInfo.emergencyPhone}</span>
                            </div>
                            <div className="info-item">
                                <label>Médecin traitant:</label>
                                <span>{medicalInfo.doctor}</span>
                            </div>
                            <div className="info-item">
                                <label>Dernière visite:</label>
                                <span>{new Date(medicalInfo.lastVisit).toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>
                        <div className="medical-actions">
                            <button className="btn-secondary" onClick={handleMedicalInfoUpdate}>
                                📝 Mettre à jour les infos médicales
                            </button>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>⚙️ Préférences</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Langue préférée:</label>
                                <span>Français</span>
                            </div>
                            <div className="info-item">
                                <label>Notifications email:</label>
                                <span>✅ Activées</span>
                            </div>
                            <div className="info-item">
                                <label>Rappels SMS:</label>
                                <span>❌ Désactivés</span>
                            </div>
                            <div className="info-item">
                                <label>Confidentialité:</label>
                                <span>🔒 Protégée</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Info;
