"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, AlertTriangle, X } from "lucide-react";
import { useAdminMenu, type AdminMenuItem } from "@/hooks/useAdminMenu";
import { useTablePagination, calculatePagination } from "@/hooks/useTablePagination";
import { PaginationControls } from "@/app/admin/components/PaginationControls";
import { formatCurrency, cn } from "@/lib/utils";
import { getCategoryColor } from "@/utils/categoryColor";
import { DataTableError, DataTableEmpty } from "@/app/admin/components/DataTableStates";

// Delete Confirmation Modal 
function DeleteConfirmModal({
    itemName,
    title = "Hapus item ini?",
    onConfirm,
    onCancel,
    isDeleting,
}: {
    itemName: string;
    title?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting: boolean;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <div className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden bg-stone-50 border border-secondary animate-in fade-in zoom-in-95 duration-200">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    disabled={isDeleting}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-50"
                >
                    <X size={18} />
                </button>

                {/* Body */}
                <div className="px-6 pt-8 pb-5 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-100 border-2 border-red-200">
                        <AlertTriangle size={30} className="text-red-600" />
                    </div>

                    <h2 className="text-xl font-bold text-primary-40">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-secondary-50">
                        Kamu akan menghapus{" "}
                        <span className="font-semibold text-primary">
                            &ldquo;{itemName}&rdquo;
                        </span>
                        . Tindakan ini tidak dapat dibatalkan.
                    </p>
                </div>

                {/* Divider */}
                <div className="mx-6 h-px bg-secondary" />

                {/* Actions */}
                <div className="px-6 py-5 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-secondary hover:bg-secondary-10 text-primary-40 border border-secondary-10 transition-all duration-200 active:scale-95 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                                Menghapus...
                            </>
                        ) : (
                            <>
                                <Trash2 size={15} />
                                Ya, Hapus
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main Page 
export default function DaftarMenuPage() {
    const {
        items = [], 
        isLoading,
        isError,
        refetch,
        toggleStatus,
        isToggling,
        deleteItem,
        isDeleting
    } = useAdminMenu({page: 1, perPage: 1000});

    // Hook Pagination Standar
    const { currentPage, entriesPerPage, handlePageChange, handleEntriesChange } = useTablePagination(1, 10);

    // Delete modal state
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

    // Kalkulasi Data Pagination
    const { paginatedData, totalPages, totalEntries } = calculatePagination(
        items,
        currentPage,
        entriesPerPage
    );

    const handleDelete = (item: AdminMenuItem) => {
        setDeleteTarget({ id: item.id, name: item.name });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            deleteItem(deleteTarget.id);
            setDeleteTarget(null);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <DeleteConfirmModal
                    itemName={deleteTarget.name}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                    isDeleting={isDeleting}
                />
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">Daftar Menu</h1>
                    <p className="text-sm text-stone-500 mt-1">
                        Kelola item makanan dan minuman restoran
                    </p>
                </div>
                <Link href="/admin/menu/tambah">
                    <button className="flex items-center gap-2 bg-primary text-white hover:bg-primary-30 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm active:scale-95">
                        <Plus size={18} />
                        Tambah Menu
                    </button>
                </Link>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-stone-50">
                                {["NO", "GAMBAR", "NAMA ITEM", "DESKRIPSI", "HARGA", "KATEGORI", "STATUS", "AKSI"].map((h) => (
                                    <th
                                        key={h}
                                        className="px-6 py-4 text-left text-xs font-bold text-stone-500 tracking-wider border-b border-stone-200"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {isError && <DataTableError message="Gagal memuat data menu." onRetry={() => refetch()} colSpan={8} />}
                            {!isError && isLoading && Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {Array.from({ length: 8 }).map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {!isError && !isLoading && totalEntries === 0 && (
                                <DataTableEmpty message="Tidak ada data menu yang ditemukan." colSpan={8} />
                            )}
                            {!isError && !isLoading && paginatedData.map((item: AdminMenuItem, idx: number) => (
                                <tr key={item.id} className="hover:bg-stone-50/50 transition-colors duration-150 group">
                                    <td className="px-6 py-4 text-sm text-stone-500">
                                        {(currentPage - 1) * entriesPerPage + idx + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.img ? (
                                            <img
                                                src={item.img}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://placehold.co/100x100/f5f5f5/a8a29e?text=No+Img";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center text-xl">
                                                🍽️
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-stone-900">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-stone-500 max-w-[200px] truncate">
                                        {item.description || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-primary-50 whitespace-nowrap">
                                        {formatCurrency(parseFloat(item.price))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap", getCategoryColor(item.category?.name))}>
                                            {item.category?.name ?? "-"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(item)}
                                            disabled={isToggling}
                                            className={cn(
                                                "relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-10",
                                                item.is_active === 1 ? "bg-green-500" : "bg-red-500",
                                                isToggling ? "opacity-50 cursor-wait" : "cursor-pointer"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm",
                                                    item.is_active === 1 ? "translate-x-5" : "translate-x-0"
                                                )}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/menu/edit/${item.id}`}>
                                                <button className="p-2 text-[#D97706] hover:bg-primary-10/20 rounded-md transition-colors">
                                                    <Pencil size={18} />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item)}
                                                disabled={isDeleting}
                                                className="p-2 text-[#DC2626] hover:bg-primary-10/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait"
                                            >
                                                <Trash2 size={18} />
                                            </button>
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
                        entriesOptions={[10, 25, 50]}
                        onPageChange={(page) => handlePageChange(page, totalPages)}
                        onEntriesChange={handleEntriesChange}
                    />
                )}
            </div>
        </div>
    );
}