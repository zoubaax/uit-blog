import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import articleService from '../services/articleService';
import eventService from '../services/eventService';
import teamService from '../services/teamService';
import { Loader2 } from 'lucide-react';
import bannerImage from '../assets/banner.png';

/**
 * UIT CLUB HOMEPAGE
 * Style: Academic & Professional (MIT/Stanford inspired)
 * Tech: React + Tailwind CSS v4
 */

// --- DYNAMIC DATA HOOKS ---
const useReveal = () => {
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
            el.classList.add('reveal-hidden');
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);
};

const Home = () => {
  useReveal();
  
  const [stats, setStats] = useState({ members: 0, articles: 0, events: 0 });
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch articles
        const articlesResponse = await articleService.getAll();
        const allArticles = articlesResponse.data || [];
        setArticles(allArticles.slice(0, 3)); // Get first 3 for homepage

        // Fetch events
        const eventsResponse = await eventService.getAll();
        const allEvents = eventsResponse.data || [];
        const upcomingEvents = allEvents
          .filter(e => new Date(e.date) > new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 4); // Get next 4 upcoming events
        setEvents(upcomingEvents);

        // Fetch team members count
        const teamResponse = await teamService.getAll();
        const members = teamResponse.data || [];

        // Update stats
        setStats({
          members: members.length,
          articles: allArticles.length,
          events: allEvents.length
        });
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#1e3a8a] animate-spin mb-4" />
        <p className="text-[#475569] font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 2. HERO */}
      <header className="relative pt-28 pb-12 md:pt-36 md:pb-24 flex flex-col items-center text-center px-4 sm:px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={bannerImage}
            alt="UPF Campus"
            className="w-full h-full object-cover"
          />
          {/* Graduated glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/50 backdrop-blur-sm"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 reveal-element w-full max-w-7xl mx-auto">
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] uppercase font-bold tracking-widest rounded-full mb-4 md:mb-6 italic">
                University of IT Club
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-semibold text-white leading-[1.1] mb-4 md:mb-6 max-w-4xl mx-auto drop-shadow-lg">
                Built by students.<br /> Driven by knowledge.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed drop-shadow">
                A technical collective dedicated to fostering engineering excellence and research collaboration across the university campus.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 md:mb-16 w-full sm:w-auto px-4 sm:px-0">
                <Link 
                    to="/articles" 
                    className="px-6 py-3 sm:px-8 sm:py-3 bg-white text-[#1e3a8a] font-medium rounded hover:bg-slate-50 transition-all active:scale-95 shadow-sm text-center"
                >
                    Explore Articles
                </Link>
                <Link 
                    to="/team" 
                    className="px-6 py-3 sm:px-8 sm:py-3 bg-white text-[#1e3a8a] font-medium rounded hover:bg-slate-50 transition-all active:scale-95 shadow-sm text-center"
                >
                    Meet the Team
                </Link>
            </div>
        </div>
      </header>

      {/* 3. MISSION STRIP */}
      <section className="bg-[#f8fafc] py-20 px-6">
        <div className="max-w-7xl mx-auto reveal-element">
            <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start">
                <div className="text-6xl md:text-8xl font-bold text-[#dbeafe]/60 leading-none">
                    01
                </div>
                <div className="max-w-3xl">
                    <p className="text-2xl md:text-3xl font-medium text-[#1e3a8a] leading-tight italic">
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
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#2563eb] border-b-2 border-[#2563eb] pb-1">
                    Knowledge Hub
                </span>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
                {articles.length > 0 ? (
                    articles.map((article, i) => (
                        <Link 
                            key={article.id} 
                            to={`/articles/${article.id}`}
                            className="group flex flex-col bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-0.5 reveal-element overflow-hidden rounded-lg"
                            style={{ transitionDelay: `${i * 50}ms` }}
                        >
                            {/* Article Image */}
                            <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                                <img
                                    src={article.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800';
                                    }}
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="inline-block px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[#2563eb] text-[10px] font-bold uppercase tracking-wider rounded">
                                        Article
                                    </span>
                                </div>
                            </div>
                            
                            {/* Article Content */}
                            <div className="flex flex-col p-6 flex-1">
                                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-3 group-hover:text-[#2563eb] transition-colors leading-snug line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-[#475569] mb-4 line-clamp-2 leading-relaxed flex-1">
                                    {article.content?.substring(0, 120)}...
                                </p>
                                <div className="mt-auto flex items-center justify-between text-[11px] text-[#94a3b8] uppercase font-semibold tracking-wide pt-4 border-t border-slate-50">
                                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                    <span className="text-[#2563eb] group-hover:underline">Read →</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-12 bg-[#f8fafc] rounded border border-slate-200">
                        <p className="text-[#475569]">No articles available yet.</p>
                    </div>
                )}
            </div>
            
            <Link to="/articles" className="inline-block text-[#2563eb] font-semibold text-sm hover:underline">
                Browse All Articles →
            </Link>
        </div>
      </section>

      {/* 5. UPCOMING EVENTS */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-100">
        <div className="reveal-element">
            <div className="mb-12">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#2563eb] border-b-2 border-[#2563eb] pb-1">
                    Upcoming Events
                </span>
            </div>
            
            <div className="max-w-4xl">
                {events.length > 0 ? (
                    events.map((event, i) => {
                        const eventDate = new Date(event.date);
                        const day = eventDate.getDate().toString().padStart(2, '0');
                        const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                        
                        return (
                            <div 
                                key={event.id} 
                                className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] py-8 border-b border-slate-100 first:pt-0 reveal-element"
                                style={{ transitionDelay: `${i * 50}ms` }}
                            >
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-[#1e3a8a]">{day}</span>
                                    <span className="text-xs font-bold text-[#94a3b8]">{month}</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-[#1e3a8a] mb-2">{event.title}</h4>
                                    <p className="text-[#475569] text-sm leading-relaxed max-w-xl">
                                        {event.description?.substring(0, 120)}...
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 bg-[#f8fafc] rounded border border-slate-200">
                        <p className="text-[#475569]">No upcoming events scheduled.</p>
                    </div>
                )}
            </div>
            
            <div className="mt-12">
                <Link to="/events" className="inline-block text-[#2563eb] font-semibold text-sm hover:underline">
                    View Calendar →
                </Link>
            </div>
        </div>
      </section>

      {/* 6. JOIN THE CLUB CTA */}
      <section className="bg-[#1e3a8a] py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto reveal-element">
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6">
                Become part of something meaningful.
            </h2>
            <p className="text-blue-200 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light">
                We are always looking for driven individuals to join our ranks and contribute to the next generation of campus technology.
            </p>
            <Link 
                to="/apply" 
                className="inline-block px-10 py-4 bg-white text-[#1e3a8a] font-semibold rounded hover:bg-slate-50 transition-all active:scale-95"
            >
                Apply for Membership
            </Link>
        </div>
      </section>
    </div>
  );
};


export default Home;



