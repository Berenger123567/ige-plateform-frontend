'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, FileText, Star } from 'lucide-react';
import { api } from '@/lib/api';
import FileUpload from '@/components/admin/FileUpload';
import ConfirmModal from '@/components/admin/ConfirmModal';

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
  status: string;
  featured: boolean;
  views: number;
  publishedAt?: string;
  createdAt: string;
};

const CATEGORIES = ['Actualité', 'Événement', 'Projet', 'Réussite', 'Partenariat', 'Technique'];
const STATUS = ['BROUILLON', 'PUBLIÉ', 'ARCHIVÉ'];

export default function BlogAdmin() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'Actualité',
    tags: '',
    author: 'IGE',
    status: 'BROUILLON',
    featured: false,
    publishedAt: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; articleId: string | null }>({
    show: false,
    articleId: null,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/articles');
      setArticles(res.data);
    } catch (err) {
      console.error('Erreur chargement articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      // Si on publie l'article et qu'il n'a pas de date de publication, utiliser maintenant
      if (payload.status === 'PUBLIÉ' && !payload.publishedAt) {
        payload.publishedAt = new Date().toISOString();
      }
      
      if (editingArticle) {
        await api.put(`/admin/articles/${editingArticle.id}`, payload);
      } else {
        await api.post('/admin/articles', payload);
      }
      await fetchArticles();
      closeModal();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur');
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      coverImage: article.coverImage || '',
      category: article.category,
      tags: article.tags || '',
      author: article.author,
      status: article.status,
      featured: article.featured,
      publishedAt: article.publishedAt || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/articles/${id}`);
      await fetchArticles();
      setDeleteConfirm({ show: false, articleId: null });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur suppression');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingArticle(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      category: 'Actualité',
      tags: '',
      author: 'IGE',
      status: 'BROUILLON',
      featured: false,
      publishedAt: '',
    });
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PUBLIÉ: 'bg-ige-greenSoft text-ige-greenDark',
      BROUILLON: 'bg-yellow-100 text-yellow-800',
      ARCHIVÉ: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors['BROUILLON'];
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-ige-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog / Actualités</h1>
          <p className="text-gray-600 mt-1">Gérez les articles et actualités de l'IGE</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ige-green text-white rounded-lg hover:bg-ige-greenDark transition"
        >
          <Plus className="w-4 h-4" /> Nouvel Article
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-ige-green">
          <div className="text-sm text-gray-600">Total Articles</div>
          <div className="text-2xl font-bold text-gray-900">{articles.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-ige-green">
          <div className="text-sm text-gray-600">Publiés</div>
          <div className="text-2xl font-bold text-gray-900">
            {articles.filter((a) => a.status === 'PUBLIÉ').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-600">
          <div className="text-sm text-gray-600">Brouillons</div>
          <div className="text-2xl font-bold text-gray-900">
            {articles.filter((a) => a.status === 'BROUILLON').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-600">
          <div className="text-sm text-gray-600">Vues Totales</div>
          <div className="text-2xl font-bold text-gray-900">
            {articles.reduce((sum, a) => sum + a.views, 0)}
          </div>
        </div>
      </div>

      {/* Liste des articles */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Article</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vues</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Publication</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {article.coverImage ? (
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {article.title}
                        {article.featured && (
                          <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded"><Star className="w-3 h-3" /> À la une</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1">{article.excerpt}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-ige-greenSoft text-ige-greenDark">
                    {article.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(article.status)}`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 flex items-center gap-1"><Eye className="w-4 h-4" /> {article.views}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(article.publishedAt)}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(article)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Edit className="w-3 h-3" /> Modifier
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ show: true, articleId: article.id })}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
                  >
                    <Trash2 className="w-3 h-3" /> Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {articles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun article. Cliquez sur "Nouvel Article" pour commencer.
          </div>
        )}
      </div>

      {/* Modal d'édition/création */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-xl font-bold">
                {editingArticle ? 'Modifier l\'Article' : 'Nouvel Article'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  placeholder="Ex: L'IGE lance sa nouvelle plateforme..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extrait (résumé) *</label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  placeholder="Courte description affichée dans la liste..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu *</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent font-mono text-sm"
                  placeholder="Contenu complet de l'article (Markdown supporté)..."
                />
                <p className="text-xs text-gray-500 mt-1">Vous pouvez utiliser du Markdown pour la mise en forme</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image de couverture</label>
                <FileUpload
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  value={formData.coverImage}
                />
                {formData.coverImage && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="relative h-24 w-32">
                      <Image 
                        src={formData.coverImage} 
                        alt="Preview" 
                        fill
                        className="object-cover rounded"
                        sizes="128px"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: '' })}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Retirer
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                    placeholder="innovation, hackathon, ..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Séparez par des virgules</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ige-greenSoft0 focus:border-transparent"
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-ige-green border-gray-300 rounded focus:ring-ige-greenSoft0"
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-1"><Star className="w-3 h-3" /> Mettre à la une (featured)</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-ige-green text-white rounded-lg hover:bg-ige-greenDark transition"
                >
                  {editingArticle ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        title="Supprimer cet article ?"
        message="Cette action est irréversible. L'article sera définitivement supprimé."
        onConfirm={() => deleteConfirm.articleId && handleDelete(deleteConfirm.articleId)}
        onCancel={() => setDeleteConfirm({ show: false, articleId: null })}
      />
    </div>
  );
}
