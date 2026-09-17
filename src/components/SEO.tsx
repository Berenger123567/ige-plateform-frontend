import Head from 'next/head';

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  schema?: Record<string, any>;
};

const DEFAULT_SEO = {
  siteName: 'IGE - Innovation en Génie Électrique',
  title: 'IGE - Innovation en Génie Électrique | EPAC, Bénin',
  description: 'Association des étudiants en Génie Électrique de l\'EPAC. Innovation, projets techniques, événements et formation au Bénin.',
  image: '/logo-ige-white.png',
  url: 'https://ige-epac.bj',
  twitterHandle: '@IGE_EPAC',
};

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  article,
  schema,
}: SEOProps) {
  const seo = {
    title: title ? `${title} | IGE-EPAC` : DEFAULT_SEO.title,
    description: description || DEFAULT_SEO.description,
    image: image || `${DEFAULT_SEO.url}${DEFAULT_SEO.image}`,
    url: url || DEFAULT_SEO.url,
  };

  // Schema.org par défaut pour l'organisation
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: DEFAULT_SEO.siteName,
    url: DEFAULT_SEO.url,
    logo: `${DEFAULT_SEO.url}${DEFAULT_SEO.image}`,
    description: DEFAULT_SEO.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BJ',
      addressLocality: 'Cotonou',
    },
    sameAs: [
      'https://facebook.com/IGE.EPAC',
      'https://twitter.com/IGE_EPAC',
      'https://linkedin.com/company/ige-epac',
    ],
  };

  const schemaData = schema || defaultSchema;

  return (
    <Head>
      {/* Balises meta standard */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/icon.svg" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={DEFAULT_SEO.siteName} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:locale" content="fr_FR" />

      {/* Article specific */}
      {type === 'article' && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags && article.tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={DEFAULT_SEO.twitterHandle} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* Balises supplémentaires */}
      <meta name="keywords" content="génie électrique, innovation, EPAC, Bénin, étudiants, projets, technologie, électronique, automatique, énergie" />
      <meta name="author" content="IGE - Innovation en Génie Électrique" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={seo.url} />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </Head>
  );
}

// Hook pour générer facilement les métadonnées
export function generateMetadata({
  title,
  description,
  image,
  path = '',
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}) {
  return {
    title: title ? `${title} | IGE-EPAC` : DEFAULT_SEO.title,
    description: description || DEFAULT_SEO.description,
    openGraph: {
      title: title ? `${title} | IGE-EPAC` : DEFAULT_SEO.title,
      description: description || DEFAULT_SEO.description,
      url: `${DEFAULT_SEO.url}${path}`,
      siteName: DEFAULT_SEO.siteName,
      images: [
        {
          url: image || `${DEFAULT_SEO.url}${DEFAULT_SEO.image}`,
          width: 1200,
          height: 630,
          alt: title || DEFAULT_SEO.siteName,
        },
      ],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | IGE-EPAC` : DEFAULT_SEO.title,
      description: description || DEFAULT_SEO.description,
      images: [image || `${DEFAULT_SEO.url}${DEFAULT_SEO.image}`],
      creator: DEFAULT_SEO.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
