import { Calendar, ArrowRight, Clock, Eye, Trophy, Camera, Rocket, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOptimizedImageUrl } from '../utils/cloudinaryUtils';
import { cleanMarkdownExcerpt } from '../utils/textUtils';
import Logo from './Logo';

const getCategoryColor = (category = '') => {
    const lower = category.toLowerCase();
    if (lower.includes('hackathon') || lower.includes('competition')) {
        return 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold';
    }
    if (lower.includes('recap') || lower.includes('highlight')) {
        return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold';
    }
    if (lower.includes('journey') || lower.includes('milestone')) {
        return 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 font-bold';
    }
    if (lower.includes('ai') || lower.includes('machine')) {
        return 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
    if (lower.includes('software') || lower.includes('dev')) {
        return 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
    if (lower.includes('cloud') || lower.includes('devops')) {
        return 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
    }
    if (lower.includes('cyber') || lower.includes('security')) {
        return 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
    return 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
};

const ArticleCard = ({ article }) => {
    const excerpt = cleanMarkdownExcerpt(article.content, 130);
    const readTime = Math.max(1, Math.ceil((article.content?.split(/\s+/).length || 0) / 200));
    const categoryClasses = getCategoryColor(article.category);

    return (
        <Link 
            to={`/articles/${article.slug || article.id}`}
            className="group block h-full focus:outline-none"
        >
            <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-black/50 transition-all duration-300 group-hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative aspect-video mb-4 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                    <img 
                        src={article.image_url ? getOptimizedImageUrl(article.image_url, 800, 450) : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} 
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                    
                    {/* Category Tag */}
                    <span className={`absolute top-3 left-3 inline-flex items-center px-3 py-1 text-[11px] rounded-full border backdrop-blur-md shadow-xs ${categoryClasses}`}>
                        {article.category || 'Technology'}
                    </span>

                    {/* Linked Event Marker */}
                    {article.event_title && (
                        <span className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg truncate flex items-center gap-1.5 border border-white/20">
                            <Camera className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            <span className="truncate">Recap: {article.event_title}</span>
                        </span>
                    )}
                </div>

                <div className="flex flex-col flex-1">
                    {/* Meta info */}
                    <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                        <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(article.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {readTime} min read
                        </span>
                        {typeof article.views === 'number' && (
                            <>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className="flex items-center gap-1 font-medium text-slate-400">
                                    <Eye className="w-3.5 h-3.5" />
                                    {article.views}
                                </span>
                            </>
                        )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                        {excerpt}
                    </p>

                    <div className="mt-auto pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 p-0.5 flex items-center justify-center shadow-xs overflow-hidden flex-shrink-0">
                                <Logo className="w-full h-full" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                                {(article.author_name?.toLowerCase() === 'uit' || !article.author_name) ? 'UIT Club' : article.author_name}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {article.project_url && (
                                <span className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400" title="Has project link">
                                    <Globe className="w-3.5 h-3.5" />
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                                Read Story
                                <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;
