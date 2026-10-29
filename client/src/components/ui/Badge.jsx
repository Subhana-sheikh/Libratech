import React from 'react';

const variants = {
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  info: 'bg-[#8B5CF6]/15 text-[#A78BFA] border-[#8B5CF6]/30',
  coral: 'bg-[#FF4B4B]/15 text-[#FF4B4B] border-[#FF4B4B]/30',
  neutral: 'bg-white/10 text-slate-300 border-white/10',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30'
};

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = false
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`
        inline-flex items-center rounded-full border ${sizeClasses}
        ${variants[variant] || variants.neutral}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${
            variant === 'success' ? 'bg-emerald-400 animate-pulse' :
            variant === 'warning' ? 'bg-amber-400' :
            variant === 'danger' ? 'bg-rose-400' :
            variant === 'coral' ? 'bg-[#FF4B4B]' :
            variant === 'info' ? 'bg-[#8B5CF6]' : 'bg-slate-400'
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
