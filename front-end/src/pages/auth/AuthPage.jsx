import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // باش نصيفطوه لـ Dashboard
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../services/api';
import './AuthPage.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [selectedRole, setSelectedRole] = useState('patient');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login attempt:', { email, selectedRole });
        
        try {
            const result = await login({
                email,
                password,
                role: selectedRole
            });

            console.log('Login result:', result);

            if (result.success) {
                // Verify role matches selected role
                if (result.role !== selectedRole) {
                    alert(`Ce compte est de type ${result.role === 'admin' ? 'administrateur' : 'patient'}. Veuillez choisir le bon type de compte.`);
                    return;
                }

                console.log('Login successful, redirecting to dashboard');
                
                if (result.role === 'admin') {
                    console.log('Navigating to admin dashboard');
                    navigate('/admin/dashboard');
                } else if (result.role === 'patient') {
                    console.log('Navigating to patient dashboard');
                    navigate('/patient/dashboard');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response?.status === 403) {
                alert(`Accès refusé : Ce compte ${selectedRole === 'admin' ? 'n\'est pas un compte administrateur' : 'n\'est pas un compte patient'}`);
            } else {
                alert("Erreur de connexion : Vérifiez vos informations");
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authAPI.register({
                name,
                phone,
                email,
                password,
                password_confirmation: confirmPassword,
                role: selectedRole
            });

            if (response.data.success) {
                setSuccess("Compte créé avec succès!");
                // Rediriger vers la page de connexion après 2 secondes
                setTimeout(() => {
                    setIsLogin(true);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                }, 2000);
            } else {
                setError(response.data.message || "Erreur d'inscription");
            }
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const fieldErrors = error.response.data.field_errors || {};
                
                // Afficher le premier message d'erreur spécifique
                const firstError = Object.values(errors)[0]?.[0] || "Erreur de validation";
                setError(firstError);
                
                // Log détaillé pour le débogage
                console.log('Validation errors:', errors);
                console.log('Field errors:', fieldErrors);
                
                // Afficher les erreurs spécifiques par champ dans le formulaire
                Object.keys(fieldErrors).forEach(field => {
                    const fieldElement = document.querySelector(`[name="${field}"]`);
                    if (fieldElement) {
                        fieldElement.classList.add('error');
                        fieldElement.title = fieldErrors[field].message;
                    }
                });
            } else {
                setError("Erreur d'inscription : Veuillez réessayer");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">🦷</div>
                    <h1>{isLogin ? 'Connexion' : 'Inscription'}</h1>
                </div>

                {/* Afficher les messages d'erreur et de succès */}
                {error && (
                    <div className="auth-message error">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="auth-message success">
                        {success}
                    </div>
                )}

                {/* دابا هادو غيوليو يتضغطو (Clickable) */}
                <div className="role-selection">
                    <div 
                        className={`role-box ${selectedRole === 'admin' ? 'active' : ''}`}
                        onClick={() => setSelectedRole('admin')}
                    >
                        ADMINISTRATEUR
                    </div>
                    <div 
                        className={`role-box ${selectedRole === 'patient' ? 'active' : ''}`}
                        onClick={() => setSelectedRole('patient')}
                    >
                        PATIENT
                    </div>
                </div>

                <form className="auth-form" onSubmit={isLogin ? handleLogin : handleRegister}>
                    {!isLogin && (
                        <>
                            <input 
                                type="text" 
                                placeholder="Nom complet" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required 
                            />
                            <input 
                                type="tel" 
                                placeholder="Téléphone" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required 
                            />
                        </>
                    )}
                    
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Mot de passe" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    {!isLogin && (
                        <input 
                            type="password" 
                            placeholder="Confirmer le mot de passe" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                        />
                    )}

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
