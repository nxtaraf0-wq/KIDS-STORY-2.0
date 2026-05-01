import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';
import StoryDetail from './pages/StoryDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

// Admin
import AdminLayout from './admin/AdminLayout';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import ManageStories from './admin/ManageStories';
import StoryEditor from './admin/StoryEditor';
import ManageCategories from './admin/ManageCategories';
import Settings from './admin/Settings';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="categories" element={<CategoryView />} />
            <Route path="categories/:slug" element={<CategoryView />} />
            <Route path="story/:slug" element={<StoryDetail />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<Terms />} />
          </Route>
          
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="stories" element={<ManageStories />} />
            <Route path="stories/new" element={<StoryEditor />} />
            <Route path="stories/edit/:id" element={<StoryEditor />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
