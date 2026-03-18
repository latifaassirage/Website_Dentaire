import React, { useState, useEffect } from 'react';
import { messagesAPI, dashboardAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import './PatientDashboard.css';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // Récupérer les messages réels de l'API
                const [messagesResponse, unreadResponse, systemResponse] = await Promise.all([
                    messagesAPI.getAll(),
                    messagesAPI.getUnreadCount(),
                    messagesAPI.getSystemMessages()
                ]);

                setMessages(messagesResponse.data);
                setUnreadCount(unreadResponse.data.count);

                // Ajouter les messages système automatiques
                const systemMessages = systemResponse.data;
                if (systemMessages.length === 0) {
                    // Créer un message de bienvenue si aucun message système
                    const welcomeMessage = {
                        id: 'welcome',
                        sender: { name: 'Cabinet Dentaire' },
                        subject: 'Bienvenue chez DentalFlow',
                        content: `Bonjour ${user?.name || 'Patient'}, bienvenue dans votre espace personnel. Vous pouvez maintenant gérer vos rendez-vous, consulter vos documents et suivre vos paiements en ligne.`,
                        created_at: new Date().toISOString(),
                        type: 'system',
                        read: false
                    };
                    setMessages(prev => [welcomeMessage, ...prev]);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                // En cas d'erreur, afficher un message par défaut
                setMessages([{
                    id: 'default',
                    sender: { name: 'Cabinet Dentaire' },
                    subject: 'Bienvenue',
                    content: 'Bienvenue dans votre espace patient.',
                    created_at: new Date().toISOString(),
                    type: 'system',
                    read: true
                }]);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [user]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            // Envoyer le message au cabinet (admin)
            const adminId = 1; // ID de l'admin (à adapter selon votre système)
            
            const messageData = {
                receiver_id: adminId,
                subject: 'Message du patient',
                content: newMessage,
                type: 'patient'
            };

            const response = await messagesAPI.create(messageData);
            
            // Ajouter le message localement
            const newMessageData = {
                ...response.data,
                sender: { name: user?.name || 'Patient' },
                receiver: { id: adminId },
                created_at: new Date().toISOString(),
                read: false
            };

            setMessages(prev => [newMessageData, ...prev]);
            setNewMessage('');
            alert('Message envoyé au cabinet dentaire');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Erreur lors de l\'envoi du message');
        }
    };

    const markAsRead = async (messageId) => {
        try {
            await messagesAPI.markAsRead(messageId);
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === messageId ? { ...msg, read: true } : msg
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'system': return '🔔';
            case 'appointment': return '📅';
            case 'patient': return '👤';
            case 'admin': return '�‍⚕️';
            default: return '💬';
        }
    };

    if (loading) {
        return (
            <div className="patient-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement des messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="patient-container">
            <header className="patient-header">
                <h1>💬 Messages</h1>
                <p className="header-subtitle">
                    Communication avec le cabinet dentaire
                    {unreadCount > 0 && (
                        <span className="unread-count">{unreadCount} non lu(s)</span>
                    )}
                </p>
            </header>

            <div className="messages-container">
                <div className="message-composer">
                    <div className="composer-header">
                        <h3>Nouveau message</h3>
                    </div>
                    <div className="composer-form">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Écrivez votre message ici..."
                            className="message-textarea"
                        />
                        <div className="composer-actions">
                            <button 
                                className="btn-dental" 
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                            >
                                📤 Envoyer
                            </button>
                        </div>
                    </div>
                </div>

                <div className="messages-list">
                    {messages.length === 0 ? (
                        <div className="no-data">
                            <div className="no-data-icon">💬</div>
                            <h3>Aucun message</h3>
                            <p>Communiquez avec votre cabinet dentaire</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div 
                                key={message.id} 
                                className={`message-item ${!message.read ? 'unread' : ''}`}
                                onClick={() => !message.read && markAsRead(message.id)}
                            >
                                <div className="message-header">
                                    <div className="message-sender">
                                        <span className="sender-icon">{getTypeIcon(message.type)}</span>
                                        <div className="sender-info">
                                            <h4>{message.sender?.name || 'System'}</h4>
                                            <span className="message-subject">{message.subject}</span>
                                        </div>
                                    </div>
                                    <div className="message-meta">
                                        <span className="message-date">
                                            {new Date(message.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                        {!message.read && (
                                            <span className="unread-indicator">●</span>
                                        )}
                                    </div>
                                </div>
                                <div className="message-content">
                                    <p>{message.content}</p>
                                </div>
                                <div className="message-actions">
                                    <button className="btn-reply">
                                        💬 Répondre
                                    </button>
                                    {message.type === 'appointment' && (
                                        <button className="btn-dental">
                                            📅 Voir RDV
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
