'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Handshake } from '@/components/IconImage';
import { api } from '@/lib/api';

export default function PartnersSection() {
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('/partenaires')
      .then((res) => setPartners(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPartners([]));
  }, []);

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ige-teal tracking-tight">
              Nos partenaires
            </h2>
            <p className="text-slate-600 text-base max-w-xl">
              Institutions, entreprises et structures qui soutiennent l’écosystème IGE.
            </p>
          </div>
          <Link
            href="/partenaires"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-50 border border-slate-300 hover:border-ige-teal text-slate-900 text-xs font-bold transition-all shadow-sm"
          >
            <span>Devenir partenaire</span>
          </Link>
        </div>

        {partners.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-10 flex items-center justify-center gap-3 text-slate-500 text-sm text-center">
            <Handshake className="w-7 h-7 shrink-0 text-slate-400" />
            <span>Les partenariats seront bientôt annoncés.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {partners.slice(0, 12).map((p) => (
              <div
                key={p.id}
                className="rounded-xl bg-slate-50 border border-slate-200 p-5 flex items-center justify-center h-20 grayscale hover:grayscale-0 hover:border-ige-tealSoft0/40 transition-all"
                title={p.name}
              >
                {p.logoUrl ? (
                  <div className="relative w-full h-10">
                    <Image src={p.logoUrl} alt={p.name} fill className="object-contain" sizes="160px" />
                  </div>
                ) : (
                  <span className="text-xs font-bold text-slate-600 text-center leading-tight">{p.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
