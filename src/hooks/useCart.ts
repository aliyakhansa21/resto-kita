"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "@/lib/menuService";
import type { CartItem, MenuItem, OrderPayload } from "@/types";

const CART_STORAGE_KEY = "restaurant_cart";

export function useCart(tableNumber = "07") {
    const [items, setItems] = useState<CartItem[]>([]);

    // Rehydrate dari localStorage saat pertama mount 
    useEffect(() => {
        try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) setItems(JSON.parse(stored));
        } catch {
        // localStorage tidak available (SSR) — abaikan
        }
    }, []);

    // Persist ke localStorage setiap items berubah 
    useEffect(() => {
        try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch {
        // abaikan
        }
    }, [items]);

    // Add item — kalau sudah ada, tambah qty 
    const addItem = useCallback((menuItem: MenuItem) => {
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

    // Remove item dari cart 
    const removeItem = useCallback((menuItemId: string) => {
        setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
    }, []);

    // Update qty secara langsung — qty 0 = hapus item 
    const updateQty = useCallback((menuItemId: string, quantity: number) => {
        if (quantity <= 0) {
        removeItem(menuItemId);
        return;
        }
        setItems((prev) =>
        prev.map((i) =>
            i.menuItem.id === menuItemId ? { ...i, quantity } : i
        )
        );
    }, [removeItem]);

    // Clear semua item 
    const clearCart = useCallback(() => setItems([]), []);

    // Computed values 
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce(
        (sum, i) => sum + i.menuItem.price * i.quantity,
        0
    );

    // Submit order ke backend 
    const { mutateAsync: submitOrder, isPending: isSubmitting } = useMutation({
        mutationFn: () => {
        const payload: OrderPayload = {
            tableNumber,
            items: items.map((i) => ({
            menuItemId: i.menuItem.id,
            quantity: i.quantity,
            price: i.menuItem.price,
            })),
            totalPrice,
        };
        return placeOrder(payload);
        },
        onSuccess: () => {
        clearCart();
        },
    });

    return {
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        submitOrder,
        isSubmitting,
        totalItems,
        totalPrice,
    };
}