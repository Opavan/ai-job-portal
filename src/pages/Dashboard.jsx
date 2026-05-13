import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/applications')
      .then(res => setApps(res.data.applications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Applied', value: apps.length, color: 'from-indigo-500 to-purple-600', icon: '💼' },
    { label: 'Interviews', value: apps.filter(a => a.status === 'interview').length, color: 'from-amber-500 to-orange-500', icon: '🗓️' },
    { label: 'Offers', value: apps.filter(a => a.status === 'offer').length, color: 'from-green-500 to-emerald-500', icon: '🎉' },
    { label: 'Rejected', value: apps.filter(a => a.status === 'rejected').length, color: 'from-red-500 to-rose-500', icon: '❌' },
  ];

  const quickActions = [
    { label: '📄 Analyze Resume', desc: 'Get AI feedback on your resume', path: '/resume' },
    { label: '🎯 Match a Job', desc: 'See how well you fit a role', path: '/match' },
    { label: '✉️ Cover Letter', desc: 'AI-written in seconds', path: '/cover-letter' },
    { label: '📋 Track Apps', desc: 'Manage your applications', path: '/tracker' },
  ];

  const statusColors = {
    applied: 'bg-indigo-500/15 text-indigo-300',
    interview: 'bg-amber-500/15 text-amber-300',
    offer: 'bg-green-500/15 text-green-300',
    rejected: 'bg-red-500/15 text-red-300',
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-white/70 text-sm mt-1">Here's your job search overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div
            key={s.label}
            className="rounded-2xl p-5"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
            }}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mb-3`}>
              {s.icon}
            </div>
            <div className="text-2xl font-bold text-white">{loading ? '...' : s.value}</div>
            <div className="text-white/70 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-sm font-semibold text-white/75 uppercase tracking-wider mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {quickActions.map(a => (
          <button
            key={a.label}
            onClick={() => navigate(a.path)}
            className="rounded-2xl p-5 text-left transition-all group"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
            }}
          >
            <div className="text-base font-semibold text-white mb-1">{a.label}</div>
            <div className="text-white/70 text-sm">{a.desc}</div>
          </button>
        ))}
      </div>

      {/* Recent Applications */}
      <h2 className="text-sm font-semibold text-white/75 uppercase tracking-wider mb-3">Recent Applications</h2>
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
        }}
      >
        {loading ? (
          <div className="p-8 text-center text-white/70 text-sm">Loading...</div>
        ) : apps.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-white/70 text-sm">No applications yet</p>
            <button onClick={() => navigate('/tracker')} className="mt-3 text-indigo-400 text-sm hover:text-indigo-300">
              Add your first application →
            </button>
          </div>
        ) : (
          apps.slice(0, 5).map((app, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 last:border-0 hover:bg-white/[0.03] transition"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                {app.company?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{app.role}</div>
                <div className="text-white/70 text-xs truncate">{app.company}</div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[app.status] || 'bg-white/10 text-white/75'}`}>
                {app.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
