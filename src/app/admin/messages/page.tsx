'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/messages');
      setMessages(Array.isArray(res.data) ? res.data : []);
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

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/admin/messages/${id}/read`);
      showToast('Message marqué comme lu', 'success');
      fetchData();
    } catch (err) {
      showToast('Erreur réseau', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement ce message ?')) return;
    try {
      await api.delete(`/admin/messages/${id}`);
      showToast('Message supprimé', 'success');
      fetchData();
    } catch (err) {
      showToast('Erreur réseau', 'error');
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-6 text-slate-900">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white z-50 ${toast.type === 'success' ? 'bg-ige-green' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-ige-violetDark">Messages Contact</h1>
        <div className="flex space-x-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
          <div className="text-center px-4 border-r border-slate-200">
            <span className="block text-sm text-slate-500">Total</span>
            <span className="text-xl font-bold">{messages.length}</span>
          </div>
          <div className="text-center px-4">
            <span className="block text-sm text-slate-500">Non lus</span>
            <span className="text-xl font-bold text-ige-violet">{unreadCount}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-violet"></div></div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Aucun message pour le moment.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="p-4">Date</th>
                    <th className="p-4">Expéditeur</th>
                    <th className="p-4">Sujet</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m) => (
                    <tr key={m._id || m.id} className={`border-b border-slate-200 hover:bg-slate-50 ${!m.isRead ? 'bg-ige-violet/5' : ''}`}>
                      <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                        {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ''}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-slate-500">{m.email}</div>
                      </td>
                      <td className="p-4 font-medium">{m.subject}</td>
                      <td className="p-4 text-sm text-slate-600">
                        {m.message?.length > 80 ? m.message.substring(0, 80) + '...' : m.message}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${m.isRead ? 'bg-slate-100 text-slate-500' : 'bg-ige-violet text-white'}`}>
                          {m.isRead ? 'Lu' : 'Nouveau'}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {!m.isRead && (
                          <button onClick={() => markAsRead(m._id || m.id)} className="text-ige-green hover:text-ige-greenDark mr-3 text-sm font-medium">
                            Marquer lu
                          </button>
                        )}
                        <button onClick={() => handleDelete(m._id || m.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
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
