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
    Eye,
    X,
    Loader2
} from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';
import { exportToCSV } from '../../utils/exportUtils';

import ConfirmModal from '../../components/ConfirmModal';

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

    const [confirmTarget, setConfirmTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

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
            console.error('Failed to update portal status:', err);
        } finally {
            setToggling(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!confirmTarget) return;
        setDeleting(true);
        try {
            if (confirmTarget.type === 'single') {
                const appId = confirmTarget.app.id;
                await settingsService.deleteApplication(appId);
                setApplications(prev => prev.filter(app => app.id !== appId));
                if (selectedApp?.id === appId) setSelectedApp(null);
            } else if (confirmTarget.type === 'clear_all') {
                await settingsService.clearAllApplications();
                setApplications([]);
                setSelectedApp(null);
            }
            setConfirmTarget(null);
        } catch (err) {
            console.error('Failed to delete application(s):', err);
        } finally {
            setDeleting(false);
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
            app.niveau?.toLowerCase().includes(searchTerm.toLowerCase());
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
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Membership Applications</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">
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
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60'
                                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700'
                        }`}
                        title="Toggle whether public applications are currently open or closed"
                    >
                        {toggling ? (
                            <Loader2 className="w-4 h-4 animate-spin text-gray-500 dark:text-slate-400" />
                        ) : joinEnabled ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-400" />
                        )}
                        <span>Recruitment: <strong>{joinEnabled ? 'Open' : 'Closed'}</strong></span>
                    </button>

                    {/* Export CSV */}
                    <button
                        onClick={() => exportToCSV(filteredApplications, 'club_applications', ['Full Name', 'Email', 'Phone', 'Major', 'Niveau', 'Created At'])}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-200 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-semibold text-xs shadow-sm"
                    >
                        <Download className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                        Export CSV
                    </button>

                    {/* Purge All */}
                    {applications.length > 0 && (
                        <button
                            onClick={() => setConfirmTarget({ type: 'clear_all' })}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors font-semibold text-xs cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                            Purge All
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold">
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total Dossiers</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{applications.length}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center font-bold">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Filières</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                            {majors.filter(m => m !== 'all').length || 0}
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                        joinEnabled ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                    }`}>
                        {joinEnabled ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Portal Status</p>
                        <p className={`text-2xl font-bold mt-0.5 ${joinEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-slate-300'}`}>
                            {joinEnabled ? 'Active' : 'Offline'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by candidate name, email, phone, or filière..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600"
                        />
                    </div>

                    {/* Filter by Major */}
                    <div className="flex items-center gap-2 min-w-[240px]">
                        <Filter className="w-4 h-4 text-gray-400 dark:text-slate-500 flex-shrink-0" />
                        <select
                            value={selectedMajor}
                            onChange={(e) => setSelectedMajor(e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all cursor-pointer font-medium text-gray-700 dark:text-slate-200"
                        >
                            <option value="all">Toutes les filières</option>
                            {majors.filter(m => m !== 'all').map((major, index) => (
                                <option key={index} value={major}>
                                    {major}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="text-xs font-semibold text-gray-400 dark:text-slate-500 px-2 self-center">
                        {filteredApplications.length} candidate{filteredApplications.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* Table Area */}
            {filteredApplications.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-12 text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ClipboardList className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No applications found</h3>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">
                        {searchTerm || selectedMajor !== 'all'
                            ? 'No applications match your current search or department filter'
                            : 'New candidates applying through the registration page will appear here'}
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/80 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                                <tr>
                                    <th className="px-6 py-4 w-12 text-center">#</th>
                                    <th className="px-6 py-4">Candidate</th>
                                    <th className="px-6 py-4">Contact Details</th>
                                    <th className="px-6 py-4">Filière</th>
                                    <th className="px-6 py-4">Niveau</th>
                                    <th className="px-6 py-4">Date Applied</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
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
                                            className="hover:bg-blue-50/30 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                                            onClick={() => setSelectedApp(app)}
                                        >
                                            {/* Row Index */}
                                            <td className="px-6 py-4 text-center text-xs font-semibold text-gray-400 dark:text-slate-500">
                                                {index + 1}
                                            </td>

                                            {/* Candidate */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-[#1e3a8a] text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                            {app.full_name}
                                                        </p>
                                                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-slate-500 font-medium">
                                                            ID #{app.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact Details */}
                                            <td className="px-6 py-4 space-y-1" onClick={(e) => e.stopPropagation()}>
                                                <a
                                                    href={`mailto:${app.email}`}
                                                    className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                >
                                                    <Mail className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 flex-shrink-0" />
                                                    <span>{app.email}</span>
                                                </a>
                                                {app.phone ? (
                                                    <a
                                                        href={getWhatsAppUrl(app.phone)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group/phone"
                                                        title={`Open WhatsApp chat with ${app.phone}`}
                                                    >
                                                        <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-500 group-hover/phone:scale-110 transition-transform flex-shrink-0" />
                                                        <span className="group-hover/phone:underline font-mono">{app.phone}</span>
                                                    </a>
                                                ) : (
                                                    <span className="flex items-center gap-2 text-xs text-gray-300 dark:text-slate-600">
                                                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                                        <span>No phone</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Filière */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg border border-blue-100 dark:border-blue-900/60">
                                                    <GraduationCap className="w-3 h-3 mr-1" />
                                                    {app.major || '—'}
                                                </span>
                                            </td>

                                            {/* Niveau */}
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">
                                                    {app.niveau || '—'}
                                                </span>
                                            </td>

                                            {/* Applied Date */}
                                            <td className="px-6 py-4 text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
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
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                                        title="View Full Application"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setConfirmTarget({ type: 'single', app });
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
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
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedApp.full_name}</h3>
                                    <span className="inline-flex items-center text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/60 mt-0.5">
                                        <GraduationCap className="w-3 h-3 mr-1" />
                                        {[selectedApp.major, selectedApp.niveau].filter(Boolean).join(' · ') || '—'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 dark:bg-slate-950 rounded-xl p-3.5 border border-gray-100 dark:border-slate-800">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Email Address</p>
                                <a href={`mailto:${selectedApp.email}`} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline break-all">
                                    {selectedApp.email}
                                </a>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Phone Number</p>
                                <div>
                                    {selectedApp.phone ? (
                                        <a 
                                            href={getWhatsAppUrl(selectedApp.phone)} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors"
                                            title={`Open WhatsApp chat with ${selectedApp.phone}`}
                                        >
                                            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                            <span className="font-mono">{selectedApp.phone}</span>
                                            <span className="text-[9px] uppercase tracking-wider bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 px-1 py-0.5 rounded font-bold border border-emerald-200 dark:border-emerald-800 ml-0.5">
                                                WhatsApp
                                            </span>
                                        </a>
                                    ) : (
                                        <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">Not specified</span>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-2 pt-2 border-t border-gray-200/60 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-gray-400 dark:text-slate-500">Date Received</span>
                                <span className="font-semibold text-gray-700 dark:text-slate-300">
                                    {new Date(selectedApp.created_at).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-gray-50 dark:bg-slate-950 rounded-xl p-3.5 border border-gray-100 dark:border-slate-800">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Filière</p>
                                <p className="font-semibold text-gray-800 dark:text-slate-100">{selectedApp.major || '—'}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-950 rounded-xl p-3.5 border border-gray-100 dark:border-slate-800">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Niveau</p>
                                <p className="font-semibold text-gray-800 dark:text-slate-100">{selectedApp.niveau || '—'}</p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-2 flex justify-between items-center">
                            <button
                                onClick={() => setConfirmTarget({ type: 'single', app: selectedApp })}
                                className="px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                            >
                                Delete Dossier
                            </button>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Modern Confirm Modal */}
            <ConfirmModal
                isOpen={Boolean(confirmTarget)}
                onClose={() => !deleting && setConfirmTarget(null)}
                onConfirm={handleConfirmDelete}
                title={confirmTarget?.type === 'clear_all' ? 'Purge All Applications?' : 'Delete Application Dossier?'}
                message={
                    confirmTarget?.type === 'clear_all'
                        ? `Are you sure you want to delete all ${applications.length} submitted applications? This will wipe all candidate records from the database.`
                        : 'Are you sure you want to permanently delete this application? This candidate record cannot be recovered.'
                }
                confirmText={
                    confirmTarget?.type === 'clear_all'
                        ? `Purge All (${applications.length})`
                        : 'Delete Dossier'
                }
                cancelText="Cancel"
                variant="danger"
                loading={deleting}
                itemPreview={
                    confirmTarget?.type === 'single' && confirmTarget.app ? (
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                {confirmTarget.app.full_name
                                    ?.split(' ')
                                    .map(n => n[0])
                                    .slice(0, 2)
                                    .join('')
                                    .toUpperCase() || 'AP'}
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                    {confirmTarget.app.full_name}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                                    {confirmTarget.app.email} • {confirmTarget.app.major || 'No Filière'}
                                </p>
                                <p className="text-[11px] text-gray-400 dark:text-slate-500">
                                    {confirmTarget.app.phone ? `WhatsApp/Phone: ${confirmTarget.app.phone}` : 'No phone specified'}
                                </p>
                            </div>
                        </div>
                    ) : confirmTarget?.type === 'clear_all' ? (
                        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center shrink-0">
                                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold">Irreversible Database Action</p>
                                <p className="text-[11px] text-gray-500 dark:text-slate-400">
                                    {applications.length} submitted dossiers will be completely removed.
                                </p>
                            </div>
                        </div>
                    ) : null
                }
            />
        </div>
    );
};

export default Applications;