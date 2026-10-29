import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

  return (
    <div className="w-full text-white">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`
            block w-full rounded-xl border bg-[#080B12] py-2.5 text-sm text-white transition-all
            placeholder:text-slate-500 focus:outline-none focus:border-[#FF4B4B] focus:ring-1 focus:ring-[#FF4B4B]
            ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5
            ${error ? 'border-rose-500 focus:ring-rose-500' : 'border-[#232A3B] hover:border-slate-500'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-400 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
