import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-gradient-to-r from-[#FF4B4B] to-[#E03E3E] hover:from-[#FF3333] hover:to-[#FF4B4B] text-white shadow-lg shadow-[#FF4B4B]/30 border border-transparent focus:ring-[#FF4B4B]',
  secondary: 'bg-[#151A24] hover:bg-[#1E2535] text-white border border-[#232A3B] hover:border-white/20 shadow-sm focus:ring-[#8B5CF6]',
  outline: 'bg-transparent hover:bg-white/5 text-white border border-[#232A3B] hover:border-[#FF4B4B]/50 focus:ring-[#FF4B4B]',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md border border-transparent focus:ring-rose-500',
  ghost: 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white focus:ring-slate-400',
  subtle: 'bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#A78BFA] border border-[#8B5CF6]/30'
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
