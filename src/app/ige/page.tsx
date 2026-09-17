import React from 'react';
import { ShieldCheck, Target } from 'lucide-react';

export default function IGEPage() {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-slate-900 tracking-tight">
            Innovation en Génie Électrique (IGE)
          </h1>
          <p className="text-slate-700 text-lg leading-relaxed">
            L'IGE est une organisation académique et technologique réunissant les étudiants, enseignants-chercheurs et passionnés de génie électrique de l’École Polytechnique d’Abomey-Calavi (EPAC).
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-ige-greenSoft border border-ige-bronze/40 flex items-center justify-center text-ige-greenDark">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900">Notre Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Devenir le moteur d’innovation technologique de référence en Afrique de l’Ouest pour les solutions à fort impact en énergie, robotique et informatique industrielle.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-ige-violetSoft border border-ige-violet flex items-center justify-center text-ige-violetDark">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900">Notre Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Former les ingénieurs et techniciens de demain par la pratique, le développement de prototypes réels, l’organisation d’événements scientifiques et la création de partenariats industriels.
            </p>
          </div>
        </div>

        {/* Governance & EPAC Impact */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 space-y-8 shadow-md">
          <h2 className="text-3xl font-display font-bold text-slate-900">L’Écosystème IGE à l’EPAC</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-ige-green font-display">100+</div>
              <h4 className="text-slate-900 font-bold text-sm">Étudiants Spécialisés</h4>
              <p className="text-xs text-slate-600">Inscrits dans le département de Génie Électrique de l’EPAC.</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-slate-900 font-display">1000+</div>
              <h4 className="text-slate-900 font-bold text-sm">Étudiants EPAC Touchés</h4>
              <p className="text-xs text-slate-600">Public bénéficiaire des ateliers, hackathons et événements IGE.</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-ige-violet font-display">6 Mandats</div>
              <h4 className="text-slate-900 font-bold text-sm">Continuité & Archives</h4>
              <p className="text-xs text-slate-600">Structuration pérenne des projets et partenariats année après année.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
