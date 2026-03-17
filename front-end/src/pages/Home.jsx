import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div style={{ background: '#fff' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ padding: '60px 8% 100px', display: 'flex', alignItems: 'center', gap: '50px' }}>
        <div style={{ flex: 1 }}>
          <span style={{ background: '#e0f7f4', color: '#00a896', padding: '8px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: '700' }}>
            ✨ Cabinet Dentaire Moderne à Agadir
          </span>
          <h1 style={{ fontSize: '55px', fontWeight: '800', color: '#2d3436', marginTop: '20px', lineHeight: '1.1' }}>
            Un sourire sain <br /> commence <span style={{ color: '#00a896' }}>ici.</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#636e72', margin: '25px 0 35px', lineHeight: '1.6' }}>
            Prenez rendez-vous en ligne en moins de 2 minutes. Suivez vos soins, téléchargez vos ordonnances et gérez votre santé dentaire en toute simplicité.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button className="btn-dental" style={{ padding: '15px 35px', fontSize: '16px' }} onClick={() => window.location.href='/login'}>
              Prendre Rendez-vous
            </button>
            <button style={{ background: 'none', border: '1px solid #eee', padding: '15px 30px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
              Nos Services
            </button>
          </div>
        </div>
        
        <div style={{ flex: 1, position: 'relative' }}>
          <img src="https://www.centre-international-carthage-medical.com/blog/web/wp/uploads/2021/06/belle-dent.jpg" 
               alt="Smile" style={{ width: '100%', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: 0, color: '#00a896' }}>⭐ 4.9/5</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'gray' }}>Basé sur 1000+ avis patients</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 8%', background: '#f8fafb' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#2d3436', marginBottom: '15px' }}>
            Pourquoi choisir DentalFlow ?
          </h2>
          <p style={{ fontSize: '18px', color: '#636e72' }}>
            La technologie au service de votre santé dentaire
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px 30px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📅</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color: '#2d3436' }}>
              Prise de RDV 24/7
            </h3>
            <p style={{ color: '#636e72', lineHeight: '1.6' }}>
              Réservez votre rendez-vous à tout moment, sans appels téléphoniques ni attente.
            </p>
          </div>
          
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px 30px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📂</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color: '#2d3436' }}>
              Coffre-fort Documents
            </h3>
            <p style={{ color: '#636e72', lineHeight: '1.6' }}>
              Accédez à vos ordonnances, devis et factures en toute sécurité.
            </p>
          </div>
          
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px 30px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔔</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color: '#2d3436' }}>
              Rappels Automatiques
            </h3>
            <p style={{ color: '#636e72', lineHeight: '1.6' }}>
              Recevez des notifications pour ne jamais manquer vos rendez-vous.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 8%', textAlign: 'center' }}>
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #00a896 0%, #00897b 100%)', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px' }}>
            Prêt à prendre soin de votre sourire ?
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.9 }}>
            Rejoignez des milliers de patients qui font confiance à DentalFlow
          </p>
          <button 
            className="btn-dental" 
            style={{ 
              background: 'white', 
              color: '#00a896', 
              padding: '15px 40px', 
              fontSize: '16px',
              fontWeight: '700'
            }} 
            onClick={() => window.location.href='/login'}
          >
            Commencer maintenant
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
