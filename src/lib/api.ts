import axios from 'axios';
import { getToken } from '@/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token JWT à chaque requête
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

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token invalide ou expiré - rediriger vers la page de login
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
  const res = await api.get('/je-ge/active');
  return res.data;
};

export const registerJEGE = async (data: any) => {
  const res = await api.post('/je-ge/register', data);
  return res.data;
};

export const checkinJEGE = async (token: string) => {
  const res = await api.post('/je-ge/checkin', { token });
  return res.data;
};

export const getEvents = async () => {
  const res = await api.get('/evenements');
  return res.data;
};

export const subscribeNewsletter = async (email: string) => {
  const res = await api.post('/newsletter', { email });
  return res.data;
};

export const sendContactMessage = async (data: any) => {
  const res = await api.post('/contact', data);
  return res.data;
};
