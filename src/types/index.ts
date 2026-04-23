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
    is_active: number | boolean;    
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
    is_active: number | boolean;  
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

export interface OrderItem {
    id: number;
    amount: number;
    order: object;
    item: MenuItem;
}

export type PaymentMethod = "cash" | "non_cash";

export interface CheckoutCategory {
  id: number;
  name: string;
  description: string;
}

export interface CheckoutMenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  img: string;
  is_active: number;
  category: CheckoutCategory;
}

export interface CheckoutOrderItem {
  id: number;
  amount: number;
  order: object;
  item: CheckoutMenuItem;
}

export interface CheckoutOrder {
  id: number;
  confirmed: boolean;
  order_items: CheckoutOrderItem[];
}

export interface CheckoutSession {
  id: number;
  grand_total: string;
  status: string;
  orders: CheckoutOrder[];
}

// POST /api/orders 

export interface PlaceOrderItem {
  item_id: number;
  amount: number;
}

export interface PlaceOrderPayload {
  orders: PlaceOrderItem[];
}

// Response POST /api/orders → { data: PlaceOrderResponse }
export interface PlaceOrderResponse {
  id: number;
  confirmed: boolean;
  order_items: CheckoutOrderItem[];
}

// Checkout form 

export interface CheckoutForm {
  name: string;
  whatsapp: string;
  table: string;
  notes: string;
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutForm, string>>;

// POST /table-sessions/{token}/checkout 

export interface CheckoutSubmitPayload {
  customer_name: string;
  whatsapp_number: string;
  table_number: string;
  notes: string;
  payment_method: PaymentMethod;
}

// TABLE SESSIONS

// Raw API response from POST /api/table-sessions/generate
export interface ApiTableSessionResponse {
  data: {
    token: string;
    table_id: number;
    seated_at: string;
  };
}

// Normalized table session used in the frontend
export interface TableSession {
  token: string;
  tableId: number;
  seatedAt: string;
  qrUrl: string;
}