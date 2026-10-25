'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ConfirmModal from '@/components/admin/ConfirmModal';

type PageRecord = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'BROUILLON' | 'PUBLIE';
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonical?: string | null;
  ogImage?: string | null;
  updatedAt: string;
};

const emptyForm = {
  title: '',
  slug: '',
  content: '',
  status: 'BROUILLON' as PageRecord['status'],
  seoTitle: '',
  seoDescription: '',
  canonical: '',
  ogImage: '',
};

export default function PagesAdmin() {
  const [pages, setPages] = useState<PageRecord[]>([]);
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
      const res = await api.get('/admin/pages');
      setPages(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openModal = (page?: PageRecord) => {
    if (page) {
      setEditingId(page.id);
      setForm({
        title: page.title,
        slug: page.slug,
        content: page.content,
        status: page.status,
        seoTitle: page.seoTitle || '',
        seoDescription: page.seoDescription || '',
        canonical: page.canonical || '',
        ogImage: page.ogImage || '',
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
      seoTitle: form.seoTitle || null,
      seoDescription: form.seoDescription || null,
      canonical: form.canonical || null,
      ogImage: form.ogImage || null,
    };
    try {
      if (editingId) {
        await api.put(`/admin/pages/${editingId}`, payload);
      } else {
        await api.post('/admin/pages', payload);
      }
      showToast(editingId ? 'Page modifiée' : 'Page créée', 'success');
      setShowModal(false);
      await fetchAll();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erreur lors de la sauvegarde', 'error');
    }
  };

  const remove = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/pages/${deleteId}`);
      showToast('Page supprimée', 'success');
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
          <h1 className="text-2xl font-bold text-ige-navyDark">Pages & SEO</h1>
          <p className="text-sm text-slate-500">Contenus éditoriaux et métadonnées de référencement.</p>
        </div>
        <button onClick={() => openModal()} className="bg-ige-navy text-white px-4 py-2 rounded-md hover:bg-ige-navyDark">
          + Nouvelle page
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-navy" /></div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-4">Titre</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Statut</th>
                <th className="p-4">SEO title</th>
                <th className="p-4">Mise à jour</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 font-medium">{page.title}</td>
                  <td className="p-4 text-sm text-slate-600 font-mono">{page.slug}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${page.status === 'PUBLIE' ? 'bg-ige-teal/20 text-ige-tealDark' : 'bg-slate-200 text-slate-700'}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{page.seoTitle || '—'}</td>
                  <td className="p-4 text-sm text-slate-600">{new Date(page.updatedAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button onClick={() => openModal(page)} className="text-ige-navy hover:text-ige-navyDark mr-3 text-sm font-medium">Modifier</button>
                    <button onClick={() => setDeleteId(page.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pages.length === 0 && <div className="p-8 text-center text-slate-500">Aucune page enregistrée.</div>}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4 text-ige-navyDark">{editingId ? 'Modifier la page' : 'Nouvelle page'}</h2>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="p-2 border border-slate-300 rounded" />
                <input placeholder="Slug (optionnel)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="p-2 border border-slate-300 rounded font-mono text-sm" />
              </div>
              <textarea required placeholder="Contenu (HTML autorisé)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={9} className="w-full p-2 border border-slate-300 rounded font-mono text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PageRecord['status'] })} className="p-2 border border-slate-300 rounded">
                  <option value="BROUILLON">Brouillon</option>
                  <option value="PUBLIE">Publié</option>
                </select>
                <input placeholder="Titre SEO" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className="p-2 border border-slate-300 rounded" />
              </div>
              <textarea placeholder="Description SEO" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} rows={2} className="w-full p-2 border border-slate-300 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <input type="url" placeholder="URL canonique" value={form.canonical} onChange={(e) => setForm({ ...form, canonical: e.target.value })} className="p-2 border border-slate-300 rounded" />
                <input type="url" placeholder="Image Open Graph (URL)" value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} className="p-2 border border-slate-300 rounded" />
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
        title="Supprimer cette page ?"
        message="Cette action est irréversible."
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
