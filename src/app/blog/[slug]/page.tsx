import type { Metadata } from 'next';
import ArticleDetailClient from '@/components/blog/ArticleDetailClient';

type Article = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  tags?: string;
  author: string;
  publishedAt?: string;
};

// Métadonnées dynamiques pour SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/articles/slug/${params.slug}`);
    const article: Article = await res.json();

    return {
      title: `${article.title} | IGE-EPAC`,
      description: article.excerpt,
      keywords: article.tags ? article.tags.split(',').map((t: string) => t.trim()) : [],
      authors: [{ name: article.author }],
      openGraph: {
        type: 'article',
        locale: 'fr_FR',
        url: `https://ige-epac.bj/blog/${article.slug}`,
        title: article.title,
        description: article.excerpt,
        siteName: 'IGE - Innovation en Génie Électrique',
        publishedTime: article.publishedAt,
        authors: [article.author],
        images: article.coverImage
          ? [
              {
                url: article.coverImage,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        creator: '@IGE_EPAC',
        images: article.coverImage ? [article.coverImage] : undefined,
      },
    };
  } catch (error) {
    return {
      title: 'Article | IGE-EPAC',
      description: "Article de blog de l'IGE",
    };
  }
}

export default function ArticleDetailPage() {
  return <ArticleDetailClient />;
}
