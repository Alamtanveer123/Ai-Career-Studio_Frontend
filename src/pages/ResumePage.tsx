import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { ResumeUpload } from '../components/resume/ResumeUpload';
import { CircularScore } from '../components/resume/CircularScore';
import { MissingSkillsGroup } from '../components/resume/MissingSkillsGroup';
import { AnalysisFeedback } from '../components/resume/AnalysisFeedback';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Sparkles, ArrowRight, CheckCircle2, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResumePage: React.FC = () => {
  const { resumeAnalysis, clearResumeAnalysis } = useAppStore();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            AI Resume Intelligence &amp; ATS Scoring
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Evaluate your resume against top tech hiring standards with instant keyword matching, impact scoring, and role-specific suggestions.
          </p>
        </div>

        {resumeAnalysis && (
          <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={clearResumeAnalysis}
              className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              Reset &amp; Delete Resume
            </Button>
            <Link to="/jobs" className="w-full sm:w-auto">
              <Button size="sm" variant="outline" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Explore Matched Jobs
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Two Column Layout: Left Input / Right Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload / Paste */}
        <div className="lg:col-span-5 space-y-6">
          <ResumeUpload />

          {/* ATS Optimization Guide */}
          <Card className="p-6 border-neutral-200/90 dark:border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>ATS Optimization Guide for Tech</span>
            </h4>
            <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Use Standard Headings:</strong> Summary, Core Skills, Work Experience, Education.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Quantify Impact:</strong> e.g., &ldquo;Reduced bundle size by 38%&rdquo;, &ldquo;Scaled to 100k active users&rdquo;.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Explicit Tech Keywords:</strong> Mention exact frameworks like React, TypeScript, Docker instead of generic phrases.</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Right Column: Score & Detailed Feedback */}
        <div className="lg:col-span-7 space-y-6">
          {resumeAnalysis ? (
            <>
              {/* Score Header Card */}
              <Card className="p-8 border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-card">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex-1 text-center sm:text-left space-y-2.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
                      <Target className="w-3.5 h-3.5" />
                      <span>Target Role: {resumeAnalysis.detectedRoleTarget}</span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
                      Resume Evaluation Report
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Scored against 20+ keyword signals, action verbs, and startup engineering benchmarks.
                    </p>

                    <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-3 text-xs font-medium text-neutral-500">
                      <span className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {resumeAnalysis.extractedWordCount} words parsed
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {resumeAnalysis.matchedSkills.length} skills matched
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {resumeAnalysis.missingSkills.length} gaps to address
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <CircularScore score={resumeAnalysis.overallScore} size={150} />
                  </div>
                </div>
              </Card>

              {/* Missing Skills Chips (Add to Profile) */}
              <MissingSkillsGroup
                missingSkills={resumeAnalysis.missingSkills}
                matchedSkills={resumeAnalysis.matchedSkills}
              />

              {/* Strengths, Weaknesses, Suggestions */}
              <AnalysisFeedback analysis={resumeAnalysis} />
            </>
          ) : (
            <Card className="p-8 sm:p-16 text-center border-dashed border-2 border-neutral-300 dark:border-neutral-800">
              <Sparkles className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                No Resume Analyzed Yet
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Paste your resume on the left and click &ldquo;Analyze Resume with AI&rdquo; to generate your ATS score and feedback report.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
