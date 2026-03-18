import { CheckoutForm as FormState, CheckoutFormErrors } from "@/types";

interface Props {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    errors: CheckoutFormErrors;
}

export function CheckoutForm({ form, setForm, errors }: Props) {
    const inputCls = (hasErr?: string) =>
        `w-full border rounded-full px-4 py-2.5 text-base text-primary-50 bg-[#FAF7F24D] bg-opacity-30 outline-none transition-colors
        focus:border-primary focus:bg-white placeholder:text-secondary-40
        ${hasErr ? "border-red-400 bg-red-50" : "border-secondary"}`;

    return (
        <section className="bg-white rounded-2xl shadow-md p-7">
            <h2 className="font-bold text-base text-primary-50 mb-5">Customer Details</h2>

            <div className="flex flex-wrap gap-4 mb-4">
                {/* Nama */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                    <label className="text-text-xs font-semibold text-secondary-50 tracking-wider">
                        Nama Lengkap
                    </label>
                    <input
                        placeholder="Ex: Aurora Zea"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className={inputCls(errors.name)}
                    />
                    {errors.name && (
                        <span className="text-text-xs text-red-500">{errors.name}</span>
                    )}
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                    <label className="text-text-xs font-semibold text-secondary-50 tracking-wider">
                        Nomor WhatsApp
                    </label>
                    <input
                        placeholder="Ex: 08123456789"
                        value={form.whatsapp}
                        onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                        className={inputCls(errors.whatsapp)}
                    />
                    {errors.whatsapp && (
                        <span className="text-text-xs text-red-500">{errors.whatsapp}</span>
                    )}
                </div>

                {/* Nomor Meja (read-only) */}
                <div className="flex flex-col gap-1.5 w-24">
                    <label className="text-text-xs font-semibold text-secondary-50 tracking-wider">
                        Nomor Meja
                    </label>
                    <input
                        value={form.table}
                        readOnly
                        className="w-full border border-secondary-20 rounded-full px-4 py-2.5 text-base text-primary-50 bg-[#FAF7F24D] bg-opacity-50 outline-none cursor-default"
                    />
                </div>
            </div>

            {/* Catatan */}
            <div className="flex flex-col gap-1.5">
                <label className="text-text-xs font-semibold text-secondary-50 tracking-wider">
                Catatan Tambahan
                </label>
                <textarea
                placeholder="Contoh: Tidak pedas, tambahkan alat makan, dll"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
                className={`${inputCls()} resize-none`}
                />
            </div>
        </section>
    );
}