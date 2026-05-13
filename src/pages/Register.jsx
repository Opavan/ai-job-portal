import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white">AI</div>
            <span className="text-white text-xl font-bold">JobPortal</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-white/70 text-sm mt-1">Start your job search journey</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 14px 36px rgba(0,0,0,0.2)',
          }}
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/80 text-sm font-medium block mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-indigo-500/50 text-sm"
              />
            </div>

            <div>
              <label className="text-white/80 text-sm font-medium block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-indigo-500/50 text-sm"
              />
            </div>

            <div>
              <label className="text-white/80 text-sm font-medium block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-indigo-500/50 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-40 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-white/70 text-sm mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
