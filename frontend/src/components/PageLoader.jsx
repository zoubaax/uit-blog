import logoDark from '../assets/dark.png';

/**
 * PageLoader — Premium full-page loading screen for public pages.
 * Shows the UIT logo with a pulsing animation and a sleek progress bar.
 */
const PageLoader = ({ message = 'Loading' }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #1e3a8a 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Logo with pulse */}
            <div className="relative mb-8 animate-loader-breathe">
                <img
                    src={logoDark}
                    alt="UIT Club"
                    className="h-12 md:h-16 w-auto"
                />
            </div>

            {/* Animated progress bar */}
            <div className="w-48 h-[2px] bg-slate-100 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#1e3a8a] rounded-full animate-loader-slide" />
            </div>

            {/* Loading text */}
            <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-[0.2em]">
                    {message}
                </span>
                <span className="flex gap-[2px] mt-[1px]">
                    <span className="w-[3px] h-[3px] bg-slate-300 rounded-full animate-loader-dot" style={{ animationDelay: '0ms' }} />
                    <span className="w-[3px] h-[3px] bg-slate-300 rounded-full animate-loader-dot" style={{ animationDelay: '200ms' }} />
                    <span className="w-[3px] h-[3px] bg-slate-300 rounded-full animate-loader-dot" style={{ animationDelay: '400ms' }} />
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
                <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1e3a8a] animate-spin" />
            </div>
            <span className="text-sm font-medium text-slate-400">{message}</span>
        </div>
    );
};

export default PageLoader;
