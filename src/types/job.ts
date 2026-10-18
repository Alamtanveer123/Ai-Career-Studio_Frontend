export type IndianLocation =
  | 'Bengaluru'
  | 'Hyderabad'
  | 'Pune'
  | 'Delhi NCR'
  | 'Mumbai'
  | 'Chennai'
  | 'Remote (India)';

export type ExperienceLevel =
  | 'Fresher (0-1 yrs)'
  | 'Junior (1-3 yrs)'
  | 'Mid-Level (3-5 yrs)'
  | 'Senior (5-8 yrs)'
  | 'Lead / Architect (8+ yrs)';

export type JobType = 'Full-time' | 'Contract' | 'Internship' | 'Remote';

export type JobCategory =
  | 'Frontend Engineering'
  | 'Backend Engineering'
  | 'Full Stack Engineering'
  | 'AI / Machine Learning'
  | 'DevOps & Cloud'
  | 'Product & Design'
  | 'Mobile Development';

export interface Job {
  id: string;
  title: string;
  company: string; // Fictional company names only
  companyTagline?: string;
  location: IndianLocation;
  experienceLevel: ExperienceLevel;
  jobType: JobType;
  category: JobCategory;
  salaryMinLpa: number; // e.g., 14 (Lakhs Per Annum)
  salaryMaxLpa: number; // e.g., 28
  postedDate: string; // ISO string or relative label
  skills: string[];
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  matchScore: number; // 0-100%
  isFeatured?: boolean;
}

export interface JobFilterParams {
  role?: string;
  location?: string;
  experience?: string;
  jobType?: string;
  minSalaryLpa?: number;
  searchQuery?: string;
}
