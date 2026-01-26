export interface OrderItem {
  _id: string;
  food: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
  selectedOptions?: {
    addon: string;
    addonName: string;
    price: number;
  }[];
  note?: string;
}

export interface Order {
  totalAmount: number;
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    email: string;
    name: string;
    phone: string;
  };
  restaurant: {
    _id: string;
    name: string;
    address: string;
    phone: string;
    image?: string;
  };
  shipper?: {
    _id: string;
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  orderItems: OrderItem[];
  deliveryAddress: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "cancelled";
  paymentTransactionId?: string;
  orderStatus:
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipping"
  | "delivered"
  | "cancelled";
  note?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  deliveryAddress: string;
  note?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data?: Order;
  error?: {
    code: string;
    message: string;
  };
}

export interface OrderListResponse {
  success: boolean;
  message: string;
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface OrderDetailResponse {
  success: boolean;
  message: string;
  data?: Order;
  error?: {
    code: string;
    message: string;
  };
}

export interface OrderStatusUpdateRequest {
  orderStatus:
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipping"
  | "delivered"
  | "cancelled";
}

export interface PaymentStatusUpdateRequest {
  paymentStatus: "pending" | "paid" | "failed" | "cancelled";
  paymentTransactionId?: string;
}
