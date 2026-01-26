import { apiClient } from "@/lib/api/client";
import { Addon, AddonResponse } from "@/types/addon";

export const addonService = {
  async getAddons(params?: {
    food?: string;
    isAvailable?: boolean;
    q?: string;
    sortBy?: string;
    order?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get<AddonResponse>("/addons", { params });
    return response.data;
  },

  async getAddonById(id: string) {
    const response = await apiClient.get<{ success: boolean; data: Addon }>(
      `/addons/${id}`,
    );
    return response.data;
  },
  async getAddonsByFood(foodId: string) {
    const response = await apiClient.get<{ success: boolean; data: Addon[] }>(
      `/addons/food/${foodId}`,
    );
    return response.data;
  },

  async getAvailableAddonsByFood(foodId: string) {
    const response = await this.getAddonsByFood(foodId);
    return response.data.filter(
      (addon) => addon.isAvailable && (addon.stock === null || addon.stock > 0),
    );
  },
};

export const addonHelpers = {
  calculateItemPrice(basePrice: number, selectedAddons: Addon[]) {
    const addonsPrice = selectedAddons.reduce(
      (sum, addon) => sum + addon.price,
      0,
    );
    return basePrice + addonsPrice;
  },

  getStockStatus(addon: Addon) {
    if (addon.stock === null) return "Còn hàng";
    if (addon.stock === 0) return "Hết hàng";
    return `Còn ${addon.stock}`;
  },

  isAddonSelectable(addon: Addon) {
    return addon.isAvailable && (addon.stock === null || addon.stock > 0);
  },
};
