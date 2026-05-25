"use client";

import { useState, useEffect } from "react";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import Link from "next/link";
import dayjs from "dayjs";
import { RefreshCw, Download } from "lucide-react";
import { DataTableLoading } from "@/app/admin/components/DataTableLoading";
import { DataTableError, DataTableEmpty } from "@/app/admin/components/DataTableStates";
import { PaginationControls } from "@/app/admin/components/PaginationControls";
import { useTablePagination, calculatePagination } from "@/hooks/useTablePagination";

// Helpers 

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

const formatPaymentMethod = (method: string) => {
  if (!method) return "-";
  if (method.toLowerCase() === "qris") return "QRIS";
  return method
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// ─── Component ───────────────────────────────────────────────────────────────

const COL_SPAN = 9;

export default function PesananPage() {
  const { data: orders, isLoading, isError, refetch } = useAdminOrders();

  // Timestamp terakhir diperbarui
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  useEffect(() => {
    if (!isLoading) setLastUpdated(new Date());
  }, [isLoading]);

  // Hook pagination terpusat
  const { currentPage, entriesPerPage, handlePageChange, handleEntriesChange } =
    useTablePagination(1, 10);

  // Hitung pagination dari data
  const { paginatedData: paginatedOrders, totalPages, totalEntries, startIndex } =
    calculatePagination(orders ?? [], currentPage, entriesPerPage);

  // ─── Export CSV ──────────────────────────────────────────────────────────
  const handleExport = () => {
    if (!orders || orders.length === 0) return;
    const headers = ["No", "Kode Pesanan", "Pelanggan", "Total", "Status", "No Meja", "Pembayaran", "Dibuat Pada"];
    const rows = orders.map((order: any, index: number) => {
      const subtotal = order.order_items?.reduce((acc: number, curr: any) => {
        const price = parseFloat(curr?.item?.price || "0");
        const amount = Number(curr?.amount) || 0;
        return acc + price * amount;
      }, 0) || 0;
      const taxAmount = subtotal * 0.1;
      const grandTotal = subtotal + taxAmount;

      return [
        index + 1,
        order.order_id || "-",
        order.customer_name || "-",
        grandTotal,
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

  // ─── Render ──────────────────────────────────────────────────────────────
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

        {/* Top Controls: Refresh + Export */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          {/* Last Updated Info */}
          <p className="text-xs text-gray-400">
            {isLoading
              ? "Memperbarui data..."
              : lastUpdated
              ? `Terakhir diperbarui: ${dayjs(lastUpdated).format("HH:mm:ss")}`
              : ""}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Refresh Manual */}
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              title="Refresh data"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={15}
                className={isLoading ? "animate-spin text-primary" : "text-gray-500"}
              />
              Refresh
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExport}
              disabled={isLoading || isError || !orders?.length}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download size={15} className="text-gray-500" />
              Export
            </button>
          </div>
        </div>

        {/* Loading State — gunakan DataTableLoading */}
        {isLoading && (
          <DataTableLoading rows={5} columns={COL_SPAN} />
        )}

        {/* Table — hanya tampil saat tidak loading */}
        {!isLoading && (
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
                  <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Dibuat Pada</th>
                  <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">

                {/* Error State */}
                {isError && (
                  <DataTableError
                    message="Gagal memuat data pesanan."
                    onRetry={() => refetch()}
                    colSpan={COL_SPAN}
                  />
                )}

                {/* Empty State */}
                {!isError && paginatedOrders.length === 0 && (
                  <DataTableEmpty message="Belum ada pesanan." colSpan={COL_SPAN} />
                )}

                {/* Data Rows */}
                {!isError &&
                  paginatedOrders.map((order: any, index: number) => {
                    // Hitung subtotal → pajak → grand total per baris
                    const subtotal =
                      order.order_items?.reduce((acc: number, curr: any) => {
                        const price = parseFloat(curr?.item?.price || "0");
                        const amount = Number(curr?.amount) || 0;
                        return acc + price * amount;
                      }, 0) || 0;
                    const taxAmount = subtotal * 0.1;
                    const grandTotal = subtotal + taxAmount;

                    return (
                      <tr
                        key={order.id || index}
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
                          Rp {grandTotal.toLocaleString("id-ID")}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.payment_status)}`}
                          >
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
                        <td className="py-4 px-5 text-gray-600 text-center font-medium">
                          {formatPaymentMethod(order.payment_method)}
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
        )}

        {/* Footer Pagination — hanya tampil saat ada data */}
        {!isLoading && !isError && totalEntries > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            entriesPerPage={entriesPerPage}
            totalEntries={totalEntries}
            onPageChange={(page) => handlePageChange(page, totalPages)}
            onEntriesChange={handleEntriesChange}
          />
        )}
      </div>
    </div>
  );
}