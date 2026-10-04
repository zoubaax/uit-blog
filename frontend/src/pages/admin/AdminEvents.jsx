import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import eventService from '../../services/eventService';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Users, 
  Edit2, 
  Eye, 
  EyeOff,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, past, hidden
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await eventService.getAll();
      setEvents(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.delete(id);
        setEvents(events.filter(e => e.id !== id));
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  const toggleVisibility = async (event) => {
    try {
      const updated = await eventService.update(event.id, { is_hidden: !event.is_hidden });
      setEvents(events.map(e => e.id === event.id ? { ...e, is_hidden: updated.data.is_hidden } : e));
    } catch (error) {
      alert('Failed to update visibility');
    }
  };

  // Filter events
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const now = new Date();
      const eventDate = new Date(event.date);
      
      if (filter === 'upcoming') return eventDate >= now && !event.is_hidden;
      if (filter === 'past') return eventDate < now;
      if (filter === 'hidden') return event.is_hidden;
      return true; // 'all'
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

  if (loading) {
    return <SectionLoader message="Loading events" />;
  }

  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    
    if (event.is_hidden) return { label: 'Hidden', color: 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300', icon: EyeOff };
    if (eventDate < now) return { label: 'Past', color: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300', icon: Calendar };
    if (event.current_registrations >= event.max_participants && event.max_participants > 0) {
      return { label: 'Full', color: 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-300', icon: AlertCircle };
    }
    return { label: 'Upcoming', color: 'bg-green-50 dark:bg-emerald-950/50 text-green-600 dark:text-emerald-300', icon: CheckCircle };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Events</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            {events.length} event{events.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <NavLink
          to="/dashboard/events/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Event
        </NavLink>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400 dark:text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past Events</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-12 text-center">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No events found</h3>
          <p className="text-gray-500 dark:text-slate-400 mb-6">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter' 
              : 'Start by creating your first event'}
          </p>
          <NavLink
            to="/dashboard/events/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </NavLink>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const status = getEventStatus(event);
              const StatusIcon = status.icon;
              const now = new Date();
              const eventDate = new Date(event.date);
              const isPast = eventDate < now;
              
              return (
                <div 
                  key={event.id} 
                  className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-shadow flex flex-col"
                >
                  {/* Event Header */}
                  <div className="p-6 pb-4 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleVisibility(event)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title={event.is_hidden ? "Show Event" : "Hide Event"}
                        >
                          {event.is_hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/events/edit/${event.id}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-3 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Event Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-slate-200">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          {event.time && (
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {event.time}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                        <span className="text-sm text-gray-600 dark:text-slate-300">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-slate-400">Registrations</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {event.current_registrations || 0}
                              {event.max_participants > 0 && ` / ${event.max_participants}`}
                            </span>
                          </div>
                          {event.max_participants > 0 && (
                            <div className="mt-1 h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full"
                                style={{ 
                                  width: `${Math.min(100, ((event.current_registrations || 0) / event.max_participants) * 100)}%` 
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2 mt-4">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-6 pt-4 border-t border-gray-100 dark:border-slate-800">
                    <NavLink
                      to={`/dashboard/events/${event.id}/registrations`}
                      className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isPast 
                          ? 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      View Participants
                    </NavLink>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-500 dark:text-slate-400">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </>
      )}

      {/* Event Stats */}
      {events.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-blue-100 dark:border-slate-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Event Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
              <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Events</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{events.length}</div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
              <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Upcoming</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {events.filter(e => new Date(e.date) >= new Date() && !e.is_hidden).length}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
              <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Hidden</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {events.filter(e => e.is_hidden).length}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
              <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Registrations</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {events.reduce((sum, e) => sum + (e.current_registrations || 0), 0)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;