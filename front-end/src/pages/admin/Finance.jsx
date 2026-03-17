import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import './Finance.css';

const Finance = () => {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const data = await adminApi.getFinancialData();
        setFinancialData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données financières:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="badge-paye">Payé</span>;
      case 'pending':
        return <span className="badge-attente">En attente</span>;
      case 'overdue':
        return <span className="badge-retard">En retard</span>;
      default:
        return <span className="badge-attente">Inconnu</span>;
    }
  };

  const handleEdit = (invoice) => {
    setEditingId(invoice.id);
    setEditForm({
      amount: invoice.amount,
      status: invoice.status
    });
  };

  const handleSave = async (id) => {
    try {
      // Logique pour sauvegarder en base de données
      console.log('Sauvegarde de la facture:', id, editForm);
      
      // Mettre à jour localement
      setFinancialData(prev => 
        prev.map(invoice => 
          invoice.id === id 
            ? { ...invoice, ...editForm }
            : invoice
        )
      );
      
      // Réinitialiser l'état d'édition pour cette ligne spécifique
      setEditingId(null);
      setEditForm({});
      alert('Facture mise à jour avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  if (loading) {
    return (
      <div className="finance-view">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des données financières...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="finance-view">
      <h2>Finance et Facturation</h2>
      <div className="finance-table-container">
        <table className="modern-table finance-table">
          <thead>
            <tr>
              <th>PATIENT</th>
              <th>DATE</th>
              <th>MONTANT</th>
              <th>STATUT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {financialData.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.patient}</td>
                <td>{invoice.date}</td>
                <td>
                  {editingId === invoice.id ? (
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) => setEditForm(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                      className="edit-input"
                      step="0.01"
                    />
                  ) : (
                    `${invoice.amount.toFixed(2)} DH`
                  )}
                </td>
                <td>
                  {editingId === invoice.id ? (
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                      className="edit-select"
                    >
                      <option value="paid">Payé</option>
                      <option value="pending">En attente</option>
                      <option value="overdue">En retard</option>
                    </select>
                  ) : (
                    getStatusBadge(invoice.status)
                  )}
                </td>
                <td>
                  {editingId === invoice.id ? (
                    <div className="edit-actions">
                      <button 
                        className="btn-save-edit" 
                        onClick={() => handleSave(invoice.id)}
                      >
                        💾
                      </button>
                      <button 
                        className="btn-cancel-edit" 
                        onClick={handleCancel}
                      >
                        ❌
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(invoice)}
                    >
                      ✏️ Modifier
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finance;
