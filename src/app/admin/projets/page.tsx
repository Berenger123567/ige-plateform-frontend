'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import FileUpload from '@/components/admin/FileUpload';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { api } from '@/lib/api';

export default function ProjetsAdmin() {
  const [projets, setProjets] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const defaultForm = {
    title: '', summary: '', problem: '', solution: '', technologies: '',
    year: new Date().getFullYear(), status: 'En cours', type: 'Projet Club', clubId: '', featured: false, imageUrl: ''
  };
  const [formData, setFormData] = useState<any>(defaultForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProjets, resClubs] = await Promise.all([
        api.get('/projets'),
        api.get('/clubs')
      ]);
      setProjets(Array.isArray(resProjets.data) ? resProjets.data : []);
      setClubs(Array.isArray(resClubs.data) ? resClubs.data : []);
    } catch (err) {
      showToast('Erreur lors du chargement des données', 'error');
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
        await api.put(`/projets/${editingId}`, formData);
      } else {
        await api.post('/projets', formData);
      }
      showToast(`Projet ${editingId ? 'modifié' : 'créé'} avec succès`, 'success');
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
      await api.delete(`/projets/${deleteId}`);
      showToast('Projet supprimé', 'success');
      fetchData();
    } catch (err) {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const openModal = (projet?: any) => {
    if (projet) {
      setEditingId(projet._id || projet.id);
      setFormData(projet);
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
        <h1 className="text-2xl font-bold text-ige-violetDark">Gestion des Projets</h1>
        <button onClick={() => openModal()} className="bg-ige-violet text-white px-4 py-2 rounded-md hover:bg-ige-violetDark transition">
          + Nouveau Projet
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-violet"></div></div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-4">Image</th>
                <th className="p-4">Titre</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Type</th>
                <th className="p-4">Club</th>
                <th className="p-4">À la une</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projets.map((p) => (
                <tr key={p._id || p.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4">
                    {p.imageUrl ? (
                      <div className="relative w-12 h-12">
                        <Image 
                          src={p.imageUrl} 
                          alt={p.title} 
                          fill
                          className="object-cover rounded"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-slate-200 rounded"></div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{p.title}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-ige-green/20 text-ige-greenDark rounded-full text-xs">{p.status}</span></td>
                  <td className="p-4">{p.type}</td>
                  <td className="p-4">{clubs.find(c => c._id === p.clubId)?.name || p.clubId}</td>
                  <td className="p-4">{p.featured ? 'Oui' : 'Non'}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openModal(p)} className="text-ige-violet hover:text-ige-violetDark mr-3">Éditer</button>
                    <button onClick={() => confirmDelete(p._id || p.id)} className="text-red-500 hover:text-red-700">Supprimer</button>
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
            <h2 className="text-xl font-bold mb-4 text-ige-violetDark">{editingId ? 'Modifier' : 'Nouveau'} Projet</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet focus:ring-1 focus:ring-ige-violet outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Année</label>
                  <input type="number" required value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet focus:ring-1 focus:ring-ige-violet outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Résumé</label>
                <textarea required value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet focus:ring-1 focus:ring-ige-violet outline-none" rows={2}></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Problème</label>
                  <textarea value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet focus:ring-1 focus:ring-ige-violet outline-none" rows={3}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Solution</label>
                  <textarea value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet focus:ring-1 focus:ring-ige-violet outline-none" rows={3}></textarea>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Technologies (séparées par des virgules)</label>
                <input type="text" value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet focus:ring-1 focus:ring-ige-violet outline-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet focus:ring-1 focus:ring-ige-violet outline-none">
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                    <option value="Exposé">Exposé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet focus:ring-1 focus:ring-ige-violet outline-none">
                    <option value="Hackathon">Hackathon</option>
                    <option value="Formation">Formation</option>
                    <option value="Projet Club">Projet Club</option>
                    <option value="Partenariat">Partenariat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Club</label>
                  <select value={formData.clubId} onChange={e => setFormData({...formData, clubId: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-ige-violet focus:ring-1 focus:ring-ige-violet outline-none">
                    <option value="">Aucun</option>
                    {clubs.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded text-ige-violet focus:ring-ige-violet" />
                  <span className="text-sm font-medium">Mettre à la une</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image du projet</label>
                <FileUpload accept="image/*" value={formData.imageUrl} onChange={(url: string) => setFormData({...formData, imageUrl: url})} />
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
        title="Supprimer ce projet ?"
        message="Êtes-vous sûr de vouloir supprimer définitivement ce projet ? Cette action retirera le projet de la vitrine."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        loading={deleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
