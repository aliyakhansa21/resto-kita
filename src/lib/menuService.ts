import api from "@/lib/api";
import type {
    ApiCategoriesResponse,
    ApiItemsResponse,
    Category,
    MenuItem,
    OrderPayload,
    OrderApiResponse,
    } from "@/types";

    // Mapper: raw API item → app MenuItem 
    // Satu tempat konversi — kalau backend berubah field name, edit di sini saja
    function mapApiItem(raw: ApiItemsResponse["data"][number]): MenuItem {
    return {
        id:          raw.id,
        name:        raw.name,
        description: raw.description,
        price:       parseFloat(raw.price),                              
        imageUrl:    raw.img,                                             
        isAvailable: raw.is_active === "1" || raw.is_active === "true",  
        category: {
        id:          raw.category.id,
        name:        raw.category.name,
        description: raw.category.description,
        },
    };
    }

    // GET /api/categories 
    export async function fetchCategories(): Promise<Category[]> {
        const { data } = await api.get<ApiCategoriesResponse>("/categories");
        return data.data;
    }

    // GET /api/items 
    export async function fetchMenuItems(): Promise<MenuItem[]> {
        const { data } = await api.get<ApiItemsResponse>("/items");
        return data.data.map(mapApiItem);
    }

    // POST /api/orders 
    export async function placeOrder(
        payload: OrderPayload
    ): Promise<OrderApiResponse> {
        const { data } = await api.post<OrderApiResponse>("/orders", payload);
        return data;
    }