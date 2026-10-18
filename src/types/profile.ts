export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  headline: string;
  targetRole: string;
  preferredLocations: string[];
  minSalaryLpa: number;
  experienceYears: number;
  skills: string[];
  resumeText?: string;
  lastResumeUploadDate?: string;
  profileCompletenessPercentage: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'saved' | 'applied' | 'interview' | 'resume' | 'practice';
  linkTo?: string;
}
