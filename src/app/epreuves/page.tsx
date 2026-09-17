'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Download, Search, ChevronRight, BookOpen, Calendar, Filter } from 'lucide-react';

const DEFAULT_EPREUVES = [
  {
    annee: '2024',
    edition: 'JE-GE 2024',
    epreuves: [
      { id: '1', titre: 'Épreuve de Circuits Électriques', categorie: 'Théorique', fichierUrl: '#', pages: 8 },
      { id: '2', titre: 'Épreuve d\'Électronique Analogique', categorie: 'Théorique', fichierUrl: '#', pages: 6 },
      { id: '3', titre: 'Épreuve de Systèmes Automatisés', categorie: 'Pratique', fichierUrl: '#', pages: 4 },
      { id: '4', titre: 'Épreuve d\'Informatique Industrielle', categorie: 'Pratique', fichierUrl: '#', pages: 5 },
    ],
  },
  {
    annee: '2023',
    edition: 'JE-GE 2023',
    epreuves: [
      { id: '5', titre: 'Épreuve de Machines Électriques', categorie: 'Théorique', fichierUrl: '#', pages: 7 },
      { id: '6', titre: 'Épreuve d\'Électronique Numérique', categorie: 'Théorique', fichierUrl: '#', pages: 6 },
      { id: '7', titre: 'Épreuve de Robotique', categorie: 'Pratique', fichierUrl: '#', pages: 5 },
      { id: '8', titre: 'Épreuve d\'IoT & Capteurs', categorie: 'Pratique', fichierUrl: '#', pages: 4 },
    ],
  },
  {
    annee: '2022',
    edition: 'JE-GE 2022',
    epreuves: [
      { id: '9', titre: 'Épreuve de Conversion d\'Énergie', categorie: 'Théorique', fichierUrl: '#', pages: 9 },
      { id: '10', titre: 'Épreuve de Réseaux Électriques', categorie: 'Théorique', fichierUrl: '#', pages: 6 },
      { id: '11', titre: 'Épreuve de Programmation Embarquée', categorie: 'Pratique', fichierUrl: '#', pages: 5 },
    ],
  },
  {
    annee: '2021',
    edition: 'JE-GE 2021',
    epreuves: [
      { id: '12', titre: 'Épreuve d\'Électrotechnique Générale', categorie: 'Théorique', fichierUrl: '#', pages: 10 },
      { id: '13', titre: 'Épreuve de Capteurs & Instrumentation', categorie: 'Pratique', fichierUrl: '#', pages: 6 },
      { id: '14', titre: 'Épreuve de Traitement du Signal', categorie: 'Théorique', fichierUrl: '#', pages: 7 },
    ],
  },
];

const CATEGORIES = ['Toutes', 'Théorique', 'Pratique'];

export default function EpreuvesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('Toutes');
  const [editionsList, setEditionsList] = useState<any[]>(DEFAULT_EPREUVES);
  const [activeAnnee, setActiveAnnee] = useState('2024');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/epreuves`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Grouper par annee
          const grouped: Record<string, any[]> = {};
          data.forEach((ep) => {
            const an = ep.annee || '2024';
            if (!grouped[an]) grouped[an] = [];
            grouped[an].push(ep);
          });

          const formatted = Object.keys(grouped)
            .sort((a, b) => Number(b) - Number(a))
            .map((an) => ({
              annee: an,
              edition: `JE-GE ${an}`,
              epreuves: grouped[an],
            }));

          setEditionsList(formatted);
          if (formatted.length > 0) {
            setActiveAnnee(formatted[0].annee);
          }
        }
      })
      .catch(() => {
        // En cas d'erreur de chargement, on conserve la liste par défaut
      });
  }, []);

  const annees = editionsList.map((e) => e.annee);
  const activeEdition = editionsList.find((e) => e.annee === activeAnnee) || editionsList[0];

  const filteredEpreuves = activeEdition?.epreuves.filter((ep: any) => {
    const matchSearch = ep.titre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategorie === 'Toutes' || ep.categorie === selectedCategorie;
    return matchSearch && matchCat;
  }) ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white border-b border-slate-200 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <span>Accueil</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-800 font-medium">Anciennes Épreuves</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-ige-violetSoft border border-ige-violetSoft flex items-center justify-center shrink-0">
              <BookOpen className="w-7 h-7 text-ige-violet" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">
                Anciennes Épreuves JE-GE
              </h1>
              <p className="mt-2 text-slate-500 max-w-2xl">
                Retrouvez toutes les épreuves des éditions passées de la Journée de l'Étudiant en Génie Électrique (JE-GE). 
                Ces documents sont mis à disposition pour aider les futurs participants à se préparer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar — Années */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Éditions
                </p>
              </div>
              <ul>
                {annees.map((annee) => (
                  <li key={annee}>
                    <button
                      onClick={() => setActiveAnnee(annee)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all border-b border-slate-100 last:border-0 ${
                        activeAnnee === annee
                          ? 'bg-ige-violetSoft text-ige-violet border-l-4 border-l-ige-violet'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-ige-violet border-l-4 border-l-transparent'
                      }`}
                    >
                      <span>JE-GE {annee}</span>
                      <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">
                        {editionsList.find((e) => e.annee === annee)?.epreuves.length || 0}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 space-y-6">

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher une épreuve..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-ige-violet focus:ring-1 focus:ring-ige-violet/30"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategorie(cat)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                        selectedCategorie === cat
                          ? 'bg-ige-violet text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-ige-violet hover:text-ige-violet'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Titre de l'édition */}
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-display font-bold text-slate-800">
                Édition {activeAnnee}
              </h2>
              <span className="text-xs font-semibold bg-ige-violetSoft text-ige-violet px-2.5 py-1 rounded-full">
                {filteredEpreuves.length} épreuve{filteredEpreuves.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Liste des épreuves */}
            {filteredEpreuves.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucune épreuve trouvée.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEpreuves.map((ep: any, i: number) => (
                  <div
                    key={ep.id || i}
                    className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4 hover:border-ige-violet hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        ep.categorie === 'Pratique'
                          ? 'bg-ige-greenSoft border border-ige-greenSoft'
                          : 'bg-ige-violetSoft border border-ige-violetSoft'
                      }`}>
                        <FileText className={`w-5 h-5 ${ep.categorie === 'Pratique' ? 'text-ige-green' : 'text-ige-violet'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{ep.titre}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            ep.categorie === 'Pratique'
                              ? 'bg-ige-greenSoft text-ige-greenDark'
                              : 'bg-ige-violetSoft text-ige-violetDark'
                          }`}>
                            {ep.categorie}
                          </span>
                          <span className="text-xs text-slate-400">{ep.pages || 0} pages</span>
                        </div>
                      </div>
                    </div>
                    {ep.fichierUrl && ep.fichierUrl !== '#' ? (
                      <a
                        href={ep.fichierUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-slate-50 border border-slate-200 text-slate-600 group-hover:bg-ige-violet group-hover:border-ige-violet group-hover:text-white transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Télécharger
                      </a>
                    ) : (
                      <button
                        disabled
                        className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-400 cursor-not-allowed"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Bientôt dispo
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Utilisation pédagogique</p>
                <p className="text-xs text-amber-700 mt-1">
                  Ces épreuves sont à utiliser exclusivement à des fins de révision et de préparation à la JE-GE. 
                  Toute reproduction à des fins commerciales est interdite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
