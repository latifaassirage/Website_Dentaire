import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

export default api;
