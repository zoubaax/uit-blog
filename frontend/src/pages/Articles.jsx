import { useState, useEffect } from 'react';
import articleService from '../services/articleService';
import ArticleCard from '../components/ArticleCard';
import PageLoader from '../components/PageLoader';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await articleService.getAll();
                setArticles(response.data || []);
            } catch (err) {
                setError('Failed to load articles. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <PageLoader message="Loading articles" />;
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <header className="pt-28 md:pt-32 pb-12 md:pb-20 px-4 sm:px-6 max-w-7xl mx-auto border-b border-slate-100 mb-12 md:mb-16">
                <div className="reveal-element">
                    <span className="inline-block px-3 py-1 bg-[#dbeafe] text-[#2563eb] text-[10px] uppercase font-bold tracking-widest rounded mb-6">
                        University Archive
                    </span>
                    <h1 className="text-4xl md:text-6xl font-semibold text-[#1e3a8a] mb-6 leading-tight">
                        Research & Insights
                    </h1>
                    <p className="text-lg text-[#475569] max-w-2xl leading-relaxed">
                        A curated collection of technical articles, research breakthroughs, and student innovations from the University of IT Club.
                    </p>
                </div>
            </header>

            {/* Articles Grid */}
            <main className="max-w-7xl mx-auto px-6 pb-24">
                {error ? (
                    <div className="text-center py-20 bg-[#f8fafc] rounded border border-slate-200">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                ) : articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {articles.map((article, index) => (
                            <div key={article.id} className="reveal-element" style={{ transitionDelay: `${index * 50}ms` }}>
                                <ArticleCard article={article} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#f8fafc] rounded border border-slate-200">
                        <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">No Articles Available</h3>
                        <p className="text-[#475569]">Check back soon for new research publications.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Articles;
