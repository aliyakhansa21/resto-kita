import type { PaymentState } from "@/hooks/usePayment";
import type { PaymentStatusResponse } from "@/lib/paymentService";

interface Props {
    state: PaymentState;
    status: PaymentStatusResponse | null;
    errorMessage: string | null;
    onRetry: () => void;
    onBack: () => void;
}

export default function PaymentStatusUI({
    state,
    status,
    errorMessage,
    onRetry,
    onBack,
}: Props) {
    // Polling 
    if (state === "polling" || state === "waiting") {
        return (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-base text-primary-50">
            Menunggu konfirmasi pembayaran...
            </p>
            <p className="text-text-sm text-secondary-50">
            Jangan tutup halaman ini. Kami sedang mengecek status pembayaran kamu.
            </p>
        </div>
        );
    }

    // Sukses (paid) 
    if (state === "paid") {
        // Format waktu pembayaran ke lokal (WIB)
        const paidAt = status?.paid_at
        ? new Date(status.paid_at).toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
            dateStyle: "medium",
            timeStyle: "short",
            })
        : null;

        return (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-4xl">
            ✅
            </div>
            <p className="font-bold text-base text-green-700">Pembayaran Berhasil!</p>
            {status?.payment_method && (
            <p className="text-text-sm text-secondary-50">
                via {status.payment_method}
            </p>
            )}
            {paidAt && (
            <p className="text-text-xs text-secondary-40">{paidAt}</p>
            )}
        </div>
        );
    }

    // Gagal / error 
    if (state === "failed" || state === "error") {
        return (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-4xl">
                ❌
            </div>
            <p className="font-bold text-base text-red-600">Pembayaran Gagal</p>
            <p className="text-text-sm text-secondary-50 max-w-xs">
            {errorMessage ?? "Pembayaran gagal atau dibatalkan. Silakan coba lagi."}
            </p>
            <div className="flex gap-3 mt-2">
                <button
                    onClick={onBack}
                    className="border-2 border-primary text-primary font-bold text-base rounded-full px-5 py-2.5 hover:bg-primary hover:text-white transition-all"
                >
                    Kembali
                </button>
                <button
                    onClick={onRetry}
                    className="bg-primary text-white font-bold text-base rounded-full px-5 py-2.5 hover:bg-primary-10 transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
        </div>
        );
    }

    return null;
}