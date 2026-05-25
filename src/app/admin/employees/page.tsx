"use client";

import { useState } from "react";
import { useEmployees, type Employee } from "@/hooks/useEmployees";
import NotificationModal from "../components/NotificationModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal"; 
import EmployeeList from "../components/EmployeeList";
import EmployeeForm from "../components/EmployeeForm";
import EmployeePasswordForm from "../components/EmployeePasswordForm";

type ViewState = "LIST" | "ADD" | "EDIT" | "RESET_PASSWORD";

export default function EmployeeManagementPage() {
    const { employees, isLoading, isError, isSubmitting, addEmployee, editEmployee, removeEmployee, changePassword, refresh } = useEmployees();

    const [view, setView] = useState<ViewState>("LIST");
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [modal, setModal] = useState<{ isOpen: boolean; type: "success" | "error"; title: string; message: string; redirectToListOnClose?: boolean; }>({
        isOpen: false, type: "success", title: "", message: "", redirectToListOnClose: false
    });

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null; name: string }>({
        isOpen: false, id: null, name: ""
    });

    const handleOpenAdd = () => { setSelectedEmployee(null); setView("ADD"); };
    const handleOpenEdit = (employee: Employee) => { setSelectedEmployee(employee); setView("EDIT"); };
    const handleOpenResetPassword = (employee: Employee) => { setSelectedEmployee(employee); setView("RESET_PASSWORD"); };

    const handleRequestDelete = (id: number, name: string) => {
        setDeleteModal({ isOpen: true, id, name });
    };

    const handleExecuteDelete = async () => {
        if (!deleteModal.id) return;
        
        const idToDelete = deleteModal.id;
        setDeleteModal({ isOpen: false, id: null, name: "" });

        const result = await removeEmployee(idToDelete);
        if (result.success) {
            setModal({ isOpen: true, type: "success", title: "Berhasil!", message: "Data karyawan berhasil dihapus.", redirectToListOnClose: true });
        } else {
            setModal({ isOpen: true, type: "error", title: "Gagal", message: result.message || "Terjadi kesalahan.", redirectToListOnClose: false });
        }
    };

    const handleFormSubmit = async (formData: any) => {
        const formattedPhone = `+62 ${formData.phone}`;
        let result;
        if (view === "ADD") {
            result = await addEmployee({ ...formData, full_name: formData.fullName, telephone: formattedPhone });
        } else if (view === "EDIT" && selectedEmployee) {
            result = await editEmployee(selectedEmployee.id, { full_name: formData.fullName, username: formData.username, email: formData.email, telephone: formattedPhone });
        }
        
        if (result?.success) {
            setModal({ isOpen: true, type: "success", title: "Berhasil!", message: "Data karyawan berhasil disimpan.", redirectToListOnClose: true });
        } else if (result) {
            setModal({ isOpen: true, type: "error", title: "Gagal", message: result.message || "Periksa kembali input data Anda.", redirectToListOnClose: false });
        }
    };

    const handlePasswordSubmit = async (resetData: any) => {
        if (resetData.newPassword !== resetData.confirmPassword) {
            setModal({ isOpen: true, type: "error", title: "Input Tidak Valid", message: "Konfirmasi password baru tidak cocok.", redirectToListOnClose: false });
            return;
        }

        const result = await changePassword(selectedEmployee!.id, {
            current_password: resetData.currentPassword,
            new_password: resetData.newPassword,
            new_password_confirmation: resetData.confirmPassword
        });

        if (result.success) {
            setModal({ isOpen: true, type: "success", title: "Berhasil!", message: `Sandi untuk ${selectedEmployee?.full_name} berhasil diperbarui.`, redirectToListOnClose: true });
        } else {
            setModal({ isOpen: true, type: "error", title: "Gagal!", message: result.message || "Gagal memperbarui password.", redirectToListOnClose: false });
        }
    };

    return (
        <div className="relative w-full">
            {modal.isOpen && (
                <NotificationModal 
                    type={modal.type} title={modal.title} message={modal.message}
                    onClose={() => {
                        setModal({ ...modal, isOpen: false });
                        if (modal.redirectToListOnClose) setView("LIST");
                    }}
                />
            )}

            {deleteModal.isOpen && (
                <DeleteConfirmModal 
                    itemName={deleteModal.name}
                    onConfirm={handleExecuteDelete}
                    onCancel={() => setDeleteModal({ isOpen: false, id: null, name: "" })}
                />
            )}

            {view === "LIST" && (
                <EmployeeList 
                    employees={employees} 
                    isLoading={isLoading} 
                    isError={isError} 
                    onAdd={handleOpenAdd} 
                    onEdit={handleOpenEdit} 
                    onResetPassword={handleOpenResetPassword} 
                    onDelete={handleRequestDelete} 
                    onRefresh={refresh} 
                />
            )}
            
            {(view === "ADD" || view === "EDIT") && (
                <EmployeeForm 
                    view={view} 
                    selectedEmployee={selectedEmployee} 
                    isSubmitting={isSubmitting} 
                    onSubmit={handleFormSubmit} 
                    onCancel={() => setView("LIST")} 
                    onDelete={handleRequestDelete} 
                />
            )}
            
            {view === "RESET_PASSWORD" && (
                <EmployeePasswordForm 
                    selectedEmployee={selectedEmployee} 
                    isSubmitting={isSubmitting} 
                    onSubmit={handlePasswordSubmit} 
                    onCancel={() => setView("LIST")} 
                />
            )}
        </div>
    );
}