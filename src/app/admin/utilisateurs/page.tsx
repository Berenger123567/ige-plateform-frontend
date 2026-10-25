'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

type AuditLog = {
  id: string;
  email?: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  ip?: string | null;
  createdAt: string;
};

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'COMMUNICATION', 'EVENT_MANAGER', 'PROJECT_MANAGER', 'EDITOR'];

export default function UtilisateursAdmin() {
  const [tab, setTab] = useState<'users' | 'logs'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EDITOR', isActive: true });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, logsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/audit-logs').catch(() => ({ data: [] })),
      ]);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
    } catch (err: any) {
      setError(err.response?.status === 403 ? 'Accès réservé aux super administrateurs.' : 'Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openModal = (user?: User) => {
    if (user) {
      setEditingId(user.id);
      setForm({ name: user.name, email: user.email, password: '', role: user.role, isActive: user.isActive });
    } else {
      setEditingId(null);
      setForm({ name: '', email: '', password: '', role: 'EDITOR', isActive: true });
    }
    setShowModal(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/users/${editingId}`, {
          name: form.name,
          role: form.role,
          isActive: form.isActive,
          ...(form.password ? { password: form.password } : {}),
        });
      } else {
        await api.post('/admin/users', form);
      }
      showToast(editingId ? 'Utilisateur modifié' : 'Utilisateur créé', 'success');
      setShowModal(false);
      await fetchAll();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erreur lors de la sauvegarde', 'error');
    }
  };

  const toggleActive = async (user: User) => {
    try {
      await api.put(`/admin/users/${user.id}`, { isActive: !user.isActive });
      showToast('Statut mis à jour', 'success');
      await fetchAll();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Erreur lors de la mise à jour', 'error');
    }
  };

  const remove = async (user: User) => {
    if (!confirm(`Supprimer l’utilisateur ${user.email} ?`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      showToast('Utilisateur supprimé', 'success');
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ige-navyDark">Utilisateurs & journal</h1>
          <p className="text-sm text-slate-500">Comptes administrateurs et traçabilité des actions.</p>
        </div>
        {tab === 'users' && (
          <button onClick={() => openModal()} className="bg-ige-navy text-white px-4 py-2 rounded-md hover:bg-ige-navyDark">
            + Nouvel utilisateur
          </button>
        )}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button onClick={() => setTab('users')} className={`px-4 py-2 text-sm font-semibold border-b-2 ${tab === 'users' ? 'border-ige-teal text-ige-teal' : 'border-transparent text-slate-500'}`}>
          Utilisateurs
        </button>
        <button onClick={() => setTab('logs')} className={`px-4 py-2 text-sm font-semibold border-b-2 ${tab === 'logs' ? 'border-ige-teal text-ige-teal' : 'border-transparent text-slate-500'}`}>
          Journal d’audit
        </button>
      </div>

      {error && <div className="p-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-navy" /></div>
      ) : tab === 'users' ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-4">Nom</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rôle</th>
                <th className="p-4">Actif</th>
                <th className="p-4">Créé le</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-sm text-slate-600">{user.email}</td>
                  <td className="p-4 text-sm"><span className="px-2 py-1 rounded bg-slate-100 text-xs font-semibold">{user.role}</span></td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(user)} className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-ige-teal/20 text-ige-tealDark' : 'bg-slate-200 text-slate-600'}`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button onClick={() => openModal(user)} className="text-ige-navy hover:text-ige-navyDark mr-3 text-sm font-medium">Modifier</button>
                    <button onClick={() => remove(user)} className="text-red-500 hover:text-red-700 text-sm font-medium">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="p-8 text-center text-slate-500">Aucun utilisateur.</div>}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-4">Date</th>
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entité</th>
                <th className="p-4">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 text-sm text-slate-600">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="p-4 text-sm">{log.email || '—'}</td>
                  <td className="p-4 text-sm font-mono">{log.action}</td>
                  <td className="p-4 text-sm text-slate-600">{log.entity || '—'}{log.entityId ? ` #${log.entityId.slice(0, 8)}` : ''}</td>
                  <td className="p-4 text-sm text-slate-500">{log.ip || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && <div className="p-8 text-center text-slate-500">Aucune action enregistrée.</div>}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4 text-ige-navyDark">{editingId ? 'Modifier l’utilisateur' : 'Nouvel utilisateur'}</h2>
            <form onSubmit={submit} className="space-y-4">
              <input required placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border border-slate-300 rounded" />
              <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={Boolean(editingId)} className="w-full p-2 border border-slate-300 rounded disabled:bg-slate-100" />
              <input
                type="password"
                placeholder={editingId ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe (min. 8 caractères)'}
                required={!editingId}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded"
              />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full p-2 border border-slate-300 rounded">
                {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Compte actif
              </label>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-ige-navy text-white rounded hover:bg-ige-navyDark">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
