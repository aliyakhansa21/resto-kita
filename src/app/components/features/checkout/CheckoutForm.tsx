import { CheckoutForm as FormState, CheckoutFormErrors } from "@/types";
import { UserRound } from 'lucide-react';

interface Props {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    errors: CheckoutFormErrors;
}

export function CheckoutForm({ form }: Props) {
    return (
        <section className="bg-white rounded-2xl shadow-md p-7">
            <h2 className="font-bold text-base text-primary-50 mb-5 flex items-center gap-2">
                <UserRound size={20} />
                Customer Details
            </h2>

            <div className="flex flex-wrap gap-4">
                {/* Nama (read-only) */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                    <label className="text-text-xs font-semibold text-secondary-50 tracking-wider">
                        Nama Lengkap
                    </label>
                    <input
                        value={form.name}
                        readOnly 
                        className="w-full border border-secondary-20 rounded-full px-4 py-2.5 text-base text-secondary-50 bg-[#FAF7F24D] bg-opacity-50 outline-none cursor-not-allowed"
                    />
                </div>

                {/* Nomor Meja (read-only) */}
                <div className="flex flex-col gap-1.5 w-24">
                    <label className="text-text-xs font-semibold text-secondary-50 tracking-wider">
                        Nomor Meja
                    </label>
                    <input
                        value={form.table}
                        readOnly 
                        className="w-full border border-secondary-20 rounded-full px-4 py-2.5 text-base text-secondary-50 bg-[#FAF7F24D] bg-opacity-50 outline-none cursor-not-allowed text-center"
                    />
                </div>
            </div>
        </section>
    );
}