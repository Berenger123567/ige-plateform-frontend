import axios from 'axios';
import { getToken } from '@/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token JWT à chaque requete
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gerer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token invalide ou expire - rediriger vers la page de login
      if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getClubs = async () => {
  const res = await api.get('/clubs');
  return res.data;
};

export const getClubBySlug = async (slug: string) => {
  const res = await api.get(`/clubs/${slug}`);
  return res.data;
};

export const getProjects = async (params?: { club?: string; status?: string; search?: string }) => {
  const res = await api.get('/projets', { params });
  return res.data;
};

export const getProjectById = async (id: string) => {
  const res = await api.get(`/projets/${id}`);
  return res.data;
};

export const getActiveJEGEEdition = async () => {
  const res = await api.get('/je-ge');
  return res.data;
};

export const getJEGEEditions = async () => {
  const res = await api.get('/je-ge/editions');
  return res.data;
};

export const getJEGEEdition = async (id: string) => {
  const res = await api.get(`/je-ge/editions/${id}`);
  return res.data;
};

export const registerJEGE = async (data: any) => {
  const res = await api.post('/je-ge/register', data);
  return res.data;
};

export type JEGEPass = {
  valid: boolean;
  status: 'VALID' | 'ALREADY_CHECKED_IN';
  participant: {
    firstName: string;
    lastName: string;
    registrationNumber: string;
    profile: string;
    institution?: string | null;
    checkedIn: boolean;
    checkedInAt?: string | null;
  };
  edition: {
    id: string;
    name: string;
    theme?: string | null;
    dateText: string;
    location: string;
    startDate?: string | null;
    endDate?: string | null;
    planningUrl?: string | null;
    planningPublished?: boolean;
  };
  qrCodeDataUrl: string;
  ticketUrl: string;
};

export const getJEGEPass = async (token: string): Promise<JEGEPass> => {
  const res = await api.get(`/je-ge/pass/${encodeURIComponent(token)}`);
  return res.data;
};

export const lookupJEGEPass = async (
  email: string,
  registrationNumber: string
): Promise<{ token: string; registrationNumber: string }> => {
  const res = await api.post('/je-ge/pass/lookup', { email, registrationNumber });
  return res.data;
};

export const checkinJEGE = async (code: string, checkedIn = true) => {
  const res = await api.post(`/admin/je-ge/checkin/${encodeURIComponent(code)}`, { checkedIn });
  return res.data;
};

export const getEvents = async (params?: Record<string, unknown>) => {
  const res = await api.get('/events', { params });
  return res.data;
};

export const getEventById = async (id: string) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export type NewsletterSignupPayload = {
  email: string;
  firstName?: string;
  source?: string;
  profile?: string;
  institution?: string;
  phone?: string;
  domainOfInterest?: string;
};

export const subscribeNewsletter = async (
  payload: string | NewsletterSignupPayload,
  source = 'SITE_WEB'
) => {
  const data = typeof payload === 'string' ? { email: payload, source } : { source, ...payload };
  const res = await api.post('/newsletter/subscribe', data);
  return res.data;
};

export const sendContactMessage = async (data: any) => {
  const res = await api.post('/contact', data);
  return res.data;
};

export const getBureauMembers = async (mandatId?: string) => {
  const url = mandatId ? `/bureau/mandat/${mandatId}` : '/bureau';
  const res = await api.get(url);
  return res.data;
};

export const getBureauMemberById = async (id: string) => {
  const res = await api.get(`/bureau/${id}`);
  return res.data;
};

