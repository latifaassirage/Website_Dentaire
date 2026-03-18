import React, { useState, useEffect } from 'react';
import { appointmentsAPI } from '../../services/api';
import './Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  const services = [
    'Consultation générale',
    'Détartrage',
    'Blanchiment',
    'Orthodontie',
    'Implantologie',
    'Extraction'
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAll();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        date: selectedDate,
        time: selectedTime,
        service: selectedService,
        type_soin: selectedService
      };
      
      await appointmentsAPI.create(appointmentData);
      setShowForm(false);
      fetchAppointments();
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setSelectedService('');
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { text: 'Confirmé', class: 'badge-confirmed' },
      pending: { text: 'En attente', class: 'badge-pending' },
      cancelled: { text: 'Annulé', class: 'badge-cancelled' }
    };
    const badge = badges[status] || badges.pending;
    return <span className={badge.class}>{badge.text}</span>;
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des rendez-vous...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-container">
      <div className="appointments-header">
        <h2>Mes Rendez-vous</h2>
        <button 
          className="glass-button primary"
          onClick={() => setShowForm(true)}
        >
          📅 Prendre un RDV
        </button>
      </div>

      {showForm && (
        <div className="glass-modal">
          <div className="glass-form">
            <h3>Nouveau Rendez-vous</h3>
            <form onSubmit={handleCreateAppointment}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="form-group">
                <label>Heure</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                >
                  <option value="">Sélectionner une heure</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Service</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                >
                  <option value="">Sélectionner un service</option>
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-actions">
                <button type="button" className="glass-button secondary" onClick={() => setShowForm(false)}>
                  Annuler
                </button>
                <button type="submit" className="glass-button primary">
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="appointments-grid">
        {appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>Aucun rendez-vous</h3>
            <p>Vous n'avez pas encore de rendez-vous programmé.</p>
          </div>
        ) : (
          appointments.map(appointment => (
            <div key={appointment.id} className="glass-card appointment-card">
              <div className="appointment-header">
                <h4>{appointment.service_label || 'Consultation'}</h4>
                {getStatusBadge(appointment.status)}
              </div>
              <div className="appointment-details">
                <div className="detail-item">
                  <span className="icon">📅</span>
                  <span>{new Date(appointment.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">⏰</span>
                  <span>{appointment.time}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">📝</span>
                  <span>{appointment.notes || 'Aucune note'}</span>
                </div>
              </div>
              <div className="appointment-actions">
                <button className="glass-button small">Modifier</button>
                <button className="glass-button small danger">Annuler</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;
