import React, { useState, useEffect } from 'react';

const Documents = () => {
  const [documents, setDocuments] = useState([
    { id: 1, type: 'ordonnance', date: '15/03/2026', doctor: 'Dr. Martin', description: 'Antibiotiques - Amoxicilline 500mg' },
    { id: 2, type: 'devis', date: '10/03/2026', amount: '450 DH', description: 'Détartrage + Consultation' },
    { id: 3, type: 'facture', date: '08/03/2026', amount: '450 DH', status: 'Payé', description: 'Détartrage' },
    { id: 4, type: 'radiographie', date: '01/03/2026', description: 'Radio panoramique' }
  ]);

  const [filter, setFilter] = useState('all');

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
      default: return '';
    }
  };

  return (
    <div className="content-body">
      <h2>Coffre-fort Documents</h2>
      
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Mes Documents</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['all', 'ordonnance', 'devis', 'facture', 'radiographie'].map(type => (
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
                {type === 'all' ? 'Tous' : type.charAt(0).toUpperCase() + type.slice(1)}
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
              border: '1px solid #e9ecef'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '24px' }}>{getIcon(doc.type)}</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1a1a1a' }}>
                    {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
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
                <button className="btn-dental" style={{ padding: '8px 16px', fontSize: '12px' }}>
                  Télécharger
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📂</div>
            <p>Aucun document trouvé</p>
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
