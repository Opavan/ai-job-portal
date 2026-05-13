import React, { useState, useEffect } from 'react';
import API from '../services/api';

const CoverLetter = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    API.get('/resume')
      .then(res => { if (res.data.resume) setResumeText(res.data.resume.text); })
      .catch(() => {});
  }, []);

  const generate = async () => {
    if (!resumeText.trim() || !jobDescription.trim() || !companyName.trim() || !jobTitle.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await API.post('/cover-letter', { resumeText, jobDescription, companyName, jobTitle });
      setResult(res.data.coverLetter);
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: 'white',
    outline: 'none',
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
    transition: 'border-color 0.2s',
  };

  const canGenerate = resumeText.trim() && jobDescription.trim() && companyName.trim() && jobTitle.trim();

  return (
    <div className="max-w-5xl" style={{ animation: 'fadeUp 0.5s ease forwards' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            AI TOOL
          </span>
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
          Cover Letter
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
          Fill in the details — get a personalized, professional cover letter in seconds.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left — Inputs */}
        <div className="space-y-4">
          {/* Company & Role */}
          <div className="rounded-2xl p-5 space-y-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>
              Job Details
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
                  Company Name *
                </label>
                <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                  placeholder="Google, Meta..." style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
                />
              </div>
              <div>
                <label className="block mb-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
                  Job Title *
                </label>
                <input value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                  placeholder="Frontend Engineer..." style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
                />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <label className="block mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>
              Job Description *
            </label>
            <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job description..."
              rows={7} style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
            />
          </div>

          {/* Resume */}
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>
                Your Resume *
              </label>
              {resumeText && (
                <span style={{ color: '#86efac', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>✓ Loaded</span>
              )}
            </div>
            <textarea value={resumeText} onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your resume or go to Resume Analyzer to save it..."
              rows={5} style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              ⚠ {error}
            </div>
          )}

          <button onClick={generate} disabled={loading || !canGenerate}
            className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{
              background: loading || !canGenerate ? 'rgba(99,102,241,0.2)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: loading || !canGenerate ? 'rgba(255,255,255,0.25)' : 'white',
              cursor: loading || !canGenerate ? 'not-allowed' : 'pointer',
              border: 'none',
              transition: 'all 0.2s',
            }}>
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                  style={{ animation: 'spin 0.8s linear infinite' }} />
                Writing your cover letter...
              </>
            ) : '◧ Generate Cover Letter →'}
          </button>
        </div>

        {/* Right — Output */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', minHeight: '500px' }}>
          {/* Output Header */}
          <div className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: result ? '#22c55e' : 'rgba(255,255,255,0.15)' }} />
              <span className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
                {result ? 'Generated Letter' : 'Output'}
              </span>
            </div>
            {result && (
              <button onClick={copy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: copied ? '#86efac' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                }}>
                {copied ? '✓ Copied!' : '⎘ Copy'}
              </button>
            )}
          </div>

          {/* Output Content */}
          <div className="p-5 h-full">
            {loading ? (
              <div className="space-y-3">
                <div className="skeleton h-4 rounded-lg w-3/4" />
                <div className="skeleton h-4 rounded-lg w-full" />
                <div className="skeleton h-4 rounded-lg w-5/6" />
                <div className="skeleton h-4 rounded-lg w-full" />
                <div className="skeleton h-4 rounded-lg w-2/3" />
                <div className="mt-6 skeleton h-4 rounded-lg w-full" />
                <div className="skeleton h-4 rounded-lg w-full" />
                <div className="skeleton h-4 rounded-lg w-4/5" />
              </div>
            ) : result ? (
              <div className="h-full">
                <div className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.8' }}>
                  {result}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-4xl mb-4 opacity-20">◧</div>
                <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Your cover letter will appear here
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.12)', fontFamily: 'var(--font-mono)' }}>
                  Fill in all fields and click generate
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default CoverLetter;