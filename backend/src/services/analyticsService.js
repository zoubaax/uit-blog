const crypto = require('crypto');
const analyticsModel = require('../models/analyticsModel');
const eventModel = require('../models/eventModel');
const articleModel = require('../models/articleModel');
const { parseUserAgent, parseReferrer } = require('../utils/userAgentParser');

/**
 * Generate a privacy-friendly visitor hash (Zero PII stored)
 */
const generateVisitorHash = (visitorId, ip = '', userAgent = '') => {
    if (visitorId && typeof visitorId === 'string' && visitorId.trim() !== '') {
        return crypto.createHash('sha256').update(`uit_${visitorId.trim()}`).digest('hex').substring(0, 32);
    }

    // Daily salt ensures hash cannot be reverse engineered across long periods
    const today = new Date().toISOString().slice(0, 10);
    const raw = `${ip}_${userAgent}_${today}_${process.env.JWT_SECRET || 'uit_secret'}`;
    return crypto.createHash('sha256').update(raw).digest('hex').substring(0, 32);
};

// In-memory cache to deduplicate rapid duplicate pings within 5 seconds (e.g. React StrictMode or double-clicks)
const recentHits = new Map();
setInterval(() => {
    const now = Date.now();
    for (const [key, timestamp] of recentHits.entries()) {
        if (now - timestamp > 10000) {
            recentHits.delete(key);
        }
    }
}, 30000);

/**
 * Track an incoming visitor event
 */
const track = async ({
    path = '/',
    eventType = 'pageview',
    resourceId = null,
    resourceTitle = null,
    visitorId = null,
    referrer = '',
    browserOverride = null,
    userAgent = '',
    ip = '',
    host = ''
}) => {
    // 1. Ignore bot crawlers, health checks, or internal API calls
    if (path.startsWith('/api') || path.startsWith('/health') || /bot|crawler|spider|headless/i.test(userAgent)) {
        return null;
    }

    // 2. Parse device, browser, os, referrer
    const { deviceType, browser, os } = parseUserAgent(userAgent);
    const finalBrowser = (browserOverride && typeof browserOverride === 'string' && browserOverride.trim() !== '') 
        ? browserOverride.trim() 
        : browser;
    const parsedRef = parseReferrer(referrer, host);
    const visitorHash = generateVisitorHash(visitorId, ip, userAgent);

    // 3. Deduplicate back-to-back duplicate hits for the same visitor & path within 4 seconds
    const dedupeKey = `${visitorHash}_${path}_${eventType}_${resourceId || ''}`;
    const now = Date.now();
    const lastHit = recentHits.get(dedupeKey);
    if (lastHit && (now - lastHit) < 4000) {
        return null; // Ignore rapid duplicate
    }
    recentHits.set(dedupeKey, now);

    // 4. Record single event in database
    const record = await analyticsModel.recordEvent({
        path: path || '/',
        eventType: eventType || 'pageview',
        resourceId,
        resourceTitle,
        visitorHash,
        referrer: parsedRef,
        deviceType,
        browser: finalBrowser,
        os
    });

    return record;
};

/**
 * Get aggregated dashboard statistics
 */
const getOverviewStats = async (range = '7d') => {
    return await analyticsModel.getStats(range);
};

module.exports = {
    track,
    getOverviewStats
};
