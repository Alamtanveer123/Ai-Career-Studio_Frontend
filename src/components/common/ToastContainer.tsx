import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const icon = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-brand-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
        }[toast.type];

        const borderClass = {
          success: 'border-emerald-200 dark:border-emerald-800/60',
          info: 'border-brand-200 dark:border-brand-800/60',
          warning: 'border-amber-200 dark:border-amber-800/60',
          error: 'border-rose-200 dark:border-rose-800/60',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border shadow-lg ${borderClass} transition-all duration-300 animate-slide-up`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {toast.title}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
