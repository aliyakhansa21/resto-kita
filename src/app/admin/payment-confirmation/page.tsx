"use client";

import { useState } from "react";
import { CheckCircle, Check } from "lucide-react";

// Types & Dummy Data 

interface Payment {
    id: string;
    tableNo: number;
    totalAmount: number;
    status: "PENDING" | "COMPLETED";
}

const DUMMY_PAYMENTS: Payment[] = [
    { id: "INV-001", tableNo: 1, totalAmount: 124000, status: "PENDING" },
    { id: "INV-002", tableNo: 2, totalAmount: 124000, status: "COMPLETED" },
    { id: "INV-003", tableNo: 3, totalAmount: 124000, status: "COMPLETED" },
    { id: "INV-004", tableNo: 4, totalAmount: 124000, status: "PENDING" },
    { id: "INV-005", tableNo: 5, totalAmount: 210000, status: "PENDING" },
];

// Helpers 

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
};

// Page Component 

export default function PaymentConfirmationPage() {
    const [payments, setPayments] = useState<Payment[]>(DUMMY_PAYMENTS);
    const [entriesToShow, setEntriesToShow] = useState(10);

    // Fungsi dummy untuk mengubah status pembayaran
    const handleConfirmPayment = (id: string) => {
        if (confirm("Apakah Anda yakin ingin mengonfirmasi pembayaran ini?")) {
            setPayments((prev) =>
                prev.map((payment) =>
                    payment.id === id ? { ...payment, status: "COMPLETED" } : payment
                )
            );
        }
    };

    return (
        <div className="p-6 sm:p-10 space-y-8 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-stone-800 tracking-tight">Pembayaran</h1>
                <p className="text-sm text-stone-500 mt-1">
                    Kelola dan konfirmasi pembayaran setiap meja dengan mudah dan cepat.
                </p>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                {/* Table Controls */}
                <div className="px-6 py-5 border-b border-stone-100 flex items-center text-sm text-stone-500 gap-2">
                    <span>Show</span>
                    <select
                        value={entriesToShow}
                        onChange={(e) => setEntriesToShow(Number(e.target.value))}
                        className="border border-stone-200 rounded-lg px-2 py-1 text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                    </select>
                    <span>entries</span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[13px] text-[#64748B] font-bold uppercase tracking-wider border-b border-stone-100 bg-[#F8FAFC]">
                            <tr>
                                <th className="px-10 py-5 w-1/3">NO MEJA</th>
                                <th className="px-6 py-5 w-1/3 text-center">TOTAL PESANAN</th>
                                <th className="px-10 py-5 w-1/3 text-right">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {payments.slice(0, entriesToShow).map((payment) => (
                                <tr key={payment.id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="px-10 py-5 text-stone-500 font-medium">
                                        {payment.tableNo.toString().padStart(2, "0")}
                                    </td>
                                    <td className="px-6 py-5 text-center font-bold text-stone-800">
                                        {formatRupiah(payment.totalAmount)}
                                    </td>
                                    <td className="px-10 py-5">
                                        <div className="flex justify-end">
                                            {payment.status === "PENDING" ? (
                                                <button
                                                    onClick={() => handleConfirmPayment(payment.id)}
                                                    className="text-stone-400 hover:text-stone-800 transition-colors"
                                                    title="Konfirmasi Pembayaran"
                                                >
                                                    <CheckCircle size={24} strokeWidth={1.5} />
                                                </button>
                                            ) : (
                                                <div 
                                                    className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white"
                                                    title="Pembayaran Selesai"
                                                >
                                                    <Check size={16} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Dummy */}
                <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 bg-white">
                    <span>
                        Showing 1 to {Math.min(entriesToShow, payments.length)} of {payments.length} entries
                    </span>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-stone-200 hover:bg-stone-50 transition-colors">
                            &lt;
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#8C6D56] text-white font-medium">
                            1
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-stone-200 hover:bg-stone-50 transition-colors">
                            2
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-stone-200 hover:bg-stone-50 transition-colors">
                            3
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-stone-200 hover:bg-stone-50 transition-colors">
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}