import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, isPast }) => {
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();

    return (
        <Link 
            to={`/events/${event.id}`}
            className="group grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] py-8 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors px-4 -mx-4"
        >
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#1e3a8a]">{day}</span>
                <span className="text-xs font-bold text-[#94a3b8]">{month}</span>
            </div>
            <div>
                <h4 className="text-xl font-semibold text-[#1e3a8a] mb-2 group-hover:text-[#2563eb] transition-colors">{event.title}</h4>
                <p className="text-[#475569] text-sm leading-relaxed max-w-xl mb-4">{event.description}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">
                    <MapPin className="w-3 h-3 text-[#2563eb]" />
                    {event.location}
                    {!isPast && (
                        <span className="ml-auto flex items-center gap-2 text-[#2563eb]">
                            Register <ArrowRight className="w-3 h-3" />
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default EventCard;

