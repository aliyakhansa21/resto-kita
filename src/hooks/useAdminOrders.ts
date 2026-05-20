import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order } from '@/types/api';

export function useAdminOrders() {
    return useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            // Ambil data list pesanan utama
            const { data: listResponse } = await api.get<{ data: Order[], meta: any, links: any }>('/admin/orders');
            const ordersList = listResponse.data || [];

            // Lakukan fetch detail secara bersamaan untuk dapet order_items 
            const detailedOrdersPromises = ordersList.map(async (order) => {
                try {
                    const { data: detailResponse } = await api.get<{ data: Order }>(`/admin/orders/${order.id}`);
                    return {
                        ...order,
                        ...detailResponse.data, // Gabungkan data detail ke dalam object order list
                    };
                } catch (err) {
                    console.error(`Gagal mengambil detail untuk order ID: ${order.id}`, err);
                    return order; 
                }
            });

            const resolvedOrders = await Promise.all(detailedOrdersPromises);
            return resolvedOrders as unknown as Order[];
        },
    });
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