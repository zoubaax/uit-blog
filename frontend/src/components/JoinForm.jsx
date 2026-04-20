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
            <div className="text-center p-12 bg-slate-50 border border-slate-100 italic">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#1e3a8a]">Application Period Closed</h3>
                <p className="text-[#475569] text-sm mt-2">The membership portal is currently offline. Please join our mailing list or check back next semester.</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center p-12 bg-[#f0f9ff] border border-[#bae6fd] animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold text-[#1e3a8a] tracking-tight">Application Transmitted</h3>
                <p className="text-[#475569] mt-3 max-w-sm mx-auto leading-relaxed">
                    Your credentials and motivation have been securely received. Our administration team will review your profile shortly.
                </p>
                <div className="mt-8 pt-8 border-t border-[#bae6fd]">
                    <button
                        onClick={() => setSuccess(false)}
                        className="text-[10px] font-bold text-[#1e3a8a] hover:underline uppercase tracking-[0.2em]"
                    >
                        Return to Start
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] px-1" htmlFor="full_name">
                        Full Name
                    </label>
                    <div className="relative group">
                        <input
                            id="full_name"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#1e3a8a] outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-300"
                            placeholder="e.g. Alan Turing"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] px-1" htmlFor="email">
                        Email Address
                    </label>
                    <div className="relative group">
                        <input
                            id="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#1e3a8a] outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-300"
                            placeholder="name@university.edu"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] px-1" htmlFor="major">
                    Faculty / Major
                </label>
                <div className="relative group">
                    <input
                        id="major"
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#1e3a8a] outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-300"
                        placeholder="e.g. Computer Science & Information Technology"
                        value={formData.major}
                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] px-1" htmlFor="motivation">
                    Statement of Motivation
                </label>
                <div className="relative group">
                    <textarea
                        id="motivation"
                        required
                        rows="4"
                        className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#1e3a8a] outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-300 resize-none"
                        placeholder="Describe your technical background and why you wish to contribute to the collective..."
                        value={formData.motivation}
                        onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    ></textarea>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 border border-red-100 text-[11px] font-bold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#1e3a8a] hover:bg-[#1e1e6b] text-white text-[11px] font-bold uppercase tracking-[0.3em] transition-all active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-3 group"
                >
                    {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            Submit Application <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
                <p className="mt-6 text-[10px] text-center text-[#94a3b8] leading-relaxed italic">
                    By submitting, you agree to comply with the club's code of conduct<br /> and university data privacy regulations.
                </p>
            </div>
        </form>
    );
};

export default JoinForm;
