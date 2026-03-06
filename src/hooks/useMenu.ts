"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchMenuItems, fetchCategories } from "@/lib/menuService";
import type { MenuItem, Category } from "@/types";

interface UseMenuParams {
    categoryId?: string;   
    search?: string;
}

export function useMenu({ categoryId = "all", search = "" }: UseMenuParams = {}) {
    // Fetch semua items — di-cache, tidak refetch saat filter berubah
    const {
        data: allItems = [],
        isLoading: isLoadingItems,
        isError,
        error,
        refetch,
    } = useQuery<MenuItem[], Error>({
        queryKey: ["menu-items"],         
        queryFn:  fetchMenuItems,         
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });

    // Fetch semua kategori — untuk render tombol filter dinamis
    const {
        data: categories = [],
        isLoading: isLoadingCategories,
    } = useQuery<Category[], Error>({
        queryKey: ["categories"],
        queryFn:  fetchCategories,        
        staleTime: 1000 * 60 * 10,       
    });

    // Client-side filter — tidak trigger network request sama sekali
    const menuItems = useMemo(() => {
        return allItems.filter((item) => {
        const matchCategory =
            categoryId === "all" || item.category.id === categoryId;

        const matchSearch = item.name
            .toLowerCase()
            .includes(search.trim().toLowerCase());

        return matchCategory && matchSearch ;
        // && item.isAvailable
        });
    }, [allItems, categoryId, search]);

    return {
        menuItems,
        categories,
        isLoading: isLoadingItems || isLoadingCategories,
        isError,
        error,
        refetch,
    };
}