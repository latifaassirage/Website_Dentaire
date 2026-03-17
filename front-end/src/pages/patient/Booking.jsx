import React, { useState, useEffect } from 'react';
import { appointmentsAPI, waitingListAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Booking = () => {
  const [step, setStep] = useState(1);
  const [selectedSoin, setSelectedSoin] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  console.log('Booking component - user object:', user);
  console.log('Booking component - user.id:', user?.id);
  
  const services = [
    { id: 'consultation', name: 'Consultation', icon: '👨‍⚕️' },
    { id: 'detartrage', name: 'Détartrage', icon: '🦷' },
    { id: 'urgence', name: 'Urgence', icon: '🚨' },
    { id: 'blanchiment', name: 'Blanchiment', icon: '✨' },
    { id: 'orthodontie', name: 'Orthodontie', icon: '🦷' },
    { id: 'implantologie', name: 'Implantologie', icon: '🔧' },
    { id: 'conservation', name: 'Conservation', icon: '🛡️' },
    { id: 'prothese', name: 'Prothèse', icon: '🦷' },
    { id: 'depistage', name: 'Dépistage', icon: '🔍' }
  ];

  const fetchAvailableSlots = async () => {
    try {
      const response = await appointmentsAPI.getAvailableSlots({
        date: selectedDate,
        service: selectedSoin
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedSoin) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedSoin]);

  const handleConfirmAppointment = async () => {
    setLoading(true);
    console.log('Creating appointment:', {
      patient_id: user?.id,
      service: selectedSoin,
      date: selectedDate,
      time: selectedTime
    });
    
    try {
      const appointment = await appointmentsAPI.create({
        patient_id: user?.id,
        service: selectedSoin,
        date: selectedDate,
        time: selectedTime
      });
      
      console.log('Appointment created:', appointment);
      setStep(3);
    } catch (error) {
      console.error('Error creating appointment:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error details:', JSON.stringify(error.response?.data, null, 2));
      alert('Erreur lors de la réservation: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWaitingList = async () => {
    setLoading(true);
    console.log('Joining waiting list:', {
      patient_id: user?.id,
      service: selectedSoin,
      preferred_date: selectedDate,
      priority: 'medium'
    });
    
    try {
      await waitingListAPI.create({
        patient_id: user?.id,
        service: selectedSoin,
        preferred_date: selectedDate,
        priority: 'medium'
      });
      
      console.log('Successfully added to waiting list');
      alert('Vous avez été ajouté à la liste d\'attente!');
      setStep(1);
      setSelectedSoin('');
      setSelectedDate('');
      setSelectedTime('');
    } catch (error) {
      console.error('Error joining waiting list:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error details:', JSON.stringify(error.response?.data, null, 2));
      alert('Erreur lors de l\'ajout à la liste d\'attente: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-body">
      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          {['Soin', 'Date', 'Confirmation'].map((s, i) => (
            <div key={s} style={{ color: step >= i+1 ? '#00a896' : '#ccc', fontWeight: 'bold' }}>{i+1}. {s}</div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h3>Quel soin souhaitez-vous ?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {services.map(service => (
                <div 
                  key={service.id} 
                  onClick={() => { setSelectedSoin(service.id); setStep(2); }} 
                  style={{ 
                    padding: '20px', 
                    border: '1px solid #eee', 
                    borderRadius: '12px', 
                    cursor: 'pointer', 
                    textAlign: 'center',
                    transition: '0.3s',
                    background: selectedSoin === service.id ? '#e0f7f4' : '#fff'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>{service.icon}</div>
                  <div style={{ marginTop: '10px' }}>{service.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Choisissez une date & créneau</h3>
            <div className="form-group">
              <label>Date du rendez-vous</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <label>Créneaux disponibles</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {availableSlots.length > 0 ? (
                  availableSlots.map(t => (
                    <button 
                      key={t} 
                      onClick={() => setSelectedTime(t)}
                      className="btn-dental" 
                      style={{ 
                        background: selectedTime === t ? '#00a896' : '#f0fcfb', 
                        color: selectedTime === t ? 'white' : '#00a896',
                        padding: '10px 20px',
                        border: '1px solid #e0f7f4'
                      }}
                    >
                      {t}
                    </button>
                  ))
                ) : (
                  <p style={{ color: '#6c757d' }}>Aucun créneau disponible pour cette date</p>
                )}
              </div>
            </div>
            <p style={{ color: 'orange', fontSize: '13px', marginTop: '20px' }}>💡 Plus de place ? Inscrivez-vous sur <b>liste d'attente</b>.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setStep(1)} style={{ padding: '10px 20px', border: '1px solid #ddd', background: '#fff', borderRadius: '8px', cursor: 'pointer' }}>
                Retour
              </button>
              {availableSlots.length > 0 ? (
                <button 
                  onClick={handleConfirmAppointment}
                  className="btn-dental"
                  disabled={!selectedDate || !selectedTime || loading}
                  style={{ opacity: (!selectedDate || !selectedTime || loading) ? 0.5 : 1 }}
                >
                  {loading ? 'Réservation...' : 'Confirmer'}
                </button>
              ) : (
                <button 
                  onClick={handleJoinWaitingList}
                  className="btn-dental"
                  disabled={!selectedDate || loading}
                  style={{ opacity: (!selectedDate || loading) ? 0.5 : 1, backgroundColor: '#f39c12' }}
                >
                  {loading ? 'Ajout...' : 'Liste d\'attente'}
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>✅</div>
            <h3>Rendez-vous confirmé!</h3>
            <div className="glass-card" style={{ background: '#f8f9fa', margin: '20px 0' }}>
              <p><strong>Soin:</strong> {services.find(s => s.id === selectedSoin)?.name}</p>
              <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Heure:</strong> {selectedTime}</p>
            </div>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>
              Un email de confirmation vous sera envoyé. Vous pourrez annuler jusqu'à 24h avant le rendez-vous.
            </p>
            <button className="btn-dental" onClick={() => window.location.href='/patient/dashboard'}>
              Voir mes rendez-vous
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
