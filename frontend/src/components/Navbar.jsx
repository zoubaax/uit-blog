import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import JoinModal from './JoinModal';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

import logo from '../assets/logo.png';
import logoDark from '../assets/dark.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const location = useLocation();
    const { isDark } = useTheme();
    const isHomePage = location.pathname === '/' || location.pathname === '';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isTransparent = isHomePage && !isScrolled;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            !isTransparent
                ? 'bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 py-3 md:py-4 shadow-xs' 
                : 'bg-transparent py-4 md:py-6'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img 
                        src={isTransparent ? logo : logoDark} 
                        alt="UIT Logo" 
                        className="h-8 md:h-10 w-auto transition-all" 
                        style={{ 
                            filter: isTransparent || isDark ? 'brightness(0) invert(1)' : 'none' 
                        }}
                    />
                </Link>

                <div className="flex items-center gap-3 md:gap-6">
                    <div className="hidden md:flex items-center gap-6">
                        <Link 
                            to="/articles" 
                            className={`relative text-sm font-medium transition-all group ${
                                !isTransparent
                                    ? location.pathname.startsWith('/articles') 
                                        ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                                    : location.pathname.startsWith('/articles') 
                                        ? 'text-white font-semibold' 
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
                                !isTransparent
                                    ? location.pathname.startsWith('/events') 
                                        ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                                    : location.pathname.startsWith('/events') 
                                        ? 'text-white font-semibold' 
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
                                !isTransparent
                                    ? location.pathname === '/team' 
                                        ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                                    : location.pathname === '/team' 
                                        ? 'text-white font-semibold' 
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

                    {/* Theme Toggle (Desktop) */}
                    <ThemeToggle transparentOnTop={isTransparent} className="hidden sm:flex" />

                    <Link 
                        to="/register"
                        className={`px-3 py-2 md:px-4 md:py-2 text-xs font-semibold rounded transition-all active:scale-95 inline-flex items-center justify-center shadow-xs ${
                            !isTransparent
                                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md dark:bg-blue-600 dark:hover:bg-blue-500'
                                : 'bg-white text-[#1e3a8a] hover:bg-white/90'
                        }`}
                    >
                        <span className="hidden sm:inline">Join Club</span>
                        <span className="sm:hidden">Join</span>
                    </Link>

                    <JoinModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${
                            !isTransparent
                                ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800' 
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
                <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-4 px-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
                    <Link 
                        to="/articles" 
                        onClick={() => setIsOpen(false)} 
                        className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-all"
                    >
                        Articles
                    </Link>
                    <Link 
                        to="/events" 
                        onClick={() => setIsOpen(false)} 
                        className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-all"
                    >
                        Events
                    </Link>
                    <Link 
                        to="/team" 
                        onClick={() => setIsOpen(false)} 
                        className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-all"
                    >
                        Team
                    </Link>

                    <div className="flex items-center justify-between px-4 py-2.5 my-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Appearance</span>
                        <ThemeToggle />
                    </div>

                    <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                        <Link 
                            to="/register"
                            onClick={() => setIsOpen(false)}
                            className="block w-full px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded active:scale-[0.98] transition-all text-center shadow-sm"
                        >
                            Join Club
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

