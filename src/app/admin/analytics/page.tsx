'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Overview = {
  periodDays: number;
  totalTrackedEvents: number;
  contentViews: { articles: number; projects: number; events: number };
  newParticipants: number;
  newSubscribers: number;
  byEvent: { name: string; count: number }[];
  topPaths: { path: string; count: number }[];
  daily: { date: string; count: number }[];
};

type AnalyticsEvent = {
  id: string;
  name: string;
  path?: string | null;
  referrer?: string | null;
  createdAt: string;
};

export default function AnalyticsAdmin() {
  const [days, setDays] = useState(30);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [overviewRes, eventsRes] = await Promise.all([
        api.get('/admin/analytics/overview', { params: { days } }),
        api.get('/admin/analytics/events', { params: { limit: 50 } }),
      ]);
      setOverview(overviewRes.data);
      setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
    } catch (err: any) {
      setError(err.response?.status === 403 ? 'Accès non autorisé.' : 'Erreur lors du chargement des statistiques.');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const maxDaily = Math.max(1, ...(overview?.daily || []).map((item) => item.count));

  return (
    <div className="p-6 space-y-6 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ige-navyDark">Analytics</h1>
          <p className="text-sm text-slate-500">Trafic, contenus les plus vus et activité récente.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="p-2 border border-slate-300 rounded text-sm">
            <option value={7}>7 derniers jours</option>
            <option value={30}>30 derniers jours</option>
            <option value={90}>90 derniers jours</option>
          </select>
          <button onClick={() => fetchAll()} className="px-4 py-2 text-sm font-semibold bg-slate-100 rounded hover:bg-slate-200">Actualiser</button>
        </div>
      </div>

      {error && <div className="p-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ige-navy" /></div>
      ) : overview ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <p className="text-xs text-slate-500">Événements suivis</p>
              <p className="text-2xl font-bold text-ige-navy">{overview.totalTrackedEvents}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <p className="text-xs text-slate-500">Vues articles</p>
              <p className="text-2xl font-bold text-ige-navy">{overview.contentViews.articles}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <p className="text-xs text-slate-500">Nouveaux participants</p>
              <p className="text-2xl font-bold text-ige-navy">{overview.newParticipants}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <p className="text-xs text-slate-500">Nouveaux abonnés</p>
              <p className="text-2xl font-bold text-ige-navy">{overview.newSubscribers}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h2 className="font-bold text-ige-navyDark mb-4">Activité quotidienne</h2>
            {overview.daily.length === 0 ? (
              <p className="text-sm text-slate-500">Aucune donnée sur la période.</p>
            ) : (
              <div className="flex items-end gap-1 h-40 overflow-x-auto">
                {overview.daily.map((item) => (
                  <div key={item.date} className="flex-1 min-w-[6px] flex flex-col items-center justify-end h-full" title={`${item.date} : ${item.count}`}>
                    <div className="w-full bg-ige-teal/70 hover:bg-ige-teal rounded-t" style={{ height: `${(item.count / maxDaily) * 100}%` }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
              <h2 className="font-bold text-ige-navyDark mb-3">Pages les plus vues</h2>
              {overview.topPaths.length === 0 ? <p className="text-sm text-slate-500">Aucune donnée.</p> : (
                <ul className="space-y-2 text-sm">
                  {overview.topPaths.map((item) => (
                    <li key={item.path} className="flex justify-between gap-4">
                      <span className="text-slate-600 truncate font-mono">{item.path}</span>
                      <span className="font-semibold">{item.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
              <h2 className="font-bold text-ige-navyDark mb-3">Événements par type</h2>
              {overview.byEvent.length === 0 ? <p className="text-sm text-slate-500">Aucune donnée.</p> : (
                <ul className="space-y-2 text-sm">
                  {overview.byEvent.map((item) => (
                    <li key={item.name} className="flex justify-between gap-4">
                      <span className="text-slate-600 font-mono">{item.name}</span>
                      <span className="font-semibold">{item.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 font-semibold text-sm text-ige-navyDark">Derniers événements</div>
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="p-4">Date</th>
                  <th className="p-4">Nom</th>
                  <th className="p-4">Chemin</th>
                  <th className="p-4">Référent</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 text-sm text-slate-600">{new Date(event.createdAt).toLocaleString()}</td>
                    <td className="p-4 text-sm font-mono">{event.name}</td>
                    <td className="p-4 text-sm text-slate-600">{event.path || '—'}</td>
                    <td className="p-4 text-sm text-slate-500">{event.referrer || 'Direct'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {events.length === 0 && <div className="p-8 text-center text-slate-500">Aucun événement enregistré.</div>}
          </div>
        </>
      ) : null}
    </div>
  );
}
