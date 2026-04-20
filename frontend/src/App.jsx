import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import DashboardHome from './pages/admin/DashboardHome';
import AdminArticles from './pages/admin/AdminArticles';
import CreateArticle from './pages/admin/CreateArticle';
import EditArticle from './pages/admin/EditArticle';
import AdminEvents from './pages/admin/AdminEvents';
import CreateEvent from './pages/admin/CreateEvent';
import EditEvent from './pages/admin/EditEvent';
import AdminEventRegistrations from './pages/admin/AdminEventRegistrations';
import AdminTeam from './pages/admin/AdminTeam';
import CreateTeam from './pages/admin/CreateTeam';
import Applications from './pages/admin/Applications';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Team from './pages/Team';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes using MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:id" element={<ArticleDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="team" element={<Team />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="articles/new" element={<CreateArticle />} />
            <Route path="articles/edit/:id" element={<EditArticle />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="events/new" element={<CreateEvent />} />
            <Route path="events/edit/:id" element={<EditEvent />} />
            <Route path="events/:eventId/registrations" element={<AdminEventRegistrations />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="team/new" element={<CreateTeam />} />
            <Route path="applications" element={<Applications />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}



export default App;
