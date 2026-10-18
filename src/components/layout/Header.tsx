import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, Search, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface HeaderProps {
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const location = useLocation();
  const { isDarkMode, toggleTheme, profile } = useAppStore();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return {
          title: 'Career Dashboard',
          subtitle: `Welcome back, ${profile.name.split(' ')[0]}`,
        };
      case '/resume':
        return {
          title: 'AI Resume Analyzer',
          subtitle: 'Instant keyword matching, ATS scoring & role-specific suggestions',
        };
      case '/jobs':
        return {
          title: 'Indian Tech Jobs',
          subtitle: 'Explore curated high-growth roles in Bengaluru, Pune, Hyderabad & more',
        };
      case '/tracker':
        return {
          title: 'Application Kanban Board',
          subtitle: 'Organize and manage your job applications across stages',
        };
      case '/interview':
        return {
          title: 'Mock Interview Practice',
          subtitle: 'AI-assisted technical, behavioral, and HR interview simulator',
        };
      default:
        return {
          title: 'AI Career Studio',
          subtitle: 'Your personal AI Job Copilot',
        };
    }
  };

  const { title, subtitle } = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Left: Mobile Menu + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 -ml-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Quick actions + Theme Toggle + Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick search button */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-lg text-xs text-slate-500">
            <Search className="w-3.5 h-3.5" />
            <span>Search jobs, skills, companies...</span>
            <kbd className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-2xs">
              ⌘K
            </kbd>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Active Copilot Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Copilot Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
