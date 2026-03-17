import React, { useState } from 'react';
import './Parameters.css';

const Parameters = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        clinicName: 'DentalFlow',
        address: '',
        phone: '',
        email: '',
        openingHours: {
            monday: { open: '09:00', close: '18:00', closed: false },
            tuesday: { open: '09:00', close: '18:00', closed: false },
            wednesday: { open: '09:00', close: '18:00', closed: false },
            thursday: { open: '09:00', close: '18:00', closed: false },
            friday: { open: '09:00', close: '18:00', closed: false },
            saturday: { open: '09:00', close: '14:00', closed: false },
            sunday: { open: '', close: '', closed: true }
        },
        appointments: {
            duration: 30,
            breakTime: 15,
            maxAdvance: 90
        },
        notifications: {
            emailReminders: true,
            smsReminders: false,
            reminderHours: 24
        },
        billing: {
            currency: 'MAD',
            taxRate: 20,
            paymentMethods: ['cash', 'card', 'check']
        }
    });

    const handleSaveSettings = () => {
        console.log('Settings saved:', settings);
        alert('Paramètres sauvegardés avec succès!');
    };

    const handleSettingChange = (category, field, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const tabs = [
        { id: 'general', label: 'Général', icon: '' },
        { id: 'hours', label: 'Horaires', icon: '' },
        { id: 'appointments', label: 'Rendez-vous', icon: '' },
        { id: 'notifications', label: 'Notifications', icon: '' },
        { id: 'billing', label: 'Facturation', icon: '' }
    ];

    return (
        <div className="params-view">
            <h2>Paramètres de DentalFlow</h2>
            <div className="params-layout">
                <div className="tabs-container">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                        </button>
                    ))}
                </div>
                
                <div className="content-area card">
                    {activeTab === 'general' && (
                        <div className="tab-content">
                            <h3>Informations générales</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nom du cabinet</label>
                                    <input
                                        type="text"
                                        value={settings.clinicName}
                                        onChange={(e) => setSettings(prev => ({ ...prev, clinicName: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Adresse</label>
                                    <input
                                        type="text"
                                        value={settings.address}
                                        onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Téléphone</label>
                                    <input
                                        type="tel"
                                        value={settings.phone}
                                        onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'hours' && (
                        <div className="tab-content">
                            <h3>Horaires d'ouverture</h3>
                            <div className="hours-grid">
                                {Object.entries(settings.openingHours).map(([day, hours]) => (
                                    <div key={day} className="day-setting">
                                        <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                                        <div className="time-inputs">
                                            <input
                                                type="time"
                                                value={hours.open}
                                                disabled={hours.closed}
                                                onChange={(e) => handleSettingChange('openingHours', day, { ...hours, open: e.target.value })}
                                            />
                                            <span>à</span>
                                            <input
                                                type="time"
                                                value={hours.close}
                                                disabled={hours.closed}
                                                onChange={(e) => handleSettingChange('openingHours', day, { ...hours, close: e.target.value })}
                                            />
                                        </div>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={hours.closed}
                                                onChange={(e) => handleSettingChange('openingHours', day, { ...hours, closed: e.target.checked })}
                                            />
                                            Fermé
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'appointments' && (
                        <div className="tab-content">
                            <h3>Paramètres des rendez-vous</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Durée par défaut (minutes)</label>
                                    <input
                                        type="number"
                                        value={settings.appointments.duration}
                                        onChange={(e) => handleSettingChange('appointments', 'duration', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Temps de pause (minutes)</label>
                                    <input
                                        type="number"
                                        value={settings.appointments.breakTime}
                                        onChange={(e) => handleSettingChange('appointments', 'breakTime', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Réservation maximale (jours)</label>
                                    <input
                                        type="number"
                                        value={settings.appointments.maxAdvance}
                                        onChange={(e) => handleSettingChange('appointments', 'maxAdvance', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="tab-content">
                            <h3>Notifications</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.emailReminders}
                                            onChange={(e) => handleSettingChange('notifications', 'emailReminders', e.target.checked)}
                                        />
                                        Rappels par email
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.smsReminders}
                                            onChange={(e) => handleSettingChange('notifications', 'smsReminders', e.target.checked)}
                                        />
                                        Rappels par SMS
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>Heures avant le rappel</label>
                                    <input
                                        type="number"
                                        value={settings.notifications.reminderHours}
                                        onChange={(e) => handleSettingChange('notifications', 'reminderHours', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="tab-content">
                            <h3>Facturation</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Devise</label>
                                    <select
                                        value={settings.billing.currency}
                                        onChange={(e) => handleSettingChange('billing', 'currency', e.target.value)}
                                    >
                                        <option value="MAD">MAD (Dirham marocain)</option>
                                        <option value="EUR">EUR (Euro)</option>
                                        <option value="USD">USD (Dollar américain)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Taux de TVA (%)</label>
                                    <input
                                        type="number"
                                        value={settings.billing.taxRate}
                                        onChange={(e) => handleSettingChange('billing', 'taxRate', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="save-section">
                        <button className="btn-save" onClick={handleSaveSettings}>
                            Enregistrer les paramètres
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Parameters;
