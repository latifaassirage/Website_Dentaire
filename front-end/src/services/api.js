import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour envoyer les cookies de session
});

// Add request interceptor to include auth token and CSRF
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token for state-changing requests
    if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      try {
        // Récupérer le token CSRF Sanctum
        const getCookie = (name) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
        };
        
        let csrfToken = getCookie('XSRF-TOKEN') || getCookie('csrf_token');
        
        if (!csrfToken) {
          // Appel Sanctum pour obtenir le cookie CSRF
          await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
            withCredentials: true
          });
          
          // Récupérer à nouveau le token après l'appel Sanctum
          csrfToken = getCookie('XSRF-TOKEN') || getCookie('csrf_token');
        }
        
        if (csrfToken) {
          config.headers['X-CSRF-TOKEN'] = csrfToken;
          config.headers['X-XSRF-TOKEN'] = csrfToken;
        }
      } catch (error) {
        console.warn('CSRF token fetch failed:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data)
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
};

// Appointments API
export const appointmentsAPI = {
  getAll: (params = {}) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (appointment) => api.post('/appointments', appointment),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
  cancel: (id, reason) => api.post(`/appointments/${id}/cancel`, { cancellation_reason: reason }),
  getCalendar: (params) => api.get('/appointments/calendar', { params }),
  getAvailableSlots: (params) => api.get('/appointments/available-slots', { params }),
};

// Waiting List API
export const waitingListAPI = {
  getAll: () => api.get('/waiting-lists'),
  create: (data) => api.post('/waiting-lists', data),
  update: (id, data) => api.put(`/waiting-lists/${id}`, data),
  delete: (id) => api.delete(`/waiting-lists/${id}`),
  convertToAppointment: (id, appointmentData) => api.post(`/waiting-lists/${id}/convert`, appointmentData),
  getAvailableSlots: (params) => api.get('/waiting-lists/available-slots', { params }),
};

// Patients API
export const patientsAPI = {
  getAll: (params = {}) => api.get('/admin/patients', { params }),
  getById: (id) => api.get(`/admin/patients/${id}`),
  create: (data) => api.post('/admin/patients', data),
  update: (id, data) => api.put(`/admin/patients/${id}`, data),
  delete: (id) => api.delete(`/admin/patients/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/stats'),
  getPatients: () => api.get('/patients-list'),
  getAppointments: () => api.get('/appointments'),
  getInvoices: () => api.get('/invoices'),
  getPatientData: () => api.get('/patient/data'),
};

// Invoices API
export const invoicesAPI = {
  getAll: (params = {}) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
};

// Messages API
export const messagesAPI = {
  getAll: (params = {}) => api.get('/messages', { params }),
  getById: (id) => api.get(`/messages/${id}`),
  create: (message) => api.post('/messages', message),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
  getUnreadCount: () => api.get('/messages/unread-count'),
  getSystemMessages: () => api.get('/messages/system'),
  sendAppointmentReminder: (data) => api.post('/messages/appointment-reminder', data)
};

export default api;
