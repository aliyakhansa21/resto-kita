"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Category } from "@/types";

export interface CreateMenuPayload {
    name: string;
    description: string;
    price: number | string;
    category_id: number;
    is_active: boolean;
    imageFile?: File | null; 
}

export function useCreateMenu() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateMenuPayload) => {
            const formData = new FormData();
            
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price.toString());
            formData.append("category_id", data.category_id.toString());
            
            formData.append("is_active", data.is_active ? "1" : "0");

            if (data.imageFile) {
                formData.append("img", data.imageFile);
            } 

            const response = await api.post("/admin/items", formData, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            });
            
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-menu-items"] });
        },
    });
}