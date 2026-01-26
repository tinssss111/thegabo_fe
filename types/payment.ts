export interface CreatePaymentRequest {
  orderId: string;
}

export interface PaymentLinkResponse {
  success: boolean;
  message: string;
  data?: {
    checkoutUrl: string;
    orderCode: number;
    qrCode: string;
    order: {
      _id: string;
      orderNumber: string;
      total: number;
      paymentStatus: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface PaymentInfo {
  orderCode: number;
  amount: number;
  amountPaid: number;
  status: "PENDING" | "PROCESSING" | "PAID" | "CANCELLED" | "EXPIRED";
  transactionDateTime?: string;
  description: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  message: string;
  data?: {
    order: {
      _id: string;
      orderNumber: string;
      total: number;
      paymentStatus: string;
      paymentTransactionId?: string;
      orderStatus: string;
    };
    paymentInfo: PaymentInfo;
  };
  error?: {
    code: string;
    message: string;
  };
}
