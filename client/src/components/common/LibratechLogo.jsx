import React from 'react';
import { Link } from 'react-router-dom';

export const LibratechLogo = ({ size = 'md', to = '/' }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const iconSizes = isSmall ? 'w-8 h-8' : isLarge ? 'w-11 h-11' : 'w-9 h-9';
  const textSizes = isSmall ? 'text-lg' : isLarge ? 'text-2xl' : 'text-xl';

  const content = (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      {/* Icon: Open Book fused with glowing Circuit / Digital pulse */}
      <div className={`relative ${iconSizes} rounded-xl bg-gradient-to-br from-[#FF4B4B] via-[#E11D48] to-[#8B5CF6] p-[1.5px] shadow-lg shadow-[#FF4B4B]/20 group-hover:shadow-[#FF4B4B]/40 transition-all duration-300 transform group-hover:scale-105`}>
        <div className="w-full h-full bg-[#080B12] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle circuit lines background */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:6px_6px]" />
          
          {/* Book + Circuit SVG Icon */}
          <svg
            className="w-5 h-5 text-white relative z-10 drop-shadow-[0_2px_8px_rgba(255,75,75,0.6)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Open Book spine & pages */}
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            {/* Digital circuit node / dot in the center */}
            <circle cx="12" cy="7" r="1.5" className="fill-[#FF4B4B] stroke-[#FF4B4B]" />
            <line x1="12" y1="8.5" x2="12" y2="13" className="stroke-[#8B5CF6]" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight">
          <span className={`font-black ${textSizes} tracking-wider text-white font-sans uppercase`}>
            LIBRA<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6]">TECH</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B4B] ml-1 shadow-[0_0_8px_#FF4B4B] animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
};

export default LibratechLogo;

