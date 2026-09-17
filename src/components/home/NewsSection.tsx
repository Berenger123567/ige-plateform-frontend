'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Newspaper, Eye } from 'lucide-react';
import { api } from '@/lib/api';

export default function NewsSection() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('/articles', { params: { limit: 3 } })
      .then((res) => setArticles(Array.isArray(res.data) ? res.data : []))
      .catch(() => setArticles([]));
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              Actualités & Réalisations
            </h2>
            <p className="text-slate-600 text-base max-w-xl">
              Comptes rendus d'événements, succès en hackathons, projets et vie de l'association.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white border border-slate-300 hover:border-ige-green text-slate-900 text-xs uppercase font-bold tracking-wider transition-all shadow-sm"
          >
            <span>Toutes les actualités</span>
            <ArrowRight className="w-4 h-4 text-ige-green" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/blog/${a.slug}`}
              className="group rounded-2xl bg-white border border-slate-200 p-7 flex flex-col hover:border-ige-greenSoft0/40 shadow-sm hover:shadow-md transition-all"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded bg-ige-violetSoft text-ige-violetDark border border-ige-violetSoft self-start">
                {a.category}
              </span>
              <h3 className="mt-4 text-xl font-display font-bold text-slate-900 group-hover:text-ige-green transition-colors leading-snug">
                {a.title}
              </h3>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3 flex-1">{a.excerpt}</p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Newspaper className="w-3.5 h-3.5" />
                  {a.author}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {a.views}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
