import React from 'react';
import Navbar from '../components/Navbar';

const Services = () => {
  const allServices = [
    { title: "Détartrage", desc: "Nettoyage complet pour des dents blanches et saines.", icon: "🦷", duration: "30 min", price: "450 DH" },
    { title: "Orthodontie", desc: "Alignement des dents pour un sourire parfait.", icon: "💎", duration: "60 min", price: "Sur devis" },
    { title: "Implantologie", desc: "Remplacement durable de vos dents manquantes.", icon: "🛠️", duration: "90 min", price: "Sur devis" },
    { title: "Urgences 24/7", desc: "Soins immédiats pour vos douleurs dentaires.", icon: "🚑", duration: "Variable", price: "Urgence" },
    { title: "Blanchiment", desc: "Éclaircissement professionnel des dents.", icon: "✨", duration: "45 min", price: "800 DH" },
    { title: "Conservation", desc: "Traitement des caries et reconstruction.", icon: "🔧", duration: "40 min", price: "350 DH" },
    { title: "Prothèses", desc: "Couronnes, bridges et prothèses amovibles.", icon: "🦷", duration: "120 min", price: "Sur devis" },
    { title: "Dépistage", desc: "Bilan complet et prévention.", icon: "🔍", duration: "30 min", price: "200 DH" }
  ];

  return (
    <div style={{ background: '#f8fafb', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '60px 8%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#2d3436' }}>Nos Services Spécialisés</h2>
        <p style={{ color: '#636e72', marginBottom: '50px', fontSize: '18px' }}>Nous utilisons les technologies les plus avancées pour vos soins.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {allServices.map(s => (
            <div key={s.title} className="glass-card" style={{ 
              textAlign: 'left', 
              transition: '0.3s', 
              cursor: 'pointer',
              transform: 'translateY(0)',
              ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }
            }}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>{s.icon}</div>
              <h3 style={{ marginBottom: '10px', color: '#2d3436', fontSize: '18px', fontWeight: '700' }}>{s.title}</h3>
              <p style={{ color: '#636e72', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>{s.desc}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '12px', color: '#6c757d' }}>
                  ⏱️ {s.duration}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#00a896' }}>
                  {s.price}
                </span>
              </div>
              
              <button 
                className="btn-dental" 
                style={{ 
                  width: '100%', 
                  padding: '10px 0', 
                  fontSize: '14px',
                  background: s.price === 'Urgence' ? '#e74c3c' : undefined
                }}
                onClick={() => window.location.href='/login'}
              >
                {s.price === 'Urgence' ? '🚨 Urgence' : 'Réserver'}
              </button>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div style={{ marginTop: '80px' }}>
          <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3436', marginBottom: '40px' }}>
            Comment ça marche ?
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: '#00a896', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white', 
                fontSize: '24px', 
                fontWeight: '700', 
                margin: '0 auto 20px' 
              }}>
                1
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#2d3436', marginBottom: '10px' }}>
                Choisissez votre service
              </h4>
              <p style={{ color: '#636e72', fontSize: '14px', lineHeight: '1.5' }}>
                Sélectionnez le traitement dentaire dont vous avez besoin
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: '#00a896', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white', 
                fontSize: '24px', 
                fontWeight: '700', 
                margin: '0 auto 20px' 
              }}>
                2
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#2d3436', marginBottom: '10px' }}>
                Réservez en ligne
              </h4>
              <p style={{ color: '#636e72', fontSize: '14px', lineHeight: '1.5' }}>
                Choisissez votre créneau disponible en quelques clics
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: '#00a896', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white', 
                fontSize: '24px', 
                fontWeight: '700', 
                margin: '0 auto 20px' 
              }}>
                3
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#2d3436', marginBottom: '10px' }}>
                Suivez vos soins
              </h4>
              <p style={{ color: '#636e72', fontSize: '14px', lineHeight: '1.5' }}>
                Accédez à vos documents et gérez votre suivi dentaire
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ marginTop: '60px' }}>
          <div className="glass-card" style={{ background: 'linear-gradient(135deg, #00a896 0%, #00897b 100%)', color: 'white', textAlign: 'center', padding: '40px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '15px' }}>
              Des questions sur nos services ?
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '25px', opacity: 0.9 }}>
              Notre équipe est disponible pour vous conseiller
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                className="btn-dental" 
                style={{ 
                  background: 'white', 
                  color: '#00a896', 
                  padding: '12px 30px', 
                  fontSize: '14px',
                  fontWeight: '700'
                }}
                onClick={() => window.location.href='/contact'}
              >
                Nous contacter
              </button>
              <button 
                style={{ 
                  background: 'transparent', 
                  color: 'white', 
                  border: '1px solid white', 
                  padding: '12px 30px', 
                  borderRadius: '8px', 
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
                onClick={() => window.location.href='/login'}
              >
                Prendre RDV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
