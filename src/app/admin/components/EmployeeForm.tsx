import { useState } from "react";
import { ArrowLeft, Shield, RefreshCw, Trash2 } from "lucide-react";
import { Employee } from "@/hooks/useEmployees";

interface Props {
    view: "ADD" | "EDIT";
    selectedEmployee: Employee | null;
    isSubmitting: boolean;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    onDelete: (id: number, name: string) => void;
}

export default function EmployeeForm({ view, selectedEmployee, isSubmitting, onSubmit, onCancel, onDelete }: Props) {
    const [formData, setFormData] = useState({
        fullName: selectedEmployee?.full_name || "",
        username: selectedEmployee?.username || "",
        email: selectedEmployee?.email || "",
        phone: selectedEmployee?.telephone ? selectedEmployee.telephone.replace("+62", "").trim() : "",
        password: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="p-6 sm:p-10 w-full max-w-4xl mx-auto">
            <div className="flex flex-col gap-2 mb-8">
                <button onClick={onCancel} className="w-fit flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors mb-2 text-sm font-medium" disabled={isSubmitting}>
                    <ArrowLeft size={16} /> Kembali
                </button>
                <h1 className="text-3xl font-bold text-stone-800 tracking-tight">
                    {view === "ADD" ? "Tambah Karyawan Baru" : "Edit Data Karyawan"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden relative">
                {isSubmitting && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <RefreshCw className="animate-spin text-primary" size={32} />
                    </div>
                )}

                <div className="p-8 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-stone-500 tracking-wider">NAMA LENGKAP *</label>
                            <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Contoh: Daniel Carter" className="px-4 py-3.5 text-sm rounded-md border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50/50" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-stone-500 tracking-wider">USERNAME *</label>
                            <input required type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} placeholder="carterdanie" className="px-4 py-3.5 text-sm rounded-md border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50/50" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-stone-500 tracking-wider">EMAIL *</label>
                            <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="daniel@gmail.com" className="px-4 py-3.5 text-sm rounded-md border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50/50" />
                        </div>
                        {view === "ADD" && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold text-stone-500 tracking-wider">PASSWORD *</label>
                                <input required={view === "ADD"} type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="px-4 py-3.5 text-sm rounded-md border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50/50" />
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-stone-500 tracking-wider">NOMOR TELEPON *</label>
                            <div className="flex items-stretch relative">
                                <span className="flex items-center justify-center px-4 border border-r-0 border-stone-200 bg-stone-100 rounded-l-md text-sm text-stone-500 font-medium">+62</span>
                                <input required type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} placeholder="812 3456 7890" className="w-full px-4 py-3.5 text-sm rounded-r-md border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50/50" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-stone-100 flex items-center justify-between">
                        {view === "EDIT" ? (
                            <button 
                                type="button" 
                                onClick={() => onDelete(selectedEmployee!.id, selectedEmployee!.full_name)} 
                                className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors" disabled={isSubmitting}
                            >
                                <Trash2 size={16} /> Hapus Karyawan
                            </button>
                        ) : <div></div>}
                        
                        <div className="flex items-center gap-4">
                            <button type="button" onClick={onCancel} className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors px-4 py-2" disabled={isSubmitting}>Batal</button>
                            <button type="submit" disabled={isSubmitting} className="px-8 py-3.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-30 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
                                {isSubmitting && <RefreshCw size={14} className="animate-spin" />}
                                {view === "ADD" ? "Simpan Karyawan" : "Perbarui Data"}
                            </button>
                        </div>
                    </div>
                </div>
                {view === "ADD" && (
                    <div className="bg-stone-50/80 px-10 py-4 flex items-center gap-2 text-[10px] font-bold tracking-wider text-[#4A5D23] border-t border-stone-100">
                        <Shield size={14} /> DATA TERENKRIPSI
                    </div>
                )}
            </form>
        </div>
    );
}