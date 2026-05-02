import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order } from '@/types/api';

export function useAdminOrders() {
    return useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
        const { data } = await api.get<{ data: Order[] }>('/admin/orders');
        return data.data; 
        },
    });
}

export function useAdminOrderDetail(id: string) {
    return useQuery({
        queryKey: ['admin-order-detail', id],
        queryFn: async () => {
        const { data } = await api.get<{ data: Order[] }>(`/admin/orders/${id}`);
        return data.data[0]; 
        },
        enabled: !!id,
    });
}