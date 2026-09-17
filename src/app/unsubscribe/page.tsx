'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MailCheck, MailX, Loader2 } from 'lucide-react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  useEffect(() => {
    // Cas 1 : le backend a déjà traité la désinscription via son lien GET (redirection ?status=ok)
    if (searchParams.get('status') === 'ok') {
      setStatus('done');
      return;
    }

    // Cas 2 : lien avec l'email en paramètre → on désinscrit depuis le navigateur
    const email = searchParams.get('email');
    if (email) {
      setStatus('loading');
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/newsletter/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: decodeURIComponent(email) }),
      })
        .then((res) => (res.ok ? setStatus('done') : setStatus('error')))
        .catch(() => setStatus('error'));
    }
  }, [searchParams]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <div className="max-w-md w-full rounded-3xl bg-white border border-slate-200 shadow-md p-8 sm:p-10 text-center space-y-6">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-ige-green animate-spin mx-auto" />
            <h1 className="text-2xl font-display font-bold text-slate-900">Désinscription en cours...</h1>
            <p className="text-sm text-slate-600">Veuillez patienter un instant.</p>
          </>
        )}

        {status === 'done' && (
          <>
            <div className="w-16 h-16 rounded-full bg-ige-greenSoft border border-ige-bronze/40 text-ige-greenDark mx-auto flex items-center justify-center">
              <MailCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Désinscription confirmée</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Vous ne recevrez plus nos communications par e-mail.
              <br />
              Vous pouvez toujours consulter l&apos;agenda des événements Tech du Bénin sur notre site.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-ige-green transition-all"
            >
              Retour à l&apos;accueil
            </a>
          </>
        )}

        {(status === 'idle' || status === 'error') && (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 text-amber-700 mx-auto flex items-center justify-center">
              <MailX className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              {status === 'error' ? 'Une erreur est survenue' : 'Se désinscrire de la newsletter'}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {status === 'error'
                ? "La désinscription n'a pas pu être traitée. Merci de réessayer plus tard."
                : "Le lien de désinscription semble incomplet. Si vous souhaitez ne plus recevoir nos e-mails, contactez-nous."}
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-ige-green transition-all"
            >
              Nous contacter
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
          <Loader2 className="w-10 h-10 text-ige-green animate-spin" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
