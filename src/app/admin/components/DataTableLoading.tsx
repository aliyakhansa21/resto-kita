import { RefreshCw } from 'lucide-react';

interface DataTableLoadingProps {
  rows?: number;
  columns?: number;
}

/**
 * Unified loading state untuk data table
 * Menampilkan skeleton loading dengan row dan kolom yang dapat dikustomisasi
 */
export function DataTableLoading({ rows = 5, columns = 7 }: DataTableLoadingProps) {
  return (
    <div className="animate-pulse space-y-2">
      {/* Header Skeleton */}
      <div className="px-6 py-4 bg-gray-100 rounded-t-lg flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
        ))}
      </div>

      {/* Row Skeletons */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="px-6 py-4 border-b border-gray-100 flex gap-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} className="h-4 bg-gray-200 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

interface DataTableLoadingOverlayProps {
  message?: string;
}

/**
 * Loading overlay untuk table - spinner dengan backdrop
 */
export function DataTableLoadingOverlay({ message = 'Memuat data...' }: DataTableLoadingOverlayProps) {
  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="animate-spin text-primary" size={32} />
        <p className="text-sm text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
