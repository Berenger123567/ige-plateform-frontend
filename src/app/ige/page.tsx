import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Target } from '@/components/IconImage';

export default function IGEPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="relative isolate flex min-h-[38rem] items-center overflow-hidden bg-slate-950 lg:min-h-[40rem]">
        <Image
          src="/file_00000000a1f082108cdd9d709f81a763.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_20%]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-slate-950/20" aria-hidden="true" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-display font-extrabold text-[#6DC7CA] tracking-tight sm:text-6xl">
              Innovation en Génie Electrique (IGE)
            </h1>
            <p className="text-lg leading-relaxed text-white/90">
              L’IGE est une organisation académique et technologique réunissant les étudiants, enseignants-chercheurs et passionnés de génie électrique de l’Ecole Polytechnique d’Abomey-Calavi (EPAC).
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-ige-teal bg-ige-teal p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center text-white">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white">Notre vision</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              Devenir le moteur d’innovation technologique de référence en Afrique de l’Ouest pour les solutions à fort impact en énergie, robotique et informatique industrielle.
            </p>
          </div>

          <div className="rounded-2xl border border-ige-teal bg-ige-teal p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white">Notre mission</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              Former les ingénieurs et techniciens de demain par la pratique, le développement de prototypes réels, l’organisation d’événements scientifiques et la création de partenariats industriels.
            </p>
          </div>
        </div>

        {/* Governance & EPAC Impact */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 space-y-8 shadow-md">
          <h2 className="text-3xl font-display font-bold text-slate-900">L’écosystème IGE à l’EPAC</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-ige-teal font-display">100+</div>
              <h4 className="text-slate-900 font-bold text-sm">Etudiants spécialisés</h4>
              <p className="text-xs text-slate-600">Inscrits dans le département de génie électrique de l’EPAC.</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-ige-teal font-display">1000+</div>
              <h4 className="text-slate-900 font-bold text-sm">Etudiants de l’EPAC concernés</h4>
              <p className="text-xs text-slate-600">Public bénéficiaire des ateliers, hackathons et événements IGE.</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-ige-teal font-display">6 Mandats</div>
              <h4 className="text-slate-900 font-bold text-sm">Continuite & Archives</h4>
              <p className="text-xs text-slate-600">Structuration pérenne des projets et partenariats année après année.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
