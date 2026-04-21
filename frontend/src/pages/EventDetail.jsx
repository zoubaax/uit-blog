import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import PageLoader from '../components/PageLoader';
import EventRegistrationForm from '../components/EventRegistrationForm';

import { getOptimizedImageUrl } from '../utils/cloudinaryUtils';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await eventService.getById(id);
                setEvent(response.data);
            } catch (err) {
                setError('Event not found or failed to load.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) {
        return <PageLoader message="Loading event" />;
    }

    if (error || !event) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <p className="text-red-600 text-lg">{error || 'Event not found'}</p>
                <button onClick={() => navigate('/events')} className="text-[#2563eb] font-bold uppercase text-xs tracking-widest hover:underline">Return to calendar</button>
            </div>
        );
    }

    const eventDate = new Date(event.date);
    const deadline = event.registration_deadline ? new Date(event.registration_deadline) : null;
    const isDeadlinePassed = deadline && new Date() > deadline;
    const isFull = event.max_participants && event.current_registrations >= event.max_participants;

    return (
        <article className="bg-white min-h-screen pt-20">
            {/* Header Section */}
            <header className="max-w-7xl mx-auto px-6 pt-12 pb-20 border-b border-slate-100">
                <button
                    onClick={() => navigate('/events')}
                    className="flex items-center gap-2 text-[#94a3b8] hover:text-[#1e3a8a] transition-colors mb-12 text-xs font-bold uppercase tracking-widest group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Calendar
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="reveal-element">
                        <span className="inline-block px-3 py-1 bg-[#dbeafe] text-[#2563eb] text-[10px] uppercase font-bold tracking-widest rounded mb-6">
                            Campus Event
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0f172a] mb-10 leading-tight tracking-tight">
                            {event.title}
                        </h1>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 text-[#475569]">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Schedule</span>
                                <span className="text-sm font-semibold flex items-center gap-2 text-[#1e3a8a]">
                                    <Calendar className="w-4 h-4 text-[#2563eb]" />
                                    {eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Venue</span>
                                <span className="text-sm font-semibold flex items-center gap-2 text-[#1e3a8a]">
                                    <MapPin className="w-4 h-4 text-[#2563eb]" />
                                    {event.location}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xl shadow-blue-900/10 bg-slate-50">
                        <img
                            src={event.cover_image_url ? getOptimizedImageUrl(event.cover_image_url, 1200) : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'}
                            alt={event.title}
                            className="w-full h-auto max-h-[600px] object-contain"
                        />
                    </div>
                </div>
            </header>

            {/* Content Section */}
            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-[#1e3a8a] uppercase tracking-widest mb-8 pb-4 border-b border-slate-50">Overview</h2>
                        <div className="prose prose-slate prose-lg max-w-none text-[#475569] leading-relaxed whitespace-pre-line">
                            {event.description}
                        </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <EventRegistrationForm
                                eventId={event.id}
                                eventTitle={event.title}
                                isDeadlinePassed={isDeadlinePassed}
                                isFull={isFull}
                                deadline={deadline}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </article>
    );
};

export default EventDetail;
