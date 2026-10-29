import React from 'react';

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#232A3B] rounded ${className}`} />
);

export const BookCardSkeleton = () => (
  <div className="bg-[#151A24] rounded-xl border border-[#232A3B] p-4 shadow-sm flex flex-col justify-between h-[360px]">
    <div>
      <Skeleton className="w-full h-44 rounded-lg mb-3" />
      <Skeleton className="w-16 h-4 rounded mb-2" />
      <Skeleton className="w-full h-5 rounded mb-1" />
      <Skeleton className="w-2/3 h-4 rounded" />
    </div>
    <div className="pt-3 border-t border-[#232A3B] flex items-center justify-between">
      <Skeleton className="w-20 h-4 rounded" />
      <Skeleton className="w-16 h-8 rounded-lg" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-[#151A24] rounded-lg border border-[#232A3B] animate-pulse">
        <Skeleton className="w-12 h-6 rounded" />
        <Skeleton className="w-1/3 h-6 rounded" />
        <Skeleton className="w-1/4 h-6 rounded" />
        <Skeleton className="w-16 h-6 rounded ml-auto" />
      </div>
    ))}
  </div>
);

export default Skeleton;
