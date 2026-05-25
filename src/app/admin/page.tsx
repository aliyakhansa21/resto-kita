"use client";

import { useRouter } from "next/navigation";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { 
    ClipboardList, 
    Banknote, 
    ShoppingCart, 
    Wallet 
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import id from "dayjs/locale/id";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

dayjs.extend(relativeTime);
dayjs.locale(id);

export default function DashboardPage() {
    const router = useRouter();
    const { data, isLoading, isError } = useAdminDashboard();

    const formatRupiah = (value: number | string | null) => {
        if (!value) return "Rp 0";
        const num = typeof value === "string" ? parseFloat(value) : value;
        return `Rp ${num.toLocaleString("id-ID")}`;
    };

    const calculateOrderTotal = (orderItems: any[]) => {
        return orderItems?.reduce((acc, curr) => {
        const price = parseFloat(curr?.item?.price || "0");
        const amount = Number(curr?.amount) || 0;
        return acc + (price * amount);
        }, 0) || 0;
    };

    if (isLoading) {
        return <div className="p-8 text-gray-500 animate-pulse">Memuat data dashboard...</div>;
    }

    if (isError) {
        return <div className="p-8 text-red-500">Gagal memuat data dashboard. Silakan refresh halaman.</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-gray-500 text-sm">
            Selamat Datang, Administrator (admin)!
            </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Pesanan hari ini */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <ClipboardList className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pesanan hari ini</p>
                <h3 className="text-3xl font-bold text-gray-900">{data?.todaysOrder || 0}</h3>
            </div>
            </div>

            {/* Card 2: Pendapatan hari ini */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Banknote className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">+5%</span>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pendapatan hari ini</p>
                <h3 className="text-2xl font-bold text-gray-900">{formatRupiah(data?.todaysIncome)}</h3>
            </div>
            </div>

            {/* Card 3: Total pesanan */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <ShoppingCart className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">+8%</span>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total pesanan</p>
                <h3 className="text-3xl font-bold text-gray-900">{data?.totalOrders || 0}</h3>
            </div>
            </div>

            {/* Card 4: Total pendapatan */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Wallet className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">+15%</span>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total pendapatan</p>
                <h3 className="text-2xl font-bold text-gray-900">{formatRupiah(data?.totalIncome)}</h3>
            </div>
            </div>
        </div>

        {/* Bottom Section: Chart & Latest Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Section */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Grafik Pendapatan (Omzet)</h2>
                <select className="text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-primary focus:border-primary">
                <option>7 Hari Terakhir</option>
                </select>
            </div>
            <div className="h-72 w-full">
                {data?.omzetChart && data.omzetChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.omzetChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                        dy={10}
                    />
                    <YAxis 
                        hide 
                    />
                    <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        formatter={(value: any) => [formatRupiah(value), "Omzet"]}
                    />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                        {data.omzetChart.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={index === 2 ? '#8B5E34' : '#E6E0D8'} />
                        ))}
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
                ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Belum ada data grafik
                </div>
                )}
            </div>
            </div>

            {/* Latest Orders Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Pesanan Terbaru</h2>
            
            <div className="flex-1 space-y-6">
                {data?.latestOrder && data.latestOrder.length > 0 ? (
                data.latestOrder.slice(0, 4).map((order: any, index: number) => {
                    const totalHarga = calculateOrderTotal(order.order_items);
                    const initials = order.customer_name ? order.customer_name.charAt(0).toUpperCase() : "?";
                    const itemSummary = order.order_items?.[0] 
                    ? `${order.order_items[0].item?.name} x${order.order_items[0].amount}` 
                    : "Item tidak diketahui";

                    return (
                    <div key={order.id || index} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center flex-shrink-0">
                            {initials}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 capitalize">{order.customer_name || "Pelanggan"}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[120px]">{itemSummary}</p>
                        </div>
                        </div>
                        <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatRupiah(totalHarga)}</p>
                        <p className="text-xs text-gray-400 capitalize">
                            {order.ordered_at ? dayjs(order.ordered_at).fromNow() : "-"}
                        </p>
                        </div>
                    </div>
                    );
                })
                ) : (
                <p className="text-sm text-gray-400 text-center mt-10">Belum ada pesanan terbaru.</p>
                )}
            </div>

            <button 
                onClick={() => router.push('/admin/pesanan')}
                className="w-full mt-6 py-2.5 text-sm font-bold text-primary border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
                Lihat Semua Pesanan
            </button>
            </div>

        </div>
        </div>
    );
}