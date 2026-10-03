import { MapPin, ArrowRight, Camera, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOptimizedImageUrl } from '../utils/cloudinaryUtils';

const EventCard = ({ event, isPast }) => {
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();

    return (
        <Link 
            to={`/events/${event.id}`}
            className="group grid grid-cols-[100px_1fr] md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr] py-8 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors px-4 -mx-4 gap-6 rounded-2xl"
        >
            {/* Visual Column */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <span className="text-2xl font-bold text-[#1e3a8a]">{day}</span>
                    <span className="text-xs font-bold text-[#94a3b8]">{month}</span>
                </div>
                <div className="aspect-[4/5] w-full rounded-xl overflow-hidden border border-slate-100 shadow-sm relative bg-slate-100">
                    <img 
                        src={event.cover_image_url ? getOptimizedImageUrl(event.cover_image_url, 400, 500) : 'https://images.unsplash.com/photo-1540575861501-7ad058138a31?auto=format&fit=crop&q=80&w=600'} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5"></div>
                    {event.recap_article_id && (
                        <span className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                            Recap Ready
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1.5">
                    {event.recap_article_id ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Camera className="w-3 h-3" /> Event Recap Available
                        </span>
                    ) : isPast ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            <CheckCircle2 className="w-3 h-3" /> Event Completed
                        </span>
                    ) : null}
                </div>

                <h4 className="text-xl font-semibold text-[#1e3a8a] mb-2 group-hover:text-[#2563eb] transition-colors leading-snug">
                    {event.title}
                </h4>
                
                <p className="text-[#475569] text-sm leading-relaxed max-w-xl mb-4 line-clamp-2">
                    {event.description}
                </p>

                <div className="flex items-center gap-2 text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mt-auto">
                    <div className="flex items-center gap-1 truncate max-w-[250px]">
                        <MapPin className="w-3 h-3 text-[#2563eb] flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                    </div>

                    {event.recap_article_id ? (
                        <span className="ml-auto inline-flex items-center gap-1.5 text-emerald-600 font-bold group-hover:translate-x-0.5 transition-transform normal-case text-xs">
                            <span>Read Story & Photos</span>
                            <ArrowRight className="w-3 h-3" />
                        </span>
                    ) : !isPast ? (
                        <span className="ml-auto flex items-center gap-1.5 text-[#2563eb] normal-case text-xs font-semibold">
                            Register Now <ArrowRight className="w-3 h-3" />
                        </span>
                    ) : (
                        <span className="ml-auto text-slate-400 font-medium normal-case text-xs">
                            View Archive →
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
