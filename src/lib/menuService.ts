import api from "@/lib/api";
import type {
    ApiCategoriesResponse,
    ApiItemsResponse,
    Category,
    MenuItem,
    OrderPayload,
    OrderApiResponse,
} from "@/types";

// Mapper: raw API item ke app MenuItem 
function mapApiItem(raw: ApiItemsResponse["data"][number]): MenuItem {
    return {
        id:          raw.id,
        name:        raw.name,
        description: raw.description,
        price:       parseFloat(raw.price),                              
        imageUrl:    raw.img,                                             
        is_active:   raw.is_active,  
        category: raw.category ? {
            id:          raw.category.id,
            name:        raw.category.name,
            description: raw.category.description,
        } : {
            id:          "uncategorized",
            name:        "Uncategorized",
            description: "",
        },
    };
}

// GET /api/categories 
export async function fetchCategories(token?: string): Promise<Category[]> {
    const { data } = await api.get<ApiCategoriesResponse>("/categories", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    return data.data;
}

// GET /api/items 
export async function fetchMenuItems(token?: string): Promise<MenuItem[]> {
    const { data } = await api.get<ApiItemsResponse>("/items", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    return data.data.map(mapApiItem);
}

// POST /api/orders  
export async function placeOrder(
    payload: OrderPayload,
    token?: string
): Promise<OrderApiResponse> {
    const { data } = await api.post<OrderApiResponse>("/orders", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    return data;
}