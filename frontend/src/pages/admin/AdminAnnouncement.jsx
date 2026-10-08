import { useState, useEffect } from 'react';
import { 
    Megaphone, Save, Loader2, Calendar, FileText, 
    Eye, Check, ExternalLink, X, Image as ImageIcon,
    AlertCircle, Link2, History, RotateCcw, Trash2, Clock
} from 'lucide-react';
import settingsService from '../../services/settingsService';
import eventService from '../../services/eventService';
import articleService from '../../services/articleService';
import ImageUpload from '../../components/ImageUpload';
import ConfirmModal from '../../components/ConfirmModal';
import usePageMeta from '../../hooks/usePageMeta';

const AdminAnnouncement = () => {
    usePageMeta({
        title: 'Manage Announcement',
        description: 'Configure website pop-up announcement from an event, article, or custom poster.'
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [events, setEvents] = useState([]);
    const [articles, setArticles] = useState([]);
    const [history, setHistory] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [announcement, setAnnouncement] = useState({
        is_active: false,
        type: 'event', // 'event' | 'article' | 'custom'
        target_id: '',
        title: '',
        poster_url: '',
        link_url: '',
        button_text: 'View Details'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [announcementRes, eventsRes, articlesRes] = await Promise.all([
                    settingsService.getAnnouncement(),
                    eventService.getAll(),
                    articleService.getAll({ limit: 50 })
                ]);

                const announcementData = announcementRes?.data?.data || announcementRes?.data;
                if (announcementData && typeof announcementData === 'object' && !Array.isArray(announcementData)) {
                    setAnnouncement(prev => ({
                        ...prev,
                        ...announcementData
                    }));
                }

                const historyList = announcementRes?.history || announcementRes?.data?.history || [];
                setHistory(Array.isArray(historyList) ? historyList : []);
                setEvents(eventsRes?.data || eventsRes || []);
                setArticles(articlesRes?.data || articlesRes || []);
            } catch (err) {
                console.error('Failed to load announcement settings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle selecting an Event
    const handleSelectEvent = (eventId) => {
        const selected = events.find(e => String(e.id) === String(eventId));
        if (selected) {
            setAnnouncement(prev => ({
                ...prev,
                target_id: selected.id,
                title: selected.title,
                poster_url: selected.cover_image_url || prev.poster_url,
                link_url: `/events/${selected.id}`,
                button_text: 'View Event & Register'
            }));
        } else {
            setAnnouncement(prev => ({ ...prev, target_id: '' }));
        }
    };

    // Handle selecting an Article
    const handleSelectArticle = (articleId) => {
        const selected = articles.find(a => String(a.id) === String(articleId));
        if (selected) {
            setAnnouncement(prev => ({
                ...prev,
                target_id: selected.id,
                title: selected.title,
                poster_url: selected.image_url || prev.poster_url,
                link_url: `/articles/${selected.slug || selected.id}`,
                button_text: 'Read Full Article'
            }));
        } else {
            setAnnouncement(prev => ({ ...prev, target_id: '' }));
        }
    };

    // Save announcement configuration
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveSuccess(false);

        try {
            const res = await settingsService.updateAnnouncement(announcement);
            const savedData = res?.data?.data || res?.data;
            if (savedData && typeof savedData === 'object' && !Array.isArray(savedData)) {
                setAnnouncement(prev => ({
                    ...prev,
                    ...savedData
                }));
            }
            const updatedHistory = res?.history || res?.data?.history;
            if (Array.isArray(updatedHistory)) {
                setHistory(updatedHistory);
            }
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 4000);
        } catch (err) {
            alert('Failed to save announcement: ' + (err?.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    // 1-Click Restore / Load past announcement into the editor
    const handleRestoreItem = (item) => {
        setAnnouncement({
            is_active: true,
            type: item.type || 'custom',
            target_id: item.target_id || '',
            title: item.title === 'Announcement' ? '' : (item.title || ''),
            poster_url: item.poster_url,
            link_url: item.link_url || '',
            button_text: item.button_text || 'View Details'
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Open delete confirmation modal
    const handleDeleteClick = (item, e) => {
        e.stopPropagation();
        setDeleteTarget(item);
    };

    // Execute delete after in-app modal confirmation
    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);

        try {
            const res = await settingsService.deleteAnnouncementHistory(deleteTarget.id);
            const updatedHistory = res?.history || res?.data?.history;
            setHistory(Array.isArray(updatedHistory) ? updatedHistory : history.filter(h => h.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            alert('Failed to delete history item: ' + (err?.response?.data?.message || err.message));
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-sm text-slate-500">Loading announcement configuration...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-6">
                <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcement Pop-up</h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        Display a featured modal poster when visitors land on your website. Use an Event, an Article, or a custom poster.
                    </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        announcement.is_active 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                        <span className={`w-2 h-2 rounded-full ${announcement.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        {announcement.is_active ? 'LIVE ON SITE' : 'INACTIVE'}
                    </span>
                </div>
            </div>

            {saveSuccess && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-sm animate-in fade-in">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Announcement settings have been successfully saved and updated across the site!</span>
                </div>
            )}

            {/* Main Configuration Grid */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Configuration Left Side */}
                <div className="lg:col-span-7 space-y-6">
                    {/* 1. Global Activation Toggle */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-gray-900 dark:text-white">
                                Activate Announcement Pop-up
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                When enabled, visitors see this modal with your poster upon opening the site.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={announcement.is_active}
                                onChange={(e) => setAnnouncement({ ...announcement, is_active: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {/* 2. Choose Source Type */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-4">
                        <label className="block text-sm font-bold text-gray-900 dark:text-white">
                            Announcement Source
                        </label>

                        <div className="grid grid-cols-3 gap-3">
                            {/* Option: Event */}
                            <button
                                type="button"
                                onClick={() => setAnnouncement(prev => ({ ...prev, type: 'event' }))}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                                    announcement.type === 'event'
                                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                                        : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 text-gray-700 dark:text-slate-300'
                                }`}
                            >
                                <Calendar className="w-5 h-5 mb-1.5" />
                                <span className="text-xs font-bold">From Event</span>
                            </button>

                            {/* Option: Article */}
                            <button
                                type="button"
                                onClick={() => setAnnouncement(prev => ({ ...prev, type: 'article' }))}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                                    announcement.type === 'article'
                                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                                        : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 text-gray-700 dark:text-slate-300'
                                }`}
                            >
                                <FileText className="w-5 h-5 mb-1.5" />
                                <span className="text-xs font-bold">From Article</span>
                            </button>

                            {/* Option: Custom */}
                            <button
                                type="button"
                                onClick={() => setAnnouncement(prev => ({ ...prev, type: 'custom' }))}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                                    announcement.type === 'custom'
                                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                                        : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 text-gray-700 dark:text-slate-300'
                                }`}
                            >
                                <ImageIcon className="w-5 h-5 mb-1.5" />
                                <span className="text-xs font-bold">Custom Poster</span>
                            </button>
                        </div>

                        {/* Event Selector */}
                        {announcement.type === 'event' && (
                            <div className="space-y-2 pt-2 animate-in fade-in">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400">
                                    Select Event
                                </label>
                                <select
                                    value={announcement.target_id || ''}
                                    onChange={(e) => handleSelectEvent(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 text-sm focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none"
                                >
                                    <option value="">-- Choose an Event --</option>
                                    {events.map((event) => (
                                        <option key={event.id} value={event.id}>
                                            {event.title} ({new Date(event.date).toLocaleDateString()})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Article Selector */}
                        {announcement.type === 'article' && (
                            <div className="space-y-2 pt-2 animate-in fade-in">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400">
                                    Select Article
                                </label>
                                <select
                                    value={announcement.target_id || ''}
                                    onChange={(e) => handleSelectArticle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 text-sm focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none"
                                >
                                    <option value="">-- Choose an Article --</option>
                                    {articles.map((article) => (
                                        <option key={article.id} value={article.id}>
                                            {article.title} ({article.category || 'General'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* 3. Poster Image & Overrides */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-5">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-blue-600" />
                            Announcement Poster (Cover Image)
                        </h2>

                        <ImageUpload
                            initialImage={announcement.poster_url}
                            onImageUpload={(url) => setAnnouncement({ ...announcement, poster_url: url })}
                        />

                        {/* Direct URL input fallback */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400">
                                Or Image URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={announcement.poster_url}
                                onChange={(e) => setAnnouncement({ ...announcement, poster_url: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-gray-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* 4. Details & Action Link */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-4">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Link2 className="w-4 h-4 text-blue-600" />
                            Title & Call-to-Action Link
                        </h2>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">
                                    Headline / Title (Optional)
                                </label>
                                {announcement.title && (
                                    <button
                                        type="button"
                                        onClick={() => setAnnouncement({ ...announcement, title: '' })}
                                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Clear (use image only)
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Leave empty if your poster flyer already contains the text"
                                value={announcement.title}
                                onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-blue-500 outline-none"
                            />
                            <p className="text-[11px] text-gray-400 dark:text-slate-500">
                                Tip: For full-poster flyers, leaving this blank keeps the modal 100% focused on your image.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">
                                    Target Link URL
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. /events/1 or https://..."
                                    value={announcement.link_url}
                                    onChange={(e) => setAnnouncement({ ...announcement, link_url: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">
                                    Button Text
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. View Details, Register"
                                    value={announcement.button_text}
                                    onChange={(e) => setAnnouncement({ ...announcement, button_text: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/20 active:scale-98 disabled:opacity-50 cursor-pointer"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Save Announcement</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Right Side: Live Interactive Preview */}
                <div className="lg:col-span-5 sticky top-8 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span>Live Modal Preview</span>
                    </div>

                    <div className="relative rounded-2xl bg-slate-900/95 p-4 sm:p-5 backdrop-blur-md shadow-2xl border border-slate-800">
                        {/* Fake browser mock bar */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-[11px] text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                            </div>
                            <span className="text-[10px] font-mono opacity-60">Visitor Pop-up Preview</span>
                        </div>

                        {/* Modal Mockup - Full image natural aspect */}
                        <div className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col">
                            {/* Close 'X' button mock */}
                            <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-slate-950/70 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 shadow-md">
                                <X className="w-4 h-4" />
                            </div>

                            {/* Full Poster Image */}
                            {announcement.poster_url ? (
                                <div className="relative w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
                                    <img
                                        src={announcement.poster_url}
                                        alt={announcement.title || 'Announcement Poster'}
                                        className="w-full h-auto max-h-[460px] object-contain block mx-auto"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1540575861501-7ad058138a31?auto=format&fit=crop&q=80&w=800';
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="w-full py-16 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                                    <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
                                    <p className="text-xs">No poster uploaded or selected yet</p>
                                </div>
                            )}

                            {/* Content & Action - only shown if title or link exists */}
                            {(announcement.title || announcement.link_url) && (
                                <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                                    {announcement.title ? (
                                        <h3 className="font-bold text-[#1e3a8a] dark:text-slate-100 text-sm leading-snug truncate flex-1">
                                            {announcement.title}
                                        </h3>
                                    ) : (
                                        <span className="flex-1" />
                                    )}

                                    {announcement.link_url && (
                                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs shrink-0">
                                            <span>{announcement.button_text || 'View Details'}</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {!announcement.is_active && (
                            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-amber-400 font-medium">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Modal is currently disabled (turn ON above to display)</span>
                            </div>
                        )}
                    </div>
                </div>
            </form>

            {/* Announcement History Section */}
            <div className="border-t border-gray-200 dark:border-slate-800 pt-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            <History className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span>Announcement History</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                                    {history.length}
                                </span>
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                                Re-activate past announcements with one click or review your history.
                            </p>
                        </div>
                    </div>
                </div>

                {history.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-slate-400 text-sm">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p>No announcements saved in history yet. When you save an announcement, it will be automatically archived here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {history.map((item) => {
                            const isCurrentlyActive = announcement.poster_url === item.poster_url && announcement.is_active;

                            return (
                                <div
                                    key={item.id}
                                    className={`group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border transition-all duration-200 shadow-xs hover:shadow-md ${
                                        isCurrentlyActive
                                            ? 'border-emerald-500/80 ring-2 ring-emerald-500/20'
                                            : 'border-gray-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600'
                                    }`}
                                >
                                    {/* Poster Thumbnail - Full display without cropping */}
                                    <div className="relative w-full h-64 sm:h-72 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-2.5 overflow-hidden">
                                        <img
                                            src={item.poster_url}
                                            alt={item.title || 'Announcement'}
                                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        />

                                        {/* Status Badge */}
                                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                            {isCurrentlyActive ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                    ACTIVE
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-black/60 backdrop-blur-sm text-white">
                                                    {item.type || 'Custom'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => handleDeleteClick(item, e)}
                                            title="Delete from history"
                                            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-sm"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Card Info */}
                                    <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                                        <div>
                                            <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                                                {item.title || 'Untitled Flyer'}
                                            </h3>
                                            <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">
                                                {item.updated_at ? new Date(item.updated_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : 'Past Announcement'}
                                            </p>
                                        </div>

                                        {/* 1-Click Load / Restore Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleRestoreItem(item)}
                                            className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                                isCurrentlyActive
                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                                    : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-950/40 dark:text-slate-300 dark:hover:text-blue-300'
                                            }`}
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            <span>{isCurrentlyActive ? 'Loaded (Active)' : 'Load & Re-activate'}</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Custom Modern In-App Confirm Modal */}
            <ConfirmModal
                isOpen={Boolean(deleteTarget)}
                onClose={() => !deleting && setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Announcement?"
                message="Are you sure you want to remove this announcement from your history? This action cannot be undone."
                confirmText="Delete Flyer"
                cancelText="Cancel"
                variant="danger"
                loading={deleting}
                itemPreview={deleteTarget ? (
                    <div className="flex items-center gap-3.5">
                        <div className="w-14 h-18 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                            <img
                                src={deleteTarget.poster_url}
                                alt={deleteTarget.title || 'Announcement'}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                {deleteTarget.title || 'Untitled Flyer'}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">
                                Source: {deleteTarget.type || 'Custom'}
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-slate-500">
                                {deleteTarget.updated_at ? new Date(deleteTarget.updated_at).toLocaleDateString() : 'Archived flyer'}
                            </p>
                        </div>
                    </div>
                ) : null}
            />
        </div>
    );
};

export default AdminAnnouncement;
