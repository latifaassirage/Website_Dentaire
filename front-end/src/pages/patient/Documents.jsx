import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

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
    switch(type) {
      case 'ordonnance': return '📋';
      case 'devis': return '💰';
      case 'facture': return '🧾';
      case 'radiographie': return '🦷';
      default: return '📄';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Payé': return 'badge-success';
      case 'En attente': return 'badge-warning';
      case 'overdue': return 'badge-danger';
      default: return '';
    }
  };

  const handleDownload = (doc) => {
    // Logique de téléchargement
    console.log('Téléchargement du document:', doc);
    alert(`Téléchargement du ${doc.type} #${doc.id} - Fonctionnalité à implémenter`);
  };

  if (loading) {
    return (
      <div className="content-body">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de vos documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-body">
      <h2>Coffre-fort Documents</h2>
      
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Mes Documents ({documents.length})</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['all', 'ordonnance', 'devis', 'facture'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e0e0e0',
                  background: filter === type ? '#00a896' : '#fff',
                  color: filter === type ? 'white' : '#6c757d',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {type === 'all' ? `Tous (${documents.length})` : `${type.charAt(0).toUpperCase() + type.slice(1)} (${documents.filter(d => d.type === type).length})`}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: '15px' }}>
          {filteredDocs.map(doc => (
            <div key={doc.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '24px' }}>{getIcon(doc.type)}</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1a1a1a' }}>
                    {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} #{doc.id.split('_')[1]}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6c757d' }}>{doc.description}</div>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}>
                    {doc.date} {doc.doctor && `• ${doc.doctor}`}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {doc.amount && (
                  <span style={{ fontWeight: '600', color: '#00a896' }}>{doc.amount}</span>
                )}
                {doc.status && (
                  <span className={`badge ${getStatusColor(doc.status)}`}>{doc.status}</span>
                )}
                <button 
                  className="btn-dental" 
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                  onClick={() => handleDownload(doc)}
                >
                  📥 Télécharger
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📂</div>
            <p>Aucun {filter !== 'all' ? filter : 'document'} trouvé</p>
          </div>
        )}
      </div>

      <div className="glass-card" style={{ marginTop: '20px' }}>
        <h3>Sécurité et Confidentialité</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔒</div>
            <h4>Chiffrement</h4>
            <p style={{ fontSize: '14px', color: '#6c757d' }}>Vos documents sont chiffrés et protégés</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🕐</div>
            <h4>Accès permanent</h4>
            <p style={{ fontSize: '14px', color: '#6c757d' }}>Consultez vos documents 24h/24</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📱</div>
            <h4>Multi-support</h4>
            <p style={{ fontSize: '14px', color: '#6c757d' }}>Accès depuis mobile et ordinateur</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
