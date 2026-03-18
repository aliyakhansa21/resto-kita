"use client";

import { useEffect, useState } from "react";
import { X, ShoppingCart, ShoppingBag, Banknote, ChevronRight, Loader2 } from "lucide-react";
import { CartItem } from "./CartItem";
import { useRouter } from 'next/navigation';
import { formatCurrency } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";
import { placeOrder } from "@/lib/checkoutService";

// // API Config
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
// const getAuthHeaders = (): HeadersInit => ({
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN ?? "abc"}`,
// });

// types
interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItemType[];
    totalItems: number;
    totalPrice: number;
    onUpdateQty: (id: string, qty: number) => void;
    onRemove: (id: string) => void;
    onClearCart: () => void;
    tableToken?: string; //token sesi meja dari QR/URL
    tableNumber?: string;
}

// component
export function CartModal({
    isOpen,
    onClose,
    items,
    totalItems,
    totalPrice,
    onUpdateQty,
    onRemove,
    onClearCart,
    tableToken = "",
    tableNumber = "1",
}: CartModalProps) {
    const router = useRouter();
    const [placing, setPlacing] = useState(false);
    const [placeError, setPlaceError] = useState<string | null>(null);

    const TAX_RATE = 0.1;
    const taxAmount = totalPrice * TAX_RATE;
    const totalWithTax = totalPrice + taxAmount;

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {document.body.style.overflow = "";};
    }, [isOpen]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    // Place order -> redirect ke /orders
    const handleCheckout = async () => {
        if (!items.length) return;
        setPlacing(true);
        setPlaceError(null);

        try {
            await placeOrder({
                orders: items.map((ci) => ({
                    item_id: Number(ci.menuItem.id),
                    amount: ci.quantity,
                })),
            });

            onClearCart();
            onClose();
            router.push(`/orders?token=${tableToken}&table=${tableNumber}`);
        } catch (err) {
            setPlaceError(
                err instanceof Error ? err.message : "Gagal membuat pesanan. COba lagi."
            );
        } finally {
            setPlacing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Keranjang belanja"
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-5 pb-4">
                        <div className="flex items-center gap-2">
                            <ShoppingBag size={18} className="text-primary" />
                            <h2 className="font-bold text-primary-80 text-base tracking-tight">
                                YOUR CART
                            </h2>
                        </div>
                        <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors text-stone-500"
                        aria-label="Tutup keranjang"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Items list */}
                    <div className="flex-1 overflow-y-auto px-5 space-y-1 pb-2">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-stone-400">
                                <ShoppingCart size={48} strokeWidth={1} />
                                <p className="text-sm font-medium">Keranjang masih kosong</p>
                                <p className="text-xs text-stone-300">Tambahkan menu favoritmu!</p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <CartItem
                                    key={item.menuItem.id}
                                    item={item}
                                    onUpdateQty={onUpdateQty}
                                    onRemove={onRemove}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="px-5 pt-3 pb-5 border-t border-stone-200 space-y-2 mt-2">
                            {/* Subtotal */}
                            <div className="flex items-center justify-between text-sm text-stone-500">
                                <span>Subtotal</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>

                            {/* Tax */}
                            <div className="flex items-center justify-between text-sm text-stone-500">
                                <span>Tax (10%)</span>
                                <span>{formatCurrency(taxAmount)}</span>
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between pt-1">
                                <span className="font-bold text-stone-800 text-sm">Total Amount</span>
                                <span className="font-black text-primary text-lg">
                                    {formatCurrency(totalWithTax)}
                                </span>
                            </div>

                            {placeError && (
                                <p className="text-xs text-red-500 text-center">{placeError}</p>
                            )}

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                disabled={placing}
                                className="w-full mt-1 bg-primary hover:bg-primary-30 active:scale-[0.98] transition-all text-white font-semibold text-sm rounded-xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {placing ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin"/>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <Banknote size={16}/>
                                        Order Now
                                    </>
                                )}                                
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

//     // API helper buat nanti dipakai di halaman checkout
//     export interface SubmitOrderPayload {
//     tableNumber: string;
//     customerName: string;
//     whatsapp: string;
//     notes?: string;
//     paymentMethod: "cash" | "non-cash";
//     items: Array<{ itemId: string | number; amount: number }>;
//     }

//     export async function submitOrder(payload: SubmitOrderPayload) {
//     const res = await fetch(`${API_BASE_URL}/api/orders`, {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//         const error = await res.json().catch(() => ({}));
//         throw new Error(error?.message ?? `HTTP ${res.status}`);
//     }

//     return res.json();
//     }

//     // Ambil daftar orders
//     export async function fetchOrders() {
//     const res = await fetch(`${API_BASE_URL}/api/orders`, {
//         headers: getAuthHeaders(),
//     });

//     if (!res.ok) throw new Error(`HTTP ${res.status}`);
//     return res.json() as Promise<{
//         data: Array<{
//             id: string;
//             confirmed: string;
//             order_items: Array<{
//                 id: string;
//                 order: object;
//                 item: {
//                 id: number;
//                 name: string;
//                 description: string;
//                 price: string;
//                 img: string;
//                 is_active: number;
//                 category: { id: number; name: string; description: string };
//                 };
//                 amount: string;
//             }>;
//         }>;
//     }>;
// }