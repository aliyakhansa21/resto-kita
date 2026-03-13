// src/lib/checkoutService.ts
// Menggunakan instance `api` dari @/lib/api (axios + interceptor Bearer token)
// agar token sesi meja otomatis dikirim di setiap request — sama seperti menuService.ts

import api from "@/lib/api";
import type { CheckoutSession, CheckoutSubmitPayload } from "@/types";

/**
 * Fetch ringkasan pesanan & grand total.
 * POST /api/table-sessions/{token}/checkout
 */
export async function fetchCheckoutSession(token: string): Promise<CheckoutSession> {
  const { data } = await api.post<{ data: CheckoutSession }>(
    `/table-sessions/${token}/checkout`
  );
  return data.data;
}

/**
 * Kirim konfirmasi order setelah "Confirm & Pay".
 * TODO: Aktifkan saat backend endpoint tersedia.
 * POST /api/table-sessions/{token}/orders
 */
export async function submitCheckoutOrder(
  token: string,
  payload: CheckoutSubmitPayload
): Promise<{ data: CheckoutSession }> {
  const { data } = await api.post<{ data: CheckoutSession }>(
    `/table-sessions/${token}/orders`,
    payload
  );
  return data;
}