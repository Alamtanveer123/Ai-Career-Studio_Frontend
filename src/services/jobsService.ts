import { Job, JobFilterParams } from '../types/job';
import { SAMPLE_JOBS } from '../data/sampleJobs';
import { deriveMatchScore } from '../utils/formatters';
import { apiClient } from './apiClient';

const delay = (ms: number = 80) => new Promise((resolve) => setTimeout(resolve, ms));

export const jobsService = {
  /**
   * Fetch jobs: connects to backend if configured, otherwise filters local database
   */
  async getJobs(filters?: JobFilterParams): Promise<Job[]> {
    let fallbackResults = SAMPLE_JOBS.map((job) => ({
      ...job,
      matchScore: deriveMatchScore(job.id, job.matchScore),
    }));

    if (filters) {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        fallbackResults = fallbackResults.filter(
          (job) =>
            job.title.toLowerCase().includes(q) ||
            job.company.toLowerCase().includes(q) ||
            job.skills.some((s) => s.toLowerCase().includes(q)) ||
            job.description.toLowerCase().includes(q)
        );
      }

      if (filters.role && filters.role !== 'All Roles') {
        fallbackResults = fallbackResults.filter(
          (job) =>
            job.category.toLowerCase() === filters.role?.toLowerCase() ||
            job.title.toLowerCase().includes(filters.role!.toLowerCase())
        );
      }

      if (filters.location && filters.location !== 'All Locations') {
        fallbackResults = fallbackResults.filter((job) =>
          job.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters.experience && filters.experience !== 'All Levels') {
        fallbackResults = fallbackResults.filter((job) => job.experienceLevel === filters.experience);
      }

      if (filters.jobType && filters.jobType !== 'All Types') {
        fallbackResults = fallbackResults.filter((job) => job.jobType === filters.jobType);
      }

      if (typeof filters.minSalaryLpa === 'number' && filters.minSalaryLpa > 0) {
        fallbackResults = fallbackResults.filter((job) => job.salaryMaxLpa >= filters.minSalaryLpa!);
      }
    }

    // Try backend endpoint first; fall back to local computation if backend is not running
    try {
      const queryParams = new URLSearchParams();
      if (filters?.searchQuery) queryParams.set('q', filters.searchQuery);
      if (filters?.role && filters.role !== 'All Roles') queryParams.set('role', filters.role);
      if (filters?.location && filters.location !== 'All Locations') queryParams.set('location', filters.location);
      if (filters?.minSalaryLpa) queryParams.set('min_salary', String(filters.minSalaryLpa));
      
      const endpoint = `/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await apiClient.get<Job[]>(endpoint, fallbackResults);
    } catch {
      await delay(80);
      return fallbackResults;
    }
  },

  /**
   * Get job by ID
   */
  async getJobById(id: string): Promise<Job | null> {
    const fallbackJob = SAMPLE_JOBS.find((j) => j.id === id);
    const enriched = fallbackJob
      ? { ...fallbackJob, matchScore: deriveMatchScore(fallbackJob.id, fallbackJob.matchScore) }
      : null;

    return await apiClient.get<Job | null>(`/jobs/${id}`, enriched);
  },

  /**
   * Get recommended jobs (highest match score)
   */
  async getRecommendedJobs(limit: number = 4): Promise<Job[]> {
    const all = await this.getJobs();
    return all.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
  },
};

