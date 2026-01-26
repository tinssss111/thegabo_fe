// LocalStorage key
const PENDING_ORDER_KEY = "gabo_pending_order";

export interface PendingOrder {
  orderId: string;
  orderNumber: string;
  total: number;
  timestamp: number;
}

export const pendingOrderStorage = {
  savePendingOrder(order: PendingOrder): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(order));
    } catch (error) {
      console.error("Failed to save pending order:", error);
    }
  },

  getPendingOrder(): PendingOrder | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(PENDING_ORDER_KEY);
      if (!data) return null;

      const order: PendingOrder = JSON.parse(data);

      const now = Date.now();
      const hoursDiff = (now - order.timestamp) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        this.clearPendingOrder();
        return null;
      }

      return order;
    } catch (error) {
      console.error("Failed to get pending order:", error);
      return null;
    }
  },

  clearPendingOrder(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(PENDING_ORDER_KEY);
    } catch (error) {
      console.error("Failed to clear pending order:", error);
    }
  },

  hasPendingOrder(): boolean {
    return this.getPendingOrder() !== null;
  },
};
