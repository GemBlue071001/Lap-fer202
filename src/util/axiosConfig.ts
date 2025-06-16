import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create custom axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://684c4899ed2578be881e5b44.mockapi.io/api', // default base URL
    timeout: 10000, // 10 seconds
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config:any) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error:any) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response:any) => response,
    (error:any) => {
        if (error.response) {
            // Handle specific HTTP errors
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized
                    localStorage.removeItem('token');
                    // Redirect to login or show message
                    break;
                case 403:
                    // Handle forbidden
                    break;
                case 404:
                    // Handle not found
                    break;
                default:
                    // Handle other errors
                    break;
            }
        }
        return Promise.reject(error);
    }
);

// Custom API service
class ApiService {
    private instance: AxiosInstance;

    constructor(instance: AxiosInstance) {
        this.instance = instance;
    }

    // GET request
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.get(url, config);
        return response.data;
    }

    // POST request
    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.post(url, data, config);
        return response.data;
    }

    // PUT request
    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.put(url, data, config);
        return response.data;
    }

    // PATCH request
    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.patch(url, data, config);
        return response.data;
    }

    // DELETE request
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.delete(url, config);
        return response.data;
    }

    // Set custom headers
    setHeader(name: string, value: string): void {
        this.instance.defaults.headers.common[name] = value;
    }

    // Remove custom headers
    removeHeader(name: string): void {
        delete this.instance.defaults.headers.common[name];
    }

    // Set base URL
    setBaseURL(url: string): void {
        this.instance.defaults.baseURL = url;
    }

    // Set default timeout
    setTimeout(timeout: number): void {
        this.instance.defaults.timeout = timeout;
    }
}

// Create and export instance
const api = new ApiService(axiosInstance);
export default api;
