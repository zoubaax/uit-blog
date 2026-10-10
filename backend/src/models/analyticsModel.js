const db = require('../config/db');

/**
 * Record a single tracking event or page view
 */
const recordEvent = async ({
    path,
    eventType = 'pageview',
    resourceId = null,
    resourceTitle = null,
    visitorHash = null,
    referrer = 'Direct',
    deviceType = 'desktop',
    browser = 'Other',
    os = 'Other'
}) => {
    const query = `
        INSERT INTO page_views (
            path, event_type, resource_id, resource_title, 
            visitor_hash, referrer, device_type, browser, os
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
    `;
    const params = [
        path.substring(0, 255),
        eventType.substring(0, 50),
        resourceId ? parseInt(resourceId, 10) : null,
        resourceTitle ? resourceTitle.substring(0, 255) : null,
        visitorHash ? visitorHash.substring(0, 64) : null,
        referrer ? referrer.substring(0, 500) : 'Direct',
        deviceType.substring(0, 20),
        browser.substring(0, 50),
        os.substring(0, 50)
    ];

    const result = await db.query(query, params);
    return result.rows[0];
};

/**
 * Get interval SQL snippet from range parameter
 */
const getIntervalString = (range) => {
    switch (range) {
        case '24h':
            return "INTERVAL '24 hours'";
        case '7d':
            return "INTERVAL '7 days'";
        case '30d':
            return "INTERVAL '30 days'";
        case '90d':
            return "INTERVAL '90 days'";
        case 'all':
            return "INTERVAL '10 years'";
        default:
            return "INTERVAL '7 days'";
    }
};

/**
 * Get comprehensive analytics stats for the admin dashboard
 */
