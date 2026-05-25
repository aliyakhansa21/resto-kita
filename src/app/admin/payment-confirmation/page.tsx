"use client";

import { useState } from "react";
import { CheckCircle, Check, RefreshCw, X, Banknote } from "lucide-react";
import { usePayments, type Payment } from "@/hooks/usePaymentConfirmation";
import { useTablePagination, calculatePagination } from "@/hooks/useTablePagination";
import { PaginationControls } from "@/app/admin/components/PaginationControls";
import { DataTableLoadingOverlay } from "@/app/admin/components/DataTableLoading";
import { DataTableError, DataTableEmpty } from "@/app/admin/components/DataTableStates";

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
};

function ConfirmPaymentModal({
    payment,
    onConfirm,
    onCancel,
    isProcessing,
}: {
    payment: Payment;
    onConfirm: () => void;
    onCancel: () => void;
    isProcessing: boolean;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <div className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden bg-stone-50 border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-50"
                >
                    <X size={18} />
                </button>

                {/* Body */}
                <div className="px-6 pt-8 pb-5 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-green-100 border-2 border-green-200">
                        <Banknote size={30} className="text-green-600" />
                    </div>

                    <h2 className="text-xl font-bold text-stone-800">
                        Konfirmasi Pembayaran
                    </h2>
                    <p className="mt-2 text-sm text-stone-500 leading-relaxed">
                        Terima pembayaran tunai sebesar <span className="font-bold text-stone-800">{formatRupiah(payment.totalAmount)}</span> untuk <span className="font-bold text-stone-800">Meja {payment.tableNo}</span> atas nama <span className="font-bold text-stone-800">&ldquo;{payment.customer_name}&rdquo;</span>?
                    </p>
                </div>

                {/* Divider */}
                <div className="mx-6 h-px bg-stone-200" />

                {/* Actions */}
                <div className="px-6 py-5 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-white hover:bg-stone-100 text-stone-600 border border-stone-200 transition-all duration-200 active:scale-95 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <RefreshCw size={15} className="animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <Check size={16} strokeWidth={3} />
                                Ya, Konfirmasi
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PaymentConfirmationPage() {
    const { payments, isLoading, isError, isProcessingId, confirmCashPayment, refresh } = usePayments();
    const { currentPage, entriesPerPage, handlePageChange, handleEntriesChange } = useTablePagination(1, 10);
    
    const [confirmTarget, setConfirmTarget] = useState<Payment | null>(null);

    const { paginatedData, totalPages, totalEntries } = calculatePagination(
        payments,
        currentPage,
        entriesPerPage
    );

    const handleConfirmSubmit = async () => {
        if (confirmTarget) {
            const success = await confirmCashPayment(confirmTarget.invoice_id, confirmTarget.customer_name);
            if (success) {
                setConfirmTarget(null); 
            }
        }
    };

    return (
        <div className="p-6 sm:p-10 space-y-8 w-full max-w-6xl mx-auto">            
            {confirmTarget && (
                <ConfirmPaymentModal
                    payment={confirmTarget}
                    onConfirm={handleConfirmSubmit}
                    onCancel={() => setConfirmTarget(null)}
                    isProcessing={isProcessingId === confirmTarget.invoice_id}
                />
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800 tracking-tight">Pembayaran</h1>
                    <p className="text-sm text-stone-500 mt-1">
                        Kelola dan konfirmasi pembayaran setiap meja dengan mudah dan cepat.
                    </p>
                </div>
                <button 
                    onClick={refresh}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm font-medium transition-colors"
                >
                    <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                    Refresh Data
                </button>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden relative">
                
                {/* Overlay Loading Data */}
                {isLoading && <DataTableLoadingOverlay message="Memuat data pembayaran..." />}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[12px] text-[#64748B] font-bold uppercase tracking-wider border-b border-stone-100 bg-[#F8FAFC]">
                            <tr>
                                <th className="px-10 py-5 w-1/3">NO MEJA</th>
                                <th className="px-6 py-5 w-1/3 text-center">TOTAL PESANAN</th>
                                <th className="px-10 py-5 w-1/3 text-right">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {isError && <DataTableError message="Gagal memuat data pembayaran." onRetry={refresh} colSpan={3} />}
                            {!isError && totalEntries === 0 && !isLoading && <DataTableEmpty message="Belum ada tagihan masuk." colSpan={3} />}
                            {!isError && !isLoading && paginatedData.map((payment) => (
                                <tr key={payment.id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="px-10 py-5 text-stone-500 font-medium">
                                        <span className="block text-lg text-stone-800">
                                            {payment.tableNo.toString().padStart(2, "0")}
                                        </span>
                                        <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">
                                            {payment.customer_name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center font-bold text-stone-800">
                                        {formatRupiah(payment.totalAmount)}
                                    </td>
                                    <td className="px-10 py-5">
                                        <div className="flex justify-end">
                                            {payment.status === "PENDING" ? (
                                                <button
                                                    onClick={() => setConfirmTarget(payment)}
                                                    className="text-stone-300 hover:text-green-500 transition-colors"
                                                    title="Konfirmasi Pembayaran"
                                                >
                                                    <CheckCircle size={28} strokeWidth={1.5} />
                                                </button>
                                            ) : (
                                                <div 
                                                    className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm shadow-green-200"
                                                    title="Pembayaran Selesai"
                                                >
                                                    <Check size={16} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!isError && totalEntries > 0 && !isLoading && (
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        entriesPerPage={entriesPerPage}
                        totalEntries={totalEntries}
                        entriesOptions={[5, 10, 25]}
                        onPageChange={(page) => handlePageChange(page, totalPages)}
                        onEntriesChange={handleEntriesChange}
                    />
                )}
            </div>
        </div>
    );
}