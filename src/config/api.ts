/**
 * Configuration centralisée de l'API
 * Utilise la variable d'environnement NEXT_PUBLIC_API_URL
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Helper pour construire une URL complète de l'API
 */
export function getApiUrl(endpoint: string): string {
  // S'assurer que l'endpoint commence par un slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

/**
 * Configuration des requêtes fetch par défaut
 */
export const defaultFetchOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};
