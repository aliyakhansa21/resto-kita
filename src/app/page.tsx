"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Utensils, ShoppingBag } from "lucide-react";
import { Navbar }          from "@/app/components/shared/Navbar";
import { Footer }          from "@/app/components/shared/Footer";
import { MenuCard }        from "@/app/components/features/menu/MenuCard";
import { CategoryFilter }  from "@/app/components/features/menu/CategoryFilter";
import { SearchBar }       from "@/app/components/features/menu/SearchBar";
import { CartModal }      from "@/app/components/features/cart/CartModal";
import { FindUs }          from "@/app/components/features/menu/FindUs";
import { Button }          from "@/app/components/ui/Button";
import { useMenu }         from "@/hooks/useMenu";
import { useCart }         from "@/context/CartContext";
import type { MenuItem }   from "@/types";


function MenuContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const urlToken = searchParams.get("token");
    const urlTable = searchParams.get("table");

    const [categoryId, setCategoryId] = useState("all");
    const [search, setSearch] = useState("");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [tableToken, setTableToken] = useState("");
    const [tableNumber, setTableNumber] = useState("");

    useEffect(() => {
        const bootstrap = async () => {
            if (urlToken) {
                // Simpan ke sessionStorage, lalu bersihkan URL
                sessionStorage.setItem("tableToken", urlToken);
                if (urlTable) sessionStorage.setItem("tableNumber", urlTable);

                setTableToken(urlToken);
                setTableNumber(urlTable ?? "");

                // Hapus token & table dari URL
                router.replace("/");
                return;
            }

            const storedToken = sessionStorage.getItem("tableToken");
            const storedTable = sessionStorage.getItem("tableNumber");

            if (storedToken) {
                setTableToken(storedToken);
                setTableNumber(storedTable ?? "");
                return;
            }
        };

        bootstrap();
    }, []);

    // Data fetching + client-side filter
    const { menuItems, categories, isLoading, isError, error } = useMenu({
        categoryId,
        search,
    });

    // Cart state from context (frontend-only)
    const {
        items: cartItems,
        removeItem,
        updateQty,
        totalItems,
        totalPrice,
    } = useCart();

    const handleSearch = useCallback((val: string) => setSearch(val), []);

    return (
        <>
        <Navbar
            tableNumber={tableNumber}
            cartCount={totalItems}
            onCartClick={() => setIsCartOpen(true)}
        />

        <main>
            {/* Hero */}
            <section className="hero-background text-white text-center px-6 pt-16 relative">
                <div className="w-16 h-16 rounded-full backdrop-blur-figma flex items-center justify-center mb-6 shadow-lg z-10 mx-auto">
                    <Utensils size={30} className="text-white" />
                </div>
                <h1 className="text-5xl font-bold mb-3 tracking-tight">Our Restaurant</h1>
                <p className="text-white/80 italic text-lg mb-8">
                    Delicious Moments, Made Just for You
                </p>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() =>
                        document.getElementById("menu-catalog")?.scrollIntoView({ behavior: "smooth" })
                    }
                >
                    Explore Menu
                </Button>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-1 animate-bounce">
                    <ChevronDown size={20} />
                    <ChevronDown size={20} className="-mt-3" />
                </div>
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase text-white/40">
                    Scroll to Explore
                </p>
            </section>

            {/* Catalog */}
            <section
                id="menu-catalog"
                className="bg-[#FAF7F2] min-h-screen px-4 sm:px-6 lg:px-8 py-12 mx-auto"
            >
                {/* Filter row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <SearchBar onSearch={handleSearch} />
                    <CategoryFilter
                        categories={categories}
                        activeId={categoryId}
                        onChange={setCategoryId}
                    />
                </div>

                {/* Loading skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-44 bg-stone-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                                    <div className="h-3 bg-stone-100 rounded w-full" />
                                    <div className="h-3 bg-stone-100 rounded w-2/3" />
                                    <div className="h-4 bg-stone-200 rounded w-1/3 mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error state */}
                {isError && (() => {
                    const isSessionError = error?.message
                        ?.toLowerCase()
                        .includes("tablesession");

                    return isSessionError ? (
                        /* ── Sesi meja tidak valid ── */
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="bg-white rounded-3xl shadow-lg border border-amber-100 max-w-md w-full p-8 text-center">
                                {/* Icon */}
                                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
                                    <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                </div>

                                {/* Title */}
                                <h2 className="text-xl font-bold text-stone-800 mb-2">
                                    Sesi Meja Tidak Valid
                                </h2>

                                {/* Description */}
                                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                                    Kami tidak dapat menemukan sesi untuk meja ini. Kemungkinan link QR sudah kadaluarsa atau belum diaktifkan oleh kasir.
                                </p>

                                {/* Steps */}
                                <div className="bg-amber-50 rounded-2xl p-4 text-left space-y-3 mb-6">
                                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Yang bisa kamu lakukan:</p>
                                    <div className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                                        <p className="text-sm text-stone-600">Scan ulang QR code yang ada di meja kamu</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                                        <p className="text-sm text-stone-600">Atau minta bantuan kasir untuk mengaktifkan sesi meja</p>
                                    </div>
                                </div>

                                {/* Reload button */}
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-md shadow-amber-200"
                                >
                                    Coba Lagi
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* ── Error umum ── */
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="bg-white rounded-3xl shadow-lg border border-red-100 max-w-md w-full p-8 text-center">
                                {/* Icon */}
                                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                                    <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007v.008H12V16.5zm9.75-.75a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z" />
                                    </svg>
                                </div>

                                {/* Title */}
                                <h2 className="text-xl font-bold text-stone-800 mb-2">
                                    Gagal Memuat Menu
                                </h2>

                                {/* Description */}
                                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                                    Terjadi kesalahan saat mengambil data menu. Periksa koneksi internet kamu dan coba lagi.
                                </p>

                                {/* Error detail (collapsible hint) */}
                                {error?.message && (
                                    <p className="text-xs text-red-300 bg-red-50 rounded-xl px-4 py-2 font-mono mb-6 break-all">
                                        {error.message}
                                    </p>
                                )}

                                {/* Reload button */}
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full py-3 px-6 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-md shadow-red-200"
                                >
                                    Muat Ulang Halaman
                                </button>
                            </div>
                        </div>
                    );
                })()}

                {/* Empty state */}
                {!isLoading && !isError && menuItems.length === 0 && (
                    <div className="text-center py-20 text-stone-400">
                        <p className="text-lg">Menu tidak ditemukan</p>
                        <p className="text-sm mt-1">Coba kata kunci atau kategori lain</p>
                    </div>
                )}

                {/* Menu grid */}
                {!isLoading && !isError && menuItems.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {menuItems.map((item: MenuItem) => (
                            <MenuCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </section>

            {/* Find Us */}
            <FindUs />
        </main>

        {/* Floating Cart Button — hanya muncul jika ada item */}
        {totalItems > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6">
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="w-full bg-primary text-white py-4 px-8 rounded-full flex items-center justify-between shadow-2xl transition-all active:scale-95 hover:bg-primary-30"
                >
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={20} />
                        <span className="font-semibold">
                            View Cart ({totalItems} item{totalItems > 1 ? "s" : ""})
                        </span>
                    </div>
                    <span className="font-bold pl-4 border-l border-white/20">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalPrice)}
                    </span>
                </button>
            </div>
        )}

        <Footer />

        <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            totalItems={totalItems}
            totalPrice={totalPrice}
            onUpdateQty={updateQty}
            onRemove={removeItem}
            tableToken={tableToken}
            tableNumber={tableNumber}
        />
        </>
    );
}

export default function MenuPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#8A5E3D0D] text-primary-50">
                Memuat menu...
            </div>
        }>
            <MenuContent />
        </Suspense>
    );
}
