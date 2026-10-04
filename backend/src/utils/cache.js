// In-memory cache with TTL and prefix invalidation
const store = new Map();

const get = (key) => {
    const item = store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
        store.delete(key);
        return null;
    }
    return item.data;
};

const set = (key, data, ttlSeconds = 60) => {
    store.set(key, {
        data,
        expiresAt: Date.now() + (ttlSeconds * 1000)
    });
};

const invalidatePrefix = (prefix) => {
    for (const key of store.keys()) {
        if (key.includes(prefix)) {
            store.delete(key);
        }
    }
};

const clear = () => store.clear();

// Express middleware for caching GET routes
const cacheMiddleware = (ttlSeconds = 60, prefix = '') => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') return next();

        // Skip caching for skip_view or admin editing
        if (req.query.skip_view === 'true') return next();

        const cacheKey = (prefix || req.baseUrl || '') + req.originalUrl;
        const cached = get(cacheKey);

        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            return res.status(200).json(cached);
        }

        // Intercept res.json
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                set(cacheKey, body, ttlSeconds);
                res.setHeader('X-Cache', 'MISS');
            }
            return originalJson(body);
        };

        next();
    };
};

module.exports = {
    get,
    set,
    invalidatePrefix,
    clear,
    cacheMiddleware
};
