"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

const FALLBACK = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";

interface CartItemProps {
    item: CartItemType;
    onUpdateQty: (id: string, qty: number) => void;
    onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQty, onRemove }: CartItemProps) {
    const { menuItem, quantity } = item;

    const imageUrl = menuItem.imageUrl?.startsWith("http")
        ? menuItem.imageUrl
        : FALLBACK;

    return (
        <div className="flex items-center gap-3 py-3 border-b border-stone-100 last:border-0">
            {/* Thumbnail */}
            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                <img
                    src={imageUrl}
                    alt={menuItem.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = FALLBACK; }}
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">
                {menuItem.name}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                {formatCurrency(menuItem.price)}
                </p>
            </div>

            {/* Qty controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                onClick={() => onUpdateQty(menuItem.id, quantity - 1)}
                className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100 transition-colors"
                aria-label="Kurangi jumlah"
                >
                    <Minus size={12} />
                    </button>
                        <span className="text-sm font-bold w-5 text-center">{quantity}</span>
                    <button
                    onClick={() => onUpdateQty(menuItem.id, quantity + 1)}
                    className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center hover:bg-amber-800 transition-colors"
                    aria-label="Tambah jumlah"
                    >
                    <Plus size={12} />
                </button>
            </div>

            {/* Subtotal + delete */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-sm font-bold text-stone-800">
                {formatCurrency(menuItem.price * quantity)}
                </span>
                <button
                onClick={() => onRemove(menuItem.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
                aria-label={`Hapus ${menuItem.name} dari keranjang`}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}