import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import teamService from '../../services/teamService';
import ImageUpload from '../../components/ImageUpload';
import { Save, ArrowLeft, Loader2, Linkedin, Twitter, Globe, Trash2 } from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';

const EditTeam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        photo_url: '',
        bio: '',
        social_links: {
            linkedin: '',
            twitter: '',
            website: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadMember = async () => {
            try {
                const res = await teamService.getById(id);
                const member = res.data;
                setFormData({
                    name: member.name || '',
                    role: member.role || '',
                    photo_url: member.photo_url || '',
                    bio: member.bio || '',
                    social_links: member.social_links || {
                        linkedin: '',
                        twitter: '',
                        website: ''
                    }
                });
            } catch (error) {
                console.error('Error loading member:', error);
                alert('Failed to load team member');
                navigate('/dashboard/team');
            } finally {
                setLoading(false);
            }
        };
        loadMember();
    }, [id, navigate]);

    const handleSocialChange = (e) => {
        setFormData({
            ...formData,
            social_links: {
                ...formData.social_links,
                [e.target.name]: e.target.value
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await teamService.update(id, formData);
            navigate('/dashboard/team');
        } catch (error) {
            console.error('Update Error:', error);
            alert(`Failed to update team member: ${error}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <SectionLoader message="Fetching member details..." />;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard/team')}
                        className="p-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">Edit Member Profile</h1>
                        <p className="text-sm text-gray-500">Update identification and social presence</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Image */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <ImageUpload
                            initialImage={formData.photo_url}
                            onImageUpload={(url) => setFormData({ ...formData, photo_url: url })}
                        />
                        <p className="mt-4 text-[11px] text-gray-400 text-center leading-relaxed">
                            Recommended: 400x400px squared image with professional background.
                        </p>
                    </div>
                </div>

                {/* Right Column: Details */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                        {/* Identity Section */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4">Identification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="Jane Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700">Role / Designation</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="Head of Research"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Section */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4">Social Connect</h3>
                            <div className="space-y-4">
                                <div className="group relative">
                                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="url"
                                        name="linkedin"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm placeholder:text-gray-300"
                                        placeholder="linkedin.com/in/username"
                                        value={formData.social_links.linkedin}
                                        onChange={handleSocialChange}
                                    />
                                </div>

                                <div className="group relative">
                                    <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-400 transition-colors" />
                                    <input
                                        type="url"
                                        name="twitter"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all text-sm placeholder:text-gray-300"
                                        placeholder="twitter.com/username"
                                        value={formData.social_links.twitter}
                                        onChange={handleSocialChange}
                                    />
                                </div>

                                <div className="group relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="url"
                                        name="website"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-sm placeholder:text-gray-300"
                                        placeholder="portfolio.me"
                                        value={formData.social_links.website}
                                        onChange={handleSocialChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-50">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard/team')}
                                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-[#1e293b] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0f172a] transition-all shadow-lg shadow-slate-200 disabled:opacity-70 active:scale-95"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Update Profile
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTeam;
