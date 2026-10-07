import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '', transparentOnTop = false }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`h-10 w-10 rounded-lg transition-colors duration-200 flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-95 ${
                transparentOnTop
                    ? 'text-white/90 hover:text-white hover:bg-white/10 focus-visible:ring-offset-transparent'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950'
            } ${className}`}
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                <Sun 
                    className={`w-5 h-5 absolute transition-all duration-300 transform text-current ${
                        isDark 
                            ? 'rotate-0 scale-100 opacity-100' 
                            : '-rotate-90 scale-0 opacity-0'
                    }`} 
                />
                <Moon 
                    className={`w-5 h-5 absolute transition-all duration-300 transform text-current ${
                        isDark 
                            ? 'rotate-90 scale-0 opacity-0' 
                            : 'rotate-0 scale-100 opacity-100'
                    }`} 
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
