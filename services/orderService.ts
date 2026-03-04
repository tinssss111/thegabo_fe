import { apiClient } from "@/lib/api/client";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderListResponse,
  OrderDetailResponse,
  Order,
} from "@/types/order";

export const orderService = {
  async calculateFee(data: {
    restaurantId: string;
    customerCoordinates: { lat: number; lng: number };
  }) {
    const response = await apiClient.post("/orders/calculate-fee", data);
    return response.data;
  },

  async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await apiClient.post<CreateOrderResponse>("/orders", data);
    return response.data;
  },

  async getMyOrders(params?: {
    orderStatus?: string;
    paymentStatus?: string;
    sortBy?: string;
    order?: "asc" | "desc";
    page?: number;
    limit?: number;
  }): Promise<OrderListResponse> {
    const response = await apiClient.get<OrderListResponse>("/orders/my", {
      params,
    });
    return response.data;
  },

  async getOrderById(orderId: string): Promise<OrderDetailResponse> {
    const response = await apiClient.get<OrderDetailResponse>(
      `/orders/${orderId}`,
    );
    return response.data;
  },

  async cancelOrder(orderId: string): Promise<CreateOrderResponse> {
    const response = await apiClient.post<CreateOrderResponse>(
      `/orders/${orderId}/cancel`,
      {},
    );
    return response.data;
  },

  formatOrderStatus(status: Order["orderStatus"]): string {
    const statusMap: Record<Order["orderStatus"], string> = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      preparing: "Đang chuẩn bị",
      shipping: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  },

  formatPaymentStatus(status: Order["paymentStatus"]): string {
    const statusMap: Record<Order["paymentStatus"], string> = {
      pending: "Chờ thanh toán",
      paid: "Đã thanh toán",
      failed: "Thất bại",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  },

  canCancelOrder(order: Order): boolean {
    return (
      (order.orderStatus === "pending" || order.orderStatus === "confirmed") &&
      order.paymentStatus !== "paid"
    );
  },

  // Admin endpoints
  async getAdminOrders(params?: {
    orderStatus?: string;
    paymentStatus?: string;
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
    page?: number;
    limit?: number;
  }): Promise<OrderListResponse> {
    const response = await apiClient.get<OrderListResponse>(
      "/orders/admin/all",
      {
        params,
      },
    );
    return response.data;
  },

  async updateOrderStatus(
    orderId: string,
    orderStatus: string,
  ): Promise<OrderDetailResponse> {
    const response = await apiClient.put<OrderDetailResponse>(
      `/orders/${orderId}/status`,
      { orderStatus },
    );
    return response.data;
  },

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: string,
    paymentTransactionId?: string,
  ): Promise<OrderDetailResponse> {
    const response = await apiClient.put<OrderDetailResponse>(
      `/orders/${orderId}/payment`,
      { paymentStatus, paymentTransactionId },
    );
    return response.data;
  },
};
