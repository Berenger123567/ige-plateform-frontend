'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { api } from '@/lib/api';
import FileUpload from '@/components/admin/FileUpload';
import ConfirmModal from '@/components/admin/ConfirmModal';

type Partner = {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  category: string;
  description?: string;
  ordre: number;
  isActive: boolean;
  createdAt: string;
};

const CATEGORIES = ['Partenaire', 'Sponsor Or', 'Sponsor Argent', 'Sponsor Bronze', 'Partenaire Média'];

export default function PartenairesAdmin() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    website: '',
    category: 'Partenaire',
    description: '',
    ordre: 99,
    isActive: true,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; partnerId: string | null }>({
    show: false,
    partnerId: null,
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/partners');
      setPartners(res.data);
    } catch (err) {
      console.error('Erreur chargement partenaires:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPartner) {
        await api.put(`/partners/${editingPartner.id}`, formData);
      } else {
        await api.post('/partners', formData);
      }
      await fetchPartners();
      closeModal();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur');
    }
  };

  const handleEdit = (p: Partner) => {
    setEditingPartner(p);
    setFormData({
      name: p.name,
      logoUrl: p.logoUrl || '',
      website: p.website || '',
      category: p.category,
      description: p.description || '',
      ordre: p.ordre,
      isActive: p.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/partners/${id}`);
      await fetchPartners();
      setDeleteConfirm({ show: false, partnerId: null });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur suppression');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPartner(null);
    setFormData({
      name: '',
      logoUrl: '',
      website: '',
      category: 'Partenaire',
      description: '',
      ordre: 99,
      isActive: true,
    });
  };

  const getCategoryBadge = (cat: string) => {
    const colors: Record<string, string> = {
      'Sponsor Or': 'bg-yellow-100 text-yellow-800',
      'Sponsor Argent': 'bg-gray-200 text-gray-800',
      'Sponsor Bronze': 'bg-orange-100 text-orange-800',
      'Partenaire Média': 'bg-blue-100 text-blue-800',
      'Partenaire': 'bg-ige-violetSoft text-ige-violetDark',
    };
    return colors[cat] || colors['Partenaire'];
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
          <h1 className="text-3xl font-bold text-gray-900">Partenaires</h1>
          <p className="text-gray-600 mt-1">Gérez les partenaires et sponsors de l'IGE</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ige-green text-white rounded-lg hover:bg-ige-greenDark transition"
        >
          <Plus className="w-4 h-4" /> Nouveau Partenaire
        </button>
      </div>

      {/* Liste des partenaires */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ordre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {partners.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {p.logoUrl ? (
                    <div className="relative h-12 w-12">
                      <Image 
                        src={p.logoUrl} 
                        alt={p.name} 
                        fill
                        className="object-contain"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                      <Building2 className="w-6 h-6" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{p.name}</div>
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-ige-green hover:underline"
                    >
                      {p.website}
                    </a>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(p.category)}`}>
                    {p.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{p.ordre}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      p.isActive ? 'bg-ige-greenSoft text-ige-greenDark' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {p.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Edit className="w-3 h-3" /> Modifier
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ show: true, partnerId: p.id })}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
                  >
                    <Trash2 className="w-3 h-3" /> Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {partners.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun partenaire enregistré. Cliquez sur "Nouveau Partenaire" pour commencer.
          </div>
        )}
      </div>

      {/* Modal d'édition/création */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingPartner ? 'Modifier le Partenaire' : 'Nouveau Partenaire'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du Partenaire *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  placeholder="Ex: Orange Bénin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <FileUpload
                  onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                  value={formData.logoUrl}
                />
                {formData.logoUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="relative h-16 w-16">
                      <Image 
                        src={formData.logoUrl} 
                        alt="Preview" 
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoUrl: '' })}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Retirer
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Web
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  placeholder="Courte description du partenariat..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={formData.ordre}
                    onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) || 99 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Plus petit = affiché en premier</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-ige-green border-gray-300 rounded focus:ring-ige-greenSoft0"
                    />
                    <span className="text-sm text-gray-700">Partenaire actif</span>
                  </label>
                </div>
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
                  {editingPartner ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        title="Supprimer ce partenaire ?"
        message="Cette action est irréversible. Le partenaire sera définitivement supprimé."
        onConfirm={() => deleteConfirm.partnerId && handleDelete(deleteConfirm.partnerId)}
        onCancel={() => setDeleteConfirm({ show: false, partnerId: null })}
      />
    </div>
  );
}
