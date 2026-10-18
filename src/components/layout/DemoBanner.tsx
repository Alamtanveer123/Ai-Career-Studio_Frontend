import React from 'react';
import { Sparkles, Info } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-brand-700 via-indigo-600 to-violet-700 text-white text-xs py-1.5 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-2">
      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
      <span>
        <strong>Demo Application</strong> &bull; All data, salaries, and company names are fictional samples for demonstration.
      </span>
      <span className="hidden md:inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] ml-2 font-mono">
        <Info className="w-3 h-3" /> No submissions made
      </span>
    </div>
  );
};

export const DemoFooter: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
          <span>AI Career Studio (Job Copilot for India) &bull; Demo app. Sample data only.</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Built with React 18, TypeScript, Tailwind CSS &amp; Zustand &bull; Client-side storage
        </div>
      </div>
    </footer>
  );
};
