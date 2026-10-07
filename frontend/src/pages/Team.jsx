import { useState, useEffect } from 'react';
import teamService from '../services/teamService';
import TeamCard from '../components/TeamCard';
import PageLoader from '../components/PageLoader';
import usePageMeta from '../hooks/usePageMeta';

const Team = () => {
    usePageMeta({
        title: 'Leadership & Team',
        description: 'Meet the executive board and leads driving innovation at UIT Club, UPF University.'
    });

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await teamService.getAll();
                setMembers(response.data || []);
            } catch (err) {
                setError('Failed to load team members. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-200">
            {/* Header Section */}
            <header className="pt-28 md:pt-32 pb-12 md:pb-20 px-4 sm:px-6 max-w-7xl mx-auto border-b border-slate-100 dark:border-slate-800 mb-12 md:mb-16 text-center">
                <div className="reveal-element">
                    <span className="inline-block px-3 py-1 bg-[#dbeafe] dark:bg-blue-950/60 text-[#2563eb] dark:text-blue-400 text-[10px] uppercase font-bold tracking-widest rounded border border-transparent dark:border-blue-800/40 mb-6">
                        Leadership
                    </span>
                    <h1 className="text-4xl md:text-6xl font-semibold text-[#1e3a8a] dark:text-white mb-6 leading-tight">
                        Our Dedicated Team
                    </h1>
                    <p className="text-lg text-[#475569] dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        The talented individuals guiding the UIT Club towards engineering excellence and student innovation.
                    </p>
                </div>
            </header>

            {/* Team Grid */}
            <main className="max-w-7xl mx-auto px-6 pb-24">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="flex flex-col items-center space-y-4 animate-pulse">
                                <div className="w-48 h-48 rounded-2xl bg-slate-100 dark:bg-slate-800" />
                                <div className="h-5 bg-slate-200/80 dark:bg-slate-700 rounded w-32" />
                                <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-24" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-[#f8fafc] dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                    </div>
                ) : members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {members.map((member, index) => (
                            <div key={member.id} className="reveal-element" style={{ transitionDelay: `${index * 50}ms` }}>
                                <TeamCard member={member} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#f8fafc] dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-[#1e3a8a] dark:text-blue-300 mb-2">Notice</h3>
                        <p className="text-[#475569] dark:text-slate-400">Leadership data currently under review.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Team;
