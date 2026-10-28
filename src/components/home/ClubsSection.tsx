'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ClubsSection() {
  const clubs = [
    {
      slug: 'electronique-iot',
      name: 'Electronique & IoT',
      image: '/ige-electronique.jpeg',
      imagePosition: 'center',
      description: 'Systèmes embarqués, microcontrôleurs, capteurs connectés, domotique et infrastructures de microréseaux électriques.',
    },
    {
      slug: 'robotique',
      name: 'Robotique',
      image: '/ige-robotique.jpeg',
      imagePosition: 'center',
      description: 'Conception de robots autonomes, vision par ordinateur, véhicules téléguidés, perception et commande algorithmique.',
    },
    {
      slug: 'informatique-industrielle',
      name: 'Informatique industrielle',
      image: '/ige-informatique-industrielle.jpeg',
      imagePosition: 'center',
      description: 'Automatisation des procédés, automates programmables (API), supervision SCADA et contrôle industriel connecté.',
    },
  ];

  return (
    <section id="clubs" className="py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-ige-teal tracking-tight">
            Les 3 clubs techniques IGE
          </h2>
          <p className="text-slate-600 text-base">
            Des espaces de pratique intensive, de prototypage et de réponse aux défis technologiques du Bénin.
          </p>
        </div>

        {/* 3 Clubs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {clubs.map((club) => {
            return (
              <div
                key={club.slug}
                className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex flex-col hover:border-ige-tealSoft0/50 transition-all group shadow-sm hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image
                    src={club.image}
                    alt={club.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${club.imagePosition === 'top' ? 'object-top origin-top' : 'object-center'}`}
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-8">
                  <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-2 group-hover:text-ige-teal transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {club.description}
                    </p>
                  </div>
                  </div>

                  <div className="pt-8 border-t border-slate-200 mt-8">
                    <Link
                      href={`/clubs/${club.slug}`}
                      className="inline-flex items-center space-x-2 text-xs font-bold text-ige-teal hover:text-ige-tealDark transition-colors"
                    >
                      <span>Voir les travaux du club</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
