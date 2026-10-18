import React, { useState } from 'react';
import { InterviewQuestion } from '../../types/interview';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle, Headphones } from 'lucide-react';

interface QuestionCardProps {
  question?: InterviewQuestion;
  currentIndex: number;
  totalQuestions: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
}) => {
  const [showHints, setShowHints] = useState(false);

  if (!question) {
    return (
      <Card className="p-6 border-slate-200/90 dark:border-slate-800 text-center py-12">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No interview questions available for the selected filters.
        </p>
      </Card>
    );
  }

  const getCategoryVariant = (cat?: string) => {
    switch (cat) {
      case 'Technical':
        return 'primary';
      case 'Behavioral':
        return 'warning';
      case 'HR':
        return 'success';
      default:
        return 'neutral';
    }
  };

  return (
    <Card className="p-6 border-slate-200/90 dark:border-slate-800 space-y-4">
      {/* Question metadata & category */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Headphones className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Question {totalQuestions > 0 ? currentIndex + 1 : 0} of {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {question.category && (
            <Badge variant={getCategoryVariant(question.category)} size="sm">
              {question.category}
            </Badge>
          )}
          {question.difficulty && (
            <Badge variant="outline" size="sm">
              {question.difficulty}
            </Badge>
          )}
          {question.role && (
            <span className="text-xs text-slate-400 font-medium">
              {question.role}
            </span>
          )}
        </div>
      </div>

      {/* Main Question Text */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
        &ldquo;{question.question || 'No question prompt available.'}&rdquo;
      </h3>

      {/* Expandable Hint / Prep Criteria */}
      <div className="pt-1">
        <button
          onClick={() => setShowHints(!showHints)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showHints ? 'Hide Interviewer Tips & Context' : 'Show Interviewer Tips & Hints'}</span>
          {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showHints && (
          <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2.5 animate-slide-up">
            {question.contextHint && (
              <div>
                <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
                  Interviewer Context Hint:
                </strong>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {question.contextHint}
                </p>
              </div>
            )}

            <div>
              <strong className="text-slate-800 dark:text-slate-200 block mb-1">
                What Evaluators Listen For:
              </strong>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                {question.keyEvaluationCriteria.map((crit, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
