import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import JoinModal from './JoinModal';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            !isHomePage || isScrolled
                ? 'bg-white border-b border-slate-100 py-3 md:py-4' 
                : 'bg-transparent py-4 md:py-6'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                <Link to="/" className={`text-xl font-bold tracking-tight transition-colors ${
                    !isHomePage || isScrolled ? 'text-[#1e3a8a]' : 'text-white drop-shadow-md'
                }`}>
                    UIT
                </Link>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden md:flex items-center gap-6">
                        <Link 
                            to="/articles" 
                            className={`relative text-sm font-medium transition-all group ${
                                !isHomePage || isScrolled
                                    ? location.pathname.startsWith('/articles') 
                                        ? 'text-[#1e3a8a]' 
                                        : 'text-[#475569] hover:text-[#1e3a8a]'
                                    : location.pathname.startsWith('/articles') 
                                        ? 'text-white' 
                                        : 'text-white/90 hover:text-white'
                            }`}
                        >
                            Articles
                            <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                                location.pathname.startsWith('/articles') 
                                    ? 'w-full bg-current' 
                                    : 'w-0 group-hover:w-full bg-current'
                            }`}></span>
                        </Link>
                        <Link 
                            to="/events" 
                            className={`relative text-sm font-medium transition-all group ${
                                !isHomePage || isScrolled
                                    ? location.pathname.startsWith('/events') 
                                        ? 'text-[#1e3a8a]' 
                                        : 'text-[#475569] hover:text-[#1e3a8a]'
                                    : location.pathname.startsWith('/events') 
                                        ? 'text-white' 
                                        : 'text-white/90 hover:text-white'
                            }`}
                        >
                            Events
                            <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                                location.pathname.startsWith('/events') 
                                    ? 'w-full bg-current' 
                                    : 'w-0 group-hover:w-full bg-current'
                            }`}></span>
                        </Link>
                        <Link 
                            to="/team" 
                            className={`relative text-sm font-medium transition-all group ${
                                !isHomePage || isScrolled
                                    ? location.pathname === '/team' 
                                        ? 'text-[#1e3a8a]' 
                                        : 'text-[#475569] hover:text-[#1e3a8a]'
                                    : location.pathname === '/team' 
                                        ? 'text-white' 
                                        : 'text-white/90 hover:text-white'
                            }`}
                        >
                            Team
                            <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                                location.pathname === '/team' 
                                    ? 'w-full bg-current' 
                                    : 'w-0 group-hover:w-full bg-current'
                            }`}></span>
                        </Link>
                    </div>

                    <button 
                        onClick={() => setShowJoinModal(true)}
                        className={`px-3 py-2 md:px-4 md:py-2 text-xs font-semibold rounded transition-all active:scale-95 ${
                            !isHomePage || isScrolled
                                ? 'bg-[#1e3a8a] text-white hover:bg-[#1e1e6b] hover:shadow-md'
                                : 'bg-white text-[#1e3a8a] hover:bg-white/90'
                        }`}
                    >
                        <span className="hidden sm:inline">Join Club</span>
                        <span className="sm:hidden">Join</span>
                    </button>

                    <JoinModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${
                            !isHomePage || isScrolled
                                ? 'text-[#1e3a8a] hover:bg-slate-50' 
                                : 'text-white hover:bg-white/10'
                        }`}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 py-4 px-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
                    <Link 
                        to="/articles" 
                        onClick={() => setIsOpen(false)} 
                        className="px-4 py-3 text-sm font-medium text-[#475569] hover:text-[#1e3a8a] hover:bg-slate-50 rounded-lg transition-all active:bg-slate-100"
                    >
                        Articles
                    </Link>
                    <Link 
                        to="/events" 
                        onClick={() => setIsOpen(false)} 
                        className="px-4 py-3 text-sm font-medium text-[#475569] hover:text-[#1e3a8a] hover:bg-slate-50 rounded-lg transition-all active:bg-slate-100"
                    >
                        Events
                    </Link>
                    <Link 
                        to="/team" 
                        onClick={() => setIsOpen(false)} 
                        className="px-4 py-3 text-sm font-medium text-[#475569] hover:text-[#1e3a8a] hover:bg-slate-50 rounded-lg transition-all active:bg-slate-100"
                    >
                        Team
                    </Link>
                    <div className="pt-2 mt-2 border-t border-slate-100">
                        <button 
                            onClick={() => { setIsOpen(false); setShowJoinModal(true); }}
                            className="w-full px-4 py-3 bg-[#1e3a8a] text-white text-sm font-semibold rounded-lg active:scale-[0.98] transition-all text-center"
                        >
                            Join Club
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

