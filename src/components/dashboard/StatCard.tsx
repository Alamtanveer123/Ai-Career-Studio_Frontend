import React from 'react';
import { Card } from '../common/Card';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  linkTo?: string;
  trendText?: string;
  trendPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  linkTo,
  trendText,
  trendPositive = true,
}) => {
  const content = (
    <Card className="p-6 h-full transition-all duration-200 hover:shadow-card-hover border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {value}
            </span>
            {trendText && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  trendPositive
                    ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/60'
                    : 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/60'
                }`}
              >
                {trendText}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className={`w-12 h-12 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 shadow-2xs`}
          >
            <Icon className="w-5 h-5" />
          </div>
          {linkTo && (
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-brand-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          )}
        </div>
      </div>
    </Card>
  );

  if (linkTo) {
    return <Link to={linkTo} className="block h-full">{content}</Link>;
  }

  return content;
};

