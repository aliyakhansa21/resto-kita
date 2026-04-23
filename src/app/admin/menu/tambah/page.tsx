"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CloudUpload, Info, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { cn } from "@/lib/utils"; 
import type { Category } from "@/types";
import { useCreateMenu } from "@/hooks/useCreateMenu";

interface MenuFormState {
    name: string;
    description: string;
    price: string;
    category_id: string;
    is_active: boolean;
}

export default function TambahMenuPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const [previewImg, setPreviewImg] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null); 
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [form, setForm] = useState<MenuFormState>({
        name: "",
        description: "",
        price: "",
        category_id: "",
        is_active: true,
    });

    const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
        queryKey: ["admin-categories"],
        queryFn: async () => {
            const { data } = await api.get("/admin/categories");
            return data.data ?? [];
        },
    });

    const createMutation = useCreateMenu();

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = "Nama menu wajib diisi";
        if (!form.description.trim()) errs.description = "Deskripsi wajib diisi";
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
            errs.price = "Harga harus berupa angka positif";
        }
        if (!form.category_id) errs.category_id = "Kategori wajib dipilih";
        return errs;
    };

    const handleSubmit = () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        
        setErrors({});

        createMutation.mutate(
            {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                category_id: Number(form.category_id),
                is_active: form.is_active,
                imageFile: imageFile, 
            },
            {
                onSuccess: () => {
                    router.push("/admin/menu");
                },
                onError: (error: any) => {
                    alert(error.message || "Gagal menyimpan menu. Coba lagi.");
                }
            }
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImg(URL.createObjectURL(file));
            setImageFile(file); 
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-stone-900">Tambah Menu</h1>
                <p className="text-sm text-stone-500 mt-1">Tambahkan item menu baru ke dalam katalog</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    
                    {/* Left Column - Inputs */}
                    <div className="space-y-6">
                        <Field label="Nama Menu" error={errors.name}>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Cth: Nasi Goreng Spesial"
                                className={cn(
                                    "w-full px-4 py-2.5 rounded-lg border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-primary-10 transition-colors",
                                    errors.name ? "border-red-500" : "border-stone-300"
                                )}
                            />
                        </Field>

                        <Field label="Deskripsi" error={errors.description}>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Deskripsikan bahan dan rasa menu ini..."
                                rows={4}
                                className={cn(
                                    "w-full px-4 py-2.5 rounded-lg border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-primary-10 transition-colors resize-y",
                                    errors.description ? "border-red-500" : "border-stone-300"
                                )}
                            />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Harga (IDR)" error={errors.price}>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-stone-500">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        placeholder="0"
                                        className={cn(
                                            "w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-primary-10 transition-colors",
                                            errors.price ? "border-red-500" : "border-stone-300"
                                        )}
                                    />
                                </div>
                            </Field>

                            <Field label="Kategori" error={errors.category_id}>
                                <select
                                    value={form.category_id}
                                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-lg border text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-10 transition-colors cursor-pointer",
                                        errors.category_id ? "border-red-500" : "border-stone-300"
                                    )}
                                    disabled={isLoadingCategories}
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        {/* Status Toggle */}
                        <div className="flex items-center justify-between p-4 border border-stone-200 rounded-lg bg-stone-50">
                            <span className="text-sm font-semibold text-stone-900">Status Menu</span>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, is_active: !form.is_active })}
                                    className={cn(
                                        "relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none",
                                        form.is_active ? "bg-green-500" : "bg-stone-300"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm",
                                            form.is_active ? "translate-x-6" : "translate-x-0"
                                        )}
                                    />
                                </button>
                                <span className={cn("text-sm font-medium", form.is_active ? "text-green-600" : "text-stone-500")}>
                                    {form.is_active ? "Aktif" : "Nonaktif"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-stone-900 mb-3">
                            Gambar Menu
                        </label>

                        {previewImg && (
                            <div className="relative mb-4 group">
                                <img
                                    src={previewImg}
                                    alt="Preview"
                                    className="w-full h-56 object-cover rounded-xl border border-stone-200 shadow-sm"
                                />
                                <button 
                                    onClick={() => {
                                        setPreviewImg(null);
                                        setImageFile(null); 
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                    title="Hapus Gambar"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <label
                            htmlFor="img-upload"
                            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-stone-300 rounded-xl p-10 cursor-pointer bg-stone-50 hover:bg-stone-100 hover:border-primary-30 transition-all group"
                        >
                            <CloudUpload size={32} className="text-primary-30 group-hover:text-primary transition-colors mb-2" />
                            <span className="text-sm font-medium text-stone-900">
                                Klik atau seret gambar ke sini
                            </span>
                            <span className="text-xs text-stone-500">PNG, JPG, WEBP (Maks. 2MB)</span>
                            <input
                                id="img-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>

                        <div className="flex items-start gap-3 mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                            <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Pastikan gambar memiliki rasio 1:1 atau 4:3 agar tidak terpotong (crop) pada tampilan aplikasi pelanggan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-10 pt-6 border-t border-stone-100 flex justify-end gap-3">
                    <Link href="/admin/menu">
                        <button className="px-6 py-2.5 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors">
                            Batal
                        </button>
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={createMutation.isPending}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                    >
                        <Save size={18} />
                        {createMutation.isPending ? "Menyimpan..." : "Simpan Menu"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Sub-komponen Field 
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-stone-900">
                {label}
            </label>
            {children}
            {error && <span className="text-xs font-medium text-red-500">{error}</span>}
        </div>
    );
}