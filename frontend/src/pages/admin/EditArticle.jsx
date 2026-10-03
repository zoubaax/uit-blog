import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import articleService from '../../services/articleService';
import ImageUpload from '../../components/ImageUpload';
import { 
  Save, 
  ArrowLeft, 
  Loader2, 
  Eye, 
  Edit3,
  FileText,
  Clock,
  Layout,
  Tag
} from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';

const CATEGORY_PRESETS = [
    'AI & Machine Learning',
    'Software Engineering',
    'Cloud & DevOps',
    'Cybersecurity',
    'Tutorials',
    'Campus & Community'
];

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    content: '',
    image_url: ''
  });
  const [activeTab, setActiveTab] = useState('write');
  const [customCategory, setCustomCategory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await articleService.getById(id, true); // skip_view = true
        const article = res.data;
        const cat = article.category || 'Technology';
        setFormData({
          title: article.title || '',
          category: cat,
          content: article.content || '',
          image_url: article.image_url || ''
        });
        if (!CATEGORY_PRESETS.includes(cat) && cat !== 'Technology') {
          setCustomCategory(true);
        }
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

  const wordCount = useMemo(() => {
    return formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;
  }, [formData.content]);

  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
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
      alert(`Failed to update article: ${error}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SectionLoader message="Loading article..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/articles')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
            title="Back to articles"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Article</h1>
            <p className="text-sm text-gray-500">Update article content, metadata, and visuals</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            {wordCount} words
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            {readTime} min read
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 sm:p-10 rounded-[32px] shadow-xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <div className="space-y-6">
          {/* Header Image */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
              <Layout className="w-4 h-4" /> Header Image
            </div>
            <ImageUpload
              initialImage={formData.image_url}
              onImageUpload={(url) => setFormData(p => ({ ...p, image_url: url }))}
            />
          </div>

          {/* Title & Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-2">
              <label className="block text-sm font-bold text-gray-700 pl-1">Article Title</label>
              <input
                type="text"
                required
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg font-bold placeholder:text-gray-300"
                placeholder="Article title"
                value={formData.title}
                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
              />
              {errors.title && <p className="text-xs text-red-500 pl-1">{errors.title}</p>}
            </div>

            <div className="md:col-span-4 space-y-2">
              <label className="flex items-center justify-between text-sm font-bold text-gray-700 pl-1">
                <span>Category</span>
                <button
                  type="button"
                  onClick={() => setCustomCategory(!customCategory)}
                  className="text-xs text-blue-600 hover:underline font-normal"
                >
                  {customCategory ? 'Choose Preset' : '+ Custom'}
                </button>
              </label>

              {customCategory ? (
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-semibold"
                  placeholder="Enter custom category"
                  value={formData.category}
                  onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                />
              ) : (
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-semibold bg-white cursor-pointer"
                >
                  <option value="Technology">Technology</option>
                  {CATEGORY_PRESETS.map((preset) => (
                    <option key={preset} value={preset}>{preset}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Content with Write / Preview Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <label className="block text-sm font-bold text-gray-700">Article Content (Markdown supported)</label>
              
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'write'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'preview'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
              </div>
            </div>

            {activeTab === 'write' ? (
              <textarea
                required
                rows="16"
                className="w-full px-6 py-5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono text-sm leading-relaxed text-gray-800 placeholder:text-gray-300 resize-y"
                placeholder="Write your article here..."
                value={formData.content}
                onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
              />
            ) : (
              <div className="w-full min-h-[380px] p-6 rounded-2xl border border-gray-200 bg-gray-50/50 overflow-y-auto max-h-[500px]">
                {formData.content.trim() ? (
                  <div className="prose max-w-none text-slate-800">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Content Preview</p>
                    <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {formData.content}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400 text-sm">
                    No content written yet.
                  </div>
                )}
              </div>
            )}
            {errors.content && <p className="text-xs text-red-500 pl-1">{errors.content}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-blue-500/10 disabled:opacity-70 text-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;