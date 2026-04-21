import { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';
import articleService from '../../services/articleService';
import eventService from '../../services/eventService';
import teamService from '../../services/teamService';
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
  Cloud
} from 'lucide-react';
import { SectionLoader } from '../../components/PageLoader';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    articles: 0,
    events: 0,
    team: 0,
    applications: 0
  });
  const [joinEnabled, setJoinEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statusRes, articlesRes, eventsRes, teamRes, appsRes] = await Promise.all([
          settingsService.getJoinStatus(),
          articleService.getAll(),
          eventService.getAll(true),
          teamService.getAll(),
          settingsService.getApplications()
        ]);

        setJoinEnabled(statusRes.enabled);
        setStats({
          articles: articlesRes.data?.length || 0,
          events: eventsRes.data?.length || 0,
          team: teamRes.data?.length || 0,
          applications: appsRes.data?.length || 0
        });
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2">Welcome back! Here's what's happening with your club.</p>
        </div>

        {/* Recruitment Toggle */}
        <div className={`inline-flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all ${joinEnabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
          <div>
            <p className="text-sm font-medium text-gray-600">Recruitment Status</p>
            <p className={`text-lg font-semibold ${joinEnabled ? 'text-blue-700' : 'text-gray-700'}`}>
              {joinEnabled ? 'Open' : 'Closed'}
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${joinEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
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
            className={`bg-gradient-to-br ${card.gradient} p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center text-xs font-medium text-emerald-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
            <p className="text-sm font-medium text-gray-600">{card.label}</p>
          </div>
        ))}
      </div>

      {/* System Health & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Shield className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">System Health</h2>
              <p className="text-gray-500 text-sm">All systems operational</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {systemHealth.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></div>
                  <span className="font-semibold text-gray-900">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="mb-6">
            <CheckCircle className="w-10 h-10 text-blue-200 mb-4" />
            <h2 className="text-xl font-bold mb-3">Quick Tips</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Remember to regularly update event statuses and review new member applications promptly.
            </p>
          </div>
          
          <button className="w-full py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm">
            View Documentation
          </button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Activity feed will appear here</p>
          <p className="text-gray-400 text-sm mt-1">Actions and updates will be displayed in real-time</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;