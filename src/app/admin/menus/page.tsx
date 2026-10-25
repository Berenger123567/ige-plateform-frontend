'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ConfirmModal from '@/components/admin/ConfirmModal';

type MenuItem = {
  id: string;
  label: string;
  url: string;
  location: 'HEADER' | 'FOOTER' | 'FOOTER_SECONDARY';
  parentId: string | null;
  ordre: number;
  openInNewTab: boolean;
  isActive: boolean;
};

const LOCATIONS = [
  { value: 'HEADER', label: 'En-tête (header)' },
  { value: 'FOOTER', label: 'Pied de page (principal)' },
  { value: 'FOOTER_SECONDARY', label: 'Pied de page (secondaire)' },
] as const;

const emptyForm = {
  label: '',
  url: '/',
  location: 'HEADER' as MenuItem['location'],
  parentId: '',
  ordre: 99,
  openInNewTab: false,
  isActive: true,
};

export default function MenusAdmin() {
  const [items, setItems] = useState<MenuItem[]>([]);
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
      const res = await api.get('/admin/menus');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingId(item.id);
      setForm({
        label: item.label,
        url: item.url,
        location: item.location,
        parentId: item.parentId || '',
        ordre: item.ordre ?? 99,
        openInNewTab: item.openInNewTab,
        isActive: item.isActive,
      });
    } else {
      setEditingId(null);
      setForm(emptyForm);
    }
    setShowModal(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, parentId: form.parentId || null };
    try {
      if (editingId) {
        await api.put(`/admin/menus/${editingId}`, payload);
      } else {
        await api.post('/admin/menus', payload);
      }
      showToast(editingId ? 'Lien modifié' : 'Lien créé', 'success');
      setShowModal(false);
      await fetchAll();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erreur lors de la sauvegarde', 'error');
    }
  };

  const remove = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/menus/${deleteId}`);
      showToast('Lien supprimé', 'success');
      setDeleteId(null);
      await fetchAll();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erreur de suppression', 'error');
    }
  };

  const grouped = LOCATIONS.map((location) => ({
    ...location,
    items: items.filter((item) => item.location === location.value),
  }));

  return (
    <div className="p-6 space-y-6 text-slate-900">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white z-50 ${toast.type === 'success' ? 'bg-ige-teal' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ige-navyDark">Menus du site</h1>
          <p className="text-sm text-slate-500">Ces liens alimentent dynamiquement la navigation publique.</p>
        </div>
        <button onClick={() => openModal()} className="bg-ige-navy text-white px-4 py-2 rounded-md hover:bg-ige-navyDark">
          + Nouveau lien
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-navy" /></div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.value} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 font-semibold text-sm text-ige-navyDark">
                {group.label}
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="p-4">Libellé</th>
                    <th className="p-4">URL</th>
                    <th className="p-4">Parent</th>
                    <th className="p-4">Ordre</th>
                    <th className="p-4">Nouvel onglet</th>
                    <th className="p-4">Actif</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4 font-medium">{item.label}</td>
                      <td className="p-4 text-sm text-slate-600 font-mono">{item.url}</td>
                      <td className="p-4 text-sm text-slate-600">
                        {item.parentId ? items.find((parent) => parent.id === item.parentId)?.label || '—' : '—'}
                      </td>
                      <td className="p-4 text-sm">{item.ordre}</td>
                      <td className="p-4 text-sm">{item.openInNewTab ? 'Oui' : 'Non'}</td>
                      <td className="p-4 text-sm">{item.isActive ? 'Oui' : 'Non'}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button onClick={() => openModal(item)} className="text-ige-navy hover:text-ige-navyDark mr-3 text-sm font-medium">Modifier</button>
                        <button onClick={() => setDeleteId(item.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {group.items.length === 0 && <div className="p-6 text-center text-sm text-slate-500">Aucun lien pour cet emplacement.</div>}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4 text-ige-navyDark">{editingId ? 'Modifier le lien' : 'Nouveau lien'}</h2>
            <form onSubmit={submit} className="space-y-4">
              <input required placeholder="Libellé" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full p-2 border border-slate-300 rounded" />
              <input required placeholder="/chemin ou https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full p-2 border border-slate-300 rounded font-mono text-sm" />
              <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value as MenuItem['location'] })} className="w-full p-2 border border-slate-300 rounded">
                {LOCATIONS.map((location) => <option key={location.value} value={location.value}>{location.label}</option>)}
              </select>
              <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })} className="w-full p-2 border border-slate-300 rounded">
                <option value="">Aucun parent</option>
                {items.filter((item) => item.location === form.location && item.id !== editingId).map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-3 items-center">
                <input type="number" min={0} value={form.ordre} onChange={(e) => setForm({ ...form, ordre: Number(e.target.value) })} className="p-2 border border-slate-300 rounded" />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.openInNewTab} onChange={(e) => setForm({ ...form, openInNewTab: e.target.checked })} /> Nouvel onglet
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Actif
                </label>
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
        title="Supprimer ce lien ?"
        message="Le lien sera retiré de la navigation publique."
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
