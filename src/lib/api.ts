import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10_000,
});

// Request interceptor
api.interceptors.request.use((config) => {
    return config;
});

// Response interceptor: normalize error messages 
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
        error?.response?.data?.message ??
        error?.message ??
        "Terjadi kesalahan, coba lagi.";
        return Promise.reject(new Error(message));
    }
);

export default api;