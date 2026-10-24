import React, { useState } from 'react';
import { KanbanBoard } from '../components/tracker/KanbanBoard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useAppStore } from '../store/useAppStore';
import {
  Kanban,
  Plus,
  Send,
  Calendar,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApplicationStage } from '../types/application';

export const TrackerPage: React.FC = () => {
  const { applications, addToast } = useAppStore();

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Custom application form state
  const [customRole, setCustomRole] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [customLocation, setCustomLocation] = useState('Bengaluru');
  const [customSalary, setCustomSalary] = useState('₹20 - ₹30 LPA');
  const [customStage, setCustomStage] = useState<ApplicationStage>('applied');
  const [customNotes, setCustomNotes] = useState('');

  const stats = {
    total: applications.length,
    active: applications.filter((a) => a.stage === 'applied' || a.stage === 'interview').length,
    interviews: applications.filter((a) => a.stage === 'interview' || Boolean(a.interviewDate)).length,
    offers: applications.filter((a) => a.stage === 'offer').length,
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRole.trim() || !customCompany.trim()) {
      addToast('Missing Info', 'Please provide both role and company name.', 'warning');
      return;
    }

    const { applications } = useAppStore.getState();
    const newApp = {
      id: `custom-${Date.now()}`,
      jobId: `custom-job-${Date.now()}`,
      jobTitle: customRole.trim(),
      company: customCompany.trim(),
      location: customLocation,
      salaryText: customSalary,
      stage: customStage,
      dateAdded: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      matchScore: 88,
      notes: customNotes.trim() || 'Custom tracked application.',
    };

    useAppStore.setState({ applications: [newApp, ...applications] });
    addToast('Opportunity Tracked', `Added ${customRole} at ${customCompany}`, 'success');
    setIsCustomModalOpen(false);

    // Reset form
    setCustomRole('');
    setCustomCompany('');
    setCustomNotes('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Application Pipeline
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Manage your opportunities, schedule interview rounds, and track your offers across stages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <Button
            size="sm"
            variant="coral"
            onClick={() => setIsCustomModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Opportunity
          </Button>
          <Link to="/jobs">
            <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Find Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Pipeline Metric Cards: 1 col on small mobile, 2 col on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 flex items-center gap-3.5 border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0">
            <Kanban className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white leading-tight">
              {stats.total}
            </div>
            <div className="text-xs font-medium text-neutral-500">Total Tracked</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5 border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 leading-tight">
              {stats.active}
            </div>
            <div className="text-xs font-medium text-neutral-500">Active Pipeline</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5 border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 leading-tight">
              {stats.interviews}
            </div>
            <div className="text-xs font-medium text-neutral-500">Interviews</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5 border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-tight">
              {stats.offers}
            </div>
            <div className="text-xs font-medium text-neutral-500">Job Offers</div>
          </div>
        </Card>
      </div>

      {/* The Drag & Drop Kanban Board */}
      <KanbanBoard />


      {/* Custom Application Creator Modal */}
      <Modal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        title="Add Custom Application"
        description="Track any job or referral opportunity in your board"
      >
        <form onSubmit={handleCreateCustom} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Role Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lead SDE-2"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kaveri Cloud Labs"
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Location
              </label>
              <select
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-slate-800 dark:text-slate-200"
              >
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Chennai">Chennai</option>
                <option value="Remote (India)">Remote (India)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Salary (LPA)
              </label>
              <input
                type="text"
                value={customSalary}
                onChange={(e) => setCustomSalary(e.target.value)}
                placeholder="e.g. ₹25 - ₹35 LPA"
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Initial Column
              </label>
              <select
                value={customStage}
                onChange={(e) => setCustomStage(e.target.value as ApplicationStage)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-slate-800 dark:text-slate-200"
              >
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Notes / Recruiter Details
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Referral name, job link, recruiter email, etc."
              className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsCustomModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" variant="primary">
              Add to Board
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
