import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white pt-24 pb-12 px-6 border-t border-slate-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <Link to="/" className="text-2xl font-bold text-[#1e3a8a] tracking-tight">
                        UIT
                    </Link>
                    <div className="flex gap-10">
                        <Link to="/articles" className="text-sm font-medium text-[#475569] hover:text-[#1e3a8a] transition-colors">Articles</Link>
                        <Link to="/events" className="text-sm font-medium text-[#475569] hover:text-[#1e3a8a] transition-colors">Events</Link>
                        <Link to="/team" className="text-sm font-medium text-[#475569] hover:text-[#1e3a8a] transition-colors">Team</Link>
                        <Link to="/login" className="text-sm font-medium text-[#475569] hover:text-[#1e3a8a] transition-colors">Apply</Link>
                    </div>
                </div>
                
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-[#94a3b8] uppercase tracking-widest">
                    <div>© {new Date().getFullYear()} University of IT Club. All rights reserved.</div>
                    <div>Made with care by UIT Dev Team</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

