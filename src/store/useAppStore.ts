import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Application, ApplicationStage } from '../types/application';
import { Job } from '../types/job';
import { ResumeAnalysis } from '../types/resume';
import { InterviewSession } from '../types/interview';
import { UserProfile, ActivityItem } from '../types/profile';
import { deriveMatchScore, formatLpa } from '../utils/formatters';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}

interface AppState {
  // User Profile
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Saved Jobs
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => boolean; // returns true if now saved, false if unsaved

  // Applications Tracker (Kanban)
  applications: Application[];
  addApplicationFromJob: (job: Job, stage?: ApplicationStage, note?: string) => { added: boolean; isExisting: boolean; stage: ApplicationStage };
  updateApplicationStage: (applicationId: string, stage: ApplicationStage) => void;
  updateApplicationNotes: (applicationId: string, notes: string) => void;
  updateApplicationInterviewDate: (applicationId: string, date: string) => void;
  removeApplication: (applicationId: string) => void;

  // Resume Analysis
  resumeAnalysis: ResumeAnalysis | null;
  setResumeAnalysis: (analysis: ResumeAnalysis | null) => void;
  clearResumeAnalysis: () => void;

  // Interview Sessions
  interviewSessions: InterviewSession[];
  addInterviewSession: (session: InterviewSession) => void;

  // Recent Activity Feed
  recentActivity: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;

  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Authentication
  isAuthenticated: boolean;
  login: (email: string, name?: string, role?: string) => void;
  logout: () => void;

  // Reset / Seed Demo
  resetToDefaultDemo: () => void;
}


// Empty default profile — will be populated after login / from backend
const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  phone: '',
  headline: '',
  targetRole: '',
  preferredLocations: [],
  minSalaryLpa: 0,
  experienceYears: 0,
  skills: [],
  profileCompletenessPercentage: 0,
};


