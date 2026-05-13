import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';

const COLUMNS = [
  { id: 'applied', label: 'Applied', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  { id: 'interview', label: 'Interview', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { id: 'offer', label: 'Offer', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
  { id: 'rejected', label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
];

const AddModal = ({ onAdd, onClose }) => {
  const [form, setForm] = useState({ company: '', role: '', location: '', salary: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) return;
    setLoading(true);
    try {
      const res = await API.post('/applications', { ...form, status: 'applied' });
      onAdd(res.data.application);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'white',
    outline: 'none',
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#0f0f14', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">Add Application</h3>
          <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {[
            { key: 'company', label: 'Company *', placeholder: 'Google, Meta, Startup...' },
            { key: 'role', label: 'Role *', placeholder: 'Frontend Engineer, SDE II...' },
            { key: 'location', label: 'Location', placeholder: 'Remote, Bangalore, NYC...' },
            { key: 'salary', label: 'Salary', placeholder: '₹20LPA, $120k...' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                {f.label}
              </label>
              <input
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          ))}
          <div>
            <label style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Recruiter contact, interview date, referral..."
              rows={3}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !form.company || !form.role}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Adding...' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AppCard = ({ app, onDragStart, onDelete }) => {
  const statusColor = {
    applied: '#6366f1', interview: '#f59e0b', offer: '#22c55e', rejected: '#ef4444'
  };

  return (
    <div
      draggable
      onDragStart={() => onDragStart(app)}
      className="rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all group"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '8px',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${statusColor[app.status]}88, ${statusColor[app.status]}44)`, border: `1px solid ${statusColor[app.status]}44` }}>
            {app.company?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-tight">{app.company}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
              {app.role}
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(app._id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs p-1 rounded"
          style={{ color: 'rgba(239,68,68,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
          ✕
        </button>
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-2">
        {app.location && (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
            📍 {app.location}
          </span>
        )}
        {app.salary && (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
            💰 {app.salary}
          </span>
        )}
        <span className="text-xs ml-auto" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
          {new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      {app.notes && (
        <p className="text-xs mt-2 leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px' }}>
          {app.notes}
        </p>
      )}
    </div>
  );
};

const ApplicationTracker = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [draggedApp, setDraggedApp] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  useEffect(() => {
    API.get('/applications')
      .then(res => setApps(res.data.applications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDragStart = (app) => setDraggedApp(app);

  const handleDrop = async (columnId) => {
    if (!draggedApp || draggedApp.status === columnId) return;
    try {
      const res = await API.put(`/applications/${draggedApp._id}`, { status: columnId });
      setApps(prev => prev.map(a => a._id === draggedApp._id ? res.data.application : a));
    } catch (err) {
      console.error(err);
    }
    setDraggedApp(null);
    setDragOver(null);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/applications/${id}`);
      setApps(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = (app) => setApps(prev => [app, ...prev]);

  return (
    <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              KANBAN BOARD
            </span>
            <div className="h-px w-20" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
            Application Tracker
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
            Drag & drop cards to update status. {apps.length} application{apps.length !== 1 ? 's' : ''} tracked.
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          + Add Application
        </button>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="skeleton h-5 w-24 rounded-lg mb-4" />
              {[1, 2].map(i => <div key={i} className="skeleton h-24 rounded-xl mb-2" />)}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colApps = apps.filter(a => a.status === col.id);
            const isDragOver = dragOver === col.id;
            return (
              <div key={col.id}
                onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(col.id)}
                className="rounded-2xl p-3 transition-all min-h-96"
                style={{
                  background: isDragOver ? col.bg : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isDragOver ? col.color + '40' : 'rgba(255,255,255,0.05)'}`,
                  transition: 'all 0.2s',
                }}>
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                    <span className="text-sm font-semibold" style={{ color: col.color }}>
                      {col.label}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: col.bg, color: col.color, fontFamily: 'var(--font-mono)' }}>
                    {colApps.length}
                  </span>
                </div>

                {/* Cards */}
                {colApps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 rounded-xl"
                    style={{ border: `2px dashed ${col.color}20` }}>
                    <div className="text-2xl mb-2 opacity-30">◫</div>
                    <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
                      Drop here
                    </p>
                  </div>
                ) : (
                  colApps.map(app => (
                    <AppCard
                      key={app._id}
                      app={app}
                      onDragStart={handleDragStart}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && <AddModal onAdd={handleAdd} onClose={() => setShowModal(false)} />}
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default ApplicationTracker;