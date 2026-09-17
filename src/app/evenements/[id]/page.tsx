'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, MapPin, Clock, Users, ExternalLink,
  Share2, Download, Tag, Building2, DollarSign, Star
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      loadEvent(params.id as string);
    }
  }, [params.id]);

  const loadEvent = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/evenements`);
      const events = await res.json();
      const foundEvent = events.find((e: any) => e.id === id);
      
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        setError('Événement non trouvé');
      }
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${event.title} - ${event.date} à ${event.location}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, text, url });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papier !');
    }
  };

  const generateICS = () => {
    // Format ICS pour calendrier
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//IGE//Event//FR
BEGIN:VEVENT
UID:${event.id}@ige.bj
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${event.date.replace(/\//g, '')}T${event.time ? event.time.replace(/:/g, '') + '00' : '090000'}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}, ${event.city}
ORGANIZER:${event.organizer}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-ige-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Événement introuvable</h1>
          <p className="text-slate-600">{error}</p>
          <Link
            href="/evenements"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ige-violet text-white rounded-lg hover:bg-ige-violetDark transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux événements
          </Link>
        </div>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    'Génie Électrique': 'bg-ige-greenSoft text-ige-greenDark border-ige-greenSoft',
    'IA & Robotique': 'bg-ige-violetSoft text-ige-violetDark border-ige-violetSoft',
    'IoT': 'bg-blue-100 text-blue-700 border-blue-200',
    'Énergie': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Entrepreneuriat': 'bg-orange-100 text-orange-700 border-orange-200',
  };

  const categoryColor = categoryColors[event.category] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header avec actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/evenements"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-ige-violet transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Tous les événements
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-ige-violet hover:text-ige-violet transition-all"
          >
            <Share2 className="w-4 h-4" /> Partager
          </button>
        </div>

        {/* Badge featured si applicable */}
        {event.featured && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ige-greenSoft0 to-ige-green text-white text-sm font-bold rounded-xl shadow-lg">
            <Star className="w-4 h-4" /> Événement mis en avant
          </div>
        )}

        {/* Titre et catégorie */}
        <div className="space-y-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${categoryColor}`}>
            <Tag className="w-4 h-4" /> {event.category}
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            {event.title}
          </h1>
        </div>

        {/* Carte info principale */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
          
          {/* Informations clés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-ige-greenSoft flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-ige-green" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Date</p>
                <p className="text-base font-bold text-slate-900">{event.date}</p>
                {event.time && <p className="text-sm text-slate-600">{event.time}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Lieu</p>
                <p className="text-base font-bold text-slate-900">{event.location}</p>
                <p className="text-sm text-slate-600">{event.city}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-ige-violetSoft flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-ige-violet" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Organisateur</p>
                <p className="text-base font-bold text-slate-900">{event.organizer}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Tarif</p>
                <p className="text-base font-bold text-slate-900">{event.price}</p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            {event.registrationUrl && (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-ige-green text-white font-bold text-sm rounded-xl hover:bg-ige-greenDark transition-all shadow-md"
              >
                <ExternalLink className="w-4 h-4" /> S'inscrire à l'événement
              </a>
            )}
            
            <button
              onClick={generateICS}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 hover:border-ige-violet hover:text-ige-violet transition-all"
            >
              <Download className="w-4 h-4" /> Ajouter au calendrier
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-ige-violet" /> À propos de l'événement
          </h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{event.description}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 pt-4 border-t border-slate-200">
          <Clock className="w-4 h-4" />
          <span>Événement ajouté le {new Date(event.createdAt).toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>

      </div>
    </div>
  );
}
