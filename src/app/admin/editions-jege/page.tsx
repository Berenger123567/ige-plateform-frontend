'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { Plus, Edit, Trash2, BarChart3, CheckCircle, XCircle, Calendar, MapPin, GraduationCap } from 'lucide-react';

type Edition = {
  id: string;
  name: string;
  theme: string;
  dateText: string;
  location: string;
  isOpen: boolean;
  active: boolean;
  participants?: any[];
  createdAt: string;
};

type Stats = {
  totalParticipants: number;
  checkedIn: number;
  notCheckedIn: number;
  byProfile: Record<string, number>;
  byInstitution: Record<string, number>;
  marketingConsent: number;
};

export default function EditionsJEGEAdmin() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEdition, setEditingEdition] = useState<Edition | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEditionStats, setSelectedEditionStats] = useState<{ editionId: string; stats: Stats } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    theme: '',
    dateText: '',
    location: '',
    isOpen: true,
    active: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; editionId: string | null }>({
    show: false,
    editionId: null,
  });

  useEffect(() => {
    fetchEditions();
  }, []);

  const fetchEditions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/je-ge/editions');
      setEditions(res.data);
    } catch (err) {
      console.error('Erreur chargement éditions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (editionId: string) => {
    try {
      const res = await api.get(`/je-ge/editions/${editionId}/stats`);
      setSelectedEditionStats({ editionId, stats: res.data });
    } catch (err) {
      console.error('Erreur chargement stats:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEdition) {
        await api.put(`/je-ge/editions/${editingEdition.id}`, formData);
      } else {
        await api.post('/je-ge/editions', formData);
      }
      await fetchEditions();
      closeModal();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur');
    }
  };

  const handleEdit = (edition: Edition) => {
    setEditingEdition(edition);
    setFormData({
      name: edition.name,
      theme: edition.theme,
      dateText: edition.dateText,
      location: edition.location,
      isOpen: edition.isOpen,
      active: edition.active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/je-ge/editions/${id}`);
      await fetchEditions();
      setDeleteConfirm({ show: false, editionId: null });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur suppression');
    }
  };

  const handleToggle = async (edition: Edition, field: 'isOpen' | 'active') => {
    try {
      await api.put(`/je-ge/editions/${edition.id}`, {
        ...edition,
        [field]: !edition[field],
      });
      await fetchEditions();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEdition(null);
    setFormData({
      name: '',
      theme: '',
      dateText: '',
      location: '',
      isOpen: true,
      active: false,
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
          <h1 className="text-3xl font-bold text-gray-900">Éditions JE-GE</h1>
          <p className="text-gray-600 mt-1">Gérez les différentes éditions de la Journée de l'Étudiant en Génie Électrique</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-ige-green text-white rounded-lg hover:bg-ige-greenDark transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Édition
        </button>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-ige-green">
          <div className="text-sm text-gray-600">Total Éditions</div>
          <div className="text-2xl font-bold text-gray-900">{editions.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-ige-green">
          <div className="text-sm text-gray-600">Édition Active</div>
          <div className="text-2xl font-bold text-gray-900">
            {editions.filter((e) => e.active).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-600">
          <div className="text-sm text-gray-600">Inscriptions Ouvertes</div>
          <div className="text-2xl font-bold text-gray-900">
            {editions.filter((e) => e.isOpen).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-600">
          <div className="text-sm text-gray-600">Total Participants</div>
          <div className="text-2xl font-bold text-gray-900">
            {editions.reduce((sum, e) => sum + (e.participants?.length || 0), 0)}
          </div>
        </div>
      </div>

      {/* Liste des éditions */}
      <div className="grid grid-cols-1 gap-6">
        {editions.map((edition) => (
          <div
            key={edition.id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden border-l-4 ${
              edition.active ? 'border-ige-green' : 'border-gray-300'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{edition.name}</h3>
                    {edition.active && (
                      <span className="px-3 py-1 bg-ige-greenSoft text-ige-greenDark text-xs font-semibold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Édition Active
                      </span>
                    )}
                    {edition.isOpen && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        Inscriptions Ouvertes
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-ige-violetDark font-medium mb-2">{edition.theme}</p>
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {edition.dateText}
                    <span className="mx-2">•</span>
                    <MapPin className="w-4 h-4" />
                    {edition.location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchStats(edition.id)}
                    className="px-3 py-1 text-sm font-medium text-ige-violetDark hover:text-ige-violetDark bg-ige-violetSoft rounded-lg hover:bg-ige-violetSoft transition flex items-center gap-1"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Statistiques
                  </button>
                  <button
                    onClick={() => handleToggle(edition, 'isOpen')}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
                      edition.isOpen
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {edition.isOpen ? 'Fermer inscriptions' : 'Ouvrir inscriptions'}
                  </button>
                  <button
                    onClick={() => handleToggle(edition, 'active')}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
                      edition.active
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-ige-greenSoft text-ige-greenDark hover:bg-ige-greenSoft'
                    }`}
                  >
                    {edition.active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button
                    onClick={() => handleEdit(edition)}
                    className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Modifier
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ show: true, editionId: edition.id })}
                    className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 rounded-lg hover:bg-red-100 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Supprimer
                  </button>
                </div>
              </div>

              {/* Statistiques inline */}
              {selectedEditionStats?.editionId === edition.id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Statistiques de l'édition</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-ige-violetSoft p-3 rounded-lg">
                      <div className="text-xs text-gray-600">Total Inscrits</div>
                      <div className="text-xl font-bold text-ige-violetDark">{selectedEditionStats.stats.totalParticipants}</div>
                    </div>
                    <div className="bg-ige-greenSoft p-3 rounded-lg">
                      <div className="text-xs text-gray-600">Check-in Effectués</div>
                      <div className="text-xl font-bold text-ige-greenDark">{selectedEditionStats.stats.checkedIn}</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600">En Attente</div>
                      <div className="text-xl font-bold text-orange-600">{selectedEditionStats.stats.notCheckedIn}</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600">Consentement Marketing</div>
                      <div className="text-xl font-bold text-blue-600">{selectedEditionStats.stats.marketingConsent}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Par Profil</p>
                      <div className="space-y-1">
                        {Object.entries(selectedEditionStats.stats.byProfile).map(([profile, count]) => (
                          <div key={profile} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{profile}</span>
                            <span className="font-semibold text-gray-900">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Par Institution (Top 5)</p>
                      <div className="space-y-1">
                        {Object.entries(selectedEditionStats.stats.byInstitution)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)
                          .map(([institution, count]) => (
                            <div key={institution} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 truncate">{institution}</span>
                              <span className="font-semibold text-gray-900">{count}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {editions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-600 mb-2">Aucune édition JE-GE</p>
          <p className="text-gray-500 mb-4">Créez la première édition pour commencer</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-ige-green text-white rounded-lg hover:bg-ige-greenDark transition"
          >
            Créer une édition
          </button>
        </div>
      )}

      {/* Modal d'édition/création */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingEdition ? 'Modifier l\'Édition' : 'Nouvelle Édition'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'édition *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  placeholder="Ex: JE-GE 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thème *</label>
                <input
                  type="text"
                  required
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  placeholder="Ex: Innovation et Entrepreneuriat"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date (texte) *</label>
                <input
                  type="text"
                  required
                  value={formData.dateText}
                  onChange={(e) => setFormData({ ...formData, dateText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  placeholder="Ex: 15 octobre 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  placeholder="Ex: Amphithéâtre EPAC, Cotonou"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isOpen}
                    onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                    className="w-4 h-4 text-ige-green border-gray-300 rounded focus:ring-ige-greenSoft0"
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Edit className="w-3 h-3" />
                    Inscriptions ouvertes
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-ige-green border-gray-300 rounded focus:ring-ige-greenSoft0"
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Édition active (décocher les autres si coché)
                  </span>
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
                  {editingEdition ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        title="Supprimer cette édition ?"
        message="Cette action est irréversible. L'édition et tous ses participants seront définitivement supprimés."
        onConfirm={() => deleteConfirm.editionId && handleDelete(deleteConfirm.editionId)}
        onCancel={() => setDeleteConfirm({ show: false, editionId: null })}
      />
    </div>
  );
}
