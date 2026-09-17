'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cpu, ArrowRight, ExternalLink } from 'lucide-react';
import { getProjects } from '@/lib/api';

export default function ProjectsShowcase() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    getProjects()
      .then((data) => setProjects(data.slice(0, 3)))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              Projets Phares des Étudiants
            </h2>
            <p className="text-slate-600 text-base max-w-xl">
              Solutions matérielles et logicielles développées au sein des clubs, hackathons et formations.
            </p>
          </div>
          <Link
            href="/projets"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white border border-slate-300 hover:border-ige-green text-slate-900 text-xs uppercase font-bold tracking-wider transition-all shadow-sm"
          >
            <span>Voir tout le catalogue</span>
            <ArrowRight className="w-4 h-4 text-ige-green" />
          </Link>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-300 shadow-sm hover:shadow-md transition-all group"
            >
              {/* Image Preview */}
              <div className="h-48 relative overflow-hidden bg-slate-100">
                {proj.imageUrl ? (
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                    <Cpu className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-md text-[11px] font-bold bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200 shadow-sm">
                    {proj.status || 'Exposé'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-2 group-hover:text-ige-green transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {proj.summary}
                  </p>
                </div>

                {/* Tech tags */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.split(',').map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Button */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  href={`/projets/${proj.id}`}
                  className="w-full py-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-ige-green text-xs font-semibold text-slate-800 hover:text-ige-green flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Consulter la fiche projet</span>
                  <ExternalLink className="w-3.5 h-3.5 text-ige-green" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
