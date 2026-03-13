"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCheckout } from "@/hooks/useCheckout";
import { CheckoutForm } from "@/app/components/features/checkout/CheckoutForm";
import { CheckoutSummary } from "@/app/components/features/checkout/CheckoutSummary";
import { PaymentSelector} from "@/app/components/features/checkout/PaymentSelector";
import { OrderDetail } from "@/app/components/features/checkout/OrderDetail";
import { Footer } from "@/app/components/shared/Footer";
import { Navbar } from "@/app/components/shared/Navbar";

const fmt = (val: number): string => "Rp" + val.toLocaleString("id-ID").replace(/,/g, ".");

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") ?? "";
  const tableNumber = searchParams.get("table") ?? "07";

  const {
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
    reset,
  } = useCheckout(token, tableNumber);

  // Cart kosong & belum ada completed order → redirect 
  if (cartItems.length === 0 && !completedOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-secondary-DEFAULT/20">
        <Navbar tableNumber={tableNumber} />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <span className="text-5xl">🛒</span>
          <p className="font-bold text-base text-primary-50">
            Keranjang kamu kosong
          </p>
          <button
            onClick={() => router.push("/menu")}
            className="bg-primary text-white font-bold text-base rounded-xl px-6 py-3 hover:bg-primary-10 transition-colors"
          >
            Kembali ke Menu
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // Order Detail — tampil setelah Confirm & Pay berhasil 
  if (completedOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-secondary-DEFAULT/20">
        <Navbar tableNumber={tableNumber} />
        <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-24">
          <h1 className="text-h2 text-primary-50 mb-1">Order Details</h1>
          <p className="text-base text-secondary-50 mb-8">
            Your order has been successfully created
          </p>
          {/* Pass cartSnapshot agar items tetap tampil meski cart sudah di-clear */}
          <OrderDetail
            session={completedOrder.session}
            cartSnapshot={completedOrder.cartSnapshot}
            paymentMethod={completedOrder.paymentMethod}
            onBack={() => {
              reset();
              router.push("/menu");
            }}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Checkout Form 
  return (
    <div className="min-h-screen flex flex-col bg-secondary-DEFAULT/20">
      <Navbar tableNumber={tableNumber} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-24">
        <h1 className="text-h2 text-primary-50 mb-1">Checkout</h1>
        <p className="text-base text-secondary-50 mb-8">
          Please review your order and complete your details.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 items-start">
          {/* Left */}
          <div className="flex flex-col gap-6">
            <CheckoutForm form={form} setForm={setForm} errors={formErrors} />
            <section className="bg-white rounded-2xl shadow-sm border border-secondary-20 p-7">
              <h2 className="font-bold text-base text-primary-50 mb-5">
                🧾 Order Summary
              </h2>
              <CheckoutSummary items={cartItems} />
            </section>
          </div>

          {/* Right */}
          <div className="lg:sticky lg:top-24">
            <section className="bg-white rounded-2xl shadow-sm border border-secondary-20 p-7">
              <h2 className="font-bold text-base text-primary-50 mb-5">
                💳 Payment Method
              </h2>
              <PaymentSelector selected={paymentMethod} onChange={setPaymentMethod} />

              <div className="flex flex-col gap-2 border-t border-secondary-20 pt-4">
                <div className="flex justify-between text-base text-secondary-50">
                  <span>Subtotal</span><span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base text-secondary-50">
                  <span>Tax Charge (10%)</span><span>{fmt(tax)}</span>
                </div>
                <div className="flex justify-between font-black text-h4 text-primary-50 border-t border-secondary-20 pt-3 mt-1">
                  <span>Total</span>
                  <span className="text-primary">{fmt(grandTotal)}</span>
                </div>
              </div>

              {submitError && (
                <p className="mt-3 text-text-xs text-red-500 text-center">
                  {submitError}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-5 w-full bg-primary text-white font-bold text-base rounded-xl py-4 hover:bg-primary-10 active:bg-primary-20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  "Confirm & Pay →"
                )}
              </button>

              <p className="text-text-xs text-secondary-40 text-center mt-3 leading-relaxed">
                By clicking &quot;Confirm &amp; Pay&quot;, you agree to our
                terms of service and refund policy.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}