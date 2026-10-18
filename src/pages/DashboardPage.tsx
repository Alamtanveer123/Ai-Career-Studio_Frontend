import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { deriveMatchScore } from '../utils/formatters';
import { SAMPLE_JOBS } from '../data/sampleJobs';
import { StatCard } from '../components/dashboard/StatCard';
import { ProfileCompletenessCard } from '../components/dashboard/ProfileCompletenessCard';
import { RecommendedJobsList } from '../components/dashboard/RecommendedJobsList';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import {

  Bookmark,
  Send,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { savedJobIds, applications } = useAppStore();

  const stats = useMemo(() => {
    const savedCount = savedJobIds.length;
    const trackedCount = applications.length;

    // Filter interviews scheduled
    const interviewCount = applications.filter(
      (a) => a.stage === 'interview' || Boolean(a.interviewDate)
    ).length;

    // Derive scores safely for all tracked applications & saved jobs
    const scores: number[] = [];

    // From applications:
    applications.forEach((app) => {
      const score = deriveMatchScore(app.jobId, app.matchScore);
      if (!isNaN(score) && score > 0) {
        scores.push(score);
      }
    });

    // From saved jobs:
    savedJobIds.forEach((jobId) => {
      const job = SAMPLE_JOBS.find((j) => j.id === jobId);
      const score = deriveMatchScore(jobId, job?.matchScore);
      if (!isNaN(score) && score > 0) {
        scores.push(score);
      }
    });

    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((sum, val) => sum + val, 0) / scores.length)
        : 88;

    return {
      savedCount,
      trackedCount,
      interviewCount,
      avgScore,
    };
  }, [savedJobIds, applications]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Candidate Hero & Profile Completeness */}
      <ProfileCompletenessCard />

      {/* 2. 4 Primary Stat Cards with generous spacing */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Saved Jobs"
          value={stats.savedCount}
          subtitle="Opportunities bookmarked"
          icon={Bookmark}
          iconColor="text-brand-500"
          iconBg="bg-brand-50 dark:bg-brand-950/60"
          linkTo="/jobs"
          trendText="+2 this week"
          trendPositive={true}
        />
        <StatCard
          title="Active Applications"
          value={stats.trackedCount}
          subtitle="In your hiring pipeline"
          icon={Send}
          iconColor="text-neutral-900 dark:text-neutral-100"
          iconBg="bg-neutral-100 dark:bg-neutral-800"
          linkTo="/tracker"
          trendText="Active pipeline"
          trendPositive={true}
        />
        <StatCard
          title="Interviews"
          value={stats.interviewCount}
          subtitle="Upcoming technical rounds"
          icon={Calendar}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
          linkTo="/tracker"
          trendText="1 scheduled soon"
          trendPositive={true}
        />
        <StatCard
          title="Avg Match Fit"
          value={`${stats.avgScore}%`}
          subtitle="Target role alignment"
          icon={Sparkles}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          linkTo="/resume"
          trendText="Strong fit"
          trendPositive={true}
        />
      </div>

      {/* 3. Main Two Column Section: Recommended Jobs + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <RecommendedJobsList />
        </div>
        <div className="lg:col-span-4">
          <RecentActivityFeed />
        </div>
      </div>
    </div>
  );
};

