'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBureauMemberById } from '@/lib/api';
import { 
  User, 
  Mail, 
  Linkedin, 
  WhatsApp, 
  Calendar, 
  ShieldCheck, 
  Briefcase, 
  Share2, 
  CheckCircle2 
} from '@/components/IconImage';

type Mandat = {
  id: string;
  annee: string;
  dateDebut?: string;
  dateFin?: string;
  description?: string;
  isActive: boolean;
};

type BureauMember = {
  id: string;
  firstName: string;
  lastName: string;
  poste: string;
  description?: string;
  email?: string;
  linkedin?: string;
  whatsapp?: string;
  photoUrl?: string;
  ordre: number;
  isActive: boolean;
  mandatId?: string;
  mandat?: Mandat;
};

export default function BureauMemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<BureauMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadMember(params.id as string);
    }
  }, [params.id]);

  const loadMember = async (id: string) => {
    setLoading(true);
    try {
      const data = await getBureauMemberById(id);
      setMember(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Membre du bureau introuvable');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!member) return;
    const url = window.location.href;
    const title = `${member.firstName} ${member.lastName} - ${member.poste} (Bureau IGE)`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Ignorer l'annulation
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ige-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Membre introuvable</h1>
        <p className="text-gray-600 mb-6">{error || "Ce membre n'existe pas ou a été retiré."}</p>
        <Link
          href="/bureau"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ige-teal text-white rounded-lg hover:bg-ige-tealDark transition font-medium"
        >
          Retour au bureau
        </Link>
      </div>
    );
  }

  const cleanWhatsapp = member.whatsapp ? member.whatsapp.replace(/[^0-9]/g, '') : null;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/bureau"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-ige-teal transition"
          >
            <span className="text-lg">←</span> Retour aux membres du bureau
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? 'Lien copié !' : 'Partager'}
          </button>
        </div>

        {/* Fiche Principale */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Colonne Photo */}
            <div className="md:col-span-5 bg-ige-navySoft flex items-center justify-center relative min-h-[360px] md:min-h-full">
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={`${member.firstName} ${member.lastName}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-ige-navy">
                  <User className="w-32 h-32 opacity-80" />
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-ige-navyDark opacity-60">
                    Membre du Bureau
                  </span>
                </div>
              )}
            </div>

            {/* Colonne Informations & Rôle */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-ige-tealSoft text-ige-tealDark border border-ige-teal/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {member.poste}
                  </span>
                  {member.mandat && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Mandat {member.mandat.annee}
                    </span>
                  )}
                  {member.isActive && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Actif
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                  {member.firstName} {member.lastName}
                </h1>
                <p className="text-ige-teal font-medium text-base mb-6">
                  {member.poste} &bull; Innovation en Génie Electrique
                </p>

                {/* Description / Biographie */}
                <div className="border-t border-slate-100 pt-5 mb-6">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    À propos & responsabilités
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                    {member.description ||
                      `${member.firstName} ${member.lastName} occupe actuellement la fonction de ${member.poste} au sein du bureau de l'IGE, contribuant au rayonnement et au bon fonctionnement de l'association.`}
                  </p>
                </div>
              </div>

              {/* Boutons de contact direct */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Contacter ce membre
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {cleanWhatsapp && (
                    <a
                      href={`https://wa.me/${cleanWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition shadow-sm hover:shadow"
                    >
                      <WhatsApp className="w-4 h-4" />
                      WhatsApp ({member.whatsapp})
                    </a>
                  )}

                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-800 font-medium text-sm hover:bg-ige-tealSoft hover:text-ige-teal transition"
                    >
                      <Mail className="w-4 h-4 text-slate-500" />
                      Email
                    </a>
                  )}

                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium text-sm hover:bg-blue-100 transition"
                    >
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      LinkedIn
                    </a>
                  )}

                  {!member.email && !member.linkedin && !member.whatsapp && (
                    <p className="text-xs text-gray-400 italic">Aucune coordonnée publique disponible.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Détails complémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Fiche Mandat */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-ige-navy font-bold text-base mb-3">
              <Calendar className="w-5 h-5 text-ige-teal" />
              Détails du mandat
            </div>
            {member.mandat ? (
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong className="text-gray-900">Année :</strong> {member.mandat.annee}
                </p>
                <p>
                  <strong className="text-gray-900">Statut :</strong>{' '}
                  {member.mandat.isActive ? 'Mandat en cours' : 'Mandat précédent'}
                </p>
                {member.mandat.description && (
                  <p className="pt-2 text-gray-500 border-t border-slate-100 mt-2">
                    {member.mandat.description}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Membre actif du bureau sans mandat spécifique assigné.</p>
            )}
          </div>

          {/* Fiche Rôle dans l'organisation */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-ige-navy font-bold text-base mb-3">
              <Briefcase className="w-5 h-5 text-ige-teal" />
              Organisation & Engagement
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              L'Innovation en Génie Électrique (IGE) s'appuie sur une équipe dynamique et engagée pour mener à
              bien des projets technologiques novateurs, organiser des journées scientifiques (JE-GE), et
              accompagner les étudiants vers l'excellence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
