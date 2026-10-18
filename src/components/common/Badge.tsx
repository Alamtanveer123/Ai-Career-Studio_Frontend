import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  icon,
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  const variantClasses = {
    primary: 'bg-brand-50 text-brand-700 border border-brand-200/80 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-800',
    secondary: 'bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
    outline: 'bg-transparent text-neutral-700 border border-neutral-300 dark:text-neutral-300 dark:border-neutral-700',
    neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200/60 dark:bg-neutral-800/80 dark:text-neutral-300 dark:border-neutral-700/60',
  }[variant];


  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
