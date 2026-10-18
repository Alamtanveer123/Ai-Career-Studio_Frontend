import { Application, ApplicationStage } from '../types/application';
import { deriveMatchScore, formatLpa } from '../utils/formatters';
import { Job } from '../types/job';
import { apiClient } from './apiClient';

export const trackerService = {
  /**
   * Helper to convert a Job into an initial Application entry
   */
  createApplicationFromJob(job: Job, stage: ApplicationStage = 'applied'): Application {
    return {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      salaryText: formatLpa(job.salaryMinLpa, job.salaryMaxLpa),
      stage,
      dateAdded: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      matchScore: deriveMatchScore(job.id, job.matchScore),
      notes: `Applied via Career Platform.`,
    };
  },

  async getApplications(fallback: Application[]): Promise<Application[]> {
    return await apiClient.get<Application[]>('/applications', fallback);
  },

  async syncApplication(app: Application): Promise<Application> {
    return await apiClient.post<Application>('/applications', app, app);
  },

  async updateApplication(id: string, updates: Partial<Application>): Promise<void> {
    await apiClient.put(`/applications/${id}`, updates, null);
  },

  async deleteApplication(id: string): Promise<void> {
    await apiClient.delete(`/applications/${id}`, null);
  },
};

