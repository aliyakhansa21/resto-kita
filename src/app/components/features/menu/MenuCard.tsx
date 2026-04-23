"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";
import { getCategoryColor } from "@/utils/categoryColor";

interface MenuCardProps {
    item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
    const { addToCart } = useCart();

    const validImageUrl =
        !item.imageUrl || item.imageUrl.trim() === "" || !item.imageUrl.startsWith("http")
            ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"
            : item.imageUrl;

    return (
        <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
            {/* Image */}
            <div className="relative w-full h-44 overflow-hidden">
                <img
                    src={validImageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                    }}
                />
                <div className="absolute top-3 left-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getCategoryColor(item.category.name)}`}>
                        {item.category.name}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-bold text-primary-50 text-base leading-tight mb-1">{item.name}</h3>
                <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mb-4">{item.description}</p>

                <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">
                        {formatCurrency(item.price)}
                    </span>

                    <button
                        onClick={() => addToCart(item)}
                        type="button"
                        aria-label={`Tambah ${item.name} ke keranjang`}
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-10 text-white hover:bg-primary-20 active:scale-90 transition-all duration-200 shadow-sm"
                    >
                        <ShoppingCart size={16} />
                    </button>
                </div>
            </div>
        </article>
    );
}