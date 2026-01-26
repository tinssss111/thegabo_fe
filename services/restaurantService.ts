import { apiClient } from "@/lib/api/client";
import { Restaurant } from "@/types/restaurant";

export const restaurantService = {
    async getRestaurantById(id: string): Promise<Restaurant> {
        const response = await apiClient.get<Restaurant>(`/restaurants/${id}`);
        return response.data;
    }
};
