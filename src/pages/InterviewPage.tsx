import React, { useState, useEffect } from 'react';
import { InterviewQuestion, DifficultyLevel, InterviewFeedback, InterviewSession } from '../types/interview';
import { SAMPLE_QUESTIONS } from '../data/interviewQuestions';
import { interviewService } from '../services/interviewService';
import { QuestionCard } from '../components/interview/QuestionCard';
import { AnswerTimer } from '../components/interview/AnswerTimer';
import { FeedbackModal } from '../components/interview/FeedbackModal';
import { SessionHistory } from '../components/interview/SessionHistory';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Sparkles, SkipForward, ChevronRight, PenTool } from 'lucide-react';

import { useAppStore } from '../store/useAppStore';

const SAMPLE_ANSWERS: Record<string, string> = {
  'q-1': `In React 18 and 19, concurrent rendering transforms how updates are prioritized. Instead of synchronously blocking the main thread during large renders, React chops the fiber work into small interruptible units.

Using useTransition, we can distinguish between urgent updates (like typing in a search bar or clicking buttons) and non-urgent transitions (like filtering a 10,000-row table). When wrapped in startTransition, React allows immediate keystroke feedback while deferring the heavy reconciliation in the background.

Meanwhile, useDeferredValue creates a deferred clone of a value, letting secondary components lag behind high-priority inputs naturally. This prevents frame drops and UI freezes without needing manual debounce timeouts.`,

  'q-4': `To build a distributed idempotency mechanism in microservices:
First, each client generates a unique idempotency key (UUIDv4) in the 'X-Idempotency-Key' HTTP header.
When the payment gateway receives the request, it executes an atomic SETNX in Redis with a short TTL (e.g. 120s) to acquire an execution lock. If the key already exists in 'IN_PROGRESS' state, we immediately return HTTP 409 or 425 to prevent race conditions.

Next, within the database transaction, we persist the idempotency record with a unique constraint. After the transaction commits, we cache the final payment response JSON in Redis keyed by the idempotency token for 24 hours. Any duplicate replay safely receives the cached 200 OK without re-charging the customer.`,
};

