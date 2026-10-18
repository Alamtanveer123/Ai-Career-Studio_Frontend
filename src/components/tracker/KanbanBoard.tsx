import React, { useState } from 'react';
import { Application, ApplicationStage } from '../../types/application';
import { KanbanColumn } from './KanbanColumn';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import confetti from 'canvas-confetti';
import { useAppStore } from '../../store/useAppStore';
import { KanbanCard } from './KanbanCard';

interface ColumnDef {
  id: ApplicationStage;
  title: string;
  colorBadgeClass: string;
}

const COLUMNS: ColumnDef[] = [
  { id: 'saved', title: 'Saved', colorBadgeClass: 'bg-indigo-500' },
  { id: 'applied', title: 'Applied', colorBadgeClass: 'bg-blue-500' },
  { id: 'interview', title: 'Interview', colorBadgeClass: 'bg-amber-500' },
  { id: 'offer', title: 'Offer', colorBadgeClass: 'bg-emerald-500' },
  { id: 'rejected', title: 'Rejected', colorBadgeClass: 'bg-rose-500' },
];

export const KanbanBoard: React.FC = () => {
  const {
    applications,
    updateApplicationStage,
    updateApplicationNotes,
    updateApplicationInterviewDate,
    addToast,
  } = useAppStore();

  const [activeCard, setActiveCard] = useState<Application | null>(null);

  // Note editing modal state
  const [editingNoteApp, setEditingNoteApp] = useState<Application | null>(null);
  const [noteText, setNoteText] = useState('');

  // Interview scheduling modal state
  const [interviewApp, setInterviewApp] = useState<Application | null>(null);
  const [interviewDate, setInterviewDate] = useState('');

  // Sensors configuration: 8px threshold allows button clicks inside cards
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const app = applications.find((a) => a.id === event.active.id);
    if (app) setActiveCard(app);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeApp = applications.find((a) => a.id === active.id);
    if (!activeApp) return;

    // Determine target stage
    let targetStage: ApplicationStage | null = null;

    // If dropped directly onto a column droppable
    if (COLUMNS.some((c) => c.id === over.id)) {
      targetStage = over.id as ApplicationStage;
    } else {
      // If dropped over another card, get that card's stage
      const overApp = applications.find((a) => a.id === over.id);
      if (overApp) {
        targetStage = overApp.stage;
      }
    }

    if (targetStage && targetStage !== activeApp.stage) {
      updateApplicationStage(activeApp.id, targetStage);

      // Trigger confetti celebration when moved to Offer!
      if (targetStage === 'offer') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#6366f1', '#eab308', '#3b82f6'],
        });
        addToast('Congratulations! 🎉', `Moved ${activeApp.company} to Offer!`, 'success');
      }
    }
  };

  const handleOpenEditNotes = (app: Application) => {
    setEditingNoteApp(app);
    setNoteText(app.notes || '');
  };

  const handleSaveNotes = () => {
    if (editingNoteApp) {
      updateApplicationNotes(editingNoteApp.id, noteText);
      setEditingNoteApp(null);
      addToast('Notes Saved', 'Updated application notes.', 'info');
    }
  };

  const handleOpenScheduleInterview = (app: Application) => {
    setInterviewApp(app);
    setInterviewDate(app.interviewDate ? app.interviewDate.slice(0, 10) : new Date().toISOString().slice(0, 10));
  };

  const handleSaveInterviewDate = () => {
    if (interviewApp && interviewDate) {
      updateApplicationInterviewDate(interviewApp.id, new Date(interviewDate).toISOString());
      setInterviewApp(null);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-thin">
          {COLUMNS.map((column) => {
            const columnApps = applications.filter((app) => app.stage === column.id);
            return (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                colorBadgeClass={column.colorBadgeClass}
                applications={columnApps}
                onEditNotes={handleOpenEditNotes}
                onScheduleInterview={handleOpenScheduleInterview}
              />
            );
          })}
        </div>

        {/* Drag Overlay for smooth preview */}
        <DragOverlay>
          {activeCard ? (
            <div className="rotate-2 scale-105 shadow-2xl pointer-events-none opacity-90">
              <KanbanCard
                application={activeCard}
                onEditNotes={() => {}}
                onScheduleInterview={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Edit Notes Modal */}
      <Modal
        isOpen={!!editingNoteApp}
        onClose={() => setEditingNoteApp(null)}
        title="Application Notes"
        description={`Personal notes for ${editingNoteApp?.jobTitle} at ${editingNoteApp?.company}`}
      >
        <div className="space-y-4">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={5}
            placeholder="Log recruiter contacts, interview rounds feedback, salary details, or follow-up dates..."
            className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-slate-800 dark:text-slate-200"
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditingNoteApp(null)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" onClick={handleSaveNotes}>
              Save Notes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={!!interviewApp}
        onClose={() => setInterviewApp(null)}
        title="Log Interview Date"
        description={`Set scheduled round for ${interviewApp?.company}`}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Interview Date
            </label>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setInterviewApp(null)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" onClick={handleSaveInterviewDate}>
              Confirm Interview Date
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
