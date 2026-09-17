'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Loader2, AlertCircle, CheckCircle2, X, Award } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { api } from '@/lib/api';

const EMPTY_CLUB = { name: '', slug: '', description: '', domain: '', leadName: '', logoUrl: '', photoUrl: '' };

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(EMPTY_CLUB);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/clubs');
      setClubs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Erreur chargement clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_CLUB); setModal(true); };
  const openEdit = (club: any) => { setEditing(club); setForm({ ...club }); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/clubs/${editing.id}`, form);
      } else {
        await api.post('/clubs', form);
      }
      setModal(false);
      await load();
      showToast(editing ? 'Club modifié !' : 'Club créé !');
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/clubs/${deleteId}`);
      await load();
      showToast('Club supprimé.');
    } catch (e) {
      showToast('Erreur réseau', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold ${toast.type === 'success' ? 'bg-ige-greenSoft border border-ige-greenSoft text-ige-greenDark' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">Clubs IGE</h1>
          <p className="text-sm text-slate-500">{clubs.length} club{clubs.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-ige-violet text-white text-sm font-bold rounded-lg hover:bg-ige-violetDark transition-all">
          <Plus className="w-4 h-4" /> Nouveau Club
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-ige-violet" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[550px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Logo</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nom</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Domaine</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Projets</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clubs.map((club) => (
                <tr key={club.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    {club.logoUrl ? (
                      <div className="relative w-8 h-8">
                        <Image 
                          src={club.logoUrl} 
                          alt={club.name} 
                          fill
                          className="object-contain rounded"
                          sizes="32px"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded bg-ige-violetSoft flex items-center justify-center"><Award className="w-4 h-4 text-ige-violet" /></div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{club.name}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{club.domain}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{club.leadName || '—'}</td>
                  <td className="px-4 py-3"><span className="text-xs font-bold text-ige-violet bg-ige-violetSoft px-2 py-1 rounded-full">{club.projects?.length ?? 0}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(club)} className="p-1.5 rounded-lg text-slate-400 hover:text-ige-violet hover:bg-ige-violetSoft transition-all"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(club.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {clubs.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">Aucun club. Créez le premier !</div>}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-2 sm:my-8 overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200">
              <h2 className="font-display font-bold text-slate-900">{editing ? 'Modifier le Club' : 'Nouveau Club'}</h2>
              <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              {[
                { key: 'name', label: 'Nom du club *', placeholder: 'Ex: Club IoT & Électronique' },
                { key: 'slug', label: 'Slug (URL) *', placeholder: 'Ex: electronique-iot' },
                { key: 'domain', label: 'Domaine *', placeholder: 'Ex: IoT, Robotique...' },
                { key: 'leadName', label: 'Nom du responsable', placeholder: 'Ex: Jean Dupont' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-slate-700">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="mt-1 w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-ige-violet"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-slate-700">Description *</label>
                <textarea
                  rows={3}
                  placeholder="Description du club..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-ige-violet resize-none"
                />
              </div>
              <FileUpload label="Logo du club" value={form.logoUrl} onChange={(url) => setForm({ ...form, logoUrl: url })} accept="image/*" />
              <FileUpload label="Photo du club" value={form.photoUrl} onChange={(url) => setForm({ ...form, photoUrl: url })} accept="image/*" />
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all">Annuler</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.slug} className="flex-1 py-2.5 rounded-lg bg-ige-violet text-white text-sm font-bold hover:bg-ige-violetDark disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? 'Enregistrer' : 'Créer le Club'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression professionnelle */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Supprimer ce club ?"
        message="Êtes-vous sûr de vouloir supprimer définitivement ce club ? Tous les projets associés à ce club pourraient être impactés."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        loading={deleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
