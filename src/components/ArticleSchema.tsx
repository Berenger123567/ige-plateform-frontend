type ArticleSchemaProps = {
  title: string;
  description: string;
  author: string;
  publishedAt?: string;
  modifiedAt?: string;
  image?: string;
  url: string;
};

export default function ArticleSchema({
  title,
  description,
  author,
  publishedAt,
  modifiedAt,
  image,
  url,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'IGE - Innovation en Génie Électrique',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ige-epac.bj/logo-ige-white.png',
      },
    },
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    image: image || 'https://ige-epac.bj/logo-ige-white.png',
    url: url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
