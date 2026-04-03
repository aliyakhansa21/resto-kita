import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://resto-kita-production.up.railway.app/api";

// instance axios khusus tanpa interceptor bearer token karena endpoint payment tidak butuh authorization

const publicApi = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    timeout: 10_000.
});

//TYPES

export interface CreatePaymentPayload {
    invoice_id: number;
    customer_name: string;
}

export interface CreatePaymentResponse {
    snap_token: string;
    client_key: string;
    from_cache: boolean;
}

export interface PaymentStatusResponse {
    status: "pending" | "paid" | "failed";
    payment_method: string;
    paid_at: string | null;
}


//API CALLS

// Fungsi untuk membuat pembayaran baru
export async function createPayment(
    payload: CreatePaymentPayload
): Promise<CreatePaymentResponse> {
    const { data } = await publicApi.post<{ data: CreatePaymentResponse}>(
        "/payments/create",
        payload
    );
    return data.data;
}

// Fungsi untuk memeriksa status pembayaran
export async function getPaymentStatus(
    invoidId: number
): Promise<PaymentStatusResponse> {
    const { data } = await publicApi.get<{ data: PaymentStatusResponse }>(
        `/payments/status/${invoidId}`
    );
    return data.data;
}