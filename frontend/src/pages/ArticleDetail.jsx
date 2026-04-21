import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import articleService from '../services/articleService';
import { ArrowLeft, Calendar, User, Share2, Twitter, Linkedin, Facebook, Clock } from 'lucide-react';
import PageLoader from '../components/PageLoader';

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
        return <PageLoader message="Loading article" />;
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-red-600 text-lg font-semibold">{error || 'Article not found'}</p>
                        <p className="text-[#64748b] text-sm mt-2">The article you're looking for doesn't exist or has been removed.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/articles')} 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Articles
                    </button>
                </div>
            </div>
        );
    }

    // Calculate read time
    const readTime = Math.ceil(article.content?.split(' ').length / 200) || 5;
    
    // Simple markdown renderer
    const renderMarkdown = (content) => {
        if (!content) return '';
        
        return content.split('\n').map((line, index) => {
            // Headers
            if (line.startsWith('### ')) {
                return <h3 key={index} className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('## ')) {
                return <h2 key={index} className="text-3xl font-bold text-[#1e3a8a] mt-10 mb-5">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('# ')) {
                return <h1 key={index} className="text-4xl font-bold text-[#1e3a8a] mt-12 mb-6">{line.replace('# ', '')}</h1>;
            }
            
            // Bold text with asterisks
            if (line.includes('**')) {
                const parts = line.split(/\*\*(.*?)\*\*/g);
                return (
                    <p key={index} className="mb-4">
                        {parts.map((part, i) => 
                            i % 2 === 1 ? <strong key={i} className="font-semibold text-[#1e3a8a]">{part}</strong> : part
                        )}
                    </p>
                );
            }
            
            // List items
            if (line.startsWith('- ')) {
                return (
                    <li key={index} className="ml-6 mb-2 text-[#475569]">
                        <span className="inline-block w-2 h-2 bg-[#2563eb] rounded-full mr-3 -ml-6 align-middle"></span>
                        {line.replace('- ', '')}
                    </li>
                );
            }
            
            // Numbered lists
            if (/^\d+\.\s/.test(line)) {
                const match = line.match(/^(\d+)\.\s(.*)/);
                if (match) {
                    return (
                        <li key={index} className="ml-6 mb-2 text-[#475569] flex items-start gap-3">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-[#2563eb] text-white text-xs font-bold rounded-full flex-shrink-0">{match[1]}</span>
                            <span>{match[2]}</span>
                        </li>
                    );
                }
            }
            
            // Code blocks
            if (line.startsWith('```')) {
                return null; // Skip code block markers
            }
            
            // Empty lines
            if (line.trim() === '') {
                return <div key={index} className="h-4"></div>;
            }
            
            // Regular paragraphs
            return <p key={index} className="mb-4 text-[#475569]">{line}</p>;
        });
    };

    return (
        <article className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-white border-b border-slate-100 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1e3a8a 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                </div>
                
                <div className="relative max-w-5xl mx-auto px-6 pt-28 md:pt-32 pb-16">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/articles')}
                        className="inline-flex items-center gap-2 text-[#94a3b8] hover:text-[#1e3a8a] transition-colors mb-8 text-sm font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Articles
                    </button>

                    {/* Article Meta */}
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className="px-3 py-1 bg-[#dbeafe] text-[#2563eb] rounded-full font-medium">
                                Article
                            </span>
                            <span className="flex items-center gap-1.5 text-[#64748b]">
                                <Calendar className="w-4 h-4" />
                                {new Date(article.created_at).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </span>
                            <span className="flex items-center gap-1.5 text-[#64748b]">
                                <Clock className="w-4 h-4" />
                                {readTime} min read
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#0f172a]">
                            {article.title}
                        </h1>

                        {/* Author Info */}
                        <div className="flex items-center gap-4 pt-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#2563eb] to-[#1e3a8a] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {(article.author_name || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="text-[#94a3b8] text-xs font-medium uppercase tracking-wider">Written by</p>
                                <p className="font-semibold text-lg text-[#1e3a8a]">{article.author_name || 'UIT Club Team'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            {article.image_url && (
                <section className="max-w-5xl mx-auto px-6 py-8">
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-[400px] object-cover"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200';
                            }}
                        />
                    </div>
                </section>
            )}

            {/* Content Section */}
            <section className="max-w-4xl mx-auto px-6 py-16">
                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                    {renderMarkdown(article.content)}
                </div>
                
                {/* Share Section */}
                <div className="mt-16 pt-8 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-sm font-semibold text-[#1e3a8a] mb-1">Share this article</p>
                            <p className="text-xs text-[#64748b]">Help others discover this content</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#0d8ecf] transition-colors text-sm font-medium">
                                <Twitter className="w-4 h-4" />
                                Twitter
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#084d94] transition-colors text-sm font-medium">
                                <Linkedin className="w-4 h-4" />
                                LinkedIn
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#4267B2] text-white rounded-lg hover:bg-[#365899] transition-colors text-sm font-medium">
                                <Facebook className="w-4 h-4" />
                                Facebook
                            </button>
                        </div>
                    </div>
                </div>

                {/* Author Bio */}
                <div className="mt-12 p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb] to-[#1e3a8a] rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                            {(article.author_name || 'UIT')[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-[#2563eb] uppercase tracking-wider mb-1">About the Author</p>
                            <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">{article.author_name || 'UIT Club Team'}</h3>
                            <p className="text-[#64748b] text-sm leading-relaxed">
                                Part of the UIT Club at Université Polytechnique Fédérale. We share knowledge about cutting-edge technology, 
                                AI tools, and development best practices to empower our community of developers and innovators.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Footer Notes */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <svg className="w-5 h-5 text-[#2563eb] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-[#64748b] text-sm leading-relaxed">
                            This article is part of the UIT Club official archive. For questions or permissions, contact us at <span className="font-medium text-[#2563eb]">uit.club@upf.ac.ma</span>
                        </p>
                    </div>
                </div>
            </section>
        </article>
    );
};

export default ArticleDetail;
