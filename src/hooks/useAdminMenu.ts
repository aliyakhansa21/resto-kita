"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Category } from "@/types";

export interface AdminMenuItem {
    id: number;
    name: string;
    description: string;
    price: string;
    img: string;
    is_active: number;
    category: Category;
}

export interface PaginatedMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

interface AdminMenuResponse {
    data: AdminMenuItem[];
    meta: PaginatedMeta;
}

interface UseAdminMenuParams {
    page?: number;
    perPage?: number;
}

export function useAdminMenu({ page = 1, perPage = 1000 }: UseAdminMenuParams = {}) {
    const queryClient = useQueryClient();
    const queryKey = ["admin-menu-items", page, perPage];

    const { data, isLoading, isError, error, refetch } = useQuery<AdminMenuResponse, Error>({
        queryKey,
        queryFn: async () => {
            const { data } = await api.get<AdminMenuResponse>(`/admin/items?page=${page}&per_page=${perPage}`);
            return data;
        },
        staleTime: 1000 * 60 * 2,
        placeholderData: keepPreviousData, 
    });

    const toggleStatusMutation = useMutation({
        mutationFn: async (item: AdminMenuItem) => {
            return api.put(`/admin/items/${item.id}`, {
                name: item.name,
                description: item.description,
                price: parseFloat(item.price),
                category_id: item.category.id,
                is_active: item.is_active === 1 ? false : true,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-menu-items"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return api.delete(`/admin/items/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-menu-items"] });
        },
    });

    return {
        items: data?.data ?? [],
        meta: data?.meta ?? null,
        isLoading,
        isError,
        error,
        refetch,
        toggleStatus: toggleStatusMutation.mutate,
        isToggling: toggleStatusMutation.isPending, 
        deleteItem: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending, 
    };
}