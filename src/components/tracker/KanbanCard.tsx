import React, { useState } from 'react';
import { Application, ApplicationStage } from '../../types/application';
import { Card } from '../common/Card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Building2,
  Calendar,
  FileEdit,
  Trash2,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { formatRelativeTime, formatDateDisplay, getScoreColorClass } from '../../utils/formatters';
import { useAppStore } from '../../store/useAppStore';

interface KanbanCardProps {
  application: Application;
  onEditNotes: (app: Application) => void;
  onScheduleInterview: (app: Application) => void;
}

const STAGES: { id: ApplicationStage; label: string }[] = [
  { id: 'saved', label: 'Saved' },
  { id: 'applied', label: 'Applied' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer' },
  { id: 'rejected', label: 'Rejected' },
];

export const KanbanCard: React.FC<KanbanCardProps> = ({
  application,
  onEditNotes,
  onScheduleInterview,
}) => {
  const { updateApplicationStage, removeApplication } = useAppStore();
  const [showStageMenu, setShowStageMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
    data: { application },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const scoreStyle = getScoreColorClass(application.matchScore);

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-sm transition-all duration-150">
        {/* Top Handle, Company & Score */}
        <div className="flex items-start justify-between gap-2 mb-2">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Drag card to move between columns"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{application.company}</span>
            </div>
            <h4
              className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1 leading-snug"
              title={application.jobTitle}
            >
              {application.jobTitle}
            </h4>
          </div>

          {/* Match Score Badge */}
          <div
            className={`shrink-0 px-2 py-0.5 rounded-full border text-[11px] font-bold flex items-center gap-1 ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>{application.matchScore}%</span>
          </div>
        </div>

        {/* Salary & Location */}
        <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1 mb-2.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {application.salaryText}
          </span>
          <span>&bull;</span>
          <span>{application.location}</span>
        </div>

        {/* Interview Date pill if present */}
        {application.interviewDate && (
          <div
            onClick={() => onScheduleInterview(application)}
            className="mb-2 p-1.5 px-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] font-medium flex items-center justify-between cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Interview: {formatDateDisplay(application.interviewDate)}</span>
            </span>
            <span className="text-[10px] underline">Edit</span>
          </div>
        )}

        {/* Notes preview */}
        {application.notes && (
          <p
            onClick={() => onEditNotes(application)}
            className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 line-clamp-2 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors mb-2.5 leading-relaxed"
            title="Click to edit notes"
          >
            &ldquo;{application.notes}&rdquo;
          </p>
        )}

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
          <span>Added {formatRelativeTime(application.dateAdded)}</span>

          <div className="flex items-center gap-1">
            {/* Notes button */}
            <button
              onClick={() => onEditNotes(application)}
              className="p-1 rounded text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Add or edit notes"
            >
              <FileEdit className="w-3.5 h-3.5" />
            </button>

            {/* Schedule interview button */}
            <button
              onClick={() => onScheduleInterview(application)}
              className="p-1 rounded text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Log interview date"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>

            {/* Mobile / Fallback Stage Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStageMenu(!showStageMenu)}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold"
                title="Change stage (Mobile fallback)"
              >
                <span>Move</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showStageMenu && (
                <div className="absolute right-0 bottom-full mb-1 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Move to
                  </div>
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        updateApplicationStage(application.id, s.id);
                        setShowStageMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs transition-colors flex items-center justify-between ${
                        application.stage === s.id
                          ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{s.label}</span>
                      {application.stage === s.id && <span>&bull;</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeApplication(application.id)}
              className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Remove from board"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
