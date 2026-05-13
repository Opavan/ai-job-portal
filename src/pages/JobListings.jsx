import React, { useState } from 'react';

const JOBS = [
  { id: 1, company: 'Google', role: 'Senior Frontend Engineer', location: 'Bangalore, India', salary: '₹45-65 LPA', type: 'Full-time', tags: ['React', 'TypeScript', 'GraphQL'], logo: 'G', color: '#4285F4', posted: '2 days ago' },
  { id: 2, company: 'Meta', role: 'Software Engineer II', location: 'Remote', salary: '₹40-55 LPA', type: 'Full-time', tags: ['React', 'Node.js', 'Python'], logo: 'M', color: '#0081FB', posted: '3 days ago' },
  { id: 3, company: 'Microsoft', role: 'Full Stack Developer', location: 'Hyderabad, India', salary: '₹30-45 LPA', type: 'Full-time', tags: ['React', 'C#', '.NET', 'Azure'], logo: 'M', color: '#00A4EF', posted: '1 day ago' },
  { id: 4, company: 'Amazon', role: 'SDE II Frontend', location: 'Bangalore, India', salary: '₹35-50 LPA', type: 'Full-time', tags: ['React', 'Java', 'AWS'], logo: 'A', color: '#FF9900', posted: '5 days ago' },
  { id: 5, company: 'Flipkart', role: 'Senior React Developer', location: 'Bangalore, India', salary: '₹25-40 LPA', type: 'Full-time', tags: ['React', 'Redux', 'Node.js'], logo: 'F', color: '#2874F0', posted: '1 day ago' },
  { id: 6, company: 'Razorpay', role: 'Frontend Engineer', location: 'Bangalore, India', salary: '₹20-35 LPA', type: 'Full-time', tags: ['Vue.js', 'TypeScript', 'GraphQL'], logo: 'R', color: '#2E74F0', posted: '4 days ago' },
  { id: 7, company: 'Swiggy', role: 'React Native Developer', location: 'Bangalore, India', salary: '₹18-30 LPA', type: 'Full-time', tags: ['React Native', 'TypeScript', 'Redux'], logo: 'S', color: '#FC8019', posted: '2 days ago' },
  { id: 8, company: 'Zomato', role: 'Full Stack Engineer', location: 'Gurugram, India', salary: '₹20-32 LPA', type: 'Full-time', tags: ['React', 'Node.js', 'MongoDB'], logo: 'Z', color: '#E23744', posted: '6 days ago' },
  { id: 9, company: 'Stripe', role: 'Frontend Engineer', location: 'Remote', salary: '$120-160k', type: 'Full-time', tags: ['React', 'TypeScript', 'Ruby'], logo: 'S', color: '#635BFF', posted: '3 days ago' },
  { id: 10, company: 'Atlassian', role: 'Senior UI Engineer', location: 'Remote', salary: '₹35-50 LPA', type: 'Full-time', tags: ['React', 'TypeScript', 'GraphQL'], logo: 'A', color: '#0052CC', posted: '1 week ago' },
  { id: 11, company: 'CRED', role: 'Frontend Engineer', location: 'Bangalore, India', salary: '₹22-38 LPA', type: 'Full-time', tags: ['React', 'TypeScript', 'Node.js'], logo: 'C', color: '#1C1C1E', posted: '2 days ago' },
  { id: 12, company: 'PhonePe', role: 'Senior React Developer', location: 'Bangalore, India', salary: '₹25-40 LPA', type: 'Full-time', tags: ['React', 'Redux', 'Java'], logo: 'P', color: '#5F259F', posted: '4 days ago' },
];

const FILTERS = ['All', 'Remote', 'Bangalore', 'Full-time'];
const ROLES = ['All Roles', 'Frontend', 'Full Stack', 'React Native', 'Backend'];

const JobCard = ({ job, onApply }) => {
  const [saved, setSaved] = useState(false);

  return (
    <div className="rounded-2xl p-5 transition-all group"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}>

      {/* Top */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${job.color}cc, ${job.color}66)`, border: `1px solid ${job.color}44` }}>
            {job.logo}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{job.role}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
              {job.company}
            </div>
          </div>
        </div>
        <button onClick={() => setSaved(!saved)}
          className="text-lg transition-all opacity-0 group-hover:opacity-100"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: saved ? '#f59e0b' : 'rgba(255,255,255,0.2)' }}>
          {saved ? '★' : '☆'}
        </button>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-xs flex items-center gap-1"
          style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
          📍 {job.location}
        </span>
        <span className="text-xs flex items-center gap-1"
          style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
          💰 {job.salary}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(34,197,94,0.1)', color: '#86efac', border: '1px solid rgba(34,197,94,0.2)', fontFamily: 'var(--font-mono)' }}>
          {job.type}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.tags.map(tag => (
          <span key={tag} className="text-xs px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.15)', fontFamily: 'var(--font-mono)' }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
          {job.posted}
        </span>
        <button onClick={() => onApply(job)}
          className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          Apply Now →
        </button>
      </div>
    </div>
  );
};

const JobListings = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [toast, setToast] = useState('');

  const handleApply = (job) => {
    setToast(`Opening ${job.company} application...`);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = JOBS.filter(job => {
    const matchSearch = search === '' ||
      job.role.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'All' ||
      (filter === 'Remote' && job.location === 'Remote') ||
      (filter === 'Bangalore' && job.location.includes('Bangalore')) ||
      (filter === 'Full-time' && job.type === 'Full-time');
    const matchRole = roleFilter === 'All Roles' ||
      job.role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchSearch && matchFilter && matchRole;
  });

  return (
    <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            JOB BOARD
          </span>
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
          Job Listings
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
          {filtered.length} opportunities across top companies
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex-1 relative min-w-64">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: 'rgba(255,255,255,0.2)' }}>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search role, company, skill..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none', fontFamily: 'var(--font-mono)' }}
            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
        </div>

        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: filter === f ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${filter === f ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`,
                color: filter === f ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
              }}>
              {f}
            </button>
          ))}
        </div>

        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-xs transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
          {ROLES.map(r => <option key={r} value={r} style={{ background: '#0f0f14' }}>{r}</option>)}
        </select>
      </div>

      {/* Job Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4 opacity-20">◉</div>
          <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>No jobs found</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-mono)' }}>
            Try different search terms or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(job => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 px-5 py-3 rounded-2xl text-sm font-medium z-50"
          style={{ background: 'rgba(99,102,241,0.9)', color: 'white', backdropFilter: 'blur(12px)', border: '1px solid rgba(99,102,241,0.5)', fontFamily: 'var(--font-mono)', animation: 'fadeUp 0.3s ease forwards' }}>
          ✓ {toast}
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default JobListings;