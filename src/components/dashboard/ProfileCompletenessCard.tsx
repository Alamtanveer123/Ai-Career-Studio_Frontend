import React from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import { CheckCircle2, Circle, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Link } from 'react-router-dom';

export const ProfileCompletenessCard: React.FC = () => {
  const { profile, resumeAnalysis } = useAppStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const checklistItems = [
    {
      id: 'role',
      label: 'Target role specified',
      completed: !!profile.targetRole,
      detail: profile.targetRole || 'Not set',
    },
    {
      id: 'skills',
      label: 'Technical skills tagged',
      completed: profile.skills.length >= 4,
      detail: `${profile.skills.length} skills listed`,
    },
    {
      id: 'resume',
      label: 'Resume ATS analyzed',
      completed: !!resumeAnalysis,
      detail: resumeAnalysis ? `Score: ${resumeAnalysis.overallScore}/100` : 'Pending analysis',
    },
    {
      id: 'locations',
      label: 'Preferred locations selected',
      completed: profile.preferredLocations.length > 0,
      detail: profile.preferredLocations.join(', '),
    },
  ];

  const completedCount = checklistItems.filter((i) => i.completed).length;
  const percentage = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <Card className="p-8 border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-card">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left greeting & intro */}
        <div className="space-y-3 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold border border-brand-200/60 dark:border-brand-800/60">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>AI Career Studio Active</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {getGreeting()}, {profile.name}!
          </h2>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Targeting <strong className="text-neutral-900 dark:text-white font-semibold">{profile.targetRole}</strong> in{' '}
            {profile.preferredLocations.slice(0, 3).join(', ')}. Your startup opportunities and ATS alignment are constantly updated.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link to="/resume">
              <Button size="sm" variant="coral" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                {resumeAnalysis ? 'Re-Analyze Resume' : 'Analyze Resume'}
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Browse Startup Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* Right completeness widget */}
        <div className="lg:w-80 bg-neutral-50 dark:bg-neutral-800/60 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-500" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                Profile Completeness
              </span>
            </div>
            <span className="text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-100/80 dark:bg-brand-950/80 px-2.5 py-0.5 rounded-full">
              {percentage}%
            </span>
          </div>

          <ProgressBar value={percentage} color="bg-brand-500" height="h-2" />

          {/* Checklist */}
          <div className="space-y-2 pt-1">
            {checklistItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  {item.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  )}
                  <span className={item.completed ? 'text-neutral-800 dark:text-neutral-200 font-medium' : 'text-neutral-400'}>
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 truncate max-w-[100px]">
                  {item.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

