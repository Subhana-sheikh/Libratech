import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle
};

const styles = {
  error: 'bg-rose-50 text-rose-800 border-rose-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  info: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200'
};

export const Alert = ({
  type = 'info',
  title,
  children,
  onClose,
  className = ''
}) => {
  const Icon = icons[type] || Info;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 ${styles[type]} ${className}`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-md transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
