"use client";

import { useRef, useState, useEffect } from "react";
import type { CheckoutSession, PaymentMethod } from "@/types";
import { 
  Receipt, CheckCircle, Banknote, Smartphone, Check, Info, 
  Clock, Download, Loader2, ArrowLeft, Coffee 
} from "lucide-react";
import html2canvas from "html2canvas";

interface Props {
  session: CheckoutSession;
  paymentMethod: PaymentMethod;
  onBack: () => void;
}

const fmt = (val: string | number): string => {
  const num = typeof val === "string" ? parseFloat(val) : val;
  return "Rp" + num.toLocaleString("id-ID").replace(/,/g, ".");
};

const fmtClassic = (val: string | number): string => {
  const num = typeof val === "string" ? parseFloat(val) : val;
  return num.toLocaleString("id-ID"); 
};

export function OrderDetail({ session, paymentMethod, onBack }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null); 
  const [isDownloading, setIsDownloading] = useState(false);
  const [tableNumber, setTableNumber] = useState("-");
  const isCash = paymentMethod === "cash";

  useEffect(() => {
    setTableNumber(sessionStorage.getItem("tableNumber") || "-");
  }, []);

  const dateObj = new Date();
  const dateStr = dateObj.toLocaleDateString('id-ID', { year: '2-digit', month: '2-digit', day: '2-digit' });
  const timeStr = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const allItems = session.orders.flatMap((o) => o.order_items);
  const subtotal = allItems.reduce((s, oi) => s + parseFloat(oi.item.price) * oi.amount, 0);
  const tax = subtotal * 0.1;
  const total = parseFloat(session.grand_total) || subtotal + tax;
  const orderCode = `ORD-${session.id.toString().padStart(7, "0")}`;

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3, 
        useCORS: true, 
        backgroundColor: "#ffffff",
        logging: false 
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Struk-${orderCode}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Gagal mendownload receipt. Maaf atas ketidaknyamanannya.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden relative z-10">
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
            <p className={`text-sm mt-1 ${isCash ? "text-[#B45309CC]" : "text-green-700"}`}>
              {isCash
                ? "Please show your payment code to the cashier to complete the payment."
                : "Your payment has been successfully completed."}
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <section className="px-6 py-5 border-t border-stone-200">
          <h2 className="flex items-center gap-2 font-bold text-base text-stone-800 mb-4">
            <Receipt className="w-5 h-5 text-primary" /> Payment Information
          </h2>
          <div className="bg-[#F7F7F6] rounded-xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b border-stone-200">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Payment Code</span>
              <span className="font-black text-base text-primary-50">{orderCode}</span>
            </div>
            <div className={`flex justify-between items-center px-4 py-3 ${!isCash ? "border-b border-stone-200" : ""}`}>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Method</span>
              <span className="flex items-center gap-1.5 font-semibold text-base text-stone-800">
                {isCash ? <><Banknote className="w-5 h-5 text-primary" /> Cash</> : <><Smartphone className="w-5 h-5 text-primary" /> Non-Cash</>}
              </span>
            </div>
            {!isCash && (
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</span>
                <span className="flex items-center gap-1 bg-green-100 text-green-700 font-bold text-sm px-3 py-1 rounded-full">
                  <Check className="w-4 h-4" /> PAID
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Items List */}
        <section className="px-6 py-5 border-t border-stone-200">
          <h2 className="font-bold text-base text-stone-800 mb-4">Items</h2>
          <div className="flex flex-col">
            {allItems.map((oi) => (
              <div key={oi.id} className="flex items-center gap-4 py-3">
                <img
                  src={oi.item.img || `https://placehold.co/56x56/8b5e3c/ead7c5?text=${oi.item.name[0]}`}
                  alt={oi.item.name}
                  crossOrigin="anonymous" 
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base text-stone-900 truncate">{oi.item.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{oi.amount}x {fmt(oi.item.price)}</p>
                </div>
                <p className="font-bold text-base text-stone-900 flex-shrink-0">
                  {fmt(parseFloat(oi.item.price) * oi.amount)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-stone-100 pt-4 mt-3 flex flex-col gap-2">
            <div className="flex justify-between text-base text-stone-500">
              <span>Subtotal</span><span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-base text-stone-500">
              <span>Tax (10%)</span><span>{fmt(tax)}</span>
            </div>
            <div className="flex justify-between font-black text-xl text-stone-900 pt-3 mt-1">
              <span>Total Amount</span>
              <span>{fmt(total)}</span>
            </div>
          </div>
        </section>

        {/* Note Box */}
        {/* <div className="mx-6 mb-5 flex items-start gap-3 bg-stone-50 rounded-xl px-4 py-3 border-l-4 border-primary">
          {isCash ? (
            <p className="flex gap-2 text-sm text-stone-600">
              <Info className="w-5 h-5 flex-shrink-0 text-primary" />
              Show this code to the cashier upon pickup.
            </p>
          ) : (
            <p className="flex gap-2 text-sm text-stone-600">
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-500" />
              Your order is being processed by our kitchen.
            </p>
          )}
        </div> */}

        {/* Actions Button */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center px-6 pb-7 pt-2">
          <button 
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            className="flex-1 bg-primary text-white font-bold text-sm rounded-xl py-3.5 hover:bg-primary-30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isDownloading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Download className="w-4 h-4" /> Download Receipt</>}
          </button>  

        </div>
      </div>

      <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
        <div ref={receiptRef} className="bg-white px-6 py-10 font-mono text-stone-900 w-[380px]">
          
          <div className="text-center mb-6">
              <Coffee className="w-12 h-12 text-stone-800 mx-auto mb-2" strokeWidth={1.5}/>
              <h1 className="text-2xl font-black text-stone-950 tracking-tighter uppercase mb-1">Our Restaurant</h1>
              <p className="text-[11px] text-stone-500 leading-relaxed max-w-xs mx-auto">
                  Jl. Palagan, Sariharjo, Kec. Ngaglik, Kab. Sleman, DIY 55581<br />
                  Phone: 0899999999
              </p>
          </div>

          <div className="border-t border-dashed border-stone-300 my-4" />

          <div className="text-xs space-y-1 mb-6 text-stone-600">
            <div className="flex justify-between"><span>CHECK #:</span> <span className="font-semibold text-stone-900">{session.id}</span></div>
            <div className="flex justify-between"><span>ORDER #:</span> <span className="font-semibold text-stone-900">{orderCode}</span></div>
            <div className="flex justify-between"><span>DATE:</span> <span className="font-semibold text-stone-900">{dateStr} {timeStr}</span></div>
            <div className="flex justify-between"><span>TABLE:</span> <span className="font-semibold text-stone-900">{tableNumber}</span></div>
          </div>

          <div className="border-t border-dashed border-stone-300 my-4" />

          <section className="text-xs mb-8">
            <div className="flex justify-between font-bold text-stone-950 uppercase border-b border-stone-300 pb-2 mb-3 tracking-widest text-[10px]">
              <span className="w-8 text-center">QTY</span>
              <span className="flex-1 px-3">ITEM</span>
              <span className="w-20 text-right">PRICE</span>
            </div>

            <div className="space-y-2.5">
              {allItems.map((oi) => (
                <div key={oi.id} className="flex items-start text-stone-800 leading-tight">
                  <span className="w-8 text-center pt-0.5">{oi.amount}x</span>
                  <div className="flex-1 px-3">
                      <p className="font-semibold text-stone-950 uppercase">{oi.item.name}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">@{fmtClassic(oi.item.price)}</p>
                  </div>
                  <span className="w-20 text-right pt-0.5 font-bold text-stone-950">
                    {fmtClassic(parseFloat(oi.item.price) * oi.amount)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="border-t border-dashed border-stone-300 my-5" />

          <section className="text-stone-950 text-xs">
            <div className="flex justify-between py-1.5">
              <span>SUBTOTAL</span><span>{fmtClassic(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>TAX (10%)</span><span>{fmtClassic(tax)}</span>
            </div>
            <div className="flex justify-between font-black text-lg border-t-2 border-stone-900 pt-3 mt-2 uppercase">
              <span>TOTAL AMOUNT</span>
              <span>Rp {fmtClassic(total)}</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 mt-8 pt-5 border-t border-dashed border-stone-300 text-center">
              <span className="text-[10px] font-bold text-stone-500 tracking-wider uppercase">
                PAYMENT: {isCash ? "CASH" : "NON-CASH"}
              </span>
              
              {isCash ? (
                  <div className="font-semibold text-stone-700 text-center uppercase tracking-tight mt-2">
                     * Waiting for Payment *<br/>
                    <span className="text-[10px] font-normal normal-case">Please pay at the cashier</span>
                  </div>
              ) : (
                  <div className="font-bold text-stone-900 text-center uppercase tracking-tight mt-2">
                    * PAID *
                  </div>
              )}
            </div>
          </section>
          
          <div className="border-t border-dashed border-stone-300 my-6" />

          <div className="text-center text-stone-500 space-y-1.5 text-[10px]">
              <p className="font-bold text-stone-800 uppercase">Thank you!</p>
              <p>Please come again.</p>
          </div>

        </div>
      </div>
    </div>
  );
}