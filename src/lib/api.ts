import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10_000,
});

// Request interceptor — attach Bearer token ke setiap request
api.interceptors.request.use((config) => {
    let token = process.env.NEXT_PUBLIC_API_TOKEN ?? "abc"; 

    if (typeof window !== "undefined") {
        const adminToken = localStorage.getItem("admin_token");
        
        const tableToken = sessionStorage.getItem("tableToken");

        if (adminToken) {
            token = adminToken;
        } else if (tableToken) {
            token = tableToken;
        }
    }

    config.headers.Authorization = `Bearer ${token}`; 
    return config;
});

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