'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, CheckCircle2, ShieldCheck, Linkedin, Facebook } from '@/components/IconImage';
import { subscribeNewsletter } from '@/lib/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 sm:pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10 pb-12">
          <div className="space-y-5 sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex">
              <Image
                src="/IGE_carre_blanc_sans_fond_new.png"
                alt="IGE - Innovation en Génie Electrique"
                width={140}
                height={56}
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </Link>
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Innovation en Génie Electrique (IGE). Nous mettons le génie électrique au service du monde par l’innovation technologique, la formation des talents et l’excellence des projets à l’EPAC.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/amical-ige-epac/about/"
                target="_blank"
                rel="noopener noreferrer"
                title="Page LinkedIn IGE EPAC"
                aria-label="LinkedIn IGE EPAC"
                className="w-10 h-10 rounded-md border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-ige-teal transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/innovactiongeepac"
                target="_blank"
                rel="noopener noreferrer"
                title="Page Facebook IGE EPAC"
                aria-label="Facebook IGE EPAC"
                className="w-10 h-10 rounded-md border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-ige-teal transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <h2 className="text-xs font-bold text-white">Navigation</h2>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/ige" className="hover:text-white transition-colors">L’organisation IGE</Link></li>
              <li><Link href="/#clubs" className="hover:text-white transition-colors">Les clubs techniques</Link></li>
              <li><Link href="/projets" className="hover:text-white transition-colors">Projets et réalisations</Link></li>
              <li><Link href="/je-ge" className="hover:text-white transition-colors">Edition JE-GE 2026</Link></li>
              <li><Link href="/evenements" className="hover:text-white transition-colors">Agenda technologique</Link></li>
            </ul>
          </div>

          <div className="space-y-4 sm:col-span-2 lg:col-span-3">
            <h2 className="text-xs font-bold text-white">Contact</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-ige-teal shrink-0 mt-0.5" />
                <span>EPAC, Université d’Abomey-Calavi, Bénin</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-ige-teal shrink-0 mt-0.5" />
                <a className="break-all text-slate-400 hover:text-white transition-colors" href="mailto:innovationengenieelectriqueami@gmail.com">
                  innovationengenieelectriqueami@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 sm:col-span-2 lg:col-span-3">
            <h2 className="text-xs font-bold text-white">Newsletter</h2>
            <p className="text-sm leading-6 text-slate-400">
              Recevez notre bulletin mensuel sur les événements et les innovations au Bénin.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 rounded-md border border-ige-tealDark bg-ige-tealDark/60 p-3 text-xs text-teal-200" role="status">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Merci, votre inscription est confirmée.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <label className="sr-only" htmlFor="footer-newsletter-email">Votre adresse e-mail</label>
                <div className="flex gap-2">
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse e-mail"
                    className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ige-teal"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="shrink-0 rounded-md bg-ige-teal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ige-tealDark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Envoi…' : 'S’inscrire'}
                  </button>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Désinscription en un clic. Données sécurisées.</span>
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800 pt-5 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Innovation en Génie Electrique (IGE). Tous droits réservés.</p>
          <p>Plateforme développée pour l’écosystème technologique du Bénin.</p>
        </div>
      </div>
    </footer>
  );
}
