import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from './context/ThemeContext';

// Eagerly load Home for instant 0ms first paint
import Home from './pages/Home';

// Lazy load other public pages
const Articles = lazy(() => import('./pages/Articles'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const Team = lazy(() => import('./pages/Team'));
const Apply = lazy(() => import('./pages/Apply'));
const Login = lazy(() => import('./pages/Login'));

// Lazy load Admin layout and administrative tools
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const DashboardHome = lazy(() => import('./pages/admin/DashboardHome'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles'));
const CreateArticle = lazy(() => import('./pages/admin/CreateArticle'));
const EditArticle = lazy(() => import('./pages/admin/EditArticle'));
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'));
const CreateEvent = lazy(() => import('./pages/admin/CreateEvent'));
const EditEvent = lazy(() => import('./pages/admin/EditEvent'));
const AdminEventRegistrations = lazy(() => import('./pages/admin/AdminEventRegistrations'));
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam'));
const CreateTeam = lazy(() => import('./pages/admin/CreateTeam'));
const EditTeam = lazy(() => import('./pages/admin/EditTeam'));
const Applications = lazy(() => import('./pages/admin/Applications'));
const AdminAnnouncement = lazy(() => import('./pages/admin/AdminAnnouncement'));

import usePageTracker from './hooks/usePageTracker';

const PageTracker = () => {
  usePageTracker();
  return null;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <PageTracker />
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950" />}>
          <Routes>
            {/* Public Routes using MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="articles" element={<Articles />} />
              <Route path="articles/:id" element={<ArticleDetail />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="team" element={<Team />} />
              <Route path="apply" element={<Apply />} />
              <Route path="register" element={<Apply />} />
              <Route path="regester" element={<Apply />} />
              <Route path="login" element={<Login />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<AdminLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="announcement" element={<AdminAnnouncement />} />
                <Route path="articles" element={<AdminArticles />} />
                <Route path="articles/new" element={<CreateArticle />} />
                <Route path="articles/edit/:id" element={<EditArticle />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="events/new" element={<CreateEvent />} />
                <Route path="events/edit/:id" element={<EditEvent />} />
                <Route path="events/:eventId/registrations" element={<AdminEventRegistrations />} />
                <Route path="team" element={<AdminTeam />} />
                <Route path="team/new" element={<CreateTeam />} />
                <Route path="team/edit/:id" element={<EditTeam />} />
                <Route path="applications" element={<Applications />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}



export default App;
