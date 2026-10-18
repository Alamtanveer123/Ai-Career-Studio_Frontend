import React from 'react';

interface CircularScoreProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const CircularScore: React.FC<CircularScoreProps> = ({
  score,
  size = 160,
  strokeWidth = 12,
  label = 'ATS Score',
  sublabel = 'Match Quality',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 85) return { stroke: '#10b981', text: 'text-emerald-600 dark:text-emerald-400', label: 'Strong Fit' };
    if (s >= 70) return { stroke: '#6366f1', text: 'text-brand-600 dark:text-brand-400', label: 'Good Match' };
    if (s >= 50) return { stroke: '#f59e0b', text: 'text-amber-500 dark:text-amber-400', label: 'Moderate' };
    return { stroke: '#ef4444', text: 'text-rose-500 dark:text-rose-400', label: 'Needs Polish' };
  };

  const style = getColor(clampedScore);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Dynamic Progress Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={style.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-extrabold tracking-tight ${style.text}`}>
            {clampedScore}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          {label}
        </h4>
        <p className="text-xs font-semibold mt-0.5 text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.stroke }} />
          <span>{style.label} &bull; {sublabel}</span>
        </p>
      </div>
    </div>
  );
};
