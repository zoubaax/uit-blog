import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { Lock, Mail, Loader2 } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
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
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
            <div className="w-full max-w-sm bg-white border border-slate-100 p-10 space-y-10">
                <div className="text-center">
                    <span className="text-[10px] font-bold text-[#2563eb] uppercase tracking-[0.2em] mb-4 block">Portal Access</span>
                    <h2 className="text-3xl font-semibold text-[#1e3a8a] tracking-tight">Member Login</h2>
                </div>

                {error && (
                    <div className="p-4 text-xs font-medium text-red-600 bg-red-50 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest block" htmlFor="email">
                            University Email
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded border border-slate-200 focus:border-[#1e3a8a] outline-none text-sm transition-colors"
                                placeholder="name@university.edu"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest block" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded border border-slate-200 focus:border-[#1e3a8a] outline-none text-sm transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#1e3a8a] hover:bg-[#1e1e6b] text-white text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authenticate'}
                    </button>
                    
                    <div className="text-center pt-4">
                        <p className="text-[10px] text-[#94a3b8] leading-relaxed italic">
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
