import { Orchid } from "../model.ts/orchids";
import api from "../util/axiosConfig";

export const OrchidService = {
    // Define your service methods here
    getOrchids: async () => {
        // Example API call to fetch orchids
        const response: Orchid[] = await api.get('/orchid');

        return response;
    },

    getOrchidById: async (id: string) => {
        // Example API call to fetch a single orchid by ID
        const response: Orchid = await api.get(`/orchids/${id}`);
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