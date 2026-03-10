"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { MenuItem, CartItem } from "@/types";

interface CartContextValue {
    items: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeItem: (menuItemId: string) => void;
    updateQty: (menuItemId: string, qty: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = useCallback((menuItem: MenuItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.menuItem.id === menuItem.id);
            if (existing) {
                return prev.map((i) =>
                    i.menuItem.id === menuItem.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { menuItem, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((menuItemId: string) => {
        setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
    }, []);

    const updateQty = useCallback((menuItemId: string, qty: number) => {
        if (qty <= 0) {
            setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
        } else {
            setItems((prev) =>
                prev.map((i) =>
                    i.menuItem.id === menuItemId ? { ...i, quantity: qty } : i
                )
            );
        }
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const totalItems = items.length;
    const totalPrice = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addToCart, removeItem, updateQty, clearCart, totalItems, totalPrice }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
    return ctx;
}