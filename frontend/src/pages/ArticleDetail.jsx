import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import articleService from '../services/articleService';
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    Eye, 
    Share2, 
    Twitter, 
    Linkedin, 
    Facebook, 
    Link2, 
    Check, 
    Heart, 
    List, 
    Sparkles, 
    BookOpen,
    Copy,
    ChevronRight,
    Trophy,
    Camera,
    Globe,
    ExternalLink
} from 'lucide-react';
import PageLoader from '../components/PageLoader';
import ArticleCard from '../components/ArticleCard';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { getOptimizedImageUrl } from '../utils/cloudinaryUtils';
import logoDark from '../assets/dark.png';
import usePageMeta from '../hooks/usePageMeta';

const slugify = (text = '') => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    usePageMeta({
        title: article?.title,
        description: article?.excerpt,
        image: article?.cover_image
    });

    // Track scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll > 0) {
                const currentProgress = (window.scrollY / totalScroll) * 100;
                setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Load article and related articles
    useEffect(() => {
        const fetchArticleData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await articleService.getById(id);
                const loadedArticle = response.data;
                setArticle(loadedArticle);

                // If visited via numeric ID or un-slugified URL, seamlessly update URL bar to the clean title slug
                if (loadedArticle?.slug && id !== loadedArticle.slug) {
                    window.history.replaceState(null, '', `/articles/${loadedArticle.slug}`);
                }

                // Initialize likes from localStorage using numeric article ID
                const localLikeKey = `uit_article_liked_${loadedArticle.id}`;
                const hasLiked = localStorage.getItem(localLikeKey) === 'true';
                setLiked(hasLiked);
                // Simulated initial likes based on views and ID
                const baseLikes = Math.max(5, Math.floor((loadedArticle.views || 10) * 0.4) + (Number(loadedArticle.id) % 7));
                setLikeCount(hasLiked ? baseLikes + 1 : baseLikes);

                // Fetch related articles
                try {
                    const relatedRes = await articleService.getRelated(loadedArticle.id);
                    setRelatedArticles((relatedRes.data || []).slice(0, 3));
                } catch (relErr) {
                    console.warn('Could not fetch related articles:', relErr);
                }
            } catch (err) {
                setError('Article not found or failed to load.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticleData();
        window.scrollTo(0, 0);
    }, [id]);

    // Handle Like Toggle
    const handleLikeToggle = () => {
        if (!article) return;
        const localLikeKey = `uit_article_liked_${article.id}`;
        if (liked) {
            setLiked(false);
            setLikeCount(prev => Math.max(0, prev - 1));
            localStorage.removeItem(localLikeKey);
        } else {
            setLiked(true);
            setLikeCount(prev => prev + 1);
            localStorage.setItem(localLikeKey, 'true');
        }
    };

    // Social Sharing
    const handleShareTwitter = () => {
        const text = encodeURIComponent(`"${article.title}" by UIT Club`);
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    };

    const handleShareLinkedIn = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
    };

    const handleShareFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    // Extract Table of Contents from content
    const tableOfContents = useMemo(() => {
        if (!article?.content) return [];
        const lines = article.content.split('\n');
        const headings = [];
        
        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('## ')) {
                const title = trimmed.replace('## ', '');
                headings.push({ level: 2, title, slug: slugify(title) });
            } else if (trimmed.startsWith('### ')) {
                const title = trimmed.replace('### ', '');
                headings.push({ level: 3, title, slug: slugify(title) });
            }
        });
        return headings;
    }, [article?.content]);

    if (loading) {
        return <PageLoader message="Loading article..." />;
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="text-center space-y-6 max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{error || 'Article Not Found'}</h2>
                        <p className="text-slate-500 text-sm mt-2">
                            The publication you requested may have been archived or removed.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/articles')} 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm shadow-md shadow-blue-500/10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Articles
                    </button>
                </div>
            </div>
        );
    }

    const readTime = Math.max(1, Math.ceil((article.content?.split(/\s+/).length || 0) / 200));

    return (
        <article className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-200">
            {/* Scroll Progress Bar */}
            <div 
                className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#1e3a8a] via-blue-600 to-blue-400 z-50 transition-all duration-100"
                style={{ width: `${scrollProgress}%` }}
            />

            {/* Hero & Title Header */}
            <header className="relative bg-white dark:bg-slate-900/90 border-b border-slate-100/90 dark:border-slate-800 pt-24 md:pt-28 pb-8 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb Navigation */}
                    <div className="flex items-center gap-2.5 mb-5">
                        <button
                            onClick={() => navigate('/articles')}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                            <span>Articles</span>
                        </button>
                        <span className="text-slate-300 dark:text-slate-700 text-xs">/</span>
                        <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider rounded-full border border-blue-200/60 dark:border-blue-800">
                            {article.category || 'Technology'}
                        </span>
                    </div>

                    {/* Title - Refined, elegant, and balanced */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-snug mb-6">
                        {article.title}
                    </h1>

                    {/* Metadata Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                        {/* Author info */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white border border-slate-200/90 p-1 flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                                <img src={logoDark} alt="UIT Club" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-xs leading-none">
                                    {(article.author_name?.toLowerCase() === 'uit' || !article.author_name) ? 'UIT Club' : article.author_name}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Research & Technical Author</p>
                            </div>
                        </div>

                        {/* Article stats */}
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5 font-medium">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {new Date(article.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1.5 font-medium">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {readTime} min read
                            </span>
                            {typeof article.views === 'number' && (
                                <>
                                    <span className="text-slate-300">•</span>
                                    <span className="flex items-center gap-1.5 font-medium text-slate-500">
                                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                                        {article.views} views
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image - Full view, uncropped, expansive */}
            {article.image_url && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 my-8 md:my-10">
                    <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-50">
                        <img
                            src={getOptimizedImageUrl(article.image_url, 1600)}
                            alt={article.title}
                            className="w-full h-auto block rounded-2xl md:rounded-3xl"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200';
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Main Content Layout with TOC Sidebar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Sticky Sidebar: Table of Contents & Quick Actions */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-28 space-y-6">
                            {/* Table of Contents */}
                            {tableOfContents.length > 0 && (
                                <div className="bg-slate-50/80 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800">
                                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                                        <List className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        Table of Contents
                                    </h4>
                                    <nav className="space-y-1 text-sm">
                                        {tableOfContents.map((h, i) => (
                                            <a
                                                key={i}
                                                href={`#${h.slug}`}
                                                className={`block text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 transition-all py-1 font-medium ${
                                                    h.level === 3 ? 'pl-4 text-xs text-slate-500 dark:text-slate-400' : ''
                                                }`}
                                            >
                                                {h.title}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            )}

                            {/* Like / Interaction Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">Found this insightful?</p>
                                <button
                                    onClick={handleLikeToggle}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all transform active:scale-95 ${
                                        liked
                                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 shadow-xs'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400'
                                    }`}
                                >
                                    <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                                    <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
                                </button>
                            </div>

                            {/* Quick Share */}
                            <div className="bg-slate-50/80 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Share</p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleShareTwitter}
                                        title="Share on Twitter / X"
                                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-500 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-800 transition-colors"
                                    >
                                        <Twitter className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleShareLinkedIn}
                                        title="Share on LinkedIn"
                                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleShareFacebook}
                                        title="Share on Facebook"
                                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
                                    >
                                        <Facebook className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleCopyLink}
                                        title="Copy Link"
                                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Center: Article Body */}
                    {/* Center: Article Body */}
                    <div className="lg:col-span-9 max-w-3xl">
                        {/* Linked Event Recap Banner - Smooth, refined editorial card */}
                        {article.event_title && (
                            <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-slate-50/60 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/80 dark:to-blue-950/30 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 shadow-xs group">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-all">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                                    Official Event Recap
                                                </span>
                                            </div>
                                            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {article.event_title}
                                            </h4>
                                            {article.event_date && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    Held on {new Date(article.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {article.event_id && (
                                        <Link 
                                            to={`/events/${article.event_id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-blue-50/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-200 shadow-xs transition-all self-start sm:self-auto group/btn"
                                        >
                                            <span>View Event</span>
                                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-blue-600 group-hover/btn:translate-x-0.5 transition-all" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Hackathon Project Demo Link - Smooth & modern */}
                        {article.project_url && (
                            <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-slate-50/60 to-amber-50/30 dark:from-slate-900 dark:via-slate-900/80 dark:to-amber-950/30 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 shadow-xs group">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-all">
                                            <Trophy className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                                    Project Demo & Code
                                                </span>
                                            </div>
                                            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                                                Hackathon Prototype Online
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Explore the live repository or product demonstration.</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={article.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-amber-50/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-200 shadow-xs transition-all self-start sm:self-auto group/btn"
                                    >
                                        <Globe className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-amber-600 transition-colors" />
                                        <span>Launch Demo</span>
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-amber-600 transition-colors" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Article Text */}
                        <div className="article-body">
                            <MarkdownRenderer content={article.content} />
                        </div>

                        {/* Mobile Share & Like Bar */}
                        <div className="lg:hidden my-10 p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                            <button
                                onClick={handleLikeToggle}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                                    liked ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                }`}
                            >
                                <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                                <span>{likeCount} Likes</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <button onClick={handleShareTwitter} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                    <Twitter className="w-4 h-4" />
                                </button>
                                <button onClick={handleShareLinkedIn} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                    <Linkedin className="w-4 h-4" />
                                </button>
                                <button onClick={handleCopyLink} className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5" />}
                                    <span>{copied ? 'Copied' : 'Share'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Author Bio Box */}
                        <div className="mt-14 p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-2.5 flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden">
                                    <img src={logoDark} alt="UIT Club" className="w-full h-full object-contain dark:brightness-0 dark:invert" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                            {(article.author_name?.toLowerCase() === 'uit' || !article.author_name) ? 'UIT Club' : article.author_name}
                                        </h3>
                                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-full border border-blue-200 dark:border-blue-800">Author</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        Active contributor at the UIT Club (UPF University). Sharing research, hands-on tutorials, and engineering best practices to inspire student innovation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Official Archive Note */}
                        <div className="mt-8 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                This publication is part of the UIT official academic archive. Questions or corrections? Contact the editorial team at <span className="font-semibold text-blue-700 dark:text-blue-400">uit.club@upf.ac.ma</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
                <section className="bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800 py-16 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Continue Reading</span>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">Related Publications</h3>
                            </div>
                            <Link 
                                to="/articles" 
                                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group"
                            >
                                <span>Browse all articles</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedArticles.map((relArticle) => (
                                <ArticleCard key={relArticle.id} article={relArticle} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </article>
    );
};

export default ArticleDetail;
