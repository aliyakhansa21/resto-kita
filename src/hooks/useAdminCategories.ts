"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Category } from "@/types";

export function useAdminCategories() {
    const queryClient = useQueryClient();

    // GET: Fetch Categories
    const { data: categories = [], isLoading, isError, refetch } = useQuery<Category[]>({
        queryKey: ["admin-categories"],
        queryFn: async () => {
            const { data } = await api.get("/admin/categories");
            return data.data ?? [];
        },
    });

    // POST: Create Category
    const createMutation = useMutation({
        mutationFn: async (payload: { name: string; description: string }) => {
            return api.post("/admin/categories", payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
        },
    });

    // PUT: Update Category
    const updateMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: { name: string; description: string } }) => {
            return api.put(`/admin/categories/${id}`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
        },
    });

    // DELETE: Remove Category
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/admin/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
        },
    });

    return {
        categories,
        isLoading,
        isError,
        refetch,
        createCategory: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateCategory: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteCategory: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}