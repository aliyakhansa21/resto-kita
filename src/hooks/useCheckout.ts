// src/hooks/useCheckout.ts

import { useState, useEffect } from "react";
import { fetchCheckoutSession, submitCheckoutOrder } from "@/lib/checkoutService";
import type {
  CheckoutSession,
  CheckoutForm,
  CheckoutFormErrors,
  PaymentMethod,
  CheckoutOrderItem,
} from "@/types";

interface UseCheckoutReturn {
  checkoutData: CheckoutSession | null;
  loading: boolean;
  fetchError: string | null;
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
  completedOrder: (CheckoutSession & { paymentMethod: PaymentMethod }) | null;
  handleSubmit: () => Promise<void>;
  reset: () => void;
}

export function useCheckout(token: string, initialTable?: string): UseCheckoutReturn {
  const [checkoutData, setCheckoutData] = useState<CheckoutSession | null>(null);

  // ── Kalau token kosong, langsung set loading=false & error ───────────────
  const [loading, setLoading] = useState(Boolean(token));
  const [fetchError, setFetchError] = useState<string | null>(
    !token ? "Token sesi tidak ditemukan. Silakan scan ulang QR Code." : null
  );

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
  const [completedOrder, setCompletedOrder] = useState<
    (CheckoutSession & { paymentMethod: PaymentMethod }) | null
  >(null);

  useEffect(() => {
    // Guard: jangan fetch kalau token kosong
    if (!token) {
      setLoading(false);
      setFetchError("Token sesi tidak ditemukan. Silakan scan ulang QR Code.");
      return;
    }

    setLoading(true);
    setFetchError(null);

    fetchCheckoutSession(token)
      .then((data) => setCheckoutData(data))
      .catch((err: Error) => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // ── Derived totals ────────────────────────────────────────────────────────
  const items: CheckoutOrderItem[] = checkoutData
    ? checkoutData.orders.flatMap((o) => o.order_items)
    : [];

  const subtotal = items.reduce(
    (sum: number, oi: CheckoutOrderItem) =>
      sum + parseFloat(oi.item.price) * oi.amount,
    0
  );
  const tax = subtotal * 0.1;
  const grandTotal = checkoutData
    ? parseFloat(checkoutData.grand_total)
    : subtotal + tax;

  // ── Validation ────────────────────────────────────────────────────────────
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

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (): Promise<void> => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    setFormErrors({});
    setSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: aktifkan saat backend order endpoint siap:
      // const payload: CheckoutSubmitPayload = {
      //   customer_name: form.name,
      //   whatsapp_number: form.whatsapp,
      //   table_number: form.table,
      //   notes: form.notes,
      //   payment_method: paymentMethod,
      // };
      // const result = await submitCheckoutOrder(token, payload);
      // setCompletedOrder({ ...result.data, paymentMethod });

      await new Promise<void>((r) => setTimeout(r, 800));
      if (checkoutData) {
        setCompletedOrder({ ...checkoutData, paymentMethod });
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    checkoutData,
    loading,
    fetchError,
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