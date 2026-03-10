"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { MenuItem } from "@/types";

export interface CartItem extends MenuItem {
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load data dari Local Storage 
    useEffect(() => {
        const savedCart = localStorage.getItem('resto-cart');
        if (savedCart) setCartItems(JSON.parse(savedCart));
    }, []);

    // Simpan ke Local Storage setiap ada perubahan di cartItems
    useEffect(() => {
        localStorage.setItem('resto-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: MenuItem) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i.id == item.id);

            if (existing) {
                return prev.map((i) =>
                    i.id == item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCartItems(prev => prev.filter(i => Number(i.id) !== Number(id)));
    };

    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};