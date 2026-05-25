import { useState, useCallback } from 'react';

/**
 * Custom hook untuk mengelola pagination dan entries per page
 * Untuk client-side pagination
 */
export function useTablePagination(initialPage = 1, initialEntriesPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [entriesPerPage, setEntriesPerPage] = useState(initialEntriesPerPage);

  const handlePageChange = useCallback((page: number, totalPages: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, []);

  const handleEntriesChange = useCallback((entries: number) => {
    setEntriesPerPage(entries);
    setCurrentPage(1); // Reset ke halaman pertama
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(initialPage);
    setEntriesPerPage(initialEntriesPerPage);
  }, [initialPage, initialEntriesPerPage]);

  return {
    currentPage,
    entriesPerPage,
    handlePageChange,
    handleEntriesChange,
    resetPagination,
    setCurrentPage,
    setEntriesPerPage,
  };
}

/**
 * Utility untuk menghitung pagination dari data array
 */
export function calculatePagination(
  data: any[],
  currentPage: number,
  entriesPerPage: number
) {
  const totalEntries = data.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    paginatedData,
    totalPages,
    totalEntries,
    startIndex,
    endIndex,
  };
}
