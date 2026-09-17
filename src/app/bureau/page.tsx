'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Users, Mail, Linkedin, ChevronRight, Shield, Star, Award, Briefcase, HeartHandshake, Megaphone, Wrench, Calendar } from 'lucide-react';

type BureauMember = {
  id: string;
  firstName: string;
  lastName: string;
  poste: string;
  description?: string;
  email?: string;
  linkedin?: string;
  photoUrl?: string;
  ordre: number;
  color?: string;
};

type Mandat = {
  id: string;
  annee: string;
  dateDebut: string;
  dateFin: string;
  description?: string;
  isActive: boolean;
};

const colorMap: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  violet: {
    bg: 'bg-ige-violetSoft',
    border: 'border-ige-violetSoft',
    icon: 'text-ige-green',
    badge: 'bg-ige-violetSoft text-ige-violetDark',
  },
  green: {
    bg: 'bg-ige-greenSoft',
    border: 'border-ige-greenSoft',
    icon: 'text-ige-greenDark',
    badge: 'bg-ige-greenSoft text-ige-greenDark',
  },
  bronze: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    icon: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
  },
};

const getIconForPoste = (poste: string) => {
  if (poste.includes('Président')) return Shield;
  if (poste.includes('Secrétaire')) return Briefcase;
  if (poste.includes('Trésorier')) return Award;
  if (poste.includes('Communication')) return Megaphone;
  if (poste.includes('Technique')) return Wrench;
  if (poste.includes('Relations')) return HeartHandshake;
  return Star;
};

export default function BureauPage() {
  const [hovered, setHovered] = useState<number | null>(null);
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
      }
      
      setBureauMembers(bureauRes.data);
    } catch (err) {
      console.error('Erreur chargement données:', err);
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

  const assignColor = (membres: BureauMember[]) => {
    return membres.map((m, idx) => ({
      ...m,
      color: idx % 3 === 0 ? 'violet' : idx % 3 === 1 ? 'green' : 'bronze',
    }));
  };

  const currentMembersWithColors = assignColor(bureauMembers);
  const currentMandat = mandats.find((m) => m.id === selectedMandat);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-ige-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white border-b border-slate-200 text-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">Le Bureau de l'IGE</h1>
            <p className="text-lg text-slate-600">
              L'équipe qui dirige l'Innovation en Génie Électrique avec passion et engagement
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Sélection du mandat */}
        {mandats.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {mandats.map((mandat) => (
                <button
                  key={mandat.id}
                  onClick={() => handleMandatChange(mandat.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedMandat === mandat.id
                      ? 'bg-ige-green text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-ige-greenSoft shadow'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline -mt-1 mr-1.5" />{mandat.annee}
                  {mandat.isActive && (
                    <span className="ml-2 text-xs bg-ige-green text-white px-2 py-0.5 rounded-full">Actuel</span>
                  )}
                </button>
              ))}
            </div>

            {currentMandat && currentMandat.description && (
              <div className="mt-6 max-w-2xl mx-auto bg-slate-50 border-l-4 border-ige-green p-4 rounded-r-lg">
                <p className="text-gray-700">{currentMandat.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Grille des membres */}
        {currentMembersWithColors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMembersWithColors.map((membre, i) => {
              const colors = colorMap[membre.color || 'violet'] || colorMap.violet;
              const Icon = getIconForPoste(membre.poste);

              return (
                <div
                  key={membre.id}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 ${
                    hovered === i ? '-translate-y-2 shadow-2xl' : ''
                  }`}
                >
                  {/* Photo ou Avatar */}
                  <div className={`h-48 ${colors.bg} flex items-center justify-center overflow-hidden`}>
                    {membre.photoUrl ? (
                      <img
                        src={membre.photoUrl}
                        alt={`${membre.firstName} ${membre.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className={`w-20 h-20 ${colors.icon}`} />
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {membre.firstName} {membre.lastName}
                    </h3>
                    <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mb-3 ${colors.badge}`}>
                      {membre.poste}
                    </span>

                    {membre.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{membre.description}</p>
                    )}

                    <div className="flex gap-2 pt-4 border-t">
                      {membre.email && (
                        <a
                          href={`mailto:${membre.email}`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-ige-greenSoft text-ige-green rounded-lg hover:bg-ige-greenSoft transition"
                          title={membre.email}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {membre.linkedin && (
                        <a
                          href={membre.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
            </div>
            <p className="text-xl text-gray-600 mb-2">Aucun membre du bureau pour ce mandat</p>
            <p className="text-gray-500">Sélectionnez un autre mandat pour voir ses membres</p>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-16 bg-ige-green rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-center text-white">
            <Users className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Rejoindre l'IGE</h2>
            <p className="text-lg text-ige-greenSoft mb-6 max-w-2xl mx-auto">
              Vous êtes étudiant en Génie Électrique à l'EPAC ? Rejoignez notre association et participez 
              activement à l'innovation technologique au Bénin.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/je-ge"
                className="px-8 py-3 bg-white text-ige-green font-semibold rounded-lg hover:bg-ige-greenSoft transition-all shadow-lg hover:shadow-xl"
              >
                S'inscrire à la JE-GE
              </a>
              <a
                href="/contact"
                className="px-8 py-3 bg-ige-greenDark text-white font-semibold rounded-lg hover:bg-ige-greenDark transition-all border-2 border-white/20"
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
