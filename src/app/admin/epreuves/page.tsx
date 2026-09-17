'use client';
import React, { useState, useEffect } from 'react';
import FileUpload from '@/components/admin/FileUpload';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { api } from '@/lib/api';

export default function EpreuvesAdmin() {
  const [epreuves, setEpreuves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const defaultForm = {
    titre: '', annee: new Date().getFullYear().toString(), edition: '', 
    categorie: 'Théorique', pages: 1, fichierUrl: ''
  };
  const [formData, setFormData] = useState<any>(defaultForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/epreuves');
      setEpreuves(Array.isArray(res.data) ? res.data : []);
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
      if (editingId) {
        await api.put(`/epreuves/${editingId}`, formData);
      } else {
        await api.post('/epreuves', formData);
      }
      showToast(`Épreuve ${editingId ? 'modifiée' : 'ajoutée'} avec succès`, 'success');
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
      await api.delete(`/epreuves/${deleteId}`);
      showToast('Épreuve supprimée', 'success');
      fetchData();
    } catch (err) {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const openModal = (ep?: any) => {
    if (ep) {
      setEditingId(ep._id || ep.id);
      setFormData(ep);
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
        <h1 className="text-2xl font-bold text-ige-violetDark">Gestion des Épreuves JE-GE</h1>
        <button onClick={() => openModal()} className="bg-ige-violet text-white px-4 py-2 rounded-md hover:bg-ige-violetDark transition">
          + Nouvelle Épreuve
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-violet"></div></div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-4">Titre</th>
                <th className="p-4">Année</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Pages</th>
                <th className="p-4">Fichier</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {epreuves.map((ep) => (
                <tr key={ep._id || ep.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 font-medium">{ep.titre}</td>
                  <td className="p-4">{ep.annee}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${ep.categorie === 'Théorique' ? 'bg-ige-bronze/20 text-ige-bronze' : 'bg-ige-violet/20 text-ige-violetDark'}`}>
                      {ep.categorie}
                    </span>
                  </td>
                  <td className="p-4">{ep.pages}</td>
                  <td className="p-4">
                    {ep.fichierUrl ? (
                      <a href={ep.fichierUrl} target="_blank" rel="noopener noreferrer" className="text-ige-violet hover:underline text-sm">
                        Voir le fichier
                      </a>
                    ) : (
                      <span className="text-slate-400 text-sm">Aucun</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openModal(ep)} className="text-ige-violet hover:text-ige-violetDark mr-3">Éditer</button>
                    <button onClick={() => confirmDelete(ep._id || ep.id)} className="text-red-500 hover:text-red-700">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-ige-violetDark">{editingId ? 'Modifier' : 'Nouvelle'} Épreuve</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre de l'épreuve</label>
                <input type="text" required value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none" placeholder="Ex: Mathématiques, Électronique..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Année</label>
                  <input type="text" required value={formData.annee} onChange={e => setFormData({...formData, annee: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Édition</label>
                  <input type="text" required value={formData.edition} onChange={e => setFormData({...formData, edition: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none" placeholder="Ex: JE-GE 2024" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <select value={formData.categorie} onChange={e => setFormData({...formData, categorie: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none">
                    <option value="Théorique">Théorique</option>
                    <option value="Pratique">Pratique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre de pages</label>
                  <input type="number" min="1" required value={formData.pages} onChange={e => setFormData({...formData, pages: parseInt(e.target.value)})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fichier de l'épreuve (PDF/Image)</label>
                <FileUpload accept="application/pdf,image/*" value={formData.fichierUrl} onChange={(url: string) => setFormData({...formData, fichierUrl: url})} />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-ige-violet text-white rounded-md hover:bg-ige-violetDark transition">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={executeDelete}
        loading={deleting}
        title="Supprimer l'épreuve"
        message="Êtes-vous sûr de vouloir supprimer cette épreuve ? Cette action est irréversible."
      />
    </div>
  );
}
