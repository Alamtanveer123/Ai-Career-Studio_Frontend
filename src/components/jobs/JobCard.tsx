import React, { useState } from 'react';
import { Job } from '../../types/job';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import {
  Bookmark,
  MapPin,
  IndianRupee,
  Sparkles,
  Check,
  Building2,
  ArrowUpRight,
  Send,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatLpa, getScoreColorClass } from '../../utils/formatters';
import { QuickApplyModal } from './QuickApplyModal';


interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  const { savedJobIds, toggleSaveJob, applications } = useAppStore();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const isSaved = savedJobIds.includes(job.id);
  const trackedApp = applications.find((a) => a.jobId === job.id);
  const isApplied = !!trackedApp;
  const scoreStyle = getScoreColorClass(job.matchScore);

  // Generate consistent company avatar initials
  const initials = job.company
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <>
      <Card className="p-6 flex flex-col justify-between hover:shadow-card-hover transition-all duration-200 border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 group">
        <div>
          {/* Top Header: Company Avatar, Name, Location & Match Score */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              {/* Company Logo / Avatar */}
              <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-800 dark:text-neutral-200 shrink-0 shadow-2xs group-hover:border-neutral-400 dark:group-hover:border-neutral-600 transition-colors">
                {initials || <Building2 className="w-5 h-5" />}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 truncate">
                    {job.company}
                  </span>
                  {job.isFeatured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                      Featured
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => onViewDetails(job)}
                  className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-brand-500 transition-colors cursor-pointer leading-snug line-clamp-1 mt-0.5"
                  title={job.title}
                >
                  {job.title}
                </h3>
              </div>
            </div>

            {/* Match Score Badge */}
            <div
              className={`shrink-0 px-2.5 py-1 rounded-full border text-xs font-bold flex items-center gap-1 shadow-2xs ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}
              title="Estimated ATS match based on your skills"
            >
              <Sparkles className="w-3 h-3" />
              <span>{job.matchScore}% Match</span>
            </div>
          </div>

          {/* Key Metadata: Salary, Equity, Location, Experience */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-xs">
            <span className="flex items-center gap-1 font-bold text-neutral-900 dark:text-white">
              <IndianRupee className="w-3.5 h-3.5 text-neutral-400" />
              <span>{formatLpa(job.salaryMinLpa, job.salaryMaxLpa)}</span>
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">&bull;</span>
            <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium text-[11px]">
              0.1% – 0.5% Equity
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">&bull;</span>
            <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{job.location}</span>
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">&bull;</span>
            <span className="text-neutral-500 dark:text-neutral-400">
              {job.experienceLevel}
            </span>
          </div>

          {/* Job Description Snippet */}
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3 line-clamp-2 leading-relaxed">
            {job.description}
          </p>

          {/* Skills Chips */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {job.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 text-xs rounded-full bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-800 dark:hover:bg-neutral-700/70 text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[11px] text-neutral-400 self-center font-medium">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions: Save, View Details, Apply */}
        <div className="pt-5 mt-5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            <button
              onClick={() => toggleSaveJob(job.id)}
              className={`p-2 rounded-full border transition-all ${
                isSaved
                  ? 'border-brand-300 bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:border-brand-800 dark:text-brand-400'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              title={isSaved ? 'Saved to bookmarks' : 'Save job'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {/* View Details */}
            <button
              onClick={() => onViewDetails(job)}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white px-2 py-1 transition-colors flex items-center gap-1"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Apply Button */}
          {isApplied ? (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-xs font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>Applied</span>
            </div>
          ) : (
            <Button
              size="sm"
              variant="coral"
              onClick={() => setIsApplyModalOpen(true)}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Quick Apply
            </Button>
          )}
        </div>
      </Card>

      {/* Quick Apply Modal */}
      <QuickApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </>
  );
};

