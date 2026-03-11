/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Restaurant } from "@/types/restaurant";
import { restaurantService } from "@/services/restaurantService";
import { useCart } from "./CartContext";

interface RestaurantContextType {
  restaurant: Restaurant | null;
  isLoading: boolean;
  fetchRestaurant: (restaurantId: string) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined,
);

export function RestaurantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { cart } = useCart();

  const fetchRestaurant = async (restaurantId: string) => {
    // Validate ID
    if (!restaurantId || restaurantId.trim() === "") {
      console.warn("Invalid restaurant ID provided");
      setRestaurant(null);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Fetching restaurant with ID:", restaurantId);
      const data = await restaurantService.getRestaurantById(restaurantId);
      console.log("Restaurant data fetched successfully:", data);
      setRestaurant(data);
    } catch (error: any) {
      console.error("Error fetching restaurant:", {
        error: error.message,
        status: error.response?.status,
        restaurantId,
      });
      setRestaurant(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto fetch restaurant when component mounts or cart changes
  useEffect(() => {
    // If cart has restaurant, fetch it
    if (cart?.restaurant?._id) {
      fetchRestaurant(cart.restaurant._id);
    } else {
      // Otherwise fetch default restaurant from env
      const defaultRestaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;
      if (defaultRestaurantId) {
        fetchRestaurant(defaultRestaurantId);
      }
    }
  }, [cart?.restaurant?._id]);

  return (
    <RestaurantContext.Provider
      value={{ restaurant, isLoading, fetchRestaurant }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within RestaurantProvider");
  }
  return context;
}
