import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import './Documents.css';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await dashboardAPI.getPatientData();
        const patientData = response.data;
        
        // Combiner les ordonnances, devis et factures
        const allDocs = [];
        
        // Ajouter les rendez-vous passés comme "ordonnances"
        if (patientData.history) {
          patientData.history.forEach((apt, index) => {
            allDocs.push({
              id: `apt_${apt.id}`,
              type: 'ordonnance',
              date: new Date(apt.date_appointment).toLocaleDateString('fr-FR'),
              doctor: 'Cabinet Dentaire',
              description: `Consultation - ${apt.type_soin}`,
              appointmentId: apt.id
            });
          });
        }
        
        // Ajouter les factures
        if (patientData.payments) {
          patientData.payments.forEach((payment, index) => {
            allDocs.push({
              id: `inv_${payment.id}`,
              type: payment.type === 'devis' ? 'devis' : 'facture',
              date: new Date(payment.created_at).toLocaleDateString('fr-FR'),
              amount: `${payment.amount} DH`,
              status: payment.status === 'paid' ? 'Payé' : payment.status === 'pending' ? 'En attente' : payment.status,
              description: payment.description || `Facture #${payment.id}`,
              invoiceId: payment.id
            });
          });
        }
        
        // Trier par date (plus récent en premier)
        allDocs.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setDocuments(allDocs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocs = filter === 'all' ? documents : documents.filter(doc => doc.type === filter);

  const getIcon = (type) => {
    const icons = {
      'ordonnance': '📋',
      'devis': '💰',
      'facture': '🧾',
      'radiographie': '🦷'
    };
    return icons[type] || '📄';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Payé': { text: 'Payé', class: 'badge-paid' },
      'En attente': { text: 'En attente', class: 'badge-pending' },
      'overdue': { text: 'En retard', class: 'badge-overdue' }
    };
    const badge = badges[status];
    return badge ? <span className={badge.class}>{badge.text}</span> : null;
  };

  const handleDownload = (doc) => {
    // Logique de téléchargement
    console.log('Téléchargement du document:', doc);
    alert(`Téléchargement du ${doc.type} #${doc.id} - Fonctionnalité à implémenter`);
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement de vos documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-container">
      <header className="page-header">
        <h1>📂 Coffre-fort Documents</h1>
        <p className="header-subtitle">Consultez et téléchargez tous vos documents médicaux</p>
      </header>

      <div className="glass-card">
        <div className="documents-header">
          <h3>Mes Documents ({documents.length})</h3>
          <div className="filter-buttons">
            {['all', 'ordonnance', 'devis', 'facture'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`filter-btn ${filter === type ? 'active' : ''}`}
              >
                {type === 'all' ? `Tous (${documents.length})` : `${type.charAt(0).toUpperCase() + type.slice(1)} (${documents.filter(d => d.type === type).length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="documents-list">
          {filteredDocs.map(doc => (
            <div key={doc.id} className="glass-card document-item">
              <div className="document-info">
                <div className="document-icon">{getIcon(doc.type)}</div>
                <div className="document-details">
                  <h4>{doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} #{doc.id.split('_')[1]}</h4>
                  <p className="document-description">{doc.description}</p>
                  <div className="document-meta">
                    <span className="document-date">📅 {doc.date}</span>
                    {doc.doctor && <span className="document-doctor">👨‍⚕️ {doc.doctor}</span>}
                  </div>
                </div>
              </div>
              <div className="document-actions">
                {doc.amount && (
                  <span className="document-amount">{doc.amount}</span>
                )}
                {doc.status && getStatusBadge(doc.status)}
                <button 
                  className="glass-button primary"
                  onClick={() => handleDownload(doc)}
                >
                  📥 Télécharger
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>Aucun {filter !== 'all' ? filter : 'document'} trouvé</h3>
            <p>Vos documents apparaîtront ici dès qu'ils seront disponibles</p>
          </div>
        )}
      </div>

      <div className="glass-card security-features">
        <h3>🔒 Sécurité et Confidentialité</h3>
        <div className="security-grid">
          <div className="security-item">
            <div className="security-icon">�</div>
            <h4>Chiffrement</h4>
            <p>Vos documents sont chiffrés et protégés</p>
          </div>
          <div className="security-item">
            <div className="security-icon">🕐</div>
            <h4>Accès permanent</h4>
            <p>Consultez vos documents 24h/24</p>
          </div>
          <div className="security-item">
            <div className="security-icon">📱</div>
            <h4>Multi-support</h4>
            <p>Accès depuis mobile et ordinateur</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
