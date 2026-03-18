import React, { useState, useEffect } from 'react';
import { waitingListAPI, appointmentsAPI } from '../../services/api';
import './WaitingList.css';

const WaitingList = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchWaitingList();
    fetchAvailableSlots();
  }, []);

  const fetchWaitingList = async () => {
    try {
      const response = await waitingListAPI.getAll();
      setWaitingList(response.data);
    } catch (error) {
      console.error('Error fetching waiting list:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await appointmentsAPI.getAvailableSlots({
        date: selectedDate,
        service: 'consultation'
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleSchedulePatient = async (patient) => {
    try {
      console.log('Scheduling patient:', patient);
    } catch (error) {
      console.error('Error scheduling patient:', error);
    }
  };

  const handleContactPatient = async (patient) => {
    try {
      console.log('Contacting patient:', patient);
    } catch (error) {
      console.error('Error contacting patient:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'badge-danger';
      case 'high': return 'badge-warning';
      case 'medium': return 'badge-info';
      case 'low': return 'badge-success';
      default: return '';
    }
  };

  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Élevé';
      case 'medium': return 'Normal';
      case 'low': return 'Faible';
      default: return priority;
    }
  };

  const assignSlot = async (patientId, slot) => {
    try {
      const patient = waitingList.find(p => p.id === patientId);
      await waitingListAPI.convertToAppointment(patientId, {
        date: selectedDate,
        time: slot
      });
      
      alert(`Créneau ${slot} assigné à ${patient.patient.name}`);
      fetchWaitingList();
      fetchAvailableSlots();
    } catch (error) {
      console.error('Error assigning slot:', error);
      alert('Erreur lors de l\'assignation du créneau');
    }
  };

  const updateStatus = async (patientId, status) => {
    try {
      await waitingListAPI.update(patientId, { status });
      fetchWaitingList();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getTimeSince = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Moins d\'1h';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}j`;
  };

  if (loading) {
    return (
      <div className="waiting-list-view">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de la liste d'attente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="waiting-list-view">
      <div className="waiting-header">
        <h2>Liste d'Attente Intelligente</h2>
        <div className="waiting-stats">
          <span className="stat-badge">
            {waitingList.length} patients en attente
          </span>
          <span className="stat-badge" style={{ background: '#e3faf3', color: '#00a896' }}>
            {availableSlots.length} créneaux disponibles
          </span>
        </div>
      </div>

      <div className="waiting-grid">
        {waitingList.map(patient => (
          <div key={patient.id} className="waiting-card">
            <div className={`waiting-priority priority-${patient.priority}`}>
              {patient.priority}
            </div>
            
            <div className="waiting-info">
              <h4>{patient.patient?.name}</h4>
              <p>📞 {patient.patient?.phone}</p>
              <p>🦷 {patient.service_label}</p>
              {patient.preferred_date && (
                <p>📅 {new Date(patient.preferred_date).toLocaleDateString('fr-FR')}</p>
              )}
            </div>
            
            <div className="waiting-meta">
              <span className="waiting-time">
                En attente depuis {getTimeSince(patient.created_at)}
              </span>
              <div className="waiting-actions">
                <button 
                  onClick={() => handleSchedulePatient(patient)}
                  className="btn-schedule"
                >
                  Planifier
                </button>
                <button 
                  onClick={() => handleContactPatient(patient)}
                  className="btn-contact"
                >
                  Contacter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <h3>Patients en attente</h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button onClick={() => { fetchWaitingList(); fetchAvailableSlots(); }} className="btn-dental" style={{ padding: '8px 16px', fontSize: '12px' }}>
              🔄 Actualiser
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '15px' }}>
          {waitingList.map(patient => (
            <div key={patient.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef',
              borderLeft: `4px solid ${
                patient.priority === 'urgent' ? '#e74c3c' : 
                patient.priority === 'high' ? '#fab1a0' : 
                patient.priority === 'medium' ? '#74b9ff' : '#55efc4'
              }`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#e9ecef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  👤
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1a1a1a' }}>{patient.patient?.name}</div>
                  <div style={{ fontSize: '14px', color: '#6c757d' }}>{patient.patient?.phone}</div>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}>
                    {patient.service_label} • Inscrit il y a {getTimeSince(patient.created_at)}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={`badge ${getPriorityColor(patient.priority)}`}>
                  {getPriorityLabel(patient.priority)}
                </span>
                <select 
                  value={patient.status}
                  onChange={(e) => updateStatus(patient.id, e.target.value)}
                  style={{ 
                    padding: '8px 12px', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                >
                  <option value="pending">En attente</option>
                  <option value="contacted">Contacté</option>
                  <option value="scheduled">Planifié</option>
                  <option value="cancelled">Annulé</option>
                </select>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {availableSlots.slice(0, 3).map(slot => (
                    <button 
                      key={slot}
                      onClick={() => assignSlot(patient.id, slot)}
                      className="btn-dental"
                      style={{ padding: '6px 10px', fontSize: '11px' }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div className="glass-card">
          <h3>Créneaux disponibles aujourd'hui</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {availableSlots.length > 0 ? (
              availableSlots.map(slot => (
                <div key={slot} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '15px',
                  background: '#e3faf3',
                  borderRadius: '8px',
                  border: '1px solid #55efc4'
                }}>
                  <span>{slot}</span>
                  <button className="btn-dental" style={{ padding: '6px 12px', fontSize: '11px' }}>
                    Assigner
                  </button>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#6c757d', padding: '20px' }}>
                Aucun créneau disponible aujourd'hui
              </p>
            )}
          </div>
        </div>

        <div className="glass-card">
          <h3>Statistiques d'attente</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6c757d' }}>Patients en attente</span>
              <span style={{ fontWeight: '600', color: '#00a896' }}>{waitingList.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6c757d' }}>Créneaux disponibles</span>
              <span style={{ fontWeight: '600', color: '#00a896' }}>{availableSlots.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6c757d' }}>Urgences</span>
              <span style={{ fontWeight: '600', color: '#fab1a0' }}>
                {waitingList.filter(p => p.priority === 'urgent').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingList;
