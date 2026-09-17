'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Calendar, Tag, Award, CheckCircle2, 
  Share2, Lightbulb, Target, Cpu, Clock, Star, Search
} from 'lucide-react';
import { getProjectById } from '@/lib/api';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      loadProject(params.id as string);
    }
  }, [params.id]);

  const loadProject = async (id: string) => {
    setLoading(true);
    try {
      const data = await getProjectById(id);
      setProject(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Projet non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${project.title} - ${project.summary}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: project.title, text, url });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papier !');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-ige-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Projet introuvable</h1>
          <p className="text-slate-600">{error}</p>
          <Link
            href="/projets"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ige-violet text-white rounded-lg hover:bg-ige-violetDark transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux projets
          </Link>
        </div>
      </div>
    );
  }

  const technologies = project.technologies?.split(',').map((t: string) => t.trim()) || [];

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header avec retour */}
        <div className="flex items-center justify-between">
          <Link
            href="/projets"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-ige-violet transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Tous les projets
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-ige-violet hover:text-ige-violet transition-all"
          >
            <Share2 className="w-4 h-4" /> Partager
          </button>
        </div>

        {/* Image principale */}
        {project.imageUrl && (
          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            {project.featured && (
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-ige-greenSoft0 text-white text-xs font-bold rounded-full shadow-lg">
                <Star className="w-3.5 h-3.5" /> Projet phare
              </div>
            )}
          </div>
        )}

        {/* Titre et métadonnées */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {project.club && (
              <Link
                href={`/clubs/${project.club.slug}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-ige-violetSoft text-ige-violet text-sm font-semibold rounded-lg border border-ige-violetSoft hover:bg-ige-violetSoft transition-all"
              >
                <Award className="w-4 h-4" /> {project.club.name}
              </Link>
            )}

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg">
              <Calendar className="w-4 h-4" /> {project.year}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ige-greenSoft text-ige-greenDark text-sm font-semibold rounded-lg border border-ige-greenSoft">
              <CheckCircle2 className="w-4 h-4" /> {project.status}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-lg border border-amber-200">
              <Tag className="w-4 h-4" /> {project.type}
            </span>
          </div>

          <p className="text-lg text-slate-700 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Sections de contenu */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Problématique */}
          {project.problem && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-display font-bold text-slate-900">Problématique</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">{project.problem}</p>
            </div>
          )}

          {/* Solution */}
          {project.solution && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-ige-greenSoft flex items-center justify-center">
                  <Target className="w-5 h-5 text-ige-green" />
                </div>
                <h2 className="text-xl font-display font-bold text-slate-900">Solution apportée</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">{project.solution}</p>
            </div>
          )}

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-ige-violetSoft flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-ige-violet" />
                </div>
                <h2 className="text-xl font-display font-bold text-slate-900">Technologies utilisées</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 text-sm font-medium rounded-lg border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer avec date de création */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 pt-4 border-t border-slate-200">
          <Clock className="w-4 h-4" />
          <span>Projet créé le {new Date(project.createdAt).toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>

      </div>
    </div>
  );
}
