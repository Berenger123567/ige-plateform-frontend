'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, MapPin, Clock, Users, ExternalLink,
  Share2, Download, Tag, Building2, DollarSign, Star
} from '@/components/IconImage';
import { getEventById } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const CATEGORY_LABELS: Record<string, string> = {
  'Genie Electrique': 'Génie électrique',
  Energie: 'Energie',
};

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
      const foundEvent = await getEventById(id);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        setError('Evénement introuvable');
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
      alert('Lien copié dans le presse-papiers !');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-ige-navy border-t-transparent rounded-full animate-spin" />
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
          <h1 className="text-2xl font-display font-bold text-slate-900">Evénement introuvable</h1>
          <p className="text-slate-600">{error}</p>
          <Link
            href="/evenements"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ige-navy text-white rounded-lg hover:bg-ige-navyDark transition-all"
          >
            Retour aux événements
          </Link>
        </div>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    'Genie Electrique': 'bg-ige-tealSoft text-ige-tealDark border-ige-tealSoft',
    'IA & Robotique': 'bg-ige-navySoft text-ige-navyDark border-ige-navySoft',
    'IoT': 'bg-blue-100 text-blue-700 border-blue-200',
    'Energie': 'bg-yellow-100 text-yellow-700 border-yellow-200',
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-ige-navy transition-colors"
          >
            Tous les événements
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-ige-navy hover:text-ige-navy transition-all"
          >
            <Share2 className="w-4 h-4" /> Partager
          </button>
        </div>

        {/* Badge featured si applicable */}
        {event.featured && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ige-tealSoft0 to-ige-teal text-white text-sm font-bold rounded-xl shadow-lg">
            <Star className="w-4 h-4" /> Evénement mis en avant
          </div>
        )}

        {/* Titre et catégorie */}
        <div className="space-y-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${categoryColor}`}>
            <Tag className="w-4 h-4" /> {CATEGORY_LABELS[event.category] || event.category}
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            {event.title}
          </h1>
        </div>

        {event.imageUrl && (
          <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
            <Image src={event.imageUrl} alt={event.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 896px" />
          </div>
        )}

        {/* Carte info principale */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
          
          {/* Informations cles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-ige-tealSoft flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-ige-teal" />
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
              <div className="w-10 h-10 rounded-lg bg-ige-navySoft flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-ige-navy" />
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
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-ige-teal text-white font-bold text-sm rounded-xl hover:bg-ige-tealDark transition-all shadow-md"
              >
                <ExternalLink className="w-4 h-4" /> S'inscrire à l'evenement
              </a>
            )}
            
            <a
              href={`${API_BASE_URL}/events/${event.id}/ics`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 hover:border-ige-navy hover:text-ige-navy transition-all"
            >
              <Download className="w-4 h-4" /> Ajouter au calendrier
            </a>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-ige-navy" /> À propos de l'evenement
          </h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{event.description}</p>
        </div>

        {event.practicalInfo && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-display font-bold text-slate-900 mb-4">Informations pratiques</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{event.practicalInfo}</p>
          </div>
        )}

        {Array.isArray(event.gallery) && event.gallery.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-display font-bold text-slate-900 mb-4">Galerie</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {event.gallery.map((src: string, index: number) => (
                <div key={`${src}-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <Image src={src} alt={`${event.title} ${index + 1}`} fill className="object-cover" sizes="(max-width: 640px) 50vw, 300px" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 pt-4 border-t border-slate-200">
          <Clock className="w-4 h-4" />
          <span>Evenement ajoute le {new Date(event.createdAt).toLocaleDateString('fr-FR', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>

      </div>
    </div>
  );
}
