import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none no-print">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onDismiss(t.id)}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl bg-slate-900 text-white text-xs font-semibold border border-slate-800 animate-in slide-in-from-bottom-5 duration-200 cursor-pointer"
        >
          {t.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : t.type === 'info' ? (
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span className="flex-1 leading-snug">{t.message}</span>
        </div>
      ))}
    </div>
  );
};
