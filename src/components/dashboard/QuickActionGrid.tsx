import React from 'react';
import { Card } from '../common/Card';
import { FileSearch, Sparkles, Briefcase, Kanban, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActionGrid: React.FC = () => {
  const actions = [
    {
      title: 'Analyze Resume',
      desc: 'Instant ATS score & missing keywords',
      icon: Sparkles,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-50 dark:bg-purple-950/60',
      to: '/resume',
    },
    {
      title: 'Browse Indian Jobs',
      desc: 'Bengaluru, Pune, Hyderabad, Remote',
      icon: Briefcase,
      iconColor: 'text-brand-600 dark:text-brand-400',
      iconBg: 'bg-brand-50 dark:bg-brand-950/60',
      to: '/jobs',
    },
    {
      title: 'Practice Interview',
      desc: 'Mock technical & behavioral questions',
      icon: Headphones,
      iconColor: 'text-sky-600 dark:text-sky-400',
      iconBg: 'bg-sky-50 dark:bg-sky-950/60',
      to: '/interview',
    },
    {
      title: 'Manage Kanban',
      desc: 'Track Saved, Applied & Interviews',
      icon: Kanban,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      to: '/tracker',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <FileSearch className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Quick Actions
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link key={act.title} to={act.to} className="block group">
              <Card className="p-4 h-full flex flex-col items-start justify-between hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all">
                <div
                  className={`w-9 h-9 rounded-xl ${act.iconBg} ${act.iconColor} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {act.desc}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
