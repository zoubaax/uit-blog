import { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';
import {
    Mail,
    Phone,
    GraduationCap,
    Clock,
    User,
    Filter,
    Search,
    Calendar,
    Download,
    Trash2,
    AlertCircle,
    CheckCircle,
    ClipboardList,
    MessageSquare,
    Eye,
    X,
    Loader2
} from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';
import { exportToCSV } from '../../utils/exportUtils';

// Helper to format Moroccan or international phone number for WhatsApp direct URL
const getWhatsAppUrl = (phone) => {
    if (!phone) return '#';
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('00')) {
        clean = clean.slice(2);
    } else if (clean.startsWith('0')) {
        clean = '212' + clean.slice(1);
    } else if (!clean.startsWith('212') && clean.length === 9) {
        clean = '212' + clean;
    }
    return `https://wa.me/${clean}`;
};

// WhatsApp Brand SVG Icon
const WhatsAppIcon = ({ className = "w-3.5 h-3.5" }) => (
    <svg 
        className={className} 
        fill="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
);

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMajor, setSelectedMajor] = useState('all');
    const [joinEnabled, setJoinEnabled] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null); // for detail modal

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [appsRes, statusRes] = await Promise.all([
                settingsService.getApplications(),
                settingsService.getJoinStatus()
            ]);
            setApplications(appsRes.data || []);
            setJoinEnabled(statusRes.enabled);
        } catch (err) {
            console.error('Failed to load applications data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePortal = async () => {
        setToggling(true);
        try {
            const newStatus = !joinEnabled;
            await settingsService.toggleJoinForm(newStatus);
            setJoinEnabled(newStatus);
        } catch (err) {
            alert('Failed to update portal status');
        } finally {
            setToggling(false);
        }
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        if (window.confirm('Are you sure you want to permanently delete this application?')) {
            try {
                await settingsService.deleteApplication(id);
                setApplications(prev => prev.filter(app => app.id !== id));
                if (selectedApp?.id === id) setSelectedApp(null);
            } catch (err) {
                alert('Failed to delete application');
            }
        }
    };

    const handleClearAll = async () => {
        if (window.confirm('CRITICAL ACTION: Are you sure you want to delete ALL applications? This cannot be undone.')) {
            try {
                await settingsService.clearAllApplications();
                setApplications([]);
                setSelectedApp(null);
            } catch (err) {
                alert('Failed to clear applications');
            }
        }
    };

    // Extract unique majors
    const majors = ['all', ...new Set(applications.map(app => app.major).filter(Boolean))];

    // Filter applications
    const filteredApplications = applications.filter(app => {
        const matchesSearch = 
            app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.motivation?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMajor = selectedMajor === 'all' || app.major === selectedMajor;
        return matchesSearch && matchesMajor;
    });

    if (loading) {
        return <SectionLoader message="Loading membership applications..." />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Membership Applications</h1>
                    <p className="text-gray-500 mt-1">
                        {applications.length} candidate{applications.length !== 1 ? 's' : ''} applied for club membership
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {/* Recruitment Portal Quick Toggle */}
                    <button
                        onClick={handleTogglePortal}
                        disabled={toggling}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            joinEnabled
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                        title="Toggle whether public applications are currently open or closed"
                    >
                        {toggling ? (
                            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        ) : joinEnabled ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-400" />
                        )}
                        <span>Recruitment: <strong>{joinEnabled ? 'Open' : 'Closed'}</strong></span>
                    </button>

                    {/* Export CSV */}
                    <button
                        onClick={() => exportToCSV(filteredApplications, 'club_applications', ['Full Name', 'Email', 'Phone', 'Major', 'Motivation', 'Created At'])}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-xs shadow-sm"
                    >
                        <Download className="w-4 h-4 text-gray-500" />
                        Export CSV
                    </button>

                    {/* Purge All */}
                    {applications.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors font-semibold text-xs"
                        >
                            <Trash2 className="w-4 h-4" />
                            Purge All
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Dossiers</p>
                        <p className="text-2xl font-bold text-gray-900 mt-0.5">{applications.length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Levels</p>
                        <p className="text-2xl font-bold text-gray-900 mt-0.5">
                            {majors.filter(m => m !== 'all').length || 0}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                        joinEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                        {joinEnabled ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Portal Status</p>
                        <p className={`text-2xl font-bold mt-0.5 ${joinEnabled ? 'text-emerald-600' : 'text-gray-700'}`}>
                            {joinEnabled ? 'Active' : 'Offline'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by candidate name, email, phone, or motivation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Filter by Major */}
                    <div className="flex items-center gap-2 min-w-[240px]">
                        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <select
                            value={selectedMajor}
                            onChange={(e) => setSelectedMajor(e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer font-medium text-gray-700"
                        >
                            <option value="all">All Departments / Years</option>
                            {majors.filter(m => m !== 'all').map((major, index) => (
                                <option key={index} value={major}>
                                    {major}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="text-xs font-semibold text-gray-400 px-2 self-center">
                        {filteredApplications.length} candidate{filteredApplications.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* Table Area */}
            {filteredApplications.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ClipboardList className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No applications found</h3>
                    <p className="text-gray-500 text-sm">
                        {searchTerm || selectedMajor !== 'all'
                            ? 'No applications match your current search or department filter'
                            : 'New candidates applying through the registration page will appear here'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                                <tr>
                                    <th className="px-6 py-4 w-12 text-center">#</th>
                                    <th className="px-6 py-4">Candidate</th>
                                    <th className="px-6 py-4">Contact Details</th>
                                    <th className="px-6 py-4">Faculty / Major</th>
                                    <th className="px-6 py-4">Motivation</th>
                                    <th className="px-6 py-4">Date Applied</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredApplications.map((app, index) => {
                                    const initials = app.full_name
                                        ?.split(' ')
                                        .map(n => n[0])
                                        .slice(0, 2)
                                        .join('')
                                        .toUpperCase() || 'U';

                                    return (
                                        <tr 
                                            key={app.id} 
                                            className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                                            onClick={() => setSelectedApp(app)}
                                        >
                                            {/* Row Index */}
                                            <td className="px-6 py-4 text-center text-xs font-semibold text-gray-400">
                                                {index + 1}
                                            </td>

                                            {/* Candidate */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-[#1e3a8a] text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {app.full_name}
                                                        </p>
                                                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                                                            ID #{app.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact Details */}
                                            <td className="px-6 py-4 space-y-1" onClick={(e) => e.stopPropagation()}>
                                                <a
                                                    href={`mailto:${app.email}`}
                                                    className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors"
                                                >
                                                    <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                                    <span>{app.email}</span>
                                                </a>
                                                {app.phone ? (
                                                    <a
                                                        href={getWhatsAppUrl(app.phone)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-emerald-600 transition-colors group/phone"
                                                        title={`Open WhatsApp chat with ${app.phone}`}
                                                    >
                                                        <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-500 group-hover/phone:scale-110 transition-transform flex-shrink-0" />
                                                        <span className="group-hover/phone:underline font-mono">{app.phone}</span>
                                                    </a>
                                                ) : (
                                                    <span className="flex items-center gap-2 text-xs text-gray-300">
                                                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                                        <span>No phone</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Faculty / Major */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                                                    <GraduationCap className="w-3 h-3 mr-1" />
                                                    {app.major || 'Engineering'}
                                                </span>
                                            </td>

                                            {/* Motivation Snippet */}
                                            <td className="px-6 py-4 max-w-xs">
                                                <div 
                                                    className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                                                    title="Click to read full statement"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                                    <p className="truncate italic">
                                                        "{app.motivation || 'No motivation provided.'}"
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Applied Date */}
                                            <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>
                                                        {new Date(app.created_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => setSelectedApp(app)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Full Application"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(app.id, e)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Dossier"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Application Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-[#1e3a8a] text-white rounded-xl flex items-center justify-center font-bold text-base shadow-sm">
                                    {selectedApp.full_name
                                        ?.split(' ')
                                        .map(n => n[0])
                                        .slice(0, 2)
                                        .join('')
                                        .toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{selectedApp.full_name}</h3>
                                    <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100 mt-0.5">
                                        <GraduationCap className="w-3 h-3 mr-1" />
                                        {selectedApp.major || 'Engineering'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email Address</p>
                                <a href={`mailto:${selectedApp.email}`} className="text-blue-600 font-semibold hover:underline break-all">
                                    {selectedApp.email}
                                </a>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                                <div>
                                    {selectedApp.phone ? (
                                        <a 
                                            href={getWhatsAppUrl(selectedApp.phone)} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                                            title={`Open WhatsApp chat with ${selectedApp.phone}`}
                                        >
                                            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                            <span className="font-mono">{selectedApp.phone}</span>
                                            <span className="text-[9px] uppercase tracking-wider bg-white text-emerald-700 px-1 py-0.5 rounded font-bold border border-emerald-200 ml-0.5">
                                                WhatsApp
                                            </span>
                                        </a>
                                    ) : (
                                        <span className="text-xs text-gray-400 font-medium">Not specified</span>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-2 pt-2 border-t border-gray-200/60 flex items-center justify-between">
                                <span className="text-gray-400">Date Received</span>
                                <span className="font-semibold text-gray-700">
                                    {new Date(selectedApp.created_at).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Full Motivation Statement */}
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                Statement of Motivation
                            </p>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-gray-800 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-sans">
                                {selectedApp.motivation || 'No motivation statement provided.'}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-2 flex justify-between items-center">
                            <button
                                onClick={() => handleDelete(selectedApp.id)}
                                className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                Delete Dossier
                            </button>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="px-5 py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Applications;