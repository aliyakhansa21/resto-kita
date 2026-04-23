"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminMenu, type AdminMenuItem } from "@/hooks/useAdminMenu";
import { formatCurrency, cn } from "@/lib/utils"; 
import { getCategoryColor } from "@/utils/categoryColor";

export default function DaftarMenuPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const { 
        items, 
        meta, 
        isLoading, 
        toggleStatus, 
        isToggling, 
        deleteItem, 
        isDeleting 
    } = useAdminMenu({ page: currentPage, perPage });

    const handleDelete = (id: number) => {
        if (confirm("Yakin ingin menghapus menu ini? Tindakan ini tidak dapat dibatalkan.")) {
            deleteItem(id);
        }
    };

    const pages = meta ? Array.from({ length: meta.last_page }, (_, i) => i + 1) : [];

    return (
        <div className="p-6 md:p-8 max-w-7xl 8mx-auto">
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
                {/* Controls */}
                <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-3 bg-stone-50/50">
                    <span className="text-sm text-stone-500">Show</span>
                    <select
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-10"
                    >
                        {[10, 25, 50].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                    <span className="text-sm text-stone-500">entries</span>
                </div>

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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-stone-500 animate-pulse">
                                        Memuat data menu...
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-stone-500">
                                        Tidak ada data menu yang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item: AdminMenuItem, idx: number) => (
                                    <tr key={item.id} className="hover:bg-stone-50/50 transition-colors duration-150 group">
                                        <td className="px-6 py-4 text-sm text-stone-500">
                                            {(currentPage - 1) * perPage + idx + 1}
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
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={isDeleting}
                                                    className="p-2 text-[#DC2626] hover:bg-primary-10/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta && (
                    <div className="px-6 py-4 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-stone-50/50">
                        <span className="text-sm text-stone-500">
                            Showing <span className="font-semibold text-stone-900">{meta.from ?? 0}</span> to <span className="font-semibold text-stone-900">{meta.to ?? 0}</span> of <span className="font-semibold text-stone-900">{meta.total}</span> entries
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                            <PaginationButton
                                label="Prev"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            />
                            {pages.map((p) => (
                                <PaginationButton
                                    key={p}
                                    label={String(p)}
                                    onClick={() => setCurrentPage(p)}
                                    active={p === currentPage}
                                />
                            ))}
                            <PaginationButton
                                label="Next"
                                onClick={() => setCurrentPage((p) => Math.min(meta.last_page, p + 1))}
                                disabled={currentPage === meta.last_page}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Sub-komponen untuk Pagination 
function PaginationButton({ 
    label, 
    onClick, 
    disabled, 
    active 
}: { 
    label: string; 
    onClick: () => void; 
    disabled?: boolean; 
    active?: boolean; 
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200",
                active 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50",
                disabled && "opacity-50 cursor-not-allowed hover:bg-white"
            )}
        >
            {label}
        </button>
    );
}