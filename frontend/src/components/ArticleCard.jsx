import { Calendar, ArrowRight, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOptimizedImageUrl } from '../utils/cloudinaryUtils';

const cleanMarkdownExcerpt = (text = '', maxLength = 140) => {
    if (!text) return '';
    // Strip markdown headings, links, bold, code
    const plain = text
        .replace(/#+\s+/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`{1,3}[^`]*`{1,3}/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/>\s+/g, '')
        .replace(/\n+/g, ' ')
        .trim();
    return plain.length > maxLength ? plain.substring(0, maxLength).trim() + '...' : plain;
};

const getCategoryColor = (category = '') => {
    const lower = category.toLowerCase();
    if (lower.includes('ai') || lower.includes('machine')) {
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (lower.includes('software') || lower.includes('dev')) {
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (lower.includes('cloud') || lower.includes('devops')) {
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    }
    if (lower.includes('cyber') || lower.includes('security')) {
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
};

const ArticleCard = ({ article }) => {
    const excerpt = cleanMarkdownExcerpt(article.content, 130);
    const readTime = Math.max(1, Math.ceil((article.content?.split(/\s+/).length || 0) / 200));
    const categoryBadgeClass = getCategoryColor(article.category);

    return (
        <Link 
            to={`/articles/${article.id}`}
            className="group block h-full focus:outline-none"
        >
            <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group-hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative aspect-video mb-5 overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
                    <img 
                        src={article.image_url ? getOptimizedImageUrl(article.image_url, 800, 450) : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} 
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                    <span className={`absolute top-3 left-3 inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold rounded-full border backdrop-blur-md shadow-sm ${categoryBadgeClass}`}>
                        {article.category || 'Technology'}
                    </span>
                </div>

                <div className="flex flex-col flex-1">
                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2.5">
                        <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(article.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {readTime} min read
                        </span>
                        {typeof article.views === 'number' && (
                            <>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1 font-medium text-slate-400">
                                    <Eye className="w-3.5 h-3.5" />
                                    {article.views}
                                </span>
                            </>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                        {excerpt}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                                {(article.author_name || 'U')[0].toUpperCase()}
                            </div>
                            <span className="text-xs font-semibold text-slate-700">
                                {article.author_name || 'UIT Club'}
                            </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                            Read
                            <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;
