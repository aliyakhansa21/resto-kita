"use client";

import { useAdminOrderDetail } from "@/hooks/useAdminOrders";
import { useParams } from "next/navigation";
import { getImageUrl } from "@/utils/imageUrl"; 
import dayjs from "dayjs";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: order, isLoading, isError } = useAdminOrderDetail(id);

  if (isLoading) return (
    <div className="p-8 max-w-5xl animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-7 bg-gray-200 rounded-lg w-48 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-64" />
      </div>

      {/* Card info skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        {/* Status badge */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-7 bg-gray-200 rounded w-48" />
          </div>
          <div className="h-7 bg-gray-200 rounded-full w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-gray-100 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded bg-gray-200 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-5 bg-gray-100 rounded w-32" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-6 h-6 rounded bg-gray-200 flex-shrink-0" />
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-5 bg-gray-100 rounded w-40" />
          </div>
        </div>
      </div>

      {/* Card table skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="h-5 bg-gray-200 rounded w-48" />
          <div className="h-6 bg-gray-200 rounded-full w-16" />
        </div>
        <div className="p-6 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
              <div className="w-6 h-4 bg-gray-200 rounded" />
              <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-40" />
                <div className="h-3 bg-gray-100 rounded w-56" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-24 hidden md:block" />
              <div className="h-8 bg-gray-200 rounded-lg w-12" />
              <div className="h-4 bg-gray-200 rounded w-24 text-right" />
            </div>
          ))}
          {/* Price summary skeleton */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <div className="w-72 space-y-3">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-100 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-100 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <div className="h-5 bg-gray-200 rounded w-12" />
                <div className="h-5 bg-gray-200 rounded w-28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isError || !order) return (
    <div className="p-8 max-w-5xl">
      {/* Page header ghost */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Detail Pesanan</h1>
        <p className="text-gray-500 text-sm">Informasi detail pesanan yang masuk</p>
      </div>

      {/* Error card */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
          <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2 2 0 002-2V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">Gagal Memuat Detail Pesanan</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">
          Data pesanan tidak dapat ditampilkan. Pesanan mungkin sudah dihapus, atau terjadi gangguan koneksi ke server.
        </p>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 active:scale-95 transition-all duration-150"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-md shadow-red-100"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );

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