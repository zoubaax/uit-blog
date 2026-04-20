import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
    const excerpt = article.content.substring(0, 150) + '...';

    return (
        <Link 
            to={`/articles/${article.id}`}
            className="group block p-8 border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 bg-white"
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                    <span className="inline-block px-2 py-0.5 bg-[#dbeafe] text-[#2563eb] text-[10px] font-bold uppercase tracking-wider rounded">
                        Publication
                    </span>
                    <span className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wide flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.created_at).toLocaleDateString()}
                    </span>
                </div>

                <h3 className="text-xl font-semibold text-[#1e3a8a] mb-4 group-hover:text-[#2563eb] transition-colors leading-snug">
                    {article.title}
                </h3>
                
                <p className="text-sm text-[#475569] mb-8 line-clamp-2 leading-relaxed">
                    {excerpt}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">
                        <User className="w-3 h-3" />
                        {article.author_name || 'Staff Writer'}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#2563eb] transform transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;

