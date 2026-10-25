'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from '@/components/IconImage';
import { useMenus } from '@/hooks/useMenus';

type NavChild = { id: string; name: string; href: string; openInNewTab?: boolean };
type NavLink = { id: string; name: string; href: string; openInNewTab: boolean; children: NavChild[] };

const DEFAULT_NAV_LINKS: NavLink[] = [
  { id: 'default-home', name: 'Accueil', href: '/', openInNewTab: false, children: [] },
  { id: 'default-ige', name: "L'IGE", href: '/ige', openInNewTab: false, children: [] },
  { id: 'default-bureau', name: 'Bureau', href: '/bureau', openInNewTab: false, children: [] },
  { id: 'default-projets', name: 'Projets', href: '/projets', openInNewTab: false, children: [] },
  { id: 'default-blog', name: 'Actualités', href: '/blog', openInNewTab: false, children: [] },
  { id: 'default-partenaires', name: 'Partenaires', href: '/partenaires', openInNewTab: false, children: [] },
  { id: 'default-epreuves', name: 'Ressources', href: '/epreuves', openInNewTab: false, children: [] },
  { id: 'default-evenements', name: 'Evénements', href: '/evenements', openInNewTab: false, children: [] },
  { id: 'default-contact', name: 'Contact', href: '/contact', openInNewTab: false, children: [] },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const menu = useMenus('header');

  const navLinks = menu && menu.length > 0
    ? menu.map((item) => ({
        id: item.id,
        name: item.label,
        href: item.url,
        openInNewTab: item.openInNewTab,
        children: (item.children || []).map((child) => ({
          id: child.id,
          name: child.label,
          href: child.url,
          openInNewTab: child.openInNewTab,
        })),
      }))
    : DEFAULT_NAV_LINKS;

  // Verifie si le lien est actif
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.includes('#')) return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand Logo - Logo officiel IGE dans un cercle */}
        <Link href="/" className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center overflow-hidden p-1.5">
            <Image
              src="/IGE_carre_noir_sur_blanc_new.png"
              alt="IGE - Innovation en Génie Electrique"
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
              <div key={link.id} className="relative group">
                <Link
                  href={link.href}
                  target={link.openInNewTab ? '_blank' : undefined}
                  rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                  className={`relative text-base font-semibold transition-colors pb-1 inline-block ${
                    active
                      ? 'text-ige-teal'
                      : 'text-slate-700 hover:text-ige-teal'
                  }`}
                >
                  {link.name}
                  {/* Soulignement vert sous le lien actif */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-ige-teal rounded-full transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
                {link.children.length > 0 && (
                  <div className="absolute left-0 top-full pt-4 hidden group-hover:block z-50">
                    <div className="min-w-48 rounded-lg border border-slate-200 bg-white shadow-lg py-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          target={child.openInNewTab ? '_blank' : undefined}
                          rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                          className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-ige-teal"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* CTA JE-GE - Vert officiel IGE */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            href="/je-ge"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-ige-teal hover:bg-ige-tealDark rounded-lg shadow-md transition-all"
          >
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
                src="/IGE_carre_noir_sur_blanc_new.png"
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
              <div key={link.id}>
                <Link
                  href={link.href}
                  target={link.openInNewTab ? '_blank' : undefined}
                  rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-3 rounded-md text-base font-semibold border-l-4 transition-all ${
                    active
                      ? 'border-ige-teal text-ige-teal bg-ige-tealSoft'
                      : 'border-transparent text-slate-800 hover:bg-slate-100 hover:text-ige-teal hover:border-ige-teal'
                  }`}
                >
                  {link.name}
                </Link>
                {link.children.length > 0 && (
                  <div className="pl-6">
                    {link.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href}
                        target={child.openInNewTab ? '_blank' : undefined}
                        rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-ige-teal"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="pt-3">
            <Link
              href="/je-ge"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-ige-teal text-white font-bold text-sm"
            >
              <span>Inscrivez-vous à la JE-GE</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
