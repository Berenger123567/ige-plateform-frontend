'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ConfirmModal from '@/components/admin/ConfirmModal';
import FileUpload from '@/components/admin/FileUpload';
import { Plus, Edit, Trash2, BarChart3, CheckCircle, XCircle, Calendar, MapPin, GraduationCap, FileText } from '@/components/IconImage';

type Edition = {
  id: string;
  name: string;
  theme: string;
  dateText: string;
  location: string;
  isOpen: boolean;
  active: boolean;
  planningUrl?: string | null;
  planningPublished?: boolean;
  participants?: any[];
  _count?: { participants: number };
  createdAt: string;
};

type Stats = {
  total: number;
  checkedIn: number;
  marketingConsent: number;
  attendanceRate: number;
  byProfile: { profile: string | null; count: number }[];
  byInstitution: { institution: string; count: number }[];
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
    planningUrl: '',
    planningPublished: false,
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
      const res = await api.get('/admin/je-ge/editions');
      setEditions(res.data);
    } catch (err) {
      console.error('Erreur chargement editions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (editionId: string) => {
    try {
      const res = await api.get('/admin/je-ge/stats', { params: { editionId } });
      setSelectedEditionStats({ editionId, stats: res.data });
    } catch (err) {
      console.error('Erreur chargement stats:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        planningUrl: formData.planningUrl?.trim() || null,
      };
      if (editingEdition) {
        await api.put(`/admin/je-ge/editions/${editingEdition.id}`, payload);
      } else {
        await api.post('/admin/je-ge/editions', payload);
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
      planningUrl: edition.planningUrl || '',
      planningPublished: !!edition.planningPublished,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/je-ge/editions/${id}`);
      await fetchEditions();
      setDeleteConfirm({ show: false, editionId: null });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur suppression');
    }
  };

  const handleToggle = async (edition: Edition, field: 'isOpen' | 'active') => {
    try {
      await api.put(`/admin/je-ge/editions/${edition.id}`, {
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
      planningUrl: '',
      planningPublished: false,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-ige-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editions JE-GE</h1>
          <p className="text-gray-600 mt-1">Gérez les différentes éditions de la Journée de l’Etudiant en Génie Electrique.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-ige-teal text-white rounded-lg hover:bg-ige-tealDark transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle édition
        </button>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-ige-teal">
          <div className="text-sm text-gray-600">Total des éditions</div>
          <div className="text-2xl font-bold text-gray-900">{editions.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-ige-teal">
          <div className="text-sm text-gray-600">Edition active</div>
          <div className="text-2xl font-bold text-gray-900">
            {editions.filter((e) => e.active).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-600">
          <div className="text-sm text-gray-600">Inscriptions ouvertes</div>
          <div className="text-2xl font-bold text-gray-900">
            {editions.filter((e) => e.isOpen).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-600">
          <div className="text-sm text-gray-600">Total des participants</div>
          <div className="text-2xl font-bold text-gray-900">
            {editions.reduce((sum, e) => sum + (e._count?.participants || 0), 0)}
          </div>
        </div>
      </div>

      {/* Liste des éditions */}
      <div className="grid grid-cols-1 gap-6">
        {editions.map((edition) => (
          <div
            key={edition.id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden border-l-4 ${
              edition.active ? 'border-ige-teal' : 'border-gray-300'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{edition.name}</h3>
                    {edition.active && (
                      <span className="px-3 py-1 bg-ige-tealSoft text-ige-tealDark text-xs font-semibold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Edition active
                      </span>
                    )}
                    {edition.isOpen && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        Inscriptions ouvertes
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-ige-navyDark font-medium mb-2">{edition.theme}</p>
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
                    className="px-3 py-1 text-sm font-medium text-ige-navyDark hover:text-ige-navyDark bg-ige-navySoft rounded-lg hover:bg-ige-navySoft transition flex items-center gap-1"
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
                    {edition.isOpen ? 'Fermer les inscriptions' : 'Ouvrir les inscriptions'}
                  </button>
                  <button
                    onClick={() => handleToggle(edition, 'active')}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
                      edition.active
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-ige-tealSoft text-ige-tealDark hover:bg-ige-tealSoft'
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
                  <h4 className="font-semibold text-gray-900 mb-3">Statistiques de l’édition</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-ige-navySoft p-3 rounded-lg">
                      <div className="text-xs text-gray-600">Total des inscrits</div>
                      <div className="text-xl font-bold text-ige-navyDark">{selectedEditionStats.stats.total}</div>
                    </div>
                    <div className="bg-ige-tealSoft p-3 rounded-lg">
                      <div className="text-xs text-gray-600">Check-in effectués</div>
                      <div className="text-xl font-bold text-ige-tealDark">{selectedEditionStats.stats.checkedIn}</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600">En attente</div>
                      <div className="text-xl font-bold text-orange-600">{selectedEditionStats.stats.total - selectedEditionStats.stats.checkedIn}</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600">Consentement marketing</div>
                      <div className="text-xl font-bold text-blue-600">{selectedEditionStats.stats.marketingConsent}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Par profil</p>
                      <div className="space-y-1">
                        {selectedEditionStats.stats.byProfile.map((item) => (
                          <div key={item.profile || 'non-renseigne'} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{item.profile || 'Non renseigné'}</span>
                            <span className="font-semibold text-gray-900">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Par institution (5 premières)</p>
                      <div className="space-y-1">
                        {selectedEditionStats.stats.byInstitution.slice(0, 5).map((item) => (
                          <div key={item.institution} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 truncate">{item.institution}</span>
                            <span className="font-semibold text-gray-900">{item.count}</span>
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
          <p className="text-gray-500 mb-4">Créez la première édition pour commencer.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-ige-teal text-white rounded-lg hover:bg-ige-tealDark transition"
          >
            Créer une édition
          </button>
        </div>
      )}

      {/* Modal d’édition et de création */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingEdition ? 'Modifier l’édition' : 'Nouvelle édition'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l’édition *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-tealSoft0 focus:border-transparent"
                  placeholder="Ex: JE-GE 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme *</label>
                <input
                  type="text"
                  required
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-tealSoft0 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-tealSoft0 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-tealSoft0 focus:border-transparent"
                  placeholder="Ex: Amphitheâtre EPAC, Cotonou"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isOpen}
                    onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                    className="w-4 h-4 text-ige-teal border-gray-300 rounded focus:ring-ige-tealSoft0"
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
                    className="w-4 h-4 text-ige-teal border-gray-300 rounded focus:ring-ige-tealSoft0"
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Edition active (désactivez les autres si cette case est cochée)
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Planning JE-GE
                  </h3>
                  <FileUpload
                    value={formData.planningUrl}
                    onChange={(url) => setFormData({ ...formData, planningUrl: url })}
                    accept="application/pdf"
                    label="Fichier PDF du planning"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.planningPublished}
                    onChange={(e) => setFormData({ ...formData, planningPublished: e.target.checked })}
                    className="w-4 h-4 text-ige-teal border-gray-300 rounded focus:ring-ige-tealSoft0"
                  />
                  <span className="text-sm text-gray-700">
                    Publier le planning (le bouton sera actif sur le ticket une fois publié)
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
                  className="flex-1 px-4 py-2 bg-ige-teal text-white rounded-lg hover:bg-ige-tealDark transition"
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
        title="Supprimer cette edition ?"
        message="Cette action est irréversible. L’édition et tous ses participants seront définitivement supprimés."
        onConfirm={() => deleteConfirm.editionId && handleDelete(deleteConfirm.editionId)}
        onCancel={() => setDeleteConfirm({ show: false, editionId: null })}
      />
    </div>
  );
}
