import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Message envoyé avec succès! Nous vous contacterons dans les plus brefs délais.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div style={{ background: '#f8fafb', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '60px 8%' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#2d3436', marginBottom: '15px' }}>
            Contactez-nous
          </h2>
          <p style={{ fontSize: '18px', color: '#636e72' }}>
            Une question ? Besoin d'un rendez-vous urgent ? Notre équipe est à votre écoute.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Contact Form */}
          <div className="glass-card" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3436', marginBottom: '30px' }}>
              Envoyez-nous un message
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label>Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+212 6 XX XX XX XX"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Sujet</label>
                <select name="subject" value={formData.subject} onChange={handleChange} required>
                  <option value="">Sélectionnez un sujet</option>
                  <option value="rdv">Prise de rendez-vous</option>
                  <option value="urgence">Urgence dentaire</option>
                  <option value="info">Demande d'information</option>
                  <option value="devis">Demande de devis</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '30px' }}>
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Décrivez votre demande en détail..."
                  required
                />
              </div>

              <button type="submit" className="btn-dental" style={{ width: '100%', padding: '15px 0' }}>
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="glass-card" style={{ padding: '40px', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3436', marginBottom: '30px' }}>
                Informations de contact
              </h3>
              
              <div style={{ display: 'grid', gap: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    background: '#e0f7f4', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '20px' 
                  }}>
                    📍
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#2d3436', fontSize: '16px', fontWeight: '700' }}>
                      Adresse
                    </h4>
                    <p style={{ margin: 0, color: '#636e72', fontSize: '14px' }}>
                      123 Rue Hassan, Agadir 80000, Maroc
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    background: '#e0f7f4', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '20px' 
                  }}>
                    📞
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#2d3436', fontSize: '16px', fontWeight: '700' }}>
                      Téléphone
                    </h4>
                    <p style={{ margin: 0, color: '#636e72', fontSize: '14px' }}>
                      +212 5 12345678<br />
                      +212 6 12345678 (Urgences)
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    background: '#e0f7f4', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '20px' 
                  }}>
                    ✉️
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#2d3436', fontSize: '16px', fontWeight: '700' }}>
                      Email
                    </h4>
                    <p style={{ margin: 0, color: '#636e72', fontSize: '14px' }}>
                      contact@dentalflow.ma<br />
                      urgent@dentalflow.ma
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    background: '#e0f7f4', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '20px' 
                  }}>
                    ⏰
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#2d3436', fontSize: '16px', fontWeight: '700' }}>
                      Horaires d'ouverture
                    </h4>
                    <p style={{ margin: 0, color: '#636e72', fontSize: '14px' }}>
                      Lun - Ven: 09:00 - 18:00<br />
                      Sam: 09:00 - 14:00<br />
                      Dim: Fermé
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Card */}
            <div className="glass-card" style={{ 
              background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', 
              color: 'white', 
              padding: '30px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px' }}>
                🚨 Urgence Dentaire ?
              </h3>
              <p style={{ marginBottom: '20px', opacity: 0.9 }}>
                Pour les douleurs intenses et urgences, appelez-nous 24h/24
              </p>
              <button 
                style={{ 
                  background: 'white', 
                  color: '#e74c3c', 
                  border: 'none', 
                  padding: '12px 30px', 
                  borderRadius: '8px', 
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
                onClick={() => window.location.href='tel:+212612345678'}
              >
                Appeler d'urgence
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
