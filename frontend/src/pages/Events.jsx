import { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import EventCard from '../components/EventCard';
import { Loader2 } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await eventService.getAll();
                setEvents(response.data || []);
            } catch (err) {
                setError('Failed to load events. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#1e3a8a] animate-spin mb-4" />
                <p className="text-[#475569] font-medium">Loading university calendar...</p>
            </div>
        );
    }

    const upcomingEvents = events.filter(e => new Date(e.date) > new Date());
    const pastEvents = events.filter(e => new Date(e.date) <= new Date());

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <header className="py-20 px-6 max-w-7xl mx-auto border-b border-slate-100 mb-16">
                <div className="reveal-element">
                    <span className="inline-block px-3 py-1 bg-[#dbeafe] text-[#2563eb] text-[10px] uppercase font-bold tracking-widest rounded mb-6">
                        Calendar
                    </span>
                    <h1 className="text-4xl md:text-6xl font-semibold text-[#1e3a8a] mb-6 leading-tight">
                        Upcoming Events
                    </h1>
                    <p className="text-lg text-[#475569] max-w-2xl leading-relaxed">
                        Join our technical workshops, research symposiums, and guest lectures designed to foster engineering excellence.
                    </p>
                </div>
            </header>

            {/* Events List */}
            <main className="max-w-4xl mx-auto px-6 pb-24">
                {error ? (
                    <div className="text-center py-20 bg-[#f8fafc] rounded border border-slate-200">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                ) : upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingEvents.map((event, index) => (
                            <div key={event.id} className="reveal-element" style={{ transitionDelay: `${index * 50}ms` }}>
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#f8fafc] rounded border border-slate-200 mb-16">
                        <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">No Upcoming Events</h3>
                        <p className="text-[#475569]">Check back soon for the next semester schedule.</p>
                    </div>
                )}

                {/* Past Events Section */}
                {pastEvents.length > 0 && (
                    <section className="mt-24">
                        <div className="mb-12 border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-[#94a3b8] uppercase tracking-widest">Past Events Archive</h2>
                        </div>
                        <div className="space-y-4 opacity-70">
                            {pastEvents.map((event, index) => (
                                <div key={event.id} className="reveal-element">
                                    <EventCard event={event} isPast={true} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Events;
