"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, X, Save, AlertTriangle } from "lucide-react";
import { useAdminCategories } from "@/hooks/useAdminCategories";
import { useTablePagination, calculatePagination } from "@/hooks/useTablePagination";
import { PaginationControls } from "@/app/admin/components/PaginationControls";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import { DataTableLoading } from "@/app/admin/components/DataTableLoading";
import { DataTableError, DataTableEmpty } from "@/app/admin/components/DataTableStates";

type ModalMode = "add" | "edit" | null;

// Delete Confirmation Modal 
function DeleteConfirmModal({
    itemName,
    onConfirm,
    onCancel,
    isDeleting,
}: {
    itemName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting: boolean;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-40/50 backdrop-blur-sm"
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
                        Hapus Kategori?
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

export default function ManajemenKategoriPage() {
    const {
        categories,
        isLoading,
        isError,
        refetch,
        createCategory,
        updateCategory,
        deleteCategory,
        isCreating,
        isUpdating,
        isDeleting
    } = useAdminCategories();

    // Hook Pagination
    const { currentPage, entriesPerPage, handlePageChange, handleEntriesChange } = useTablePagination(1, 10);

    // States for Client-Side Filtering
    const [search, setSearch] = useState("");

    // States for Modal
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [modalData, setModalData] = useState({ name: "", description: "" });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [modalErrors, setModalErrors] = useState<Record<string, string>>({});

    // States for Delete Modal
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

    // Filtering & Pagination Logic
    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.description ?? "").toLowerCase().includes(search.toLowerCase())
    );

    const { paginatedData, totalPages, totalEntries } = calculatePagination(
        filtered,
        currentPage,
        entriesPerPage
    );

    // Modal Handlers
    const openAdd = () => {
        setModalData({ name: "", description: "" });
        setEditingId(null);
        setModalErrors({});
        setModalMode("add");
    };

    const openEdit = (cat: Category) => {
        setModalData({ name: cat.name, description: cat.description ?? "" });
        setEditingId(cat.id);
        setModalErrors({});
        setModalMode("edit");
    };

    const closeModal = () => {
        setModalMode(null);
        setModalErrors({});
    };

    const validateModal = () => {
        const errs: Record<string, string> = {};
        if (!modalData.name.trim()) errs.name = "Nama kategori wajib diisi";
        return errs;
    };

    const handleSave = async () => {
        const errs = validateModal();
        if (Object.keys(errs).length > 0) {
            setModalErrors(errs);
            return;
        }

        try {
            if (modalMode === "add") {
                await createCategory(modalData);
            } else if (modalMode === "edit" && editingId !== null) {
                await updateCategory({ id: editingId, payload: modalData });
            }
            closeModal();
            handlePageChange(1, totalPages); // Reset ke halaman pertama setelah simpan
        } catch (err: any) {
            alert(err.message || "Gagal menyimpan kategori.");
        }
    };

    const handleDelete = (cat: Category) => {
        setDeleteTarget({ id: cat.id, name: cat.name });
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteCategory(deleteTarget.id);
            setDeleteTarget(null);
        } catch (err: any) {
            alert(err.message || "Gagal menghapus kategori.");
            setDeleteTarget(null);
        }
    };

    const isSaving = isCreating || isUpdating;

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
                    <h1 className="text-2xl font-bold text-stone-900">Manajemen Kategori</h1>
                    <p className="text-sm text-stone-500 mt-1">Kelola kategori produk Anda di sini.</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-primary text-white hover:bg-primary-30 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm active:scale-95"
                >
                    <Plus size={18} />
                    Tambah Kategori
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                {/* Controls */}
                <div className="px-6 py-4 border-b border-stone-100 flex flex-wrap items-center justify-end gap-4 bg-stone-50/50">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                handlePageChange(1, totalPages); // Reset page saat mencari
                            }}
                            placeholder="Cari kategori..."
                            className="pl-9 pr-4 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-10 w-full sm:w-64"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-stone-50">
                                {["NO", "NAMA KATEGORI", "DESKRIPSI", "AKSI"].map((h) => (
                                    <th
                                        key={h}
                                        className="px-6 py-4 text-left text-xs font-bold text-[0F172A] tracking-wider border-b border-stone-200"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {isError && <DataTableError message="Gagal memuat data kategori." onRetry={() => refetch()} colSpan={4} />}
                            {!isError && isLoading && Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {Array.from({ length: 4 }).map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {!isError && !isLoading && totalEntries === 0 && (
                                <DataTableEmpty 
                                    message={search ? "Kategori tidak ditemukan." : "Belum ada kategori."} 
                                    colSpan={4} 
                                />
                            )}
                            {!isError && !isLoading && paginatedData.map((cat: Category, idx: number) => (
                                <tr key={cat.id} className="hover:bg-stone-50/50 transition-colors duration-150 group">
                                    <td className="px-6 py-4 text-sm text-stone-500 w-16">
                                        {(currentPage - 1) * entriesPerPage + idx + 1}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-stone-900">
                                        {cat.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-stone-500">
                                        {cat.description || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEdit(cat)}
                                                className="p-2 text-stone-400 hover:text-primary-50 hover:bg-primary-10/20 rounded-md transition-colors"
                                                title="Edit Kategori"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat)}
                                                disabled={isDeleting}
                                                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait"
                                                title="Hapus Kategori"
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

            {/* Modal Overlay */}
            {modalMode && (
                <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100">
                            <h2 className="text-lg font-bold text-stone-900">
                                {modalMode === "add" ? "Tambah Kategori" : "Edit Kategori"}
                            </h2>
                            <button onClick={closeModal} className="text-stone-400 hover:text-stone-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 tracking-wider mb-2">NAMA KATEGORI</label>
                                <input
                                    value={modalData.name}
                                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                                    placeholder="Cth: Foods"
                                    autoFocus
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-10 transition-colors",
                                        modalErrors.name ? "border-red-500" : "border-stone-300"
                                    )}
                                />
                                {modalErrors.name && (
                                    <p className="text-red-500 text-xs font-medium mt-1.5">{modalErrors.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 tracking-wider mb-2">DESKRIPSI (Opsional)</label>
                                <textarea
                                    value={modalData.description}
                                    onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                                    placeholder="Cth: Semua jenis makanan utama"
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-10 transition-colors resize-y"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                            >
                                <Save size={16} />
                                {isSaving ? "Menyimpan..." : "Simpan Kategori"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}