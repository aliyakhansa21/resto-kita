"use client";

import { useState } from "react";
import { Users, Pencil, Trash2, ArrowLeft, Shield } from "lucide-react";

// Types & Dummy Data 

interface Employee {
    id: number;
    fullName: string;
    phone: string;
    username: string;
    email: string;
}

const DUMMY_EMPLOYEES: Employee[] = [
    { id: 1, fullName: "Daniel Carter", phone: "+6281234567890", username: "carterdanie", email: "daniel@gmail.com" },
    { id: 2, fullName: "Sarah Jenkins", phone: "+6281298765432", username: "sarahjenk", email: "sarah@gmail.com" },
    { id: 3, fullName: "Budi Santoso", phone: "+6281211112222", username: "budisantoso", email: "budi@gmail.com" },
    { id: 4, fullName: "Siti Aminah", phone: "+6281233334444", username: "sitiaminah", email: "siti@gmail.com" },
    { id: 5, fullName: "Reza Rahadian", phone: "+6281255556666", username: "rezarahadian", email: "reza@gmail.com" },
];

type ViewState = "LIST" | "ADD" | "EDIT";

// Page Component 

export default function EmployeeManagementPage() {
    const [view, setView] = useState<ViewState>("LIST");
    const [employees, setEmployees] = useState<Employee[]>(DUMMY_EMPLOYEES);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: ""
    });

    const handleOpenAdd = () => {
        setFormData({ fullName: "", username: "", email: "", phone: "", password: "" });
        setView("ADD");
    };

    const handleOpenEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setFormData({
            fullName: employee.fullName,
            username: employee.username,
            email: employee.email,
            phone: employee.phone.replace("+62", "").trim(),
            password: ""
        });
        setView("EDIT");
    };

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
            setEmployees(employees.filter(emp => emp.id !== id));
            setView("LIST");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (view === "ADD") {
            const newEmployee: Employee = {
                id: Date.now(),
                fullName: formData.fullName,
                username: formData.username,
                email: formData.email,
                phone: `+62 ${formData.phone}`
            };
            setEmployees([newEmployee, ...employees]);
        } else if (view === "EDIT" && selectedEmployee) {
            setEmployees(employees.map(emp => 
                emp.id === selectedEmployee.id 
                ? { ...emp, fullName: formData.fullName, username: formData.username, email: formData.email, phone: `+62 ${formData.phone}` }
                : emp
            ));
        }
        
        setView("LIST");
    };

    // RENDER: LIST VIEW 
    if (view === "LIST") {
        return (
            <div className="p-6 sm:p-10 space-y-8 w-full max-w-6xl mx-auto">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-800 tracking-tight">Manajemen Karyawan</h1>
                        <p className="text-sm text-stone-500 mt-1">Kelola pengaturan tim dapur dan staf layanan pelanggan</p>
                    </div>
                    <button 
                        onClick={handleOpenAdd}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-30 shadow-sm"
                    >
                        <Users size={18} /> + Tambah Karyawan Baru
                    </button>
                </div>

                {/* Info Card */}
                <div className="bg-white px-6 py-5 rounded-2xl shadow-sm border border-stone-100 flex flex-col w-64">
                    <span className="text-[10px] font-bold text-[#51443C] tracking-wider mb-2">TOTAL KARYAWAN</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-stone-800 leading-none">{employees.length}</span>
                        <span className="text-[#4A5D23] text-sm font-bold mb-1">+3~</span>
                    </div>
                </div>

                {/* Table Component */}
                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
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
                                {employees.map((emp, idx) => (
                                    <tr key={emp.id} className="hover:bg-stone-50/50 transition-colors">
                                        <td className="px-6 py-4 text-[#2D1603]">{(idx + 1).toString().padStart(2, '0')}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[#2D1603]">{emp.fullName}</div>
                                            <div className="text-xs text-[#51443C]">{emp.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-[#51443C]">{emp.phone}</td>
                                        <td className="px-6 py-4 text-[#51443C]">{emp.username}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-4 text-[#51443C]">
                                                <button onClick={() => handleOpenEdit(emp)} className="hover:text-[#8C6D56] transition-colors"><Pencil size={16} /></button>
                                                <button onClick={() => handleDelete(emp.id)} className="hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Dummy */}
                    <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 bg-white">
                        <span>Showing 1 to {employees.length} of {employees.length} employees</span>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 flex items-center justify-center rounded border border-stone-200 hover:bg-stone-50">&lt;</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#6F4627] text-white font-medium">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded border border-stone-200 hover:bg-stone-50">2</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded border border-stone-200 hover:bg-stone-50">&gt;</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER: ADD / EDIT VIEW 
    return (
        <div className="p-6 sm:p-10 w-full max-w-4xl mx-auto">
            {/* Header Form */}
            <div className="flex flex-col gap-2 mb-8">
                <button onClick={() => setView("LIST")} className="w-fit flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors mb-2 text-sm font-medium">
                    <ArrowLeft size={16} /> Kembali
                </button>
                <h1 className="text-3xl font-bold text-stone-800 tracking-tight">
                    {view === "ADD" ? "Tambah Karyawan Baru" : "Edit Data Karyawan"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-8 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-stone-500 tracking-wider">NAMA LENGKAP *</label>
                            <input 
                                type="text" 
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                placeholder="Contoh: Daniel Carter"
                                className="px-4 py-3.5 text-sm rounded-md border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50/50"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-stone-500 tracking-wider">USERNAME *</label>
                            <input 
                                type="text" 
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                placeholder="carterdanie"
                                className="px-4 py-3.5 text-sm rounded-md border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50/50"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-stone-500 tracking-wider">EMAIL *</label>
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="daniel@gmail.com"
                                className="px-4 py-3.5 text-sm rounded-md border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50/50"
                            />
                        </div>
                        {view === "ADD" && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold text-stone-500 tracking-wider">PASSWORD *</label>
                                <input 
                                    type="password" 
                                    required={view === "ADD"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder="••••••••"
                                    className="px-4 py-3.5 text-sm rounded-md border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50/50"
                                />
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-stone-500 tracking-wider">NOMOR TELEPON *</label>
                            <div className="flex items-stretch relative">
                                <span className="flex items-center justify-center px-4 border border-r-0 border-stone-200 bg-stone-100 rounded-l-md text-sm text-stone-500 font-medium">
                                    +62
                                </span>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                                    placeholder="812 3456 7890"
                                    className="w-full px-4 py-3.5 text-sm rounded-r-md border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-stone-100 flex items-center justify-between">
                        {view === "EDIT" ? (
                            <button 
                                type="button"
                                onClick={() => handleDelete(selectedEmployee!.id)}
                                className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                            >
                                <Trash2 size={16} /> Hapus Karyawan
                            </button>
                        ) : <div></div>}
                        
                        <div className="flex items-center gap-4">
                            <button 
                                type="button" 
                                onClick={() => setView("LIST")}
                                className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors px-4 py-2"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit"
                                className="px-8 py-3.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-30 transition-colors shadow-sm"
                            >
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