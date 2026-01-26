/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Addon {
  _id: string;
  addonName: string;
  price: number;
}

export interface SelectedOption {
  addonPrice: any;
  _id: string;
  addonName: string;
  price: number;
}

export interface CartItemFood {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  _id: string;
  food: CartItemFood;
  quantity: number;
  selectedOptions: SelectedOption[];
  note?: string;
}

export interface Restaurant {
  _id: string;
  name: string;
}

export interface Cart {
  _id: string;
  user: string;
  restaurant: Restaurant;
  items: CartItem[];
  subtotal: number;
}

export interface CartResponse {
  success: boolean;
  data?: Cart;
  message?: string;
}

export interface AddToCartRequest {
  foodId: string;
  quantity: number;
  addons?: string[];
  note?: string;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  addons?: string[];
  note?: string;
}
