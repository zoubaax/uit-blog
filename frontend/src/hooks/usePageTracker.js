import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import analyticsService from '../services/analyticsService';

/**
 * Hook to automatically track pageviews on route change
 */
export const usePageTracker = () => {
    const location = useLocation();
    const lastTrackedPath = useRef('');

    useEffect(() => {
        const fullPath = location.pathname + location.search;

        // Skip admin dashboard
        if (location.pathname.startsWith('/dashboard')) {
            return;
        }

        // Prevent double-tracking detail pages where ArticleDetail / EventDetail record dedicated enriched events
        const isArticleDetail = location.pathname.startsWith('/articles/') && location.pathname.length > '/articles/'.length;
        const isEventDetail = location.pathname.startsWith('/events/') && location.pathname.length > '/events/'.length;
        if (isArticleDetail || isEventDetail) {
            return;
        }

        // Prevent duplicate tracking of the exact same path
        if (lastTrackedPath.current === fullPath) {
            return;
        }

        lastTrackedPath.current = fullPath;

        // Slight delay to ensure title and metadata are mounted
        const timer = setTimeout(() => {
            analyticsService.track({
                path: location.pathname,
                eventType: 'pageview',
                referrer: document.referrer || ''
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [location.pathname, location.search]);
};

export default usePageTracker;
