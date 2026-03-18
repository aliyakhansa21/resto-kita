// src/app/components/features/checkout/OrderDetail.tsx
// Data items diambil dari session.orders (response POST /checkout)
// Tidak perlu cartSnapshot lagi karena backend sudah return semua order.

import type { CheckoutSession, PaymentMethod } from "@/types";

interface Props {
  session: CheckoutSession;
  paymentMethod: PaymentMethod;
  onBack: () => void;
}

const fmt = (val: string | number): string => {
  const num = typeof val === "string" ? parseFloat(val) : val;
  return "Rp" + num.toLocaleString("id-ID").replace(/,/g, ".");
};

export function OrderDetail({ session, paymentMethod, onBack }: Props) {
  const isCash = paymentMethod === "cash";

  // Semua items dari semua order dalam sesi ini
  const allItems = session.orders.flatMap((o) => o.order_items);

  const subtotal = allItems.reduce(
    (s, oi) => s + parseFloat(oi.item.price) * oi.amount,
    0
  );
  const tax = subtotal * 0.1;
  const total = parseFloat(session.grand_total) || subtotal + tax;
  const orderCode = `ORD-${session.id.toString().padStart(7, "0")}`;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      {/* ── Status Banner ── */}
      <div className={`flex items-start gap-4 px-6 py-5 ${isCash ? "bg-[#FFFBEB]" : "bg-green-50"}`}>
        <span className="text-4xl mt-0.5">{isCash ? "🧾" : "✅"}</span>
        <div>
          <p className={`font-bold text-base ${isCash ? "text-[#92400E]" : "text-green-700"}`}>
            {isCash ? "Waiting for Payment" : "Payment Successful"}
          </p>
          <p className={`text-text-sm mt-1 ${isCash ? "text-[#B45309CC]" : "text-green-700"}`}>
            {isCash
              ? "Please show your payment code to the cashier to complete the payment."
              : "Your payment has been successfully completed."}
          </p>
        </div>
      </div>

      {/* ── Payment Info ── */}
      <section className="px-6 py-5 border-t border-secondary-20">
        <h2 className="font-bold text-base text-primary-50 mb-4">
          🧾 Payment Information
        </h2>
        <div className="bg-[#F7F7F6] rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-secondary-20">
            <span className="text-text-xs font-semibold text-secondary-50 uppercase tracking-wider">
              Payment Code
            </span>
            <span className="font-black text-base text-accent">{orderCode}</span>
          </div>
          <div className={`flex justify-between items-center px-4 py-3 ${!isCash ? "border-b border-secondary-20" : ""}`}>
            <span className="text-text-xs font-semibold text-secondary-50 uppercase tracking-wider">
              Method
            </span>
            <span className="font-semibold text-base text-primary-50">
              {isCash ? "💵 Cash" : "📱 Non-Cash"}
            </span>
          </div>
          {!isCash && (
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-text-xs font-semibold text-secondary-50 uppercase tracking-wider">
                Status
              </span>
              <span className="bg-green-100 text-green-700 font-bold text-text-sm px-3 py-1 rounded-full">
                ✓ PAID
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── Items — dari session.orders ── */}
      <section className="px-6 py-5 border-t border-secondary-20">
        <h2 className="font-bold text-base text-primary-50 mb-4">Items</h2>
        <div className="flex flex-col divide-y divide-secondary-20">
          {allItems.map((oi) => (
            <div key={oi.id} className="flex items-center gap-4 py-3">
              <img
                src={
                  oi.item.img ||
                  `https://placehold.co/56x56/8b5e3c/ead7c5?text=${oi.item.name[0]}`
                }
                alt={oi.item.name}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base text-primary-50 truncate">
                  {oi.item.name}
                </p>
                <p className="text-text-xs text-secondary-40 mt-0.5">
                  {oi.amount}x {fmt(oi.item.price)}
                </p>
              </div>
              <p className="font-bold text-base text-primary-50 flex-shrink-0">
                {fmt(parseFloat(oi.item.price) * oi.amount)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-secondary-20 pt-4 mt-3 flex flex-col gap-2">
          <div className="flex justify-between text-base text-secondary-50">
            <span>Subtotal</span><span>{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-base text-secondary-50">
            <span>Tax (10%)</span><span>{fmt(tax)}</span>
          </div>
          <div className="flex justify-between font-black text-h4 text-primary-50 border-t border-secondary-20 pt-3 mt-1">
            <span>Total Amount</span>
            <span className="text-primary">{fmt(total)}</span>
          </div>
        </div>
      </section>

      {/* ── Note ── */}
      <div className="mx-6 mb-5 flex items-center gap-3 bg-secondary-DEFAULT/30 rounded-xl px-4 py-3 border-l-4 border-primary">
        {isCash ? (
          <p className="text-text-sm text-secondary-60">
            <span className="mr-2">ℹ️</span>
            Show this code to the cashier upon pickup.
          </p>
        ) : (
          <>
            <span className="text-xl">🕐</span>
            <div>
              <p className="text-text-xs font-bold text-primary uppercase tracking-widest">
                Estimated Arrival
              </p>
              <p className="font-black text-base text-primary-50">15 – 20 mins</p>
            </div>
          </>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-4 justify-center px-6 pb-7">
        <button className="flex-1 border-2 border-primary text-primary font-bold text-base rounded-full py-3 hover:bg-primary hover:text-white transition-all">
          Download Receipt
        </button>
        <button
          onClick={onBack}
          className="flex-1 bg-primary text-white font-bold text-base rounded-full py-3 hover:bg-primary-10 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}