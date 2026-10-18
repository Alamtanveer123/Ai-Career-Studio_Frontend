import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';


export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h5 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
              Candidate Platform
            </h5>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
              <li>
                <Link to="/jobs" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Startup Jobs in India
                </Link>
              </li>
              <li>
                <Link to="/resume" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  AI Resume ATS Analyzer
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Application Kanban Board
                </Link>
              </li>
              <li>
                <Link to="/interview" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  AI Mock Interview Practice
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
              Tech Hubs
            </h5>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
              <li>
                <Link to="/jobs?location=Bengaluru" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Bengaluru Tech Startups
                </Link>
              </li>
              <li>
                <Link to="/jobs?location=Hyderabad" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Hyderabad Tech Hub
                </Link>
              </li>
              <li>
                <Link to="/jobs?location=Pune" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Pune SaaS & Cloud
                </Link>
              </li>
              <li>
                <Link to="/jobs?location=Remote" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Remote India Startups
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
              AI & Intelligence
            </h5>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
              <li>
                <span className="text-neutral-700 dark:text-neutral-300 font-medium text-[11px]">
                  OpenAI & Gemini Powered
                </span>
              </li>
              <li>
                <span className="text-neutral-500 dark:text-neutral-400">
                  Smart ATS Scoring
                </span>
              </li>
              <li>
                <span className="text-neutral-500 dark:text-neutral-400">
                  Semantic Role Matching
                </span>
              </li>
              <li>
                <span className="text-neutral-500 dark:text-neutral-400">
                  Instant Mock Interview AI
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
              AI Career
            </h5>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
              Empowering developers and startups with AI-powered resume intelligence, ATS optimization, and smart career pipelines.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Full-Stack AI Career Studio</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800 dark:text-neutral-200">
              AI Career<span className="text-brand-500">.</span>
            </span>
            <span>AI Career Studio &bull; Your AI-powered career companion</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} AI Career Studio. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