export const InterviewPage: React.FC = () => {
  const { interviewSessions, addInterviewSession, addToast } = useAppStore();

  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Mid-Level');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [filteredQuestions, setFilteredQuestions] = useState<InterviewQuestion[]>(SAMPLE_QUESTIONS);

  // Practice state
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState<InterviewFeedback | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Load questions when filter changes
  useEffect(() => {
    let list = [...SAMPLE_QUESTIONS];
    if (selectedRole !== 'All Roles') {
      list = list.filter((q) => q.role.toLowerCase() === selectedRole.toLowerCase());
    }
    list = list.filter((q) => q.difficulty === selectedDifficulty);
    setFilteredQuestions(list.length > 0 ? list : SAMPLE_QUESTIONS);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setTimerSeconds(0);
    setIsTimerRunning(true);
  }, [selectedRole, selectedDifficulty]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const currentQuestion: InterviewQuestion | undefined = filteredQuestions[currentQuestionIndex] || filteredQuestions[0] || SAMPLE_QUESTIONS[0];

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) {
      addToast('No Question Selected', 'Please select a valid question to practice.', 'error');
      return;
    }

    if (!userAnswer.trim()) {
      addToast('Answer Required', 'Please type or load your response before submitting.', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      setIsTimerRunning(false);

      const feedback = await interviewService.evaluateAnswer(
        currentQuestion,
        userAnswer,
        timerSeconds
      );

      const session: InterviewSession = {
        id: `sess-${Date.now()}`,
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        role: currentQuestion.role,
        difficulty: currentQuestion.difficulty,
        category: currentQuestion.category,
        userAnswer,
        timeSpentSeconds: timerSeconds,
        feedback,
        createdAt: new Date().toISOString(),
      };

      addInterviewSession(session);
      setActiveFeedback(feedback);
      setIsFeedbackModalOpen(true);
    } catch (err) {
      console.error(err);
      addToast('Evaluation Error', 'Failed to generate feedback.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (filteredQuestions.length === 0) return;
    const nextIdx = (currentQuestionIndex + 1) % filteredQuestions.length;
    setCurrentQuestionIndex(nextIdx);
    setUserAnswer('');
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  const handleLoadSampleAnswer = () => {
    const questionId = currentQuestion?.id || '';
    const sample = (questionId && SAMPLE_ANSWERS[questionId]) ||
      `In my previous projects, I tackled this by decomposing the system into clear architectural responsibilities. First, I ensured data integrity and schema validation. Second, I introduced caching and asynchronous queues to avoid bottlenecking the primary database. Finally, we measured outcomes through automated integration tests and Datadog latency metrics.`;
    setUserAnswer(sample);
    setTimerSeconds(65);
    addToast('Sample Answer Loaded', 'You can now submit for AI scoring.', 'info');
  };

  const handleReviewPastSession = (session: InterviewSession) => {
    setActiveFeedback(session.feedback);
    setIsFeedbackModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            AI Mock Interview Practice
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Practice real startup technical, system design, and behavioral interview questions with instant AI scoring.
          </p>
        </div>

        {/* Role & Difficulty Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="py-2 px-3 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All Roles">All Tech Tracks</option>
            <option value="Frontend Engineering">Frontend</option>
            <option value="Backend Engineering">Backend</option>
            <option value="Full Stack Engineering">Full Stack</option>
            <option value="AI / Machine Learning">AI / ML</option>
            <option value="DevOps & Cloud">DevOps</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel)}
            className="py-2 px-3 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="Junior">Junior Level</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior Level</option>
          </select>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Practice Question & Answer Area */}
        <div className="lg:col-span-8 space-y-6">

          {/* Question Card */}
          <QuestionCard
            question={currentQuestion}
            currentIndex={currentQuestionIndex}
            totalQuestions={filteredQuestions.length}
          />

          {/* Answer Workspace Card */}
          <Card className="p-6 border-slate-200/90 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Your Response
                </h4>
                <span className="text-xs text-slate-400">
                  ({userAnswer.trim().split(/\s+/).filter(Boolean).length} words)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLoadSampleAnswer}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                >
                  Load Sample Answer
                </button>

                <AnswerTimer
                  isRunning={isTimerRunning}
                  onToggle={() => setIsTimerRunning(!isTimerRunning)}
                  onReset={() => setTimerSeconds(0)}
                  seconds={timerSeconds}
                />
              </div>
            </div>

            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              rows={9}
              placeholder="Structure your answer clearly:
1. High-level approach or concept definition
2. Trade-offs and engineering choices considered
3. Real-world implementation details & testing..."
              className="w-full p-4 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-slate-800 dark:text-slate-200 leading-relaxed resize-y font-sans"
            />

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-medium transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Skip to Next Question ({currentQuestionIndex + 1}/{filteredQuestions.length})</span>
              </button>

              <Button
                size="md"
                variant="coral"
                onClick={handleSubmitAnswer}
                isLoading={isSubmitting}
                leftIcon={<Sparkles className="w-4 h-4" />}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Submit for AI Evaluation
              </Button>

            </div>
          </Card>
        </div>

        {/* Right Column: Tips & Session History */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Guide Card */}
          <Card className="p-5 border-slate-200/90 dark:border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>STAR Method Guide</span>
            </h4>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong className="text-slate-800 dark:text-slate-200">S (Situation):</strong> Set context in 1-2 concise sentences.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">T (Task):</strong> Explain the exact engineering challenge or bottleneck.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">A (Action):</strong> Articulate your specific tools, design patterns, and decisions.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">R (Result):</strong> Quantify your impact (latency, throughput, cost).
              </p>
            </div>
          </Card>

          {/* Past Sessions History */}
          <SessionHistory
            sessions={interviewSessions}
            onSelectSession={handleReviewPastSession}
          />
        </div>
      </div>

      {/* AI Evaluation Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        feedback={activeFeedback}
        questionText={currentQuestion?.question || ''}
        onNextQuestion={handleNextQuestion}
      />
    </div>
  );
};
