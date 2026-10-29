import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  ...props
}) => {
  return (
    <div
      className={`
        bg-[#151A24] rounded-2xl border border-[#232A3B] shadow-xl text-white
        ${hover ? 'hover:border-[#FF4B4B]/50 hover:shadow-[0_12px_35px_rgba(0,0,0,0.6)] transition-all duration-200' : ''}
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between pb-4 border-b border-[#232A3B] mb-5 ${className}`}>
    <div>
      <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0 ml-4">{action}</div>}
  </div>
);

export default Card;
