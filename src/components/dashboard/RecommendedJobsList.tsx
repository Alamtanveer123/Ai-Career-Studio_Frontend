import React, { useEffect, useState } from 'react';
import { Job } from '../../types/job';
import { jobsService } from '../../services/jobsService';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';
import {
  Bookmark,
  MapPin,
  IndianRupee,
  Briefcase,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';

import { useAppStore } from '../../store/useAppStore';
import { formatLpa, getScoreColorClass, deriveMatchScore } from '../../utils/formatters';
import { Link } from 'react-router-dom';

interface RecommendedJobsListProps {
  onSelectJob?: (job: Job) => void;
}

export const RecommendedJobsList: React.FC<RecommendedJobsListProps> = ({ onSelectJob }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { savedJobIds, toggleSaveJob, applications, addApplicationFromJob } = useAppStore();

  useEffect(() => {
    let isMounted = true;
    const fetchRecommended = async () => {
      try {
        setIsLoading(true);
        const data = await jobsService.getRecommendedJobs(4);
        if (isMounted) {
          // Normalize matchScore defensively
          const safeData = data.map((j) => ({
            ...j,
            matchScore: deriveMatchScore(j.id, j.matchScore),
          }));
          setJobs(safeData);
        }
      } catch (err) {
        console.error('Failed to load recommended jobs', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRecommended();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>AI Recommended Opportunities</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Top ranked roles matching your tech stack &amp; salary expectations
          </p>
        </div>

        <Link
          to="/jobs"
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1 group"
        >
          <span>View all 25+ jobs</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const isTracked = applications.some((a) => a.jobId === job.id);
            const scoreStyle = getScoreColorClass(job.matchScore);

            return (
              <Card
                key={job.id}
                className="p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200 border-slate-200/90 dark:border-slate-800"
              >
                <div>
                  {/* Card Header: Title + Match Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4
                        onClick={() => onSelectJob?.(job)}
                        className="font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer truncate"
                        title={job.title}
                      >
                        {job.title}
                      </h4>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate mt-0.5">
                        {job.company}
                      </p>
                    </div>

                    {/* Match Score Badge */}
                    <div
                      className={`shrink-0 px-2.5 py-1 rounded-full border text-xs font-bold flex items-center gap-1 ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}
                      title={`${job.matchScore}% Match based on your resume and skill preferences`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{job.matchScore}% Match</span>
                    </div>
                  </div>

                  {/* Metadata: Location, Salary, Experience */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                      {formatLpa(job.salaryMinLpa, job.salaryMaxLpa)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {job.experienceLevel.split(' ')[0]}
                    </span>
                  </div>

                  {/* Skill Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="neutral" size="sm">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="text-[11px] text-slate-400 self-center">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions: Save & Quick Apply */}
                <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`p-2 rounded-full border transition-all ${
                      isSaved
                        ? 'border-brand-300 bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:border-brand-800 dark:text-brand-400'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                    title={isSaved ? 'Saved to bookmarks' : 'Save job'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  <Button
                    size="sm"
                    variant={isTracked ? 'secondary' : 'coral'}
                    onClick={() => addApplicationFromJob(job, 'applied')}
                    leftIcon={
                      isTracked ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )
                    }
                    className="flex-1"
                  >
                    {isTracked ? 'Applied' : 'Quick Apply'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

