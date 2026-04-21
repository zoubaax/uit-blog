import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import articleService from '../../services/articleService';
import ImageUpload from '../../components/ImageUpload';
import { 
  Save, 
  ArrowLeft, 
  Loader2, 
  Eye, 
  Upload,
  Type,
  FileText,
  AlertCircle
} from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await articleService.getById(id);
        const article = res.data;
        setFormData({
          title: article.title || '',
          content: article.content || '',
          image_url: article.image_url || ''
        });
      } catch (error) {
        console.error('Error fetching article:', error);
        alert('Failed to fetch article data');
        navigate('/dashboard/articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.content.length < 100) newErrors.content = 'Content should be at least 100 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      await articleService.update(id, formData);
      navigate('/dashboard/articles');
    } catch (error) {
      console.error('Update Error:', error);
      alert('Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SectionLoader message="Loading article" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/articles')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Articles</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <a
            href={`/articles/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            <Eye className="w-4 h-4" />
            Preview Article
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Article</h1>
          <p className="text-gray-500 mt-2">Update your article content and details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Featured Image Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Featured Image</h2>
            </div>
            <ImageUpload
              initialImage={formData.image_url}
              onImageUpload={(url) => setFormData(p => ({ ...p, image_url: url }))}
            />
            <p className="text-sm text-gray-500 mt-4">
              Add a compelling image to attract readers. Recommended size: 1200×630px
            </p>
          </div>

          {/* Article Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Type className="w-4 h-4" />
                Article Title
              </label>
              <input
                type="text"
                required
                className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter article title..."
                value={formData.title}
                onChange={(e) => {
                  setFormData(p => ({ ...p, title: e.target.value }));
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
              />
              {errors.title && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </div>
              )}
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4" />
                  Article Content
                </label>
                <div className="text-sm text-gray-500">
                  {formData.content.length} characters • {Math.ceil(formData.content.length / 5)} words
                </div>
              </div>
              <textarea
                required
                rows="18"
                className={`w-full px-4 py-3 rounded-lg border ${errors.content ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono text-sm`}
                placeholder="Write your article content here... Markdown is supported."
                value={formData.content}
                onChange={(e) => {
                  setFormData(p => ({ ...p, content: e.target.value }));
                  if (errors.content) setErrors({ ...errors, content: '' });
                }}
              />
              {errors.content && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.content}
                </div>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>✨ Markdown supported</span>
                <span>•</span>
                <span>📝 Autosave enabled</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard/articles')}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
              >
                Reset Changes
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Article
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-4">Article Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Word Count</div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.ceil(formData.content.length / 5)}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Reading Time</div>
              <div className="text-2xl font-bold text-gray-900">
                ~{Math.ceil(formData.content.length / 5 / 200)} min
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Image Status</div>
              <div className="text-2xl font-bold text-gray-900">
                {formData.image_url ? '✅ Set' : '⚠️ Missing'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditArticle;