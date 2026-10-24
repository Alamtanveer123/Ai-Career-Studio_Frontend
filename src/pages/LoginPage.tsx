import React, { useRef, useState } from 'react';
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
  KeyRound,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';

// Backend ka base URL. Frontend ki .env me VITE_API_URL set karo.
const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type ResetStep = 'email' | 'otp' | 'password';

const PasswordResetModal: React.FC<{
  initialEmail: string;
  onClose: () => void;
  onComplete: () => void;
}> = ({ initialEmail, onClose, onComplete }) => {
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const requestOtp = async (resend = false) => {
    setError('');
    if (!email.trim()) return setError('Please enter your email address.');
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/${resend ? 'resend-otp' : 'forgot-password'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error?.message || 'Unable to request an OTP.');
      setSecondsLeft(Math.max(1, Number(data.cooldownSeconds) || 60));
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to request an OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) return setError('Enter the complete 6 digit OTP.');
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: code }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error?.message || 'OTP verification failed.');
      setResetToken(data.resetToken);
      setStep('password');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed.');
    } finally { setIsLoading(false); }
  };

  const submitNewPassword = async () => {
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), resetToken, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error?.message || 'Password reset failed.');
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed.');
    } finally { setIsLoading(false); }
  };

  const updateOtp = (value: string, index: number) => {
    const digits = value.replace(/\D/g, '').slice(0, 6).split('');
    const next = [...otp];
    digits.forEach((digit, offset) => { if (index + offset < 6) next[index + offset] = digit; });
    if (!digits.length) next[index] = '';
    setOtp(next);
    const nextIndex = Math.min(5, index + Math.max(1, digits.length));
    if (digits.length) inputRefs.current[nextIndex]?.focus();
  };

  React.useEffect(() => {
    if (!secondsLeft) return;
    const timer = window.setInterval(() => setSecondsLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const title = step === 'email' ? 'Reset your password' : step === 'otp' ? 'Check your email' : 'Choose a new password';
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-neutral-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-7">
        <button onClick={onClose} className="mb-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </button>
        <div className="mb-6 space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400"><KeyRound className="h-5 w-5" /></div>
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white">{title}</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{step === 'email' ? 'We’ll email a secure 6 digit code if an account exists.' : step === 'otp' ? `Enter the code sent to ${email}.` : 'Use at least 8 characters for your new password.'}</p>
        </div>
        {error && <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
        {step === 'email' && <div className="space-y-4"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="you@example.com" className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 outline-none focus:ring-2 focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" /><button disabled={isLoading} onClick={() => requestOtp()} className="min-h-[48px] w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? 'Sending…' : 'Send OTP'}</button></div>}
        {step === 'otp' && <div className="space-y-5"><div className="flex justify-between gap-1.5 sm:gap-2">{otp.map((digit, index) => <input key={index} ref={(node) => { inputRefs.current[index] = node; }} value={digit} inputMode="numeric" maxLength={6} aria-label={`OTP digit ${index + 1}`} onChange={(e) => updateOtp(e.target.value, index)} onKeyDown={(e) => { if (e.key === 'Backspace' && !otp[index] && index) inputRefs.current[index - 1]?.focus(); }} className="h-12 min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white text-center text-lg font-bold outline-none focus:ring-2 focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-950" />)}</div><button disabled={isLoading} onClick={verifyOtp} className="min-h-[48px] w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? 'Verifying…' : 'Verify OTP'}</button><button disabled={secondsLeft > 0 || isLoading} onClick={() => requestOtp(true)} className="min-h-[44px] w-full text-sm font-semibold text-brand-600 disabled:text-neutral-400"><RotateCcw className="mr-1 inline h-4 w-4" />{secondsLeft ? `Resend available in ${secondsLeft}s` : 'Resend OTP'}</button></div>}
        {step === 'password' && <div className="space-y-3"><input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="New password" className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-950" /><input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Confirm new password" className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-950" /><label className="flex min-h-[44px] items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300"><input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} /> Show passwords</label><button disabled={isLoading} onClick={submitNewPassword} className="min-h-[48px] w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? 'Updating…' : 'Reset password'}</button></div>}
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, addToast } = useAppStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResetOpen, setIsResetOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim() || password.length < 8) {
      setError('Password must be at least 8 characters.');
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
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-8 sm:py-12 relative min-h-screen">
        {/* Mobile Brand Header */}
        <div className="lg:hidden w-full max-w-md flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold text-neutral-900 dark:text-white tracking-tight">
            AI Career<span className="text-brand-500">.</span>
          </span>
        </div>

        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Form Header */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {isSignUp
                ? 'Start your AI-powered career journey today with email.'
                : 'Sign in to continue your career journey with email.'}
            </p>
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
                    onClick={() => setIsResetOpen(true)}
                    className="min-h-[44px] -mr-2 px-2 text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors"
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
      {isResetOpen && <PasswordResetModal initialEmail={email} onClose={() => setIsResetOpen(false)} onComplete={() => { setIsResetOpen(false); setPassword(''); setError(''); addToast('Password reset', 'Your password was updated. Please sign in.', 'success'); }} />}
    </div>
  );
};
