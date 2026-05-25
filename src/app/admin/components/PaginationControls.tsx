import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  entriesPerPage: number;
  totalEntries: number;
  entriesOptions?: number[];
  onPageChange: (page: number) => void;
  onEntriesChange: (entries: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  entriesPerPage,
  totalEntries,
  entriesOptions = [5, 10, 25, 50],
  onPageChange,
  onEntriesChange,
}: PaginationControlsProps) {
  const startIndex = totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
  const endIndex = Math.min(currentPage * entriesPerPage, totalEntries);

  // Generate page numbers dengan smart display
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
      {/* Left: Info and Entries Selection */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-600">
          Show{' '}
          <select
            value={entriesPerPage}
            onChange={(e) => onEntriesChange(Number(e.target.value))}
            className="border border-gray-200 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer mx-1"
          >
            {entriesOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          entries
        </span>
      </div>

      {/* Center: Info Text */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-800">{startIndex}</span> to{' '}
        <span className="font-semibold text-gray-800">{endIndex}</span> of{' '}
        <span className="font-semibold text-gray-800">{totalEntries}</span> entries
      </div>

      {/* Right: Pagination Buttons */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-1.5 text-gray-400"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                currentPage === page
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              )}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
