import React from 'react';
import { BookOpen } from 'lucide-react';
import Button from './Button.jsx';

export const EmptyState = ({
  icon: Icon = BookOpen,
  title = 'No records found',
  description = 'There is currently no data matching your criteria.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-[#151A24]/60 rounded-2xl border border-dashed border-[#232A3B] ${className}`}>
      <div className="w-12 h-12 rounded-full bg-[#080B12] flex items-center justify-center text-[#FF4B4B] mb-4 border border-[#232A3B] shadow-inner">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
