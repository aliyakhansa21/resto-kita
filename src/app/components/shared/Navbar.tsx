"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Scroll, Utensils } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface NavbarProps {
    tableNumber?: string;
    onCartClick: () => void;
    cartCount: number;
}

export function Navbar({ tableNumber, onCartClick, cartCount }: NavbarProps) {
    const { totalItems } = useCart();
    const router = useRouter();

    const handleOrdersClick = () => {
        const token = sessionStorage.getItem("tableToken") ?? "";
        router.push(`/orders?table=${tableNumber}&token=${token}`);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#FAF7F2] backdrop-blur-md border-b border-stone-200">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-stone-800">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                <Utensils size={16} />
            </span>
            <span className="text-sm">Our Restaurant</span>
        </Link>

        {/* Right: Table + Orders icon */}
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-none">
                    Your Table
                </p>
                <p className="text-sm font-bold text-stone-800 leading-tight">
                    TABLE {tableNumber}
                </p>
            </div>

            {/* Icon Scroll -> buka /orders */}
            <button
            onClick={handleOrdersClick}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-primary-30 transition-colors"
            aria-label="Lihat pesanan"
            >
            <Scroll size={18} />
            {/* Badge jumlah item di cart (kalau ada) */}
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {totalItems}
                </span>
            )}
            </button>
        </div>
        </nav>
    );
}