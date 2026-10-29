import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button.jsx';

export const Pagination = ({
  page = 1,
  pages = 1,
  total = 0,
  onPageChange,
  className = ''
}) => {
  if (pages <= 1) return null;

  return (
    <div className={`flex items-center justify-between border-t border-slate-200/80 px-4 py-3 sm:px-6 mt-6 ${className}`}>
      <div className="text-xs text-slate-500">
        Page <span className="font-semibold text-slate-800">{page}</span> of{' '}
        <span className="font-semibold text-slate-800">{pages}</span> ({total} total results)
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          icon={ChevronLeft}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
