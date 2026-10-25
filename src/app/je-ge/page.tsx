'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerJEGE, getActiveJEGEEdition } from '@/lib/api';
import {
  Calendar,
  CheckCircle2,
  Download,
  Loader2,
  MapPin,
  QrCode,
} from '@/components/IconImage';
import {
  clearJEGETicket,
  saveJEGETicket,
  useJEGETicket,
} from '@/hooks/useJEGETicket';

const WORKSHOPS = [
  'Atelier IoT & Prototypage rapide',
  'Atelier Robotique & ROS',
  'Atelier Automatisation industrielle (SCADA)',
  'Atelier Energie solaire et Smart Grid',
];

export default function JEGEPage() {
  const router = useRouter();
  const { ticket, ready } = useJEGETicket();

  const [edition, setEdition] = useState<any>(null);
  const [allowAnother, setAllowAnother] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profile: 'Etudiant',
    institution: 'EPAC',
    department: '',
    domainOfInterest: 'IoT & Energie',
    workshops: [] as string[],
    acceptedTerms: false,
    marketingConsent: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState<string | null>(null);

  React.useEffect(() => {
    getActiveJEGEEdition()
      .then(setEdition)
      .catch(() => setEdition(null));
  }, []);

  const toggleWorkshop = (workshop: string) => {
    setFormData((prev) => ({
      ...prev,
      workshops: prev.workshops.includes(workshop)
        ? prev.workshops.filter((item) => item !== workshop)
        : [...prev.workshops, workshop],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setAlreadyRegistered(null);

    try {
      const res = await registerJEGE(formData);
      const participant = res?.participant;
      if (!participant?.qrCodeToken) {
        throw new Error('Inscription confirmée, mais le ticket est indisponible.');
      }

      saveJEGETicket({
        token: participant.qrCodeToken,
        registrationNumber: participant.registrationNumber,
        firstName: participant.firstName,
        lastName: participant.lastName,
      });

      router.push(
        `/je-ge/ticket?token=${encodeURIComponent(participant.qrCodeToken)}&new=1`
      );
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.alreadyRegistered) {
        setAlreadyRegistered(data.registrationNumber || '');
        setErrorMsg(
          "Vous êtes déjà inscrit à cette édition. Consultez votre ticket ou retrouvez-le avec votre e-mail et votre numéro d'inscription."
        );
      } else {
        setErrorMsg(
          data?.error ||
            err?.message ||
            "Erreur lors de l'inscription. Veuillez réessayer."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnotherPerson = () => {
    clearJEGETicket();
    setAllowAnother(true);
    setErrorMsg('');
    setAlreadyRegistered(null);
  };

  const registrationsClosed = edition && edition.isOpen === false;
  const hasStoredTicket = Boolean(ticket) && !allowAnother;

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="text-xs font-mono font-semibold text-ige-teal">
            {registrationsClosed
              ? 'Inscriptions fermées'
              : edition?.isOpen !== false
                ? 'Inscriptions officiellement ouvertes'
                : ''}
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            {edition?.name || 'JE-GE 25-26 (6e édition)'}
          </h1>
          <p className="text-slate-700 text-base max-w-2xl mx-auto">
            «{' '}
            {edition?.theme ||
              'Energie, innovation et durabilité : le génie électrique au service du développement du Bénin'}{' '}
            »
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {edition?.dateText || 'Octobre / Novembre 2026'}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {edition?.location || 'Grand Amphithéâtre EPAC'}
            </span>
          </div>
        </div>

        {!ready ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-ige-teal" />
          </div>
        ) : hasStoredTicket && ticket ? (
          <div className="rounded-3xl bg-white border border-ige-teal p-8 sm:p-12 text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-ige-tealSoft border border-ige-teal text-ige-tealDark mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-slate-900">
                Vous êtes déjà inscrit(e)
              </h2>
              <p className="text-slate-600 text-sm">
                Un ticket existe déjà sur cet appareil pour{' '}
                <strong className="text-slate-900">
                  {ticket.firstName} {ticket.lastName}
                </strong>
                .
              </p>
              <p className="text-xs font-mono text-slate-500">
                N° {ticket.registrationNumber}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/je-ge/ticket?token=${encodeURIComponent(ticket.token)}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ige-teal hover:bg-ige-tealDark text-white font-bold text-sm shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                Consulter / télécharger mon ticket
              </Link>
              <button
                onClick={handleAnotherPerson}
                className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm hover:border-ige-teal transition-all"
              >
                Inscrire une autre personne
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Le ticket est accessible à tout moment depuis le bouton
              « Consulter mon ticket » du menu.
            </p>
          </div>
        ) : registrationsClosed ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center shadow-md space-y-4">
            <h2 className="text-2xl font-display font-bold text-slate-900">
              Les inscriptions sont actuellement fermées
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Revenez bientôt ou abonnez-vous à la newsletter pour être informé
              de l&apos;ouverture des inscriptions.
            </p>
            <Link
              href="/je-ge/ticket"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm hover:border-ige-teal transition-all"
            >
              J&apos;ai déjà un ticket
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-md space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
              <h3 className="text-2xl font-display font-bold text-slate-900">
                Formulaire de réservation du pass participant
              </h3>
              <Link
                href="/je-ge/ticket"
                className="text-xs font-semibold text-ige-tealDark hover:underline whitespace-nowrap"
              >
                Déjà inscrit ? Retrouver mon ticket
              </Link>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs space-y-3">
                <p>{errorMsg}</p>
                {alreadyRegistered && (
                  <p className="font-mono text-red-800">
                    N° {alreadyRegistered}
                  </p>
                )}
                {alreadyRegistered && (
                  <Link
                    href="/je-ge/ticket"
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-white border border-red-300 text-red-800 font-bold text-xs hover:bg-red-100 transition-all"
                  >
                    Consulter mon ticket
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(event) =>
                      setFormData({ ...formData, firstName: event.target.value })
                    }
                    placeholder="Ex: Alain"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(event) =>
                      setFormData({ ...formData, lastName: event.target.value })
                    }
                    placeholder="Ex: HOUENOU"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Adresse e-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) =>
                      setFormData({ ...formData, email: event.target.value })
                    }
                    placeholder="alain@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Téléphone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData({ ...formData, phone: event.target.value })
                    }
                    placeholder="+229 97 00 00 00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Profil *
                  </label>
                  <select
                    value={formData.profile}
                    onChange={(event) =>
                      setFormData({ ...formData, profile: event.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-teal"
                  >
                    <option value="Etudiant">Etudiant(e)</option>
                    <option value="Enseignant/Chercheur">
                      Enseignant / Chercheur
                    </option>
                    <option value="Alumni">Alumni EPAC</option>
                    <option value="Professionnel">
                      Professionnel / Entreprise
                    </option>
                    <option value="Autre">Autre participant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Institution / université / entreprise
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        institution: event.target.value,
                      })
                    }
                    placeholder="Ex. : EPAC, UAC, Sèmè City…"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-teal"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Ateliers souhaités{' '}
                  <span className="text-slate-400 font-normal">
                    (facultatif, plusieurs choix possibles)
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WORKSHOPS.map((workshop) => (
                    <label
                      key={workshop}
                      className="flex items-start space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.workshops.includes(workshop)}
                        onChange={() => toggleWorkshop(workshop)}
                        className="mt-0.5 rounded border-slate-300 text-ige-teal focus:ring-0"
                      />
                      <span className="text-xs text-slate-700">
                        {workshop}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.acceptedTerms}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        acceptedTerms: event.target.checked,
                      })
                    }
                    className="mt-1 rounded border-slate-300 text-ige-teal focus:ring-0"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    J&apos;accepte les conditions de participation à la JE-GE et
                    le traitement de mes données dans le cadre strict de cet
                    événement. *
                  </span>
                </label>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.marketingConsent}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        marketingConsent: event.target.checked,
                      })
                    }
                    className="mt-1 rounded border-slate-300 text-ige-teal focus:ring-0"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    Je souhaite également recevoir la newsletter IGE et le
                    bulletin mensuel récapitulatif des événements technologiques
                    au Bénin (facultatif).
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-ige-teal hover:bg-ige-tealDark text-white font-display font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>
                  {loading
                    ? 'Validation en cours…'
                    : 'Valider mon inscription et générer mon ticket'}
                </span>
              </button>

              <p className="text-center text-[11px] text-slate-500 inline-flex items-center gap-1 w-full justify-center">
                <QrCode className="w-3.5 h-3.5" />
                Un seul ticket par adresse e-mail. Votre ticket reste accessible
                à tout moment.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