const getStats = async (range = '7d') => {
    const interval = getIntervalString(range);

    // 1. Current Period Overview Metrics
    const currentMetricsQuery = `
        SELECT
            COUNT(*)::int AS total_pageviews,
            COUNT(DISTINCT visitor_hash)::int AS unique_visitors,
            COUNT(CASE WHEN event_type = 'article_view' THEN 1 END)::int AS article_reads,
            COUNT(CASE WHEN event_type = 'event_view' THEN 1 END)::int AS event_views,
            COUNT(CASE WHEN event_type = 'cta_click' OR path LIKE '%/register%' THEN 1 END)::int AS cta_clicks
        FROM page_views
        WHERE created_at >= NOW() - ${interval}
    `;

    // 2. Previous Period Metrics for percentage calculations
    const prevMetricsQuery = `
        SELECT
            COUNT(*)::int AS total_pageviews,
            COUNT(DISTINCT visitor_hash)::int AS unique_visitors,
            COUNT(CASE WHEN event_type = 'article_view' THEN 1 END)::int AS article_reads,
            COUNT(CASE WHEN event_type = 'event_view' THEN 1 END)::int AS event_views
        FROM page_views
        WHERE created_at >= NOW() - (${interval} * 2) 
          AND created_at < NOW() - ${interval}
    `;

    // 3. Applications & Event Registrations counts
    const conversionsQuery = `
        SELECT
            (SELECT COUNT(*)::int FROM club_applications WHERE created_at >= NOW() - ${interval}) AS period_applications,
            (SELECT COUNT(*)::int FROM club_applications) AS total_applications,
            (SELECT COUNT(*)::int FROM event_registrations WHERE created_at >= NOW() - ${interval}) AS period_registrations,
            (SELECT COUNT(*)::int FROM event_registrations) AS total_registrations
    `;

    // 4. Timeline for trend charts (hourly for 24h, monthly for all-time, daily for 7d/30d/90d)
    let timelineQuery = '';
    if (range === '24h') {
        timelineQuery = `
            SELECT 
                TO_CHAR(created_at, 'YYYY-MM-DD HH24:00') AS date,
                TO_CHAR(created_at, 'HH24:00') AS label,
                COUNT(*)::int AS pageviews,
                COUNT(DISTINCT visitor_hash)::int AS visitors
            FROM page_views
            WHERE created_at >= NOW() - INTERVAL '24 hours'
            GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD HH24:00'), TO_CHAR(created_at, 'HH24:00')
            ORDER BY date ASC
        `;
    } else if (range === 'all') {
        timelineQuery = `
            SELECT 
                TO_CHAR(created_at, 'YYYY-MM') AS date,
                TO_CHAR(created_at, 'Mon') AS label,
                EXTRACT(MONTH FROM created_at)::int AS month_num,
                COUNT(*)::int AS pageviews,
                COUNT(DISTINCT visitor_hash)::int AS visitors
            FROM page_views
            WHERE created_at >= NOW() - ${interval}
            GROUP BY TO_CHAR(created_at, 'YYYY-MM'), TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
            ORDER BY date ASC
        `;
    } else {
        timelineQuery = `
            SELECT 
                TO_CHAR(created_at, 'YYYY-MM-DD') AS date,
                TO_CHAR(created_at, 'Mon DD') AS label,
                COUNT(*)::int AS pageviews,
                COUNT(DISTINCT visitor_hash)::int AS visitors
            FROM page_views
            WHERE created_at >= NOW() - ${interval}
            GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD'), TO_CHAR(created_at, 'Mon DD')
            ORDER BY date ASC
        `;
    }

    // 5. Top Visited Pages
    const topPagesQuery = `
        SELECT 
            path,
            COUNT(*)::int AS views,
            COUNT(DISTINCT visitor_hash)::int AS unique_visitors
        FROM page_views
        WHERE created_at >= NOW() - ${interval}
        GROUP BY path
        ORDER BY views DESC
        LIMIT 8
    `;

    // 6. Top Articles (Sorted by all-time views with period views delta)
    const topArticlesQuery = `
        SELECT 
            a.id,
            a.title,
            a.slug,
            a.category,
            COALESCE(a.views, 0)::int AS all_time_views,
            COUNT(pv.id)::int AS period_views
        FROM articles a
        LEFT JOIN page_views pv ON pv.resource_id = a.id 
            AND pv.event_type = 'article_view' 
            AND pv.created_at >= NOW() - ${interval}
        GROUP BY a.id
        ORDER BY all_time_views DESC, period_views DESC
        LIMIT 5
    `;

    // 7. Top Events (Sorted by all-time views with period views delta)
    const topEventsQuery = `
        SELECT 
            e.id,
            e.title,
            e.date,
            e.location,
            COALESCE(e.views, 0)::int AS all_time_views,
            COUNT(DISTINCT er.id)::int AS registrations,
            COUNT(DISTINCT pv.id)::int AS period_views
        FROM events e
        LEFT JOIN page_views pv ON pv.resource_id = e.id 
            AND pv.event_type = 'event_view' 
            AND pv.created_at >= NOW() - ${interval}
        LEFT JOIN event_registrations er ON er.event_id = e.id
        GROUP BY e.id
        ORDER BY all_time_views DESC, registrations DESC, period_views DESC
        LIMIT 5
    `;

    // 8. Device Breakdown
    const devicesQuery = `
        SELECT 
            device_type,
            COUNT(*)::int AS count
        FROM page_views
        WHERE created_at >= NOW() - ${interval}
        GROUP BY device_type
        ORDER BY count DESC
    `;

    // 9. Browser Breakdown
    const browsersQuery = `
        SELECT 
            browser,
            COUNT(*)::int AS count
        FROM page_views
        WHERE created_at >= NOW() - ${interval}
        GROUP BY browser
        ORDER BY count DESC
        LIMIT 5
    `;

    // 10. Referrers Breakdown
    const referrersQuery = `
        SELECT 
            referrer,
            COUNT(*)::int AS count
        FROM page_views
        WHERE created_at >= NOW() - ${interval}
          AND referrer NOT IN ('Internal')
        GROUP BY referrer
        ORDER BY count DESC
        LIMIT 6
    `;

    // 11. Recent Activity Stream
    const recentActivityQuery = `
        SELECT 
            id,
            path,
            event_type,
            resource_title,
            device_type,
            browser,
            referrer,
            created_at
        FROM page_views
        ORDER BY created_at DESC
        LIMIT 8
    `;

    // Execute in parallel for sub-millisecond response time
    const [
        currentRes,
        prevRes,
        convRes,
        timelineRes,
        topPagesRes,
        topArticlesRes,
        topEventsRes,
        devicesRes,
        browsersRes,
        referrersRes,
        recentRes
    ] = await Promise.all([
        db.query(currentMetricsQuery),
        db.query(prevMetricsQuery),
        db.query(conversionsQuery),
        db.query(timelineQuery),
        db.query(topPagesQuery),
        db.query(topArticlesQuery),
        db.query(topEventsQuery),
        db.query(devicesQuery),
        db.query(browsersQuery),
        db.query(referrersQuery),
        db.query(recentActivityQuery)
    ]);

    const current = currentRes.rows[0] || {};
    const prev = prevRes.rows[0] || {};
    const conv = convRes.rows[0] || {};

    const calcGrowth = (currVal, prevVal) => {
        if (!prevVal || prevVal === 0) return currVal > 0 ? 100 : 0;
        return Math.round(((currVal - prevVal) / prevVal) * 100);
    };

    return {
        range,
        summary: {
            pageviews: current.total_pageviews || 0,
            pageviewsGrowth: calcGrowth(current.total_pageviews, prev.total_pageviews),
            visitors: current.unique_visitors || 0,
            visitorsGrowth: calcGrowth(current.unique_visitors, prev.unique_visitors),
            articleReads: current.article_reads || 0,
            articleReadsGrowth: calcGrowth(current.article_reads, prev.article_reads),
            eventViews: current.event_views || 0,
            eventViewsGrowth: calcGrowth(current.event_views, prev.event_views),
            applications: conv.period_applications || 0,
            totalApplications: conv.total_applications || 0,
            registrations: conv.period_registrations || 0,
            totalRegistrations: conv.total_registrations || 0,
            joinConversionRate: current.unique_visitors > 0 
                ? Number(((conv.period_applications / current.unique_visitors) * 100).toFixed(1))
                : 0
        },
        timeline: timelineRes.rows,
        topPages: topPagesRes.rows,
        topArticles: topArticlesRes.rows,
        topEvents: topEventsRes.rows,
        devices: devicesRes.rows,
        browsers: browsersRes.rows,
        referrers: referrersRes.rows,
        recentActivity: recentRes.rows
    };
};

module.exports = {
    recordEvent,
    getStats
};
