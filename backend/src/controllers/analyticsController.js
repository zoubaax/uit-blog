const analyticsService = require('../services/analyticsService');
const catchAsync = require('../utils/catchAsync');

/**
 * Public non-blocking tracking endpoint
 */
const track = catchAsync(async (req, res) => {
    const { path, eventType, resourceId, resourceTitle, visitorId, referrer, browserOverride } = req.body || {};

    const ip = req.headers['x-forwarded-for'] 
        ? req.headers['x-forwarded-for'].split(',')[0].trim() 
        : req.socket.remoteAddress || '';

    const userAgent = req.headers['user-agent'] || '';
    const host = req.headers.host || '';

    // Fire and forget or quick response
    await analyticsService.track({
        path: path || '/',
        eventType: eventType || 'pageview',
        resourceId,
        resourceTitle,
        visitorId,
        referrer,
        browserOverride,
        userAgent,
        ip,
        host
    });

    res.status(200).json({ success: true });
});

/**
 * Admin stats endpoint
 */
const getStats = catchAsync(async (req, res) => {
    const { range = '7d' } = req.query;
    const stats = await analyticsService.getOverviewStats(range);
    res.status(200).json({ success: true, data: stats });
});

module.exports = {
    track,
    getStats
};
