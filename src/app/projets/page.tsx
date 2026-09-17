'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProjects } from '@/lib/api';
import { Cpu, Search, Filter, ArrowRight, Star } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedClub, setSelectedClub] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProjects({ club: selectedClub, status: selectedStatus, search })
      .then((data) => setProjects(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedClub, selectedStatus, search]);

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-slate-900 tracking-tight">
            Catalogue des Projets IGE
          </h1>
          <p className="text-slate-700 text-lg max-w-2xl">
            Explorez les prototypes, hackathons et réalisations matérielles & logicielles des 3 clubs IGE.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par mot-clé (ex: ESP32, ROS, SCADA)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-ige-green"
            />
          </div>

          {/* Club Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:border-ige-green"
            >
              <option value="all">Tous les clubs</option>
              <option value="electronique-iot">Électronique & IoT</option>
              <option value="robotique">Robotique</option>
              <option value="informatique-industrielle">Informatique Industrielle</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:border-ige-green"
            >
              <option value="all">Tous les statuts</option>
              <option value="Exposé">Exposé / En démo</option>
              <option value="Terminé">Terminé</option>
              <option value="En cours">En cours</option>
            </select>
          </div>

        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 font-mono text-sm">
            Chargement des projets...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center text-slate-500 rounded-2xl bg-white border border-slate-200 shadow-sm">
            Aucun projet ne correspond à vos critères de recherche.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <Link
                key={proj.id}
                href={`/projets/${proj.id}`}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-ige-greenSoft0/40 shadow-sm hover:shadow-md transition-all group"
              >
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
                    <span className="px-3 py-1 rounded-md text-[11px] font-bold bg-white/90 text-slate-900 border border-slate-200 shadow-sm">
                      {proj.status}
                    </span>
                  </div>
                  {proj.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-ige-greenSoft0 text-white shadow-sm">
                        <Star className="w-3 h-3" /> Phare
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-display font-bold text-slate-900 mb-2 group-hover:text-ige-green transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {proj.summary}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.split(',').slice(0, 3).map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                      {proj.technologies.split(',').length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
                          +{proj.technologies.split(',').length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500">{proj.year}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-ige-green group-hover:gap-2 transition-all">
                        Voir le projet <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
