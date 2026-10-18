export type QuestionCategory = 'Technical' | 'Behavioral' | 'HR';
export type DifficultyLevel = 'Junior' | 'Mid-Level' | 'Senior';

export interface InterviewQuestion {
  id: string;
  role: string;
  difficulty: DifficultyLevel;
  category: QuestionCategory;
  question: string;
  contextHint?: string;
  keyEvaluationCriteria: string[];
}

export interface InterviewFeedback {
  clarityScore: number;    // 0 - 100
  structureScore: number;  // 0 - 100
  relevanceScore: number;  // 0 - 100
  overallScore: number;    // 0 - 100
  critique: string;
  actionableTips: string[];
  suggestedAnswerPoints: string[];
}

export interface InterviewSession {
  id: string;
  questionId: string;
  question: string;
  role: string;
  difficulty: DifficultyLevel;
  category: QuestionCategory;
  userAnswer: string;
  timeSpentSeconds: number;
  feedback: InterviewFeedback;
  createdAt: string;
}
