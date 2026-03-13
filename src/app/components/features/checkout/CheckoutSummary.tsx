import type { CartItem } from "@/types";

interface Props {
    items: CartItem[];
}

const fmt = (val: number): string => "Rp" + val.toLocaleString("id-ID").replace(/,/g, ".");

export  function CheckoutSummary({ items }: Props) {
    return (
        <div className="flex flex-col gap-5">
            {items.map((ci) => (
                <div key={ci.menuItem.id} className="flex items-center gap-4">
                    <img
                        src={
                        ci.menuItem.imageUrl ||
                        `https://placehold.co/64x64/8b5e3c/ead7c5?text=${ci.menuItem.name[0]}`
                        }
                        alt={ci.menuItem.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-base text-primary-50 truncate">
                        {ci.menuItem.name}
                        </p>
                        <p className="text-text-xs text-secondary-50 mt-0.5 truncate">
                        {ci.menuItem.description}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-bold text-base text-primary">
                        {fmt(ci.menuItem.price)}
                        </p>
                        <p className="text-text-xs text-secondary-40">Qty: {ci.quantity}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}