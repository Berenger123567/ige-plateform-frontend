'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import ConfirmModal from '@/components/admin/ConfirmModal';

type Mandat = {
  id: string;
  annee: string;
  dateDebut: string;
  dateFin: string;
  description?: string;
  isActive: boolean;
  bureauMembers?: any[];
  createdAt: string;
};

export default function MandatsAdmin() {
  const [mandats, setMandats] = useState<Mandat[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMandat, setEditingMandat] = useState<Mandat | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    annee: '',
    dateDebut: '',
    dateFin: '',
    description: '',
    isActive: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; mandatId: string | null }>({
    show: false,
    mandatId: null,
  });

  useEffect(() => {
    fetchMandats();
  }, []);

  const fetchMandats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mandats');
      setMandats(res.data);
    } catch (err) {
      console.error('Erreur chargement mandats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        dateDebut: new Date(formData.dateDebut).toISOString(),
        dateFin: new Date(formData.dateFin).toISOString(),
      };

      if (editingMandat) {
        await api.put(`/mandats/${editingMandat.id}`, payload);
      } else {
        await api.post('/mandats', payload);
      }
      await fetchMandats();
      closeModal();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur');
    }
  };

  const handleEdit = (mandat: Mandat) => {
    setEditingMandat(mandat);
    setFormData({
      annee: mandat.annee,
      dateDebut: new Date(mandat.dateDebut).toISOString().split('T')[0],
      dateFin: new Date(mandat.dateFin).toISOString().split('T')[0],
      description: mandat.description || '',
      isActive: mandat.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/mandats/${id}`);
      await fetchMandats();
      setDeleteConfirm({ show: false, mandatId: null });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur suppression');
    }
  };

  const handleToggleActive = async (mandat: Mandat) => {
    try {
      await api.put(`/mandats/${mandat.id}`, { ...mandat, isActive: !mandat.isActive });
      await fetchMandats();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMandat(null);
    setFormData({
      annee: '',
      dateDebut: '',
      dateFin: '',
      description: '',
      isActive: false,
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-ige-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mandats du Bureau</h1>
          <p className="text-gray-600 mt-1">Gérez les différents mandats et périodes du bureau IGE</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ige-green text-white rounded-lg hover:bg-ige-greenDark transition"
        >
          <Plus className="w-4 h-4" /> Nouveau Mandat
        </button>
      </div>

      {/* Liste des mandats */}
      <div className="grid grid-cols-1 gap-6">
        {mandats.map((mandat) => (
          <div
            key={mandat.id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden border-l-4 ${
              mandat.isActive ? 'border-ige-green' : 'border-gray-300'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{mandat.annee}</h3>
                    {mandat.isActive && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-ige-greenSoft text-ige-greenDark text-xs font-semibold rounded-full">
                        <CheckCircle className="w-3 h-3" /> Mandat Actif
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {formatDate(mandat.dateDebut)} <ArrowRight className="w-3.5 h-3.5" /> {formatDate(mandat.dateFin)}
                  </p>
                  {mandat.description && (
                    <p className="text-gray-500 mt-2 text-sm">{mandat.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(mandat)}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
                      mandat.isActive
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-ige-greenSoft text-ige-greenDark hover:bg-ige-greenSoft'
                    }`}
                  >
                    {mandat.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                  <button
                    onClick={() => handleEdit(mandat)}
                    className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Edit className="w-3 h-3" /> Modifier
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ show: true, mandatId: mandat.id })}
                    className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-3 h-3" /> Supprimer
                  </button>
                </div>
              </div>

              {/* Membres du bureau */}
              {mandat.bureauMembers && mandat.bureauMembers.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" /> {mandat.bureauMembers.length} membre(s) du bureau
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {mandat.bureauMembers.map((membre: any) => (
                      <span
                        key={membre.id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-ige-violetSoft text-ige-violetDark text-sm rounded-full"
                      >
                        {membre.firstName} {membre.lastName} - {membre.poste}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {mandats.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-2">Aucun mandat enregistré</p>
          <p className="text-gray-500 mb-4">Créez le premier mandat pour organiser votre bureau</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-ige-green text-white rounded-lg hover:bg-ige-greenDark transition"
          >
            Créer un mandat
          </button>
        </div>
      )}

      {/* Modal d'édition/création */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingMandat ? 'Modifier le Mandat' : 'Nouveau Mandat'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année du mandat *</label>
                <input
                  type="text"
                  required
                  value={formData.annee}
                  onChange={(e) => setFormData({ ...formData, annee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  placeholder="Ex: 2025-2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateDebut}
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateFin}
                    onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  placeholder="Description optionnelle du mandat..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-ige-green border-gray-300 rounded focus:ring-ige-greenSoft0"
                  />
                  <span className="text-sm text-gray-700">Mandat actif (décocher les autres si coché)</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-ige-green text-white rounded-lg hover:bg-ige-greenDark transition"
                >
                  {editingMandat ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        title="Supprimer ce mandat ?"
        message="Cette action est irréversible. Le mandat sera définitivement supprimé. Les membres du bureau associés ne seront pas supprimés mais ne seront plus liés à ce mandat."
        onConfirm={() => deleteConfirm.mandatId && handleDelete(deleteConfirm.mandatId)}
        onCancel={() => setDeleteConfirm({ show: false, mandatId: null })}
      />
    </div>
  );
}
