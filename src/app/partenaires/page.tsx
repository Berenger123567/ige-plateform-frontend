'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Tv, Handshake, Search, Building2 } from 'lucide-react';
import { api } from '@/lib/api';

type Partner = {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  category: string;
  description?: string;
  ordre: number;
};

export default function PartenairesPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('Tous');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await api.get('/partners');
      setPartners(res.data);
    } catch (err) {
      console.error('Erreur chargement partenaires:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Tous', ...Array.from(new Set(partners.map((p) => p.category)))];

  const filteredPartners = filter === 'Tous'
    ? partners
    : partners.filter((p) => p.category === filter);

  const getCategoryIcon = (cat: string): { icon: React.ElementType; className: string } => {
    const icons: Record<string, { icon: React.ElementType; className: string }> = {
      'Sponsor Or': { icon: Trophy, className: 'text-amber-400' },
      'Sponsor Argent': { icon: Medal, className: 'text-slate-300' },
      'Sponsor Bronze': { icon: Award, className: 'text-orange-500' },
      'Partenaire Média': { icon: Tv, className: 'text-blue-300' },
      'Partenaire': { icon: Handshake, className: 'text-slate-200' },
    };
    return icons[cat] || icons['Partenaire'];
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      'Sponsor Or': 'from-yellow-400 to-yellow-600',
      'Sponsor Argent': 'from-gray-300 to-gray-500',
      'Sponsor Bronze': 'from-orange-400 to-orange-600',
      'Partenaire Média': 'from-blue-400 to-blue-600',
      'Partenaire': 'from-ige-greenSoft0 to-ige-green',
    };
    return colors[cat] || colors['Partenaire'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-ige-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight animate-fade-in">
              Nos Partenaires
            </h1>
            <p className="text-lg text-slate-600">
              Ils nous accompagnent dans notre mission de promouvoir l'innovation en génie électrique
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filtres */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                filter === cat
                  ? 'bg-ige-green text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-ige-greenSoft shadow'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Liste des partenaires par catégorie */}
        {filter === 'Tous' ? (
          <div className="space-y-16">
            {categories.slice(1).map((category) => {
              const categoryPartners = partners.filter((p) => p.category === category);
              if (categoryPartners.length === 0) return null;

              return (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-8">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${getCategoryColor(
                        category
                      )} flex items-center justify-center`}
                    >
                      {(() => {
                        const { icon: CategoryIcon } = getCategoryIcon(category);
                        return <CategoryIcon className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">{category}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent ml-4"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryPartners.map((partner, idx) => (
                      <PartnerCard key={partner.id} partner={partner} index={idx} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner, idx) => (
              <PartnerCard key={partner.id} partner={partner} index={idx} />
            ))}
          </div>
        )}

        {filteredPartners.length === 0 && (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
            </div>
            <p className="text-xl text-slate-600">Aucun partenaire dans cette catégorie</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 bg-ige-green rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Devenez Partenaire</h2>
            <p className="text-lg text-ige-greenSoft mb-6 max-w-2xl mx-auto">
              Rejoignez-nous dans notre mission de former la prochaine génération d'ingénieurs en génie électrique au Bénin
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-ige-green font-semibold rounded-lg hover:bg-ige-greenSoft transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Nous Contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function PartnerCard({ partner, index }: { partner: Partner; index: number }) {
  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="aspect-video bg-slate-100 flex items-center justify-center p-8 group-hover:bg-slate-200/60 transition-all">
        {partner.logoUrl ? (
          <img
            src={partner.logoUrl}
            alt={partner.name}
            className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        ) : (
          <Building2 className="w-16 h-16 text-slate-300 group-hover:text-slate-400 transition-colors" />
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-ige-green transition-colors">
          {partner.name}
        </h3>

        {partner.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{partner.description}</p>
        )}

        {partner.website && (
          <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-ige-green hover:text-ige-greenDark font-medium text-sm group/link"
          >
            <span>Visiter le site</span>
            <svg
              className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
