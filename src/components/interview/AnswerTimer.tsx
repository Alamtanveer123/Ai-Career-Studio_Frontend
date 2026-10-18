import React from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface AnswerTimerProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  seconds: number;
}

export const AnswerTimer: React.FC<AnswerTimerProps> = ({
  isRunning,
  onToggle,
  onReset,
  seconds,
}) => {
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="inline-flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
        <Clock className={`w-3.5 h-3.5 ${isRunning ? 'text-brand-600 dark:text-brand-400 animate-spin' : 'text-slate-400'}`} />
        <span className="text-sm">{formatTime(seconds)}</span>
      </div>

      <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
        <button
          type="button"
          onClick={onToggle}
          className="p-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Reset timer"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
