'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Users, Mail, Linkedin, WhatsApp, User, Calendar } from '@/components/IconImage';
import { useJEGETicket } from '@/hooks/useJEGETicket';

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
};

type Mandat = {
  id: string;
  annee: string;
  dateDebut: string;
  dateFin: string;
  description?: string;
  isActive: boolean;
};

export default function BureauPage() {
  const { hasTicket } = useJEGETicket();
  const [mandats, setMandats] = useState<Mandat[]>([]);
  const [selectedMandat, setSelectedMandat] = useState<string | null>(null);
  const [bureauMembers, setBureauMembers] = useState<BureauMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mandatsRes, bureauRes] = await Promise.all([
        api.get('/mandats'),
        api.get('/bureau'),
      ]);

      setMandats(mandatsRes.data);

      // Trouver le mandat actif par défaut
      const activeMandat = mandatsRes.data.find((m: Mandat) => m.isActive);
      if (activeMandat) {
        setSelectedMandat(activeMandat.id);
        try {
          const res = await api.get(`/bureau/mandat/${activeMandat.id}`);
          setBureauMembers(res.data.length > 0 ? res.data : bureauRes.data);
        } catch {
          setBureauMembers(bureauRes.data);
        }
      } else {
        setBureauMembers(bureauRes.data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données :', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembersForMandat = async (mandatId: string) => {
    try {
      const res = await api.get(`/bureau/mandat/${mandatId}`);
      setBureauMembers(res.data);
    } catch (err) {
      console.error('Erreur chargement membres:', err);
    }
  };

  const handleMandatChange = (mandatId: string) => {
    setSelectedMandat(mandatId);
    fetchMembersForMandat(mandatId);
  };

  const currentMandat = mandats.find((m) => m.id === selectedMandat);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-ige-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white border-b border-slate-200 text-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-ige-teal tracking-tight">
              Le bureau de l’IGE
            </h1>
            <p className="text-lg text-slate-600">
              L’équipe qui dirige l’Innovation en Génie Electrique avec passion et engagement.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Selection du mandat */}
        {mandats.length > 0 && (
          <div className="mb-10">
            <div className="flex flex-wrap gap-3 justify-center">
              {mandats.map((mandat) => (
                <button
                  key={mandat.id}
                  onClick={() => handleMandatChange(mandat.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedMandat === mandat.id
                      ? 'bg-ige-teal text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-ige-tealSoft shadow'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline -mt-1 mr-1.5" />
                  {mandat.annee}
                  {mandat.isActive && (
                    <span className="ml-2 text-xs bg-ige-teal text-white px-2 py-0.5 rounded-full">
                      Actuel
                    </span>
                  )}
                </button>
              ))}
            </div>

            {currentMandat && currentMandat.description && (
              <div className="mt-6 max-w-2xl mx-auto bg-slate-50 border-l-4 border-ige-teal p-4 rounded-r-lg shadow-sm">
                <p className="text-gray-700">{currentMandat.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Grille des membres - Design copié fidèlement du bureau admin */}
        {bureauMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bureauMembers.map((membre) => (
              <div
                key={membre.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-all overflow-hidden flex flex-col"
              >
                {/* Photo carrée */}
                <div className="aspect-square bg-ige-navySoft flex items-center justify-center overflow-hidden relative">
                  {membre.photoUrl ? (
                    <Image
                      src={membre.photoUrl}
                      alt={`${membre.firstName} ${membre.lastName}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <User className="w-24 h-24 text-ige-navy" />
                  )}
                </div>

                {/* Détails du membre */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    {membre.firstName} {membre.lastName}
                  </h3>
                  <p className="text-ige-navyDark font-medium text-sm mb-2">{membre.poste}</p>

                  {membre.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {membre.description}
                    </p>
                  )}

                  {/* Barre d'action inférieure : Icônes de contact & Bouton Voir */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-1.5">
                      {membre.email && (
                        <a
                          href={`mailto:${membre.email}`}
                          className="p-1.5 rounded-md bg-gray-50 text-gray-600 hover:text-ige-teal hover:bg-ige-tealSoft transition"
                          title={`Email : ${membre.email}`}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {membre.linkedin && (
                        <a
                          href={membre.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {membre.whatsapp && (
                        <a
                          href={`https://wa.me/${membre.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                          title={`WhatsApp : ${membre.whatsapp}`}
                        >
                          <WhatsApp className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Bouton Voir */}
                    <Link
                      href={`/bureau/${membre.id}`}
                      className="ml-auto inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-ige-teal hover:bg-ige-tealDark rounded-md transition shadow-sm"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
            </div>
            <p className="text-xl text-gray-600 mb-2">Aucun membre du bureau pour ce mandat</p>
            <p className="text-gray-500">Sélectionnez un autre mandat pour voir ses membres</p>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-16 bg-ige-teal rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-center text-white">
            <Users className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Rejoindre l'IGE</h2>
            <p className="text-lg text-ige-tealSoft mb-6 max-w-2xl mx-auto">
              Vous êtes étudiant en Génie Electrique à l’EPAC ? Rejoignez notre association et participez
              activement à l’innovation technologique au Bénin.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={hasTicket ? '/je-ge/ticket' : '/je-ge'}
                className="px-8 py-3 bg-white text-ige-teal font-semibold rounded-lg hover:bg-ige-tealSoft transition-all shadow-lg hover:shadow-xl"
              >
                {hasTicket ? 'Consulter mon ticket' : "S'inscrire à la JE-GE"}
              </a>
              <a
                href="/contact"
                className="px-8 py-3 bg-ige-tealDark text-white font-semibold rounded-lg hover:bg-ige-tealDark transition-all border-2 border-white/20"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
