import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, FileText, Home, Menu, Users, X } from 'lucide-react';
import JoinModal from './JoinModal';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

import logo from '../assets/logo.png';
import logoDark from '../assets/dark.png';

const NAV_LINKS = [
    {
        to: '/articles',
        label: 'Articles',
        icon: FileText,
        isActive: (path) => path.startsWith('/articles'),
    },
    {
        to: '/events',
        label: 'Events',
        icon: CalendarDays,
        isActive: (path) => path.startsWith('/events'),
    },
    {
        to: '/team',
        label: 'Team',
        icon: Users,
        isActive: (path) => path === '/team',
    },
];

const MOBILE_LINKS = [
    {
        to: '/',
        label: 'Home',
        icon: Home,
        isActive: (path) => path === '/' || path === '',
    },
    ...NAV_LINKS,
];

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

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const media = window.matchMedia('(min-width: 768px)');
        const closeOnDesktop = () => {
            if (media.matches) setIsOpen(false);
        };

        media.addEventListener('change', closeOnDesktop);
        return () => media.removeEventListener('change', closeOnDesktop);
    }, []);

    useEffect(() => {
        if (!isOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setIsOpen(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const isTransparent = isHomePage && !isScrolled;
    const showJoin = !location.pathname.startsWith('/register')
        && !location.pathname.startsWith('/apply')
        && !location.pathname.startsWith('/regester');

    return (
        <>
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
            !isTransparent
                ? 'bg-white/90 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800'
                : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-[4.5rem] flex items-center justify-between gap-4">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center shrink-0">
                    <img 
                        src={isTransparent ? logo : logoDark} 
                        alt="UIT Logo" 
                        className="h-8 md:h-10 w-auto transition-all" 
                        style={{ 
                            filter: isTransparent || isDark ? 'brightness(0) invert(1)' : 'none' 
                        }}
                    />
                </Link>

                <div className="flex items-center gap-1 sm:gap-2">
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((item) => {
                            const active = item.isActive(location.pathname);
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    aria-current={active ? 'page' : undefined}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                        !isTransparent
                                            ? active
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300'
                                            : active
                                                ? 'bg-white/15 text-white'
                                                : 'text-white/90 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    <span
                        className={`hidden md:block mx-1 h-5 w-px ${
                            isTransparent ? 'bg-white/30' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                        aria-hidden="true"
                    />

                    <ThemeToggle transparentOnTop={isTransparent} />

                    {showJoin && (
                        <Link
                            to="/register"
                            className={`hidden md:inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                !isTransparent
                                    ? 'bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500'
                                    : 'bg-white text-[#1e3a8a] hover:bg-white/90'
                            }`}
                        >
                            Join Club
                        </Link>
                    )}

                    <JoinModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />

                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            !isTransparent
                                ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                : 'text-white hover:bg-white/10'
                        }`}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </nav>

            {isOpen && (
                <div id="mobile-menu" className="md:hidden fixed inset-0 z-[60] mobile-menu-panel">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
                        aria-label="Close menu"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="mobile-menu-drawer absolute inset-y-0 right-0 flex h-full w-[min(86%,340px)] flex-col bg-white text-slate-900 shadow-[0_0_40px_rgba(15,23,42,0.18)] dark:bg-slate-950 dark:text-slate-100 dark:shadow-[0_0_40px_rgba(0,0,0,0.45)]">
                        <div className="flex items-center justify-between px-5 pt-5 pb-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                                Menu
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                                aria-label="Close menu"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <nav className="flex flex-1 flex-col gap-1 px-3">
                            {MOBILE_LINKS.map((item) => {
                                const active = item.isActive(location.pathname);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setIsOpen(false)}
                                        aria-current={active ? 'page' : undefined}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition-colors ${
                                            active
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                                                : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900'
                                        }`}
                                    >
                                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                            active
                                                ? 'bg-blue-600 text-white dark:bg-blue-500'
                                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
                                        }`}>
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {showJoin && (
                            <div className="p-4">
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                                >
                                    Join Club
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;

