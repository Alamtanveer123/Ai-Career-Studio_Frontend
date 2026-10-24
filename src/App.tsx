import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ResumePage } from './pages/ResumePage';
import { JobsPage } from './pages/JobsPage';
import { TrackerPage } from './pages/TrackerPage';
import { InterviewPage } from './pages/InterviewPage';
import { LoginPage } from './pages/LoginPage';
import { useAppStore } from './store/useAppStore';

// Protected route wrapper — redirects to /login if not authenticated
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { isDarkMode } = useAppStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public route: Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes: App shell */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="tracker" element={<TrackerPage />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
