import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/resume', icon: '📄', label: 'Resume Analyzer' },
  { path: '/jobs', icon: '💼', label: 'Job Listings' },
  { path: '/match', icon: '🎯', label: 'Job Matcher' },
  { path: '/tracker', icon: '📋', label: 'App Tracker' },
  { path: '/cover-letter', icon: '✉️', label: 'Cover Letter' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="fixed left-0 top-0 w-60 h-screen flex flex-col p-4 z-50"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02))',
        borderRight: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '8px 0 28px rgba(0,0,0,0.32)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">AI</div>
        <span className="text-white font-bold text-base">JobPortal</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {nav.map(({ path, icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              location.pathname === path
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                : 'text-white/75 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="px-3 py-2 mb-2">
          <p className="text-white text-sm font-medium truncate">{user?.name}</p>
          <p className="text-white/65 text-xs truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/75 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
