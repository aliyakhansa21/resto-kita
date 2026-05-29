"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/useOrders";
import OrderCard from "@/app/components/features/orders/OrderCard";
import { Navbar } from "@/app/components/shared/Navbar";
import { Footer } from "@/app/components/shared/Footer";
import { AlertTriangle, UtensilsCrossed, RefreshCw } from "lucide-react"; 

const fmt = (val: number): string => "Rp" + val.toLocaleString("id-ID").replace(/,/g, ".");

export default function OrdersPage() {
    const router = useRouter();

    const [tableNumber, setTableNumber] = useState("");
    const [token, setToken] = useState("");
    const [isSessionReady, setIsSessionReady] = useState(false);

    useEffect(() => {
        const storedToken = sessionStorage.getItem("tableToken") ?? "";
        const storedTable = sessionStorage.getItem("tableNumber") ?? "";
        setToken(storedToken);
        setTableNumber(storedTable);
        setIsSessionReady(true);
    }, []);

    const { orders, loading, error, grandTotal, refetch } = useOrders();

    // Logika Gatekeeper
    const isMissingToken = isSessionReady && !token;
    const isBackendSessionError = error?.toLowerCase().includes("tablesession");
    const showInvalidSessionUI = isMissingToken || isBackendSessionError;

    return (
        <div className="min-h-screen flex flex-col bg-[#8A5E3D0D]">
            <Navbar
                tableNumber={tableNumber}
                cartCount={0}
                onCartClick={() => {}}
            />

            <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-24">
                <h1 className="text-h2 text-primary-50 mb-1">Your Orders</h1>
                <p className="text-base text-primary mb-8">
                    Tracking your dining experience
                </p>

                {/* Loading State untuk mengecek sesi */}
                {!isSessionReady && (
                    <div className="flex justify-center items-center py-20 text-stone-500 font-medium animate-pulse">
                        Memeriksa sesi pesanan...
                    </div>
                )}

                {/* Sesi Tidak Valid (Gatekeeper) */}
                {showInvalidSessionUI && (
                    <div className="flex flex-col items-center justify-center py-10 px-4">
                        <div className="bg-white rounded-3xl shadow-lg border border-amber-100 max-w-md w-full p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
                                <AlertTriangle size={40} className="text-amber-500" />
                            </div>
                            <h2 className="text-xl font-bold text-stone-800 mb-2">Sesi Meja Tidak Valid</h2>
                            <p className="text-stone-500 text-sm leading-relaxed mb-6">
                                Kamu tidak dapat melihat pesanan karena sesi meja belum aktif atau tidak valid. Silakan scan QR code di meja kamu terlebih dahulu.
                            </p>
                            <button
                                onClick={() => router.push("/")}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md shadow-amber-200"
                            >
                                Kembali ke Beranda
                            </button>
                        </div>
                    </div>
                )}

                {/* Konten Utama (Hanya Tampil Jika Sesi Valid) */}
                {isSessionReady && !showInvalidSessionUI && (
                    <>
                        {/* Loading Orders */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <p className="text-base text-secondary-50 animate-pulse">
                                    Memuat pesanan...
                                </p>
                            </div>
                        )}

                        {/* Error Fetching (Bukan masalah Token) */}
                        {!loading && error && !isBackendSessionError && (
                            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                <div className="bg-white rounded-3xl shadow-lg border border-red-100 max-w-md w-full p-8 text-center">
                                    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                                        <AlertTriangle size={40} className="text-red-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-stone-800 mb-2">Gagal Memuat Pesanan</h2>
                                    <p className="text-stone-500 text-sm leading-relaxed mb-6">{error}</p>
                                    <button
                                        onClick={refetch}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-md shadow-red-200"
                                    >
                                        <RefreshCw size={18} />
                                        Coba Lagi
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Empty State (Belum ada pesanan) */}
                        {!loading && !error && orders.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                <div className="bg-white rounded-3xl shadow-lg border border-stone-100 max-w-md w-full p-8 text-center">
                                    <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center mx-auto mb-5">
                                        <UtensilsCrossed size={40} className="text-stone-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-stone-800 mb-2">Belum Ada Pesanan</h2>
                                    <p className="text-stone-500 text-sm leading-relaxed mb-6">
                                        Kamu belum memesan menu apapun. Yuk, lihat menu lezat kami dan mulai pesan sekarang!
                                    </p>
                                    <button
                                        onClick={() => router.push(`/menu`)}
                                        className="w-full bg-primary text-white font-bold text-sm rounded-xl px-6 py-3 hover:bg-primary-10 transition-colors shadow-md shadow-primary/20"
                                    >
                                        Lihat Menu
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Order List */}
                        {!loading && !error && orders.length > 0 && (
                            <div className="flex flex-col gap-4">
                                {orders.map((order, i) => (
                                    <OrderCard key={order.id} order={order} index={i + 1} />
                                ))}

                                {/* Summary & Actions */}
                                <div className="bg-white rounded-3xl shadow-sm p-5 mt-2">
                                    <div className="flex justify-between text-base text-[#475569] mb-2">
                                        <span>Subtotal</span>
                                        <span>{fmt(grandTotal)}</span>
                                    </div>
                                    <div className="flex justify-between font-black text-h4 text-[#0F172A] pb-4">
                                        <span>Total</span>
                                        <span className="text-[#0F172A]">{fmt(grandTotal)}</span>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() => router.push(`/`)}
                                            className="flex-1 border-2 border-primary text-primary font-bold text-sm sm:text-base rounded-full py-3 flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all"
                                        >
                                            <span>+</span> Add More Items
                                        </button>

                                        <button
                                            onClick={() => router.push(`/checkout`)}
                                            className="flex-1 bg-primary text-white font-bold text-sm sm:text-base rounded-full py-3 flex items-center justify-center gap-2 hover:bg-primary-10 transition-colors"
                                        >
                                            <span>✓</span> Proceed Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}