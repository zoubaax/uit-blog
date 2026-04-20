import { useState, useEffect } from 'react';
import settingsService from '../services/settingsService';
import { User, Mail, Book, MessageSquare, Send, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const JoinForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        major: '',
        motivation: ''
    });
    const [status, setStatus] = useState('loading'); // loading, open, closed
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await settingsService.getJoinStatus();
                setStatus(res.enabled ? 'open' : 'closed');
            } catch (err) {
                console.error(err);
                setStatus('closed');
            }
        };
        fetchStatus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await settingsService.submitApplication(formData);
            setSuccess(true);
            if (onSuccess) {
                setTimeout(() => onSuccess(), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 text-blue-700 animate-spin" />
            </div>
        );
    }

    if (status === 'closed') {
        return (
            <div className="text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 uppercase">Form Closed</h3>
                <p className="text-gray-500 mt-2">We are not accepting new applications at this time. Please check back later!</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center p-12 bg-blue-50 rounded-2xl border border-blue-100 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-blue-900 uppercase">Application Received!</h3>
                <p className="text-blue-700 font-bold mt-2">Thank you for your interest in UIT Club. Our team will review your application and contact you soon.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-8 text-blue-700 font-bold hover:underline uppercase text-xs tracking-widest"
                >
                    Submit another application
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest pl-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            required
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-700 transition-all font-bold placeholder:text-gray-300"
                            placeholder="John Doe"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest pl-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            required
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-700 transition-all font-bold placeholder:text-gray-300"
                            placeholder="john@university.edu"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest pl-1">Your Major / Faculty</label>
                <div className="relative">
                    <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-700 transition-all font-bold placeholder:text-gray-300"
                        placeholder="Computer Science, Biology, etc."
                        value={formData.major}
                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest pl-1">Why do you want to join UIT?</label>
                <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                        required
                        rows="4"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-700 transition-all font-bold placeholder:text-gray-300 resize-none"
                        placeholder="Tell us about your interests and what you hope to achieve..."
                        value={formData.motivation}
                        onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    ></textarea>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-bold border border-red-100">
                    <AlertCircle className="w-5 h-5" /> {error}
                </div>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-blue-700 text-white font-black rounded-xl shadow-xl hover:bg-blue-800 transition-all uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
            >
                {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        Join UIT Club <Send className="w-5 h-5" />
                    </>
                )}
            </button>
        </form>
    );
};

export default JoinForm;
