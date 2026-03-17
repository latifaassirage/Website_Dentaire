import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentsAPI, dashboardAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const PatientDashboard = () => {
    const [nextAppointment, setNextAppointment] = useState(null);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [appointmentsResponse, statsResponse] = await Promise.all([
                    appointmentsAPI.getAll(),
                    dashboardAPI.getPatientData()
                ]);

                const appointments = appointmentsResponse.data;
                const stats = statsResponse.data;

                // Separate upcoming appointments
                const now = new Date();
                const upcoming = appointments.filter(apt => new Date(apt.date) >= now);

                setNextAppointment(upcoming[0] || null);
                setUpcomingAppointments(upcoming.slice(0, 3));
                setUserInfo(stats.info || {});
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Chargement de votre espace...</p>
            </div>
        );
    }

    return (
        <div className="patient-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="welcome-section">
                        <h1>Bonjour, {user?.name || userInfo.name || 'Patient'}</h1>
                        <p>Bienvenue dans votre espace personnel</p>
                    </div>
                    <Link to="/patient/booking" className="primary-btn">
                        <span className="btn-icon">+</span>
                        Prendre un rendez-vous
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Next Appointment Card */}
                <section className="next-appointment-section">
                    {nextAppointment ? (
                        <div className="appointment-card">
                            <div className="card-header">
                                <h2>Prochain rendez-vous</h2>
                                <span className="appointment-status confirmed">Confirmé</span>
                            </div>
                            <div className="appointment-content">
                                <div className="appointment-info">
                                    <div className="info-item">
                                        <span className="info-label">Service</span>
                                        <span className="info-value">{nextAppointment.service_label}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Date</span>
                                        <span className="info-value">
                                            {new Date(nextAppointment.date).toLocaleDateString('fr-FR', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Heure</span>
                                        <span className="info-value">{nextAppointment.time}</span>
                                    </div>
                                </div>
                                <div className="appointment-actions">
                                    <button className="secondary-btn">Modifier</button>
                                    <button className="danger-btn">Annuler</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="no-appointment-card">
                            <div className="no-appointment-content">
                                <div className="no-appointment-icon">📅</div>
                                <h2>Aucun rendez-vous prévu</h2>
                                <p>Prenez rendez-vous pour votre prochain contrôle</p>
                                <Link to="/patient/booking" className="primary-btn">
                                    Prendre rendez-vous maintenant
                                </Link>
                            </div>
                        </div>
                    )}
                </section>

                {/* Quick Actions Grid */}
                <section className="quick-actions-section">
                    <h2>Accès rapide</h2>
                    <div className="actions-grid">
                        <Link to="/patient/booking" className="action-card">
                            <div className="action-icon">🦷</div>
                            <h3>Prendre RDV</h3>
                            <p>Réserver une consultation</p>
                        </Link>
                        <Link to="/patient/history" className="action-card">
                            <div className="action-icon">📋</div>
                            <h3>Historique</h3>
                            <p>Vos rendez-vous passés</p>
                        </Link>
                        <Link to="/patient/documents" className="action-card">
                            <div className="action-icon">📄</div>
                            <h3>Documents</h3>
                            <p>Ordonnances et résultats</p>
                        </Link>
                        <Link to="/patient/payments" className="action-card">
                            <div className="action-icon">💳</div>
                            <h3>Paiements</h3>
                            <p>Factures et règlements</p>
                        </Link>
                        <Link to="/patient/messages" className="action-card">
                            <div className="action-icon">💬</div>
                            <h3>Messages</h3>
                            <p>Communication avec le cabinet</p>
                        </Link>
                        <Link to="/patient/info" className="action-card">
                            <div className="action-icon">👤</div>
                            <h3>Mes infos</h3>
                            <p>Profil et coordonnées</p>
                        </Link>
                    </div>
                </section>

                {/* Recent Appointments */}
                {upcomingAppointments.length > 1 && (
                    <section className="recent-appointments-section">
                        <h2>Prochains rendez-vous</h2>
                        <div className="appointments-list">
                            {upcomingAppointments.slice(1).map((appointment, index) => (
                                <div key={index} className="appointment-item">
                                    <div className="appointment-date">
                                        <span className="date-day">
                                            {new Date(appointment.date).getDate()}
                                        </span>
                                        <span className="date-month">
                                            {new Date(appointment.date).toLocaleDateString('fr-FR', { month: 'short' })}
                                        </span>
                                    </div>
                                    <div className="appointment-details">
                                        <h4>{appointment.service_label}</h4>
                                        <p>{appointment.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default PatientDashboard;
