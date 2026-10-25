'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useJEGETicket } from '@/hooks/useJEGETicket';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const HERO_IMAGES = [
  {
    src: '/ige-ampoule-logo.png',
    label: 'Ampoule connectée',
    alt: 'Ampoule turquoise et circuits bleu marine',
  },
  {
    src: '/ige-maison-turquoise.png',
    label: 'Maison électrique',
    alt: 'Maison et prise électrique dessinées en turquoise',
  },
  {
    src: '/ige-prise-turquoise.png',
    label: 'Prise électrique',
    alt: 'Prise électrique et éclair en turquoise',
  },
];

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
  const [activeImage, setActiveImage] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const { hasTicket } = useJEGETicket();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [prefersReducedMotion]);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-slate-50 overflow-hidden pt-12 pb-20 border-b border-slate-200">
      
      {/* Background Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-ige-tealSoft/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-ige-navySoft/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Title & Headline */}
          <div className="lg:col-span-7 space-y-8 text-left">

            {/* Main Title - EXACT Requirement from charge.txt */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.08]">
              INNOVATION EN <br />
              <span className="text-ige-teal">GENIE ELECTRIQUE</span>
            </h1>

            {/* Value Proposition - EXACT Requirement from charge.txt */}
            <p className="text-lg sm:text-xl text-slate-700 font-normal leading-relaxed max-w-2xl">
              Nous mettons le génie électrique au service du monde par l’innovation technologique.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
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
            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <span className="block text-2xl font-extrabold text-slate-900 font-display">
                  <AnimatedNumber value="100+" duration={3.5} />
                </span>
                <span className="text-xs text-slate-600">Etudiants GE et talents</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-slate-900 font-display">
                  <AnimatedNumber value={3} duration={1.5} /> Clubs
                </span>
                <span className="text-xs text-slate-600">IoT, Robotique, Info Indu</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-ige-teal font-display">
                  <AnimatedNumber value={6} duration={2} suffix="e édition" />
                </span>
                <span className="text-xs text-slate-600">Campagne JE-GE 25-26</span>
              </div>
            </div>

          </div>

          {/* IGE image carousel */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative aspect-[420/594] w-full max-w-[25rem] overflow-hidden">
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={HERO_IMAGES[activeImage].src}
                  initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.04 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.75, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={HERO_IMAGES[activeImage].src}
                    alt={HERO_IMAGES[activeImage].alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 80vw"
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2" role="group" aria-label="Choisir une illustration">
              {HERO_IMAGES.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  aria-label={`Afficher l’illustration : ${image.label}`}
                  aria-pressed={activeImage === index}
                  onClick={() => setActiveImage(index)}
                  className={`h-1.5 rounded-full transition-all ${activeImage === index ? 'w-6 bg-ige-teal' : 'w-1.5 bg-slate-300 hover:bg-slate-400'}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
