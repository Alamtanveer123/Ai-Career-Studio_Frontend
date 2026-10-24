import React, { useState, useEffect } from 'react';
import { Job, JobFilterParams } from '../types/job';
import { jobsService } from '../services/jobsService';
import { JobFilters } from '../components/jobs/JobFilters';
import { JobCard } from '../components/jobs/JobCard';
import { JobDetailDrawer } from '../components/jobs/JobDetailDrawer';
import { Card } from '../components/common/Card';
import { Skeleton } from '../components/common/Skeleton';
import { Frown, Bookmark } from 'lucide-react';

import { useAppStore } from '../store/useAppStore';

export const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewOnlySaved, setViewOnlySaved] = useState(false);
  const { savedJobIds } = useAppStore();

  const [filters, setFilters] = useState<JobFilterParams>({
    role: 'All Roles',
    location: 'All Locations',
    experience: 'All Levels',
    jobType: 'All Types',
    minSalaryLpa: 0,
    searchQuery: '',
  });

  useEffect(() => {
    let isCurrent = true;
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const data = await jobsService.getJobs(filters);
        if (isCurrent) {
          setJobs(data);
        }
      } catch (err) {
        console.error('Error fetching jobs', err);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    fetchJobs();
    return () => {
      isCurrent = false;
    };
  }, [filters]);

  const displayedJobs = viewOnlySaved
    ? jobs.filter((j) => savedJobIds.includes(j.id))
    : jobs;

  const handleOpenDrawer = (job: Job) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      role: 'All Roles',
      location: 'All Locations',
      experience: 'All Levels',
      jobType: 'All Types',
      minSalaryLpa: 0,
      searchQuery: '',
    });
    setViewOnlySaved(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header with Title & Saved Tab Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Discover Tech Startup Jobs
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Curated high-growth tech opportunities across Bengaluru, Hyderabad, Pune, Mumbai, Delhi NCR, and Remote India.
          </p>
        </div>

        {/* View Toggle: All vs Saved Only */}
        <div className="flex w-full sm:w-auto items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl sm:rounded-full text-xs font-semibold self-stretch sm:self-auto border border-neutral-200/60 dark:border-neutral-700/60">
          <button
            onClick={() => setViewOnlySaved(false)}
            className={`min-h-[44px] flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
              !viewOnlySaved
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>All Roles ({jobs.length})</span>
          </button>
          <button
            onClick={() => setViewOnlySaved(true)}
            className={`min-h-[44px] flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
              viewOnlySaved
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedJobIds.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <JobFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        totalResults={displayedJobs.length}
      />

      {/* Listings Grid: 2 generous columns with breathing room */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex gap-2 pt-3">
                <Skeleton className="h-9 flex-1 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : displayedJobs.length === 0 ? (
        <Card className="p-8 sm:p-16 text-center border-dashed border-2 border-neutral-300 dark:border-neutral-800 space-y-3">
          <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
            <Frown className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            {viewOnlySaved
              ? 'No bookmarked jobs yet'
              : 'No matching startup jobs found'}
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
            {viewOnlySaved
              ? 'Bookmark interesting jobs by clicking the bookmark icon on any listing card to access them here.'
              : 'Try clearing your search query or selecting "All Locations" and "All Roles".'}
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full shadow-xs transition-colors hover:opacity-90"
          >
            Reset All Filters
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onViewDetails={handleOpenDrawer}
            />
          ))}
        </div>
      )}

      {/* Detailed Modal Drawer */}
      <JobDetailDrawer
        job={selectedJob}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};
