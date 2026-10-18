import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Briefcase,
  FileText,
  Headphones,
  Kanban,
  Github,
  Chrome,
} from 'lucide-react';

// Backend ka base URL. Frontend ki .env me VITE_API_URL set karo.
const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAppStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (isSignUp && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    try {
      setIsLoading(true);

      const endpoint = isSignUp ? '/auth/signup' : '/auth/login';
      const body = isSignUp
        ? { name: name.trim(), email: email.trim(), password }
        : { email: email.trim(), password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.error?.message || data?.message || 'Invalid email or password.'
        );
      }

      if (!data.token) {
        throw new Error('Server did not return a token.');
      }

      // Token save karo, taaki baaki API calls me bhej sako
      localStorage.setItem('auth_token', data.token);

      // Store me user set karo
      login(
        data.user?.email || email.trim(),
        data.user?.name || name.trim() || undefined
      );
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Real OAuth lagne tak social login band rakho, warna koi bhi bina auth ke andar aa jayega
  const handleSocialLogin = (provider: string) => {
    const label = provider.charAt(0).toUpperCase() + provider.slice(1);
    setError(`${label} sign-in is coming soon. Please use email and password.`);
  };

  const features = [
    {
      icon: Briefcase,
      title: 'Smart Job Discovery',
      description: 'AI-matched tech opportunities across top Indian startups',
    },
    {
      icon: FileText,
      title: 'Resume Intelligence',
      description: 'ATS optimization with AI-powered scoring & suggestions',
    },
    {
      icon: Kanban,
      title: 'Application Tracker',
      description: 'Visual Kanban pipeline to manage your entire job search',
    },
    {
      icon: Headphones,
      title: 'Mock Interviews',
      description: 'Practice with AI scoring and instant actionable feedback',
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] dark:bg-[#0B0F17] transition-colors duration-300">

      {/* Left Panel — Hero / Feature Showcase */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-rose-500 dark:from-brand-800 dark:via-brand-700 dark:to-rose-700" />

        {/* Animated Mesh Pattern */}
        <div className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating Orbs */}
        <div className="absolute top-20 left-16 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-20 w-56 h-56 bg-rose-300/20 rounded-full blur-3xl" style={{ animation: 'pulse 4s ease-in-out infinite' }} />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-amber-200/10 rounded-full blur-2xl" style={{ animation: 'pulse 6s ease-in-out infinite' }} />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          {/* Top: Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight">
                AI Career<span className="text-amber-300">.</span>
              </span>
              <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-sm border border-white/25">
                Studio
              </span>
            </div>
          </div>

          {/* Center: Hero Content */}
          <div className="space-y-8 max-w-xl">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
                Your AI-Powered
                <br />
                <span className="text-amber-200">Career Copilot</span>
              </h1>
              <p className="text-base xl:text-lg text-white/80 leading-relaxed max-w-md">
                Land your dream tech role with intelligent resume analysis, curated startup jobs, and AI-driven interview practice.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group p-4 rounded-2xl bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] hover:bg-white/[0.14] transition-all duration-300 cursor-default"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-4.5 h-4.5 text-white/90" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{feature.title}</h3>
                    <p className="text-xs text-white/60 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom: Social Proof */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {['bg-amber-400', 'bg-sky-400', 'bg-emerald-400', 'bg-violet-400'].map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-white/30 flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                  >
                    {['TA', 'RK', 'SP', 'AJ'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-white/90">Trusted by developers across India</p>
                <p className="text-[11px] text-white/50">Bengaluru • Hyderabad • Pune • Mumbai • Delhi NCR</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login / Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative">
        {/* Mobile Brand Header */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold text-neutral-900 dark:text-white tracking-tight">
            AI Career<span className="text-brand-500">.</span>
          </span>
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Form Header */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {isSignUp
                ? 'Start your AI-powered career journey today.'
                : 'Sign in to continue your career journey.'}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-all duration-200 hover:shadow-sm disabled:opacity-50 group"
            >
              <Chrome className="w-4.5 h-4.5 text-neutral-500 group-hover:text-brand-500 transition-colors" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-all duration-200 hover:shadow-sm disabled:opacity-50 group"
            >
              <Github className="w-4.5 h-4.5 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
              <span>GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              or continue with email
            </span>
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-1.5">
                <label htmlFor="login-name" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    id="login-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tanveer Alam"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 text-neutral-900 dark:text-white placeholder-neutral-400 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 text-neutral-900 dark:text-white placeholder-neutral-400 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className="w-full pl-10 pr-12 py-3 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 text-neutral-900 dark:text-white placeholder-neutral-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-xs text-rose-700 dark:text-rose-300 font-medium animate-slide-up">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white text-sm font-bold shadow-lg shadow-brand-500/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-brand-500 hover:text-brand-600 font-semibold transition-colors"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-neutral-400 dark:text-neutral-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};