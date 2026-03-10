export interface ApiCategory {
    id: string;
    name: string;
    description: string;
    }

    export interface ApiItem {
    id: string;
    name: string;
    description: string;
    price: string;        
    img: string;          
    is_active: string;    
    category: ApiCategory;
    }

    export interface ApiCategoriesResponse {
    data: ApiCategory[];
    }

    export interface ApiItemsResponse {
    data: ApiItem[];
    }

    export interface Category {
    id: string;
    name: string;
    description: string;
    }

    export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;         
    imageUrl?: string | null;      
    isAvailable: boolean;  
    category: Category;
    }

    export interface CartItem {
    menuItem: MenuItem;
    quantity: number;
    }

    export interface CartState {
    items: CartItem[];
    tableNumber: string;
    }

    export interface OrderPayload {
    tableNumber: string;
    items: {
        menuItemId: string;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
    }

    export interface OrderApiResponse {
    orderId: string;
    status: "pending" | "confirmed" | "preparing" | "ready";
    message: string;
    }

export type CategoryFilter = "All" | (string & {});