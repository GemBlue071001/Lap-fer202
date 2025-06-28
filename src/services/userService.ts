import { User } from "../model.ts/user";
import api from "../util/axiosConfig";

export const userService = {
    login: async (email:string, password: string) => {
        // Example API call to fetch orchids
        const response: User[] = await api.get(`/user?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);

        return response;
    }
}