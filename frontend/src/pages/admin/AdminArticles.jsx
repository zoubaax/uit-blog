import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import articleService from '../../services/articleService';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Calendar, 
  User, 
  FileText, 
  Eye,
  Search,
  Filter,
  Tag,
  TrendingUp
} from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, recent, oldest, popular
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const res = await articleService.getAll({ limit: 100 });
      setArticles(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      try {
        await articleService.delete(id);
        setArticles(articles.filter(a => a.id !== id));
      } catch (error) {
        alert('Failed to delete article');
      }
    }
  };

  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)));

  // Filter and search articles
  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = 
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        categoryFilter === 'all' || 
        article.category?.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (filter === 'recent') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (filter === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (filter === 'popular') {
        return (b.views || 0) - (a.views || 0);
      }
      return 0;
    });

  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

  if (loading) {
    return <SectionLoader message="Loading articles..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-500 mt-1">
            {articles.length} article{articles.length !== 1 ? 's' : ''} published across UIT Blog
          </p>
        </div>
        <NavLink
          to="/dashboard/articles/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Article
        </NavLink>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="md:col-span-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">Default Sort</option>
              <option value="recent">Most Recent</option>
              <option value="popular">Most Views</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No articles found</h3>
          <p className="text-gray-500 text-sm mb-6">
            {searchTerm || categoryFilter !== 'all' ? 'No articles match your query or category filters' : 'Start by publishing your first article'}
          </p>
          <NavLink
            to="/dashboard/articles/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Article
          </NavLink>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div 
                key={article.id} 
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col"
              >
                {/* Article Image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-blue-700 text-[10px] font-bold uppercase rounded-md shadow-sm">
                    {article.category || 'Technology'}
                  </span>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/dashboard/articles/edit/${article.id}`)}
                      className="p-2 bg-white/90 backdrop-blur text-gray-700 rounded-lg shadow-sm hover:bg-white hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 bg-white/90 backdrop-blur text-red-600 rounded-lg shadow-sm hover:bg-white hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  {/* Meta Information */}
                  <div className="space-y-2 mb-4 mt-auto text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500 font-medium">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        {article.views || 0} views
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{article.author_name || 'Admin'}</span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Published
                    </span>
                    <button
                      onClick={() => navigate(`/articles/${article.id}`)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Showing {filteredArticles.length} of {articles.length} articles
          </div>
        </>
      )}

      {/* Quick Stats */}
      {articles.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center bg-white/60 backdrop-blur rounded-xl p-4 border border-blue-100/50">
              <div className="text-2xl font-black text-gray-900">{articles.length}</div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mt-1">Total Articles</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur rounded-xl p-4 border border-blue-100/50">
              <div className="text-2xl font-black text-blue-600 flex items-center justify-center gap-1.5">
                <TrendingUp className="w-5 h-5" />
                {totalViews}
              </div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mt-1">Total Reader Views</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur rounded-xl p-4 border border-blue-100/50">
              <div className="text-2xl font-black text-purple-600">
                {categories.length}
              </div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mt-1">Active Categories</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;