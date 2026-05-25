import { AlertCircle, RefreshCw } from 'lucide-react';

interface DataTableErrorProps {
  message?: string;
  onRetry?: () => void;
  colSpan?: number;
}

/**
 * Unified error state untuk table
 */
export function DataTableError({
  message = 'Gagal memuat data. Silakan coba lagi.',
  onRetry,
  colSpan = 7,
}: DataTableErrorProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-10">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-medium mb-1">Terjadi Kesalahan</p>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Coba Lagi
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

interface DataTableEmptyProps {
  message?: string;
  colSpan?: number;
}

/**
 * Unified empty state untuk table
 */
export function DataTableEmpty({
  message = 'Belum ada data untuk ditampilkan.',
  colSpan = 7,
}: DataTableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm font-medium text-center">{message}</p>
        </div>
      </td>
    </tr>
  );
}
