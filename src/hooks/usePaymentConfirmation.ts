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
    const [isProcessingId, setIsProcessingId] = useState<number | null>(null);

    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        try {
            // GET: Mengambil data sesi meja beserta invoice-nya
            const { data } = await api.get("/admin/table-sessions");
            const sessions = data.data || [];

            // Memetakan data dari backend ke interface Payment kita
            const mappedPayments: Payment[] = sessions
                .filter((s: any) => s.invoice !== null) // Hanya tampilkan yang sudah ada tagihan/invoice
                .map((s: any) => ({
                    id: s.token || s.id.toString(),
                    invoice_id: s.invoice.id,
                    tableNo: s.table?.number || 0,
                    customer_name: s.customer_name,
                    totalAmount: parseFloat(s.invoice.grand_total || "0"),
                    status: (s.invoice.status === 'paid' || s.invoice.status === 'PAID') ? "PAID" : "PENDING"
                }));

            setPayments(mappedPayments);
        } catch (error) {
            console.error("Gagal mengambil data pembayaran:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load data otomatis saat pertama kali dibuka
    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    // Fungsi konfirmasi pembayaran 
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
        isProcessingId,
        confirmCashPayment,
        refresh: fetchPayments
    };
}