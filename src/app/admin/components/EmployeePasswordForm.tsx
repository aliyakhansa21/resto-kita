import { useState } from "react";
import { RefreshCw, KeyRound } from "lucide-react";
import { Employee } from "@/hooks/useEmployees";

interface Props {
    selectedEmployee: Employee | null;
    isSubmitting: boolean;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export default function EmployeePasswordForm({ selectedEmployee, isSubmitting, onSubmit, onCancel }: Props) {
    const [resetData, setResetData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

    const getPasswordStrength = (pass: string) => {
        if (!pass) return { label: "", color: "bg-stone-100", text: "", width: "0%" };
        if (pass.length < 6) return { label: "LEMAH", color: "bg-red-500", text: "text-red-600", width: "33%" };
        if (pass.length < 10) return { label: "SEDANG", color: "bg-yellow-500", text: "text-yellow-600", width: "66%" };
        return { label: "KUAT", color: "bg-[#4A5D23]", text: "text-[#4A5D23]", width: "100%" };
    };

    const strength = getPasswordStrength(resetData.newPassword);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(resetData);
    };

    return (
        <div className="p-6 sm:p-10 flex flex-col items-center justify-center min-h-[75vh] w-full">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 p-8 sm:p-10 w-full max-w-md relative overflow-hidden">
                {isSubmitting && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                        <RefreshCw className="animate-spin text-primary" size={32} />
                    </div>
                )}

                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4A5D23]/10 text-[#4A5D23] mb-4">
                        <KeyRound size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#2D1603]">Ganti Password</h2>
                    <p className="text-sm text-stone-500 mt-1">Ubah sandi untuk {selectedEmployee?.full_name}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-stone-500 tracking-wider">PASSWORD LAMA</label>
                        <input required type="password" value={resetData.currentPassword} onChange={(e) => setResetData({...resetData, currentPassword: e.target.value})} placeholder="••••••••" className="px-4 py-3.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-stone-500 tracking-wider">PASSWORD BARU</label>
                        <input required type="password" value={resetData.newPassword} onChange={(e) => setResetData({...resetData, newPassword: e.target.value})} placeholder="••••••••" className="px-4 py-3.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-stone-500 tracking-wider">KONFIRMASI PASSWORD BARU</label>
                        <input required type="password" value={resetData.confirmPassword} onChange={(e) => setResetData({...resetData, confirmPassword: e.target.value})} placeholder="••••••••" className="px-4 py-3.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50/50" />
                        {resetData.newPassword && (
                            <div className="flex items-center gap-3 mt-3">
                                <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${strength.color} transition-all duration-500 ease-out`} style={{ width: strength.width }} />
                                </div>
                                <span className={`text-[10px] font-bold tracking-wider ${strength.text}`}>{strength.label}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 pt-6">
                        <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 rounded-xl bg-[#8C6D56] text-white text-sm font-medium hover:bg-[#725743] transition-colors shadow-sm disabled:opacity-70">
                            Simpan Perubahan
                        </button>
                        <button type="button" onClick={onCancel} disabled={isSubmitting} className="flex-1 py-3.5 rounded-xl bg-white border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}