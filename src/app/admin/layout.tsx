'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, FolderKanban, CalendarDays,
  BookOpen, Award, MessageSquare, Mail, QrCode,
  ChevronLeft, ChevronRight, LogOut, Shield, Menu, X, Loader2, Handshake, Newspaper, Calendar, GraduationCap,
} from 'lucide-react';

const MENU = [
  { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { label: 'Clubs', href: '/admin/clubs', icon: Award },
  { label: 'Projets', href: '/admin/projets', icon: FolderKanban },
  { label: 'Blog', href: '/admin/blog', icon: Newspaper },
  { label: 'Événements', href: '/admin/evenements', icon: CalendarDays },
  { label: 'Partenaires', href: '/admin/partenaires', icon: Handshake },
  { label: 'Bureau IGE', href: '/admin/bureau', icon: Users },
  { label: 'Mandats', href: '/admin/mandats', icon: Calendar },
  { label: 'Éditions JE-GE', href: '/admin/editions-jege', icon: GraduationCap },
  { label: 'Épreuves', href: '/admin/epreuves', icon: BookOpen },
  { label: 'Participants JE-GE', href: '/admin/participants', icon: Users },
  { label: 'Scan QR Code', href: '/admin/checkin', icon: QrCode },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Si on est sur la page de login admin, pas besoin de charger la barre latérale ni de guarder
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    // Vérification de la session admin
    const token = localStorage.getItem('ige_admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setAuthenticated(true);
      setCheckingAuth(false);
    }
  }, [pathname, isLoginPage, router]);

  // Fermer le drawer mobile lors de la navigation
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('ige_admin_token');
    localStorage.removeItem('ige_admin_user');
    router.push('/admin/login');
  };

  // Si page de connexion, afficher directement le contenu sans layout d'admin
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Écran d'attente pendant la vérification d'authentification
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-white">
        <Loader2 className="w-8 h-8 text-ige-violet animate-spin" />
        <p className="text-xs text-slate-400">Vérification de l'accès administrateur...</p>
      </div>
    );
  }

  // Si non authentifié (avant redirection)
  if (!authenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">

      {/* ─── MOBILE BACKDROP & DRAWER ────────────────────────────────────────── */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer (off-canvas) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ige-violet/20 border border-ige-violet/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-ige-violet" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block leading-tight">Admin IGE</span>
              <span className="text-[10px] text-slate-400">Génie Électrique EPAC</span>
            </div>
          </div>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {MENU.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-ige-violet text-white shadow-md shadow-ige-violetDark/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-semibold"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Déconnexion Admin</span>
          </button>
        </div>
      </div>

      {/* ─── DESKTOP SIDEBAR ─────────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col bg-slate-900 text-white transition-all duration-300 sticky top-0 h-screen shrink-0 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className={`flex items-center h-16 border-b border-slate-800 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-ige-violet/20 border border-ige-violet/40 flex items-center justify-center">
                <Shield className="w-4 h-4 text-ige-violet" />
              </div>
              <span className="text-sm font-bold text-white">Admin IGE</span>
            </div>
          )}
          {collapsed && <Shield className="w-5 h-5 text-ige-violet" />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all ${
              collapsed ? 'absolute -right-3.5 top-4.5 z-10 bg-slate-700 border border-slate-600 shadow-md' : ''
            }`}
            title={collapsed ? 'Agrandir' : 'Réduire'}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          {MENU.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-ige-violet text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3 space-y-1">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-white hover:bg-red-500/20 transition-all font-semibold ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Déconnexion' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Déconnexion Admin</span>}
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Hamburger button (Mobile only) */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 -ml-1 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden flex items-center justify-center"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {MENU.find((m) => m.href === pathname)?.label ?? 'Administration'}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">IGE / EPAC — Panneau de gestion</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-slate-500 hover:text-ige-violet hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-ige-violet bg-slate-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Voir le site public</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quitter</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-ige-violet flex items-center justify-center text-white font-bold text-xs shadow-xs">
                A
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-xs font-semibold text-slate-800 leading-none">Administrateur</span>
                <span className="text-[10px] text-slate-400">Équipe IGE</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3.5 sm:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
