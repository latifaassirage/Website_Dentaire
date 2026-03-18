import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import './Patients.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token trouvé:', token);
        const data = await adminApi.getPatients();
        setPatients(data);
      } catch (error) {
        console.error('Erreur lors du chargement des patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleNewPatient = () => {
    setShowNewPatientForm(true);
  };

  const handleSavePatient = () => {
    // Validation simple
    if (!newPatient.name || !newPatient.phone) {
      alert('Le nom et le téléphone sont obligatoires');
      return;
    }

    // Ajouter localement
    const newId = Math.max(...patients.map(p => p.id || 0), 0) + 1;
    const patientToAdd = {
      ...newPatient,
      id: newId,
      lastVisit: new Date().toLocaleDateString('fr-FR')
    };
    
    setPatients(prev => [patientToAdd, ...prev]);
    
    // Réinitialiser le formulaire
    setNewPatient({
      name: '',
      email: '',
      phone: '',
      address: '',
      birthDate: '',
      emergencyContact: '',
      emergencyPhone: ''
    });
    setShowNewPatientForm(false);
    alert('Patient ajouté avec succès!');
  };

  const handleCancelPatient = () => {
    setShowNewPatientForm(false);
    setNewPatient({
      name: '',
      email: '',
      phone: '',
      address: '',
      birthDate: '',
      emergencyContact: '',
      emergencyPhone: ''
    });
  };

  const filteredPatients = patients.filter(patient =>
    patient.name && patient.name.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  if (loading) {
    return (
      <div className="patients-view">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patients-view">
      <div className="header-flex">
        <h2>Répertoire Patients Unifié</h2>
        <button className="btn-main" onClick={handleNewPatient}>+ Nouveau patient</button>
      </div>
      
      <div className="filter-bar">
        <input 
          type="text" 
          placeholder="Rechercher par nom..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="patients-card">
        <table className="modern-table">
          <thead>
            <tr>
              <th>NOM</th>
              <th>TÉLÉPHONE</th>
              <th>PROCHAIN RDV</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <tr key={patient.id}>
                <td>
                  <strong>{patient.name}</strong>
                  <br/>
                  <small>#{patient.id}</small>
                </td>
                <td>{patient.phone}</td>
                <td><span className="rdv-tag">{patient.lastVisit}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNewPatientForm && (
        <div className="patient-form-overlay">
          <div className="patient-form">
            <h3>Nouveau Patient</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Nom complet *</label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom et prénom"
                  required
                />
              </div>
              <div className="form-group">
                <label>Téléphone *</label>
                <input
                  type="tel"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="06 12 34 56 78"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>
              <div className="form-group">
                <label>Adresse</label>
                <input
                  type="text"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Adresse complète"
                />
              </div>
              <div className="form-group">
                <label>Date de naissance</label>
                <input
                  type="date"
                  value={newPatient.birthDate}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, birthDate: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Contact d'urgence</label>
                <input
                  type="text"
                  value={newPatient.emergencyContact}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  placeholder="Nom du contact"
                />
              </div>
              <div className="form-group">
                <label>Téléphone d'urgence</label>
                <input
                  type="tel"
                  value={newPatient.emergencyPhone}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                  placeholder="06 98 76 54 32"
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-save" onClick={handleSavePatient}>
                💾 Enregistrer
              </button>
              <button className="btn-cancel" onClick={handleCancelPatient}>
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
