import { Orchid } from "../model.ts/orchids";
import api from "../util/axiosConfig";

export const OrchidService = {
    // Define your service methods here
    getOrchids: async (searchString?: string) => {
        // Build query parameters
        let url = '/orchid';
        
        if (searchString && searchString.trim()) {
            // Search only in the name field
            url += `?name_like=${encodeURIComponent(searchString.trim())}`;
        }
        
        // API call to fetch orchids with name search only
        const response: Orchid[] = await api.get(url);
        return response;
    },

    getOrchidById: async (id: string) => {
        // Example API call to fetch a single orchid by ID
        const response: Orchid = await api.get(`/orchid/${id}`);
        return response;
    },

    createOrchids: async (newOrchid: Orchid) => {
        // Example API call to fetch orchids
        const response = await api.post('/orchid', newOrchid);

        return response;
    },

    updateOrchids: async (id: string, orchid: any) => {
        // Example API call to fetch orchids
        const response = await api.put(`/orchid/${id}`, orchid);

        return response;
    },

    deleteOrchids: async (id: string) => {
        // Example API call to fetch orchids
        const response = await api.delete(`/orchid/${id}`);

        return response;
    },


};