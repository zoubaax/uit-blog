import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, FileText, Home, Menu, Users, X } from 'lucide-react';
import JoinModal from './JoinModal';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

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
                    <Logo 
                        variant={isTransparent ? 'white' : 'auto'} 
                        className="h-8 md:h-10" 
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
                            onClick={() => setIsOpen(false)}
                            className={`inline-flex items-center justify-center font-semibold rounded-lg transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                'h-8 px-2.5 sm:px-3 text-xs md:h-10 md:px-4 md:text-sm'
                            } ${
                                !isTransparent
                                    ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500'
                                    : 'bg-white text-[#1e3a8a] shadow-sm hover:bg-white/90'
                            }`}
                        >
                            <span className="inline min-[360px]:hidden">Join</span>
                            <span className="hidden min-[360px]:inline">Join Club</span>
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
                            <div className="p-4 space-y-3">
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-500 shadow-sm"
                                >
                                    Join Club
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>

                                <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                    <a
                                        href="https://discord.gg/qAKkVFMbtn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-xl text-slate-500 hover:text-[#5865F2] hover:bg-[#5865F2]/10 dark:text-slate-400 dark:hover:text-[#7983f5] transition-colors"
                                        title="Discord"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                        </svg>
                                    </a>
                                    <a
                                        href="https://www.instagram.com/upf_uit/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-xl text-slate-500 hover:text-pink-600 hover:bg-pink-50 dark:text-slate-400 dark:hover:text-pink-400 transition-colors"
                                        title="Instagram"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                        </svg>
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/company/upf-infor-technology/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                        title="LinkedIn"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                            <rect width="4" height="12" x="2" y="9"/>
                                            <circle cx="4" cy="4" r="2"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;

