'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
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
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              Événements Tech & Génie Électrique
            </h2>
            <p className="text-slate-600 text-base max-w-xl">
              Les conférences, hackathons, masterclass et forums à venir au Bénin.
            </p>
          </div>
          <Link
            href="/evenements"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-50 border border-slate-300 hover:border-ige-green text-slate-900 text-xs uppercase font-bold tracking-wider transition-all shadow-sm"
          >
            <span>Consulter tout l'agenda</span>
            <ArrowRight className="w-4 h-4 text-ige-green" />
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="rounded-2xl bg-slate-50 border border-slate-200 p-8 flex flex-col justify-between hover:border-ige-greenSoft0/40 transition-all group shadow-sm hover:shadow-md"
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

                <h3 className="text-2xl font-display font-bold text-slate-900 group-hover:text-ige-green transition-colors">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {evt.description}
                </p>

                <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs text-slate-700">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-ige-green shrink-0" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-ige-green shrink-0" />
                    <span>{evt.location} ({evt.city})</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Organisé par : <strong className="text-slate-900 font-medium">{evt.organizer}</strong></span>
                <span className="px-3 py-1 rounded bg-ige-greenSoft text-ige-greenDark font-mono font-bold text-[10px]">
                  {evt.price}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
