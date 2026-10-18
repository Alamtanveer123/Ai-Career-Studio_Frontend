import React from 'react';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import { InterviewFeedback } from '../../types/interview';
import { Sparkles, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import { CircularScore } from '../resume/CircularScore';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: InterviewFeedback | null;
  questionText: string;
  onNextQuestion?: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  feedback,
  questionText,
  onNextQuestion,
}) => {
  if (!feedback) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Evaluation Complete</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Mock Response Evaluation
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 italic">
              &ldquo;{questionText}&rdquo;
            </p>
          </div>

          <div className="shrink-0">
            <CircularScore
              score={feedback.overallScore}
              size={110}
              strokeWidth={8}
              label="Overall"
              sublabel="Response Rating"
            />
          </div>
        </div>

        {/* 3 Metrics: Clarity, Structure, Relevance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">Clarity</span>
              <span className="text-slate-900 dark:text-white">{feedback.clarityScore}%</span>
            </div>
            <ProgressBar value={feedback.clarityScore} color="bg-brand-600" />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">Structure (PAR)</span>
              <span className="text-slate-900 dark:text-white">{feedback.structureScore}%</span>
            </div>
            <ProgressBar value={feedback.structureScore} color="bg-indigo-600" />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">Technical Depth</span>
              <span className="text-slate-900 dark:text-white">{feedback.relevanceScore}%</span>
            </div>
            <ProgressBar value={feedback.relevanceScore} color="bg-emerald-600" />
          </div>
        </div>

        {/* Evaluator Critique */}
        <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/80 dark:border-brand-900/40 space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300">
            Senior Interviewer Assessment
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {feedback.critique}
          </p>
        </div>

        {/* Actionable Tips */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Actionable Interview Tips</span>
          </h4>
          <ul className="space-y-2">
            {feedback.actionableTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Key Talking Points */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Key Criteria &amp; Model Points</span>
          </h4>
          <ul className="space-y-2">
            {feedback.suggestedAnswerPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close Report
          </Button>

          {onNextQuestion && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                onClose();
                onNextQuestion();
              }}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Next Practice Question
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
