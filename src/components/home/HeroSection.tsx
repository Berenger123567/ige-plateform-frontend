'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Zap, ArrowRight, Shield, Rocket, Activity, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-slate-50 overflow-hidden pt-12 pb-20 border-b border-slate-200">
      
      {/* Background Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-ige-greenSoft/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-ige-violetSoft/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Title & Headline */}
          <div className="lg:col-span-7 space-y-8 text-left">

            {/* Main Title - EXACT Requirement from charge.txt */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.08]">
              INNOVATION EN <br />
              <span className="text-gradient-green-violet">GÉNIE ÉLECTRIQUE</span>
            </h1>

            {/* Value Proposition - EXACT Requirement from charge.txt */}
            <p className="text-lg sm:text-xl text-slate-700 font-normal leading-relaxed max-w-2xl">
              Nous mettons le génie électrique au service du monde par l'innovation technologique.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                href="/je-ge"
                className="px-7 py-4 rounded-xl bg-ige-green hover:bg-ige-greenDark text-white font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-3 shadow-lg hover:shadow-ige-green/30 transition-all transform hover:-translate-y-0.5"
              >
                <Rocket className="w-5 h-5" />
                <span>Rejoindre la JE-GE 2026</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/projets"
                className="px-7 py-4 rounded-xl bg-white border border-slate-300 hover:border-ige-violet text-slate-800 font-display font-semibold text-sm flex items-center justify-center space-x-2 transition-all hover:bg-slate-50 shadow-sm"
              >
                <Cpu className="w-4 h-4 text-ige-violet" />
                <span>Explorer nos projets</span>
              </Link>
            </div>

            {/* Highlighted Trust Markers */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <span className="block text-2xl font-extrabold text-slate-900 font-display">100+</span>
                <span className="text-xs text-slate-600">Étudiants GE & Talents</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-slate-900 font-display">3 Clubs</span>
                <span className="text-xs text-slate-600">IoT, Robotique, Info Indu</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-ige-green font-display">6e Édition</span>
                <span className="text-xs text-slate-600">Campagne JE-GE 25-26</span>
              </div>
            </div>

          </div>

          {/* Right Column: Immersive Tech Dashboard Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-white border border-slate-200 p-6 shadow-xl backdrop-blur-xl">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-ige-greenSoft0 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-800">Écosystème IGE EPAC</span>
                </div>
                <Activity className="w-4 h-4 text-ige-violet" />
              </div>

              {/* Graphic Mockup: Electrical System & IoT Nodes */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-800 font-medium flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-ige-green" />
                      <span>Réseau Smart Grid Solaire</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-ige-greenSoft text-ige-greenDark border border-ige-bronze/40 font-mono font-bold">OPÉRATIONNEL</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-ige-green h-full w-[88%]" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-800 font-medium flex items-center space-x-1.5">
                      <Cpu className="w-3.5 h-3.5 text-ige-violet" />
                      <span>AgriBot ROS & Capteurs IoT</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-ige-violetSoft text-ige-violetDark border border-ige-violet font-mono font-bold">EN DÉMO</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-ige-violet h-full w-[75%]" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-800 font-medium flex items-center space-x-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-500" />
                      <span>Automatisation SCADA Industrielle</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700 font-mono font-bold">CONCEPTION</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-600 h-full w-[92%]" />
                  </div>
                </div>
              </div>

              {/* Bottom Quote Badge */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span className="flex items-center space-x-1 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-ige-green" />
                  <span>Laboratoire EPAC, Bénin</span>
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
