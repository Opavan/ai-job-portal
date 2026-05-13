import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    API.get('/resume')
      .then(res => {
        if (res.data.resume) {
          setResumeText(res.data.resume.text);
          setResult(res.data.resume.analysis);
          setSaved(true);
        }
      })
      .catch(() => {});
  }, []);

  const analyze = async () => {
    if (!resumeText.trim() && !resumeFile) return;
    setLoading(true);
    setError('');
    try {
      const res = resumeFile
        ? await API.post('/resume/analyze', (() => {
            const formData = new FormData();
            formData.append('resumeFile', resumeFile);
            if (resumeText.trim()) {
              formData.append('resumeText', resumeText);
            }
            return formData;
          })(), {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : await API.post('/resume/analyze', { resumeText });
      setResult(res.data.data);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

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
    setSaved(false);
    setResumeFile(file);

    if (file.type === 'text/plain') {
      file.text()
        .then(text => setResumeText(text))
        .catch(() => setError('Could not read the selected file'));
    } else {
      setResumeText(`[Selected PDF] ${file.name}`);
    }
  };

  const scoreColor = !result ? '#6366f1' 
    : result.score >= 80 ? '#22c55e' 
    : result.score >= 60 ? '#f59e0b' 
    : '#ef4444';

  const circumference = 251;
  const offset = result ? circumference - (circumference * result.score) / 100 : circumference;

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
          Resume Analyzer
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '14px' }}>
          Paste your resume or upload a local `.txt` / `.pdf` file to get an AI score, skill breakdown, and actionable improvements.
        </p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: result ? '1fr 1fr' : '1fr' }}>
        {/* Input Panel */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.025))', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 10px 30px rgba(0,0,0,0.16)' }}>
            <div className="flex items-center justify-between mb-3">
              <label style={{ color: 'rgba(255,255,255,0.72)', fontSize: '12px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Resume Content
              </label>
              {saved && (
                <span style={{ color: '#86efac', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                  ✓ Auto-saved
                </span>
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
              placeholder="Paste your full resume here — or upload a local file above."
              rows={result ? 14 : 18}
              className="w-full text-sm resize-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '14px 16px',
                color: 'rgba(255,255,255,0.88)',
                outline: 'none',
                fontFamily: 'var(--font-mono)',
                lineHeight: '1.7',
                fontSize: '13px',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              ⚠ {error}
            </div>
          )}

          <button onClick={analyze} disabled={loading || (!resumeText.trim() && !resumeFile)}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
            style={{
              background: loading || (!resumeText.trim() && !resumeFile) ? 'rgba(99,102,241,0.25)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: loading || (!resumeText.trim() && !resumeFile) ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: loading || (!resumeText.trim() && !resumeFile) ? 'not-allowed' : 'pointer',
              border: 'none',
            }}>
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                  style={{ animation: 'spin 0.8s linear infinite' }} />
                Analyzing resume...
              </>
            ) : (
              '◈ Analyze with AI →'
            )}
          </button>
        </div>

        {/* Results Panel */}
        {result && (
          <div className="space-y-4" style={{ animation: 'fadeUp 0.4s ease forwards' }}>
            {/* Score Ring */}
            <div className="rounded-2xl p-6 flex items-center gap-6"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.025))', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 10px 30px rgba(0,0,0,0.16)' }}>
              <div className="relative flex-shrink-0">
                <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={scoreColor} strokeWidth="8"
                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1.2s ease', filter: `drop-shadow(0 0 6px ${scoreColor})` }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold" style={{ color: scoreColor, fontFamily: 'var(--font-mono)' }}>
                    {result.score}
                  </span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)' }}>
                    /100
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold mb-1 uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)' }}>
                  Resume Score
                </div>
                <div className="text-lg font-bold text-white mb-1">{result.experience_level}</div>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-2xl p-5"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.025))', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 10px 30px rgba(0,0,0,0.16)' }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)' }}>
                Detected Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {result.skills?.map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)', fontFamily: 'var(--font-mono)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Best Roles */}
            <div className="rounded-2xl p-5"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.025))', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 10px 30px rgba(0,0,0,0.16)' }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)' }}>
                Best Fit Roles
              </div>
              <div className="space-y-2">
                {result.best_roles?.map((role, i) => (
                  <div key={role} className="flex items-center gap-3">
                    <span style={{ color: '#6366f1', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                      0{i + 1}
                    </span>
                    <span className="text-sm text-white">{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="rounded-2xl p-5"
              style={{ background: 'linear-gradient(180deg, rgba(34,197,94,0.08), rgba(34,197,94,0.04))', border: '1px solid rgba(34,197,94,0.22)', boxShadow: '0 10px 30px rgba(0,0,0,0.16)' }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: '#86efac', fontFamily: 'var(--font-mono)' }}>
                ✓ Strengths
              </div>
              <div className="space-y-2">
                {result.strengths?.map(s => (
                  <div key={s} className="flex items-start gap-2.5">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: '#22c55e' }} />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.82)', lineHeight: '1.6' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div className="rounded-2xl p-5"
              style={{ background: 'linear-gradient(180deg, rgba(245,158,11,0.08), rgba(245,158,11,0.04))', border: '1px solid rgba(245,158,11,0.22)', boxShadow: '0 10px 30px rgba(0,0,0,0.16)' }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: '#fcd34d', fontFamily: 'var(--font-mono)' }}>
                ↑ Improvements
              </div>
              <div className="space-y-2">
                {result.improvements?.map(s => (
                  <div key={s} className="flex items-start gap-2.5">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: '#f59e0b' }} />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.82)', lineHeight: '1.6' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        textarea::placeholder {
          color: rgba(255,255,255,0.48);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResumeAnalyzer;
