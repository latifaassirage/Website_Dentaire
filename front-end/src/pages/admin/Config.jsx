import React, { useState } from 'react';

const Config = () => {
  const [config, setConfig] = useState({
    horaires: {
      lundi: { ouvert: true, debut: '09:00', fin: '18:00', pause: '12:00-14:00' },
      mardi: { ouvert: true, debut: '09:00', fin: '18:00', pause: '12:00-14:00' },
      mercredi: { ouvert: true, debut: '09:00', fin: '18:00', pause: '12:00-14:00' },
      jeudi: { ouvert: true, debut: '09:00', fin: '18:00', pause: '12:00-14:00' },
      vendredi: { ouvert: true, debut: '09:00', fin: '17:00', pause: '12:00-14:00' },
      samedi: { ouvert: false, debut: '', fin: '', pause: '' },
      dimanche: { ouvert: false, debut: '', fin: '', pause: '' }
    },
    cabinet: {
      nom: 'Cabinet Dentaire DentalFlow',
      telephone: '+212 5 12345678',
      email: 'contact@dentalflow.ma',
      adresse: '123 Rue Hassan, Rabat, Maroc',
      delaiAnnulation: 24
    },
    rendezVous: {
      dureeConsultation: 30,
      delaiAttente: 15,
      rappelAutomatique: true,
      delaiRappel: 48
    }
  });

  const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  const handleHoraireChange = (jour, field, value) => {
    setConfig(prev => ({
      ...prev,
      horaires: {
        ...prev.horaires,
        [jour]: {
          ...prev.horaires[jour],
          [field]: value
        }
      }
    }));
  };

  const handleCabinetChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      cabinet: {
        ...prev.cabinet,
        [field]: value
      }
    }));
  };

  const saveConfig = () => {
    // Logic to save configuration
    alert('Configuration sauvegardée avec succès!');
  };

  return (
    <div className="content-body">
      <h2>Configuration du Cabinet</h2>

      <div className="glass-card">
        <h3>Horaires d'Ouverture</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {jours.map(jour => (
            <div key={jour} style={{ 
              display: 'grid', 
              gridTemplateColumns: '120px 1fr 1fr 1fr auto', 
              gap: '15px',
              alignItems: 'center',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <span style={{ textTransform: 'capitalize', fontWeight: '600' }}>
                {jour.charAt(0).toUpperCase() + jour.slice(1)}
              </span>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={config.horaires[jour].ouvert}
                  onChange={(e) => handleHoraireChange(jour, 'ouvert', e.target.checked)}
                />
                Ouvert
              </label>

              <input
                type="time"
                value={config.horaires[jour].debut}
                onChange={(e) => handleHoraireChange(jour, 'debut', e.target.value)}
                disabled={!config.horaires[jour].ouvert}
                className="form-group"
                style={{ margin: 0, padding: '8px' }}
              />

              <input
                type="time"
                value={config.horaires[jour].fin}
                onChange={(e) => handleHoraireChange(jour, 'fin', e.target.value)}
                disabled={!config.horaires[jour].ouvert}
                className="form-group"
                style={{ margin: 0, padding: '8px' }}
              />

              <input
                type="text"
                value={config.horaires[jour].pause}
                onChange={(e) => handleHoraireChange(jour, 'pause', e.target.value)}
                disabled={!config.horaires[jour].ouvert}
                placeholder="Pause"
                className="form-group"
                style={{ margin: 0, padding: '8px' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div className="glass-card">
          <h3>Informations du Cabinet</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div className="form-group">
              <label>Nom du cabinet</label>
              <input
                type="text"
                value={config.cabinet.nom}
                onChange={(e) => handleCabinetChange('nom', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                value={config.cabinet.telephone}
                onChange={(e) => handleCabinetChange('telephone', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={config.cabinet.email}
                onChange={(e) => handleCabinetChange('email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Adresse</label>
              <textarea
                value={config.cabinet.adresse}
                onChange={(e) => handleCabinetChange('adresse', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3>Paramètres des Rendez-vous</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div className="form-group">
              <label>Durée consultation (minutes)</label>
              <input
                type="number"
                value={config.rendezVous.dureeConsultation}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  rendezVous: { ...prev.rendezVous, dureeConsultation: parseInt(e.target.value) }
                }))}
              />
            </div>
            <div className="form-group">
              <label>Délai d'attente (minutes)</label>
              <input
                type="number"
                value={config.rendezVous.delaiAttente}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  rendezVous: { ...prev.rendezVous, delaiAttente: parseInt(e.target.value) }
                }))}
              />
            </div>
            <div className="form-group">
              <label>Délai annulation (heures)</label>
              <input
                type="number"
                value={config.cabinet.delaiAnnulation}
                onChange={(e) => handleCabinetChange('delaiAnnulation', parseInt(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={config.rendezVous.rappelAutomatique}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    rendezVous: { ...prev.rendezVous, rappelAutomatique: e.target.checked }
                  }))}
                />
                Rappel automatique
              </label>
              {config.rendezVous.rappelAutomatique && (
                <input
                  type="number"
                  placeholder="Heures avant le RDV"
                  value={config.rendezVous.delaiRappel}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    rendezVous: { ...prev.rendezVous, delaiRappel: parseInt(e.target.value) }
                  }))}
                  style={{ marginTop: '10px' }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={saveConfig} className="btn-dental">
          💾 Sauvegarder la configuration
        </button>
        <button style={{ 
          padding: '12px 24px', 
          border: '1px solid #e0e0e0', 
          background: '#fff', 
          borderRadius: '8px', 
          cursor: 'pointer',
          fontWeight: '600'
        }}>
          Annuler
        </button>
      </div>

      <div className="glass-card" style={{ marginTop: '20px' }}>
        <h3>Jours Fériés et Fermetures Exceptionnelles</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '15px',
            background: '#fff4e6',
            borderRadius: '8px'
          }}>
            <div>
              <div style={{ fontWeight: '600' }}>Fête du Trône</div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>30 Juillet 2026</div>
            </div>
            <button style={{ 
              padding: '6px 12px', 
              border: '1px solid #fab1a0', 
              background: '#fff', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '12px',
              color: '#d9480f'
            }}>
              Supprimer
            </button>
          </div>
          <button className="btn-dental" style={{ padding: '10px 20px', fontSize: '14px' }}>
            + Ajouter une fermeture
          </button>
        </div>
      </div>
    </div>
  );
};

export default Config;
