import { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, Users, LogOut, ClipboardList, Menu, X } from 'lucide-react';
import authService from '../services/authService';
import logoDark from '../assets/dark.png';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const AdminLayout = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { path: '/dashboard/articles', label: 'Articles', icon: FileText },
        { path: '/dashboard/events', label: 'Events', icon: Calendar },
        { path: '/dashboard/team', label: 'Team', icon: Users },
        { path: '/dashboard/applications', label: 'Applications', icon: ClipboardList },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between px-4 h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 z-30">
                <Link to="/dashboard" className="flex items-center">
                    <img 
                        src={logoDark} 
                        alt="Logo" 
                        className="h-7 w-auto transition-all dark:brightness-0 dark:invert" 
                    />
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button 
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                        aria-label="Toggle Navigation"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 fixed inset-y-0 left-0 z-50 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
                <div className="hidden md:flex h-16 items-center justify-between px-6 border-b border-gray-100 dark:border-slate-800">
                    <Link to="/dashboard" className="flex items-center">
                        <img 
                            src={logoDark} 
                            alt="Logo" 
                            className="h-7 w-auto transition-all dark:brightness-0 dark:invert" 
                        />
                    </Link>
                    <ThemeToggle />
                </div>

                <nav className="p-4 space-y-1 flex-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                isActive 
                                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold' 
                                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/60 hover:text-gray-900 dark:hover:text-slate-200'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
