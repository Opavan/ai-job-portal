import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JobMatcher from './pages/JobMatcher';
import ApplicationTracker from './pages/ApplicationTracker';
import CoverLetter from './pages/CoverLetter';
import JobListings from './pages/JobListings';
import Login from './pages/Login';
import Register from './pages/Register';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex min-h-screen bg-[#0a0a0f]">
              <Sidebar />
              <main
                className="flex-1 ml-60 p-8 min-h-screen overflow-y-auto text-white"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0))',
                  boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.08)',
                }}
              >
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/resume" element={<ResumeAnalyzer />} />
                  <Route path="/jobs" element={<JobListings />} />
                  <Route path="/match" element={<JobMatcher />} />
                  <Route path="/tracker" element={<ApplicationTracker />} />
                  <Route path="/cover-letter" element={<CoverLetter />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
