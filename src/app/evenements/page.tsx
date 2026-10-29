'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, getEvents } from '@/lib/api';
import { Calendar, MapPin, Clock, Search, Filter, Star } from '@/components/IconImage';

const CATEGORY_LABELS: Record<string, string> = {
  'Genie Electrique': 'Génie électrique',
  'IoT & Embarque': 'IoT et systèmes embarqués',
  Energie: 'Energie',
};

export default function EvenementsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEvents(),
      api.get('/events/categories').then((res) => res.data).catch(() => []),
    ])
      .then(([data, cats]) => {
        setEvents(Array.isArray(data) ? data : []);
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter((evt) => {
    const matchSearch = (evt.title || '').toLowerCase().includes(search.toLowerCase()) ||
                        (evt.description || '').toLowerCase().includes(search.toLowerCase()) ||
                        (evt.category || '').toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || evt.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-ige-teal tracking-tight">
            Evénements Tech & Génie Electrique
          </h1>
          <p className="text-slate-700 text-lg max-w-2xl">
            L’agenda de référence des conférences, ateliers, masterclass, hackathons et compétitions au Bénin.
          </p>
        </div>

        {/* Filters */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un événement (ex. : IA, robotique, Sèmè City)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-ige-teal"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:border-ige-teal"
            >
              <option value="all">Toutes les catégories</option>
              {(categories.length > 0
                ? categories.map((cat) => ({ value: cat.name, label: CATEGORY_LABELS[cat.name] || cat.name }))
                : Object.keys(CATEGORY_LABELS).map((name) => ({ value: name, label: CATEGORY_LABELS[name] }))
              ).map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 font-mono text-sm">
            Chargement de l’agenda des événements...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center text-slate-500 rounded-2xl bg-white border border-slate-200 shadow-sm">
            Aucun événement trouvé.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((evt) => (
              <Link
                key={evt.id}
                href={`/evenements/${evt.id}`}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-ige-tealSoft0/40 shadow-sm hover:shadow-md transition-all group"
              >
                {/* Image de l'événement */}
                <div className="h-48 relative overflow-hidden bg-slate-100">
                  {evt.imageUrl ? (
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4">
                      <Calendar className="w-12 h-12 text-slate-300 mb-1" />
                      <span className="text-[11px] text-slate-400 font-medium">Événement IGE</span>
                    </div>
                  )}

                  {/* Badges sur l'image */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 rounded-md text-[11px] font-bold bg-white/95 backdrop-blur-sm text-slate-900 border border-slate-200 shadow-sm">
                      {CATEGORY_LABELS[evt.category] || evt.category}
                    </span>
                    {evt.format && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-900/80 backdrop-blur-sm text-white shadow-sm">
                        {evt.format}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                    {evt.featured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-ige-tealSoft0 text-white shadow-sm">
                        <Star className="w-3 h-3" /> Mis en avant
                      </span>
                    )}
                    {evt.price && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-white/95 backdrop-blur-sm text-ige-tealDark border border-slate-200 shadow-sm">
                        {evt.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contenu textuel */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Date & Heure */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center space-x-1.5 text-ige-teal font-semibold">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{evt.time || '09:00'}</span>
                      </div>
                    </div>

                    {/* Titre */}
                    <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-ige-teal transition-colors line-clamp-2">
                      {evt.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>
                  </div>

                  {/* Lieu & Footer */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center space-x-2 text-xs text-slate-700">
                      <MapPin className="w-4 h-4 text-ige-teal shrink-0" />
                      <span className="truncate">
                        {evt.location}{evt.city ? `, ${evt.city}` : ''}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 truncate max-w-[60%]">
                        par <strong className="text-slate-900 font-medium">{evt.organizer}</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-ige-teal group-hover:gap-2 transition-all whitespace-nowrap">
                        Voir les détails
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
