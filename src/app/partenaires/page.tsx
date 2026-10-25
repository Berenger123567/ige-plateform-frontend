'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Tv, Handshake, Search, Building2, X, Loader2, CheckCircle2 } from '@/components/IconImage';
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

const CATEGORY_LABELS: Record<string, string> = { 'Partenaire Media': 'Partenaire média' };

const emptyApplication = {
  organization: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  partnerType: '',
  contributionType: '',
  message: '',
};

export default function PartenairesPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('Tous');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyApplication);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await api.get('/partenaires');
      setPartners(Array.isArray(res.data) ? res.data : []);
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
      'Partenaire Media': { icon: Tv, className: 'text-blue-300' },
      'Partenaire': { icon: Handshake, className: 'text-slate-200' },
    };
    return icons[cat] || icons['Partenaire'];
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      'Sponsor Or': 'from-yellow-400 to-yellow-600',
      'Sponsor Argent': 'from-gray-300 to-gray-500',
      'Sponsor Bronze': 'from-orange-400 to-orange-600',
      'Partenaire Media': 'from-blue-400 to-blue-600',
      'Partenaire': 'from-ige-tealSoft0 to-ige-teal',
    };
    return colors[cat] || colors['Partenaire'];
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await api.post('/partenaires/candidature', form);
      setFeedback({ type: 'success', message: res.data?.message || 'Votre demande a bien été envoyée.' });
      setForm(emptyApplication);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.error || "Erreur lors de l'envoi de la demande." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-ige-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-ige-teal tracking-tight animate-fade-in">
              Nos partenaires
            </h1>
            <p className="text-lg text-slate-600">
              Ils nous accompagnent dans notre mission de promouvoir l&apos;innovation en génie électrique.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                filter === cat
                  ? 'bg-ige-teal text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-ige-tealSoft shadow'
              }`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {filter === 'Tous' ? (
          <div className="space-y-16">
            {categories.slice(1).map((category) => {
              const categoryPartners = partners.filter((p) => p.category === category);
              if (categoryPartners.length === 0) return null;

              return (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center`}>
                      {(() => {
                        const { icon: CategoryIcon } = getCategoryIcon(category);
                        return <CategoryIcon className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">{CATEGORY_LABELS[category] || category}</h2>
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
            <p className="text-xl text-slate-600">Aucun partenaire dans cette catégorie.</p>
          </div>
        )}

        <div className="mt-20 bg-ige-teal rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Devenez partenaire</h2>
            <p className="text-lg text-ige-tealSoft mb-6 max-w-2xl mx-auto">
              Rejoignez-nous dans notre mission de former la prochaine génération d&apos;ingénieurs en génie électrique au Bénin.
            </p>
            <button
              onClick={() => {
                setFeedback(null);
                setShowForm(true);
              }}
              className="inline-block px-8 py-3 bg-white text-ige-teal font-semibold rounded-lg hover:bg-ige-tealSoft transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Déposer une candidature
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-ige-navyDark">Candidature partenaire</h2>
                <p className="text-sm text-slate-500">Présentez votre organisation et votre projet de collaboration.</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-slate-100" aria-label="Fermer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {feedback?.type === 'success' ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-ige-teal mx-auto" />
                <p className="text-slate-700">{feedback.message}</p>
                <button onClick={() => setShowForm(false)} className="px-6 py-2 bg-ige-teal text-white rounded-lg hover:bg-ige-tealDark">
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={submitApplication} className="space-y-4">
                {feedback?.type === 'error' && (
                  <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">{feedback.message}</div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input required placeholder="Organisation *" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="p-2.5 border border-slate-300 rounded-lg" />
                  <input required placeholder="Personne de contact *" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className="p-2.5 border border-slate-300 rounded-lg" />
                  <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="p-2.5 border border-slate-300 rounded-lg" />
                  <input placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="p-2.5 border border-slate-300 rounded-lg" />
                  <input type="url" placeholder="Site web (https://...)" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="p-2.5 border border-slate-300 rounded-lg" />
                  <input placeholder="Type de partenaire (entreprise, école...)" value={form.partnerType} onChange={(e) => setForm({ ...form, partnerType: e.target.value })} className="p-2.5 border border-slate-300 rounded-lg" />
                </div>
                <select value={form.contributionType} onChange={(e) => setForm({ ...form, contributionType: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg">
                  <option value="">Type de contribution</option>
                  <option value="Financement">Financement</option>
                  <option value="Matériel">Matériel</option>
                  <option value="Expertise">Expertise</option>
                  <option value="Prix">Prix</option>
                  <option value="Stand">Stand</option>
                  <option value="Autre">Autre</option>
                </select>
                <textarea required minLength={20} rows={5} placeholder="Décrivez votre proposition de partenariat (20 caractères minimum) *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg" />
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-ige-teal text-white rounded-lg hover:bg-ige-tealDark disabled:opacity-60 inline-flex items-center gap-2">
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Envoyer la candidature
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
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
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-ige-teal transition-colors">
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
            className="inline-flex items-center gap-2 text-ige-teal hover:text-ige-tealDark font-medium text-sm group/link"
          >
            <span>Visiter le site</span>
          </a>
        )}
      </div>
    </div>
  );
}
