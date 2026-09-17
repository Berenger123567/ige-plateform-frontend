'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Send, CheckCircle2, ShieldCheck, Linkedin, Facebook } from 'lucide-react';
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
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Col 1 & 2: Brand Info — Logo fond sombre */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/">
              <Image
                src="/logo-ige-dark.png"
                alt="IGE — Innovation en Génie Électrique"
                width={140}
                height={56}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Innovation en Génie Électrique (IGE). Nous mettons le génie électrique au service du monde par l'innovation technologique, la formation des talents et l'excellence des projets à l'EPAC.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/amical-ige-epac/about/"
                target="_blank"
                rel="noopener noreferrer"
                title="Page LinkedIn IGE EPAC"
                className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-ige-green hover:border-ige-green transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/innovactiongeepac"
                target="_blank"
                rel="noopener noreferrer"
                title="Page Facebook IGE EPAC"
                className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-ige-green hover:border-ige-green transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">Plateforme</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/ige" className="hover:text-white transition-colors">L'Organisation IGE</Link></li>
              <li><Link href="/#clubs" className="hover:text-white transition-colors">Les 3 Clubs Techniques</Link></li>
              <li><Link href="/projets" className="hover:text-white transition-colors">Projets & Réalisations</Link></li>
              <li><Link href="/je-ge" className="hover:text-white transition-colors">Édition JE-GE 2026</Link></li>
              <li><Link href="/evenements" className="hover:text-white transition-colors">Agenda Tech Bénin</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">Contact & Siège</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-ige-green shrink-0 mt-0.5" />
                <span>EPAC, Université d'Abomey-Calavi, Bénin</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-ige-green shrink-0 mt-0.5" />
                <span className="text-xs">innovationengenieelectriqueami@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">Newsletter Tech</h4>
            <p className="text-xs text-slate-400">
              Recevez notre bulletin mensuel des événements et innovations au Bénin.
            </p>

            {subscribed ? (
              <div className="p-3 bg-ige-greenDark/60 border border-ige-greenDark rounded-lg flex items-center space-x-2 text-ige-green text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Merci ! Vous êtes inscrit(e).</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre e-mail..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ige-green"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1 top-1 bottom-1 px-3 bg-ige-green hover:bg-ige-greenDark text-white rounded-md transition-all text-xs font-semibold flex items-center justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-slate-400" />
                  <span>Désinscription en 1 clic. Données sécurisées.</span>
                </p>
              </form>
            )}
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Innovation en Génie Électrique (IGE). Tous droits réservés.</p>
          <p className="mt-2 md:mt-0">Plateforme développée pour l'écosystème Tech du Bénin.</p>
        </div>
      </div>
    </footer>
  );
}
