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
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, recent, oldest
  const navigate = useNavigate();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const res = await articleService.getAll();
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

  // Filter and search articles
  const filteredArticles = articles
    .filter(article => 
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === 'recent') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (filter === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return 0;
    });

  if (loading) {
    return <SectionLoader message="Loading articles" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-500 mt-1">
            {articles.length} article{articles.length !== 1 ? 's' : ''} published
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

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Articles</option>
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'No articles match your search' : 'Start by creating your first article'}
          </p>
          <NavLink
            to="/dashboard/articles/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Article
          </NavLink>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div 
                key={article.id} 
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col"
              >
                {/* Article Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/dashboard/articles/edit/${article.id}`)}
                      className="p-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 bg-white text-red-600 rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>

                  {/* Meta Information */}
                  <div className="space-y-3 mb-4 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>{article.author_name || 'Admin'}</span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>Published</span>
                    </div>
                    <button
                      onClick={() => navigate(`/articles/${article.id}`)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-500">
            Showing {filteredArticles.length} of {articles.length} articles
          </div>
        </>
      )}

      {/* Quick Stats */}
      {articles.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{articles.length}</div>
              <div className="text-sm text-gray-600">Total Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {articles.filter(a => new Date(a.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-gray-600">Last 30 Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {articles.filter(a => !a.image_url).length}
              </div>
              <div className="text-sm text-gray-600">Need Images</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;