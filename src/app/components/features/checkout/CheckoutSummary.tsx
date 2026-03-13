import { CheckoutOrderItem } from "@/types";

interface Props {
    items: CheckoutOrderItem[];
}

const fmt = (val: string | number): string => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return "Rp" + num.toLocaleString("id-ID").replace(/,/g, ".");
};

export function CheckoutSummary({ items }: Props) {
    return (
        <div className="flex flex-col gap-5">
            {items.map((oi) => (
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
                        <p className="text-text-xs text-secondary-50 mt-0.5 truncate">
                        {oi.item.description}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-bold text-base text-primary">
                        {fmt(oi.item.price)}
                        </p>
                        <p className="text-text-xs text-secondary-40">Qty: {oi.amount}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}