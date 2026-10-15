'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Award, Users, FolderKanban, Share2,
  Target, Cpu, Mail
} from '@/components/IconImage';
import { getClubBySlug } from '@/lib/api';

export default function ClubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.slug) {
      loadClub(params.slug as string);
    }
  }, [params.slug]);

  const loadClub = async (slug: string) => {
    setLoading(true);
    try {
      const data = await getClubBySlug(slug);
      setClub(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Club introuvable');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${club.name} - ${club.description}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: club.name, text, url });
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

  if (error || !club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Club introuvable</h1>
          <p className="text-slate-600">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ige-navy text-white rounded-lg hover:bg-ige-navyDark transition-all"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const clubIcons: Record<string, any> = {
    'electronique-iot': Cpu,
    'robotique': Target,
    'informatique-industrielle': FolderKanban,
  };

  const ClubIcon = clubIcons[club.slug] || Award;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header avec actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-ige-navy transition-colors"
          >
            Retour à l'accueil
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-ige-navy hover:text-ige-navy transition-all"
          >
            <Share2 className="w-4 h-4" /> Partager
          </button>
        </div>

        {/* En-tete du club avec logo */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-md">
          <div className="p-8 sm:p-12 space-y-6">
            {club.logoUrl && (
              <div className="w-20 h-20 relative rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">
                <Image
                  src={club.logoUrl}
                  alt={club.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {!club.logoUrl && (
              <div className="w-20 h-20 rounded-2xl bg-ige-navySoft flex items-center justify-center border-2 border-ige-navySoft">
                <ClubIcon className="w-10 h-10 text-ige-navy" />
              </div>
            )}

            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-ige-navySoft text-ige-navy text-xs font-bold rounded-lg border border-ige-navySoft">
                <Award className="w-3.5 h-3.5" /> Club Technique IGE
              </span>

              <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                {club.name}
              </h1>

              <p className="text-lg text-slate-700 leading-relaxed max-w-3xl">
                {club.description}
              </p>
            </div>
          </div>
        </div>

        {/* Domaines d'expertise */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ige-tealSoft flex items-center justify-center">
              <Target className="w-5 h-5 text-ige-teal" />
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900">Domaines d'expertise</h2>
          </div>
          <p className="text-slate-700 leading-relaxed pl-[52px]">{club.domain}</p>
        </div>

        {/* Responsable du club */}
        {club.leadName && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-display font-bold text-slate-900">Responsable du club</h2>
            </div>
            <div className="pl-[52px] space-y-1">
              <p className="text-lg font-semibold text-slate-900">{club.leadName}</p>
              <p className="text-sm text-slate-600">Chef de projet · Coordinateur technique</p>
            </div>
          </div>
        )}

        {/* Projets du club */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-ige-navySoft flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-ige-navy" />
              </div>
              <h2 className="text-xl font-display font-bold text-slate-900">
                Projets realises ({club.projects?.length || 0})
              </h2>
            </div>
            <Link
              href="/projets"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ige-navy hover:text-ige-navyDark transition-colors"
            >
              Voir tous les projets
            </Link>
          </div>

          {club.projects && club.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {club.projects.map((proj: any) => (
                <Link
                  key={proj.id}
                  href={`/projets/${proj.id}`}
                  className="rounded-2xl bg-white border border-slate-200 p-6 hover:border-ige-navy hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-ige-navy transition-colors flex-1">
                        {proj.title}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {proj.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.technologies.split(',').slice(0, 4).map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                      {proj.technologies.split(',').length > 4 && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
                          +{proj.technologies.split(',').length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500">{proj.year}</span>
                      <span className="text-xs font-semibold text-ige-teal">{proj.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                <FolderKanban className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">Aucun projet publie pour le moment</p>
              <p className="text-xs text-slate-400">Les projets du club seront ajoutes prochainement</p>
            </div>
          )}
        </div>

        {/* Photo du club si disponible */}
        {club.photoUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            <div className="relative w-full h-96">
              <Image
                src={club.photoUrl}
                alt={`Photo du ${club.name}`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
