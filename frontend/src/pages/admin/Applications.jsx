import { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';
import {
    Mail,
    GraduationCap,
    Clock,
    User,
    Filter,
    Search,
    ChevronRight,
    Calendar,
    Download,
    Trash2,
    AlertCircle
} from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';
import { exportToCSV } from '../../utils/exportUtils';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMajor, setSelectedMajor] = useState('all');

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        try {
            const res = await settingsService.getApplications();
            setApplications(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        if (window.confirm('Delete this application permanently?')) {
            try {
                await settingsService.deleteApplication(id);
                setApplications(applications.filter(app => app.id !== id));
            } catch (err) {
                alert('Failed to delete application');
            }
        }
    };

    const handleClearAll = async () => {
        if (window.confirm('CRITICAL: Are you sure you want to delete ALL applications? This cannot be undone.')) {
            try {
                await settingsService.clearAllApplications();
                setApplications([]);
            } catch (err) {
                alert('Failed to clear applications');
            }
        }
    };

    // Get unique majors for filter
    const majors = ['all', ...new Set(applications.map(app => app.major).filter(Boolean))];

    // Filter applications
    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.motivation?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMajor = selectedMajor === 'all' || app.major === selectedMajor;
        return matchesSearch && matchesMajor;
    });

    if (loading) {
        return <SectionLoader message="Loading applications" />;
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Editorial Header */}
            <header className="flex flex-col md:flex-row justify-between items-end gap-8 pb-10 border-b-2 border-[#0f172a]">
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Administrative Portal</span>
                    <h1 className="text-5xl font-bold text-[#0f172a] tracking-tighter">Membership Dossiers</h1>
                    <p className="text-sm font-medium text-slate-500 max-w-md border-l-2 border-slate-100 pl-4">
                        Reviewing and managing candidates for the {new Date().getFullYear()} academic cycle.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => exportToCSV(filteredApplications, 'club_applications', ['Full Name', 'Email', 'Major', 'Motivation', 'Created At'])}
                        className="px-6 py-3 border border-slate-200 text-[#0f172a] text-[10px] font-black uppercase tracking-widest hover:bg-[#0f172a] hover:text-white transition-all duration-300 shadow-sm"
                    >
                        Export Data
                    </button>
                    {applications.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                            Purge All
                        </button>
                    )}
                </div>
            </header>

            {/* Structured Search & Filter */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-slate-200 bg-white">
                <div className="md:col-span-8 flex items-center px-6 py-4 border-b md:border-b-0 md:border-r border-slate-200 group focus-within:bg-slate-50 transition-colors">
                    <Search className="w-4 h-4 text-slate-400 mr-4" />
                    <input
                        type="text"
                        placeholder="SEARCH BY CANDIDATE NAME OR CREDENTIALS..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent outline-none text-[10px] font-bold uppercase tracking-widest placeholder:text-slate-300"
                    />
                </div>
                <div className="md:col-span-4 flex items-center px-6 py-4 bg-slate-50/50">
                    <Filter className="w-4 h-4 text-slate-400 mr-4" />
                    <select
                        value={selectedMajor}
                        onChange={(e) => setSelectedMajor(e.target.value)}
                        className="bg-transparent outline-none text-[10px] font-bold uppercase tracking-widest text-[#0f172a] w-full cursor-pointer"
                    >
                        {majors.map((major, index) => (
                            <option key={index} value={major}>
                                {major === 'all' ? 'FILTER BY DEPARTMENT: ALL' : `DEPT: ${major.toUpperCase()}`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content Dossier Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredApplications.length === 0 ? (
                    <div className="col-span-full py-32 border-2 border-dashed border-slate-100 rounded-px text-center">
                        <User className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Empty Ledger</h3>
                    </div>
                ) : (
                    filteredApplications.map((app) => (
                        <div
                            key={app.id}
                            className="bg-white border-l-4 border-blue-600 border border-slate-200 p-8 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group relative overflow-hidden"
                        >
                            {/* Dossier Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5">Candidate #{app.id}</span>
                                        <h3 className="text-2xl font-bold text-[#0f172a] tracking-tight">{app.full_name}</h3>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                                            <GraduationCap className="w-3.5 h-3.5" />
                                            {app.major || 'Faculty of Engineering'}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                            <Mail className="w-3.5 h-3.5 text-slate-300" />
                                            {app.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                            <Clock className="w-3.5 h-3.5 text-slate-200" />
                                            RECEIVED: {new Date(app.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-4">
                                    {/* Status Badge */}
                                    <div className="px-3 py-1 border border-blue-200 text-blue-600 text-[9px] font-black uppercase tracking-[0.2em] bg-blue-50/50">
                                        Under Review
                                    </div>
                                    <button 
                                        onClick={(e) => handleDelete(app.id, e)}
                                        className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg opacity-0 group-hover:opacity-100"
                                        title="Expunge Entry"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Statement of Purpose */}
                            <div className="relative pt-6 border-t border-slate-50">
                                <span className="absolute -top-3 left-6 bg-white px-3 text-[9px] font-black text-slate-300 uppercase tracking-widest">Statement of Purpose</span>
                                <div className="bg-slate-50/50 p-5 border border-slate-100 text-sm italic text-slate-600 leading-relaxed font-serif">
                                    "{app.motivation || 'No motivation provided.'}"
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* System Status Footer */}
            <footer className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        System Active
                    </div>
                    <div>
                        Current Load: {applications.length} Entries
                    </div>
                </div>

                {filteredApplications.length > 0 && (
                    <div className="text-[10px] font-bold text-slate-300 uppercase underline decoration-blue-200 underline-offset-4">
                        End of Ledger — {new Date().toLocaleDateString()}
                    </div>
                )}
            </footer>
        </div>
    );
};

export default Applications;