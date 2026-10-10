import React from 'react';
import logoDark from '../assets/dark.png';

/**
 * Universal UIT Logo Component
 * Uses CSS masking with background-color to render the logo in solid, crisp colors.
 * This completely prevents mobile browser Force-Dark double-inversion bugs
 * caused by fragile `filter: brightness(0) invert(1)` styles on raster images.
 * 
 * @param {string} className - Optional Tailwind sizing / spacing classes
 * @param {'auto' | 'white' | 'dark'} variant - Color variant:
 *   - 'auto': slate-900 in light mode, white in dark mode
 *   - 'white': always pure white (e.g. transparent navbar over dark hero)
 *   - 'dark': always dark slate-900
 */
const Logo = ({ className = 'h-8 md:h-10', variant = 'auto' }) => {
    const colorClass = 
        variant === 'white'
            ? 'bg-white'
            : variant === 'dark'
            ? 'bg-slate-900'
            : 'bg-slate-900 dark:bg-white';

    return (
        <div
            className={`inline-block aspect-[723/194] transition-colors duration-200 select-none ${colorClass} ${className}`}
            style={{
                maskImage: `url(${logoDark})`,
                WebkitMaskImage: `url(${logoDark})`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'left center',
                WebkitMaskPosition: 'left center',
            }}
            role="img"
            aria-label="UPF Information Technology Club (UIT) Logo"
        />
    );
};

export default Logo;
