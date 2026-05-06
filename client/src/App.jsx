import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import WorkspaceHeader from './components/WorkspaceHeader';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import GeneratorPage from './pages/GeneratorPage';
import HistoryPage from './pages/HistoryPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import PreferencesPage from './pages/PreferencesPage';
import RegisterPage from './pages/RegisterPage';

function AppRedirect() {
  const { isAuthenticated } = useAuth();

  return <Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />;
}

function ProtectedAppLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-transparent md:grid md:grid-cols-[18rem_1fr]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen">
        <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-8 lg:px-10">
          <WorkspaceHeader onOpenMenu={() => setIsSidebarOpen(true)} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedAppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generate" element={<GeneratorPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<AppRedirect />} />
    </Routes>
  );
}
