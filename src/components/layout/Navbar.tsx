import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  Kanban,
  Headphones,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  LogOut,
} from 'lucide-react';

import { useAppStore } from '../../store/useAppStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, savedJobIds, applications, isDarkMode, toggleTheme, logout } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/dashboard', label: 'Discover', icon: LayoutDashboard },
    { to: '/jobs', label: 'Jobs', icon: Briefcase, count: savedJobIds.length },
    { to: '/resume', label: 'AI Resume', icon: FileText, highlight: true },
    { to: '/tracker', label: 'Applications', icon: Kanban, count: applications.length },
    { to: '/interview', label: 'Practice', icon: Headphones },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo & Navigation Links */}
            <div className="flex items-center gap-8">
              {/* AI Career Brand Wordmark */}
              <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
                <div className="flex items-center">
                  <span className="text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                    AI Career<span className="text-brand-500">.</span>
                  </span>
                  <span className="ml-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                    Studio
                  </span>
                </div>
              </NavLink>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `relative px-3.5 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2 ${
                        isActive
                          ? 'text-neutral-950 dark:text-white font-semibold bg-neutral-100 dark:bg-neutral-800'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                      }`
                    }
                  >
                    <span>{item.label}</span>
                    {item.highlight && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                    )}
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                        {item.count}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right: Quick Search + Theme Toggle + Actions */}
            <div className="flex items-center gap-3">
              {/* Quick Search Bar */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 text-neutral-500 dark:text-neutral-400 rounded-full text-xs transition-colors border border-neutral-200/60 dark:border-neutral-700/60"
              >
                <Search className="w-3.5 h-3.5 text-neutral-400" />
                <span>Search startups, roles, skills...</span>
                <kbd className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-400 shadow-2xs ml-1">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-neutral-700" />
                )}
              </button>

              {/* Primary Action Button */}
              <NavLink to="/resume" className="hidden sm:inline-flex">
                <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-xs transition-all active:scale-95">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Resume</span>
                </button>
              </NavLink>

              {/* Candidate Profile Avatar & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-800">
                <div
                  className="w-8 h-8 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center text-xs font-bold uppercase shadow-xs cursor-pointer"
                  title={`${profile.name || 'User'} - ${profile.targetRole || 'No role set'}`}
                >
                  {(profile.name || 'U').slice(0, 2)}
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login', { replace: true });
                  }}
                  className="p-2 text-neutral-500 hover:text-rose-600 dark:text-neutral-400 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 pt-3 pb-6 space-y-2 animate-slide-up">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 mb-3">
              <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold uppercase">
                {profile.name.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                  {profile.name}
                </p>
                <p className="text-xs text-neutral-500 truncate">{profile.targetRole}</p>
              </div>
            </div>

            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-neutral-500" />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 font-semibold">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}

            <div className="pt-2">
              <NavLink to="/resume" className="block w-full">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Resume with AI</span>
                </button>
              </NavLink>
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-4 animate-slide-up">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 text-neutral-400 absolute left-3" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs by title, company (e.g. React, Bengaluru, AI)..."
                className="w-full pl-10 pr-20 py-3 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-neutral-900 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg hover:opacity-90"
              >
                Search
              </button>
            </form>
            <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 px-1">
              <span>Press Enter to search listings</span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
