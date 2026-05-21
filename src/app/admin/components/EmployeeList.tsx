import { Users, Pencil, Trash2, KeyRound, RefreshCw } from "lucide-react";
import { Employee } from "@/hooks/useEmployees";

interface Props {
    employees: Employee[];
    isLoading: boolean;
    onAdd: () => void;
    onEdit: (emp: Employee) => void;
    onResetPassword: (emp: Employee) => void;
    onDelete: (id: number, name: string) => void; 
}

export default function EmployeeList({ employees, isLoading, onAdd, onEdit, onResetPassword, onDelete }: Props) {
    return (
        <div className="p-6 sm:p-10 space-y-8 w-full max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800 tracking-tight">Manajemen Karyawan</h1>
                    <p className="text-sm text-stone-500 mt-1">Kelola pengaturan tim dapur dan staf layanan pelanggan</p>
                </div>
                <button 
                    onClick={onAdd}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-30 shadow-sm transition-all"
                >
                    <Users size={18} /> + Tambah Karyawan Baru
                </button>
            </div>

            <div className="bg-white px-6 py-5 rounded-2xl shadow-sm border border-stone-100 flex flex-col w-64">
                <span className="text-[10px] font-bold text-[#51443C] tracking-wider mb-2">TOTAL KARYAWAN</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-stone-800 leading-none">
                        {isLoading ? "..." : employees.length}
                    </span>
                    {!isLoading && employees.length > 0 && (
                        <span className="text-[#4A5D23] text-sm font-bold mb-1">+3~</span>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                        <RefreshCw className="animate-spin text-primary" size={32} />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[11px] text-[#51443C] font-bold uppercase tracking-wider border-b border-stone-100 bg-stone-50/50">
                            <tr>
                                <th className="px-6 py-5">NO</th>
                                <th className="px-6 py-5">NAMA LENGKAP</th>
                                <th className="px-6 py-5">NO TELEPON</th>
                                <th className="px-6 py-5">USERNAME</th>
                                <th className="px-6 py-5 text-right">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {employees.length === 0 && !isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-stone-400">Belum ada data karyawan.</td>
                                </tr>
                            ) : (
                                employees.map((emp, idx) => (
                                    <tr key={emp.id} className="hover:bg-stone-50/50 transition-colors">
                                        <td className="px-6 py-4 text-[#2D1603]">{(idx + 1).toString().padStart(2, '0')}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[#2D1603]">{emp.full_name}</div>
                                            <div className="text-xs text-[#51443C]">{emp.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-[#51443C]">{emp.telephone}</td>
                                        <td className="px-6 py-4 text-[#51443C]">{emp.username}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-4 text-[#51443C]">
                                                <button onClick={() => onResetPassword(emp)} className="hover:text-[#4A5D23] transition-colors" title="Ganti Password">
                                                    <KeyRound size={16} />
                                                </button>
                                                <button onClick={() => onEdit(emp)} className="hover:text-[#8C6D56] transition-colors" title="Edit">
                                                    <Pencil size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => onDelete(emp.id, emp.full_name)} 
                                                    className="hover:text-red-500 transition-colors" 
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}