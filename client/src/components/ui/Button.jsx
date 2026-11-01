import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-gradient-to-r from-[#FF4B4B] via-[#E11D48] to-[#FF3333] hover:brightness-110 text-white font-extrabold shadow-lg shadow-[#FF4B4B]/35 border border-white/20 focus:ring-[#FF4B4B]',
  secondary: 'bg-[#1E2538] hover:bg-[#28324C] text-white font-bold border border-slate-600/80 hover:border-slate-400 shadow-md focus:ring-[#8B5CF6]',
  outline: 'bg-slate-900/80 hover:bg-slate-800 text-white font-bold border-2 border-slate-500 hover:border-[#FF4B4B] shadow-sm focus:ring-[#FF4B4B]',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md border border-rose-400/40 focus:ring-rose-500',
  ghost: 'bg-white/10 hover:bg-white/20 text-white font-bold border border-white/10 focus:ring-slate-400',
  subtle: 'bg-[#8B5CF6]/30 hover:bg-[#8B5CF6]/45 text-[#C4B5FD] font-bold border border-[#8B5CF6]/50'
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-bold rounded-xl gap-1.5',
  md: 'px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-sm sm:text-base font-extrabold rounded-2xl gap-2.5'
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center transition-all duration-200 select-none
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#080B12] disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
