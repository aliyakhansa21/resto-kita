// Type declaration untuk Midtrans Snap JS

interface SnapCallbackResult {
    order_id: string;
    payment_type: string;
    transaction_status: string;
    fraud_status?: string;
}

interface SnapPayOptions {
    onSuccess?: (result: SnapCallbackResult) => void;
    onPending?: (result: SnapCallbackResult) => void;
    onError?: (result: SnapCallbackResult) => void;
    onClose?: () => void;
}

interface Snap {
    pay: (snapToken: string, options?: SnapPayOptons) => void;
    hide: () => void;
}

declare global {
    interface Window {
        snap?: Snap;
    }
}

export {};