import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const adminApi = {
  // Statistiques du tableau de bord
  getDashboardStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      // Retourner des données fictives en cas d'erreur
      return {
        monthlyRevenue: 45600,
        revenueChange: 12,
        fillRate: 92,
        waitingList: 14,
        unpaidInvoices: 3200,
        unpaidPatients: 5
      };
    }
  },

  // Agenda du jour
  getTodayAgenda: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/agenda/today`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'agenda du jour:', error);
      // Retourner des données fictives en cas d'erreur
      return [
        { time: '09:00', patient: 'Amine Mansouri', treatment: 'Détartrage', status: 'confirmed' },
        { time: '10:30', patient: 'Salma Bennani', treatment: 'Orthodontie', status: 'pending' },
        { time: '14:00', patient: 'Youssef Alaoui', treatment: 'Consultation', status: 'confirmed' },
        { time: '15:30', patient: 'Fatima Zahra', treatment: 'Blanchiment', status: 'pending' }
      ];
    }
  },

  // Rendez-vous de la semaine
  getWeekAppointments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/agenda/week`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous de la semaine:', error);
      // Retourner des données fictives en cas d'erreur
      return [
        { day: "LUN 13", time: "09:00", patient: "Mme. Dubois", type: "Consultation", status: "confirmed" },
        { day: "LUN 13", time: "10:30", patient: "Mr. Martin", type: "Détartrage", status: "confirmed" },
        { day: "MAR 14", time: "14:00", patient: "Mme. Bernard", type: "Orthodontie", status: "pending" },
        { day: "MER 15", time: "11:00", patient: "Mr. Petit", type: "Urgence", status: "confirmed" },
        { day: "JEU 16", time: "15:30", patient: "Mme. Robert", type: "Blanchiment", status: "pending" },
      ];
    }
  },

  // Liste des patients
  getPatients: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/patients`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des patients:', error);
      // Retourner des données fictives en cas d'erreur
      return [
        { id: 1, name: 'Marie Dupont', email: 'marie.dupont@email.com', phone: '0612345678', lastVisit: '24 Oct 2023' },
        { id: 2, name: 'Lucas Martin', email: 'lucas.martin@email.com', phone: '0623456789', lastVisit: '23 Oct 2023' },
        { id: 3, name: 'Sophie Bernard', email: 'sophie.bernard@email.com', phone: '0634567890', lastVisit: '22 Oct 2023' }
      ];
    }
  },

  // Données financières
  getFinancialData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/finance`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données financières:', error);
      // Retourner des données fictives en cas d'erreur
      return [
        { patient: 'Marie Dupont', date: '24 Oct 2023', amount: 450.00, status: 'paid' },
        { patient: 'Lucas Martin', date: '23 Oct 2023', amount: 1200.00, status: 'pending' },
        { patient: 'Sophie Bernard', date: '22 Oct 2023', amount: 800.00, status: 'paid' },
        { patient: 'Pierre Petit', date: '21 Oct 2023', amount: 650.00, status: 'overdue' }
      ];
    }
  },

  // Performance financière (graphique)
  getFinancialPerformance: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/finance/performance`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la performance financière:', error);
      // Retourner des données fictives en cas d'erreur
      return {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        data: [35000, 42000, 38000, 45600, 48000, 52000]
      };
    }
  }
};

export default adminApi;
