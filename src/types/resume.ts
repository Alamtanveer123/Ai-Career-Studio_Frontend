export interface ResumeSectionScores {
  impact: number;      // 0 - 100
  skills: number;      // 0 - 100
  formatting: number;  // 0 - 100
  experience: number;  // 0 - 100
}

export interface ResumeAnalysis {
  id: string;
  analyzedAt: string;
  fileName?: string;
  overallScore: number; // 0 - 100
  sectionScores: ResumeSectionScores;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  missingSkills: string[];
  matchedSkills: string[];
  extractedWordCount: number;
  detectedRoleTarget: string;
}
