'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ConfirmModal from '@/components/admin/ConfirmModal';

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  poste?: string | null;
  email?: string | null;
  phone?: string | null;
  description?: string | null;
  clubId?: string | null;
  mandatId?: string | null;
  isPublic: boolean;
  isActive: boolean;
  ordre: number;
  club?: { id: string; name: string } | null;
  mandat?: { id: string; annee?: string } | null;
};

const emptyForm = {
  firstName: '',
  lastName: '',
  poste: '',
  email: '',
  phone: '',
  description: '',
  clubId: '',
  mandatId: '',
  isPublic: true,
  isActive: true,
  ordre: 99,
};

export default function MembresAdmin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [clubs, setClubs] = useState<{ id: string; name: string }[]>([]);
  const [mandats, setMandats] = useState<{ id: string; annee?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [membersRes, clubsRes, mandatsRes] = await Promise.all([
        api.get('/admin/membres'),
        api.get('/clubs').catch(() => ({ data: [] })),
        api.get('/mandats').catch(() => ({ data: [] })),
      ]);
      setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
      setClubs(Array.isArray(clubsRes.data) ? clubsRes.data : []);
      setMandats(Array.isArray(mandatsRes.data) ? mandatsRes.data : []);
    } catch {
      showToast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openModal = (member?: Member) => {
    if (member) {
      setEditingId(member.id);
      setForm({
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        poste: member.poste || '',
        email: member.email || '',
        phone: member.phone || '',
        description: member.description || '',
        clubId: member.clubId || '',
        mandatId: member.mandatId || '',
        isPublic: member.isPublic,
        isActive: member.isActive,
        ordre: member.ordre ?? 99,
      });
    } else {
      setEditingId(null);
      setForm(emptyForm);
    }
    setShowModal(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      clubId: form.clubId || null,
      mandatId: form.mandatId || null,
      email: form.email || null,
      phone: form.phone || null,
      poste: form.poste || null,
      description: form.description || null,
    };
    try {
      if (editingId) {
        await api.put(`/admin/membres/${editingId}`, payload);
      } else {
        await api.post('/admin/membres', payload);
      }
      showToast(editingId ? 'Membre modifié' : 'Membre créé', 'success');
      setShowModal(false);
      await fetchAll();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erreur lors de la sauvegarde', 'error');
    }
  };

  const remove = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/membres/${deleteId}`);
      showToast('Membre supprimé', 'success');
      setDeleteId(null);
      await fetchAll();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erreur de suppression', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6 text-slate-900">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white z-50 ${toast.type === 'success' ? 'bg-ige-teal' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ige-navyDark">Membres</h1>
          <p className="text-sm text-slate-500">Gérez les membres publics et internes de l’IGE.</p>
        </div>
        <button onClick={() => openModal()} className="bg-ige-navy text-white px-4 py-2 rounded-md hover:bg-ige-navyDark">
          + Nouveau membre
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-navy" /></div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-4">Nom</th>
                <th className="p-4">Poste</th>
                <th className="p-4">Club</th>
                <th className="p-4">Mandat</th>
                <th className="p-4">Public</th>
                <th className="p-4">Actif</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 font-medium">
                    {member.firstName} {member.lastName}
                    {member.email && <div className="text-xs text-slate-400">{member.email}</div>}
                  </td>
                  <td className="p-4 text-sm text-slate-600">{member.poste || '—'}</td>
                  <td className="p-4 text-sm text-slate-600">{member.club?.name || '—'}</td>
                  <td className="p-4 text-sm text-slate-600">{member.mandat?.annee || '—'}</td>
                  <td className="p-4 text-sm">{member.isPublic ? 'Oui' : 'Non'}</td>
                  <td className="p-4 text-sm">{member.isActive ? 'Oui' : 'Non'}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button onClick={() => openModal(member)} className="text-ige-navy hover:text-ige-navyDark mr-3 text-sm font-medium">Modifier</button>
                    <button onClick={() => setDeleteId(member.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {members.length === 0 && <div className="p-8 text-center text-slate-500">Aucun membre enregistré.</div>}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4 text-ige-navyDark">{editingId ? 'Modifier le membre' : 'Nouveau membre'}</h2>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Prénom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="p-2 border border-slate-300 rounded" />
                <input required placeholder="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="p-2 border border-slate-300 rounded" />
              </div>
              <input placeholder="Poste" value={form.poste} onChange={(e) => setForm({ ...form, poste: e.target.value })} className="w-full p-2 border border-slate-300 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="p-2 border border-slate-300 rounded" />
                <input placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="p-2 border border-slate-300 rounded" />
              </div>
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full p-2 border border-slate-300 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <select value={form.clubId} onChange={(e) => setForm({ ...form, clubId: e.target.value })} className="p-2 border border-slate-300 rounded">
                  <option value="">Aucun club</option>
                  {clubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}
                </select>
                <select value={form.mandatId} onChange={(e) => setForm({ ...form, mandatId: e.target.value })} className="p-2 border border-slate-300 rounded">
                  <option value="">Aucun mandat</option>
                  {mandats.map((mandat) => <option key={mandat.id} value={mandat.id}>{mandat.annee || mandat.id}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} /> Public
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Actif
                </label>
                <input type="number" min={0} value={form.ordre} onChange={(e) => setForm({ ...form, ordre: Number(e.target.value) })} className="p-2 border border-slate-300 rounded" placeholder="Ordre" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-ige-navy text-white rounded hover:bg-ige-navyDark">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Supprimer ce membre ?"
        message="Cette action est irréversible."
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
