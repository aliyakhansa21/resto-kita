import api from "@/lib/api";
import type {
  CheckoutOrder,
  PlaceOrderPayload,
  CheckoutSession,
} from "@/types";


// Ambil semua order aktif lalu pakai di order list page (GET /api/orders)
export async function fetchOrders(): Promise<CheckoutOrder[]> {
  const { data } = await api.get<{ data: CheckoutOrder[] }>("orders");
  return data.data;
}


// Bikin order dari items di cart (POST /api/orders)
export async function placeOrder(
  payload: PlaceOrderPayload
): Promise<CheckoutOrder> {
  const { data } = await api.post<{ data: CheckoutOrder }>("/orders", payload);
  return data.data;
}

// 2. Finalisasi pembayaran setelah order dibuat (POST /api/table-sessions/{token}/checkout)
export async function confirmCheckout(token: string): Promise<CheckoutSession> {
  const { data } = await api.post<{ data: CheckoutSession }>(
    `/table-sessions/${token}/checkout`
  );
  return data.data;
}