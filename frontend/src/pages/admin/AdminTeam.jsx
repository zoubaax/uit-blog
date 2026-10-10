import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import teamService from '../../services/teamService';
import {
    Plus,
    Trash2,
    Edit2,
    Linkedin,
    Twitter,
    Globe,
    Users,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Download
} from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';
import { exportToCSV } from '../../utils/exportUtils';
import ConfirmModal from '../../components/ConfirmModal';

const AdminTeam = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const res = await teamService.getAll();
            setMembers(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await teamService.delete(deleteTarget.id);
            setMembers(members.filter(m => m.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (error) {
            console.error('Failed to delete member:', error);
        } finally {
            setDeleting(false);
        }
    };

    // Filter members
    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || member.role === filter;
        return matchesSearch && matchesFilter;
    });

    // Get unique roles for filter
    const roles = ['all', ...new Set(members.map(m => m.role).filter(Boolean))];

    if (loading) {
        return <SectionLoader message="Loading team members" />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Team Members</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">
                        {members.length} member{members.length !== 1 ? 's' : ''} in your team
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => exportToCSV(filteredMembers, 'team_members', ['Name', 'Role', 'Email', 'Bio', 'Created At'])}
                        className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-200 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-semibold shadow-sm text-sm"
                    >
                        <Download className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                        Export CSV
                    </button>
                    <NavLink
                        to="/dashboard/team/new"
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm text-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Add Member
                    </NavLink>
                </div>
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
                                placeholder="Search by name or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                            />
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-3 bg-gray-50 dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer text-sm"
                        >
                            {roles.map((role, index) => (
                                <option key={index} value={role}>
                                    {role === 'all' ? 'All Roles' : role}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Team Grid */}
            {filteredMembers.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-12 text-center">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No team members found</h3>
                    <p className="text-gray-500 dark:text-slate-400 mb-6">
                        {searchTerm || filter !== 'all'
                            ? 'Try adjusting your search or filter'
                            : 'Start by adding your first team member'}
                    </p>
                    <NavLink
                        to="/dashboard/team/new"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add First Member
                    </NavLink>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow group"
                            >
                                {/* Header with Actions */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{member.name}</h3>
                                        <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">{member.role}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => navigate(`/dashboard/team/edit/${member.id}`)}
                                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(member)}
                                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Profile Image */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative w-32 h-32">
                                        <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border-4 border-white dark:border-slate-800 shadow-sm">
                                            <img
                                                src={member.photo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                            <div className="bg-white dark:bg-slate-950 px-3 py-1 rounded-full shadow-sm border border-gray-200 dark:border-slate-800">
                                                <span className="text-xs font-medium text-gray-700 dark:text-slate-300">Member</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                {member.bio && (
                                    <p className="text-gray-600 dark:text-slate-300 text-sm text-center mb-6 line-clamp-3">
                                        {member.bio}
                                    </p>
                                )}

                                {/* Social Links */}
                                <div className="flex justify-center gap-3 pt-6 border-t border-gray-100 dark:border-slate-800">
                                    {member.social_links?.linkedin && (
                                        <a
                                            href={member.social_links.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                            title="LinkedIn"
                                        >
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                    )}
                                    {member.social_links?.twitter && (
                                        <a
                                            href={member.social_links.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 dark:text-slate-400 hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                            title="Twitter"
                                        >
                                            <Twitter className="w-4 h-4" />
                                        </a>
                                    )}
                                    {member.social_links?.website && (
                                        <a
                                            href={member.social_links.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                            title="Website"
                                        >
                                            <Globe className="w-4 h-4" />
                                        </a>
                                    )}
                                    {member.email && (
                                        <a
                                            href={`mailto:${member.email}`}
                                            className="p-2 text-gray-400 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                                            title="Email"
                                        >
                                            <Mail className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Results Count */}
                    <div className="text-sm text-gray-500 dark:text-slate-400">
                        Showing {filteredMembers.length} of {members.length} team members
                    </div>
                </>
            )}

            {/* Team Stats */}
            {members.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-blue-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
                            <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Members</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{members.length}</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
                            <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">With Photos</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {members.filter(m => m.photo_url).length}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
                            <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">With Social Links</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {members.filter(m => m.social_links).length}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
                            <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Unique Roles</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {new Set(members.map(m => m.role).filter(Boolean)).size}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Modern In-App Confirm Modal */}
            <ConfirmModal
                isOpen={Boolean(deleteTarget)}
                onClose={() => !deleting && setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                title="Remove Team Member?"
                message="Are you sure you want to remove this member from the UIT executive team? Their profile will no longer appear publicly."
                confirmText="Remove Member"
                cancelText="Cancel"
                variant="danger"
                loading={deleting}
                itemPreview={
                    deleteTarget ? (
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0 border border-gray-200 dark:border-slate-700">
                                <img
                                    src={deleteTarget.photo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'}
                                    alt={deleteTarget.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                    {deleteTarget.name}
                                </h4>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold truncate">
                                    {deleteTarget.role}
                                </p>
                                <p className="text-[11px] text-gray-400 dark:text-slate-500 truncate">
                                    {deleteTarget.email || 'No email attached'}
                                </p>
                            </div>
                        </div>
                    ) : null
                }
            />
        </div>
    );
};

export default AdminTeam;