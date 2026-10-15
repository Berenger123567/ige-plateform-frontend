'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Shield, AlertCircle, Loader2 } from '@/components/IconImage';
import { API_BASE_URL } from '@/config/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Echec de la connexion.');
      }

      // Stocker la session admin
      localStorage.setItem('ige_admin_token', data.token);
      localStorage.setItem('ige_admin_user', JSON.stringify(data.user));

      // Redirection vers le tableau de bord admin
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Impossible de se connecter au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-ige-navy selection:text-white">
      {/* Glow ambient backgrounds */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-ige-navy/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-ige-teal/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-8">
        
        {/* Header & Logo */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl mb-2">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md">
              <Image
                src="/logo-ige-white.png"
                alt="IGE Logo"
                width={56}
                height={56}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Espace Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Plateforme Innovation en Génie Electrique (IGE/EPAC)
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="flex items-center gap-2 text-xs font-semibold text-ige-teal bg-ige-teal/10 border border-ige-teal/20 px-3 py-2 rounded-xl">
            <Shield className="w-4 h-4 shrink-0" />
            <span>Zone réservée à l’équipe dirigeante de l’IGE</span>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl text-red-400 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Adresse e-mail administrateur
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ige.bj ou admin"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-ige-navy focus:ring-1 focus:ring-ige-navy transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-ige-navy focus:ring-1 focus:ring-ige-navy transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-ige-navy to-ige-navyDark hover:from-ige-navyDark hover:to-ige-navyDark text-white font-bold text-sm rounded-xl shadow-lg shadow-ige-navyDark/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Vérification…</span>
                </>
              ) : (
                <>
                  <span>Connexion au tableau de bord</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-600">
          © 2026 Innovation en Génie Electrique (IGE). Accès restreint.
        </p>

      </div>
    </div>
  );
}
