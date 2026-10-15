/**
 * Utilitaires d'authentification JWT côte client
 */

const TOKEN_KEY = 'ige_admin_token';

/**
 * Sauvegarde le token dans localStorage
 */
export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Recupere le token depuis localStorage
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Supprime le token de localStorage
 */
export function clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Verifie si l'utilisateur est authentifie
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Recupere les headers d'authentification pour les requetes API
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
}
