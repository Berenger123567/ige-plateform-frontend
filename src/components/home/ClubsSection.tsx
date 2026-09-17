'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Bot, Network, ArrowRight } from 'lucide-react';

export default function ClubsSection() {
  const clubs = [
    {
      slug: 'electronique-iot',
      name: 'Électronique & IoT',
      icon: Cpu,
      color: 'from-ige-green to-teal-500',
      description: 'Systèmes embarqués, microcontrôleurs, capteurs connectés, domotique et infrastructures de micro-réseaux électriques.',
      features: ['Systèmes Embarqués (ESP32/STM32)', 'Communication LoRaWAN & GSM', 'Prototypage de cartes PCB']
    },
    {
      slug: 'robotique',
      name: 'Robotique',
      icon: Bot,
      color: 'from-ige-violet to-ige-violet',
      description: 'Conception de robots autonomes, vision par ordinateur, véhicules téléguidés, perception et commande algorithmique.',
      features: ['Perception & ROS (Robot Operating System)', 'IA embarquée (Edge-AI)', 'Modélisation et impression 3D']
    },
    {
      slug: 'informatique-industrielle',
      name: 'Informatique Industrielle',
      icon: Network,
      color: 'from-blue-600 to-indigo-500',
      description: 'Automatisation des procédés, automates programmables (API), supervision SCADA et contrôle industriel connecté.',
      features: ['Automates Siemens S7 & Schneider', 'Supervision SCADA & Cloud IoT', 'Réseaux industriels (Modbus, Profinet)']
    }
  ];

  return (
    <section id="clubs" className="py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Les 3 Clubs Techniques IGE
          </h2>
          <p className="text-slate-600 text-base">
            Des espaces de pratique intensive, de prototypage et de réponse aux défis technologiques du Bénin.
          </p>
        </div>

        {/* 3 Clubs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {clubs.map((club) => {
            const Icon = club.icon;
            return (
              <div
                key={club.slug}
                className="rounded-2xl bg-slate-50 border border-slate-200 p-8 flex flex-col justify-between hover:border-ige-greenSoft0/50 transition-all group shadow-sm hover:shadow-md"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${club.color} p-0.5 flex items-center justify-center`}>
                      <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                        <Icon className="w-7 h-7 text-slate-900 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-2 group-hover:text-ige-green transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {club.description}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2">
                    {club.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-ige-green" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 border-t border-slate-200 mt-8">
                  <Link
                    href={`/clubs/${club.slug}`}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-ige-green hover:text-ige-greenDark uppercase tracking-wider transition-colors"
                  >
                    <span>Voir les travaux du club</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
