// Fetch GET /api/orders dan hitung total keseluruhan.
import { useState, useEffect, useCallback } from "react";
import { fetchOrders } from "@/lib/checkoutService";
import type { CheckoutOrder } from "@/types";

interface UseOrdersReturn {
    orders: CheckoutOrder[];
    loading: boolean;
    error: string | null;
    grandTotal: number;   // total semua order (belum kena tax)
    refetch: () => void;  
}

export function useOrders(): UseOrdersReturn {
    const [orders, setOrders] = useState<CheckoutOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(() => {
        setLoading(true);
        setError(null);
        fetchOrders()
        .then(setOrders)
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    // Hitung grand total dari semua order_items
    const grandTotal = orders.reduce((total, order) => {
        const orderSum = order.order_items.reduce(
        (s, oi) => s + parseFloat(oi.item.price) * oi.amount,
        0
        );
        return total + orderSum;
    }, 0);

    return { orders, loading, error, grandTotal, refetch: load };
}