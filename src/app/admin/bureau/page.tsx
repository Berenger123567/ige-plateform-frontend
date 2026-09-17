'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Calendar, User, Mail, Linkedin } from 'lucide-react';
import { api } from '@/lib/api';
import FileUpload from '@/components/admin/FileUpload';
import ConfirmModal from '@/components/admin/ConfirmModal';

type BureauMember = {
  id: string;
  firstName: string;
  lastName: string;
  poste: string;
  description?: string;
  email?: string;
  linkedin?: string;
  photoUrl?: string;
  ordre: number;
  isActive: boolean;
  mandatId?: string;
  mandat?: any;
};

type Mandat = {
  id: string;
  annee: string;
  isActive: boolean;
};

const POSTES = [
  'Président',
  'Vice-Président',
  'Secrétaire Général',
  'Secrétaire Adjoint',
  'Trésorier',
  'Trésorier Adjoint',
  'Commissaire aux Comptes',
  'Responsable Communication',
  'Responsable Technique',
  'Membre',
];

export default function BureauAdmin() {
  const [membres, setMembres] = useState<BureauMember[]>([]);
  const [mandats, setMandats] = useState<Mandat[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMembre, setEditingMembre] = useState<BureauMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    poste: 'Membre',
    description: '',
    email: '',
    linkedin: '',
    photoUrl: '',
    ordre: 99,
    isActive: true,
    mandatId: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; membreId: string | null }>({
    show: false,
    membreId: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membresRes, mandatsRes] = await Promise.all([
        api.get('/bureau'),
        api.get('/mandats'),
      ]);
      setMembres(membresRes.data);
      setMandats(mandatsRes.data);
    } catch (err) {
      console.error('Erreur chargement données:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, mandatId: formData.mandatId || null };

      if (editingMembre) {
        await api.put(`/bureau/${editingMembre.id}`, payload);
      } else {
        await api.post('/bureau', payload);
      }
      await fetchData();
      closeModal();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur');
    }
  };

  const handleEdit = (membre: BureauMember) => {
    setEditingMembre(membre);
    setFormData({
      firstName: membre.firstName,
      lastName: membre.lastName,
      poste: membre.poste,
      description: membre.description || '',
      email: membre.email || '',
      linkedin: membre.linkedin || '',
      photoUrl: membre.photoUrl || '',
      ordre: membre.ordre,
      isActive: membre.isActive,
      mandatId: membre.mandatId || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/bureau/${id}`);
      await fetchData();
      setDeleteConfirm({ show: false, membreId: null });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur suppression');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMembre(null);
    setFormData({
      firstName: '',
      lastName: '',
      poste: 'Membre',
      description: '',
      email: '',
      linkedin: '',
      photoUrl: '',
      ordre: 99,
      isActive: true,
      mandatId: '',
    });
  };

  const groupByMandat = () => {
    const groups: Record<string, BureauMember[]> = { 'Sans mandat': [] };
    
    mandats.forEach((mandat) => {
      groups[mandat.annee] = [];
    });

    membres.forEach((membre) => {
      if (membre.mandatId && membre.mandat) {
        const key = membre.mandat.annee;
        if (groups[key]) {
          groups[key].push(membre);
        } else {
          groups['Sans mandat'].push(membre);
        }
      } else {
        groups['Sans mandat'].push(membre);
      }
    });

    return groups;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-ige-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const groupedMembres = groupByMandat();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bureau IGE</h1>
          <p className="text-gray-600 mt-1">Gérez les membres du bureau de l'IGE</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ige-green text-white rounded-lg hover:bg-ige-greenDark transition"
        >
          <Plus className="w-4 h-4" /> Nouveau Membre
        </button>
      </div>

      {/* Groupes par mandat */}
      <div className="space-y-8">
        {Object.entries(groupedMembres).map(([mandatNom, membresList]) => {
          if (membresList.length === 0) return null;

          return (
            <div key={mandatNom}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-ige-violet" /> {mandatNom}
                <span className="text-sm font-normal text-gray-500">
                  ({membresList.length} membre{membresList.length > 1 ? 's' : ''})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {membresList.map((membre) => (
                  <div
                    key={membre.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="aspect-square bg-ige-violetSoft flex items-center justify-center overflow-hidden relative">
                      {membre.photoUrl ? (
                        <Image
                          src={membre.photoUrl}
                          alt={`${membre.firstName} ${membre.lastName}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <User className="w-24 h-24 text-ige-violet" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900">
                        {membre.firstName} {membre.lastName}
                      </h3>
                      <p className="text-ige-violetDark font-medium text-sm mb-2">{membre.poste}</p>
                      {membre.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{membre.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        {membre.email && <Mail className="w-3 h-3" />}
                        {membre.linkedin && <Linkedin className="w-3 h-3" />}
                        <span className={`ml-auto px-2 py-0.5 rounded-full ${membre.isActive ? 'bg-ige-greenSoft text-ige-greenDark' : 'bg-gray-100 text-gray-800'}`}>
                          {membre.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(membre)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                        >
                          <Edit className="w-3 h-3" /> Modifier
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ show: true, membreId: membre.id })}
                          className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {membres.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Aucun membre du bureau</p>
        </div>
      )}

      {/* Modal d'édition/création */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-xl font-bold">
                {editingMembre ? 'Modifier le Membre' : 'Nouveau Membre'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poste *</label>
                <select
                  required
                  value={formData.poste}
                  onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                >
                  {POSTES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mandat</label>
                <select
                  value={formData.mandatId}
                  onChange={(e) => setFormData({ ...formData, mandatId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                >
                  <option value="">Sans mandat</option>
                  {mandats.map((mandat) => (
                    <option key={mandat.id} value={mandat.id}>
                      {mandat.annee} {mandat.isActive ? '(Actif)' : ''}
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
                  placeholder="Courte biographie ou rôle..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <FileUpload
                  onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                  value={formData.photoUrl}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
                  <input
                    type="number"
                    value={formData.ordre}
                    onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) || 99 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-ige-green border-gray-300 rounded focus:ring-ige-greenSoft0"
                    />
                    <span className="text-sm text-gray-700">Membre actif</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
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
                  {editingMembre ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        title="Supprimer ce membre ?"
        message="Cette action est irréversible. Le membre sera définitivement supprimé."
        onConfirm={() => deleteConfirm.membreId && handleDelete(deleteConfirm.membreId)}
        onCancel={() => setDeleteConfirm({ show: false, membreId: null })}
      />
    </div>
  );
}
