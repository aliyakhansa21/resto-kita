import api from "@/lib/api";
import type {
  PlaceOrderPayload,
  PlaceOrderResponse,
  CheckoutSession,
} from "@/types";

// 1. Bikin order dari items di cart (POST /api/orders)
export async function placeOrder(
  payload: PlaceOrderPayload
): Promise<PlaceOrderResponse> {
  const { data } = await api.post<{ data: PlaceOrderResponse }>(
    "/orders",
    payload
  );
  return data.data;
}

// 2. Finalisasi pembayaran setelah order dibuat (POST /api/table-sessions/{token}/checkout)
export async function confirmCheckout(token: string): Promise<CheckoutSession> {
  const { data } = await api.post<{ data: CheckoutSession }>(
    `/table-sessions/${token}/checkout`
  );
  return data.data;
}