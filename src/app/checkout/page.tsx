"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCheckout } from "@/hooks/useCheckout";
import { useOrders } from "@/hooks/useOrders";
import { CheckoutForm } from "@/app/components/features/checkout/CheckoutForm";
import { PaymentSelector } from "@/app/components/features/checkout/PaymentSelector";
import PaymentStatusUI from "@/app/components/features/checkout/PaymentStatus";
import { OrderDetail } from "@/app/components/features/checkout/OrderDetail";
import { Navbar } from "@/app/components/shared/Navbar";
import { Footer } from "@/app/components/shared/Footer";

const fmt = (val: number): string =>
  "Rp" + val.toLocaleString("id-ID").replace(/,/g, ".");

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") ?? "";
  const tableNumber = searchParams.get("table") ?? "07";

  // Order summary dari API (sudah di-place sebelumnya di CartModal)
  const { orders, loading: ordersLoading, grandTotal } = useOrders();
  const tax = grandTotal * 0.1;
  const totalWithTax = grandTotal + tax;

  const {
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
    payment,
  } = useCheckout(token, tableNumber);

  //  Non-Cash: sedang proses Midtrans 
  // Tampil saat: creating snap token, waiting (popup terbuka), polling status
  const isNonCashProcessing =
    completedOrder?.paymentMethod === "non_cash" &&
    payment.paymentState !== "idle" &&
    payment.paymentState !== "paid";

  if (isNonCashProcessing) {
    return (
      <div className="min-h-screen flex flex-col bg-secondary-DEFAULT/20">
        <Navbar tableNumber={tableNumber} />
        <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
          <h1 className="text-h2 text-primary-50 mb-1">Pembayaran</h1>
          <p className="text-base text-secondary-50 mb-8">
            Selesaikan pembayaran kamu
          </p>
          <div className="bg-white rounded-2xl shadow-md border border-secondary-20 p-8">
            <PaymentStatusUI
              state={payment.paymentState}
              status={payment.paymentStatus}
              errorMessage={payment.errorMessage}
              onRetry={() => {
                if (completedOrder) {
                  payment.startPayment(completedOrder.invoiceId, form.name);
                }
              }}
              onBack={reset}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  //  Order Detail 
  // Tampil saat:
  // - Cash: langsung setelah confirm (completedOrder ada, paymentMethod = cash)
  // - Non-Cash: setelah polling konfirmasi "paid"
  if (
    completedOrder &&
    (completedOrder.paymentMethod === "cash" || payment.paymentState === "paid")
  ) {
    return (
      <div className="min-h-screen flex flex-col bg-secondary-DEFAULT/20">
        <Navbar tableNumber={tableNumber} />
        <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
          <h1 className="text-h2 text-primary-50 mb-1">Order Details</h1>
          <p className="text-base text-secondary-50 mb-8">
            Your order has been successfully created
          </p>
          <OrderDetail
            session={completedOrder.session}
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

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <h1 className="text-h2 text-primary-50 mb-1">Checkout</h1>
        <p className="text-base text-secondary-50 mb-8">
          Please review your order and complete your details.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 items-start">

          {/* ── Left ── */}
          <div className="flex flex-col gap-6">
            <CheckoutForm form={form} setForm={setForm} errors={formErrors} />

            {/* Order Summary */}
            <section className="bg-white rounded-2xl shadow-sm border border-secondary-20 p-7">
              <h2 className="font-bold text-base text-primary-50 mb-5">
                🧾 Order Summary
              </h2>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-8 gap-3">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-base text-secondary-50">Memuat pesanan...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {orders.flatMap((o) => o.order_items).map((oi) => (
                    <div key={oi.id} className="flex items-center gap-4">
                      <img
                        src={
                          oi.item.img ||
                          `https://placehold.co/64x64/8b5e3c/ead7c5?text=${oi.item.name[0]}`
                        }
                        alt={oi.item.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-base text-primary-50 truncate">
                          {oi.item.name}
                        </p>
                        <p className="text-text-xs text-secondary-50 mt-0.5">
                          {oi.item.description}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-base text-primary">
                          {fmt(parseFloat(oi.item.price))}
                        </p>
                        <p className="text-text-xs text-secondary-40">
                          Qty: {oi.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right: Payment */}
          <div className="lg:sticky lg:top-24">
            <section className="bg-white rounded-2xl shadow-sm border border-secondary-20 p-7">
              <h2 className="font-bold text-base text-primary-50 mb-5">
                💳 Payment Method
              </h2>

              <PaymentSelector selected={paymentMethod} onChange={setPaymentMethod} />

              {/* Totals */}
              <div className="flex flex-col gap-2 border-t border-secondary-20 pt-4">
                <div className="flex justify-between text-base text-secondary-50">
                  <span>Subtotal</span>
                  <span>{fmt(grandTotal)}</span>
                </div>
                <div className="flex justify-between text-base text-secondary-50">
                  <span>Tax Charge (10%)</span>
                  <span>{fmt(tax)}</span>
                </div>
                <div className="flex justify-between font-black text-h4 text-primary-50 border-t border-secondary-20 pt-3 mt-1">
                  <span>Total</span>
                  <span className="text-primary">{fmt(totalWithTax)}</span>
                </div>
              </div>

              {/* Info Non-Cash */}
              {paymentMethod === "non_cash" && (
                <div className="mt-4 bg-secondary-DEFAULT/20 rounded-xl px-4 py-3 text-text-xs text-secondary-50 leading-relaxed">
                  💡 Kamu akan diarahkan ke halaman pembayaran Midtrans.
                  Tersedia QRIS, GoPay, OVO, Dana, transfer bank, dan kartu kredit.
                </div>
              )}

              {submitError && (
                <p className="mt-3 text-text-xs text-red-500 text-center">
                  {submitError}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting || ordersLoading}
                className="mt-5 w-full bg-primary text-white font-bold text-base rounded-xl py-4 hover:bg-primary-10 active:bg-primary-20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {paymentMethod === "non_cash"
                      ? "Menyiapkan pembayaran..."
                      : "Memproses..."}
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