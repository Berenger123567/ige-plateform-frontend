'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Newspaper, User, Eye, Inbox } from 'lucide-react';
import { api } from '@/lib/api';

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags?: string;
  author: string;
  views: number;
  publishedAt?: string;
  featured: boolean;
};

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('Tous');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await api.get('/articles');
      const allArticles = res.data;
      
      // Trouver l'article à la une
      const featured = allArticles.find((a: Article) => a.featured);
      if (featured) {
        setFeaturedArticle(featured);
        setArticles(allArticles.filter((a: Article) => a.id !== featured.id));
      } else {
        setArticles(allArticles);
      }
    } catch (err) {
      console.error('Erreur chargement articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Tous', ...Array.from(new Set(articles.map((a) => a.category)))];

  const filteredArticles = filter === 'Tous'
    ? articles
    : articles.filter((a) => a.category === filter);

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-ige-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">Blog & Actualités</h1>
            <p className="text-lg text-slate-600">
              Suivez les dernières nouvelles et réussites de l'IGE
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Article à la une */}
        {featuredArticle && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-6 h-6 text-ige-green" />
              <h2 className="text-2xl font-display font-bold text-slate-900">À la une</h2>
            </div>
            <Link href={`/blog/${featuredArticle.slug}`}>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 cursor-pointer group">
                <div className="md:flex">
                  {featuredArticle.coverImage ? (
                    <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                      <img
                        src={featuredArticle.coverImage}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="md:w-1/2 h-64 md:h-auto bg-slate-100 border-b md:border-b-0 md:border-r border-slate-200 flex items-center justify-center">
                      <Newspaper className="w-20 h-20 text-slate-400" />
                    </div>
                  )}
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-ige-greenSoft text-ige-greenDark border border-ige-greenSoft text-sm font-semibold rounded-full">
                        {featuredArticle.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(featuredArticle.publishedAt)}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-ige-green transition-colors">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">{featuredArticle.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {featuredArticle.author}</span>
                        <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {featuredArticle.views} vues</span>
                      </div>
                      <span className="text-ige-green font-semibold group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                        Lire l'article
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                filter === cat
                  ? 'bg-ige-green text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-ige-greenSoft shadow'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille d'articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, idx) => (
            <ArticleCard key={article.id} article={article} index={idx} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                <Inbox className="w-8 h-8 text-slate-400" />
              </div>
            </div>
            <p className="text-xl text-slate-600">Aucun article dans cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/blog/${article.slug}`}>
      <div
        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {article.coverImage ? (
          <div className="h-48 overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-48 bg-slate-100 flex items-center justify-center">
            <Newspaper className="w-12 h-12 text-slate-400" />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-ige-greenSoft text-ige-greenDark border border-ige-greenSoft text-xs font-semibold rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-ige-green transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {article.author}</span>
            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {article.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
