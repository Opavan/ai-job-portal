import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#060608' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 p-10 relative overflow-hidden"
        style={{ borderRight: '1px solid rgba(255,255,255,0.12)', boxShadow: '8px 0 28px rgba(0,0,0,0.28)' }}>
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(circle at 30% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontFamily: 'var(--font-mono)' }}>
              AI
            </div>
            <span className="text-white font-bold">JobPortal</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
              Land your dream job with AI
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Analyze your resume, match jobs, track applications — all powered by Gemini AI.
            </p>
          </div>
        </div>
        <div className="relative space-y-3">
          {['Resume scoring & analysis', 'AI job matching', 'Cover letter generation', 'Kanban application tracker'].map(f => (
            <div key={f} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              </div>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className="w-full max-w-sm animate-fade-up rounded-2xl p-8"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.025))',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 14px 36px rgba(0,0,0,0.2)',
          }}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Sign in to continue
            </p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Email address
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', outline: 'none', fontFamily: 'var(--font-mono)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Password
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', outline: 'none', fontFamily: 'var(--font-mono)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all mt-2"
              style={{ background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => !loading && (e.target.style.opacity = '0.9')}
              onMouseLeave={e => (e.target.style.opacity = '1')}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.68)' }}>
            No account?{' '}
            <button onClick={() => navigate('/register')}
              className="transition-colors"
              style={{ color: '#818cf8' }}
              onMouseEnter={e => e.target.style.color = '#a5b4fc'}
              onMouseLeave={e => e.target.style.color = '#818cf8'}>
              Create one →
            </button>
          </p>
        </div>
      </div>
      <style>{`
        input::placeholder {
          color: rgba(255,255,255,0.5);
        }
      `}</style>
    </div>
  );
};

export default Login;
