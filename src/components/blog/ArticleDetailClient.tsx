'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Newspaper, PenLine, Eye, Inbox, Share2, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags?: string;
  author: string;
  views: number;
  publishedAt?: string;
  createdAt: string;
};

export default function ArticleDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (params.slug) {
      fetchArticle(params.slug as string);
    }
  }, [params.slug]);

  const fetchArticle = async (slug: string) => {
    try {
      const res = await api.get(`/articles/slug/${slug}`);
      setArticle(res.data);

      // Charger articles similaires
      const relatedRes = await api.get(`/articles?category=${res.data.category}&limit=3`);
      setRelatedArticles(relatedRes.data.filter((a: Article) => a.slug !== slug));
    } catch (err: any) {
      console.error('Erreur chargement article:', err);
      if (err.response?.status === 404) {
        router.push('/blog');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: article?.title || '',
      text: article?.excerpt || '',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-ige-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center">
              <Inbox className="w-8 h-8 text-slate-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article non trouvé</h2>
          <Link href="/blog" className="text-ige-green hover:underline">
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  const tags = article.tags ? article.tags.split(',').map((t) => t.trim()) : [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero avec image de couverture */}
      <div className="relative h-96 bg-slate-900 overflow-hidden">
        {article.coverImage ? (
          <>
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Newspaper className="w-24 h-24 text-white/20" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                {article.category}
              </span>
              <span className="text-white/90 text-sm">{formatDate(article.publishedAt)}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center gap-6 text-white/90 text-sm">
              <span className="flex items-center gap-1.5"><PenLine className="w-4 h-4" /> {article.author}</span>
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {article.views} vues</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu de l'article */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Excerpt */}
          <div className="bg-ige-greenSoft/60 border-l-4 border-ige-green p-6 rounded-r-lg mb-8">
            <p className="text-lg text-gray-700 italic">{article.excerpt}</p>
          </div>

          {/* Contenu principal */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
            <div className="prose prose-lg max-w-none">
              {article.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-ige-greenSoft hover:text-ige-greenDark transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 pt-8 border-t flex items-center justify-between">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 bg-ige-green text-white rounded-lg hover:bg-ige-greenDark transition-colors shadow-lg hover:shadow-xl"
              >
                <Share2 className="w-5 h-5" />
                Partager
              </button>

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-ige-green hover:text-ige-green transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour au blog
              </Link>
            </div>
          </div>

          {/* Articles similaires */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles similaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link key={related.id} href={`/blog/${related.slug}`}>
                    <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                      {related.coverImage ? (
                        <div className="h-32 overflow-hidden">
                          <img
                            src={related.coverImage}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-32 bg-slate-100 flex items-center justify-center">
                          <Newspaper className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 group-hover:text-ige-green transition-colors line-clamp-2 mb-2">
                          {related.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{related.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
