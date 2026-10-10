import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    TrendingUp, 
    TrendingDown, 
    Users, 
    Eye, 
    FileText, 
    Calendar, 
    ClipboardList, 
    Target, 
    Smartphone, 
    Monitor, 
    Tablet, 
    Globe, 
    ArrowUpRight, 
    RefreshCw, 
    Activity, 
    Compass, 
    Zap,
    Clock,
    Sparkles,
    CheckCircle2
} from 'lucide-react';
import analyticsService from '../../services/analyticsService';
import PageLoader from '../../components/PageLoader';

const RANGE_OPTIONS = [
    { label: 'Last 24 Hours', value: '24h' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'All Time', value: 'all' }
];

const AdminAnalytics = () => {
    const [range, setRange] = useState('7d');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [hoveredDataPoint, setHoveredDataPoint] = useState(null);

    const fetchStats = async (selectedRange = range, isManualRefresh = false) => {
        if (isManualRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            const res = await analyticsService.getStats(selectedRange);
            setData(res.data);
        } catch (err) {
            console.error('Failed to load analytics:', err);
            setError('Failed to load analytics data. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats(range);
    }, [range]);

    if (loading && !data) {
        return <PageLoader message="Loading Analytics & Insights..." />;
    }

    const summary = data?.summary || {};
    const timeline = data?.timeline || [];
    const topPages = data?.topPages || [];
    const topArticles = data?.topArticles || [];
    const topEvents = data?.topEvents || [];
    const devices = data?.devices || [];
    const browsers = data?.browsers || [];
    const referrers = data?.referrers || [];
    const recentActivity = data?.recentActivity || [];

    // Calculate totals for percentage calculation
    const totalDeviceCount = devices.reduce((sum, d) => sum + (parseInt(d.count, 10) || 0), 0) || 1;
    const totalBrowserCount = browsers.reduce((sum, b) => sum + (parseInt(b.count, 10) || 0), 0) || 1;
    const totalReferrerCount = referrers.reduce((sum, r) => sum + (parseInt(r.count, 10) || 0), 0) || 1;

    // Generate normalized timeline matching reference chart (12 columns for month/year, daily, or hourly intervals)
    const getChartTimeline = () => {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const now = new Date();

        // 1. ALL TIME / 90 DAYS: 12 months with exact sum of all days in each month
        if (range === 'all' || range === '90d') {
            return months.map((m, idx) => {
                const monthStr = String(idx + 1).padStart(2, '0');
                const matches = timeline.filter(t => 
                    t.month_num === (idx + 1) ||
                    (t.label && t.label.toUpperCase().includes(m)) ||
                    (t.date && (t.date.slice(5, 7) === monthStr || t.date.endsWith(`-${monthStr}`)))
                );
                const pageviews = matches.reduce((sum, item) => sum + (parseInt(item.pageviews, 10) || 0), 0);
                const visitors = matches.reduce((sum, item) => sum + (parseInt(item.visitors, 10) || 0), 0);

                return {
                    label: m,
                    date: `${now.getFullYear()}-${monthStr}`,
                    pageviews,
                    visitors
                };
            });
        }

        // 2. LAST 7 DAYS: 7 distinct calendar days with exact counts
        if (range === '7d') {
            const list = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(now.getDate() - i);
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const localKey = `${yyyy}-${mm}-${dd}`;
                const utcKey = d.toISOString().slice(0, 10);
                const label = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
                
                const matches = timeline.filter(t => t.date === localKey || t.date === utcKey);
                const pageviews = matches.reduce((sum, item) => sum + (parseInt(item.pageviews, 10) || 0), 0);
                const visitors = matches.reduce((sum, item) => sum + (parseInt(item.visitors, 10) || 0), 0);

                list.push({
                    label,
                    date: localKey,
                    pageviews,
                    visitors
                });
            }
            return list;
        }

        // 3. LAST 30 DAYS: 10 3-day intervals aggregating every single day
        if (range === '30d') {
            const list = [];
            for (let i = 27; i >= 0; i -= 3) {
                const dEnd = new Date();
                dEnd.setDate(now.getDate() - i);
                const dStart = new Date();
                dStart.setDate(now.getDate() - (i + 2));

                const startStr = dStart.toISOString().slice(0, 10);
                const endStr = dEnd.toISOString().slice(0, 10);
                const label = dEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

                const matches = timeline.filter(t => t.date >= startStr && t.date <= endStr);
                const pageviews = matches.reduce((sum, item) => sum + (parseInt(item.pageviews, 10) || 0), 0);
                const visitors = matches.reduce((sum, item) => sum + (parseInt(item.visitors, 10) || 0), 0);

                list.push({
                    label,
                    date: `${startStr} to ${endStr}`,
                    pageviews,
                    visitors
                });
            }
            return list;
        }

        // 4. LAST 24 HOURS: 12 2-hour segments
        if (range === '24h') {
            const list = [];
            for (let i = 22; i >= 0; i -= 2) {
                const d = new Date(now.getTime() - i * 60 * 60 * 1000);
                const hourNum = d.getHours();
                const hourStr = String(hourNum).padStart(2, '0') + ':00';
                const nextHourNum = (hourNum + 1) % 24;
                const nextHourStr = String(nextHourNum).padStart(2, '0') + ':00';

                const matches = timeline.filter(t => {
                    const h = t.label || (t.date ? t.date.slice(11, 16) : '');
                    return h === hourStr || h === nextHourStr;
                });
                const pageviews = matches.reduce((sum, item) => sum + (parseInt(item.pageviews, 10) || 0), 0);
                const visitors = matches.reduce((sum, item) => sum + (parseInt(item.visitors, 10) || 0), 0);

                list.push({
                    label: hourStr,
                    date: `${d.toLocaleDateString()} ${hourStr}`,
                    pageviews,
                    visitors
                });
            }
            return list;
        }

        return timeline.length > 0 ? timeline : [
            { label: 'TODAY', pageviews: summary.pageviews || 0, visitors: summary.visitors || 0 }
        ];
    };

    const chartTimeline = getChartTimeline();

    // Calculate dynamic Y-axis maximum (steps of 10 up to max, minimum 100 or dynamic scale)
    const rawMax = Math.max(...chartTimeline.map(t => Math.max(t.pageviews || 0, t.visitors || 0)), 10);
    let maxVal = 100;
    if (rawMax > 100) {
        maxVal = Math.ceil(rawMax / 50) * 50;
    }

    const yTicksCount = 10;
    const yTickValues = Array.from({ length: yTicksCount + 1 }, (_, i) => Math.round((i / yTicksCount) * maxVal));

    // SVG Layout measurements matching reference chart
    const svgWidth = 900;
    const svgHeight = 360;
    const padLeft = 45;
    const padRight = 30;
    const padTop = 25;
    const padBottom = 40;
    const plotWidth = svgWidth - padLeft - padRight;
    const plotHeight = svgHeight - padTop - padBottom;

    const N = chartTimeline.length;

    // Coordinate mapping for Hot Pink (Sales / Pageviews) and Lime Green (Orders / Visitors)
    const pageviewPoints = chartTimeline.map((item, idx) => {
        const x = padLeft + (N > 1 ? (idx / (N - 1)) * plotWidth : plotWidth / 2);
        const y = padTop + plotHeight - ((item.pageviews || 0) / maxVal) * plotHeight;
        return { x, y, ...item, val: item.pageviews || 0 };
    });

    const visitorPoints = chartTimeline.map((item, idx) => {
        const x = padLeft + (N > 1 ? (idx / (N - 1)) * plotWidth : plotWidth / 2);
        const y = padTop + plotHeight - ((item.visitors || 0) / maxVal) * plotHeight;
        return { x, y, ...item, val: item.visitors || 0 };
    });

    const pageviewPathD = pageviewPoints.length > 0
        ? `M ${pageviewPoints[0].x} ${pageviewPoints[0].y} ` + pageviewPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
        : '';

    const visitorPathD = visitorPoints.length > 0
        ? `M ${visitorPoints[0].x} ${visitorPoints[0].y} ` + visitorPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
        : '';

    return (
        <div className="space-y-8 pb-16">
            {/* Header with Time Range Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Telemetry
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Website Analytics & Performance
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        Track visitors, article readers, event engagement, and club application conversions.
                    </p>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                    {/* Range Tabs */}
                    <div className="bg-gray-100 dark:bg-slate-900 p-1 rounded-xl flex items-center border border-gray-200 dark:border-slate-800">
                        {RANGE_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setRange(opt.value)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                    range === opt.value
                                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                                        : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => fetchStats(range, true)}
                        disabled={refreshing}
                        className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-colors shadow-xs"
                        title="Refresh data"
                        aria-label="Refresh data"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                    {error}
                </div>
            )}

            {/* 6 KEY METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* 1. Unique Visitors */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-xs hover:border-blue-200 dark:hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">Unique Visitors</span>
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {summary.visitors?.toLocaleString() || 0}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs">
                        {summary.visitorsGrowth >= 0 ? (
                            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{summary.visitorsGrowth}%
                            </span>
                        ) : (
                            <span className="inline-flex items-center text-rose-500 font-semibold">
                                <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {summary.visitorsGrowth}%
                            </span>
                        )}
                        <span className="text-gray-400 dark:text-slate-500">vs prev period</span>
                    </div>
                </div>

                {/* 2. Total Pageviews */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-xs hover:border-blue-200 dark:hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">Total Views</span>
                        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                            <Eye className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {summary.pageviews?.toLocaleString() || 0}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs">
                        {summary.pageviewsGrowth >= 0 ? (
                            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{summary.pageviewsGrowth}%
                            </span>
                        ) : (
                            <span className="inline-flex items-center text-rose-500 font-semibold">
                                <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {summary.pageviewsGrowth}%
                            </span>
                        )}
                        <span className="text-gray-400 dark:text-slate-500">vs prev period</span>
                    </div>
                </div>

                {/* 3. Article Reads */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-xs hover:border-blue-200 dark:hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">Article Reads</span>
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                            <FileText className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {summary.articleReads?.toLocaleString() || 0}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
                        <span>Blog readership</span>
                    </div>
                </div>

                {/* 4. Event Views */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-xs hover:border-blue-200 dark:hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">Event Views</span>
                        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                            <Calendar className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {summary.eventViews?.toLocaleString() || 0}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
                        <span>{summary.registrations || 0} joined events</span>
                    </div>
                </div>

                {/* 5. Club Applications */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-xs hover:border-blue-200 dark:hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">Applications</span>
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                            <ClipboardList className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {summary.applications || 0}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
                        <span>{summary.totalApplications || 0} all-time</span>
                    </div>
                </div>

                {/* 6. Join Conversion Rate */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-xs hover:border-blue-200 dark:hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">Join Conversion</span>
                        <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                            <Target className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {summary.joinConversionRate || 0}%
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
                        <span>Visits to Signups</span>
                    </div>
                </div>
            </div>

            {/* TIMELINE TRAFFIC CHART (MATCHING REFERENCE DESIGN) */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-pink-600" />
                            Traffic Trend Over Time
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                            Real-time tracking of pageviews and unique visitors.
                        </p>
                    </div>

                    {/* Top Right Legend (Exact styling & colors from reference image) */}
                    <div className="flex items-center gap-6 justify-end text-xs font-semibold">
                        <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#db2777] inline-block shadow-xs" />
                            <span className="text-gray-700 dark:text-slate-300">Sales / Pageviews</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#84cc16] inline-block shadow-xs" />
                            <span className="text-gray-700 dark:text-slate-300">Orders / Visitors</span>
                        </div>
                    </div>
                </div>

                <div className="relative w-full overflow-x-auto">
                    {hoveredDataPoint && (
                        <div className="absolute top-2 left-14 bg-slate-900/90 text-white text-xs px-3.5 py-2 rounded-xl backdrop-blur-md shadow-xl border border-slate-700 pointer-events-none z-10 flex items-center gap-4">
                            <span className="font-bold text-gray-200">{hoveredDataPoint.label}</span>
                            <span className="flex items-center gap-1.5 text-pink-400">
                                <span className="w-2 h-2 rounded-full bg-[#db2777]" />
                                Pageviews: <strong>{hoveredDataPoint.pageviews}</strong>
                            </span>
                            <span className="flex items-center gap-1.5 text-lime-400">
                                <span className="w-2 h-2 rounded-full bg-[#84cc16]" />
                                Visitors: <strong>{hoveredDataPoint.visitors}</strong>
                            </span>
                        </div>
                    )}

                    <svg
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                        className="w-full h-64 sm:h-80 select-none overflow-visible"
                    >
                        {/* 1. Horizontal Grid Lines & Y-Axis Labels */}
                        {yTickValues.map((tickVal, i) => {
                            const y = padTop + plotHeight - (i / yTicksCount) * plotHeight;
                            return (
                                <g key={i}>
                                    <line
                                        x1={padLeft}
                                        y1={y}
                                        x2={padLeft + plotWidth}
                                        y2={y}
                                        stroke="currentColor"
                                        className="text-gray-200/80 dark:text-slate-800"
                                        strokeWidth="1"
                                    />
                                    <text
                                        x={padLeft - 10}
                                        y={y + 3.5}
                                        textAnchor="end"
                                        className="text-[11px] font-medium fill-gray-400 dark:fill-slate-500"
                                    >
                                        {tickVal}
                                    </text>
                                </g>
                            );
                        })}

                        {/* 2. Vertical Grid Lines & X-Axis Labels */}
                        {chartTimeline.map((item, idx) => {
                            const x = padLeft + (N > 1 ? (idx / (N - 1)) * plotWidth : plotWidth / 2);
                            return (
                                <g key={idx}>
                                    <line
                                        x1={x}
                                        y1={padTop}
                                        x2={x}
                                        y2={padTop + plotHeight}
                                        stroke="currentColor"
                                        className="text-gray-200/80 dark:text-slate-800"
                                        strokeWidth="1"
                                    />
                                    <text
                                        x={x}
                                        y={padTop + plotHeight + 22}
                                        textAnchor="middle"
                                        className="text-[11px] font-semibold fill-gray-400 dark:fill-slate-500 uppercase tracking-wider"
                                    >
                                        {item.label}
                                    </text>
                                </g>
                            );
                        })}

                        {/* 3. Outer Plot Area Border */}
                        <rect
                            x={padLeft}
                            y={padTop}
                            width={plotWidth}
                            height={plotHeight}
                            fill="none"
                            stroke="currentColor"
                            className="text-gray-200 dark:text-slate-800"
                            strokeWidth="1"
                        />

                        {/* 4. Lime Green Line (Visitors / Orders) */}
                        {visitorPathD && (
                            <path
                                d={visitorPathD}
                                fill="none"
                                stroke="#84cc16"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}

                        {/* 5. Lime Green Points */}
                        {visitorPoints.map((pt, idx) => (
                            <circle
                                key={`v-${idx}`}
                                cx={pt.x}
                                cy={pt.y}
                                r="4.5"
                                fill="#84cc16"
                                onMouseEnter={() => setHoveredDataPoint(pt)}
                                onMouseLeave={() => setHoveredDataPoint(null)}
                                className="cursor-pointer hover:r-7 transition-all"
                            />
                        ))}

                        {/* 6. Hot Pink Line (Pageviews / Sales) */}
                        {pageviewPathD && (
                            <path
                                d={pageviewPathD}
                                fill="none"
                                stroke="#db2777"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}

                        {/* 7. Hot Pink Points */}
                        {pageviewPoints.map((pt, idx) => (
                            <circle
                                key={`p-${idx}`}
                                cx={pt.x}
                                cy={pt.y}
                                r="4.5"
                                fill="#db2777"
                                onMouseEnter={() => setHoveredDataPoint(pt)}
                                onMouseLeave={() => setHoveredDataPoint(null)}
                                className="cursor-pointer hover:r-7 transition-all"
                            />
                        ))}
                    </svg>
                </div>
            </div>

            {/* TOP ARTICLES & TOP EVENTS LEADERBOARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Top Read Articles */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-purple-600" />
                            Most Read Articles
                        </h2>
                        <Link to="/dashboard/articles" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                            Manage All →
                        </Link>
                    </div>

                    {topArticles.length > 0 ? (
                        <div className="space-y-3">
                            {topArticles.map((article, idx) => (
                                <div
                                    key={article.id}
                                    className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-gray-100 dark:border-slate-800"
                                >
                                    <div className="flex items-center gap-3 min-w-0 pr-3">
                                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                            idx === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                                            idx === 1 ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                                            idx === 2 ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' :
                                            'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                                        }`}>
                                            #{idx + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <Link
                                                to={`/articles/${article.slug || article.id}`}
                                                target="_blank"
                                                className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block transition-colors"
                                            >
                                                {article.title}
                                            </Link>
                                            <span className="text-[11px] font-medium text-gray-400 dark:text-slate-400">
                                                {article.category || 'General'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {(article.all_time_views || 0).toLocaleString()}
                                        </span>
                                        <div className="text-[10px] text-gray-400 dark:text-slate-500">
                                            {article.period_views > 0 ? (
                                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                                    +{article.period_views} in {range}
                                                </span>
                                            ) : (
                                                <span>total views</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 dark:text-slate-500 py-8 text-center">No article reads recorded yet.</p>
                    )}
                </div>

                {/* 2. Top Events & Conversion */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-amber-600" />
                            Most Viewed Events
                        </h2>
                        <Link to="/dashboard/events" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                            Manage All →
                        </Link>
                    </div>

                    {topEvents.length > 0 ? (
                        <div className="space-y-3">
                            {topEvents.map((event, idx) => {
                                const allViews = event.all_time_views || 0;
                                const periodViews = event.period_views || 0;
                                const displayViews = range === 'all' ? allViews : (periodViews > 0 ? periodViews : allViews);
                                const regs = event.registrations || 0;
                                const effectiveBase = allViews > 0 ? allViews : (regs > 0 ? regs : 0);
                                const convRate = effectiveBase > 0 ? Math.min(100, Number(((regs / effectiveBase) * 100).toFixed(1))) : 0;

                                return (
                                    <div
                                        key={event.id}
                                        className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-gray-100 dark:border-slate-800"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 pr-3">
                                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                                idx === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                                                idx === 1 ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                                                idx === 2 ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' :
                                                'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                                #{idx + 1}
                                            </span>
                                            <div className="min-w-0">
                                                <Link
                                                    to={`/events/${event.id}`}
                                                    target="_blank"
                                                    className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block transition-colors"
                                                >
                                                    {event.title}
                                                </Link>
                                                <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-slate-400">
                                                    <span>{event.location}</span>
                                                    <span>•</span>
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{regs} registered</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {(event.all_time_views || 0).toLocaleString()}
                                            </span>
                                            <div className="flex items-center justify-end gap-1.5 text-[10px]">
                                                {event.period_views > 0 && (
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                                        +{event.period_views}
                                                    </span>
                                                )}
                                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                                    {convRate}% conv
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 dark:text-slate-500 py-8 text-center">No event views recorded yet.</p>
                    )}
                </div>
            </div>

            {/* AUDIENCE & TRAFFIC SOURCES BREAKDOWN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. Device Breakdown */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xs">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <Smartphone className="w-4 h-4 text-blue-600" />
                        Device Types
                    </h2>

                    <div className="space-y-4">
                        {['mobile', 'desktop', 'tablet'].map((dev) => {
                            const found = devices.find(d => d.device_type === dev);
                            const count = found ? parseInt(found.count, 10) : 0;
                            const percentage = Math.round((count / totalDeviceCount) * 100) || 0;

                            const Icon = dev === 'mobile' ? Smartphone : dev === 'tablet' ? Tablet : Monitor;
                            const label = dev.charAt(0).toUpperCase() + dev.slice(1);

                            return (
                                <div key={dev} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs font-semibold">
                                        <span className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                                            <Icon className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                                            {label}
                                        </span>
                                        <span className="text-gray-900 dark:text-white">{percentage}% ({count})</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                dev === 'mobile' ? 'bg-blue-600' : dev === 'desktop' ? 'bg-indigo-500' : 'bg-purple-500'
                                            }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Top Referrers */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xs">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        Traffic Sources
                    </h2>

                    {referrers.length > 0 ? (
                        <div className="space-y-3">
                            {referrers.map((ref, idx) => {
                                const count = parseInt(ref.count, 10) || 0;
                                const percentage = Math.round((count / totalReferrerCount) * 100) || 0;

                                return (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs font-semibold">
                                            <span className="text-gray-700 dark:text-slate-300 truncate max-w-[150px]">{ref.referrer}</span>
                                            <span className="text-gray-900 dark:text-white">{percentage}%</span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                                            <div 
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 dark:text-slate-500 py-6 text-center">Direct traffic from local browsers and bookmarks.</p>
                    )}
                </div>

                {/* 3. Browser Distribution */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xs">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <Compass className="w-4 h-4 text-indigo-600" />
                        Browsers
                    </h2>

                    {browsers.length > 0 ? (
                        <div className="space-y-3">
                            {browsers.map((b, idx) => {
                                const count = parseInt(b.count, 10) || 0;
                                const percentage = Math.round((count / totalBrowserCount) * 100) || 0;

                                return (
                                    <div key={idx} className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-gray-700 dark:text-slate-300">{b.browser}</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{percentage}% ({count})</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 dark:text-slate-500 py-6 text-center">No browser data available.</p>
                    )}
                </div>
            </div>

            {/* TOP VISITED PAGES & RECENT ACTIVITY STREAM */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Visited Pages (2 cols) */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xs">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Top Visited Pages
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                                    <th className="pb-3 font-semibold">Page Path</th>
                                    <th className="pb-3 font-semibold text-right">Pageviews</th>
                                    <th className="pb-3 font-semibold text-right">Unique Visitors</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
                                {topPages.map((page, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="py-3 font-mono font-medium text-gray-800 dark:text-slate-200 truncate max-w-[280px]">
                                            {page.path === '/' ? '/ (Home)' : page.path}
                                        </td>
                                        <td className="py-3 text-right font-bold text-gray-900 dark:text-white">
                                            {page.views?.toLocaleString() || 0}
                                        </td>
                                        <td className="py-3 text-right text-gray-500 dark:text-slate-400">
                                            {page.unique_visitors?.toLocaleString() || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Live Activity Stream (1 col) */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xs">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-blue-600" />
                        Live Activity Stream
                    </h2>

                    <div className="space-y-3">
                        {recentActivity.map((act) => {
                            const timeStr = new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                                <div key={act.id} className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800/80 text-xs">
                                    <div className="flex items-center justify-between text-gray-400 dark:text-slate-500 mb-1">
                                        <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase text-[10px]">
                                            {act.event_type.replace('_', ' ')}
                                        </span>
                                        <span>{timeStr}</span>
                                    </div>
                                    <div className="font-mono text-gray-800 dark:text-slate-200 truncate">
                                        {act.resource_title || act.path}
                                    </div>
                                    <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 flex items-center gap-2">
                                        <span>{act.device_type}</span>
                                        <span>•</span>
                                        <span>{act.browser}</span>
                                        {act.referrer && act.referrer !== 'Direct' && (
                                            <>
                                                <span>•</span>
                                                <span className="truncate">{act.referrer}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
