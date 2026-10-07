import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import JoinModal from './JoinModal';
import logoDark from '../assets/dark.png';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
    const [showJoinModal, setShowJoinModal] = useState(false);
    const { isDark } = useTheme();

    return (
        <footer className="bg-white dark:bg-slate-950 pt-16 md:pt-24 pb-8 md:pb-12 px-4 sm:px-6 relative transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-12 md:mb-16">
                    <div className="flex flex-col gap-6">
                        <Link to="/" className="flex items-center">
                            <img 
                                src={logoDark} 
                                alt="UIT Logo" 
                                className="h-10 w-auto transition-all" 
                                style={{ 
                                    filter: isDark ? 'brightness(0) invert(1)' : 'none' 
                                }}
                            />
                        </Link>
                        {/* Social Links */}
                        <div className="flex items-center gap-5">
                            <a 
                                href="https://www.instagram.com/upf_uit/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                                title="Instagram"
                            >
                                <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
                            </a>
                            <a 
                                href="https://www.linkedin.com/company/upf-infor-technology/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                                title="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4 transition-transform group-hover:scale-110" />
                            </a>
                            <a 
                                href="mailto:uit.club@upf.ac.ma" 
                                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
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

