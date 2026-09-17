'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, QrCode, Camera, Loader2, RotateCcw } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/utils/auth';

export default function AdminCheckinPage() {
  const scannerRef = useRef<any>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; participant?: any } | null>(null);
  const [loading, setLoading] = useState(false);

  const startScanner = async () => {
    if (typeof window === 'undefined') return;
    const { Html5Qrcode } = await import('html5-qrcode');
    const qr = new Html5Qrcode('qr-reader');
    scannerRef.current = qr;
    setScanning(true);
    setResult(null);

    try {
      await qr.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText: string) => {
          await qr.stop();
          setScanning(false);
          await processToken(decodedText);
        },
        undefined
      );
    } catch (err) {
      setScanning(false);
      setResult({ success: false, message: "Impossible d'accéder à la caméra." });
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch (e) { /* ignore */ }
    }
    setScanning(false);
  };

  const processToken = async (raw: string) => {
    setLoading(true);
    try {
      let token = raw;
      try {
        const parsed = JSON.parse(raw);
        token = parsed.token || raw;
      } catch (_) { /* raw token */ }

      const res = await fetch(`${API_BASE_URL}/je-ge/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: 'Participant enregistré avec succès !', participant: data.participant });
      } else if (res.status === 409) {
        setResult({ success: false, message: 'Déjà enregistré !', participant: data.participant });
      } else {
        setResult({ success: false, message: data.error || 'Participant non trouvé.' });
      }
    } catch (e) {
      setResult({ success: false, message: 'Erreur de connexion au serveur.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => () => { stopScanner(); }, []);

  const reset = () => { setResult(null); };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-slate-900">Scan QR Code — Check-in</h1>
        <p className="text-sm text-slate-500">Pointez la caméra sur le QR code d'un participant pour enregistrer sa présence.</p>
      </div>

      {/* Scanner area */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="relative bg-slate-900 aspect-square flex items-center justify-center">
          <div id="qr-reader" className="w-full h-full" />
          {!scanning && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <QrCode className="w-16 h-16 text-slate-600" />
              <p className="text-slate-400 text-sm">Caméra inactive</p>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
              <p className="text-white text-sm">Vérification...</p>
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className={`p-5 ${result.success ? 'bg-ige-greenSoft border-t border-ige-greenSoft' : 'bg-red-50 border-t border-red-200'}`}>
            <div className="flex items-start gap-3">
              {result.success
                ? <CheckCircle2 className="w-6 h-6 text-ige-greenDark shrink-0 mt-0.5" />
                : <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              }
              <div className="flex-1">
                <p className={`font-bold text-sm ${result.success ? 'text-ige-greenDark' : 'text-red-800'}`}>{result.message}</p>
                {result.participant && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-slate-700 font-semibold">{result.participant.firstName} {result.participant.lastName}</p>
                    <p className="text-xs text-slate-500">{result.participant.email}</p>
                    <p className="text-xs text-slate-500">{result.participant.profile} · {result.participant.institution}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="p-4 flex gap-3 bg-slate-50 border-t border-slate-200">
          {!scanning ? (
            <button
              onClick={startScanner}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-ige-violet text-white font-bold text-sm rounded-xl hover:bg-ige-violetDark transition-all"
            >
              <Camera className="w-4 h-4" /> Démarrer la caméra
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white font-bold text-sm rounded-xl hover:bg-red-600 transition-all"
            >
              <XCircle className="w-4 h-4" /> Arrêter
            </button>
          )}
          {result && (
            <button onClick={reset} className="px-4 py-3 bg-white border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Manual token */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <p className="text-xs font-bold text-slate-700 mb-3">Saisie manuelle du token QR</p>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const token = fd.get('token') as string;
          if (token) await processToken(token);
          (e.target as HTMLFormElement).reset();
        }} className="flex gap-2">
          <input name="token" type="text" placeholder="Token UUID du participant..." className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-ige-violet" />
          <button type="submit" className="px-4 py-2.5 bg-ige-green text-white text-sm font-bold rounded-lg hover:bg-ige-greenDark transition-all">
            Vérifier
          </button>
        </form>
      </div>
    </div>
  );
}
