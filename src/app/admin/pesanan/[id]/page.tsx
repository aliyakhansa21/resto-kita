"use client";

import { useAdminOrderDetail } from "@/hooks/useAdminOrders";
import { useParams } from "next/navigation";
import { getImageUrl } from "@/utils/imageUrl";
import dayjs from "dayjs";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: order, isLoading, isError } = useAdminOrderDetail(id);

  if (isLoading)
    return (
      <div className="p-8 max-w-5xl animate-pulse">
        <div className="h-7 bg-gray-200 rounded-lg w-48 mb-2" />
        <p>Loading detail pesanan...</p>
      </div>
    );

  if (isError || !order)
    return (
      <div className="p-8 max-w-5xl">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Gagal Memuat Detail Pesanan
        </h2>
      </div>
    );

  const subtotal =
    order.order_items?.reduce((acc, curr) => {
      const price = curr?.item?.price ? parseInt(curr.item.price) : 0;
      const amount = curr?.amount || 0;
      return acc + price * amount;
    }, 0) || 0;

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="p-8 max-w-5xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Detail Pesanan</h1>
        <p className="text-gray-500 text-sm">
          Informasi detail pesanan yang masuk
        </p>
      </div>

      {/* Card Info Utama */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 shadow-xl">
        {/* Kode Pesanan + Status */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-primary-60 uppercase tracking-widest mb-1">
              Kode Pesanan
            </p>
            <h2 className="text-2xl font-bold text-primary">
              #{order.order_id}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-primary-60 uppercase tracking-widest mb-2">
              Status
            </p>
            <span className="bg-accent text-white px-4 py-1.5 rounded-full text-xs font-semibold">
              {order.payment_status || "Unknown"}
            </span>
          </div>
        </div>

        {/* Grid Info 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-gray-100 mb-8">
          {/* Dibuat Pada */}
          <div className="flex gap-4 items-start">
            <svg
              className="w-5 h-5 text-primary mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="text-xs font-medium text-primary-60 uppercase tracking-widest mb-1">
                Dibuat Pada
              </p>
              <p className="font-medium text-gray-900">
                {dayjs(order.ordered_at).format("DD-MM-YYYY HH:mm")}
              </p>
            </div>
          </div>

          {/* No. Meja */}
          <div className="flex gap-4 items-start">
            <svg
              className="w-5 h-5 text-primary mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <div>
              <p className="text-xs font-medium text-primary-60 uppercase tracking-widest mb-1">
                No. Meja
              </p>
              <p className="font-medium text-gray-900">{order.table_number}</p>
            </div>
          </div>

          {/* Nama Pelanggan */}
          <div className="flex gap-4 items-start">
            <svg
              className="w-5 h-5 text-primary mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <div>
              <p className="text-xs font-medium text-primary-60 uppercase tracking-widest mb-1">
                Nama Pelanggan
              </p>
              <p className="font-medium text-gray-900">
                {"-"}
              </p>
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div className="flex gap-4 items-start">
            <svg
              className="w-5 h-5 text-primary mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <div>
              <p className="text-xs font-medium text-primary-60 uppercase tracking-widest mb-1">
                Metode Pembayaran
              </p>
              {order.payment_method ? (
                <span className="inline-block bg-secondary text-primary-30 text-xs font-semibold px-3 py-1 rounded-full">
                  {order.payment_method}
                </span>
              ) : (
                <p className="font-medium text-gray-900">-</p>
              )}
            </div>
          </div>
        </div>

        {/* Catatan */}
        <div className="flex gap-4 items-start">
          <svg
            className="w-5 h-5 text-primary mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <div>
            <p className="text-xs font-medium text-primary-60 uppercase tracking-widest mb-1">
              Catatan
            </p>
            <p className="font-medium text-gray-900">{"-"}</p>
          </div>
        </div>
      </div>

      {/* Card Daftar Menu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 shadow-xl">
        {/* Card Header */}
        <div className="p-6 border-b border-primary/10 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">
            Daftar menu yang dipesan
          </h3>
          <span className="bg-accent-50/10 text-accent-50 text-xs font-bold px-3 py-1 rounded-full">
            {order.order_items?.length || 0} Items
          </span>
        </div>

        {/* Tabel */}
        <div className="p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/10">
                <th className="pb-4 text-xs font-bold text-primary-60 uppercase tracking-widest w-12">
                  No
                </th>
                <th className="pb-4 text-xs font-bold text-primary-60 uppercase tracking-widest w-20">
                  Gambar
                </th>
                <th className="pb-4 text-xs font-bold text-primary-60 uppercase tracking-widest">
                  Nama Menu
                </th>
                <th className="pb-4 text-xs font-bold text-primary-60 uppercase tracking-widest">
                  Harga
                </th>
                <th className="pb-4 text-xs font-bold text-primary-60 uppercase tracking-widest text-center">
                  Jumlah
                </th>
                <th className="pb-4 text-xs font-bold text-primary-60 uppercase tracking-widest text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.order_items?.map((orderItem, index) => {
                const price = orderItem?.item?.price
                  ? parseInt(orderItem.item.price)
                  : 0;
                const amount = orderItem?.amount || 0;
                const itemTotal = price * amount;

                return (
                  <tr
                    key={orderItem.id}
                    className="border-b border-primary/10 last:border-0"
                  >
                    <td className="py-5 text-gray-400 font-medium text-sm">
                      {index + 1}
                    </td>
                    <td className="py-5">
                      <img
                        src={
                          (orderItem?.item?.img &&
                            getImageUrl(orderItem.item.img)) ||
                          "/placeholder.jpg"
                        }
                        alt={orderItem?.item?.name || "Menu Item"}
                        className="w-14 h-14 object-cover rounded-full shadow-sm"
                      />
                    </td>
                    <td className="py-5">
                      <p className="font-bold text-gray-900">
                        {orderItem?.item?.name || "Menu Tidak Diketahui"}
                      </p>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {orderItem?.item?.description || "-"}
                      </p>
                    </td>
                    <td className="py-5 text-gray-600 font-medium">
                      Rp{price.toLocaleString("id-ID")}
                    </td>
                    <td className="py-5 text-center">
                      <span className="bg-secondary text-primary text-sm font-bold px-4 py-1.5 rounded-lg">
                        {amount}
                      </span>
                    </td>
                    <td className="py-5 text-right font-bold text-primary">
                      Rp{itemTotal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Kalkulasi Harga */}
          <div className="mt-8 pt-8 border-t border-primary/10 flex justify-end">
            <div className="w-72 space-y-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  Rp{subtotal.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Pajak (10%)</span>
                <span className="font-medium text-gray-900">
                  Rp{tax.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-primary/10">
                <span>Total</span>
                <span className="text-primary font-bold">
                  Rp{total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}