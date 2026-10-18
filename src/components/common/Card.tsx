import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-card transition-all duration-200 ${
        hoverable ? 'hover:shadow-card-hover hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

