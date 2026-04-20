import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/**
 * UIT CLUB HOMEPAGE
 * Style: Academic & Professional (MIT/Stanford inspired)
 * Tech: React + Tailwind CSS v4
 */

// --- MOCK DATA ---
const STATS = [
  { label: 'Active Members', value: '120+' },
  { label: 'Published Articles', value: '45' },
  { label: 'Annual Events', value: '12' },
];

const ARTICLES = [
  {
    id: 1,
    category: 'Engineering',
    title: 'The Future of Distributed Systems in Campus Infrastructure',
    excerpt: 'Exploring how decentralized computing can streamline university resource management.',
    author: 'Alex Chen',
    readTime: '6 min read'
  },
  {
    id: 2,
    category: 'Research',
    title: 'Machine Learning Patterns in Urban Mobility',
    excerpt: 'A study on how transit data can predict peak congestion in metropolitan areas.',
    author: 'Sarah Jenkins',
    readTime: '8 min read'
  },
  {
    id: 3,
    category: 'Innovation',
    title: 'Beyond the Sandbox: Deploying Student Projects to Production',
    excerpt: 'Best practices for moving from local development to a globally accessible platform.',
    author: 'Michael Vogt',
    readTime: '5 min read'
  }
];

const EVENTS = [
  {
    id: 1,
    day: '24',
    month: 'APR',
    title: 'Spring Hackathon: AI for Education',
    description: 'A 48-hour challenge to build tools that assist peer-to-peer learning.'
  },
  {
    id: 2,
    day: '05',
    month: 'MAY',
    title: 'Tech Talk: Cyber-Security in 2026',
    description: 'Guest lecture from industry leaders on the evolving landscape of digital defense.'
  },
  {
    id: 3,
    day: '12',
    month: 'MAY',
    title: 'Workshop: Modern Cloud Architectures',
    description: 'Hands-on session covering serverless deployments and edge computing.'
  },
  {
    id: 4,
    day: '19',
    month: 'MAY',
    title: 'General Body Meeting',
    description: 'Discussion of upcoming summer research opportunities and club elections.'
  }
];

// --- REVEAL ANIMATION HOOK ---
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

  return (
    <div className="min-h-screen bg-white">
      {/* 2. HERO */}
      <header className="py-24 md:py-32 flex flex-col items-center text-center px-6">
        <div className="reveal-element">
            <span className="inline-block px-3 py-1 bg-[#dbeafe] text-[#2563eb] text-[10px] uppercase font-bold tracking-widest rounded-full mb-6 italic">
                University of IT Club
            </span>
            <h1 className="text-5xl md:text-7xl font-semibold text-[#1e3a8a] leading-[1.1] mb-6 max-w-4xl mx-auto">
                Built by students.<br /> Driven by knowledge.
            </h1>
            <p className="text-lg md:text-xl text-[#475569] max-w-2xl mx-auto mb-10 leading-relaxed">
                A technical collective dedicated to fostering engineering excellence and research collaboration across the university campus.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
                <Link 
                    to="/articles" 
                    className="px-8 py-3 bg-[#1e3a8a] text-white font-medium rounded hover:bg-[#1e1e6b] transition-all active:scale-95"
                >
                    Explore Articles
                </Link>
                <Link 
                    to="/team" 
                    className="px-8 py-3 border border-slate-200 text-[#1e3a8a] font-medium rounded hover:bg-slate-50 transition-all active:scale-95"
                >
                    Meet the Team
                </Link>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 pt-12 border-t border-slate-100 w-full max-w-3xl">
                {STATS.map((stat, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <span className="text-2xl font-semibold text-[#1e3a8a] mb-1">{stat.value}</span>
                        <span className="text-xs text-[#94a3b8] uppercase tracking-wider">{stat.label}</span>
                    </div>
                ))}
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
                {ARTICLES.map((article, i) => (
                    <Link 
                        key={article.id} 
                        to={`/articles/${article.id}`}
                        className="group flex flex-col p-8 border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-0.5 reveal-element"
                        style={{ transitionDelay: `${i * 50}ms` }}
                    >
                        <span className="inline-block w-fit px-2 py-0.5 bg-[#dbeafe] text-[#2563eb] text-[10px] font-bold uppercase tracking-wider rounded mb-6">
                            {article.category}
                        </span>
                        <h3 className="text-xl font-semibold text-[#1e3a8a] mb-4 group-hover:text-[#2563eb] transition-colors leading-snug">
                            {article.title}
                        </h3>
                        <p className="text-sm text-[#475569] mb-8 line-clamp-2 leading-relaxed">
                            {article.excerpt}
                        </p>
                        <div className="mt-auto flex items-center justify-between text-[11px] text-[#94a3b8] uppercase font-semibold tracking-wide">
                            <span>{article.author}</span>
                            <span>{article.readTime}</span>
                        </div>
                    </Link>
                ))}
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
                {EVENTS.map((event, i) => (
                    <div 
                        key={event.id} 
                        className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] py-8 border-b border-slate-100 first:pt-0 reveal-element"
                        style={{ transitionDelay: `${i * 50}ms` }}
                    >
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-[#1e3a8a]">{event.day}</span>
                            <span className="text-xs font-bold text-[#94a3b8]">{event.month}</span>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-[#1e3a8a] mb-2">{event.title}</h4>
                            <p className="text-[#475569] text-sm leading-relaxed max-w-xl">{event.description}</p>
                        </div>
                    </div>
                ))}
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



