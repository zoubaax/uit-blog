import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import registrationService from '../../services/registrationService';
import eventService from '../../services/eventService';
import { ArrowLeft, Mail, Phone, School, User, Calendar, MapPin, Search, Download } from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';
import { exportToCSV } from '../../utils/exportUtils';

const AdminEventRegistrations = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, [eventId]);

    const loadData = async () => {
        try {
            const [regRes, eventRes] = await Promise.all([
                registrationService.getRegistrationsByEvent(eventId),
                eventService.getById(eventId)
            ]);
            setRegistrations(regRes.data || []);
            setEvent(eventRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRegistrations = registrations.filter(reg =>
        reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reg.school_name && reg.school_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <SectionLoader message="Loading registrations" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard/events')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Event Registrations</h1>
                    {event && (
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <span className="font-semibold">{event.title}</span> •
                            <Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => exportToCSV(filteredRegistrations, `registrations_${event?.title || 'event'}`, ['Full Name', 'Email', 'Phone', 'School Name', 'Created At'])}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email or school..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-blue-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                        Total Participants: <span className="text-blue-600 font-bold">{filteredRegistrations.length}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Full Name</th>
                                <th className="px-6 py-4 font-semibold">Contact</th>
                                <th className="px-6 py-4 font-semibold">School / Institution</th>
                                <th className="px-6 py-4 font-semibold">Date Registered</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRegistrations.map((reg) => (
                                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 flex items-center gap-2">
                                            {reg.full_name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 space-y-1">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="w-3.5 h-3.5" /> {reg.email}
                                        </div>
                                        {reg.phone && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Phone className="w-3.5 h-3.5" /> {reg.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <School className="w-3.5 h-3.5 text-gray-400" />
                                            {reg.school_name || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(reg.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {filteredRegistrations.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 bg-gray-50/50">
                                        No registrations found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminEventRegistrations;
