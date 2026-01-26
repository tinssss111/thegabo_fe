import { apiClient } from "@/lib/api/client";
import { FoodResponse } from "@/types/food";

export const foodService = {
  async getAllFoods(): Promise<FoodResponse> {
    const response = await apiClient.get<FoodResponse>("/foods");
    return response.data;
  },

  async getFoodById(id: string) {
    const response = await apiClient.get(`/foods/${id}`);
    return response.data;
  },

  async getFoodsByCategory(categoryId: string) {
    const response = await apiClient.get(`/foods?category=${categoryId}`);
    return response.data;
  },
};
