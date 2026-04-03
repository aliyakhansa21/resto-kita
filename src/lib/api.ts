import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://resto-kita-production.up.railway.app/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10_000,
});

// Request interceptor — attach Bearer token ke setiap request
api.interceptors.request.use((config) => {
    let token = process.env.NEXT_PUBLIC_API_TOKEN ?? "abc";

    if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get("token");
        
        const tokenFromStorage = localStorage.getItem("tableToken");

        if (tokenFromUrl) {
            token = tokenFromUrl;
            localStorage.setItem("tableToken", tokenFromUrl); 
        } else if (tokenFromStorage) {
            token = tokenFromStorage;
        }
    }

    // Pasang token ke header
    config.headers.Authorization = `Bearer ${token}`;
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