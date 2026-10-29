'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Star } from '@/components/IconImage';
import { getEvents } from '@/lib/api';

export default function EventsAgenda() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    getEvents()
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-ige-teal tracking-tight">
              Evénements tech & génie électrique
            </h2>
            <p className="text-slate-600 text-base max-w-xl">
              Les conférences, hackathons, masterclass et forums à venir au Bénin.
            </p>
          </div>
          <Link
            href="/evenements"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-50 border border-slate-300 hover:border-ige-teal text-slate-900 text-xs font-bold transition-all shadow-sm"
          >
            <span>Consulter tout l’agenda</span>
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.slice(0, 4).map((evt) => (
            <Link
              key={evt.id}
              href={`/evenements/${evt.id}`}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-ige-tealSoft0/40 transition-all group shadow-sm hover:shadow-md"
            >
              {/* Image banner */}
              <div className="h-48 relative overflow-hidden bg-slate-100">
                {evt.imageUrl ? (
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4">
                    <Calendar className="w-10 h-10 text-slate-300 mb-1" />
                    <span className="text-[11px] text-slate-400 font-medium">Événement IGE</span>
                  </div>
                )}

                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded bg-white/95 backdrop-blur-sm text-ige-tealDark border border-slate-200 shadow-sm">
                    {evt.category}
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                  {evt.featured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-ige-tealSoft0 text-white shadow-sm">
                      <Star className="w-3 h-3" /> Mis en avant
                    </span>
                  )}
                  {evt.price && (
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/95 backdrop-blur-sm text-ige-tealDark border border-slate-200 shadow-sm">
                      {evt.price}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                    <span className="flex items-center space-x-1.5 text-ige-teal font-semibold">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{evt.date}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{evt.time || '09:00'}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-ige-teal transition-colors line-clamp-2">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-700">
                    <MapPin className="w-4 h-4 text-ige-teal shrink-0" />
                    <span className="truncate">{evt.location} ({evt.city})</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate max-w-[65%]">
                      Organisé par : <strong className="text-slate-900 font-medium">{evt.organizer}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ige-teal group-hover:gap-2 transition-all">
                      Détails
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
