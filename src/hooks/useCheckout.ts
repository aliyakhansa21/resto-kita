import { useState } from "react";
import { confirmCheckout } from "@/lib/checkoutService";
import { usePayment } from "./usePayment";
import type {
  CheckoutSession,
  CheckoutOrder,
  CheckoutForm,
  CheckoutFormErrors,
  PaymentMethod,
} from "@/types";

export interface CompletedOrder {
  session: CheckoutSession;
  paymentMethod: PaymentMethod;
  invoiceId: number;
}

interface UseCheckoutReturn {
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
  payment: ReturnType<typeof usePayment>;
}

export function useCheckout(token: string, initialTable?: string): UseCheckoutReturn {
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

  const payment = usePayment();

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

  // POST /checkout — finalisasi pembayaran
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
      const session = await confirmCheckout(token);
      const invoiceId = session.id;

      const completed: CompletedOrder = { session, paymentMethod, invoiceId };
      setCompletedOrder(completed);

      if (paymentMethod === "non_cash") {
        await payment.startPayment(invoiceId, form.name);
      }
      // setCompletedOrder({ session, paymentMethod });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    setForm,
    formErrors,
    paymentMethod,
    setPaymentMethod,
    submitting,
    submitError,
    completedOrder,
    handleSubmit,
    reset: () => {
      setCompletedOrder(null);
      payment.reset();
    },
    payment,
  };
}