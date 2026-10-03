import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import articleService from '../../services/articleService';
import eventService from '../../services/eventService';
import ImageUpload from '../../components/ImageUpload';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { 
    Save, 
    ArrowLeft, 
    Loader2, 
    Layout, 
    Tag, 
    Eye, 
    Edit3, 
    Clock, 
    FileText, 
    Calendar, 
    Globe, 
    Trophy, 
    Camera 
} from 'lucide-react';

const CATEGORY_PRESETS = [
    'Hackathons & Competitions',
    'Event Recaps & Highlights',
    'Club Journey & Milestones',
    'AI & Machine Learning',
    'Software Engineering',
    'Cloud & DevOps',
    'Cybersecurity',
    'Tutorials',
    'Campus & Community'
];

const CreateArticle = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        category: 'Hackathons & Competitions',
        content: '',
        image_url: '',
        event_id: '',
        project_url: ''
    });
    const [events, setEvents] = useState([]);
    const [activeTab, setActiveTab] = useState('write');
    const [customCategory, setCustomCategory] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch existing events so author can link an event recap
    useEffect(() => {
        const loadEvents = async () => {
            try {
                const res = await eventService.getAll();
                setEvents(res.data || []);
            } catch (err) {
                console.warn('Could not load events list for linking:', err);
            }
        };
        loadEvents();
    }, []);

    // Calculated metrics
    const wordCount = useMemo(() => {
        return formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;
    }, [formData.content]);

    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await articleService.create(formData);
            navigate('/dashboard/articles');
        } catch (error) {
            console.error(error);
            alert('Failed to create article');
        } finally {
            setLoading(false);
        }
    };

    const isRecap = formData.category.includes('Recap');
    const isHackathon = formData.category.includes('Hackathon');

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/dashboard/articles')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                        title="Back to articles"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Write Story or Article</h1>
                        <p className="text-sm text-gray-500">Share hackathons, event recaps, or technical tutorials</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
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
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

                <div className="space-y-6">
                    {/* Header Image */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                            <Layout className="w-4 h-4" /> Header Image / Team Photo
                        </div>
                        <ImageUpload
                            onImageUpload={(url) => setFormData(p => ({ ...p, image_url: url }))}
                        />
                    </div>

                    {/* Title & Category Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Title */}
                        <div className="md:col-span-7 space-y-2">
                            <label className="block text-sm font-bold text-gray-700 pl-1">Article Title</label>
                            <input
                                type="text"
                                required
                                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-base sm:text-lg font-bold placeholder:text-gray-300"
                                placeholder={isHackathon ? "e.g. How Our Team Built AI-Doctor at Hackathon X" : isRecap ? "e.g. Recap & Highlights: Digital Entrepreneurship Day" : "Article title..."}
                                value={formData.title}
                                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                            />
                        </div>

                        {/* Category */}
                        <div className="md:col-span-5 space-y-2">
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
                                    {CATEGORY_PRESETS.map((preset) => (
                                        <option key={preset} value={preset}>{preset}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Event Linking & Project Demo Link Section */}
                    <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Link to Event Dropdown */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                    Link to Club Event (Optional)
                                </label>
                                <select
                                    value={formData.event_id || ''}
                                    onChange={(e) => setFormData(p => ({ ...p, event_id: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                >
                                    <option value="">No linked event (Stand-alone post)</option>
                                    {events.map((ev) => (
                                        <option key={ev.id} value={ev.id}>
                                            {ev.title} ({new Date(ev.date).toLocaleDateString()})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-[11px] text-slate-500">
                                    Linking an event will automatically place this recap on that event&apos;s page!
                                </p>
                            </div>

                            {/* Project / Demo Link */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                                    Project / Demo URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={formData.project_url || ''}
                                    onChange={(e) => setFormData(p => ({ ...p, project_url: e.target.value }))}
                                    placeholder="https://github.com/... or https://devpost.com/..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <p className="text-[11px] text-slate-500">
                                    For hackathons or projects, provide a live demo or GitHub repository link.
                                </p>
                            </div>
                        </div>

                        {isRecap && (
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                                <Camera className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span><strong>Event Recap Mode:</strong> Include workshop photos, presentation highlights, and attendee feedback in your post.</span>
                            </div>
                        )}

                        {isHackathon && (
                            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                                <Trophy className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                <span><strong>Hackathon Mode:</strong> Highlight your team members, the problem tackled, the tech stack, and your awards!</span>
                            </div>
                        )}
                    </div>

                    {/* Content Section with Edit / Preview Tabs */}
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
                                placeholder="# Heading 1&#10;## Heading 2&#10;&#10;Write your story or recap here using markdown...&#10;- Embed photos using ![Photo description](url)&#10;- Add team members and lessons learned&#10;- Share code or demo links"
                                value={formData.content}
                                onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                            />
                        ) : (
                            <div className="w-full min-h-[380px] p-6 sm:p-8 rounded-2xl border border-gray-200 bg-white overflow-y-auto max-h-[550px] shadow-sm">
                                <div className="flex items-center justify-between pb-3 mb-5 border-b border-gray-100">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Live Markdown Preview</span>
                                    <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">Rendered</span>
                                </div>
                                <MarkdownRenderer content={formData.content} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-blue-500/10 disabled:opacity-70 text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Publishing...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Publish Story</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateArticle;
