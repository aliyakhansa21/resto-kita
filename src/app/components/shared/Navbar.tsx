"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    const [hasSession, setHasSession] = useState(false);

    // Cek apakah ada token sesi meja di sessionStorage
    useEffect(() => {
        const token = sessionStorage.getItem("tableToken");
        setHasSession(!!token);
    }, []);

    const handleOrdersClick = () => {
        const token = sessionStorage.getItem("tableToken") ?? "";
        if (token) {
            router.push(`/orders`);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#FFFFFF] backdrop-blur-md border-b border-stone-200">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-stone-800">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                    <Utensils size={16} />
                </span>
                <span className="text-sm hidden sm:block">Our Restaurant</span>
            </Link>

            {/* Right: Table + Orders icon */}
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-right flex flex-col items-end">
                    <p className="text-[9px] sm:text-[10px] text-stone-400 uppercase tracking-widest leading-none">
                        Your Table
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-stone-800 leading-tight">
                        {tableNumber ? `TABLE ${tableNumber}` : "NO TABLE"}
                    </p>
                </div>

                {/* TAMPILKAN TOMBOL ORDER HANYA JIKA ADA SESI MEJA */}
                {hasSession && (
                    <button
                        onClick={handleOrdersClick}
                        className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-white hover:bg-primary-30 transition-colors"
                        aria-label="Lihat pesanan"
                    >
                        <Scroll size={16} className="sm:w-[18px] sm:h-[18px]" />
                        {/* Badge jumlah item di cart (kalau ada) */}
                        {/* {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                {totalItems}
                            </span>
                        )} */}
                    </button>
                )}
            </div>
        </nav>
    );
}