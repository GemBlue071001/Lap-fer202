import { User } from "../model.ts/user";
import api from "../util/axiosConfig";

export const userService = {
    login: async (email:string, password: string) => {
        // Example API call to fetch orchids
        const response: User[] = await api.get(`/user?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);

        return response;
    },
    
    register: async (userData: Omit<User, 'id'>) => {
        // Check if email already exists
        const existingUsers: User[] = await api.get(`/user?email=${encodeURIComponent(userData.email)}`);
        
        if (existingUsers.length > 0) {
            throw new Error('Email already exists');
        }
        
        // Create new user
        const response = await api.post('/user', {
            ...userData,
            role: 'user' // Default role for new users
        });
        
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