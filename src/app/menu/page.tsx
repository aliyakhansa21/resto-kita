"use client";

import { useState, useCallback } from "react";
import { ChevronDown, Utensils } from "lucide-react";
import { Navbar }          from "@/app/components/shared/Navbar";
import { Footer }          from "@/app/components/shared/Footer";
import { MenuCard }        from "@/app/components/features/menu/MenuCard";
import { CategoryFilter }  from "@/app/components/features/menu/CategoryFilter";
import { SearchBar }       from "@/app/components/features/menu/SearchBar";
import { CartDrawer }      from "@/app/components/features/cart/CartDrawer";
import { Button }          from "@/app/components/ui/Button";
import { useMenu }         from "@/hooks/useMenu";
import { useCart }         from "@/hooks/useCart";
import { formatCurrency }  from "@/lib/utils";
import type { MenuItem }   from "@/types";

const TABLE_NUMBER = "07";

export default function MenuPage() {
    const [categoryId, setCategoryId] = useState("all");
    const [search,     setSearch]     = useState("");
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Data fetching + client-side filter
    const { menuItems, categories, isLoading, isError, error } = useMenu({
        categoryId,
        search,
    });

    // Cart state
    const {
        items: cartItems,
        addItem,
        removeItem,
        updateQty,
        submitOrder,
        isSubmitting,
        totalItems,
        totalPrice,
    } = useCart(TABLE_NUMBER);

    const handleSearch = useCallback((val: string) => setSearch(val), []);

    const handleSubmitOrder = useCallback(async () => {
        try {
        await submitOrder();
        setIsCartOpen(false);
        } catch (err) {
        console.error("Order failed:", err);
        }
    }, [submitOrder]);

    return (
        <>
        <Navbar
            tableNumber={TABLE_NUMBER}
            cartCount={totalItems}
            onCartClick={() => setIsCartOpen(true)}
        />

        <main>
            {/* Hero */}          
            <section className="hero-background text-white text-center px-6 pt-16">
                <div className="w-16 h-16 rounded-full backdrop-blur-figma flex items-center justify-center mb-6 shadow-lg z-10">
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
                <div className="absolute bottom-8 text-white/60 flex flex-col items-center gap-1 animate-bounce">
                    <ChevronDown size={20} />
                    <ChevronDown size={20} className="-mt-3" />
                </div>
                <p className="absolute bottom-4 text-[10px] tracking-widest uppercase text-white/40">
                    Scroll to Explore
                </p>
            </section>

                {/* Catalog */}
            <section
                id="menu-catalog"
                className="bg-[#FAF7F2] min-h-screen px-4 sm:px-6 lg:px-8 py-12 mx-auto"
                >
                {/* Filter row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
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
                {isError && (
                    <div className="text-center py-20 text-red-500">
                    <p className="text-lg font-semibold">Gagal memuat menu</p>
                    <p className="text-sm text-red-400 mt-1">{error?.message}</p>
                    </div>
                )}

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
                        <MenuCard key={item.id} item={item} onAddToCart={addItem} />
                    ))}
                    </div>
                )}
            </section>
        </main>
        <Footer />

        {/* Floating cart bar */}
        {totalItems > 0 && !isCartOpen && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
                <Button
                    variant="cart"
                    size="lg"
                    onClick={() => setIsCartOpen(true)}
                    className="shadow-xl px-8 gap-3"
                >
                    <span className="text-sm">🛒</span>
                    View Cart ({totalItems} items) • {formatCurrency(totalPrice)}
                </Button>
            </div>
        )}

        <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            totalItems={totalItems}
            totalPrice={totalPrice}
            onUpdateQty={updateQty}
            onRemove={removeItem}
            onSubmitOrder={handleSubmitOrder}
            isSubmitting={isSubmitting}
            tableNumber={TABLE_NUMBER}
        />
        </>
    );
}