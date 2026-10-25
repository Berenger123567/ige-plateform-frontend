'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, FolderKanban, CalendarDays, MessageSquare,
  Mail, Award, BookOpen, QrCode, TrendingUp, CheckCircle2,
} from '@/components/IconImage';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: 0, projets: 0, evenements: 0,
    participants: 0, messages: 0, newsletter: 0,
    checkedIn: 0, editions: 0, views: 0,
  });
  const [recentParticipants, setRecentParticipants] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => {
        const data = res.data || {};
        const counts = data.counts || {};
        setStats({
          articles: counts.articles || 0,
          projets: counts.projects || 0,
          evenements: counts.events || 0,
          participants: counts.participants || 0,
          messages: counts.unreadMessages || 0,
          newsletter: counts.activeSubscribers || 0,
          checkedIn: counts.checkedInParticipants || 0,
          editions: counts.activeEditions || 0,
          views: counts.pageViewsLast30Days || 0,
        });
        setAttendanceRate(data.attendance?.rate || 0);
        setRecentParticipants(data.recent?.participants || []);
        setRecentMessages(data.recent?.messages || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: 'Articles', value: stats.articles, icon: BookOpen, color: 'bronze', href: '/admin/blog' },
    { label: 'Projets', value: stats.projets, icon: FolderKanban, color: 'green', href: '/admin/projets' },
    { label: 'Evénements', value: stats.evenements, icon: CalendarDays, color: 'bronze', href: '/admin/evenements' },
    { label: 'Participants JE-GE', value: stats.participants, icon: Users, color: 'violet', href: '/admin/participants' },
    { label: 'Présents JE-GE', value: stats.checkedIn, icon: CheckCircle2, color: 'green', href: '/admin/participants' },
    { label: 'Éditions actives', value: stats.editions, icon: Award, color: 'violet', href: '/admin/editions-jege' },
    { label: 'Messages non lus', value: stats.messages, icon: MessageSquare, color: 'violet', href: '/admin/messages' },
    { label: 'Abonnés newsletter', value: stats.newsletter, icon: Mail, color: 'green', href: '/admin/newsletter' },
  ];

  const colorMap: Record<string, string> = {
    violet: 'bg-ige-navySoft border-ige-navySoft text-ige-navy',
    green: 'bg-ige-tealSoft border-ige-tealSoft text-ige-teal',
    bronze: 'bg-amber-50 border-amber-100 text-ige-teal',
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-ige-navy border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-ige-navy transition-all group"
          >
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${colorMap[card.color]}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-display font-bold text-slate-900">{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold uppercase text-slate-500">Taux de présence JE-GE</p>
          <p className="text-2xl font-display font-bold text-ige-teal mt-1">{attendanceRate}%</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold uppercase text-slate-500">Vues de pages (30 jours)</p>
          <p className="text-2xl font-display font-bold text-ige-navy mt-1">{stats.views}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-ige-navy" /> Actions rapides
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '+ Nouveau Club', href: '/admin/clubs' },
            { label: '+ Nouveau Projet', href: '/admin/projets' },
            { label: '+ Nouvel événement', href: '/admin/evenements' },
            { label: '+ Membre Bureau', href: '/admin/bureau' },
            { label: '+ Epreuve', href: '/admin/epreuves' },
            { label: 'Scanner QR', href: '/admin/checkin', icon: QrCode },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:border-ige-navy hover:text-ige-navy hover:bg-ige-navySoft transition-all"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Derniers participants */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-700">Derniers inscrits JE-GE</h2>
            <Link href="/admin/participants" className="text-xs text-ige-navy hover:underline">Voir tous</Link>
          </div>
          {recentParticipants.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Aucun participant</p>
          ) : (
            <div className="space-y-3">
              {recentParticipants.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{p.firstName} {p.lastName}</p>
                    <p className="text-xs text-slate-400">{p.email}</p>
                  </div>
                  {p.checkedIn ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-ige-tealDark bg-ige-tealSoft px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Present
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Inscrit</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Derniers messages */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-700">Derniers messages reçus</h2>
            <Link href="/admin/messages" className="text-xs text-ige-navy hover:underline">Voir tous</Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Aucun message</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m) => (
                <div key={m.id} className={`py-2 border-b border-slate-100 last:border-0 ${!m.isRead ? 'opacity-100' : 'opacity-60'}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-800">{m.name}</p>
                    {!m.isRead && <span className="w-2 h-2 rounded-full bg-ige-navy" />}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{m.subject}</p>
                  <p className="text-xs text-slate-400">{m.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
