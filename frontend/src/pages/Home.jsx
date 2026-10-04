import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import articleService from '../services/articleService';
import eventService from '../services/eventService';
import teamService from '../services/teamService';
import PageLoader from '../components/PageLoader';
import { getOptimizedImageUrl } from '../utils/cloudinaryUtils';
import bannerImage from '../assets/banner.png';

/**
 * UIT CLUB HOMEPAGE
 * Style: Academic & Professional (MIT/Stanford inspired)
 * Tech: React + Tailwind CSS v4
 */

// --- DYNAMIC DATA HOOKS ---
const useReveal = (dep) => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    entry.target.classList.remove('reveal-hidden');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal-element');
        elements.forEach(el => {
            if (!el.classList.contains('reveal-visible')) {
                el.classList.add('reveal-hidden');
            }
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, [dep]);
};

const Home = () => {
    const [stats, setStats] = useState({ members: 0, articles: 0, events: 0 });
    const [articles, setArticles] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useReveal(loading);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                // Fetch in parallel for maximum speed
                const [articlesResponse, eventsResponse, teamResponse] = await Promise.all([
                    articleService.getAll({ limit: 3 }),
                    eventService.getAll(),
                    teamService.getAll()
                ]);

                if (!isMounted) return;

                const allArticles = articlesResponse?.data || [];
                setArticles(allArticles.slice(0, 3));

                const allEvents = eventsResponse?.data || [];
                const upcomingEvents = allEvents
                    .filter(e => new Date(e.date) > new Date())
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 4);
                setEvents(upcomingEvents);

                const members = teamResponse?.data || [];
                setStats({
                    members: members.length,
                    articles: articlesResponse?.total ?? allArticles.length,
                    events: allEvents.length
                });
            } catch (error) {
                console.error('Error fetching homepage data:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
            {/* 2. HERO */}
            <header className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center text-center px-8 sm:px-6 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                        src={bannerImage}
                        alt="UPF Campus"
                        className="w-full h-full object-cover animate-float"
                    />
                    {/* Enhanced glass overlay for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-white dark:from-black/60 dark:via-black/70 dark:to-slate-950 backdrop-blur-[2px]"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto pt-20">
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-semibold text-white leading-[1.1] mb-4 md:mb-6 max-w-4xl mx-auto drop-shadow-lg reveal-element delay-100">
                        Built by students.<br /> Driven by knowledge.
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed drop-shadow reveal-element delay-200">
                        A technical collective dedicated to fostering engineering excellence and research collaboration across the university campus.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 md:mb-16 w-full sm:w-auto px-4 sm:px-0 reveal-element delay-300">
                        <Link
                            to="/articles"
                            className="px-6 py-3 sm:px-8 sm:py-3 bg-white dark:bg-blue-600 text-[#1e3a8a] dark:text-white font-medium rounded hover:bg-slate-50 dark:hover:bg-blue-500 transition-all active:scale-95 shadow-sm text-center"
                        >
                            Explore Articles
                        </Link>
                        <Link
                            to="/team"
                            className="px-6 py-3 sm:px-8 sm:py-3 bg-white dark:bg-slate-900 text-[#1e3a8a] dark:text-slate-100 font-medium rounded hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent dark:border-slate-700 transition-all active:scale-95 shadow-sm text-center"
                        >
                            Meet the Team
                        </Link>
                    </div>
                </div>
            </header>

            {/* 3. MISSION STRIP */}
            <section className="bg-[#f8fafc] dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800/80 py-20 px-6 transition-colors">
                <div className="max-w-7xl mx-auto reveal-element">
                    <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start">
                        <div className="text-6xl md:text-8xl font-bold text-blue-200 dark:text-blue-300 leading-none select-none">
                            01
                        </div>
                        <div className="max-w-3xl">
                            <p className="text-2xl md:text-3xl font-medium text-[#1e3a8a] dark:text-blue-100 leading-tight italic">
                                Our mission is to bridge the gap between academic theory and technical reality. We build systems that matter and cultivate minds that lead.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FEATURED ARTICLES */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="reveal-element">
                    <div className="mb-12">
                        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#2563eb] dark:text-blue-400 border-b-2 border-[#2563eb] dark:border-blue-500 pb-1">
                            Knowledge Hub
                        </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {loading ? (
                            [1, 2, 3].map((n) => (
                                <div key={n} className="flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden animate-pulse">
                                    <div className="w-full h-48 bg-slate-100 dark:bg-slate-800" />
                                    <div className="flex flex-col p-6 flex-1 space-y-4">
                                        <div className="h-5 bg-slate-200/80 dark:bg-slate-700 rounded w-3/4" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                                            <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
                                        </div>
                                        <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-1/3 pt-2" />
                                    </div>
                                </div>
                            ))
                        ) : articles.length > 0 ? (
                            articles.map((article, i) => (
                                <Link
                                    key={article.id}
                                    to={`/articles/${article.slug || article.id}`}
                                    className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-300 transform hover:-translate-y-0.5 reveal-element overflow-hidden rounded-xl"
                                    style={{ transitionDelay: `${i * 100}ms` }}
                                >
                                    {/* Article Image */}
                                    <div className="relative w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        <img
                                            src={article.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'}
                                            alt={article.title}
                                            className="w-full h-full object-cover ken-burns transition-transform duration-700 ease-out"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800';
                                            }}
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-block px-2.5 py-0.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm text-[#2563eb] dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-xs border border-slate-100 dark:border-slate-800">
                                                {article.category || 'Article'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Article Content */}
                                    <div className="flex flex-col p-6 flex-1">
                                        <h3 className="text-lg font-semibold text-[#1e3a8a] dark:text-slate-100 mb-3 group-hover:text-[#2563eb] dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-[#475569] dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed flex-1">
                                            {article.content?.substring(0, 120)}...
                                        </p>
                                        <div className="mt-auto flex items-center justify-between text-[11px] text-[#94a3b8] dark:text-slate-400 uppercase font-semibold tracking-wide pt-4 border-t border-slate-50 dark:border-slate-800/60">
                                            <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                            <span className="text-[#2563eb] dark:text-blue-400 group-hover:underline">Read →</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-12 bg-[#f8fafc] dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                                <p className="text-[#475569] dark:text-slate-400">No articles available yet.</p>
                            </div>
                        )}
                    </div>

                    <Link to="/articles" className="inline-block text-[#2563eb] dark:text-blue-400 font-semibold text-sm hover:underline">
                        Browse All Articles →
                    </Link>
                </div>
            </section>

            {/* 5. UPCOMING EVENTS */}
            <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-100 dark:border-slate-800">
                <div className="reveal-element">
                    <div className="mb-12">
                        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#2563eb] dark:text-blue-400 border-b-2 border-[#2563eb] dark:border-blue-500 pb-1">
                            Upcoming Events
                        </span>
                    </div>

                    <div className="max-w-4xl">
                        {loading ? (
                            [1, 2].map((n) => (
                                <div key={n} className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] py-8 border-b border-slate-100 dark:border-slate-800 gap-6 animate-pulse">
                                    <div className="space-y-3">
                                        <div className="h-8 w-12 bg-slate-200/70 dark:bg-slate-700 rounded" />
                                        <div className="w-full aspect-square rounded-lg bg-slate-100 dark:bg-slate-800" />
                                    </div>
                                    <div className="flex flex-col justify-center space-y-3">
                                        <div className="h-5 bg-slate-200/80 dark:bg-slate-700 rounded w-2/3" />
                                        <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-full max-w-md" />
                                    </div>
                                </div>
                            ))
                        ) : events.length > 0 ? (
                            events.map((event, i) => (
                                <Link
                                    key={event.id}
                                    to={`/events/${event.id}`}
                                    className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] lg:grid-cols-[140px_1fr] py-8 border-b border-slate-100 dark:border-slate-800 first:pt-0 reveal-element hover:bg-slate-50/50 dark:hover:bg-slate-900/50 -mx-4 px-4 rounded-xl transition-colors group gap-6"
                                    style={{ transitionDelay: `${i * 100}ms` }}
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-bold text-[#1e3a8a] dark:text-blue-400">{new Date(event.date).getDate().toString().padStart(2, '0')}</span>
                                            <span className="text-xs font-bold text-[#94a3b8] dark:text-slate-400">{new Date(event.date).toLocaleString('en-US', { month: 'short' }).toUpperCase()}</span>
                                        </div>
                                        <div className="w-full aspect-square md:aspect-[4/5] rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xs">
                                            <img
                                                src={event.cover_image_url ? getOptimizedImageUrl(event.cover_image_url, 300, 375) : 'https://images.unsplash.com/photo-1540575861501-7ad058138a31?auto=format&fit=crop&q=80&w=300'}
                                                alt={event.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="text-xl font-semibold text-[#1e3a8a] dark:text-slate-100 mb-2 group-hover:text-[#2563eb] dark:group-hover:text-blue-400 transition-colors">{event.title}</h4>
                                        <p className="text-[#475569] dark:text-slate-300 text-sm leading-relaxed max-w-xl">
                                            {event.description?.substring(0, 120)}...
                                        </p>
                                        <span className="inline-block mt-3 text-[#2563eb] dark:text-blue-400 text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Details →
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-[#f8fafc] dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                                <p className="text-[#475569] dark:text-slate-400">No upcoming events scheduled.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-12">
                        <Link to="/events" className="inline-block text-[#2563eb] dark:text-blue-400 font-semibold text-sm hover:underline">
                            View Calendar →
                        </Link>
                    </div>
                </div>
            </section>

            {/* 6. JOIN THE CLUB CTA */}
            <section className="bg-[#1e3a8a] dark:bg-slate-900 py-32 px-6 text-center border-t border-transparent dark:border-slate-800 transition-colors">
                <div className="max-w-4xl mx-auto reveal-element">
                    <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6">
                        Become part of something meaningful.
                    </h2>
                    <p className="text-blue-200 dark:text-slate-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light">
                        We are always looking for driven individuals to join our ranks and contribute to the next generation of campus technology.
                    </p>
                    <Link
                        to="/apply"
                        className="inline-block px-10 py-4 bg-white dark:bg-blue-600 text-[#1e3a8a] dark:text-white font-semibold rounded hover:bg-slate-50 dark:hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-950/20"
                    >
                        Apply for Membership
                    </Link>
                </div>
            </section>
        </div>
    );
};


export default Home;



