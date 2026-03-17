import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:8000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          alert('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
          window.location.href = '/login';
        } else {
          alert(data.message || 'Erreur lors de l\'inscription');
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('Erreur de connexion. Veuillez réessayer.');
      }
    }
  };

  return (
    <div style={{ background: '#f8fafb', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '60px 8%',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <div className="glass-card" style={{ 
          maxWidth: '500px', 
          width: '100%', 
          padding: '50px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: '#e0f7f4', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 20px',
              fontSize: '32px'
            }}>
              🦷
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3436', marginBottom: '10px' }}>
              Créer votre compte
            </h2>
            <p style={{ color: '#636e72', fontSize: '16px' }}>
              Rejoignez DentalFlow et prenez soin de votre sourire
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label>Type de compte</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '12px', 
                  border: '2px solid #00a896',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: '#e0f7f4'
                }}>
                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={true}
                    readOnly
                    style={{ margin: 0 }}
                  />
                  <span>Patient</span>
                </label>
              </div>
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label>Nom complet</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Entrez votre nom complet"
                style={{ borderColor: errors.name ? '#e74c3c' : undefined }}
              />
              {errors.name && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.name}</p>}
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                style={{ borderColor: errors.email ? '#e74c3c' : undefined }}
              />
              {errors.email && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.email}</p>}
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label>Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+212 6 XX XX XX XX"
                style={{ borderColor: errors.phone ? '#e74c3c' : undefined }}
              />
              {errors.phone && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.phone}</p>}
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label>Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ borderColor: errors.password ? '#e74c3c' : undefined }}
              />
              {errors.password && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.password}</p>}
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '30px' }}>
              <label>Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ borderColor: errors.confirmPassword ? '#e74c3c' : undefined }}
              />
              {errors.confirmPassword && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn-dental" style={{ width: '100%', padding: '15px 0', fontSize: '16px' }}>
              Créer mon compte
            </button>
          </form>

          <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #e9ecef' }}>
            <p style={{ color: '#636e72', fontSize: '14px' }}>
              Vous avez déjà un compte ?{' '}
              <a href="/login" style={{ color: '#00a896', textDecoration: 'none', fontWeight: '700' }}>
                Se connecter
              </a>
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <p style={{ color: '#6c757d', fontSize: '12px' }}>
              En créant un compte, vous acceptez nos{' '}
              <a href="#" style={{ color: '#00a896', textDecoration: 'none' }}>
                conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a href="#" style={{ color: '#00a896', textDecoration: 'none' }}>
                politique de confidentialité
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
