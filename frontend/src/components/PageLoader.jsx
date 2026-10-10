import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

/**
 * PageLoader — Premium full-page loading screen for public pages.
 * Shows the UIT logo with a pulsing animation and a sleek progress bar.
 */
const PageLoader = ({ message = 'Loading' }) => {
    let isDark = false;
    try {
        const theme = useTheme();
        isDark = theme?.isDark ?? false;
    } catch {
        isDark = false;
    }

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors">
            {/* Subtle background pattern */}
            <div
                className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Logo with pulse */}
            <div className="relative mb-8 animate-loader-breathe">
                <Logo className="h-12 md:h-16" />
            </div>

            {/* Animated progress bar */}
            <div className="w-48 h-[2px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#1e3a8a] rounded-full animate-loader-slide" />
            </div>

            {/* Loading text */}
            <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    {message}
                </span>
                <span className="flex gap-[2px] mt-[1px]">
                    <span className="w-[3px] h-[3px] bg-slate-300 dark:bg-slate-600 rounded-full animate-loader-dot" style={{ animationDelay: '0ms' }} />
                    <span className="w-[3px] h-[3px] bg-slate-300 dark:bg-slate-600 rounded-full animate-loader-dot" style={{ animationDelay: '200ms' }} />
                    <span className="w-[3px] h-[3px] bg-slate-300 dark:bg-slate-600 rounded-full animate-loader-dot" style={{ animationDelay: '400ms' }} />
                </span>
            </div>
        </div>
    );
};

/**
 * SectionLoader — Inline loader for sections within a page (admin panels, content areas).
 */
export const SectionLoader = ({ message = 'Loading data' }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            {/* Spinning ring */}
            <div className="relative w-10 h-10 mb-5">
                <div className="absolute inset-0 rounded-full border-2 border-slate-100 dark:border-slate-800" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1e3a8a] dark:border-t-blue-500 animate-spin" />
            </div>
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500">{message}</span>
        </div>
    );
};

export default PageLoader;
