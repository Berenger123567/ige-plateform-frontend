'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ConfirmModal from '@/components/admin/ConfirmModal';

type Application = {
  id: string;
  organization: string;
  contactName: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  partnerType?: string | null;
  contributionType?: string | null;
  message: string;
  status: 'NOUVEAU' | 'EN_REVUE' | 'ACCEPTE' | 'REJETE';
  adminNote?: string | null;
  createdAt: string;
};

const STATUSES = [
  { value: 'NOUVEAU', label: 'Nouveau' },
  { value: 'EN_REVUE', label: 'En revue' },
  { value: 'ACCEPTE', label: 'Accepté' },
  { value: 'REJETE', label: 'Rejeté' },
];

export default function CandidaturesAdmin() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Application | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.q = search;
      const res = await api.get('/admin/partner-applications', { params });
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateStatus = async (application: Application, status: string) => {
    try {
      await api.put(`/admin/partner-applications/${application.id}`, { status });
      showToast('Statut mis à jour', 'success');
      await fetchAll();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erreur lors de la mise à jour', 'error');
    }
  };

  const saveNote = async () => {
    if (!selected) return;
    try {
      await api.put(`/admin/partner-applications/${selected.id}`, { adminNote });
      showToast('Note enregistrée', 'success');
      setSelected({ ...selected, adminNote });
      await fetchAll();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erreur lors de la sauvegarde', 'error');
    }
  };

  const convert = async (application: Application) => {
    if (!confirm(`Convertir « ${application.organization} » en partenaire ?`)) return;
    try {
      await api.post(`/admin/partner-applications/${application.id}/convert`);
      showToast('Partenaire créé', 'success');
      setSelected(null);
      await fetchAll();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erreur lors de la conversion', 'error');
    }
  };

  const remove = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/partner-applications/${deleteId}`);
      showToast('Candidature supprimée', 'success');
      setDeleteId(null);
      setSelected(null);
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

      <div>
        <h1 className="text-2xl font-bold text-ige-navyDark">Candidatures partenaires</h1>
        <p className="text-sm text-slate-500">Demandes reçues via le formulaire public de partenariat.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une organisation, un contact ou un email..."
          className="w-full sm:max-w-sm p-2 border border-slate-300 rounded"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border border-slate-300 rounded">
          <option value="">Tous les statuts</option>
          {STATUSES.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
        </select>
        <button onClick={() => fetchAll()} className="px-4 py-2 text-sm font-semibold bg-slate-100 rounded hover:bg-slate-200">Filtrer</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-navy" /></div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-4">Organisation</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Type</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 font-medium">{application.organization}</td>
                  <td className="p-4 text-sm text-slate-600">
                    {application.contactName}
                    <div className="text-xs text-slate-400">{application.email}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{application.partnerType || '—'}</td>
                  <td className="p-4">
                    <select
                      value={application.status}
                      onChange={(e) => updateStatus(application, e.target.value)}
                      className="p-1.5 text-xs border border-slate-300 rounded"
                    >
                      {STATUSES.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{new Date(application.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => { setSelected(application); setAdminNote(application.adminNote || ''); }}
                      className="text-ige-navy hover:text-ige-navyDark mr-3 text-sm font-medium"
                    >
                      Détails
                    </button>
                    <button onClick={() => convert(application)} className="text-ige-teal hover:text-ige-tealDark mr-3 text-sm font-medium">Convertir</button>
                    <button onClick={() => setDeleteId(application.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && <div className="p-8 text-center text-slate-500">Aucune candidature.</div>}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-ige-navyDark">{selected.organization}</h2>
                <p className="text-sm text-slate-500">{selected.contactName} · {selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-800 text-2xl leading-none">×</button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p><span className="text-slate-500">Téléphone :</span> {selected.phone || '—'}</p>
              <p><span className="text-slate-500">Site web :</span> {selected.website || '—'}</p>
              <p><span className="text-slate-500">Type :</span> {selected.partnerType || '—'}</p>
              <p><span className="text-slate-500">Contribution :</span> {selected.contributionType || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 mb-1">Message</p>
              <p className="text-sm text-slate-700 whitespace-pre-line bg-slate-50 rounded p-3">{selected.message}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Note interne</label>
              <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={3} className="w-full p-2 border border-slate-300 rounded" />
              <div className="flex justify-end mt-2">
                <button onClick={saveNote} className="px-4 py-2 bg-ige-navy text-white rounded hover:bg-ige-navyDark text-sm">Enregistrer la note</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Supprimer cette candidature ?"
        message="Cette action est irréversible."
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
