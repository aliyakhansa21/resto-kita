"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchMenuItems, fetchCategories } from "@/lib/menuService";
import type { MenuItem, Category } from "@/types";

interface UseMenuParams {
    categoryId?: string;   
    search?: string;
    tableToken?: string; 
    isReady?: boolean;   
}

export function useMenu({ 
    categoryId = "all", 
    search = "", 
    tableToken, 
    isReady = true 
}: UseMenuParams = {}) {
    
    const canFetch = Boolean(isReady && tableToken);

    const {
        data: allItems = [],
        isLoading: isLoadingItems,
        isError: isItemsError,
        error: itemsError,
        refetch: refetchItems,
    } = useQuery<MenuItem[], Error>({
        queryKey: ["menu-items", tableToken],         
        queryFn:  () => fetchMenuItems(tableToken),         
        staleTime: 1000 * 60 * 5,
        retry: 2,
        enabled: canFetch, 
    });

    const {
        data: categories = [],
        isLoading: isLoadingCategories,
        isError: isCategoriesError,
        error: categoriesError,
    } = useQuery<Category[], Error>({
        queryKey: ["categories", tableToken],
        queryFn:  () => fetchCategories(tableToken),        
        staleTime: 1000 * 60 * 10,  
        enabled: canFetch,     
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
        isLoading: isLoadingItems || isLoadingCategories || (!canFetch && isReady === false),
        isError: isItemsError || isCategoriesError,
        error: itemsError || categoriesError,
        refetch: refetchItems,
    };
}