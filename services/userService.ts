import { apiClient } from "@/lib/api/client";
import { User } from "@/types/user";


export interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: number;
    isActive?: boolean;
    sortBy?: string;
    order?: "asc" | "desc";
}

export const userService = {
    getUsers: async (params?: GetUsersParams) => {
        const response = await apiClient.get("/users", { params });
        return response.data;
    },

    getUserById: async (userId: string) => {
        const response = await apiClient.get(`/users/${userId}`);
        return response.data;
    },

    updateUserStatus: async (userId: string, isActive: boolean) => {
        const response = await apiClient.put(`/users/${userId}/status`, { isActive });
        return response.data;
    },

    updateUser: async (userId: string, data: Partial<User>) => {
        const response = await apiClient.put(`/users/${userId}`, data);
        return response.data;
    },
};
