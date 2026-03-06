"use client";

import Link from "next/link";
import { ShoppingCart, Utensils } from "lucide-react";

export interface NavbarProps {
    tableNumber?: string;
    cartCount?: number;
    onCartClick?: () => void;
}

export function Navbar({
    tableNumber = "07",
    cartCount = 0,
    onCartClick,
    }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#FAF7F2] backdrop-blur-md border-b border-stone-200">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-stone-800">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                <Utensils size={16} />
                </span>
                <span className="text-sm">Our Restaurant</span>
            </Link>

            {/* Right: Table + Cart */}
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-none">
                        Your Table
                    </p>
                    <p className="text-sm font-bold text-stone-800 leading-tight">
                        TABLE {tableNumber}
                    </p>
                </div>

                <button
                onClick={onCartClick}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-amber-800 transition-colors"
                aria-label="Open cart"
                >
                    <ShoppingCart size={18} />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {cartCount > 9 ? "9+" : cartCount}
                        </span>
                    )}
                </button>
            </div>
        </nav>
    );
}