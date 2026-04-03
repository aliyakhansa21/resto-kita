import { useState, useRef, useCallback } from 'react';
import { createPayment, getPaymentStatus } from '@/lib/paymentService';
import type { PaymentStatusResponse } from '@/lib/paymentService';

export type PaymentState = 
    | "idle"      // belum mulai
    | "creating"  // sedang POST /payments/create
    | "waiting"   // popup Midtrans terbuka
    | "polling"   // popup ditutup, sedang cek status
    | "paid"      // lunas
    | "failed"    // gagal/cancel/expire
    | "error";    // error teknis (network, dll)

const POLL_INTERVAL_MS = 3000;  // cek tiap 3 detik
const MAX_POLL_ATTEMPTS = 200;  // max ~10 menit (200 × 3s)

interface UsePaymentReturn {
    paymentState: PaymentState;
    paymentStatus: PaymentStatusResponse | null;
    errorMessage: string | null;
    startPayment: (invoiceId: number, customerName: string) => Promise<void>;
    reset: () => void;
}

export function usePayment(): UsePaymentReturn {
    const [paymentState, setPaymentState] = useState<PaymentState>("idle");
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const attemptsRef = useRef(0);

    // stop polling
    const stopPolling = useCallback(() => {
        if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
        }
        attemptsRef.current = 0;
    }, []);

    // polling status pembayaran
    const startPolling = useCallback(
        (invoiceId: number) => {
            setPaymentState("polling");
            attemptsRef.current = 0;

            pollRef.current = setInterval(async () => {
                attemptsRef.current += 1;

                // timeout setelah MAX_POLL_ATTEMPTS
                if (attemptsRef.current > MAX_POLL_ATTEMPTS) {
                    stopPolling();
                    setPaymentState("failed");
                    setErrorMessage("Waktu pembayaran habis. Silakan coba lagi.");
                    return;
                }

                try {
                    const status = await getPaymentStatus(invoiceId);
                    setPaymentStatus(status);

                    if (status.status === "paid") {
                        stopPolling();
                        setPaymentState("paid");
                    } else if (status.status === "failed") {
                        stopPolling();
                        setPaymentState("failed");
                        setErrorMessage("Pembayaran gagal atau dibatalkan.");
                    }
                } catch {

                }
            }, POLL_INTERVAL_MS);
        },
        [stopPolling]
    );


    // load Snap JS dari Midtrans
    const loadSnapScript = (clientKey: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (window.snap) { resolve(); return; }

            const existing = document.getElementById("midtrans-snap");
            if (existing) {
                existing.addEventListener("load", () => resolve());
                existing.addEventListener("error", () =>
                    reject(new Error("Gagal memuat Midtrans Snap JS"))
                );
                return;
            }

            // const isSandbox = clientKey.startsWith("SB-");
            const isSandbox = true; 
            
            const script = document.createElement("script");
            script.id = "midtrans-snap";
            script.src = isSandbox
                ? "https://app.sandbox.midtrans.com/snap/snap.js"
                : "https://app.midtrans.com/snap/snap.js";
            
            script.setAttribute("data-client-key", clientKey);
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Gagal memuat Midtrans Snap JS"));
            document.head.appendChild(script);
        });
    };

    // MAIN: Muali pembayaran
    const startPayment = useCallback(
        async (invoiceId: number, customerName: string) => {
        setPaymentState("creating");
        setErrorMessage(null);
        setPaymentStatus(null);
    
        try {
            // STEP 1: Minta snap_token dari BE
            const { snap_token, client_key } = await createPayment({
            invoice_id: invoiceId,
            customer_name: customerName,
            });
    
            // STEP 2: Load Snap JS
            await loadSnapScript(client_key);
    
            if (!window.snap) {
            throw new Error("Midtrans Snap tidak berhasil dimuat.");
            }
    
            // STEP 3: Buka popup Midtrans
            setPaymentState("waiting");
    
            window.snap.pay(snap_token, {
            onSuccess: () => {
                // Callback dari Midtrans — tetap polling untuk konfirmasi final
                startPolling(invoiceId);
            },
            onPending: () => {
                // Transfer bank dll — settlement bisa makan waktu
                startPolling(invoiceId);
            },
            onError: () => {
                setPaymentState("error");
                setErrorMessage("Terjadi kesalahan saat proses pembayaran.");
            },
            onClose: () => {
                // User tutup popup — mulai polling, mungkin sudah sempat bayar
                startPolling(invoiceId);
            },
            });
        } catch (err) {
            setPaymentState("error");
            setErrorMessage(
            err instanceof Error ? err.message : "Terjadi kesalahan."
            );
        }
        },
        [startPolling]
    );
    
    const reset = useCallback(() => {
        stopPolling();
        setPaymentState("idle");
        setPaymentStatus(null);
        setErrorMessage(null);
    }, [stopPolling]);
    
    return { paymentState, paymentStatus, errorMessage, startPayment, reset };
}
