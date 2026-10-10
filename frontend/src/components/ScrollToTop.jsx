import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Automatically scrolls window to top on route change
 */
const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // If a hash anchor is present (e.g. #section), scroll to that element
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }

        // Instant scroll to top of page
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });

        // Fallback for document scrolling containers
        if (document.documentElement) {
            document.documentElement.scrollTop = 0;
        }
        if (document.body) {
            document.body.scrollTop = 0;
        }
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;
