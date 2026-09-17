'use client';

import React, { useState } from 'react';
import { sendContactMessage } from '@/lib/api';
import { Mail, MapPin, Send, CheckCircle2, Building, Linkedin, Facebook } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Demande d’information générale',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await sendContactMessage(formData);
      if (res.success) {
        setSent(true);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Erreur lors de l’envoi du message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-slate-900 tracking-tight">
            Contactez l’Équipe IGE
          </h1>
          <p className="text-slate-700 text-base">
            Une question sur les projets, les partenariats, la JE-GE ou le recrutement ? Écrivez-nous.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-white border border-slate-200 p-8 space-y-6 shadow-sm">
              <h3 className="text-2xl font-display font-bold text-slate-900 border-b border-slate-200 pb-4">
                Coordonnées Institutionnelles
              </h3>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-ige-greenSoft border border-ige-bronze/40 flex items-center justify-center text-ige-greenDark shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold text-sm">Siège Social & Laboratoires</strong>
                    <span className="text-slate-600">École Polytechnique d’Abomey-Calavi (EPAC), Université d’Abomey-Calavi, Bénin.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-ige-violetSoft border border-ige-violet flex items-center justify-center text-ige-violetDark shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold text-sm">Adresse E-mail Officielle</strong>
                    <span className="text-slate-600 font-mono text-xs">innovationengenieelectriqueami@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold text-sm">Partenariats & Sponsoring JE-GE</strong>
                    <span className="text-slate-600">Pour les demandes de stands, interventions ou soutien RSE/marketing.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
              <h4 className="text-sm font-display font-bold text-slate-900">Réseaux Sociaux Officiels</h4>
              <p className="text-xs text-slate-500">
                Suivez toute l'actualité des projets, des événements et des compétitions sur nos pages officielles.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a
                  href="https://www.linkedin.com/company/amical-ige-epac/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-ige-violet hover:text-ige-violet hover:bg-ige-violetSoft/50 transition-all"
                >
                  <Linkedin className="w-4 h-4 text-ige-violet" />
                  <span>LinkedIn IGE EPAC</span>
                </a>
                <a
                  href="https://www.facebook.com/innovactiongeepac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-ige-green hover:text-ige-green hover:bg-ige-greenSoft/50 transition-all"
                >
                  <Facebook className="w-4 h-4 text-ige-green" />
                  <span>Facebook IGE EPAC</span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-2 shadow-sm">
              <div className="text-xs font-mono text-ige-green uppercase font-bold">Réponse sous 24h à 48h</div>
              <p className="text-xs text-slate-600">
                Les messages sont directement acheminés au bureau exécutif et aux responsables des clubs.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            {sent ? (
              <div className="rounded-3xl bg-white border border-ige-greenSoft0 p-8 sm:p-12 text-center space-y-6 shadow-md">
                <div className="w-16 h-16 rounded-full bg-ige-greenSoft border border-ige-green text-ige-greenDark mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900">Message Envoyé !</h3>
                <p className="text-slate-700 text-sm max-w-md mx-auto">
                  Merci pour votre message. L'équipe IGE prendra contact avec vous rapidement.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'Demande générale', message: '' });
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-ige-green transition-all shadow-sm"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-md space-y-6">
                <h3 className="text-2xl font-display font-bold text-slate-900 border-b border-slate-200 pb-4">
                  Formulaire de Contact
                </h3>

                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Nom & Prénom *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Alain HOUENOU"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Adresse E-mail *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alain@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-green"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Téléphone (Optionnel)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+229 97 00 00 00"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Objet de la Demande</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-green"
                      >
                        <option value="Demande générale">Demande d’information générale</option>
                        <option value="Sponsoring & Partenariat">Sponsoring / Partenariat JE-GE</option>
                        <option value="Projets & Prototypage">Demande sur un projet / prototype</option>
                        <option value="Adhésion Club">Rejoindre un club IGE</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Votre Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Expliquez brièvement votre demande..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-ige-green resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-ige-green hover:bg-ige-greenDark text-white font-display font-bold text-sm tracking-wider uppercase shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Envoi en cours...' : 'Envoyer mon Message'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
