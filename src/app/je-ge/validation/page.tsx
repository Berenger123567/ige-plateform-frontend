'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  QrCode,
  ShieldCheck,
  XCircle,
} from '@/components/IconImage';
import { getJEGEPass, type JEGEPass } from '@/lib/api';

function ValidationLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-ige-teal" />
      <p className="text-sm">Vérification du pass…</p>
    </div>
  );
}

function ValidationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [pass, setPass] = useState<JEGEPass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    if (!token) {
      setError('Aucun token de pass fourni.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    getJEGEPass(token)
      .then((data) => {
        if (active) setPass(data);
      })
      .catch((err) => {
        if (!active) return;
        setPass(null);
        setError(
          err?.response?.data?.error ||
            'Pass introuvable ou invalide. Vérifiez le QR code.'
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  if (loading) return <ValidationLoading />;

  if (!pass) {
    return (
      <div className="py-16 bg-slate-50 min-h-screen">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white border border-red-200 p-10 text-center space-y-5 shadow-md">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-500 mx-auto flex items-center justify-center">
              <XCircle className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-display font-bold text-slate-900">
                Pass invalide
              </h1>
              <p className="text-sm text-slate-600">{error}</p>
            </div>
            <Link
              href="/je-ge"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-ige-teal hover:bg-ige-tealDark text-white font-bold text-sm transition-all"
            >
              Retour à la JE-GE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const alreadyCheckedIn = pass.status === 'ALREADY_CHECKED_IN';

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-ige-teal">
            <QrCode className="w-4 h-4" />
            Vérification du pass
          </div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900">
            {alreadyCheckedIn ? 'Pass déjà scanné' : 'Pass valide'}
          </h1>
        </div>

        <div
          className={`rounded-3xl bg-white border p-8 shadow-md space-y-6 ${
            alreadyCheckedIn ? 'border-amber-300' : 'border-ige-teal'
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              alreadyCheckedIn
                ? 'bg-amber-50 border border-amber-300 text-amber-600'
                : 'bg-ige-tealSoft border border-ige-teal text-ige-tealDark'
            }`}
          >
            {alreadyCheckedIn ? (
              <Clock className="w-9 h-9" />
            ) : (
              <CheckCircle2 className="w-9 h-9" />
            )}
          </div>

          <div className="text-center space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Participant
            </p>
            <p className="text-2xl font-display font-extrabold text-slate-900">
              {pass.participant.firstName} {pass.participant.lastName}
            </p>
            <p className="text-xs font-mono text-slate-500">
              N° {pass.participant.registrationNumber}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-5">
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

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
            <p className="text-xs font-bold text-slate-800">
              {pass.edition.name}
            </p>
            <p className="inline-flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-ige-teal" />
              {pass.edition.location}
            </p>
            <p className="text-xs text-slate-600">{pass.edition.dateText}</p>
          </div>

          {alreadyCheckedIn && (
            <p className="text-center text-xs text-amber-700">
              Entrée déjà enregistrée
              {pass.participant.checkedInAt
                ? ` le ${new Date(pass.participant.checkedInAt).toLocaleString(
                    'fr-FR'
                  )}`
                : ''}
              .
            </p>
          )}

          <div className="flex items-start gap-2 text-[11px] text-slate-500 border-t border-slate-100 pt-4">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Cette page vérifie uniquement l&apos;authenticité du pass. Le
              pointage est effectué par l&apos;équipe d&apos;accueil.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href={`/je-ge/ticket?token=${encodeURIComponent(token || '')}`}
            className="text-xs font-semibold text-ige-tealDark hover:underline"
          >
            Consulter le ticket
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ValidationPage() {
  return (
    <Suspense fallback={<ValidationLoading />}>
      <ValidationContent />
    </Suspense>
  );
}
