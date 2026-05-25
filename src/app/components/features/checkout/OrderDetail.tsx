import type { CheckoutSession, PaymentMethod } from "@/types";
import { Receipt, CheckCircle, Banknote, Smartphone, Check, Info, Clock } from "lucide-react";

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

      {/* Status Banner */}
      <div className={`flex items-start gap-4 px-6 py-5 ${isCash ? "bg-[#FFFBEB]" : "bg-green-50"}`}>
        <span className="mt-0.5">
            {isCash ? (
                <Receipt className="w-10 h-10 text-[#92400E]" />
            ) : (
                <CheckCircle className="w-10 h-10 text-green-600" />
            )}
        </span>
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

      {/* Payment Info */}
      <section className="px-6 py-5 border-t border-secondary-20">
        <h2 className="flex items-center gap-2 font-bold text-base text-primary-50 mb-4">
          <Receipt className="w-5 h-5 text-primary" /> Payment Information
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
            <span className="flex items-center gap-1.5 font-semibold text-base text-primary-50">
              {isCash ? (
                <><Banknote className="w-5 h-5 text-primary" /> Cash</>
              ) : (
                <><Smartphone className="w-5 h-5 text-primary" /> Non-Cash</>
              )}
            </span>
          </div>
          {!isCash && (
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-text-xs font-semibold text-secondary-50 uppercase tracking-wider">
                Status
              </span>
              <span className="flex items-center gap-1 bg-green-100 text-green-700 font-bold text-text-sm px-3 py-1 rounded-full">
                <Check className="w-4 h-4" /> PAID
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Items — dari session.orders */}
      <section className="px-6 py-5 border-t border-secondary-20">
        <h2 className="font-bold text-base text-primary-50 mb-4">Items</h2>
        <div className="flex flex-col">
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
                <p className="font-bold text-base text-[#0F172A] truncate">
                  {oi.item.name}
                </p>
                <p className="text-text-xs text-[#64748B] mt-0.5">
                  {oi.amount}x {fmt(oi.item.price)}
                </p>
              </div>
              <p className="font-bold text-base text-[#0F172A] flex-shrink-0">
                {fmt(parseFloat(oi.item.price) * oi.amount)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-primary/5 pt-4 mt-3 flex flex-col gap-2">
          <div className="flex justify-between text-base text-[#64748B]">
            <span>Subtotal</span><span>{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-base text-[#64748B]">
            <span>Tax (10%)</span><span>{fmt(tax)}</span>
          </div>
          <div className="flex justify-between font-black text-h4 text-[#0F172A] pt-3 mt-1">
            <span>Total Amount</span>
            <span className="text-[#0F172A]">{fmt(total)}</span>
          </div>
        </div>
      </section>

      {/* ── Note ── */}
      <div className="mx-6 mb-5 flex items-start gap-3 bg-secondary-DEFAULT/30 rounded-xl px-4 py-3 border-l-4 border-primary">
        {isCash ? (
          <p className="flex gap-2 text-text-sm text-secondary-60">
            <Info className="w-5 h-5 flex-shrink-0 text-primary" />
            Show this code to the cashier upon pickup.
          </p>
        ) : (
          <>
            <Clock className="w-8 h-8 text-primary flex-shrink-0" />
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