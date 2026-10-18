import React from 'react';
import { Card } from '../common/Card';
import { useAppStore } from '../../store/useAppStore';
import { formatRelativeTime } from '../../utils/formatters';
import {
  Clock,
  Bookmark,
  Send,
  Calendar,
  FileText,
  Headphones,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentActivityFeed: React.FC = () => {
  const { recentActivity } = useAppStore();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'saved':
        return <Bookmark className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'applied':
        return <Send className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'interview':
        return <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'resume':
        return <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case 'practice':
        return <Headphones className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'saved':
        return 'bg-indigo-50 dark:bg-indigo-950/60';
      case 'applied':
        return 'bg-emerald-50 dark:bg-emerald-950/60';
      case 'interview':
        return 'bg-amber-50 dark:bg-amber-950/60';
      case 'resume':
        return 'bg-purple-50 dark:bg-purple-950/60';
      case 'practice':
        return 'bg-sky-50 dark:bg-sky-950/60';
      default:
        return 'bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <Card className="p-6 h-full flex flex-col justify-between border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-card">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">Pipeline log</span>
        </div>

        {recentActivity.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400">
            No recent activity yet. Start exploring jobs or practice an interview!
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80 mt-1">
            {recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="py-3.5 flex items-start gap-3 group">
                <div
                  className={`w-8 h-8 rounded-xl ${getIconBg(
                    activity.type
                  )} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                    {activity.title}
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    {activity.description}
                  </p>
                </div>

                <div className="text-[10px] text-neutral-400 whitespace-nowrap self-start mt-0.5 font-medium">
                  {formatRelativeTime(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 mt-3 border-t border-neutral-100 dark:border-neutral-800">
        <Link
          to="/tracker"
          className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white flex items-center justify-center gap-1 group py-1 transition-colors"
        >
          <span>View full application board</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </Card>
  );
};

