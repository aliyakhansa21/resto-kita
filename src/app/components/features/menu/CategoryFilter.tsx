"use client";
import type { Category } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CategoryFilterProps {
    categories: Category[];          
    activeId: string;                
    onChange: (id: string) => void;
}

export function CategoryFilter({ categories, activeId, onChange }: CategoryFilterProps) {
    const allOption = { id: "all", name: "All", description: "" };
    const options   = [allOption, ...categories];

    return (
        <div
        className="flex items-center gap-2 flex-wrap"
        role="group"
        aria-label="Filter kategori menu"
        >
            {options.map((cat) => (
                <button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                aria-pressed={activeId === cat.id}
                className={cn(
                    "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border",
                    activeId === cat.id
                    ? "bg-accent-10 text-white shadow-md"
                    : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                )}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
}