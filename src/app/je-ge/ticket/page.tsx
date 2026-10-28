'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CalendarPlus,
  CheckCircle2,
  Download,
  Loader2,
  MapPin,
  QrCode,
  Search,
  ShieldCheck,
} from '@/components/IconImage';
import { getJEGEPass, lookupJEGEPass, type JEGEPass } from '@/lib/api';
import { getStoredJEGETicket, saveJEGETicket } from '@/hooks/useJEGETicket';
import { downloadTicketPng } from '@/lib/ticket';
import { downloadJEGEICS } from '@/lib/jegeCalendar';

function TicketLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-ige-teal" />
      <p className="text-sm">Chargement de votre ticket…</p>
    </div>
  );
}

function TicketContent() {
  const searchParams = useSearchParams();
  const queryToken = searchParams.get('token');
  const isNew = searchParams.get('new') === '1';

  const [pass, setPass] = useState<JEGEPass | null>(null);
  const [token, setToken] = useState<string | null>(queryToken);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupNumber, setLookupNumber] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const loadPass = useCallback(async (value: string) => {
    setLoading(true);
    setError('');
    setToken(value);
    try {
      const data = await getJEGEPass(value);
      setPass(data);
      saveJEGETicket({
        token: value,
        registrationNumber: data.participant.registrationNumber,
        firstName: data.participant.firstName,
        lastName: data.participant.lastName,
      });
    } catch (err: any) {
      setPass(null);
      setError(
        err?.response?.data?.error ||
          'Ticket introuvable. Vérifiez le lien reçu par e-mail.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const value = queryToken || getStoredJEGETicket()?.token || null;

    if (!value) {
      setLoading(false);
      return;
    }

    setToken(value);
    setLoading(true);
    setError('');
    getJEGEPass(value)
      .then((data) => {
        if (!active) return;
        setPass(data);
        saveJEGETicket({
          token: value,
          registrationNumber: data.participant.registrationNumber,
          firstName: data.participant.firstName,
          lastName: data.participant.lastName,
        });
      })
      .catch((err) => {
        if (!active) return;
        setPass(null);
        setError(
          err?.response?.data?.error ||
            'Ticket introuvable. Vérifiez le lien reçu par e-mail.'
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [queryToken]);

  const handleDownload = async () => {
    if (!pass) return;
    setDownloading(true);
    setDownloadError('');
    try {
      await downloadTicketPng(pass);
    } catch (err: any) {
      setDownloadError(err?.message || 'Impossible de télécharger le ticket.');
    } finally {
      setDownloading(false);
    }
  };

  const handleLookup = async (event: React.FormEvent) => {
    event.preventDefault();
    setLookupLoading(true);
    setLookupError('');
    try {
      const result = await lookupJEGEPass(
        lookupEmail.trim(),
        lookupNumber.trim().toUpperCase()
      );
      window.history.replaceState(
        null,
        '',
        `/je-ge/ticket?token=${encodeURIComponent(result.token)}`
      );
      await loadPass(result.token);
    } catch (err: any) {
      setLookupError(
        err?.response?.data?.error ||
          'Aucun ticket ne correspond à ces informations.'
      );
    } finally {
      setLookupLoading(false);
    }
  };

  if (loading) return <TicketLoading />;

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-ige-teal">
            <QrCode className="w-4 h-4" />
            Pass participant JE-GE
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
            Mon ticket
          </h1>
          <p className="text-sm text-slate-600">
            Téléchargez votre pass et présentez le QR code à l&apos;entrée.
          </p>
        </div>

        {isNew && pass && (
          <div className="rounded-2xl bg-ige-tealSoft border border-ige-teal p-5 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-ige-tealDark shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-ige-tealDark text-sm">
                Inscription confirmée !
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Votre ticket est prêt. Vous pouvez le télécharger et le
                conserver pour le jour de l&apos;événement.
              </p>
            </div>
          </div>
        )}

        {pass ? (
          <>
            <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
              <div className="bg-ige-navy text-white p-8 relative overflow-hidden">
                <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-ige-teal/30" />
                <div className="absolute -right-4 bottom-0 w-36 h-36 rounded-full bg-white/5" />
                <div className="relative space-y-4">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/70">
                    IGE · Innovation en Génie Électrique
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold">
                    {pass.edition.name}
                  </h2>
                  <span className="inline-block px-4 py-2 rounded-full bg-ige-teal text-white text-[10px] font-bold tracking-widest uppercase">
                    Pass participant
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Participant
                  </p>
                  <p className="text-2xl font-display font-extrabold text-slate-900 mt-1">
                    {pass.participant.firstName} {pass.participant.lastName}
                  </p>
                  <p className="text-xs font-mono text-slate-500 mt-2">
                    N° {pass.participant.registrationNumber}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Profil
                    </p>
                    <p className="text-slate-800 mt-1">
                      {pass.participant.profile || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Institution
                    </p>
                    <p className="text-slate-800 mt-1">
                      {pass.participant.institution || '—'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-300 pt-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    {pass.qrCodeDataUrl ? (
                      <img
                        src={pass.qrCodeDataUrl}
                        alt="QR code du pass"
                        className="w-44 h-44"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-500">
                        QR indisponible
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <p className="text-xs font-bold text-ige-tealDark uppercase tracking-widest">
                      Scannez à l&apos;entrée
                    </p>
                    <p className="text-xs text-slate-600">
                      Présentez ce QR code à l&apos;accueil pour vérifier votre
                      pass.
                    </p>
                    <p className="inline-flex items-center gap-2 text-xs text-slate-700">
                      <MapPin className="w-4 h-4 text-ige-teal" />
                      {pass.edition.location}
                    </p>
                    <p className="text-xs text-slate-700">
                      {pass.edition.dateText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {downloadError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {downloadError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ige-teal hover:bg-ige-tealDark text-white font-bold text-sm shadow-md transition-all disabled:opacity-60"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Télécharger le ticket
              </button>
              {pass.edition.planningPublished && pass.edition.planningUrl ? (
                <a
                  href={pass.edition.planningUrl}
                  download="Planning-JE-GE.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:border-ige-teal transition-all"
                >
                  <Download className="w-4 h-4 text-ige-teal" />
                  Télécharger le planning
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 font-bold text-sm cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  Planning non disponible
                </button>
              )}
              {pass.edition.startDate && (
                <button
                  onClick={() =>
                    downloadJEGEICS({
                      id: pass.edition.id,
                      name: pass.edition.name,
                      theme: pass.edition.theme,
                      location: pass.edition.location,
                      startDate: pass.edition.startDate,
                      endDate: pass.edition.endDate,
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:border-ige-teal transition-all"
                >
                  <CalendarPlus className="w-4 h-4 text-ige-teal" />
                  Ajouter au calendrier
                </button>
              )}
              <Link
                href={`/je-ge/validation?token=${encodeURIComponent(token || '')}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:border-ige-teal transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-ige-teal" />
                Vérifier le pass
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-md space-y-6">
            <div className="text-center space-y-2">
              <Search className="w-8 h-8 text-ige-teal mx-auto" />
              <h2 className="text-xl font-display font-bold text-slate-900">
                Retrouver mon ticket
              </h2>
              <p className="text-sm text-slate-600">
                {error
                  ? error
                  : 'Utilisez les informations reçues dans votre e-mail de confirmation.'}
              </p>
            </div>

            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  required
                  value={lookupEmail}
                  onChange={(event) => setLookupEmail(event.target.value)}
                  placeholder="vous@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-ige-teal"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Numéro d&apos;inscription
                </label>
                <input
                  type="text"
                  required
                  value={lookupNumber}
                  onChange={(event) => setLookupNumber(event.target.value)}
                  placeholder="JEGE-2026-ABC123"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:outline-none focus:border-ige-teal"
                />
              </div>

              {lookupError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {lookupError}
                </div>
              )}

              <button
                type="submit"
                disabled={lookupLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-ige-teal hover:bg-ige-tealDark text-white font-bold text-sm shadow-md transition-all disabled:opacity-60"
              >
                {lookupLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Retrouver mon ticket
              </button>
            </form>

            <p className="text-center text-xs text-slate-500">
              Pas encore inscrit ?{' '}
              <Link href="/je-ge" className="font-semibold text-ige-tealDark hover:underline">
                Inscrivez-vous à la JE-GE
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TicketPage() {
  return (
    <Suspense fallback={<TicketLoading />}>
      <TicketContent />
    </Suspense>
  );
}
