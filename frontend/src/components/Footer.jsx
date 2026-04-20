import { useState } from 'react';
import { Link } from 'react-router-dom';
import JoinModal from './JoinModal';
import logoDark from '../assets/dark.png';

const Footer = () => {
    const [showJoinModal, setShowJoinModal] = useState(false);

    return (
        <footer className="bg-white pt-16 md:pt-24 pb-8 md:pb-12 px-4 sm:px-6 border-t border-slate-100 relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-12 md:mb-16">
                    <Link to="/" className="flex items-center">
                        <img src={logoDark} alt="UIT Logo" className="h-10 w-auto" />
                    </Link>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center w-full sm:w-auto">
                        <Link to="/articles" className="text-sm font-medium text-[#475569] hover:text-[#1e3a8a] transition-colors">Articles</Link>
                        <Link to="/events" className="text-sm font-medium text-[#475569] hover:text-[#1e3a8a] transition-colors">Events</Link>
                        <Link to="/team" className="text-sm font-medium text-[#475569] hover:text-[#1e3a8a] transition-colors">Team</Link>
                        <button 
                            onClick={() => setShowJoinModal(true)}
                            className="w-full sm:w-auto px-4 py-2.5 bg-[#1e3a8a] text-white text-sm font-semibold rounded hover:bg-[#1e1e6b] hover:shadow-md transition-all active:scale-95"
                        >
                            Join Club
                        </button>
                    </div>
                </div>
                
                <div className="pt-6 md:pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-[#94a3b8] uppercase tracking-widest">
                    <div className="text-center md:text-left">© {new Date().getFullYear()} University of IT Club. All rights reserved.</div>
                    <div className="text-center md:text-right">Made with care by UIT Dev Team</div>
                </div>
            </div>

            <JoinModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />
        </footer>
    );
};

export default Footer;

