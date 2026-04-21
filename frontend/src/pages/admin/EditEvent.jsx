import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import eventService from '../../services/eventService';
import ImageUpload from '../../components/ImageUpload';
import { Save, ArrowLeft, Loader2, Calendar, MapPin, Eye, EyeOff, Clock, Users } from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        cover_image_url: '',
        is_hidden: false,
        registration_deadline: '',
        max_participants: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const formatForInput = (isoStr) => {
        if (!isoStr) return '';
        const date = new Date(isoStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        let isMounted = true;
        const fetchEvent = async () => {
            try {
                const res = await eventService.getById(id);
                if (isMounted) {
                    const event = res.data;
                    setFormData({
                        title: event.title || '',
                        description: event.description || '',
                        date: formatForInput(event.date),
                        location: event.location || '',
                        cover_image_url: event.cover_image_url || '',
                        is_hidden: !!event.is_hidden,
                        registration_deadline: formatForInput(event.registration_deadline),
                        max_participants: event.max_participants !== null ? String(event.max_participants) : ''
                    });
                }
            } catch (error) {
                console.error('Error fetching event:', error);
                if (isMounted) navigate('/dashboard/events');
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchEvent();
        return () => { isMounted = false; };
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const submitData = {
            ...formData,
            max_participants: formData.max_participants === '' ? null : parseInt(formData.max_participants),
            registration_deadline: formData.registration_deadline === '' ? null : formData.registration_deadline
        };

        // DEBUG: Verify outgoing data in browser console
        console.log('--- SUBMIT DATA DEBUG ---');
        console.table(submitData);

        try {
            await eventService.update(id, submitData);
            navigate('/dashboard/events');
        } catch (error) {
            console.error('Update Error:', error);
            alert('Failed to update event. Check console for details.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <SectionLoader message="Loading event" />;

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/dashboard/events')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Event Title</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        value={formData.title}
                        onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" /> Event Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            value={formData.date}
                            onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" /> Location
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            value={formData.location}
                            onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl space-y-6 border border-gray-100">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <div className="flex items-center gap-3">
                            {formData.is_hidden ? <EyeOff className="text-gray-500" /> : <Eye className="text-green-600" />}
                            <div>
                                <p className="text-sm font-bold text-gray-900">Visibility Status</p>
                                <p className="text-xs text-gray-500">{formData.is_hidden ? 'Hidden' : 'Visible'}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, is_hidden: !p.is_hidden }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${formData.is_hidden ? 'bg-gray-300' : 'bg-blue-600'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${formData.is_hidden ? 'translate-x-1' : 'translate-x-6'}`} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-500" /> Registration Deadline
                            </label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white"
                                value={formData.registration_deadline}
                                onChange={(e) => setFormData(p => ({ ...p, registration_deadline: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Users className="w-4 h-4 text-purple-500" /> Participant Limit
                            </label>
                            <input
                                type="number"
                                min="1"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white"
                                placeholder="Unlimited"
                                value={formData.max_participants}
                                onChange={(e) => setFormData(p => ({ ...p, max_participants: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                <ImageUpload
                    initialImage={formData.cover_image_url}
                    onImageUpload={(url) => setFormData(p => ({ ...p, cover_image_url: url }))}
                />

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Description</label>
                    <textarea
                        required
                        rows="6"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                    />
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100 gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/events')}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Event
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditEvent;
