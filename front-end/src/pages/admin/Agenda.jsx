import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import './Agenda.css';

const Agenda = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    day: '',
    time: '',
    patient: '',
    type: '',
    status: 'pending'
  });
  
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
  const days = ["LUN 13", "MAR 14", "MER 15", "JEU 16", "VEN 17", "SAM 18"];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await adminApi.getWeekAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Erreur lors du chargement des rendez-vous:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getAppointment = (day, time) => {
    return appointments.find(apt => apt.day === day && apt.time === time);
  };

  const handleToday = () => {
    setCurrentWeek(new Date());
    // Recharger les données pour la semaine actuelle
  };

  const handleNewAppointment = () => {
    setShowNewAppointmentForm(true);
  };

  const handleSaveAppointment = () => {
    // Logique pour sauvegarder le nouveau rendez-vous
    console.log('Nouveau rendez-vous:', newAppointment);
    
    // Ajouter localement
    const newId = Math.max(...appointments.map(a => a.id || 0), 0) + 1;
    setAppointments(prev => [...prev, { ...newAppointment, id: newId }]);
    
    // Réinitialiser le formulaire
    setNewAppointment({
      day: '',
      time: '',
      patient: '',
      type: '',
      status: 'pending'
    });
    setShowNewAppointmentForm(false);
    alert('Rendez-vous créé avec succès!');
  };

  const handleCancelAppointment = () => {
    setShowNewAppointmentForm(false);
    setNewAppointment({
      day: '',
      time: '',
      patient: '',
      type: '',
      status: 'pending'
    });
  };

  if (loading) {
    return (
      <div className="agenda-container glass-card">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de l'agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agenda-full-container">
      <div className="agenda-container glass-card">
        <div className="agenda-header">
          <h2>Agenda Interactif</h2>
          <div className="agenda-controls">
            <button className="btn-secondary" onClick={handleToday}>Aujourd'hui</button>
            <button className="btn-dental" onClick={handleNewAppointment}>+ Nouveau RDV</button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="time-column">
            <div className="empty-cell"></div>
            {hours.map(h => <div key={h} className="time-label">{h}</div>)}
          </div>
          
          {days.map(day => (
            <div key={day} className="day-column">
              <div className="day-header">{day}</div>
              {hours.map(h => {
                const appointment = getAppointment(day, h);
                return (
                  <div key={h} className="slot-cell">
                    {appointment && (
                      <div className={`appointment-card ${appointment.status}`}>
                        <b>{appointment.patient}</b>
                        <br />
                        <span>{appointment.type}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="agenda-legend">
          <div className="legend-item">
            <div className="legend-color confirmed"></div>
            <span>Confirmé</span>
          </div>
          <div className="legend-item">
            <div className="legend-color pending"></div>
            <span>En attente</span>
          </div>
          <div className="legend-item">
            <div className="legend-color available"></div>
            <span>Disponible</span>
          </div>
        </div>
      </div>

      {showNewAppointmentForm && (
        <div className="appointment-form-overlay">
          <div className="appointment-form">
            <h3>Nouveau Rendez-vous</h3>
            <div className="form-group">
              <label>Jour</label>
              <select
                value={newAppointment.day}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, day: e.target.value }))}
              >
                <option value="">Sélectionner un jour</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Heure</label>
              <select
                value={newAppointment.time}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
              >
                <option value="">Sélectionner une heure</option>
                {hours.map(hour => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Patient</label>
              <input
                type="text"
                value={newAppointment.patient}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, patient: e.target.value }))}
                placeholder="Nom du patient"
              />
            </div>
            <div className="form-group">
              <label>Type de soin</label>
              <input
                type="text"
                value={newAppointment.type}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, type: e.target.value }))}
                placeholder="Type de soin"
              />
            </div>
            <div className="form-actions">
              <button className="btn-save" onClick={handleSaveAppointment}>
                💾 Enregistrer
              </button>
              <button className="btn-cancel" onClick={handleCancelAppointment}>
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
