"use client";

import { useAdminOrderDetail } from "@/hooks/useAdminOrders";
import { useParams } from "next/navigation";
import { getImageUrl } from "@/utils/imageUrl"; 
import dayjs from "dayjs";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: order, isLoading, isError } = useAdminOrderDetail(id);

  if (isLoading) return <div className="p-8">Loading detail pesanan...</div>;
  if (isError || !order) return <div className="p-8 text-red-500">Gagal memuat detail pesanan.</div>;

  const subtotal = order.order_items.reduce((acc, curr) => acc + (parseInt(curr.item.price) * curr.amount), 0);
  const tax = subtotal * 0.1; 
  const total = subtotal + tax;

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Detail Pesanan</h1>
        <p className="text-gray-500 text-sm">Informasi detail pesanan yang masuk</p>
      </div>

      {/* Card Info Utama */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 relative">
        <div className="absolute top-8 right-8 text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Status</p>
            <span className="bg-[#5D702A] text-white px-4 py-1.5 rounded-full text-xs font-semibold">
              {order.payment_status}
            </span>
        </div>

        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Kode Pesanan</p>
        <h2 className="text-2xl font-bold text-[#8C6D56] mb-8">{order.order_id}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-gray-100 mb-8">
          <div className="flex gap-4">
            <svg className="w-6 h-6 text-[#8C6D56]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Dibuat Pada</p>
              <p className="font-medium text-gray-900">{dayjs(order.ordered_at).format('DD-MM-YYYY HH:mm')}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <svg className="w-6 h-6 text-[#8C6D56]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">No. Meja</p>
              <p className="font-medium text-gray-900">{order.table_number}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <svg className="w-6 h-6 text-[#8C6D56]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nama Pelanggan</p>
              <p className="font-medium text-gray-900">Guest</p>
            </div>
          </div>
          <div className="flex gap-4">
            <svg className="w-6 h-6 text-[#8C6D56]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Metode Pembayaran</p>
              <span className="bg-[#EFE8DF] text-[#8C6D56] px-3 py-1 rounded text-xs font-bold">{order.payment_method}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <svg className="w-6 h-6 text-[#8C6D56]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Catatan</p>
            <p className="font-medium text-gray-900">-</p>
          </div>
        </div>
      </div>

      {/* Card Daftar Menu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Daftar menu yang dipesan</h3>
          <span className="bg-[#F4EFEA] text-[#5D702A] px-3 py-1 rounded-full text-xs font-bold">{order.order_items.length} Items</span>
        </div>

        <div className="p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="pb-4 w-12">No</th>
                <th className="pb-4 w-24">Gambar</th>
                <th className="pb-4">Nama Menu</th>
                <th className="pb-4">Harga</th>
                <th className="pb-4 text-center">Jumlah</th>
                <th className="pb-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((orderItem, index) => {
                const itemTotal = parseInt(orderItem.item.price) * orderItem.amount;
                return (
                  <tr key={orderItem.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-6 text-gray-500 font-medium">{index + 1}</td>
                    <td className="py-6">
                      <img 
                        src={getImageUrl(orderItem.item.img) || '/placeholder.jpg'} 
                        alt={orderItem.item.name} 
                        className="w-14 h-14 object-cover rounded-full shadow-sm"
                      />
                    </td>
                    <td className="py-6">
                      <p className="font-bold text-gray-900">{orderItem.item.name}</p>
                      <p className="text-sm text-gray-400 mt-1">{orderItem.item.description}</p>
                    </td>
                    <td className="py-6 text-gray-600 font-medium">Rp {parseInt(orderItem.item.price).toLocaleString('id-ID')}</td>
                    <td className="py-6 text-center">
                      <span className="bg-[#F4EFEA] text-[#8C6D56] px-4 py-1.5 rounded-lg font-bold">{orderItem.amount}</span>
                    </td>
                    <td className="py-6 text-right font-bold text-[#8C6D56]">
                      Rp {itemTotal.toLocaleString('id-ID')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Bagian Kalkulasi Harga */}
          <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
            <div className="w-72 space-y-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Pajak (10%)</span>
                <span className="font-medium text-gray-900">Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#8C6D56]">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}