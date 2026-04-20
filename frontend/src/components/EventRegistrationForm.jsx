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
            <div className="p-8 border border-[#1e3a8a] bg-[#f8fafc] text-center space-y-4">
                <h3 className="text-xl font-semibold text-[#1e3a8a]">Registration Confirmed</h3>
                <p className="text-sm text-[#475569]">
                    Thank you, {formData.full_name}. Your reservation for "{eventTitle}" has been processed.
                </p>
            </div>
        );
    }

    return (
        <div className="p-8 border border-slate-100 bg-white">
            <h3 className="text-xl font-semibold text-[#1e3a8a] mb-8">Registration</h3>

            {isDisabled ? (
                <div className="p-4 bg-slate-50 text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest text-center">
                    {isDeadlinePassed ? 'Registration closed' : 'Maximum capacity reached'}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {deadline && (
                        <div className="mb-8 p-3 bg-[#f8fafc] border-l-2 border-[#2563eb]">
                            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-1">Deadline</p>
                            <p className="text-xs font-semibold text-[#1e3a8a]">{deadline.toLocaleDateString()} {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest block">Full Name</label>
                        <input
                            name="full_name"
                            type="text"
                            required
                            className="w-full px-4 py-3 border border-slate-200 outline-none text-sm focus:border-[#1e3a8a] transition-colors"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest block">University Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 border border-slate-200 outline-none text-sm focus:border-[#1e3a8a] transition-colors"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest block">Academic Institution</label>
                        <input
                            name="school_name"
                            type="text"
                            required
                            className="w-full px-4 py-3 border border-slate-200 outline-none text-sm focus:border-[#1e3a8a] transition-colors"
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
                            className="mt-1"
                            checked={formData.agreed_to_policies}
                            onChange={handleChange}
                        />
                        <label htmlFor="terms" className="text-[10px] text-[#475569] leading-relaxed italic">
                            I verify that my information is correct and I agree to follow the University event conduct guidelines.
                        </label>
                    </div>

                    {error && <p className="text-red-600 text-xs font-medium">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#1e3a8a] hover:bg-[#1e1e6b] text-white text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Confirm Reservation'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default EventRegistrationForm;
