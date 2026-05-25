import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export interface Payment {
    id: string;
    invoice_id: number;
    tableNo: number;
    customer_name: string;
    totalAmount: number;
    status: "PENDING" | "PAID";
}

export function usePayments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isProcessingId, setIsProcessingId] = useState<number | null>(null);

    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            // Ambil data Halaman 1 dari table-sessions
            const { data: firstResponse } = await api.get("/admin/table-sessions?page=1");
            let allSessions = [...(firstResponse.data || [])];
            
            // Ambil total halaman (jika backend mengirimkan meta pagination)
            const lastPage = firstResponse.meta?.last_page || 1;

            // Looping untuk mengambil sisa halaman 
            if (lastPage > 1) {
                const promises = [];
                for (let i = 2; i <= lastPage; i++) {
                    promises.push(api.get(`/admin/table-sessions?page=${i}`));
                }
                const responses = await Promise.all(promises);
                responses.forEach(res => {
                    allSessions = [...allSessions, ...(res.data.data || [])];
                });
            }

            const mappedPayments: Payment[] = allSessions
                .filter((s: any) => s.invoice !== null) 
                .map((s: any) => ({
                    id: s.token || s.id.toString(),
                    invoice_id: s.invoice.id, 
                    tableNo: s.table?.number || 0,
                    customer_name: s.customer_name,
                    totalAmount: parseFloat(s.invoice.grand_total || "0"),
                    status: (s.invoice.status === 'paid' || s.invoice.status === 'PAID') ? "PAID" : "PENDING"
                } as Payment))
                // Sort dari yang terbaru (ID terbesar) ke terkecil
                .sort((a: Payment, b: Payment) => b.invoice_id - a.invoice_id);

            setPayments(mappedPayments);
        } catch (error) {
            console.error("Gagal mengambil data pembayaran:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const confirmCashPayment = async (invoiceId: number, customerName: string) => {
        setIsProcessingId(invoiceId);
        try {
            await api.post("/admin/cash-transaction", {
                invoice_id: invoiceId,
                customer_name: customerName
            });

            setPayments((prev) =>
                prev.map((payment) =>
                    payment.invoice_id === invoiceId ? { ...payment, status: "PAID" } : payment
                )
            );

            return true;
        } catch (error: any) {
            console.error("Gagal konfirmasi pembayaran:", error);
            const errMsg = error.response?.data?.message || "Terjadi kesalahan saat memproses pembayaran.";
            alert(errMsg); 
            return false;
        } finally {
            setIsProcessingId(null);
        }
    };

    return {
        payments,
        isLoading,
        isError,
        isProcessingId,
        confirmCashPayment,
        refresh: fetchPayments
    };
}