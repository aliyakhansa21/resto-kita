import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { placeOrder, confirmCheckout } from "@/lib/checkoutService";
import type {
  CheckoutSession,
  CheckoutForm,
  CheckoutFormErrors,
  PaymentMethod,
  CartItem,
  PlaceOrderPayload,
} from "@/types";

export interface CompletedOrder {
  session: CheckoutSession;
  cartSnapshot: CartItem[];
  paymentMethod: PaymentMethod;
}

interface UseCheckoutReturn {
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  form: CheckoutForm;
  setForm: React.Dispatch<React.SetStateAction<CheckoutForm>>;
  formErrors: CheckoutFormErrors;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  submitting: boolean;
  submitError: string | null;
  completedOrder: CompletedOrder | null;
  handleSubmit: () => Promise<void>;
  reset: () => void;
}

export function useCheckout(token: string, initialTable?: string): UseCheckoutReturn {
  const { items: cartItems, totalPrice, clearCart } = useCart();

  const subtotal = totalPrice;
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + tax;

  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    whatsapp: "",
    table: initialTable ?? "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<CheckoutFormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("non_cash");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  // Validation 
  const validate = (): CheckoutFormErrors => {
    const errs: CheckoutFormErrors = {};
    if (!form.name.trim()) errs.name = "Nama lengkap wajib diisi";
    if (!form.whatsapp.trim()) {
      errs.whatsapp = "Nomor WhatsApp wajib diisi";
    } else if (!/^[0-9]{9,15}$/.test(form.whatsapp.replace(/\s/g, ""))) {
      errs.whatsapp = "Nomor WhatsApp tidak valid";
    }
    return errs;
  };

  // Submit: 2 langkah 
  const handleSubmit = async (): Promise<void> => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    if (!token) {
      setSubmitError("Token sesi tidak ditemukan. Silakan scan ulang QR Code.");
      return;
    }

    setFormErrors({});
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Snapshot cart sebelum di-clear
      const cartSnapshot = [...cartItems];

      // 1. POST /api/orders
      // Ubah CartItem[] jadi format yang dibutuhkan API
      const orderPayload: PlaceOrderPayload = {
        orders: cartItems.map((ci) => ({
          item_id: Number(ci.menuItem.id),
          amount: ci.quantity,
        })),
      };
      await placeOrder(orderPayload);

      // 2. POST /api/table-sessions/{token}/checkout untuk finalisasi pembayaran
      // Finalisasi setelah order berhasil dibuat
      const session = await confirmCheckout(token);

      setCompletedOrder({ session, cartSnapshot, paymentMethod });
      clearCart();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    cartItems,
    subtotal,
    tax,
    grandTotal,
    form,
    setForm,
    formErrors,
    paymentMethod,
    setPaymentMethod,
    submitting,
    submitError,
    completedOrder,
    handleSubmit,
    reset: () => setCompletedOrder(null),
  };
}