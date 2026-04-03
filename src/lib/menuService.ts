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
        isAvailable: raw.is_active === "1" || raw.is_active === "true",  
        category: {
            id:          raw.category.id,
            name:        raw.category.name,
            description: raw.category.description,
        },
    };
}

// DATA DUMMY SEMENTARA UNTUK TESTING PAYMENT
const DUMMY_CATEGORIES: Category[] = [
    { id: "1", name: "Makanan", description: "Menu Makanan Utama" },
    { id: "2", name: "Minuman", description: "Menu Minuman Segar" }
];

const DUMMY_MENU_ITEMS: MenuItem[] = [
    {
        id: "1",
        name: "Nasi Goreng Spesial",
        description: "Nasi goreng dengan telur, ayam, dan kerupuk.",
        price: 25000,
        imageUrl: "https://placehold.co/400x300/8b5e3c/ead7c5?text=Nasi+Goreng",
        isAvailable: true,
        category: { id: "1", name: "Makanan", description: "Menu Makanan Utama" },
    },
    {
        id: "2",
        name: "Es Teh Manis",
        description: "Es teh manis segar pelepas dahaga.",
        price: 5000,
        imageUrl: "https://placehold.co/400x300/8b5e3c/ead7c5?text=Es+Teh",
        isAvailable: true,
        category: { id: "2", name: "Minuman", description: "Menu Minuman Segar" },
    }
];

// GET /api/categories 
export async function fetchCategories(): Promise<Category[]> {
    const { data } = await api.get<ApiCategoriesResponse>("/categories");
    return data.data;

    // // Return data dummy
    // return DUMMY_CATEGORIES;
}

// GET /api/items 
export async function fetchMenuItems(): Promise<MenuItem[]> {
    const { data } = await api.get<ApiItemsResponse>("/items");
    return data.data.map(mapApiItem);

    // Return data dummy
    // return DUMMY_MENU_ITEMS;
}

// POST /api/orders  
export async function placeOrder(
    payload: OrderPayload
): Promise<OrderApiResponse> {
    const { data } = await api.post<OrderApiResponse>("/orders", payload);
    return data;
}