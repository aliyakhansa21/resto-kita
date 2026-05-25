import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order } from '@/types/api';

export function useAdminOrders() {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            // 1. Fetch halaman pertama
            const { data: firstResponse } = await api.get<{ data: Order[], meta: any, links: any }>('/admin/orders?page=1');
            let allOrders = [...(firstResponse.data || [])];
            const lastPage = firstResponse.meta?.last_page || 1;

            // 2. Fetch sisa halaman secara paralel (Mengatasi data hilang yang tertinggal di page 2+)
            if (lastPage > 1) {
                const pagePromises = [];
                for (let i = 2; i <= lastPage; i++) {
                    pagePromises.push(api.get<{ data: Order[] }>(`/admin/orders?page=${i}`));
                }
                const remainingResponses = await Promise.all(pagePromises);
                remainingResponses.forEach((res) => {
                    allOrders = [...allOrders, ...(res.data.data || [])];
                });
            }

            // 3. Urutkan dari yang terbaru ke terlama berdasarkan ID (Mengatasi pesanan baru tenggelam)
            allOrders.sort((a, b) => b.id - a.id);

            // 4. Fetch detail untuk masing-masing pesanan agar mendapatkan `order_items` (Mengatasi subtotal Rp 0)
            const detailedOrdersPromises = allOrders.map(async (order) => {
                try {
                    const { data: detailResponse } = await api.get<{ data: Order }>(`/admin/orders/${order.id}`);
                    return {
                        ...order,
                        ...detailResponse.data, // Inject data order_items ke dalam list
                    };
                } catch (err) {
                    console.error(`Gagal mengambil detail untuk order ID: ${order.id}`, err);
                    return order; 
                }
            });

            const resolvedOrders = await Promise.all(detailedOrdersPromises);
            return resolvedOrders as unknown as Order[];
        },
        refetchInterval: 5000, 
    });

    return {
        data,
        isLoading,
        isError,
        refetch
    };
}

export function useAdminOrderDetail(id: string) {
    return useQuery({
        queryKey: ['admin-order-detail', id],
        queryFn: async () => {
            const { data } = await api.get<{ data: Order }>(`/admin/orders/${id}`);
            return data.data; 
        },
        enabled: !!id, 
    });
}