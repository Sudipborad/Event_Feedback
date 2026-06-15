import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

/**
 * Reusable Toast Notification component
 */
export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-sm w-[calc(100vw-2rem)] sm:w-full backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in">
      <div className="flex items-center space-x-3">
        {isSuccess ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
        )}
        <p className="text-sm text-slate-100 font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors focus:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
