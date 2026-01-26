/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api/client";
import {
  CartResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
} from "@/types/cart";

export const cartService = {
  async getCart(): Promise<CartResponse> {
    const response = await apiClient.get<CartResponse>("/cart");
    return response.data;
  },

  async addToCart(data: AddToCartRequest): Promise<CartResponse> {
    const response = await apiClient.post<CartResponse>("/cart", data);
    return response.data;
  },

  async updateCartItem(
    itemId: string,
    data: UpdateCartItemRequest,
  ): Promise<CartResponse> {
    const response = await apiClient.put<CartResponse>(
      `/cart/items/${itemId}`,
      data,
    );
    return response.data;
  },

  async deleteCartItem(itemId: string): Promise<CartResponse> {
    const response = await apiClient.delete<CartResponse>(
      `/cart/items/${itemId}`,
    );
    return response.data;
  },

  async clearCart(): Promise<CartResponse> {
    const response = await apiClient.delete<CartResponse>("/cart");
    return response.data;
  },

  calculateItem(item: any): number {
    const addonsPrice = item.selectedOptions.reduce(
      (sum: number, addon: any) => sum + addon.price,
      0,
    );
    return addonsPrice;
  },

  calculateItemPrice(item: any): number {
    const foodPrice = item.food.price;
    return foodPrice;
  },

  calculateItemTotal(item: any): number {
    return (
      this.calculateItemPrice(item) * item.quantity + this.calculateItem(item)
    );
  },

  calculateTotalItems(items: any[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },
};
