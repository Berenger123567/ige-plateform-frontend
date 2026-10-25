'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

type Tab = 'subscribers' | 'segments' | 'campaigns' | 'stats';

type Subscriber = {
  id: string;
  email: string;
  firstName?: string | null;
  source?: string | null;
  profile?: string | null;
  institution?: string | null;
  domainOfInterest?: string | null;
  status: string;
  isActive: boolean;
  createdAt: string;
  segments?: { id: string; name: string }[];
};

type Segment = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  rules?: Record<string, string> | null;
  subscriberCount: number;
};

type Campaign = {
  id: string;
  subject: string;
  status: string;
  sentCount: number;
  failedCount: number;
  opensCount: number;
  clicksCount: number;
  createdAt: string;
  segment?: { id: string; name: string } | null;
  rates?: { openRate: number; clickRate: number; unsubscribeRate: number };
  _count?: { deliveries: number };
};

type NewsletterStats = {
  total: number;
  active: number;
  pending: number;
  inactive: number;
  last30Days: number;
  campaigns: number;
  bySource: { source: string | null; count: number }[];
  totals?: { sentCount?: number; opensCount?: number; clicksCount?: number; unsubscribesCount?: number };
};

const STATUS_LABELS: Record<string, string> = {
  ACTIF: 'Actif',
  EN_ATTENTE: 'En attente',
  DESACTIF: 'Désactivé',
};

const TABS: { id: Tab; label: string }[] = [
  { id: 'subscribers', label: 'Abonnés' },
  { id: 'segments', label: 'Segments' },
  { id: 'campaigns', label: 'Campagnes' },
  { id: 'stats', label: 'Statistiques' },
];

export default function NewsletterAdmin() {
  const [tab, setTab] = useState<Tab>('subscribers');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchSubscribers = useCallback(async () => {
    const params: Record<string, string> = {};
    if (search) params.q = search;
    if (statusFilter) params.status = statusFilter;
    const res = await api.get('/admin/newsletter/subscribers', { params });
    setSubscribers(Array.isArray(res.data) ? res.data : []);
  }, [search, statusFilter]);

  const fetchSegments = useCallback(async () => {
    const res = await api.get('/admin/newsletter/segments');
    setSegments(Array.isArray(res.data) ? res.data : []);
  }, []);

  const fetchCampaigns = useCallback(async () => {
    const res = await api.get('/admin/newsletter/campaigns');
    setCampaigns(Array.isArray(res.data) ? res.data : []);
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await api.get('/admin/newsletter/stats');
    setStats(res.data);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchSubscribers(), fetchSegments(), fetchCampaigns(), fetchStats()]);
    } catch (err) {
      showToast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, [fetchSubscribers, fetchSegments, fetchCampaigns, fetchStats, showToast]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const updateSubscriberStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/newsletter/subscribers/${id}`, { status });
      showToast('Statut mis à jour', 'success');
      await Promise.all([fetchSubscribers(), fetchStats()]);
    } catch (err) {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Supprimer cet abonné ?')) return;
    try {
      await api.delete(`/admin/newsletter/subscribers/${id}`);
      showToast('Abonné supprimé', 'success');
      await Promise.all([fetchSubscribers(), fetchStats()]);
    } catch (err) {
      showToast('Erreur réseau', 'error');
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) return;
    const header = 'Email,Source,Statut,Profil,Institution,Date Inscription\n';
    const rows = subscribers.map((s) =>
      [s.email, s.source || '', STATUS_LABELS[s.status] || s.status, s.profile || '', s.institution || '',
        s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '']
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(',')
    ).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(header + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `abonnes_newsletter_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-navy" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white z-50 ${toast.type === 'success' ? 'bg-ige-teal' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition ${
              tab === item.id
                ? 'border-ige-teal text-ige-teal bg-white'
                : 'border-transparent text-slate-500 hover:text-ige-navy'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'subscribers' && (
        <SubscribersTab
          subscribers={subscribers}
          search={search}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
          onRefresh={fetchSubscribers}
          onUpdateStatus={updateSubscriberStatus}
          onDelete={deleteSubscriber}
          onExport={exportCSV}
          activeCount={stats?.active || 0}
        />
      )}

      {tab === 'segments' && (
        <SegmentsTab segments={segments} onRefresh={fetchSegments} showToast={showToast} />
      )}

      {tab === 'campaigns' && (
        <CampaignsTab
          campaigns={campaigns}
          segments={segments}
          onRefresh={async () => {
            await Promise.all([fetchCampaigns(), fetchStats()]);
          }}
          showToast={showToast}
        />
      )}

      {tab === 'stats' && <StatsTab stats={stats} onRefresh={fetchStats} />}
    </div>
  );
}

