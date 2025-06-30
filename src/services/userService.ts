import { User } from "../model.ts/user";
import api from "../util/axiosConfig";

export const userService = {
    login: async (email:string, password: string) => {
        // Example API call to fetch orchids
        const response: User[] = await api.get(`/user?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);

        return response;
    },
    
    updateUser: async (userId: number, userData: User) => {
        // Update user data
        const response = await api.put(`/user/${userId}`, userData);
        return response;
    },
    
    getUserById: async (userId: number) => {
        // Get user by ID
        const response = await api.get(`/user/${userId}`);
        return response;
    }
}