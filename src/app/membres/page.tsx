'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { Users, Search, Linkedin, Building2, Calendar } from '@/components/IconImage';

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  poste?: string | null;
  description?: string | null;
  linkedin?: string | null;
  photoUrl?: string | null;
  club?: { id: string; name: string; slug: string } | null;
  mandat?: { id: string; annee: string } | null;
};

type Club = { id: string; name: string; slug: string };

export default function MembresPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [club, setClub] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [membersRes, clubsRes] = await Promise.all([
          api.get('/membres', { params: { limit: 100 } }),
          api.get('/clubs').catch(() => ({ data: [] })),
        ]);
        setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
        setClubs(Array.isArray(clubsRes.data) ? clubsRes.data : []);
      } catch (err) {
        console.error('Erreur chargement membres:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((member) => {
      const matchesClub = !club || member.club?.slug === club;
      const matchesQuery =
        !q ||
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(q) ||
        (member.poste || '').toLowerCase().includes(q);
      return matchesClub && matchesQuery;
    });
  }, [members, query, club]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-ige-teal tracking-tight">Nos membres</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Les étudiants et encadrants qui font vivre l&apos;Innovation en Génie Électrique.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto mb-10">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un membre ou un poste..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-ige-teal/40"
            />
          </div>
          <select
            value={club}
            onChange={(e) => setClub(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 bg-white min-w-[200px]"
          >
            <option value="">Tous les clubs</option>
            {clubs.map((item) => (
              <option key={item.id} value={item.slug}>{item.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-ige-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-xl text-slate-600">Aucun membre trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
                <div className="h-44 bg-ige-tealSoft flex items-center justify-center overflow-hidden">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={`${member.firstName} ${member.lastName}`} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-16 h-16 text-ige-teal" />
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    {member.firstName} {member.lastName}
                  </h2>
                  {member.poste && (
                    <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-ige-tealSoft text-ige-tealDark">
                      {member.poste}
                    </span>
                  )}
                  <div className="mt-3 space-y-1 text-sm text-slate-500">
                    {member.club && (
                      <p className="inline-flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> {member.club.name}
                      </p>
                    )}
                    {member.mandat && (
                      <p className="inline-flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Mandat {member.mandat.annee}
                      </p>
                    )}
                  </div>
                  {member.description && (
                    <p className="mt-3 text-sm text-slate-600 line-clamp-3">{member.description}</p>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      <Linkedin className="w-4 h-4" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