function SubscribersTab(props: {
  subscribers: Subscriber[];
  search: string;
  statusFilter: string;
  activeCount: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => Promise<void>;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onExport: () => void;
}) {
  const { subscribers, search, statusFilter, activeCount } = props;
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <input
            value={search}
            onChange={(e) => props.onSearchChange(e.target.value)}
            placeholder="Rechercher un email, un nom ou une institution..."
            className="w-full sm:max-w-sm p-2 border border-slate-300 rounded focus:border-ige-navy outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => props.onStatusChange(e.target.value)}
            className="p-2 border border-slate-300 rounded focus:border-ige-navy outline-none"
          >
            <option value="">Tous les statuts</option>
            <option value="ACTIF">Actif</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="DESACTIF">Désactivé</option>
          </select>
          <button onClick={() => props.onRefresh()} className="px-4 py-2 text-sm font-semibold bg-slate-100 rounded hover:bg-slate-200">
            Filtrer
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-5 py-2 rounded-lg shadow-sm border border-slate-200 text-center">
            <span className="block text-xs text-slate-500">Actifs</span>
            <span className="text-lg font-bold text-ige-navy">{activeCount}</span>
          </div>
          <button onClick={props.onExport} className="bg-ige-teal hover:bg-ige-tealDark text-white px-4 py-2 rounded-md transition font-medium">
            Exporter CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Aucun abonné trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="p-4">Email</th>
                  <th className="p-4">Profil</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Segments</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Inscription</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-medium text-ige-navyDark">{s.email}</div>
                      {s.firstName && <div className="text-xs text-slate-500">{s.firstName}</div>}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {s.profile || 'N/A'}
                      {s.institution && <div className="text-xs text-slate-400">{s.institution}</div>}
                    </td>
                    <td className="p-4 text-slate-600">{s.source || 'Site Web'}</td>
                    <td className="p-4 text-xs text-slate-500">
                      {s.segments && s.segments.length > 0 ? s.segments.map((seg) => seg.name).join(', ') : '—'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${s.status === 'ACTIF' ? 'bg-ige-teal/20 text-ige-tealDark' : 'bg-slate-200 text-slate-600'}`}>
                        {STATUS_LABELS[s.status] || s.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <select
                        value={s.status}
                        onChange={(e) => props.onUpdateStatus(s.id, e.target.value)}
                        className="mr-3 p-1.5 text-xs border border-slate-300 rounded"
                      >
                        <option value="ACTIF">Actif</option>
                        <option value="EN_ATTENTE">En attente</option>
                        <option value="DESACTIF">Désactivé</option>
                      </select>
                      <button onClick={() => props.onDelete(s.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
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
    </div>
  );
}

function SegmentsTab(props: {
  segments: Segment[];
  onRefresh: () => Promise<void>;
  showToast: (message: string, type: 'success' | 'error') => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/newsletter/segments', {
        name,
        description: description || undefined,
        rules: rules ? rules : undefined,
      });
      props.showToast('Segment créé', 'success');
      setName('');
      setDescription('');
      setRules('');
      await props.onRefresh();
    } catch (err: any) {
      props.showToast(err.response?.data?.error || 'Erreur lors de la création', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce segment ?')) return;
    try {
      await api.delete(`/admin/newsletter/segments/${id}`);
      props.showToast('Segment supprimé', 'success');
      await props.onRefresh();
    } catch (err: any) {
      props.showToast(err.response?.data?.error || 'Erreur réseau', 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-4">Nom</th>
                <th className="p-4">Règles</th>
                <th className="p-4">Abonnés</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {props.segments.map((segment) => (
                <tr key={segment.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-medium">{segment.name}</div>
                    {segment.description && <div className="text-xs text-slate-500">{segment.description}</div>}
                  </td>
                  <td className="p-4 text-xs text-slate-600">
                    {segment.rules && Object.keys(segment.rules).length > 0
                      ? Object.entries(segment.rules).map(([key, value]) => `${key}: ${value}`).join(' · ')
                      : 'Aucune règle'}
                  </td>
                  <td className="p-4 font-semibold text-ige-navy">{segment.subscriberCount}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => remove(segment.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {props.segments.length === 0 && (
            <div className="p-8 text-center text-slate-500">Aucun segment pour le moment.</div>
          )}
        </div>
      </div>

      <form onSubmit={submit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 space-y-3 h-fit">
        <h2 className="font-bold text-ige-navyDark">Nouveau segment</h2>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du segment" className="w-full p-2 border border-slate-300 rounded" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} className="w-full p-2 border border-slate-300 rounded" />
        <textarea
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder='Règles JSON, ex. {"profile":"Etudiant","source":"SITE_WEB"}'
          rows={4}
          className="w-full p-2 border border-slate-300 rounded font-mono text-xs"
        />
        <p className="text-xs text-slate-500">Clés autorisées : source, profile, institution, domainOfInterest.</p>
        <button disabled={saving} type="submit" className="w-full bg-ige-navy text-white py-2 rounded font-semibold hover:bg-ige-navyDark disabled:opacity-60">
          {saving ? 'Création…' : 'Créer le segment'}
        </button>
      </form>
    </div>
  );
}

function CampaignsTab(props: {
  campaigns: Campaign[];
  segments: Segment[];
  onRefresh: () => Promise<void>;
  showToast: (message: string, type: 'success' | 'error') => void;
}) {
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [segmentId, setSegmentId] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('Créer cette campagne en brouillon ?')) return;
    setSaving(true);
    try {
      await api.post('/admin/newsletter/campaigns', {
        subject,
        html,
        segmentId: segmentId || undefined,
        sendNow: false,
      });
      props.showToast('Campagne créée en brouillon', 'success');
      setSubject('');
      setHtml('');
      setSegmentId('');
      await props.onRefresh();
    } catch (err: any) {
      props.showToast(err.response?.data?.error || 'Erreur lors de la création', 'error');
    } finally {
      setSaving(false);
    }
  };

  const send = async (id: string) => {
    if (!confirm('Envoyer cette campagne maintenant ?')) return;
    try {
      await api.post(`/admin/newsletter/campaigns/${id}/send`);
      props.showToast('Campagne envoyée', 'success');
      await props.onRefresh();
    } catch (err: any) {
      props.showToast(err.response?.data?.error || "Erreur lors de l'envoi", 'error');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Supprimer cette campagne ?')) return;
    try {
      await api.delete(`/admin/newsletter/campaigns/${id}`);
      props.showToast('Campagne supprimée', 'success');
      await props.onRefresh();
    } catch (err: any) {
      props.showToast(err.response?.data?.error || 'Erreur réseau', 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-4">Sujet</th>
                <th className="p-4">Segment</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Envoyés</th>
                <th className="p-4">Ouvertures</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {props.campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 font-medium">{campaign.subject}</td>
                  <td className="p-4 text-sm text-slate-600">{campaign.segment?.name || 'Tous'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${campaign.status === 'ENVOYE' ? 'bg-ige-teal/20 text-ige-tealDark' : 'bg-slate-200 text-slate-600'}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{campaign.sentCount}</td>
                  <td className="p-4 text-sm">{campaign.opensCount} ({campaign.rates?.openRate ?? 0}%)</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    {campaign.status !== 'ENVOYE' && (
                      <button onClick={() => send(campaign.id)} className="text-ige-teal hover:text-ige-tealDark mr-3 text-sm font-medium">
                        Envoyer
                      </button>
                    )}
                    <button onClick={() => remove(campaign.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {props.campaigns.length === 0 && (
            <div className="p-8 text-center text-slate-500">Aucune campagne pour le moment.</div>
          )}
        </div>
      </div>

      <form onSubmit={submit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 space-y-3 h-fit">
        <h2 className="font-bold text-ige-navyDark">Nouvelle campagne</h2>
        <input required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Sujet de l'email" className="w-full p-2 border border-slate-300 rounded" />
        <select value={segmentId} onChange={(e) => setSegmentId(e.target.value)} className="w-full p-2 border border-slate-300 rounded">
          <option value="">Tous les abonnés actifs</option>
          {props.segments.map((segment) => (
            <option key={segment.id} value={segment.id}>{segment.name} ({segment.subscriberCount})</option>
          ))}
        </select>
        <textarea required value={html} onChange={(e) => setHtml(e.target.value)} placeholder="Contenu HTML de l'email" rows={7} className="w-full p-2 border border-slate-300 rounded font-mono text-xs" />
        <button disabled={saving} type="submit" className="w-full bg-ige-navy text-white py-2 rounded font-semibold hover:bg-ige-navyDark disabled:opacity-60">
          {saving ? 'Création…' : 'Créer le brouillon'}
        </button>
      </form>
    </div>
  );
}

function StatsTab(props: { stats: NewsletterStats | null; onRefresh: () => Promise<void> }) {
  const stats = props.stats;
  const cards = useMemo(() => [
    { label: 'Total abonnés', value: stats?.total ?? 0 },
    { label: 'Actifs', value: stats?.active ?? 0 },
    { label: 'En attente', value: stats?.pending ?? 0 },
    { label: 'Désactivés', value: stats?.inactive ?? 0 },
    { label: 'Nouveaux (30 jours)', value: stats?.last30Days ?? 0 },
    { label: 'Campagnes envoyées', value: stats?.campaigns ?? 0 },
  ], [stats]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => props.onRefresh()} className="px-4 py-2 text-sm font-semibold bg-slate-100 rounded hover:bg-slate-200">
          Actualiser
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <span className="block text-xs text-slate-500">{card.label}</span>
            <span className="text-2xl font-bold text-ige-navy">{card.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <h2 className="font-bold text-ige-navyDark mb-3">Répartition par source</h2>
          {(stats?.bySource || []).length === 0 ? (
            <p className="text-sm text-slate-500">Aucune donnée.</p>
          ) : (
            <ul className="space-y-2">
              {(stats?.bySource || []).map((item) => (
                <li key={item.source || 'inconnu'} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.source || 'Inconnu'}</span>
                  <span className="font-semibold">{item.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <h2 className="font-bold text-ige-navyDark mb-3">Performance globale</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-slate-600">Emails envoyés</span><span className="font-semibold">{stats?.totals?.sentCount ?? 0}</span></li>
            <li className="flex justify-between"><span className="text-slate-600">Ouvertures</span><span className="font-semibold">{stats?.totals?.opensCount ?? 0}</span></li>
            <li className="flex justify-between"><span className="text-slate-600">Clics</span><span className="font-semibold">{stats?.totals?.clicksCount ?? 0}</span></li>
            <li className="flex justify-between"><span className="text-slate-600">Désinscriptions</span><span className="font-semibold">{stats?.totals?.unsubscribesCount ?? 0}</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
