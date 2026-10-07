import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { Lock, Mail, Loader2 } from 'lucide-react';
import logoDark from '../assets/dark.png';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.email || !formData.password) {
                throw new Error('Please fill in all fields');
            }
            await authService.login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 pt-24 md:pt-28 pb-20">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-10 space-y-10">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <img 
                            src={logoDark} 
                            alt="UIT Logo" 
                            className="h-12 w-auto transition-all dark:brightness-0 dark:invert" 
                        />
                    </div>
                    <span className="text-[10px] font-bold text-[#2563eb] dark:text-blue-400 uppercase tracking-[0.2em] mb-4 block">Portal Access</span>
                    <h2 className="text-3xl font-semibold text-[#1e3a8a] dark:text-white tracking-tight">Member Login</h2>
                </div>

                {error && (
                    <div className="p-4 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-widest block" htmlFor="email">
                            University Email
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-[#1e3a8a] dark:focus:border-blue-500 outline-none text-sm transition-colors"
                                placeholder="name@university.edu"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-widest block" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-[#1e3a8a] dark:focus:border-blue-500 outline-none text-sm transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#1e3a8a] hover:bg-[#1e1e6b] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest transition-all rounded-lg active:scale-95 disabled:opacity-70 shadow-sm"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authenticate'}
                    </button>
                    
                    <div className="text-center pt-4">
                        <p className="text-[10px] text-[#94a3b8] dark:text-slate-500 leading-relaxed italic">
                            Authorized access only.<br />
                            Please contact systems administrator for credentials.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
