import { Job } from '../types/job';
import { SAMPLE_JOBS } from '../data/sampleJobs';

/**
 * Format salary in Lakhs Per Annum (LPA)
 */
export function formatLpa(minLpa: number, maxLpa?: number): string {
  if (!maxLpa || minLpa === maxLpa) {
    return `₹${minLpa} LPA`;
  }
  return `₹${minLpa} - ₹${maxLpa} LPA`;
}

/**
 * Get human-readable relative time string
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

/**
 * Format date for display in India format (DD MMM YYYY)
 */
export function formatDateDisplay(dateString?: string): string {
  if (!dateString) return 'Not scheduled';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * Get match score color classes (Tailwind)
 */
export function getScoreColorClass(score: number): {
  text: string;
  bg: string;
  border: string;
  ring: string;
} {
  if (score >= 90) {
    return {
      text: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800',
      ring: 'ring-emerald-500',
    };
  }
  if (score >= 75) {
    return {
      text: 'text-indigo-700 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200 dark:border-indigo-800',
      ring: 'ring-indigo-500',
    };
  }
  if (score >= 60) {
    return {
      text: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800',
      ring: 'ring-amber-500',
    };
  }
  return {
    text: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800',
    ring: 'ring-rose-500',
  };
}

/**
 * Defensive matchScore derivation:
 * If an item from older localStorage lacks matchScore, derive it from sample listing or compute a reliable default
 */
export function deriveMatchScore(jobId: string, providedScore?: number): number {
  if (typeof providedScore === 'number' && !isNaN(providedScore) && providedScore > 0) {
    return Math.min(100, Math.max(0, Math.round(providedScore)));
  }

  // Lookup job in sample database
  const matchedJob = SAMPLE_JOBS.find((j: Job) => j.id === jobId);
  if (matchedJob && typeof matchedJob.matchScore === 'number') {
    return matchedJob.matchScore;
  }

  // Deterministic fallback based on ID hash between 75 and 92
  let hash = 0;
  for (let i = 0; i < jobId.length; i++) {
    hash = (hash << 5) - hash + jobId.charCodeAt(i);
    hash |= 0;
  }
  return 75 + Math.abs(hash % 18);
}
