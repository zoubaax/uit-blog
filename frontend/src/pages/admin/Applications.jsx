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
    Download
} from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';
import { exportToCSV } from '../../utils/exportUtils';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMajor, setSelectedMajor] = useState('all');

    useEffect(() => {
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
        fetchApps();
    }, []);

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
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Membership Applications</h1>
                    <p className="text-gray-500 mt-1">
                        {applications.length} application{applications.length !== 1 ? 's' : ''} received
                    </p>
                </div>

                {/* Stats Summary & Export */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => exportToCSV(filteredApplications, 'club_applications', ['Full Name', 'Email', 'Major', 'Motivation', 'Created At'])}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <div className="px-4 py-2 bg-blue-50 rounded-xl">
                        <span className="text-sm font-medium text-blue-700">Pending Review</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search applications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Major Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={selectedMajor}
                            onChange={(e) => setSelectedMajor(e.target.value)}
                            className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {majors.map((major, index) => (
                                <option key={index} value={major}>
                                    {major === 'all' ? 'All Majors' : major}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {filteredApplications.length === 0 ? (
                    <div className="text-center py-16">
                        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No applications found</h3>
                        <p className="text-gray-500">
                            {searchTerm || selectedMajor !== 'all'
                                ? 'Try adjusting your search or filter'
                                : 'No applications have been submitted yet'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredApplications.map((app) => (
                            <div
                                key={app.id}
                                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
                                onClick={() => {
                                    // Handle application click (view details)
                                    console.log('View application:', app.id);
                                }}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* Applicant Info */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                                                {app.full_name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-gray-900 text-lg">{app.full_name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <GraduationCap className="w-4 h-4" />
                                                        <span>{app.major || 'Undeclared'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-4 h-4" />
                                                    <span className="truncate max-w-xs">{app.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {new Date(app.created_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Motivation Preview */}
                                            {app.motivation && (
                                                <p className="mt-3 text-gray-600 line-clamp-2 text-sm">
                                                    {app.motivation}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                                            Pending
                                        </span>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            {applications.length > 0 && (
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>
                        Showing {filteredApplications.length} of {applications.length} applications
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>New this week</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <span>Previously reviewed</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Applications;