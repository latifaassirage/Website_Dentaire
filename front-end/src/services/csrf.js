import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Récupérer le cookie CSRF de Sanctum (désactivé pour le moment)
export const getCsrfToken = async () => {
  try {
    // Désactivé temporairement car nous n'utilisons pas Sanctum
    console.log('CSRF token fetch disabled');
    return;
    
    // Utiliser l'URL complète sans /api pour Sanctum
    // await axios.get(`${API_BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
    //   withCredentials: false, // Désactivé pour éviter les problèmes CORS
    //   timeout: 5000 // Timeout de 5 secondes
    // });
  } catch (error) {
    console.warn('CSRF token fetch failed:', error.message);
    // Ne pas bloquer si le CSRF token n'est pas disponible
  }
};

// Initialiser le CSRF token au démarrage
getCsrfToken();
