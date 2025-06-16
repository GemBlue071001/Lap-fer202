import { Orchid } from "../model.ts/orchids";
import api from "./axiosConfig";

export const OrchidService = {
    // Define your service methods here
    getOrchids: async () => {
        // Example API call to fetch orchids
        const response: Orchid[]= await api.get('/orchid');

        return response;
    },

    createOrchids: async (newOrchid:Orchid) => {
        // Example API call to fetch orchids
        const response: Orchid[]= await api.post('/orchid');

        return response;
    },

    updateOrchids: async () => {
        // Example API call to fetch orchids
        const response: Orchid[]= await api.put('/orchid');

        return response;
    },

    deleteOrchids: async () => {
        // Example API call to fetch orchids
        const response: Orchid[]= await api.delete('/orchid');

        return response;
    },


};