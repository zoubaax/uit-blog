import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOptimizedImageUrl } from '../utils/cloudinaryUtils';

const ArticleCard = ({ article }) => {
    const excerpt = article.content.substring(0, 150) + '...';

    return (
        <Link 
            to={`/articles/${article.id}`}
            className="group block transition-all duration-300"
        >
            <div className="flex flex-col h-full bg-white group-hover:-translate-y-1 transition-transform">
                {/* Image Container */}
                <div className="relative aspect-video mb-6 overflow-hidden rounded-xl border border-slate-100">
                    <img 
                        src={article.image_url ? getOptimizedImageUrl(article.image_url, 800, 450) : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
                    <span className="absolute top-4 left-4 inline-block px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[#2563eb] text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">
                        Research
                    </span>
                </div>

                <div className="flex flex-col flex-1 px-1">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wide flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#1e3a8a] mb-3 group-hover:text-[#2563eb] transition-colors leading-snug">
                        {article.title}
                    </h3>
                    
                    <p className="text-sm text-[#64748b] mb-6 line-clamp-2 leading-relaxed">
                        {excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest">
                            <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[8px]">
                                {(article.author_name || 'A')[0]}
                            </div>
                            {article.author_name || 'UIT Club Team'}
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#2563eb] transform transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;

