import type { CheckoutOrder } from "@/types";

interface Props {
    order: CheckoutOrder;
    index: number;
}

const fmt = (val: number): string => "Rp" + val.toLocaleString("id-ID").replace(/,/g,".");

export default function OrderCard({ order, index }: Props) {
    const orderSubtotal = order.order_items.reduce(
        (s, oi) => s + parseFloat(oi.item.price) * oi.amount,
        0
    );

    return (
        <div className="rounded-3xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-[#8A5E3D0D] flex items-center justify-between px-5 py-4 border-b border-secondary">
                <div className="flex items-center gap-2">
                    <span className="text-base">🧾</span>
                    <h3 className="font-bold text-base text-primary-50">
                        Order #{index}
                    </h3>
                </div>
                {order.confirmed ? (
                    <span className="text-text-xs font-bold text-[#15803D] uppercase tracking-wider bg-[#DCFCE7] px-3 py-1 rounded-full">
                        Confirmed
                    </span>
                ) : (
                    <span className="text-text-xs font-bold text-secondary-50 uppercase tracking-wider bg-secondary-DEFAULT/30 px-3m py-1 rounded-full">
                        New Addition
                    </span>
                )}
            </div>

            {/* Items */}
            <div className="bg-white">
                {order.order_items.map((oi) => (
                <div key={oi.id} className="flex items-center gap-4 px-5 py-3 border-t border-primary/10">
                    <img
                    src={
                        oi.item.img ||
                        `https://placehold.co/56x56/8b5e3c/ead7c5?text=${oi.item.name[0]}`
                    }
                    alt={oi.item.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                    <p className="font-bold text-base text-primary-50 truncate">
                        {oi.item.name}
                    </p>
                    <p className="text-text-xs text-secondary-40 mt-0.5">
                        · Qty: {oi.amount}
                    </p>
                    </div>
                    <p className="font-bold text-base text-primary-50 flex-shrink-0">
                    {fmt(parseFloat(oi.item.price))}
                    </p>
                </div>
                ))}
            </div>
        
            {/* Subtotal per order */}
            <div className="flex justify-end items-center px-5 py-3 bg-white border-t border-primary/10">
                <span className="text-text-sm text-secondary-50">Order Subtotal:</span>
                <span className="font-bold text-base text-primary">
                {fmt(orderSubtotal)}
                </span>
            </div>
        </div>
    );
}