"use client";

import { useAdminOrders } from "@/hooks/useAdminOrders";
import Link from "next/link";
import dayjs from "dayjs";

export default function PesananPage() {
  const { data: orders, isLoading, isError } = useAdminOrders();

  const getStatusStyle = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-emerald-100 text-emerald-700'; // Hijau muda
      case 'success': return 'bg-green-600 text-white'; // Hijau tua
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Pesanan</h1>
        <p className="text-gray-500 text-sm">Kelola dan pantau semua pesanan pelanggan yang masuk secara real-time.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Show 
            <select className="border border-gray-200 rounded p-1 outline-none">
              <option>10</option>
              <option>25</option>      
            </select>
            entries
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="py-4 px-4">No</th>
                <th className="py-4 px-4">Kode Pesanan</th>
                {/* <th className="py-4 px-4">Pelanggan</th> */}
                <th className="py-4 px-4">Total</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Meja</th>
                <th className="py-4 px-4">Pembayaran</th>
                <th className="py-4 px-4">Dibuat Pada</th>
                <th className="py-4 px-4">Aksi</th>
                <th className="py-4 px-4">Konfirmasi</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {isLoading && <tr><td colSpan={9} className="py-8 text-center">Loading data...</td></tr>}
              {isError && <tr><td colSpan={9} className="py-8 text-center text-red-500">Gagal memuat pesanan</td></tr>}
              
              {orders?.map((order, index) => {
                const total = order.order_items?.reduce((acc, curr) => acc + (parseInt(curr.item.price) * curr.amount), 0) || 0;
                
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">{index + 1}</td>
                    <td className="py-4 px-4 font-medium text-[#B6845D]">#{order.order_id}</td>
                    {/* <td className="py-4 px-4 font-medium text-gray-900">Guest</td> */}
                    <td className="py-4 px-4 font-bold text-gray-900">Rp {total.toLocaleString('id-ID')}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-500">Table {order.table_number}</td>
                    <td className="py-4 px-4 text-gray-500">{order.payment_method}</td>
                    <td className="py-4 px-4 text-gray-500">{dayjs(order.ordered_at).format('MMM DD, HH:mm')}</td>
                    <td className="py-4 px-4 flex items-center gap-3">
                      <Link href={`/admin/pesanan/${order.id}`}>
                        <button className="px-4 py-1.5 bg-[#F4EFEA] text-[#8C6D56] text-xs font-bold rounded hover:bg-[#EFE8DF] transition-colors">
                          Lihat
                        </button>
                      </Link>                      
                    </td>
                    <td className="py-4 px-4 text-gray-500">
                      <button className="text-gray-400 hover:text-green-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}