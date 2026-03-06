"use client";

import { useEffect } from "react";
import { X, ShoppingCart } from "lucide-react";
import { CartItem } from "./CartItem";
import { Button } from "@/app/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItemType[];
    totalItems: number;
    totalPrice: number;
    onUpdateQty: (id: string, qty: number) => void;
    onRemove: (id: string) => void;
    onSubmitOrder: () => Promise<void>;
    isSubmitting?: boolean;
    tableNumber?: string;
}

export function CartDrawer({
    isOpen,
    onClose,
    items,
    totalItems,
    totalPrice,
    onUpdateQty,
    onRemove,
    onSubmitOrder,
    isSubmitting = false,
    tableNumber = "07",
    }: CartDrawerProps) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <>
        {/* Backdrop */}
        <div
            onClick={onClose}
            className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden="true"
        />

        {/* Drawer panel */}
        <aside
            role="dialog"
            aria-modal="true"
            aria-label="Keranjang belanja"
            className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-amber-700" />
                <h2 className="font-bold text-stone-800 text-lg">Keranjang</h2>
                {totalItems > 0 && (
                <span className="bg-amber-700 text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {totalItems}
                </span>
                )}
            </div>
            <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors"
                aria-label="Tutup keranjang"
            >
                <X size={18} />
            </button>
            </div>

            {/* Table info */}
            <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-100">
            <p className="text-xs text-stone-500">
                Meja: <span className="font-bold text-stone-700">TABLE {tableNumber}</span>
            </p>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-2">
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-400">
                <ShoppingCart size={48} strokeWidth={1} />
                <p className="text-sm">Keranjang masih kosong</p>
                <p className="text-xs text-stone-300">Tambahkan menu favoritmu!</p>
                </div>
            ) : (
                items.map((item) => (
                <CartItem
                    key={item.menuItem.id}
                    item={item}
                    onUpdateQty={onUpdateQty}
                    onRemove={onRemove}
                />
                ))
            )}
            </div>

            {/* Footer: total + submit */}
            {items.length > 0 && (
            <div className="px-5 py-5 border-t border-stone-100 space-y-3">
                <div className="flex items-center justify-between">
                <span className="text-stone-500 text-sm">Total</span>
                <span className="font-bold text-stone-800 text-lg">
                    {formatCurrency(totalPrice)}
                </span>
                </div>
                <Button
                variant="primary"
                size="lg"
                className="w-full rounded-full"
                onClick={onSubmitOrder}
                disabled={isSubmitting}
                >
                {isSubmitting ? "Memproses..." : `Pesan Sekarang • ${formatCurrency(totalPrice)}`}
                </Button>
            </div>
            )}
        </aside>
        </>
    );
}