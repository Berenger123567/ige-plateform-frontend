'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Rocket } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: "L'IGE", href: '/ige' },
    { name: 'Bureau', href: '/bureau' },
    { name: 'Projets', href: '/projets' },
    { name: 'Actualités', href: '/blog' },
    { name: 'Partenaires', href: '/partenaires' },
    { name: 'Ressources', href: '/epreuves' },
    { name: 'Événements', href: '/evenements' },
    { name: 'Contact', href: '/contact' },
  ];

  // Vérifie si le lien est actif
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.includes('#')) return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand Logo — Logo officiel IGE dans un cercle */}
        <Link href="/" className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center overflow-hidden p-1.5">
            <Image
              src="/logo-ige-white.png"
              alt="IGE — Innovation en Génie Électrique"
              width={48}
              height={48}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-base font-semibold transition-colors pb-1 group ${
                  active
                    ? 'text-ige-green'
                    : 'text-slate-700 hover:text-ige-green'
                }`}
              >
                {link.name}
                {/* Soulignement vert sous le lien actif */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-ige-green rounded-full transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* CTA JE-GE — Vert officiel IGE */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            href="/je-ge"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs uppercase font-bold tracking-wider text-white bg-ige-green hover:bg-ige-greenDark rounded-lg shadow-md transition-all"
          >
            <Rocket className="w-4 h-4" />
            <span>Inscrivez-vous à la JE-GE</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-4 pb-6 space-y-1">
          {/* Logo mobile */}
          <div className="pb-3 mb-2 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center overflow-hidden p-1">
              <Image
                src="/logo-ige-white.png"
                alt="IGE"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-3 rounded-md text-base font-semibold border-l-4 transition-all ${
                  active
                    ? 'border-ige-green text-ige-green bg-ige-greenSoft'
                    : 'border-transparent text-slate-800 hover:bg-slate-100 hover:text-ige-green hover:border-ige-green'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3">
            <Link
              href="/je-ge"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-ige-green text-white font-bold text-sm tracking-wider uppercase"
            >
              <Rocket className="w-4 h-4" />
              <span>Inscrivez-vous à la JE-GE</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
