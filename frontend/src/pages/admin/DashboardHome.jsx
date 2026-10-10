import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import settingsService from '../../services/settingsService';
import articleService from '../../services/articleService';
import eventService from '../../services/eventService';
import teamService from '../../services/teamService';
import analyticsService from '../../services/analyticsService';
import {
  ToggleRight,
  ToggleLeft,
  Users,
  Loader2,
  FileText,
  Calendar,
  ClipboardList,
  TrendingUp,
  Activity,
  CheckCircle,
  Shield,
  Database,
  Cloud,
  Megaphone,
  History,
  ArrowRight,
  BarChart3,
  Eye,
  Zap,
  Target
} from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    articles: 0,
    events: 0,
    team: 0,
    applications: 0
  });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [joinEnabled, setJoinEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [announcementHistory, setAnnouncementHistory] = useState([]);
  const [togglingAnnouncement, setTogglingAnnouncement] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statusRes, articlesRes, eventsRes, teamRes, appsRes, announcementRes, analyticsRes] = await Promise.all([
          settingsService.getJoinStatus(),
          articleService.getAll(),
          eventService.getAll(true),
          teamService.getAll(),
          settingsService.getApplications(),
          settingsService.getAnnouncement(),
          analyticsService.getStats('7d').catch(() => ({ data: null }))
        ]);

        setJoinEnabled(statusRes.enabled);
        setStats({
          articles: articlesRes.data?.length || 0,
          events: eventsRes.data?.length || 0,
          team: teamRes.data?.length || 0,
          applications: appsRes.data?.length || 0
        });

        if (analyticsRes?.data) {
          setAnalyticsData(analyticsRes.data);
        }

        const annData = announcementRes?.data?.data || announcementRes?.data;
        if (annData && typeof annData === 'object' && !Array.isArray(annData)) {
          setAnnouncement(annData);
        }
        const annHistory = announcementRes?.history || announcementRes?.data?.history || [];
        setAnnouncementHistory(Array.isArray(annHistory) ? annHistory : []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleAnnouncementToggle = async () => {
    if (!announcement) return;
    setTogglingAnnouncement(true);
    try {
      const updated = { ...announcement, is_active: !announcement.is_active };
      const res = await settingsService.updateAnnouncement(updated);
      const saved = res?.data?.data || res?.data || updated;
      setAnnouncement(saved);
      const savedHistory = res?.history || res?.data?.history;
      if (Array.isArray(savedHistory)) {
        setAnnouncementHistory(savedHistory);
      } else {
        setAnnouncementHistory(prev => prev.map(item => ({
          ...item,
          is_active: item.poster_url === updated.poster_url && updated.is_active
        })));
      }
    } catch (err) {
      alert('Failed to update announcement status');
    } finally {
      setTogglingAnnouncement(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      const newVal = !joinEnabled;
      await settingsService.toggleJoinForm(newVal);
      setJoinEnabled(newVal);
    } catch (err) {
      alert('Failed to update form status');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return <SectionLoader message="Loading dashboard" />;
  }

  const statCards = [
    { 
      label: 'Articles', 
      value: stats.articles, 
      icon: FileText, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      gradient: 'from-blue-50 to-blue-100'
    },
    { 
      label: 'Events', 
      value: stats.events, 
      icon: Calendar, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      gradient: 'from-purple-50 to-purple-100'
    },
    { 
      label: 'Team Members', 
      value: stats.team, 
      icon: Users, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      gradient: 'from-emerald-50 to-emerald-100'
    },
    { 
      label: 'Applications', 
      value: stats.applications, 
      icon: ClipboardList, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      gradient: 'from-amber-50 to-amber-100'
    },
  ];

  const systemHealth = [
    { label: 'Database', status: 'Connected', icon: Database, color: 'text-emerald-500' },
    { label: 'API Status', status: 'Online', icon: Activity, color: 'text-emerald-500' },
    { label: 'Cloud Storage', status: 'Active', icon: Cloud, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">Welcome back! Here's what's happening with your club.</p>
        </div>

        {/* Recruitment Toggle */}
        <div className={`inline-flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all ${
          joinEnabled 
            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' 
            : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800'
        }`}>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Recruitment Status</p>
            <p className={`text-lg font-semibold ${joinEnabled ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-slate-200'}`}>
              {joinEnabled ? 'Open' : 'Closed'}
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${joinEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-700'}`}
          >
            {toggling ? (
              <Loader2 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white animate-spin" />
            ) : (
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${joinEnabled ? 'translate-x-9' : 'translate-x-1'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-br ${card.gradient} dark:from-slate-900 dark:to-slate-800/80 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg} dark:bg-slate-800/80 ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{card.value}</p>
            <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Pop-up Announcement & History Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pop-up Announcement & History</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">Manage pop-up modal flyers shown to website visitors and review past announcements</p>
            </div>
          </div>
          <Link
            to="/dashboard/announcement"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Active Campaign Card */}
          <div className="lg:col-span-5 bg-gray-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Active Campaign
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                announcement?.is_active
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${announcement?.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                {announcement?.is_active ? 'LIVE ON SITE' : 'INACTIVE'}
              </span>
            </div>

            {announcement?.poster_url ? (
              <div className="flex gap-4 items-center">
                <div className="w-20 h-28 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-1 shrink-0 overflow-hidden flex items-center justify-center shadow-xs">
                  <img
                    src={announcement.poster_url}
                    alt={announcement.title || 'Announcement'}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {announcement.title || 'Untitled Poster'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Source: <span className="capitalize font-semibold text-gray-700 dark:text-slate-300">{announcement.type || 'Custom'}</span>
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500">
                    {announcement.is_active ? 'Shown to every visitor in modal' : 'Hidden from site visitors'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No active poster configured yet
              </div>
            )}

            <div className="pt-2 border-t border-gray-200/60 dark:border-slate-800/80 flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-gray-600 dark:text-slate-400">
                Pop-up Status
              </span>
              <button
                type="button"
                onClick={handleAnnouncementToggle}
                disabled={togglingAnnouncement || !announcement?.poster_url}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
                  announcement?.is_active ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
                }`}
                title={announcement?.poster_url ? 'Toggle Pop-up On/Off' : 'Upload a poster first'}
              >
                {togglingAnnouncement ? (
                  <Loader2 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white animate-spin" />
                ) : (
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${announcement?.is_active ? 'translate-x-8' : 'translate-x-1'}`} />
                )}
              </button>
            </div>
          </div>

          {/* Announcement History Column */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">
                  Recent History
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {announcementHistory.length}
                </span>
              </div>
              <Link
                to="/dashboard/announcement"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Manage All
              </Link>
            </div>

            {announcementHistory.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200/80 dark:border-slate-800/80 text-xs text-slate-400">
                No past announcements saved in history yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {announcementHistory.slice(0, 3).map((item) => {
                  const isActive = announcement?.poster_url === item.poster_url && announcement?.is_active;
                  return (
                    <Link
                      key={item.id}
                      to="/dashboard/announcement"
                      className={`group p-3 rounded-xl border bg-gray-50 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-900 transition-all flex flex-col justify-between space-y-2.5 ${
                        isActive
                          ? 'border-emerald-500/80 ring-1 ring-emerald-500/30'
                          : 'border-gray-200/80 dark:border-slate-800/80 hover:border-blue-400'
                      }`}
                    >
                      <div className="w-full h-28 rounded-lg bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center p-1 border border-gray-100 dark:border-slate-800/80">
                        <img
                          src={item.poster_url}
                          alt={item.title || 'Announcement'}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                          {item.title || 'Untitled'}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-slate-500 mt-1">
                          <span className="capitalize">{item.type || 'Custom'}</span>
                          {isActive && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">LIVE</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Health & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-xl">
              <Shield className="w-6 h-6 text-gray-700 dark:text-slate-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Health</h2>
              <p className="text-gray-500 dark:text-slate-400 text-sm">All systems operational</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {systemHealth.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-slate-950/60 rounded-xl p-4 border border-transparent dark:border-slate-800/60">
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{item.label}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></div>
                  <span className="font-semibold text-gray-900 dark:text-white">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/10">
          <div className="mb-6">
            <CheckCircle className="w-10 h-10 text-blue-200 mb-4" />
            <h2 className="text-xl font-bold mb-3">Quick Tips</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Remember to regularly update event statuses and review new member applications promptly.
            </p>
          </div>
          
          <button className="w-full py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-sm">
            View Documentation
          </button>
        </div>
      </div>

      {/* Live Telemetry & Analytics Snapshot */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live Traffic & Visitor Insights</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">Real-time telemetry and engagement over the last 7 days</p>
            </div>
          </div>

          <Link
            to="/dashboard/analytics"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>Open Full Analytics Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Visitors */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800/80">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Unique Visitors (7d)</span>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {analyticsData?.summary?.visitors?.toLocaleString() || 0}
            </p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 inline-block">
              +{analyticsData?.summary?.visitorsGrowth || 0}% vs previous
            </span>
          </div>

          {/* 2. Total Pageviews */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800/80">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total Pageviews</span>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {analyticsData?.summary?.pageviews?.toLocaleString() || 0}
            </p>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1 inline-block">
              {analyticsData?.summary?.articleReads || 0} blog reads
            </span>
          </div>

          {/* 3. Event Engagement */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800/80">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Event Views</span>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {analyticsData?.summary?.eventViews?.toLocaleString() || 0}
            </p>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1 inline-block">
              {analyticsData?.summary?.registrations || 0} RSVPs registered
            </span>
          </div>

          {/* 4. Join Conversion */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800/80">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Join Conversion</span>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {analyticsData?.summary?.joinConversionRate || 0}%
            </p>
            <span className="text-[11px] text-rose-500 font-medium mt-1 inline-block">
              {analyticsData?.summary?.applications || 0} applications
            </span>
          </div>
        </div>

        {/* Recent Live Activity list */}
        {analyticsData?.recentActivity && analyticsData.recentActivity.length > 0 && (
          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-3">
              Live Visitor Ticker
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {analyticsData.recentActivity.slice(0, 4).map((act) => (
                <div key={act.id} className="p-2.5 rounded-lg bg-gray-50/70 dark:bg-slate-950/40 border border-gray-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-gray-400 dark:text-slate-500">
                    <span className="font-semibold text-blue-600 dark:text-blue-400 text-[10px] uppercase">{act.event_type.replace('_', ' ')}</span>
                    <span className="text-[10px]">{new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="font-mono text-gray-800 dark:text-slate-200 truncate mt-1">
                    {act.resource_title || act.path}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;