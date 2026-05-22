"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ClipboardList,
    UtensilsCrossed,
    Users,
    Tag,
    LogOut,
    ChevronLeft,
    ChevronRight,
    QrCode,
    Banknote
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api"; 

const menuUtama = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/pesanan", icon: ClipboardList, label: "Daftar Pesanan" },
    { href: "/admin/payment-confirmation", icon: Banknote, label: "Konfirmasi Pembayaran" },
    { href: "/admin/menu", icon: UtensilsCrossed, label: "Daftar Menu" },
    { href: "/admin/tables", icon: QrCode, label: "QR Table" }, 
];

const manajemen = [
    { href: "/admin/employees", icon: Users, label: "Manajemen Karyawan" },
    { href: "/admin/categories", icon: Tag, label: "Manajemen Kategori" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // State untuk mengontrol Modal Logout
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const NavItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
        const active = href === "/admin" 
            ? pathname === href 
            : pathname === href || pathname.startsWith(href + "/");

        return (
            <Link href={href}>
                <div
                    title={collapsed ? label : undefined}
                    className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 mx-2 rounded-lg cursor-pointer transition-all duration-200 overflow-hidden whitespace-nowrap",
                        collapsed ? "justify-center" : "justify-start",
                        active
                            ? "bg-primary/20 text-primary"
                            : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
                    )}
                >
                    <Icon size={20} className="flex-shrink-0" />
                    {!collapsed && (
                        <span className={cn("text-sm transition-all", active ? "font-semibold" : "font-medium")}>
                            {label}
                        </span>
                    )}
                </div>
            </Link>
        );
    };

    // Fungsi untuk memproses Logout
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await api.post("/admin/logout");
        } catch (error) {
            console.error("Logout gagal diproses di server:", error);
        } finally {
            localStorage.removeItem("admin_token");
            setIsLoggingOut(false);
            setShowLogoutModal(false);
            router.push("/login");
        }
    };

    return (
        <div className="flex h-screen bg-stone-50 overflow-hidden font-sans">
            
            {/* Modal Konfirmasi Logout */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden bg-stone-50 border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 pt-8 pb-5 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-50 border-2 border-red-100 text-red-600">
                                <LogOut size={30} className="ml-1" />
                            </div>
                            <h2 className="text-xl font-bold text-stone-900">Keluar Sistem?</h2>
                            <p className="mt-2 text-sm text-stone-500">
                                Apakah Anda yakin ingin keluar dari akun administrator?
                            </p>
                        </div>
                        <div className="mx-6 h-px bg-stone-200" />
                        <div className="px-6 py-5 flex items-center gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                disabled={isLoggingOut}
                                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center gap-2"
                            >
                                {isLoggingOut ? (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    "Ya, Keluar"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-white border-r border-stone-200 flex flex-col flex-shrink-0 relative transition-[width] duration-300 ease-in-out z-10",
                    collapsed ? "w-[72px]" : "w-64"
                )}
            >
                {/* Header / Logo */}
                <div className="px-3.5 py-4 flex items-center gap-3 border-b border-stone-100 min-h-[68px] overflow-hidden">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <UtensilsCrossed size={20} className="text-white" />
                    </div>
                    {!collapsed && (
                        <span className="font-bold text-base text-stone-900 whitespace-nowrap transition-opacity duration-200">
                            Restoran Kita
                        </span>
                    )}
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
                    className="absolute top-5 -right-3.5 w-7 h-7 rounded-full bg-primary text-white border-4 border-stone-50 flex items-center justify-center z-20 shadow-sm hover:bg-primary-30 transition-colors"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {!collapsed && (
                        <p className="text-[11px] font-bold text-stone-400 px-5 pb-1.5 tracking-wider">
                            MENU UTAMA
                        </p>
                    )}
                    {menuUtama.map((item) => (
                        <NavItem key={item.href} {...item} />
                    ))}

                    <div className="mt-6">
                        {!collapsed && (
                            <p className="text-[11px] font-bold text-stone-400 px-5 pb-1.5 tracking-wider">
                                MANAJEMEN
                            </p>
                        )}
                        {manajemen.map((item) => (
                            <NavItem key={item.href} {...item} />
                        ))}
                    </div>
                </nav>

                {/* User Info */}
                <div className="border-t border-stone-100 p-3.5 flex items-center gap-3 overflow-hidden bg-stone-50/50">
                    <div className="w-9 h-9 rounded-full bg-primary-10 flex items-center justify-center flex-shrink-0">
                        <Users size={18} className="text-primary-50" />
                    </div>
                    {!collapsed && (
                        <>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold text-stone-900 truncate">Administrator</p>
                                <p className="text-[11px] text-stone-500 truncate">admin@gmail.com</p>
                            </div>
                            <button 
                                onClick={() => setShowLogoutModal(true)}
                                className="text-stone-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors flex-shrink-0"
                                title="Keluar"
                            >
                                <LogOut size={18} />
                            </button>
                        </>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                {children}
            </main>
        </div>
    );
}