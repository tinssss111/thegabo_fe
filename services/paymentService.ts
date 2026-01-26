import { apiClient } from "@/lib/api/client";
import {
  CreatePaymentRequest,
  PaymentLinkResponse,
  PaymentStatusResponse,
} from "@/types/payment";

export const paymentService = {
  async createPaymentLink(
    data: CreatePaymentRequest,
  ): Promise<PaymentLinkResponse> {
    const response = await apiClient.post<PaymentLinkResponse>(
      "/payments/create",
      data,
    );
    return response.data;
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    const response = await apiClient.get<PaymentStatusResponse>(
      `/payments/${orderId}/status`,
    );
    return response.data;
  },

  async cancelPayment(orderId: string): Promise<PaymentStatusResponse> {
    const response = await apiClient.post<PaymentStatusResponse>(
      `/payments/${orderId}/cancel`,
    );
    return response.data;
  },
};
