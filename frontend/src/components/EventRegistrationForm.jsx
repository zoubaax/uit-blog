import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import registrationService from '../services/registrationService';

const EventRegistrationForm = ({ eventId, eventTitle, isDeadlinePassed, isFull, deadline }) => {
    const isDisabled = isDeadlinePassed || isFull;
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        school_name: '',
        agreed_to_policies: false
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDisabled) return;

        setLoading(true);
        setError('');

        try {
            await registrationService.register({
                event_id: eventId,
                ...formData
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="p-8 border border-[#1e3a8a] dark:border-blue-600 bg-[#f8fafc] dark:bg-slate-900 text-center space-y-4 rounded-xl">
                <h3 className="text-xl font-semibold text-[#1e3a8a] dark:text-blue-300">Registration Confirmed</h3>
                <p className="text-sm text-[#475569] dark:text-slate-300">
                    Thank you, {formData.full_name}. Your reservation for "{eventTitle}" has been processed.
                </p>
            </div>
        );
    }

    return (
        <div className="p-8 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl">
            <h3 className="text-xl font-semibold text-[#1e3a8a] dark:text-white mb-8">Registration</h3>

            {isDisabled ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-widest text-center rounded-lg">
                    {isDeadlinePassed ? 'Registration closed' : 'Maximum capacity reached'}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {deadline && (
                        <div className="mb-8 p-3 bg-[#f8fafc] dark:bg-slate-800/40 border-l-2 border-[#2563eb] dark:border-blue-400 rounded-r">
                            <p className="text-[10px] font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-widest mb-1">Deadline</p>
                            <p className="text-xs font-semibold text-[#1e3a8a] dark:text-blue-300">{deadline.toLocaleDateString()} {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-widest block">Full Name</label>
                        <input
                            name="full_name"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-sm text-slate-800 dark:text-slate-100 focus:border-[#1e3a8a] dark:focus:border-blue-500 rounded-lg transition-colors"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-widest block">University Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-sm text-slate-800 dark:text-slate-100 focus:border-[#1e3a8a] dark:focus:border-blue-500 rounded-lg transition-colors"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-widest block">Phone Number</label>
                        <input
                            name="phone"
                            type="tel"
                            placeholder="e.g. +212 600-000000"
                            className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-[#1e3a8a] dark:focus:border-blue-500 rounded-lg transition-colors"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-widest block">Academic Institution</label>
                        <input
                            name="school_name"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-sm text-slate-800 dark:text-slate-100 focus:border-[#1e3a8a] dark:focus:border-blue-500 rounded-lg transition-colors"
                            value={formData.school_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex items-start gap-3">
                        <input
                            name="agreed_to_policies"
                            type="checkbox"
                            required
                            id="terms"
                            className="mt-1 accent-[#1e3a8a] dark:accent-blue-500"
                            checked={formData.agreed_to_policies}
                            onChange={handleChange}
                        />
                        <label htmlFor="terms" className="text-[10px] text-[#475569] dark:text-slate-400 leading-relaxed italic">
                            I verify that my information is correct and I agree to follow the University event conduct guidelines.
                        </label>
                    </div>

                    {error && <p className="text-red-600 dark:text-red-400 text-xs font-medium">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#1e3a8a] hover:bg-[#1e1e6b] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg disabled:opacity-50 shadow-sm"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Confirm Reservation'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default EventRegistrationForm;
