'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ige_jege_ticket';
const UPDATE_EVENT = 'ige-jege-ticket-updated';

export type StoredJEGETicket = {
  token: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  savedAt: string;
};

export function getStoredJEGETicket(): StoredJEGETicket | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredJEGETicket;
    return parsed?.token ? parsed : null;
  } catch {
    return null;
  }
}

export function saveJEGETicket(ticket: Omit<StoredJEGETicket, 'savedAt'>) {
  if (typeof window === 'undefined') return;
  const payload: StoredJEGETicket = { ...ticket, savedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function clearJEGETicket() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function useJEGETicket() {
  const [ticket, setTicket] = useState<StoredJEGETicket | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setTicket(getStoredJEGETicket());
    sync();
    setReady(true);
    window.addEventListener(UPDATE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(UPDATE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return { ticket, hasTicket: Boolean(ticket), ready };
}
