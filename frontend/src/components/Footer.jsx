import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import JoinModal from './JoinModal';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

// Discord Brand SVG Icon
const DiscordIcon = ({ className = "w-4 h-4" }) => (
    <svg 
        className={className} 
        fill="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
);

const Footer = () => {
    const [showJoinModal, setShowJoinModal] = useState(false);
    const { isDark } = useTheme();

    return (
        <footer className="bg-white dark:bg-slate-950 pt-16 md:pt-24 pb-8 md:pb-12 px-4 sm:px-6 relative transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-12 md:mb-16">
                    <div className="flex flex-col gap-6">
                        <Link to="/" className="flex items-center">
                            <Logo className="h-10" />
                        </Link>
                        {/* Social Links */}
                        <div className="flex items-center gap-4 sm:gap-5">
                            <a 
                                href="https://www.instagram.com/upf_uit/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-950/40 transition-all group"
                                title="Instagram"
                            >
                                <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
                            </a>
                            <a 
                                href="https://discord.gg/qAKkVFMbtn" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#5865F2] dark:hover:text-[#7983f5] hover:border-[#5865F2]/40 dark:hover:border-[#5865F2]/40 hover:bg-[#5865F2]/10 dark:hover:bg-[#5865F2]/15 transition-all group"
                                title="Join our Discord Server"
                            >
                                <DiscordIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                            </a>
                            <a 
                                href="https://www.linkedin.com/company/upf-infor-technology/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all group"
                                title="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4 transition-transform group-hover:scale-110" />
                            </a>
                            <a 
                                href="mailto:uit.club@upf.ac.ma" 
                                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all group"
                                title="Send Email"
                            >
                                <Mail className="w-4 h-4 transition-transform group-hover:scale-110" />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center w-full sm:w-auto">
                        <Link to="/articles" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Articles</Link>
                        <Link to="/events" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Events</Link>
                        <Link to="/team" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Team</Link>
                        <Link 
                            to="/register"
                            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 hover:shadow-md transition-all active:scale-95 inline-flex items-center justify-center shadow-xs"
                        >
                            Join Club
                        </Link>
                    </div>
                </div>
                
                <div className="pt-6 md:pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <div className="text-center md:text-left">© {new Date().getFullYear()} UIT Club — UPF University. All rights reserved.</div>
                    <div className="text-center md:text-right">Made with care by UIT Dev Team</div>
                </div>
            </div>

            <JoinModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />
        </footer>
    );
};

export default Footer;

