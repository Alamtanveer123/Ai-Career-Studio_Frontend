import React from 'react';
import { Job } from '../../types/job';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  Sparkles,
  Bookmark,
  Check,
  CheckCircle2,
  ShieldCheck,
  Gift,
} from 'lucide-react';

import { useAppStore } from '../../store/useAppStore';
import { formatLpa, formatRelativeTime, getScoreColorClass } from '../../utils/formatters';

interface JobDetailDrawerProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobDetailDrawer: React.FC<JobDetailDrawerProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  const { savedJobIds, toggleSaveJob, applications, addApplicationFromJob } = useAppStore();

  if (!job) return null;

  const isSaved = savedJobIds.includes(job.id);
  const trackedApp = applications.find((a) => a.jobId === job.id);
  const isTracked = !!trackedApp;
  const scoreStyle = getScoreColorClass(job.matchScore);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
        {/* Header Info */}
        <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </span>
                <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  {job.company}
                </span>
                <span className="text-[11px] text-neutral-400">&bull; Verified Employer</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {job.title}
              </h2>
              {job.companyTagline && (
                <p className="text-xs text-slate-500 italic">
                  &ldquo;{job.companyTagline}&rdquo;
                </p>
              )}
            </div>

            {/* Match Score */}
            <div
              className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-xs ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{job.matchScore}% Match</span>
            </div>
          </div>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {job.location}
            </span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
              <IndianRupee className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              {formatLpa(job.salaryMinLpa, job.salaryMaxLpa)}
            </span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              {job.experienceLevel}
            </span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-slate-500 text-[11px]">
              Posted {formatRelativeTime(job.postedDate)}
            </span>
          </div>
        </div>

        {/* Required Skills */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Target Skill Stack
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="secondary" size="md">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* About the Role */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            About the Role
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Key Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Key Responsibilities</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Requirements &amp; Qualifications</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefits & Perks */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-purple-600" />
              <span>Perks &amp; Benefits</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {job.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sticky Actions in Drawer */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              size="md"
              variant={isSaved ? 'secondary' : 'outline'}
              onClick={() => toggleSaveJob(job.id)}
              leftIcon={
                <Bookmark
                  className={`w-4 h-4 ${isSaved ? 'fill-current text-brand-500' : ''}`}
                />
              }
              className="w-full sm:w-auto"
            >
              {isSaved ? 'Bookmarked' : 'Save Job'}
            </Button>

            <Button
              size="md"
              variant="coral"
              onClick={() => {
                addApplicationFromJob(job, 'applied');
                onClose();
              }}
              leftIcon={
                isTracked ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )
              }
              className="w-full sm:flex-1"
            >
              {isTracked ? `Applied (${trackedApp.stage.toUpperCase()})` : 'Quick Apply Now'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

