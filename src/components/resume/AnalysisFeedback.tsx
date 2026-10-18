import React, { useState } from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { ResumeAnalysis } from '../../types/resume';
import { CheckCircle2, AlertTriangle, Lightbulb, BarChart3 } from 'lucide-react';

interface AnalysisFeedbackProps {
  analysis: ResumeAnalysis;
}

export const AnalysisFeedback: React.FC<AnalysisFeedbackProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'strengths' | 'weaknesses' | 'suggestions'>('all');

  return (
    <div className="space-y-4">
      {/* Sub-score Breakdown */}
      <Card className="p-5 border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Category Breakdown
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">Impact &amp; Metrics</span>
              <span className="text-slate-900 dark:text-white">{analysis.sectionScores.impact}%</span>
            </div>
            <ProgressBar value={analysis.sectionScores.impact} color="bg-indigo-600" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">Skill Density</span>
              <span className="text-slate-900 dark:text-white">{analysis.sectionScores.skills}%</span>
            </div>
            <ProgressBar value={analysis.sectionScores.skills} color="bg-emerald-600" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">Formatting &amp; ATS</span>
              <span className="text-slate-900 dark:text-white">{analysis.sectionScores.formatting}%</span>
            </div>
            <ProgressBar value={analysis.sectionScores.formatting} color="bg-brand-600" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">Depth of Exp</span>
              <span className="text-slate-900 dark:text-white">{analysis.sectionScores.experience}%</span>
            </div>
            <ProgressBar value={analysis.sectionScores.experience} color="bg-amber-600" />
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Insights
        </button>
        <button
          onClick={() => setActiveTab('strengths')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === 'strengths'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Strengths ({analysis.strengths.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('weaknesses')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === 'weaknesses'
              ? 'bg-rose-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Weaknesses ({analysis.weaknesses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === 'suggestions'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Suggestions ({analysis.suggestions.length})</span>
        </button>
      </div>

      {/* Cards list */}
      <div className="space-y-3">
        {/* Strengths */}
        {(activeTab === 'all' || activeTab === 'strengths') && (
          <Card className="p-5 border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <h5 className="text-xs font-bold uppercase tracking-wider">Identified Strengths</h5>
            </div>
            <ul className="space-y-2">
              {analysis.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Weaknesses */}
        {(activeTab === 'all' || activeTab === 'weaknesses') && (
          <Card className="p-5 border-rose-200/80 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <h5 className="text-xs font-bold uppercase tracking-wider">Critical Areas to Address</h5>
            </div>
            <ul className="space-y-2">
              {analysis.weaknesses.map((weak, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Suggestions */}
        {(activeTab === 'all' || activeTab === 'suggestions') && (
          <Card className="p-5 border-amber-200/80 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <Lightbulb className="w-4 h-4" />
              <h5 className="text-xs font-bold uppercase tracking-wider">Actionable AI Suggestions</h5>
            </div>
            <ul className="space-y-2">
              {analysis.suggestions.map((sug, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
};
