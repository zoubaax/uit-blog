import { useState, useEffect } from 'react';
import settingsService from '../services/settingsService';
import { UPF_FILIERES, NIVEAUX } from '../data/upfFilieres';
import { User, Mail, Phone, GraduationCap, Send, CheckCircle, Loader2, AlertCircle, ChevronDown, Lock } from 'lucide-react';

const emptyForm = {
    full_name: '',
    email: '',
    phone: '',
    major: '',
    niveau: '',
};

const selectClass = (filled) =>
    `w-full pl-10 pr-10 py-3 bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium cursor-pointer appearance-none rounded-lg ${
        filled ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
    }`;

const JoinForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState(emptyForm);
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
            const message = typeof err === 'string' ? err : err?.response?.data?.message;
            setError(message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
        );
    }

    if (status === 'closed') {
        return (
            <div className="text-center p-8 sm:p-12 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Application Period Closed</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                    The membership portal is currently offline. Follow our announcements or check back for the next semester.
                </p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center p-6 sm:p-10 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl animate-in fade-in zoom-in-95 duration-400 space-y-4">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Application Submitted!</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you for applying. We received your information and our team will get in touch with you shortly.
                </p>
                <div className="pt-4">
                    <button
                        onClick={() => {
                            setFormData(emptyForm);
                            setSuccess(false);
                        }}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Submit another response
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Full Name */}
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="full_name">
                        Full Name <span className="text-blue-600 dark:text-blue-400">*</span>
                    </label>
                    <div className="relative group">
                        <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                        <input
                            id="full_name"
                            type="text"
                            required
                            autoComplete="name"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg"
                            placeholder="e.g. Alan Turing"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        />
                    </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="email">
                        Email Address <span className="text-blue-600 dark:text-blue-400">*</span>
                    </label>
                    <div className="relative group">
                        <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg"
                            placeholder="name@university.edu"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Phone Number */}
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="phone">
                        Phone / WhatsApp <span className="text-blue-600 dark:text-blue-400">*</span>
                    </label>
                    <div className="relative group">
                        <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                        <input
                            id="phone"
                            type="tel"
                            required
                            autoComplete="tel"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg"
                            placeholder="+212 600-000000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>

                {/* Niveau */}
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="niveau">
                        Niveau <span className="text-blue-600 dark:text-blue-400">*</span>
                    </label>
                    <div className="relative group">
                        <GraduationCap className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                        <select
                            id="niveau"
                            required
                            className={selectClass(formData.niveau)}
                            value={formData.niveau}
                            onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                        >
                            <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-400">Sélectionner le niveau</option>
                            {NIVEAUX.map((niveau) => (
                                <option key={niveau} value={niveau} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                                    {niveau}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Filière */}
            <div className="space-y-1.5 flex flex-col">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="major">
                    Filière <span className="text-blue-600 dark:text-blue-400">*</span>
                </label>
                <div className="relative group">
                    <GraduationCap className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                    <select
                        id="major"
                        required
                        className={selectClass(formData.major)}
                        value={formData.major}
                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    >
                        <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-400">Sélectionner une filière</option>
                        {UPF_FILIERES.map((group) => (
                            <optgroup key={group.group} label={group.group} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                                {group.options.map((filiere) => (
                                    <option key={filiere} value={filiere}>
                                        {filiere}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-3.5 border border-red-100 dark:border-red-900/50 text-xs font-medium rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> 
                    <span>{error}</span>
                </div>
            )}

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm rounded shadow-sm hover:shadow-md transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer group"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting Application...</span>
                        </>
                    ) : (
                        <>
                            <span>Submit Application</span>
                            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </button>
                <p className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs sm:max-w-sm mx-auto">
                    <Lock className="w-3.5 h-3.5 inline-block mr-1.5 align-text-bottom text-slate-400 dark:text-slate-500" />
                    Your information is strictly used for UIT Club recruitment purposes.
                </p>
            </div>
        </form>
    );
};

export default JoinForm;
