import React, { useState } from 'react';
import { ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const tracks = [
    {
        number: '01',
        title: 'Artificial Intelligence & Data Science',
        category: 'Research & Applications',
        badgeColor: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        tagline: 'Pushing the boundaries of generative AI, large language models, and multimodal intelligence.',
        description: 'Hands-on exploration of generative AI, LLMs, computer vision, and predictive analytics. Members study contemporary research papers, fine-tune open models, and deploy production AI solutions — including our recent 1st Place victory at the Google Build with Gemma Hackathon.',
        bullets: [
            '1st Place Winners at Google Build with Gemma Hackathon',
            'Weekly research paper reading circles & LLM fine-tuning',
            'Computer vision, NLP pipelines, and autonomous AI agents'
        ],
        techStack: ['PyTorch', 'Hugging Face', 'Gemma', 'LangChain', 'Python', 'OpenCV']
    },
    {
        number: '02',
        title: 'Software & Cloud Architecture',
        category: 'Systems & Architecture',
        badgeColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        tagline: 'Engineering resilient web platforms, microservices, and distributed cloud systems.',
        description: 'Engineering resilient, scalable web applications and distributed architectures. Members master contemporary front-end frameworks, high-throughput microservices, Docker containerization, and automated CI/CD deployment pipelines on modern cloud infrastructure.',
        bullets: [
            'Production-grade full-stack web platforms built for campus scale',
            'Docker containerization, automated CI/CD & cloud deployments',
            'High-throughput RESTful microservices and PostgreSQL schemas'
        ],
        techStack: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Tailwind CSS', 'AWS']
    },
    {
        number: '03',
        title: 'Cybersecurity & Digital Defense',
        category: 'Offensive & Defensive',
        badgeColor: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        tagline: 'Hands-on ethical hacking, vulnerability discovery, and competitive CTF squads.',
        description: 'Deep dive into practical cybersecurity, offensive security labs, cryptography, and reverse engineering. We prepare members through simulated ethical hacking scenarios and assemble competitive squads for national and university CTF tournaments.',
        bullets: [
            'Assembled competitive squads for university & national CTF tournaments',
            'Hands-on web application penetration testing & vulnerability labs',
            'Applied cryptography, network packet analysis & reverse engineering'
        ],
        techStack: ['Kali Linux', 'Wireshark', 'Burp Suite', 'Ghidra', 'Python', 'Bash']
    },
    {
        number: '04',
        title: 'Competitive Coding & Hackathons',
        category: 'Competitions & Velocity',
        badgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        tagline: 'Algorithmic problem solving, velocity execution, and winning hackathons.',
        description: 'Rigorous training in advanced data structures, dynamic programming, graph algorithms, and time-complexity optimization. We form high-velocity squads that turn complex problem statements into winning working prototypes during 24-48 hour hackathons.',
        bullets: [
            'Assembling high-velocity squads that build and pitch winning 24h-48h MVPs',
            'Rigorous algorithm & data structures training for ICPC competitions',
            'Execution speed, pitch deck storytelling & live demo polish'
        ],
        techStack: ['C++', 'Algorithms', 'Data Structures', 'Python', 'Git', 'Fast Prototyping']
    }
];

const WhatWeDo = () => {
    // Collapsed by default like the FAQ design
    const [openIndex, setOpenIndex] = useState(null);

    const toggleTrack = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-100 dark:border-slate-800/80 transition-colors">
            <div className="reveal-element">
                {/* Header (Centered, Serif title matching FAQ) */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1e293b] dark:text-slate-100 tracking-tight mb-4">
                        What We Build & Explore
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                        Four specialized technical tracks designed to bridge classroom theory with real-world engineering, competitive hackathons, and research.
                    </p>
                </div>

                {/* Tracks List Cards (Same UI Form as FAQ) */}
                <div className="max-w-4xl mx-auto space-y-3.5 sm:space-y-4">
                    {tracks.map((track, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={track.number}
                                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700 overflow-hidden"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleTrack(index)}
                                    aria-expanded={isOpen}
                                    className="w-full py-5 px-6 sm:px-8 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none select-none"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                        <span className="font-mono text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 flex-shrink-0">
                                            {track.number}
                                        </span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-100 text-base sm:text-[17px] leading-snug truncate">
                                            {track.title}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border hidden sm:inline-block ${track.badgeColor}`}>
                                            {track.category}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-emerald-500 dark:text-emerald-400 stroke-[2.5] flex-shrink-0 transition-transform duration-300 ease-in-out ${
                                                isOpen ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </div>
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out px-6 sm:px-8 overflow-hidden ${
                                        isOpen ? 'max-h-[500px] pb-6 pt-1 opacity-100' : 'max-h-0 pb-0 pt-0 opacity-0'
                                    }`}
                                >
                                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-4">
                                        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-[15px] leading-relaxed">
                                            {track.description}
                                        </p>

                                        {/* Key Focus Highlights */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                                            {track.bullets.map((bullet, bIdx) => (
                                                <div
                                                    key={bIdx}
                                                    className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 p-2.5 rounded-xl text-xs text-slate-700 dark:text-slate-300"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                    <span className="leading-snug">{bullet}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tech Stack & Track Application Button */}
                                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                                                    Stack:
                                                </span>
                                                {track.techStack.map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>

                                            <Link
                                                to="/register"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:gap-2.5 transition-all self-start sm:self-auto"
                                            >
                                                <span>Apply to this track</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhatWeDo;
