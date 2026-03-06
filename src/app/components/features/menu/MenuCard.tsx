"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/types";

interface MenuCardProps {
    item: MenuItem;
    onAddToCart: (item: MenuItem) => void;
}

// Warna badge berdasarkan nama kategori (case-insensitive fallback)
// Perlu update menyesuaikan data dari backend
function getCategoryColor(name: string): string {
    const n = name.toLowerCase();
    if (n.includes("food"))    return "bg-primary text-white";
    if (n.includes("drink"))   return "bg-accent-10 text-white";
    if (n.includes("dessert")) return "bg-primary-10 text-white";
    return "bg-secondary-50 text-white";
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
    const validImageUrl = item.imageUrl?.startsWith('http') 
        ? item.imageUrl 
        : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'; 

    return (
        <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
            {/* Image */}
            <div className="relative w-full h-44 overflow-hidden">
                <Image
                    // src={item.imageUrl}
                    src={validImageUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                        onClick={() => onAddToCart(item)}
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