/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Cart, AddToCartRequest, UpdateCartItemRequest } from "@/types/cart";
import { cartService } from "@/services/cartService";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: Cart | null;
  cartItemsCount: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (data: AddToCartRequest) => Promise<boolean>;
  updateCartItem: (
    itemId: string,
    data: UpdateCartItemRequest,
  ) => Promise<void>;
  deleteCartItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const cartItemsCount = cart ? cartService.calculateTotalItems(cart.items) : 0;

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartService.getCart();
      if (response.success && response.data) {
        console.log("Fetched cart from API:", response.data);
        setCart(response.data);
      }
    } catch (error: any) {
      // If cart doesn't exist yet (404) or unauthorized (401), that's okay
      if (error.response?.status === 404 || error.response?.status === 401) {
        setCart(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (data: AddToCartRequest): Promise<boolean> => {
    try {
      const response = await cartService.addToCart(data);
      if (response.success && response.data) {
        // Fetch cart again to get full data with populated fields
        await fetchCart();
        return true;
      }
      return false;
    } catch (error: any) {
      // Check for different restaurant error
      if (error.response?.data?.message?.includes("different restaurant")) {
        throw new Error("DIFFERENT_RESTAURANT");
      }
      throw error;
    }
  };

  const updateCartItem = async (
    itemId: string,
    data: UpdateCartItemRequest,
  ) => {
    try {
      const response = await cartService.updateCartItem(itemId, data);
      if (response.success) {
        // Fetch cart again to get full populated data
        await fetchCart();
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  };

  const deleteCartItem = async (itemId: string) => {
    try {
      const response = await cartService.deleteCartItem(itemId);
      if (response.success) {
        // Fetch cart again to get full populated data
        await fetchCart();
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartService.clearCart();
      if (response.success) {
        setCart(null);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;
        if (token) {
          fetchCart();
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItemsCount,
        isLoading,
        fetchCart,
        addToCart,
        updateCartItem,
        deleteCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
