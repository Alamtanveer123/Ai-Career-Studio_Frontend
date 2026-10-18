import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = 'w-full h-4',
  variant = 'text',
}) => {
  const shape = variant === 'circular' ? 'rounded-full' : variant === 'text' ? 'rounded' : 'rounded-xl';
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${shape} ${className}`}
    />
  );
};
