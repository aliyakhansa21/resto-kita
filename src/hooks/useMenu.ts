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

    const {
        data: categories = [],
        isLoading: isLoadingCategories,
    } = useQuery<Category[], Error>({
        queryKey: ["categories"],
        queryFn:  fetchCategories,        
        staleTime: 1000 * 60 * 10,       
    });

    const menuItems = useMemo(() => {    
        return allItems.filter((item) => {
            const matchCategory =
                categoryId === "all" || String(item.category?.id) === String(categoryId);

            const matchSearch = item.name
                .toLowerCase()
                .includes(search.trim().toLowerCase());

            const isActive = item.is_active;
            const matchActive =
                isActive === undefined ? true : 
                (
                    String(isActive) === "1" || 
                    String(isActive).toLowerCase() === "true" ||
                    isActive === 1 ||
                    isActive === true
                );

            return matchCategory && matchSearch && matchActive;
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