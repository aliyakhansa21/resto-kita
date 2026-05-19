import { useState, useEffect } from "react";
import api from "@/lib/api"; 

export const useAdminDashboard = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchDashboard = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/admin/dashboard");
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
        };

        fetchDashboard();
    }, []);

    return { data, isLoading, isError };
};