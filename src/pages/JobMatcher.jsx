import React, { useState, useEffect } from 'react';
import API from '../services/api';

const JobMatcher = () => {
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/resume')
      .then(res => {
        if (res.data.resume) setResumeText(res.data.resume.text);
      })
      .catch(() => {});
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setResumeFile(null);
      setError('Only .txt and .pdf resume files are supported right now');
      return;
    }

    setError('');
    setResumeFile(file);

    if (file.type === 'text/plain') {
      file.text()
        .then(text => setResumeText(text))
        .catch(() => setError('Could not read the selected file'));
    } else {
      setResumeText(`[Selected PDF] ${file.name}`);
    }
  };

  const match = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/jobs/match', { resumeText, jobDescription });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Matching failed');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = !result ? '#6366f1'
    : result.match_score >= 80 ? '#22c55e'
    : result.match_score >= 60 ? '#f59e0b'
    : '#ef4444';

  const scoreLabel = !result ? '' 
    : result.match_score >= 80 ? 'Strong Match' 
    : result.match_score >= 60 ? 'Good Match' 
    : 'Weak Match';

  return (
    <div className="max-w-5xl" style={{ animation: 'fadeUp 0.5s ease forwards' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            AI TOOL
          </span>
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
          Job Matcher
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '14px' }}>
          Paste a job description and upload or paste your resume to see how well it matches and what is missing.
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Resume */}
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.025))', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 10px 30px rgba(0,0,0,0.16)' }}>
          <div className="flex items-center justify-between mb-3">
            <label style={{ color: 'rgba(255,255,255,0.72)', fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Your Resume
            </label>
            {resumeText && (
              <span style={{ color: '#86efac', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>✓ Loaded</span>
            )}
          </div>
          <label
            className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 mb-3 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.14)' }}
          >
            <div>
              <div style={{ color: 'rgba(255,255,255,0.86)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                {resumeFile ? resumeFile.name : 'Upload resume from disk'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '11px' }}>
                Supports .txt and .pdf
              </div>
            </div>
            <span style={{ color: '#c7d2fe', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              Choose file
            </span>
            <input
              type="file"
              accept=".txt,.pdf,text/plain,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste your resume here or upload a local file above."
            rows={10}
            className="w-full resize-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              padding: '12px 14px',
              color: 'rgba(255,255,255,0.88)',
              outline: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              lineHeight: '1.7',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
        </div>

        {/* Job Description */}
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.025))', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 10px 30px rgba(0,0,0,0.16)' }}>
          <label className="block mb-3" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here — requirements, responsibilities, qualifications..."
            rows={10}
            className="w-full resize-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              padding: '12px 14px',
              color: 'rgba(255,255,255,0.88)',
              outline: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              lineHeight: '1.7',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          ⚠ {error}
        </div>
      )}

      <button onClick={match} disabled={loading || !resumeText.trim() || !jobDescription.trim()}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 mb-8"
        style={{
          background: loading || !resumeText.trim() || !jobDescription.trim() ? 'rgba(99,102,241,0.2)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: loading || !resumeText.trim() || !jobDescription.trim() ? 'rgba(255,255,255,0.25)' : 'white',
          cursor: loading || !resumeText.trim() || !jobDescription.trim() ? 'not-allowed' : 'pointer',
          border: 'none',
        }}>
        {loading ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
              style={{ animation: 'spin 0.8s linear infinite' }} />
            Analyzing match...
          </>
        ) : '◎ Analyze Match →'}
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-4" style={{ animation: 'fadeUp 0.4s ease forwards' }}>
          {/* Score Banner */}
          <div className="rounded-2xl p-6 flex items-center gap-6"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.025))', border: `1px solid ${scoreColor}55`, boxShadow: '0 10px 30px rgba(0,0,0,0.16)' }}>
            <div className="relative flex-shrink-0">
              <svg width="90" height="90" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={scoreColor} strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  strokeDashoffset={251 - (251 * result.match_score) / 100}
                  style={{ transition: 'stroke-dashoffset 1.2s ease', filter: `drop-shadow(0 0 8px ${scoreColor})` }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: scoreColor, fontFamily: 'var(--font-mono)' }}>
                  {result.match_score}%
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-white mb-1">{scoreLabel}</div>
              <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.78)', lineHeight: '1.6' }}>
                {result.recommendation}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{
                  background: result.should_apply ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${result.should_apply ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  color: result.should_apply ? '#86efac' : '#fca5a5',
                  fontFamily: 'var(--font-mono)',
                }}>
                {result.should_apply ? '✓ Recommended to apply' : '✗ Not recommended yet'}
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched */}
            <div className="rounded-2xl p-5"
              style={{ background: 'linear-gradient(180deg, rgba(34,197,94,0.08), rgba(34,197,94,0.04))', border: '1px solid rgba(34,197,94,0.22)', boxShadow: '0 10px 30px rgba(0,0,0,0.16)' }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: '#86efac', fontFamily: 'var(--font-mono)' }}>
                ✓ Matched Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {result.matched_skills?.map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-full text-xs"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#86efac', border: '1px solid rgba(34,197,94,0.2)', fontFamily: 'var(--font-mono)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="rounded-2xl p-5"
              style={{ background: 'linear-gradient(180deg, rgba(239,68,68,0.08), rgba(239,68,68,0.04))', border: '1px solid rgba(239,68,68,0.22)', boxShadow: '0 10px 30px rgba(0,0,0,0.16)' }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: '#fca5a5', fontFamily: 'var(--font-mono)' }}>
                ✗ Missing Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missing_skills?.map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-full text-xs"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)', fontFamily: 'var(--font-mono)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-2xl p-5"
            style={{ background: 'linear-gradient(180deg, rgba(99,102,241,0.08), rgba(99,102,241,0.04))', border: '1px solid rgba(99,102,241,0.22)', boxShadow: '0 10px 30px rgba(0,0,0,0.16)' }}>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#a5b4fc', fontFamily: 'var(--font-mono)' }}>
              ◈ Tips to Improve Match
            </div>
            <div className="space-y-2.5">
              {result.tips?.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: '11px', marginTop: '2px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.82)', lineHeight: '1.6' }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <style>{`
        textarea::placeholder {
          color: rgba(255,255,255,0.48);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default JobMatcher;
