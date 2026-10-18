import { DifficultyLevel, InterviewFeedback, InterviewQuestion } from '../types/interview';
import { SAMPLE_QUESTIONS } from '../data/interviewQuestions';

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const interviewService = {
  /**
   * Fetch questions filtered by role, difficulty, or category
   */
  async getQuestions(role?: string, difficulty?: DifficultyLevel): Promise<InterviewQuestion[]> {
    await delay(100);
    let list = [...SAMPLE_QUESTIONS];
    if (role && role !== 'All Roles') {
      list = list.filter((q) => q.role.toLowerCase() === role.toLowerCase());
    }
    if (difficulty) {
      list = list.filter((q) => q.difficulty === difficulty);
    }
    return list.length > 0 ? list : SAMPLE_QUESTIONS;
  },

  /**
   * Mock AI evaluation of the candidate's answer
   */
  async evaluateAnswer(
    question: InterviewQuestion,
    answer: string,
    timeSpentSeconds: number
  ): Promise<InterviewFeedback> {
    await delay(700);

    const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
    const lowerAnswer = answer.toLowerCase();

    // Check how many evaluation criteria are covered
    let criteriaMatched = 0;
    question.keyEvaluationCriteria.forEach((crit) => {
      const words = crit.toLowerCase().split(/\s+/).slice(0, 3);
      if (words.some((w) => lowerAnswer.includes(w))) {
        criteriaMatched++;
      }
    });

    const isWellPaced = timeSpentSeconds >= 35 && timeSpentSeconds <= 300;
    const isAdequateLength = wordCount >= 60;

    let clarityScore = isAdequateLength
      ? Math.min(95, (isWellPaced ? 75 : 65) + Math.round(Math.random() * 20))
      : 55;
    let structureScore = lowerAnswer.includes('first') || lowerAnswer.includes('because') || lowerAnswer.includes('example') || lowerAnswer.includes('however')
      ? Math.min(96, 78 + Math.round(Math.random() * 16))
      : 64;
    let relevanceScore = Math.min(95, 60 + criteriaMatched * 10 + (isAdequateLength ? 10 : 0));

    const overallScore = Math.round((clarityScore + structureScore + relevanceScore) / 3);

    const critique = wordCount < 50
      ? 'Your response was too brief. In a real technical interview, articulate your problem decomposition, the trade-offs considered, and specific tooling.'
      : overallScore > 85
      ? 'Impressive, well-rounded technical articulation. You demonstrated clear ownership, referenced appropriate architecture primitives, and addressed trade-offs.'
      : 'Solid foundational response. To stand out, delve deeper into edge cases, production failure modes, and metrics you would monitor.';

    const actionableTips: string[] = [
      'Structure longer responses using the Problem-Action-Result (PAR) framework.',
      `Mention specific metrics or trade-offs (e.g. latency vs memory, complexity vs speed).`,
      timeSpentSeconds < 45 ? 'Take a moment to organize your thoughts before concluding your response.' : 'Pacing was natural and gave adequate time to flesh out key ideas.'
    ];

    const suggestedAnswerPoints = [
      ...question.keyEvaluationCriteria,
      'Proactively highlight how you verify correctness via automated unit/integration tests.'
    ];

    return {
      clarityScore,
      structureScore,
      relevanceScore,
      overallScore,
      critique,
      actionableTips,
      suggestedAnswerPoints,
    };
  },
};
