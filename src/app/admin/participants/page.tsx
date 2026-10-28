'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { api } from '@/lib/api';
import { Download, RotateCcw, ExternalLink, Search } from '@/components/IconImage';

export default function ParticipantsAdmin() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [filterCheckin, setFilterCheckin] = useState('Tous');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(20);

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Par defaut, le backend limite a 20 sans parametre limit. On demande jusqu'a 1000 pour tout recuperer.
      const res = await api.get('/admin/je-ge/participants', {
        params: { limit: 1000 }
      });
      setParticipants(Array.isArray(res.data) ? res.data : []);
      if (isManualRefresh) {
        showToast('Données actualisées', 'success');
      }
    } catch (err) {
      showToast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/je-ge/participants/${deleteId}`);
      showToast('Participant supprimé', 'success');
      fetchData();
    } catch (err) {
      showToast('Erreur de suppression', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  // Filtrage et recherche
  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      const matchFilter = filterCheckin === 'Tous' 
        ? true 
        : filterCheckin === 'Present' ? p.checkedIn : !p.checkedIn;
      
      const searchLower = search.toLowerCase().trim();
      if (!searchLower) return matchFilter;

      const fullName = `${p.firstName || ''} ${p.lastName || ''}`.trim().toLowerCase();
      const matchSearch = fullName.includes(searchLower) ||
                          (p.email && p.email.toLowerCase().includes(searchLower)) ||
                          (p.registrationNumber && p.registrationNumber.toLowerCase().includes(searchLower)) ||
                          (p.phone && p.phone.toLowerCase().includes(searchLower)) ||
                          (p.institution && p.institution.toLowerCase().includes(searchLower));
                          
      return matchFilter && matchSearch;
    });
  }, [participants, filterCheckin, search]);

  // Réinitialiser la pagination lors d'une recherche ou changement de filtre
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCheckin, pageSize]);

  // Calculs statistiques globaux
  const totalInscrits = participants.length;
  const totalPresents = participants.filter(p => p.checkedIn).length;
  const tauxPresence = totalInscrits > 0 ? Math.round((totalPresents / totalInscrits) * 100) : 0;

  // Calcul pagination
  const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(filteredParticipants.length / Number(pageSize)));
  const paginatedParticipants = useMemo(() => {
    if (pageSize === 'all') return filteredParticipants;
    const start = (currentPage - 1) * Number(pageSize);
    return filteredParticipants.slice(start, start + Number(pageSize));
  }, [filteredParticipants, currentPage, pageSize]);

  // Export CSV
  const exportToCSV = () => {
    if (filteredParticipants.length === 0) {
      showToast('Aucun participant à exporter', 'error');
      return;
    }

    const headers = [
      'Nom',
      'Prénom',
      'Email',
      'Téléphone',
      'Matricule',
      'Profil',
      'Institution',
      'Département',
      'Statut',
      'Date d\'inscription'
    ];

    const rows = filteredParticipants.map(p => [
      `"${(p.lastName || '').replace(/"/g, '""')}"`,
      `"${(p.firstName || '').replace(/"/g, '""')}"`,
      `"${(p.email || '').replace(/"/g, '""')}"`,
      `"${(p.phone || '').replace(/"/g, '""')}"`,
      `"${(p.registrationNumber || '').replace(/"/g, '""')}"`,
      `"${(p.profile || '').replace(/"/g, '""')}"`,
      `"${(p.institution || '').replace(/"/g, '""')}"`,
      `"${(p.department || '').replace(/"/g, '""')}"`,
      `"${p.checkedIn ? 'Présent' : 'Inscrit'}"`,
      `"${p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `participants_jege_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Export CSV téléchargé', 'success');
  };

  const startIndex = filteredParticipants.length === 0 ? 0 : (currentPage - 1) * (pageSize === 'all' ? filteredParticipants.length : Number(pageSize)) + 1;
  const endIndex = pageSize === 'all' ? filteredParticipants.length : Math.min(currentPage * Number(pageSize), filteredParticipants.length);

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white z-50 ${toast.type === 'success' ? 'bg-ige-teal' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-ige-navyDark">Participants JE-GE</h1>
            <p className="text-sm text-slate-500">Gestion et suivi de la liste des inscrits et émargements</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-ige-navy hover:text-ige-navy transition-all shadow-sm disabled:opacity-50"
              title="Actualiser la liste"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
            <button
              onClick={exportToCSV}
              disabled={filteredParticipants.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-ige-navy text-white hover:bg-ige-navyDark transition-all shadow-sm disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter CSV ({filteredParticipants.length})</span>
            </button>
          </div>
        </div>
        
        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <span className="block text-sm text-slate-500">Total des inscrits</span>
            <span className="text-2xl font-bold text-slate-800">{totalInscrits}</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <span className="block text-sm text-slate-500">Présents</span>
            <span className="text-2xl font-bold text-ige-teal">{totalPresents}</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <span className="block text-sm text-slate-500">Taux de présence</span>
            <span className="text-2xl font-bold text-ige-navy">{tauxPresence}%</span>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex-1 w-full md:max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Rechercher par nom, email, matricule, téléphone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded focus:border-ige-navy outline-none text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">Statut:</label>
              <select 
                value={filterCheckin} 
                onChange={(e) => setFilterCheckin(e.target.value)}
                className="py-1.5 px-2.5 border border-slate-300 rounded focus:border-ige-navy outline-none text-xs bg-white"
              >
                <option value="Tous">Tous</option>
                <option value="Present">Présents uniquement</option>
                <option value="Inscrit">Inscrits (Absents)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">Lignes:</label>
              <select 
                value={pageSize} 
                onChange={(e) => setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="py-1.5 px-2.5 border border-slate-300 rounded focus:border-ige-navy outline-none text-xs bg-white"
              >
                <option value={20}>20 par page</option>
                <option value={50}>50 par page</option>
                <option value={100}>100 par page</option>
                <option value="all">Tout afficher</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-navy"></div></div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {filteredParticipants.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              {participants.length === 0 ? 'Aucun participant inscrit pour le moment.' : 'Aucun participant ne correspond à votre recherche.'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold uppercase text-slate-600 tracking-wider">
                      <th className="p-3.5">Participant</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5">Matricule</th>
                      <th className="p-3.5">Profil & Institution</th>
                      <th className="p-3.5">Statut</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {paginatedParticipants.map((p) => (
                      <tr key={p._id || p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <p className="font-semibold text-slate-900">{p.firstName} {p.lastName}</p>
                          {p.department && <p className="text-xs text-slate-400">{p.department}</p>}
                        </td>
                        <td className="p-3.5">
                          <p className="text-slate-700">{p.email}</p>
                          {p.phone && <p className="text-xs text-slate-500">{p.phone}</p>}
                        </td>
                        <td className="p-3.5">
                          <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                            {p.registrationNumber || 'N/A'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <p className="font-medium text-slate-800">{p.profile || 'N/A'}</p>
                          <p className="text-xs text-slate-500">{p.institution || '-'}</p>
                        </td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            p.checkedIn 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {p.checkedIn ? 'Présent' : 'Inscrit'}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 text-xs whitespace-nowrap">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }) : 'N/A'}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          {p.qrCodeToken && (
                            <Link
                              href={`/je-ge/ticket?token=${encodeURIComponent(p.qrCodeToken)}`}
                              target="_blank"
                              className="text-ige-navy hover:text-ige-teal text-xs font-medium mr-3 inline-flex items-center gap-1"
                              title="Voir le ticket"
                            >
                              <span>Ticket</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                          <button 
                            onClick={() => confirmDelete(p.id)} 
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Barre de pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
                <div>
                  Affichage de <span className="font-semibold text-slate-800">{startIndex}</span> à <span className="font-semibold text-slate-800">{endIndex}</span> sur <span className="font-semibold text-slate-800">{filteredParticipants.length}</span> participant{filteredParticipants.length > 1 ? 's' : ''}
                  {filteredParticipants.length !== participants.length && (
                    <span className="text-slate-400 ml-1">({participants.length} au total)</span>
                  )}
                </div>

                {pageSize !== 'all' && totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                    >
                      Précédent
                    </button>
                    
                    <span className="px-2 text-slate-700 font-medium">
                      Page {currentPage} sur {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal de confirmation professionnelle */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Supprimer ce participant ?"
        message="Êtes-vous sûr de vouloir supprimer définitivement ce participant de la liste JE-GE ? Cette action est irréversible."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        loading={deleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

