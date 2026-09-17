'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEvents } from '@/lib/api';
import { Calendar, MapPin, Clock, Search, Filter, ArrowRight, Star } from 'lucide-react';

export default function EvenementsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then((data) => setEvents(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter((evt) => {
    const matchSearch = evt.title.toLowerCase().includes(search.toLowerCase()) ||
                        evt.description.toLowerCase().includes(search.toLowerCase()) ||
                        evt.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || evt.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-slate-900 tracking-tight">
            Événements Tech & Génie Électrique
          </h1>
          <p className="text-slate-700 text-lg max-w-2xl">
            L'agenda de référence des conférences, ateliers, masterclass, hackathons et compétitions au Bénin.
          </p>
        </div>

        {/* Filters */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un événement (ex: IA, Robotique, Sèmè City)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-ige-green"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:border-ige-green"
            >
              <option value="all">Toutes les catégories</option>
              <option value="Génie Électrique">Génie Électrique</option>
              <option value="IA & Robotique">IA & Robotique</option>
              <option value="IoT & Embarqué">IoT & Embarqué</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 font-mono text-sm">
            Chargement de l'agenda des événements...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center text-slate-500 rounded-2xl bg-white border border-slate-200 shadow-sm">
            Aucun événement trouvé.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredEvents.map((evt) => (
              <Link
                key={evt.id}
                href={`/evenements/${evt.id}`}
                className="rounded-2xl bg-white border border-slate-200 p-8 flex flex-col justify-between hover:border-ige-greenSoft0/40 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded bg-ige-greenSoft text-ige-greenDark border border-ige-greenSoft">
                      {evt.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.time || '09:00'}</span>
                    </span>
                  </div>

                  {evt.featured && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-ige-greenSoft0 text-white text-[10px] font-bold rounded-md">
                      <Star className="w-3 h-3" /> Mis en avant
                    </div>
                  )}

                  <h3 className="text-2xl font-display font-bold text-slate-900 group-hover:text-ige-green transition-colors">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {evt.description}
                  </p>

                  <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-700">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-ige-green shrink-0" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-ige-green shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate">par <strong className="text-slate-900 font-medium">{evt.organizer}</strong></span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-ige-green group-hover:gap-2 transition-all whitespace-nowrap">
                    Voir détails <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
