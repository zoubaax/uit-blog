import { useState, useEffect, useCallback } from 'react';
import articleService from '../services/articleService';
import ArticleCard from '../components/ArticleCard';
import PageLoader from '../components/PageLoader';
import { Search, X, SlidersHorizontal, BookOpen, Sparkles, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import usePageMeta from '../hooks/usePageMeta';

const Articles = () => {
    usePageMeta({
        title: 'Articles & Research',
        description: 'Explore engineering articles, technical tutorials, and academic publications from UIT Club at UPF University.'
    });

    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);

    // Debounce search term by 350ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to page 1 on new search
        }, 350);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Load categories once
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await articleService.getCategories();
                if (res && res.data) {
                    setCategories(res.data);
                }
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch articles whenever filters change
    const fetchArticles = useCallback(async (isInitial = false) => {
        if (isInitial) setLoading(true);
        else setFetching(true);
        setError(null);

        try {
            const params = {
                page: currentPage,
                limit: 9,
                sort: sortOption
            };

            if (debouncedSearch.trim()) {
                params.search = debouncedSearch.trim();
            }

            if (selectedCategory && selectedCategory !== 'All') {
                params.category = selectedCategory;
            }

            const response = await articleService.getAll(params);
            setArticles(response.data || []);
            setTotalCount(response.total ?? (response.data ? response.data.length : 0));
            setTotalPages(response.totalPages ?? 1);
        } catch (err) {
            setError('Failed to load articles. Please check your connection and try again.');
            console.error(err);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    }, [currentPage, selectedCategory, debouncedSearch, sortOption]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setSelectedCategory('All');
        setSortOption('newest');
        setCurrentPage(1);
    };

    if (loading) {
        return <PageLoader message="Loading articles..." />;
    }

    return (
        <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
            {/* Header Section */}
            <header className="relative bg-white dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 pt-28 md:pt-36 pb-12 md:pb-16 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full mb-4">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>UIT Club Knowledge Hub</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                Articles & Technical Insights
                            </h1>
                            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                Deep dives into AI, engineering best practices, tutorials, and technical breakthroughs written by UIT members.
                            </p>
                        </div>

                        {/* Total Count Badge */}
                        <div className="flex items-center gap-2 self-start md:self-auto text-sm text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80">
                            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span><strong className="text-slate-900 dark:text-slate-100">{totalCount}</strong> published article{totalCount !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {/* Search and Sort Toolbar */}
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Search Input */}
                        <div className="md:col-span-8 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search articles by title, topic, or author..."
                                className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    title="Clear search"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="md:col-span-4 flex items-center gap-2">
                            <div className="relative w-full">
                                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <select
                                    value={sortOption}
                                    onChange={(e) => {
                                        setSortOption(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-11 pr-8 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="newest">Sort: Newest First</option>
                                    <option value="popular">Sort: Most Popular</option>
                                    <option value="oldest">Sort: Oldest First</option>
                                    <option value="title_asc">Sort: Title (A - Z)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <button
                            onClick={() => handleCategorySelect('All')}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                selectedCategory === 'All'
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-600/30'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                            }`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.category}
                                onClick={() => handleCategorySelect(cat.category)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                                    selectedCategory === cat.category
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-600/30'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                                }`}
                            >
                                <span>{cat.category}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    selectedCategory === cat.category
                                        ? 'bg-blue-700 text-blue-100'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                                }`}>
                                    {cat.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Active Filter Notice */}
                    {(selectedCategory !== 'All' || debouncedSearch) && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>Filtering by:</span>
                            {selectedCategory !== 'All' && (
                                <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-medium border border-blue-200 dark:border-blue-800">
                                    Category: {selectedCategory}
                                </span>
                            )}
                            {debouncedSearch && (
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium border border-slate-200 dark:border-slate-700">
                                    Keyword: &ldquo;{debouncedSearch}&rdquo;
                                </span>
                            )}
                            <button
                                onClick={handleClearFilters}
                                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold ml-2 inline-flex items-center gap-1"
                            >
                                <RefreshCw className="w-3 h-3" /> Reset
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Articles Grid Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                {error ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900/40 p-8 max-w-lg mx-auto shadow-xs">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">!</div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Failed to load articles</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{error}</p>
                        <button
                            onClick={() => fetchArticles()}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                        >
                            Try Again
                        </button>
                    </div>
                ) : fetching ? (
                    <div className="py-24 text-center">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Updating articles...</p>
                    </div>
                ) : articles.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-3">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>

                                <span className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 max-w-xl mx-auto shadow-xs">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No Articles Found</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                            {searchTerm || selectedCategory !== 'All'
                                ? "We couldn't find any articles matching your search query or filters. Try adjusting your keywords or browse all categories."
                                : "No research publications or articles have been posted yet. Check back soon!"}
                        </p>
                        {(searchTerm || selectedCategory !== 'All') && (
                            <button
                                onClick={handleClearFilters}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-xs shadow-blue-500/10"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Articles;
