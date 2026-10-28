'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useJEGETicket } from '@/hooks/useJEGETicket';
import { useReducedMotion } from 'framer-motion';

// Animated number component
function AnimatedNumber({ value, duration = 2, suffix = '' }: { value: string | number; duration?: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(1);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      // For users who prefer reduced motion, show final value immediately
      const numValue = typeof value === 'number' ? value : parseInt(value) || 0;
      setDisplayValue(numValue);
      return;
    }

    const numValue = typeof value === 'number' ? value : parseInt(value) || 0;
    const startTime = performance.now();
    const startValue = 1;

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(startValue + (numValue - startValue) * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, prefersReducedMotion]);

  // Format the display value
  const isPercentage = typeof value === 'string' && value.includes('%');
  const hasPlus = typeof value === 'string' && value.includes('+');

  return (
    <>
      {displayValue}
      {isPercentage && '%'}
      {hasPlus && '+'}
      {suffix && <>{suffix}</>}
    </>
  );
}

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { hasTicket } = useJEGETicket();

  return (
    <section className="relative flex items-center justify-center bg-slate-50 overflow-hidden pt-20 pb-24 border-b border-slate-200">
      
      {/* Background Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-ige-tealSoft/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-ige-navySoft/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          
          {/* Title & Headline */}
          <div className="space-y-6">

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.05]">
              INNOVATION EN <span className="text-ige-teal">GENIE ELECTRIQUE</span>
            </h1>

            {/* Value Proposition */}
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 font-normal leading-relaxed max-w-4xl mx-auto">
              Nous mettons le génie électrique au service du monde par l’innovation technologique.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={hasTicket ? '/je-ge/ticket' : '/je-ge'}
                className="px-7 py-4 rounded-xl bg-ige-teal hover:bg-ige-tealDark text-white font-display font-bold text-sm flex items-center justify-center space-x-3 shadow-lg hover:shadow-ige-teal/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>{hasTicket ? 'Consulter mon ticket' : 'Rejoindre la JE-GE 2026'}</span>
              </Link>
              <Link
                href="/projets"
                className="px-7 py-4 rounded-xl bg-white border border-slate-300 hover:border-ige-navy text-slate-800 font-display font-semibold text-sm flex items-center justify-center space-x-2 transition-all hover:bg-slate-50 shadow-sm"
              >
                <span>Explorer nos projets</span>
              </Link>
            </div>

            {/* Highlighted Trust Markers */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="space-y-1">
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  <AnimatedNumber value="100+" duration={3.5} />
                </span>
                <span className="text-xs text-slate-600">Etudiants GE et talents</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  <AnimatedNumber value={3} duration={1.5} /> Clubs
                </span>
                <span className="text-xs text-slate-600">IoT, Robotique, Info Indu</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl sm:text-3xl font-extrabold text-ige-teal font-display">
                  <AnimatedNumber value={6} duration={2} suffix="e édition" />
                </span>
                <span className="text-xs text-slate-600">Campagne JE-GE 25-26</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
