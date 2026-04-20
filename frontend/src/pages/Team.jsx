import { useState, useEffect } from 'react';
import teamService from '../services/teamService';
import TeamCard from '../components/TeamCard';
import { Loader2 } from 'lucide-react';

const Team = () => {
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

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#1e3a8a] animate-spin mb-4" />
                <p className="text-[#475569] font-medium">Loading leadership board...</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <header className="pt-28 md:pt-32 pb-12 md:pb-20 px-4 sm:px-6 max-w-7xl mx-auto border-b border-slate-100 mb-12 md:mb-16 text-center">
                <div className="reveal-element">
                    <span className="inline-block px-3 py-1 bg-[#dbeafe] text-[#2563eb] text-[10px] uppercase font-bold tracking-widest rounded mb-6">
                        Leadership
                    </span>
                    <h1 className="text-4xl md:text-6xl font-semibold text-[#1e3a8a] mb-6 leading-tight">
                        Our Dedicated Team
                    </h1>
                    <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
                        The talented individuals guiding the UIT Club towards engineering excellence and student innovation.
                    </p>
                </div>
            </header>

            {/* Team Grid */}
            <main className="max-w-7xl mx-auto px-6 pb-24">
                {error ? (
                    <div className="text-center py-20 bg-[#f8fafc] rounded border border-slate-200">
                        <p className="text-red-600 font-medium">{error}</p>
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
                    <div className="text-center py-20 bg-[#f8fafc] rounded border border-slate-200">
                        <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">Notice</h3>
                        <p className="text-[#475569]">Leadership data currently under review.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Team;
