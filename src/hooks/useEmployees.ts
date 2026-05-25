import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export interface Employee {
    id: number;
    full_name: string;
    telephone: string;
    username: string;
    email: string;
}

export function useEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // GET: Fetch all employees
    const fetchEmployees = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await api.get("/admin/employees");
            setEmployees(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load data on mount
    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // POST: Create new employee
    const addEmployee = async (payload: any) => {
        setIsSubmitting(true);
        try {
            await api.post("/admin/employees", payload);
            await fetchEmployees();
            return { success: true };
        } catch (error: any) {
            console.error("Failed to add employee:", error);
            return { 
                success: false, 
                message: error.response?.data?.message || "Gagal menambah data karyawan." 
            };
        } finally {
            setIsSubmitting(false);
        }
    };

    // PUT: Update existing employee
    const editEmployee = async (id: number, payload: any) => {
        setIsSubmitting(true);
        try {
            await api.put(`/admin/employees/${id}`, payload);
            await fetchEmployees();
            return { success: true };
        } catch (error: any) {
            console.error("Failed to update employee:", error);
            return { 
                success: false, 
                message: error.response?.data?.message || "Gagal memperbarui data karyawan." 
            };
        } finally {
            setIsSubmitting(false);
        }
    };

    // DELETE: Remove employee
    const removeEmployee = async (id: number) => {
        setIsLoading(true);
        try {
            await api.delete(`/admin/employees/${id}`);
            await fetchEmployees();
            return { success: true };
        } catch (error: any) {
            console.error("Failed to delete employee:", error);
            return { 
                success: false, 
                message: error.response?.data?.message || "Gagal menghapus data karyawan." 
            };
        } finally {
            setIsLoading(false);
        }
    };

    // POST: Change Password
    const changePassword = async (id: number, payload: any) => {
        setIsSubmitting(true);
        try {
            const response = await api.post(`/admin/employees/${id}/change-password`, payload);
            return { 
                success: true, 
                message: response.data.message || "Password berhasil diperbarui." 
            };
        } catch (error: any) {
            console.error("Failed to change password:", error);
            return { 
                success: false, 
                message: error.response?.data?.message || "Gagal memperbarui password." 
            };
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        employees,
        isLoading,
        isError,
        isSubmitting,
        addEmployee,
        editEmployee,
        removeEmployee,
        changePassword, 
        refresh: fetchEmployees
    };
}