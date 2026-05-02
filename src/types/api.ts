export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
}

export interface LoginResponse {
    message: string;
    user: User;
    token: string;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: string;
    img: string;
    is_active: number | boolean;
    category: Category;
}

export interface OrderItem {
    id: number;
    amount: number;
    order: any; 
    item: MenuItem;
}

export interface Order {
    id: number;
    order_id: string;
    confirmed: boolean;
    order_items: OrderItem[];
    payment_status: string;
    payment_method: string;
    ordered_at: string;
    table_number: string;
}