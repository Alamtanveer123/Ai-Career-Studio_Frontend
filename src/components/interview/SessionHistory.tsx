import React from 'react';
import { Card } from '../common/Card';
import { InterviewSession } from '../../types/interview';
import { formatRelativeTime } from '../../utils/formatters';
import { Headphones, Eye, Award } from 'lucide-react';

interface SessionHistoryProps {
  sessions: InterviewSession[];
  onSelectSession: (session: InterviewSession) => void;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessions,
  onSelectSession,
}) => {
  if (sessions.length === 0) {
    return (
      <Card className="p-6 text-center border-slate-200/90 dark:border-slate-800 text-slate-400">
        <Headphones className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
          No Practice Sessions Yet
        </h4>
        <p className="text-[11px] text-slate-500 mt-1">
          Complete a practice question above to log scores and AI feedback history here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-5 border-slate-200/90 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Practice History ({sessions.length})
          </h4>
        </div>
        <span className="text-[11px] text-slate-400">Click to review</span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto pr-1">
        {sessions.map((sess) => (
          <div
            key={sess.id}
            onClick={() => onSelectSession(sess)}
            className="py-3 flex items-start justify-between gap-3 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {sess.category}
                </span>
                <span className="text-[11px] text-slate-400">
                  {sess.role}
                </span>
              </div>
              <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-1">
                {sess.question}
              </h5>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                <span>{formatRelativeTime(sess.createdAt)}</span>
                <span>&bull;</span>
                <span>{sess.timeSpentSeconds}s duration</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  {sess.feedback.overallScore}%
                </span>
                <div className="text-[9px] text-slate-400">Score</div>
              </div>
              <Eye className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
