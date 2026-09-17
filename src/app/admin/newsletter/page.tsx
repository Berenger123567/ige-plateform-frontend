'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/newsletter');
      setSubscribers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showToast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet abonné ?')) return;
    try {
      await api.delete(`/newsletter/${id}`);
      showToast('Abonné supprimé', 'success');
      fetchData();
    } catch (err) {
      showToast('Erreur réseau', 'error');
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) return;
    const header = 'Email,Source,Statut,Date Inscription\n';
    const rows = subscribers.map(s => 
      `${s.email},${s.source || 'Site Web'},${s.status || 'Actif'},${s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}`
    ).join('\n');
    
    const csvContent = "data:text/csv;charset=utf-8," + header + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `abonnes_newsletter_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeCount = subscribers.filter(s => s.status !== 'Inactif' && s.status !== 'Désabonné').length;

  return (
    <div className="space-y-6 text-slate-900">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white z-50 ${toast.type === 'success' ? 'bg-ige-green' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-ige-violetDark">Abonnés Newsletter</h1>
        
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-2 rounded-lg shadow-sm border border-slate-200 text-center">
            <span className="block text-sm text-slate-500">Abonnés Actifs</span>
            <span className="text-xl font-bold text-ige-violet">{activeCount}</span>
          </div>
          <button 
            onClick={exportCSV} 
            className="bg-ige-green hover:bg-ige-greenDark text-white px-4 py-2 rounded-md transition shadow-sm font-medium"
          >
            Exporter CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-violet"></div></div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {subscribers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Aucun abonné pour le moment.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="p-4">Email</th>
                    <th className="p-4">Source</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4">Date d'inscription</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s) => (
                    <tr key={s._id || s.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-4 font-medium text-ige-violetDark">{s.email}</td>
                      <td className="p-4 text-slate-600">{s.source || 'Site Web'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${s.status === 'Inactif' || s.status === 'Désabonné' ? 'bg-slate-200 text-slate-600' : 'bg-ige-green/20 text-ige-greenDark'}`}>
                          {s.status || 'Actif'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(s._id || s.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
