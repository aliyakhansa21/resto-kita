// src/app/components/features/checkout/PaymentSelector.tsx

import { PaymentMethod } from "@/types";

interface PaymentOption {
    id: PaymentMethod;
    label: string;
    sub: string;
    icon: string;
}

interface Props {
    selected: PaymentMethod;
    onChange: (method: PaymentMethod) => void;
}

const OPTIONS: PaymentOption[] = [
    { id: "cash",     label: "Cash",     sub: "Pay at the cashier",          icon: "💵" },
    { id: "non_cash", label: "Non-Cash", sub: "QRIS, OVO, Dana, GoPay, etc", icon: "📱" },
];

export function PaymentSelector({ selected, onChange }: Props) {
    return (
        <div className="flex flex-col gap-3 mb-6">
            {OPTIONS.map((opt) => {
                const active = selected === opt.id;
                return (
                <label
                    key={opt.id}
                    className={`flex items-center justify-between rounded-full px-4 py-3 cursor-pointer border transition-all
                    ${
                        active
                        ? "bg-primary/5 border-primary border-2"
                        : "border-secondary hover:border-primary border-2"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                            <p className="font-bold text-base text-primary-50">{opt.label}</p>
                            <p className="text-text-xs text-secondary-50">{opt.sub}</p>
                        </div>
                    </div>
                    <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={active}
                    onChange={() => onChange(opt.id)}
                    className="accent-primary w-4 h-4"
                    />
                </label>
                );
            })}
        </div>
    );
}