'use client';
import React, { useState, useEffect } from 'react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { api } from '@/lib/api';

export default function EvenementsAdmin() {
  const [evenements, setEvenements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const defaultForm = {
    title: '', description: '', category: 'IA', date: '', time: '', 
    location: '', city: 'Cotonou', organizer: '', registrationUrl: '', 
    price: 'Gratuit', status: 'BROUILLON', featured: false
  };
  const [formData, setFormData] = useState<any>(defaultForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/evenements');
      setEvenements(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showToast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, registrationUrl: formData.registrationUrl || null };
      if (editingId) {
        await api.put(`/evenements/${editingId}`, payload);
      } else {
        await api.post('/evenements', payload);
      }
      showToast(`Événement ${editingId ? 'modifié' : 'créé'} avec succès`, 'success');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/evenements/${deleteId}`);
      showToast('Événement supprimé', 'success');
      fetchData();
    } catch (err) {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const openModal = (ev?: any) => {
    if (ev) {
      setEditingId(ev._id || ev.id);
      // Normaliser la date au format input[type=date] (yyyy-mm-dd)
      const rawDate = ev.eventDate || ev.date;
      const dateIso = rawDate && !isNaN(new Date(rawDate).getTime())
        ? new Date(rawDate).toISOString().split('T')[0]
        : '';
      setFormData({ ...ev, date: dateIso });
    } else {
      setEditingId(null);
      setFormData(defaultForm);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white z-50 ${toast.type === 'success' ? 'bg-ige-green' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-ige-violetDark">Gestion des Événements</h1>
        <button onClick={() => openModal()} className="bg-ige-violet text-white px-4 py-2 rounded-md hover:bg-ige-violetDark transition">
          + Nouvel Événement
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-violet"></div></div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-4">Titre</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Date</th>
                <th className="p-4">Ville</th>
                <th className="p-4">Statut</th>
                <th className="p-4">À la une</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {evenements.map((ev) => (
                <tr key={ev._id || ev.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 font-medium">{ev.title}</td>
                  <td className="p-4">{ev.category}</td>
                  <td className="p-4">{ev.eventDate || ev.date ? new Date(ev.eventDate || ev.date).toLocaleDateString() : ''}</td>
                  <td className="p-4">{ev.city}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${ev.status === 'PUBLIE' ? 'bg-ige-green/20 text-ige-greenDark' : 'bg-slate-200 text-slate-700'}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="p-4">{ev.featured ? 'Oui' : 'Non'}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openModal(ev)} className="text-ige-violet hover:text-ige-violetDark mr-3">Éditer</button>
                    <button onClick={() => confirmDelete(ev._id || ev.id)} className="text-red-500 hover:text-red-700">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4 text-ige-violetDark">{editingId ? 'Modifier' : 'Nouvel'} Événement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none">
                    <option value="IA">IA</option>
                    <option value="Robotique">Robotique</option>
                    <option value="Génie Électrique">Génie Électrique</option>
                    <option value="IoT">IoT</option>
                    <option value="Énergie">Énergie</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none" rows={3}></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" required value={formData.date ? formData.date.split('T')[0] : ''} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Heure</label>
                  <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Lieu</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ville</label>
                  <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Organisateur</label>
                  <input type="text" value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix</label>
                  <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lien d'inscription</label>
                <input type="url" value={formData.registrationUrl} onChange={e => setFormData({...formData, registrationUrl: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none">
                    <option value="BROUILLON">Brouillon</option>
                    <option value="PUBLIE">Publié</option>
                  </select>
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded text-ige-violet focus:ring-ige-violet" />
                    <span className="text-sm font-medium">Mettre à la une</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-ige-violet text-white rounded-md hover:bg-ige-violetDark transition">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de suppression professionnelle */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Supprimer cet événement ?"
        message="Êtes-vous sûr de vouloir supprimer cet événement ? Il ne sera plus visible sur l'agenda public du site IGE."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        loading={deleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
