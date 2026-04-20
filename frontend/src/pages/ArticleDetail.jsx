import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import articleService from '../services/articleService';
import { ArrowLeft, Loader2 } from 'lucide-react';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await articleService.getById(id);
                setArticle(response.data);
            } catch (err) {
                setError('Article not found or failed to load.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#1e3a8a] animate-spin mb-4" />
                <p className="text-[#475569] font-medium">Accessing archive...</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <p className="text-red-600 text-lg">{error || 'Publication not found'}</p>
                <button onClick={() => navigate('/articles')} className="text-[#2563eb] font-bold uppercase text-xs tracking-widest hover:underline">Return to archive</button>
            </div>
        );
    }

    return (
        <article className="bg-white min-h-screen">
            {/* Header / Meta */}
            <header className="max-w-4xl mx-auto px-6 pt-20 pb-12">
                <button
                    onClick={() => navigate('/articles')}
                    className="flex items-center gap-2 text-[#94a3b8] hover:text-[#1e3a8a] transition-colors mb-12 text-xs font-bold uppercase tracking-widest group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="reveal-element">
                    <div className="flex items-center gap-4 mb-8 text-[10px] font-bold text-[#2563eb] uppercase tracking-[0.2em]">
                        <span>Publication</span>
                        <span className="text-[#94a3b8]">/</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1e3a8a] mb-8 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-4 py-8 border-y border-slate-100">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center text-[#1e3a8a] font-bold text-sm">
                            {(article.author_name || 'A')[0]}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Authored By</p>
                            <p className="text-sm font-semibold text-[#1e3a8a]">{article.author_name || 'University Staff'}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            <section className="max-w-6xl mx-auto px-6 mb-16">
                <div className="aspect-[21/9] bg-slate-50 border border-slate-100 overflow-hidden">
                    <img
                        src={article.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200'}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </section>

            {/* Content */}
            <section className="max-w-3xl mx-auto px-6 pb-32">
                <div className="prose prose-slate prose-lg max-w-none">
                    <div className="text-[#475569] leading-[1.8] text-lg whitespace-pre-line">
                        {article.content}
                    </div>
                </div>
                
                {/* Footer Notes */}
                <div className="mt-20 pt-12 border-t border-slate-100">
                    <p className="text-[#94a3b8] text-xs italic leading-relaxed">
                        This article is part of the UIT Club official archive. Reproduction or distribution of this research without explicit permission is prohibited under university guidelines.
                    </p>
                </div>
            </section>
        </article>
    );
};

export default ArticleDetail;
