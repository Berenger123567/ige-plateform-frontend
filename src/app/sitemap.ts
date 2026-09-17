import { MetadataRoute } from 'next';

const BASE_URL = 'https://ige-epac.bj';

const FETCH_TIMEOUT = 3000;

async function fetchJson(url: string) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT) });
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchData() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    const [articles, projets, evenements, clubs, partners] = await Promise.all([
      fetchJson(`${apiUrl}/articles`),
      fetchJson(`${apiUrl}/projets`),
      fetchJson(`${apiUrl}/evenements`),
      fetchJson(`${apiUrl}/clubs`),
      fetchJson(`${apiUrl}/partners`),
    ]);

    return { articles, projets, evenements, clubs, partners };
  } catch (error) {
    console.error('Error fetching data for sitemap:', error);
    return { articles: [], projets: [], evenements: [], clubs: [], partners: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { articles, projets, evenements, clubs } = await fetchData();

  // Pages statiques
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/ige`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/bureau`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projets`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/evenements`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/partenaires`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/epreuves`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/je-ge`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // Pages dynamiques - Articles
  const articlePages = articles.map((article: any) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.createdAt),
    changeFrequency: 'monthly' as const,
    priority: article.featured ? 0.9 : 0.7,
  }));

  // Pages dynamiques - Projets
  const projetPages = projets.map((projet: any) => ({
    url: `${BASE_URL}/projets/${projet.id}`,
    lastModified: new Date(projet.updatedAt || projet.createdAt),
    changeFrequency: 'monthly' as const,
    priority: projet.featured ? 0.8 : 0.6,
  }));

  // Pages dynamiques - Événements
  const evenementPages = evenements.map((event: any) => ({
    url: `${BASE_URL}/evenements/${event.id}`,
    lastModified: new Date(event.updatedAt || event.createdAt),
    changeFrequency: 'weekly' as const,
    priority: event.featured ? 0.8 : 0.6,
  }));

  // Pages dynamiques - Clubs
  const clubPages = clubs.map((club: any) => ({
    url: `${BASE_URL}/clubs/${club.slug}`,
    lastModified: new Date(club.updatedAt || club.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...articlePages,
    ...projetPages,
    ...evenementPages,
    ...clubPages,
  ];
}
