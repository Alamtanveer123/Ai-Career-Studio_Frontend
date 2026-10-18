import React, { useState } from 'react';
import { Job } from '../../types/job';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAppStore } from '../../store/useAppStore';
import {
  FileText,
  CheckCircle2,
  Send,
} from 'lucide-react';

import { formatLpa } from '../../utils/formatters';

interface QuickApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickApplyModal: React.FC<QuickApplyModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  const { profile, addApplicationFromJob, resumeAnalysis } = useAppStore();
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate real application dispatch
    setTimeout(() => {
      addApplicationFromJob(job, 'applied', note.trim() || undefined);
      setIsSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setNote('');
        onClose();
      }, 1200);
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Apply"
      description={`Submit your application directly to ${job.company}`}
    >
      {submitted ? (
        <div className="py-8 text-center space-y-3 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-neutral-900 dark:text-white">
            Application Submitted!
          </h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Your profile and resume have been dispatched to the recruiting team at {job.company}. Track updates in your Applications board.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job summary card */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/80 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {job.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {job.company}
                  </span>
                  <span>&bull;</span>
                  <span>{job.location}</span>
                </div>
              </div>
              <div className="text-xs font-bold text-neutral-900 dark:text-white">
                {formatLpa(job.salaryMinLpa, job.salaryMaxLpa)}
              </div>
            </div>
          </div>

          {/* Candidate Profile attached */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
              Candidate Profile
            </label>
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                  {profile.name}
                </p>
                <p className="text-[11px] text-neutral-500">{profile.email}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-medium bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-full">
                <FileText className="w-3.5 h-3.5" />
                <span>
                  {resumeAnalysis ? `ATS Score ${resumeAnalysis.overallScore}%` : 'Resume Attached'}
                </span>
              </div>
            </div>
          </div>

          {/* Optional Note to Recruiter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
              Note to Hiring Manager (Optional)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Briefly state why you're a great fit for this role or highlight key projects..."
              className="w-full p-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-neutral-900 dark:text-white leading-relaxed resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="coral"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Submit Application
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
