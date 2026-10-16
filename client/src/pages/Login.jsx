import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Auto-Fill
  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-brand-50 text-brand-600 mb-3 shadow-inner">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Sign In to PropTax Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Municipal Property Tax Self-Assessment & Compliance Tracking
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@vem.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              1-Click Demo Profiles (Team VEM)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('raman@vem.gov.in', 'citizen123')}
                className="text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition group"
              >
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-brand-600">Ramanathan</div>
                <div className="text-[9px] text-amber-700 font-semibold">Senior (15% off)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('ananya@vem.gov.in', 'citizen123')}
                className="text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition group"
              >
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-brand-600">Ananya</div>
                <div className="text-[9px] text-blue-700 font-semibold">Diff-Abled (20%)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@vem.gov.in', 'admin123')}
                className="text-left p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition group"
              >
                <div className="text-[11px] font-bold text-purple-900 group-hover:text-purple-700">Admin</div>
                <div className="text-[9px] text-purple-700 font-semibold">GIS & Forecast</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Register New Taxpayer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
