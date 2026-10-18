import React from 'react';
import { Application, ApplicationStage } from '../../types/application';
import { KanbanCard } from './KanbanCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Sparkles, Trophy, Plus } from 'lucide-react';

interface KanbanColumnProps {
  id: ApplicationStage;
  title: string;
  applications: Application[];
  colorBadgeClass: string;
  onEditNotes: (app: Application) => void;
  onScheduleInterview: (app: Application) => void;
  onQuickAdd?: (stage: ApplicationStage) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  applications,
  colorBadgeClass,
  onEditNotes,
  onScheduleInterview,
  onQuickAdd,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { stage: id },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-72 sm:w-80 shrink-0 bg-slate-100/70 dark:bg-slate-900/50 rounded-2xl p-3 border transition-colors ${
        isOver
          ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20'
          : 'border-slate-200/80 dark:border-slate-800'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-1.5 mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${colorBadgeClass}`} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {title}
          </h3>
          <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {applications.length}
          </span>
        </div>

        {onQuickAdd && (
          <button
            onClick={() => onQuickAdd(id)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors"
            title={`Add opportunity to ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Cards List in Sortable Context */}
      <SortableContext
        items={applications.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-3 min-h-[140px] overflow-y-auto max-h-[calc(100vh-280px)] p-0.5">
          {applications.length === 0 ? (
            <div className="h-28 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-center p-3 text-slate-400">
              {id === 'offer' ? (
                <>
                  <Trophy className="w-5 h-5 mb-1 text-amber-500/70" />
                  <span className="text-xs font-medium">Drag offers here! 🎉</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mb-1 text-slate-300 dark:text-slate-600" />
                  <span className="text-xs">No applications here</span>
                </>
              )}
            </div>
          ) : (
            applications.map((app) => (
              <KanbanCard
                key={app.id}
                application={app}
                onEditNotes={onEditNotes}
                onScheduleInterview={onScheduleInterview}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};
