'use client';

import React, { useEffect, useState } from 'react';
import { registerJEGE, getActiveJEGEEdition } from '@/lib/api';
import { Rocket, CheckCircle2, CalendarPlus, Loader2 } from 'lucide-react';

// Génération d'un fichier .ics pour l'ajout au calendrier (exigence §17)
function downloadIcs(edition: any) {
  if (!edition?.startDate) return;
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const start = new Date(edition.startDate);
  const end = edition.endDate ? new Date(edition.endDate) : new Date(start.getTime() + 8 * 60 * 60 * 1000);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//IGE//JE-GE//FR',
    'BEGIN:VEVENT',
    `UID:jege-${edition.id}@ige-benin`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${edition.name}`,
    `DESCRIPTION:${edition.theme || ''}`,
    `LOCATION:${edition.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jege-2026.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const WORKSHOPS = [
  'Atelier IoT & Prototypage rapide',
  'Atelier Robotique & ROS',
  'Atelier Automatisation industrielle (SCADA)',
  'Atelier Énergie solaire & Smart Grid',
];

export default function JEGEPage() {
  const [edition, setEdition] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profile: 'Étudiant',
    institution: 'EPAC',
    department: '',
    domainOfInterest: 'IoT & Énergie',
    workshops: [] as string[],
    acceptedTerms: false,
    marketingConsent: false
  });

  const [loading, setLoading] = useState(false);
  const [registeredData, setRegisteredData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getActiveJEGEEdition()
      .then(setEdition)
      .catch(() => setEdition(null));
  }, []);

  const toggleWorkshop = (w: string) => {
    setFormData((prev) => ({
      ...prev,
      workshops: prev.workshops.includes(w)
        ? prev.workshops.filter((x) => x !== w)
        : [...prev.workshops, w],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await registerJEGE(formData);
      if (res.success !== false) {
        setRegisteredData(res.participant);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Erreur lors de l\u2019inscription');
    } finally {
      setLoading(false);
    }
  };

  const registrationsClosed = edition && edition.isOpen === false;

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header — dynamique depuis l'édition active (exigence §15/§34) */}
        <div className="text-center space-y-4">
          <div className="text-xs font-mono font-semibold text-ige-green">
            {registrationsClosed
              ? 'Inscriptions Fermées'
              : edition?.isOpen !== false
                ? 'Inscriptions Officiellement Ouvertes'
                : ''}
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            {edition?.name || 'JE-GE 25-26 (6e Édition)'}
          </h1>
          <p className="text-slate-700 text-base max-w-2xl mx-auto">
            « {edition?.theme || 'Énergie, Innovation et Durabilité : le Génie Électrique au service du développement du Bénin'} »
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-600">
            <span>📅 {edition?.dateText || 'Octobre / Novembre 2026'}</span>
            <span>📍 {edition?.location || 'Grand Amphithéâtre EPAC'}</span>
          </div>
        </div>

        {registeredData ? (
          /* Confirmation & QR Code Badge Card */
          <div className="rounded-3xl bg-white border border-ige-greenSoft0 p-8 sm:p-12 text-center space-y-8 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-ige-greenSoft border border-ige-green text-ige-greenDark mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold text-slate-900">Inscription Confirmée !</h2>
              <p className="text-slate-700 text-sm">
                Félicitations <strong className="text-ige-greenDark">{registeredData.firstName} {registeredData.lastName}</strong>, votre pass d'accès est prêt.
              </p>
            </div>

            {/* QR Code Graphic Badge */}
            <div className="max-w-xs mx-auto p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-md space-y-4 text-slate-900">
              <img src={registeredData.qrCodeDataUrl} alt="QR Code Badge" className="w-48 h-48 mx-auto" />
              <div className="text-[11px] font-mono font-bold tracking-widest uppercase border-t border-slate-200 pt-2 text-slate-600">
                TOKEN: {registeredData.qrCodeToken.slice(0, 18)}...
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Présentez ce QR Code à l'accueil sur votre téléphone ou version imprimée pour la validation immédiate de votre présence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-ige-green transition-all shadow-md"
              >
                Imprimer mon Pass / QR Code
              </button>
              {edition?.startDate && (
                <button
                  onClick={() => downloadIcs(edition)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider hover:border-ige-green transition-all shadow-sm"
                >
                  <CalendarPlus className="w-4 h-4 text-ige-green" />
                  Ajouter au calendrier (.ics)
                </button>
              )}
            </div>
          </div>
        ) : registrationsClosed ? (
          /* Inscriptions fermées — contrôlées depuis l'admin (exigence §54) */
          <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center shadow-md space-y-4">
            <h2 className="text-2xl font-display font-bold text-slate-900">Les inscriptions sont actuellement fermées</h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Revenez bientôt ou abonnez-vous à la newsletter pour être informé de l'ouverture des inscriptions.
            </p>
          </div>
        ) : (
          /* Registration Form */
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-md space-y-8">
            <h3 className="text-2xl font-display font-bold text-slate-900 border-b border-slate-200 pb-4">
              Formulaire de Réservation du Pass Participant
            </h3>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Ex: Alain"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Ex: HOUENOU"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Adresse E-mail *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alain@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Téléphone / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+229 97 00 00 00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Profil *</label>
                  <select
                    value={formData.profile}
                    onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-green"
                  >
                    <option value="Étudiant">Étudiant(e)</option>
                    <option value="Enseignant/Chercheur">Enseignant / Chercheur</option>
                    <option value="Alumni">Alumni EPAC</option>
                    <option value="Professionnel">Professionnel / Entreprise</option>
                    <option value="Autre">Autre participant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Institution / Université / Entreprise</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Ex: EPAC, UAC, Sèmè City..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-green"
                  />
                </div>
              </div>

              {/* Choix d'ateliers — exigence §16 (facultatif) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Ateliers souhaités <span className="text-slate-400 font-normal">(facultatif — plusieurs choix possibles)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WORKSHOPS.map((w) => (
                    <label key={w} className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.workshops.includes(w)}
                        onChange={() => toggleWorkshop(w)}
                        className="mt-0.5 rounded border-slate-300 text-ige-green focus:ring-0"
                      />
                      <span className="text-xs text-slate-700">{w}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ACCEPTATION DES CONDITIONS — exigence §16 (obligatoire) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.acceptedTerms}
                    onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                    className="mt-1 rounded border-slate-300 text-ige-green focus:ring-0"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    J'accepte les conditions de participation à la JE-GE et le traitement de mes données
                    dans le cadre strict de cet événement. *
                  </span>
                </label>
              </div>

              {/* SEPARATE MARKETING CONSENT — exigence §16 : distinct de l'inscription */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.marketingConsent}
                    onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                    className="mt-1 rounded border-slate-300 text-ige-green focus:ring-0"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    Je souhaite également recevoir la newsletter IGE et le bulletin mensuel récapitulatif des événements Tech au Bénin (facultatif).
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-ige-green hover:bg-ige-greenDark text-white font-display font-bold text-sm tracking-wider uppercase shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                <span>{loading ? 'Validation en cours...' : 'Valider mon Inscription & Générer le Badge'}</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
