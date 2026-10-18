export type ApplicationStage = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  salaryText: string;
  stage: ApplicationStage;
  dateAdded: string; // ISO date
  updatedAt: string;
  notes?: string;
  interviewDate?: string;
  matchScore: number;
  contactPerson?: string;
}

export interface TrackerColumn {
  id: ApplicationStage;
  title: string;
  color: string;
  badgeBg: string;
}
