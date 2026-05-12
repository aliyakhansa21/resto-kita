"use client";

import { useAdminOrders } from "@/hooks/useAdminOrders";
import Link from "next/link";
import dayjs from "dayjs";
import { useState } from "react";

const ENTRIES_OPTIONS = [5, 10, 25, 50];

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "processing":
      return "bg-emerald-100 text-emerald-700";
    case "success":
    case "paid":
    case "dibayar":
      return "bg-accent text-white";
    case "unpaid":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getStatusLabel = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":    return "Pending";
    case "processing": return "Processing";
    case "success":
    case "paid":       return "Success";
    case "unpaid":     return "Unpaid";
    default:           return status || "-";
  }
};

export default function PesananPage() {
  const { data: orders, isLoading, isError } = useAdminOrders();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalEntries = orders?.length || 0;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const paginatedOrders = orders?.slice(startIndex, endIndex) || [];

  const handleEntriesChange = (value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const handleExport = () => {
    if (!orders || orders.length === 0) return;
    const headers = ["No", "Kode Pesanan", "Pelanggan", "Total", "Status", "No Meja", "Pembayaran", "Catatan", "Dibuat Pada"];
    const rows = orders.map((order, index) => {
      const total = order.order_items?.reduce((acc, curr) => {
        const price = curr?.item?.price ? parseInt(curr.item.price) : 0;
        return acc + price * (curr?.amount || 0);
      }, 0) || 0;
      return [
        index + 1,
        order.order_id || "-",
        order.customer_name || "-", 
        total,
        order.payment_status || "-",
        order.table?.number || "-", 
        order.payment_method || "-",
        dayjs(order.ordered_at).format("DD/MM/YYYY"),
      ].join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daftar-pesanan-${dayjs().format("YYYYMMDD")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Pesanan</h1>
        <p className="text-gray-500 text-sm">
          Kelola dan pantau semua pesanan pelanggan yang masuk secara real-time.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Top Controls */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <div className="relative">
              <select
                value={entriesPerPage}
                onChange={(e) => handleEntriesChange(Number(e.target.value))}
                className="appearance-none border border-gray-200 rounded-md pl-3 pr-8 py-1.5 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                {ENTRIES_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <svg className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <span>entries</span>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">No</th>
                <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Kode Pesanan</th>
                <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Pelanggan</th>
                <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">No Meja</th>
                <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Pembayaran</th>
                <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Catatan</th>
                <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Dibuat Pada</th>
                <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">

              {/* Loading State — skeleton rows */}
              {isLoading &&
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    {[...Array(10)].map((_, j) => (
                      <td key={j} className="py-5 px-5">
                        <div className="h-3.5 bg-gray-100 rounded-full" />
                      </td>
                    ))}
                  </tr>
                ))}

              {/* Error State */}
              {isError && (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 font-medium">Gagal memuat data pesanan</p>
                      <p className="text-gray-400 text-xs">Silakan coba lagi beberapa saat</p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty State */}
              {!isLoading && !isError && paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-500 font-medium">Belum ada pesanan</p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Data Rows */}
              {!isLoading &&
                !isError &&
                paginatedOrders.map((order, index) => {
                  const total =
                    order.order_items?.reduce((acc, curr) => {
                      const price = curr?.item?.price ? parseInt(curr.item.price) : 0;
                      return acc + price * (curr?.amount || 0);
                    }, 0) || 0;

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                    >
                      {/* No */}
                      <td className="py-4 px-5 text-gray-400 text-center font-medium">
                        {startIndex + index + 1}
                      </td>

                      {/* Kode Pesanan */}
                      <td className="py-4 px-5 font-semibold text-primary">
                        {order.order_id || "-"}
                      </td>

                      {/* Pelanggan */}
                      <td className="py-4 px-5 font-medium text-gray-800 text-center capitalize">
                        {order.customer_name || "-"}
                      </td>

                      {/* Total */}
                      <td className="py-4 px-5 font-bold text-gray-900">
                        Rp {total.toLocaleString("id-ID")}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.payment_status)}`}>
                          {getStatusLabel(order.payment_status)}
                        </span>
                      </td>

                      {/* No Meja */}
                      <td className="py-4 px-5 text-gray-600 text-center font-medium">
                        {order.table?.number
                          ? String(order.table.number).padStart(2, "0")
                          : "-"}
                      </td>

                      {/* Pembayaran */}
                      <td className="py-4 px-5 text-gray-600 text-center">
                        {order.payment_method || "-"}
                      </td>

                      {/* Catatan */}
                      <td className="py-4 px-5 text-gray-500 max-w-[150px] text-center">
                        <span className="block truncate" title={undefined}>
                          {"-"}
                        </span>
                      </td>

                      {/* Dibuat Pada */}
                      <td className="py-4 px-5 text-gray-500 text-center">
                        {order.ordered_at
                          ? dayjs(order.ordered_at).format("DD/MM/YYYY")
                          : "-"}
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-5 text-center">
                        <Link href={`/admin/pesanan/${order.id}`}>
                          <button className="px-4 py-1.5 bg-secondary text-primary text-xs font-bold rounded-lg hover:bg-secondary-10 transition-colors">
                            Lihat
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Bottom: Info + Pagination */}
        {!isLoading && !isError && totalEntries > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">{startIndex + 1}</span>
              {" "}to{" "}
              <span className="font-medium text-gray-700">{endIndex}</span>
              {" "}of{" "}
              <span className="font-medium text-gray-700">{totalEntries}</span>
              {" "}entries
            </p>

            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm select-none">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}