export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      savedJobIds: [],
      applications: [],
      resumeAnalysis: null,
      interviewSessions: [],
      recentActivity: [],
      isDarkMode: false,
      toasts: [],

      // Authentication
      isAuthenticated: false,

      login: (email: string, name?: string, role?: string) => {
        set({
          isAuthenticated: true,
          // Never merge a new identity with data from an earlier session.
          savedJobIds: [],
          applications: [],
          resumeAnalysis: null,
          interviewSessions: [],
          recentActivity: [],
          profile: {
            ...DEFAULT_PROFILE,
            email,
            name: name || email.split('@')[0],
            targetRole: role || '',
            profileCompletenessPercentage: 20,
          },
        });
        get().addToast('Welcome!', `Logged in as ${name || email}`, 'success');
      },

      logout: () => {
        set({
          isAuthenticated: false,
          profile: DEFAULT_PROFILE,
          savedJobIds: [],
          applications: [],
          resumeAnalysis: null,
          interviewSessions: [],
          recentActivity: [],
        });
        // Clear persisted storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('ai-career-studio-storage-v1');
        get().addToast('Logged Out', 'You have been signed out successfully.', 'info');
      },

      updateProfile: (updates) => {
        set((state) => {
          const newProfile = { ...state.profile, ...updates };
          // Calculate completeness percentage dynamically
          let score = 20; // baseline
          if (newProfile.headline) score += 15;
          if (newProfile.skills.length >= 4) score += 25;
          if (newProfile.preferredLocations.length >= 1) score += 15;
          if (newProfile.targetRole) score += 15;
          if (state.resumeAnalysis) score += 10;
          newProfile.profileCompletenessPercentage = Math.min(100, score);
          return { profile: newProfile };
        });
      },

      toggleSaveJob: (jobId: string) => {
        const { savedJobIds, addActivity, addToast } = get();
        const exists = savedJobIds.includes(jobId);

        if (exists) {
          set({ savedJobIds: savedJobIds.filter((id) => id !== jobId) });
          addToast('Job Removed', `Removed job from your saved list.`, 'info');
          return false;
        } else {
          set({ savedJobIds: [...savedJobIds, jobId] });
          addActivity({
            title: 'Saved Job',
            description: `Saved a job opportunity`,
            type: 'saved',
            linkTo: '/jobs',
          });
          addToast('Job Saved', `Saved job to your bookmarked list.`, 'success');
          return true;
        }
      },

      addApplicationFromJob: (job: Job, stage: ApplicationStage = 'applied', note?: string) => {
        const { applications, addActivity, addToast } = get();
        const existing = applications.find((app) => app.jobId === job.id);

        if (existing) {
          // If already tracked, notify user and bring to that stage
          set({
            applications: applications.map((app) =>
              app.id === existing.id
                ? { ...app, stage, updatedAt: new Date().toISOString() }
                : app
            ),
          });
          addToast(
            'Application Updated',
            `Updated ${job.title} stage to "${stage.toUpperCase()}".`,
            'info'
          );
          return { added: false, isExisting: true, stage };
        }

        const newApp: Application = {
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
          notes: note || `Applied for ${job.title} at ${job.company}.`,
        };

        set({ applications: [newApp, ...applications] });
        addActivity({
          title: stage === 'applied' ? 'Applied to Role' : 'Added to Tracker',
          description: `${job.title} at ${job.company}`,
          type: 'applied',
          linkTo: '/tracker',
        });

        addToast(
          stage === 'applied' ? 'Application Submitted' : 'Added to Pipeline',
          `Successfully applied to ${job.company}! Added to your tracker pipeline.`,
          'success'
        );

        return { added: true, isExisting: false, stage };
      },


      updateApplicationStage: (applicationId: string, stage: ApplicationStage) => {
        set((state) => {
          const app = state.applications.find((a) => a.id === applicationId);
          if (!app) return state;

          const updated = state.applications.map((a) =>
            a.id === applicationId
              ? { ...a, stage, updatedAt: new Date().toISOString() }
              : a
          );

          return {
            applications: updated,
            recentActivity: [
              {
                id: `act-${Date.now()}`,
                title: `Stage Changed: ${stage.toUpperCase()}`,
                description: `${app.jobTitle} moved to ${stage}`,
                timestamp: new Date().toISOString(),
                type: stage === 'interview' ? 'interview' : 'applied',
                linkTo: '/tracker',
              },
              ...state.recentActivity.slice(0, 15),
            ],
          };
        });

        get().addToast('Stage Updated', `Application moved to ${stage.toUpperCase()}`, 'info');
      },

      updateApplicationNotes: (applicationId: string, notes: string) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === applicationId
              ? { ...a, notes, updatedAt: new Date().toISOString() }
              : a
          ),
        }));
      },

      updateApplicationInterviewDate: (applicationId: string, date: string) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === applicationId
              ? { ...a, interviewDate: date, stage: 'interview', updatedAt: new Date().toISOString() }
              : a
          ),
        }));
        get().addToast('Interview Scheduled', 'Interview date logged in tracker.', 'success');
      },

      removeApplication: (applicationId: string) => {
        const app = get().applications.find((a) => a.id === applicationId);
        set((state) => ({
          applications: state.applications.filter((a) => a.id !== applicationId),
        }));
        if (app) {
          get().addToast('Application Removed', `Removed ${app.jobTitle} from tracker.`, 'info');
        }
      },

      setResumeAnalysis: (analysis: ResumeAnalysis | null) => {
        if (!analysis) {
          set({ resumeAnalysis: null });
          return;
        }

        set((state) => ({
          resumeAnalysis: analysis,
          recentActivity: [
            {
              id: `act-${Date.now()}`,
              title: 'Resume Analyzed',
              description: `Score: ${analysis.overallScore}/100 • Target: ${analysis.detectedRoleTarget}`,
              timestamp: new Date().toISOString(),
              type: 'resume',
              linkTo: '/resume',
            },
            ...state.recentActivity.slice(0, 15),
          ],
        }));
        get().addToast('Analysis Complete', `Resume scored ${analysis.overallScore}/100`, 'success');
      },

      clearResumeAnalysis: () => {
        set((state) => ({
          resumeAnalysis: null,
          profile: {
            ...state.profile,
            resumeText: undefined,
            lastResumeUploadDate: undefined,
          },
        }));
        get().addToast('Resume Cleared', 'Uploaded resume and analysis report have been reset.', 'info');
      },

      addInterviewSession: (session: InterviewSession) => {
        set((state) => ({
          interviewSessions: [session, ...state.interviewSessions],
          recentActivity: [
            {
              id: `act-${Date.now()}`,
              title: 'Mock Interview Practiced',
              description: `${session.role} (${session.category}) • Score: ${session.feedback.overallScore}/100`,
              timestamp: new Date().toISOString(),
              type: 'practice',
              linkTo: '/interview',
            },
            ...state.recentActivity.slice(0, 15),
          ],
        }));
        get().addToast('Practice Saved', `Score: ${session.feedback.overallScore}/100! Feedback logged.`, 'success');
      },

      addActivity: (activity) => {
        set((state) => ({
          recentActivity: [
            {
              ...activity,
              id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
              timestamp: new Date().toISOString(),
            },
            ...state.recentActivity.slice(0, 19),
          ],
        }));
      },

      toggleTheme: () => {
        const next = !get().isDarkMode;
        set({ isDarkMode: next });
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setTheme: (dark: boolean) => {
        set({ isDarkMode: dark });
        if (dark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      addToast: (title, message, type = 'info') => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
        set((state) => ({
          toasts: [...state.toasts, { id, title, message, type, timestamp: Date.now() }],
        }));

        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, 4000);
      },

      removeToast: (id: string) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      resetToDefaultDemo: () => {
        set({
          profile: DEFAULT_PROFILE,
          savedJobIds: [],
          applications: [],
          resumeAnalysis: null,
          interviewSessions: [],
          recentActivity: [],
        });
        get().addToast('Data Reset', 'All data has been cleared.', 'info');
      },
    }),
    {
      name: 'ai-career-studio-storage-v1',
      // A device may remember the visual theme, but never another user's data/session.
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);
