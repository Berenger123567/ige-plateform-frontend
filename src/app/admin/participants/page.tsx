'use client';
import React, { useState, useEffect } from 'react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { api } from '@/lib/api';

export default function ParticipantsAdmin() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [filterCheckin, setFilterCheckin] = useState('Tous');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/participants');
      setParticipants(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showToast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/participants/${deleteId}`);
      showToast('Participant supprimé', 'success');
      fetchData();
    } catch (err) {
      showToast('Erreur de suppression', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredParticipants = participants.filter(p => {
    const matchFilter = filterCheckin === 'Tous' 
      ? true 
      : filterCheckin === 'Présent' ? p.checkedIn : !p.checkedIn;
    
    const searchLower = search.toLowerCase();
    const matchSearch = (p.name && p.name.toLowerCase().includes(searchLower)) || 
                        (p.email && p.email.toLowerCase().includes(searchLower));
                        
    return matchFilter && matchSearch;
  });

  const totalInscrits = participants.length;
  const totalPresents = participants.filter(p => p.checkedIn).length;
  const tauxPresence = totalInscrits > 0 ? Math.round((totalPresents / totalInscrits) * 100) : 0;

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white z-50 ${toast.type === 'success' ? 'bg-ige-green' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ige-violetDark mb-4">Participants JE-GE</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <span className="block text-sm text-slate-500">Total Inscrits</span>
            <span className="text-2xl font-bold text-slate-800">{totalInscrits}</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <span className="block text-sm text-slate-500">Présents</span>
            <span className="text-2xl font-bold text-ige-green">{totalPresents}</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <span className="block text-sm text-slate-500">Taux de présence</span>
            <span className="text-2xl font-bold text-ige-violet">{tauxPresence}%</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex-1 w-full md:max-w-md">
            <input 
              type="text" 
              placeholder="Rechercher par nom ou email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600">Statut:</label>
            <select 
              value={filterCheckin} 
              onChange={(e) => setFilterCheckin(e.target.value)}
              className="p-2 border border-slate-300 rounded focus:border-ige-violet outline-none"
            >
              <option value="Tous">Tous</option>
              <option value="Présent">Présents uniquement</option>
              <option value="Inscrit">Inscrits (Absents)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-violet"></div></div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {filteredParticipants.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Aucun participant trouvé.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="p-4">Nom</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Profil</th>
                    <th className="p-4">Institution</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4">Date Inscription</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((p) => (
                    <tr key={p._id || p.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4 text-slate-600">{p.email}</td>
                      <td className="p-4">{p.profil || 'N/A'}</td>
                      <td className="p-4">{p.institution || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${p.checkedIn ? 'bg-ige-green/20 text-ige-greenDark' : 'bg-slate-200 text-slate-600'}`}>
                          {p.checkedIn ? 'Présent' : 'Inscrit'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 text-sm">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => confirmDelete(p._id || p.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmation professionnelle */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Supprimer ce participant ?"
        message="Êtes-vous sûr de vouloir supprimer définitivement ce participant de la liste de la JE-GE ? Cette action est irréversible."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        loading={deleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
