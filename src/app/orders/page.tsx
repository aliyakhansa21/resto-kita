"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useOrders } from "@/hooks/useOrders";
import OrderCard from "@/app/components/features/orders/OrderCard";
import { Navbar } from "@/app/components/shared/Navbar";
import { Footer } from "@/app/components/shared/Footer";

const fmt = (val: number): string => "Rp" + val.toLocaleString("id-ID").replace(/,/g, ".");

export default function OrdersPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token") ?? "";
    const tableNumber = searchParams.get("table") ?? "07";

    const { orders, loading, error, grandTotal, refetch } = useOrders();

    return (
        <div className="min-h-screen flex flex-col bg-[#8A5E3D0D]">
            <Navbar 
                tableNumber={tableNumber} 
                cartCount={0} 
                onCartClick={() => console.log("Cart clicked from Orders page")} 
            />

            <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-24">
                <h1 className="text-h2 text-primary-50 mb-1">Your Orders</h1>
                <p className="text-base text-primary mb-8">
                Tracking your dining experience
                </p>

                {/* Loading */}
                {loading && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-base text-secondary-50 animate-pulse">
                    Memuat pesanan...
                    </p>
                </div>
                )}

                {/* Error */}
                {!loading && error && (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                    <span className="text-5xl">😕</span>
                    <p className="font-bold text-base text-primary-50">{error}</p>
                    <button
                    onClick={refetch}
                    className="bg-primary text-white font-bold text-base rounded-xl px-6 py-3 hover:bg-primary-10 transition-colors"
                    >
                    Coba Lagi
                    </button>
                </div>
                )}

                {/* Empty */}
                {!loading && !error && orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                    <span className="text-5xl">🍽️</span>
                    <p className="font-bold text-base text-primary-50">
                    Belum ada pesanan
                    </p>
                    <button
                    onClick={() => router.push(`/menu?token=${token}&table=${tableNumber}`)}
                    className="bg-primary text-white font-bold text-base rounded-xl px-6 py-3 hover:bg-primary-10 transition-colors"
                    >
                    Lihat Menu
                    </button>
                </div>
                )}

                {/* Order List */}
                {!loading && !error && orders.length > 0 && (
                <div className="flex flex-col gap-4">
                    {/* Order cards */}
                    {orders.map((order, i) => (
                    <OrderCard key={order.id} order={order} index={i + 1} />
                    ))}

                    {/* Summary & Actions */}
                    <div className="bg-white rounded-3xl shadow-sm p-5 mt-2">
                        <div className="flex justify-between text-base text-[#475569] mb-2">
                            <span>Subtotal</span>
                            <span>{fmt(grandTotal)}</span>
                        </div>
                        <div className="flex justify-between font-black text-h4 text-[#0F172A] pb-4 ">
                            <span>Total</span>
                            <span className="text-[#0F172A]">{fmt(grandTotal)}</span>
                        </div>

                        <div className="flex gap-3 mt-4">
                            {/* Tambah pesanan → balik ke menu */}
                            <button
                            onClick={() =>
                                router.push(`/menu?token=${token}&table=${tableNumber}`)
                            }
                            className="flex-1 border-2 border-primary text-primary font-bold text-base rounded-full py-3 flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all"
                            >
                            <span>+</span> Add More Items
                            </button>

                            {/* Lanjut ke checkout */}
                            <button
                            onClick={() =>
                                router.push(`/checkout?token=${token}&table=${tableNumber}`)
                            }
                            className="flex-1 bg-primary text-white font-bold text-base rounded-full py-3 flex items-center justify-center gap-2 hover:bg-primary-10 transition-colors"
                            >
                            <span>✓</span> Confirm & Proceed
                            </button>
                        </div>
                    </div>
                </div>
                )}
            </main>

            <Footer />
        </div>
    );
}