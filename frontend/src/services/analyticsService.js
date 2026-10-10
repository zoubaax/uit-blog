import api from './api';

const VISITOR_KEY = 'uit_visitor_id';

/**
 * Get or create an anonymous visitor ID stored in localStorage
 */
const getVisitorId = () => {
    try {
        let vid = localStorage.getItem(VISITOR_KEY);
        if (!vid) {
            vid = 'v_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
            localStorage.setItem(VISITOR_KEY, vid);
        }
        return vid;
    } catch {
        return null;
    }
};

// Client-side cache to deduplicate rapid events within 3 seconds
const recentTracks = new Map();

/**
 * Detect client browser capabilities (e.g. Brave navigator API)
 */
const detectClientBrowser = async () => {
    try {
        if (navigator.brave && typeof navigator.brave.isBrave === 'function') {
            const isBrave = await navigator.brave.isBrave();
            if (isBrave) return 'Brave';
        }
        const ua = navigator.userAgent;
        if (/Arc/i.test(ua)) return 'Arc';
        if (/Edg/i.test(ua)) return 'Edge';
        if (/OPR|Opera/i.test(ua)) return 'Opera';
        if (/Vivaldi/i.test(ua)) return 'Vivaldi';
        if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet';
        if (/DuckDuckGo/i.test(ua)) return 'DuckDuckGo';
        if (/Firefox|FxiOS/i.test(ua)) return 'Firefox';
        if (/Safari/i.test(ua) && !/Chrome|CriOS|Android|Edg|OPR/i.test(ua)) return 'Safari';
        if (/Chrome|CriOS/i.test(ua)) return 'Chrome';
    } catch {
        // ignore
    }
    return null;
};

const analyticsService = {
    /**
     * Send tracking ping for a pageview or custom event
     */
    track: async ({
        path = window.location.pathname,
        eventType = 'pageview',
        resourceId = null,
        resourceTitle = null,
        referrer = document.referrer || ''
    } = {}) => {
        try {
            // Do not track admin dashboard internal navigation
            if (path && path.startsWith('/dashboard')) {
                return;
            }

            const dedupeKey = `${path}_${eventType}_${resourceId || ''}`;
            const now = Date.now();
            const lastTime = recentTracks.get(dedupeKey);
            if (lastTime && (now - lastTime) < 3000) {
                return; // Suppress duplicate call
            }
            recentTracks.set(dedupeKey, now);

            const visitorId = getVisitorId();
            const browserOverride = await detectClientBrowser();

            await api.post('/analytics/track', {
                path,
                eventType,
                resourceId,
                resourceTitle,
                visitorId,
                referrer,
                browserOverride
            });
        } catch {
            // Tracking errors should be completely silent and never affect the user
        }
    },

    /**
     * Fetch aggregated statistics for admin dashboard
     * @param {string} range '24h' | '7d' | '30d' | '90d' | 'all'
     */
    getStats: async (range = '7d') => {
        return await api.get(`/analytics/stats?range=${range}`);
    }
};

export default analyticsService;
