import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ige-epac.bj';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/je-ge/ticket', '/je-ge/validation'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
