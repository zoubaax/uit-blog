import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 py-4">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-[#1e3a8a] tracking-tight">
                    UIT
                </Link>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-6">
                        <Link 
                            to="/articles" 
                            className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/articles') ? 'text-[#1e3a8a]' : 'text-[#475569] hover:text-[#1e3a8a]'}`}
                        >
                            Articles
                        </Link>
                        <Link 
                            to="/events" 
                            className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/events') ? 'text-[#1e3a8a]' : 'text-[#475569] hover:text-[#1e3a8a]'}`}
                        >
                            Events
                        </Link>
                        <Link 
                            to="/team" 
                            className={`text-sm font-medium transition-colors ${location.pathname === '/team' ? 'text-[#1e3a8a]' : 'text-[#475569] hover:text-[#1e3a8a]'}`}
                        >
                            Team
                        </Link>
                    </div>

                    <Link 
                        to="/login" 
                        className="px-4 py-2 bg-[#1e3a8a] text-white text-xs font-semibold rounded hover:bg-[#1e1e6b] transition-all active:scale-95"
                    >
                        Apply
                    </Link>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-1 text-[#1e3a8a]"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 py-6 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
                    <Link to="/articles" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[#475569]">Articles</Link>
                    <Link to="/events" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[#475569]">Events</Link>
                    <Link to="/team" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[#475569]">Team</Link>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[#475569]">Login</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

