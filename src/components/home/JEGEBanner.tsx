'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, Calendar, MapPin, QrCode } from '@/components/IconImage';
import { useJEGETicket } from '@/hooks/useJEGETicket';

export default function JEGEBanner() {
  const { hasTicket } = useJEGETicket();

  return (
    <section className="py-20 bg-slate-100 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-md relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="text-xs font-mono text-ige-teal font-semibold">
                6e édition - JE-GE 2026
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ige-teal tracking-tight leading-tight">
                Journée de l’Etudiant en Génie Electrique
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                <strong className="text-slate-900">Thème 2026 :</strong> « Energie, innovation et durabilité : le génie électrique au service du développement du Bénin ». Deux jours de conférences, concours Crack GE, stands de démonstration et opportunités de recrutement.
              </p>

              {/* Event Metadata Cards */}
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center space-x-2 text-xs text-slate-700">
                  <Calendar className="w-4 h-4 text-ige-teal shrink-0" />
                  <span>Octobre / Novembre 2026</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-700">
                  <MapPin className="w-4 h-4 text-ige-teal shrink-0" />
                  <span>Grand Amphi EPAC, Abomey-Calavi</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-700">
                  <QrCode className="w-4 h-4 text-ige-teal shrink-0" />
                  <span>Badge et QR code de présence unique</span>
                </div>
              </div>

            </div>

            {/* Right Col: Big CTA Box */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <div className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-4">
                <span className="text-xs text-slate-500 block">Inscriptions ouvertes</span>
                <div className="text-2xl font-extrabold text-slate-900 font-display">Pass participant gratuit</div>
                <Link
                  href={hasTicket ? '/je-ge/ticket' : '/je-ge'}
                  className="w-full py-3.5 px-6 rounded-xl bg-ige-teal hover:bg-ige-tealDark text-white font-display font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
                >
                  <span>{hasTicket ? 'Consulter mon ticket' : "S'inscrire à la JE-GE"}</span>
                </Link>
                <p className="text-[10px] text-slate-500">
                  Confirmation immediate avec generation de votre badge QR Code.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
