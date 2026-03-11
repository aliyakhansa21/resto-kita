"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
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
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const allOption = { id: "all", name: "All Categories", description: "" };
    const options = [allOption, ...categories];

    const activeLabel = options.find((o) => o.id === activeId)?.name ?? "All Categories";

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 min-w-[160px] justify-between",
                    isOpen
                        ? "bg-primary-10 text-white shadow-md"
                        : "bg-primary text-white hover:bg-primary-30"
                )}
            >
                <span>{activeLabel}</span>
                <ChevronDown
                    size={16}
                    className={cn(
                        "transition-transform duration-200 flex-shrink-0",
                        isOpen ? "rotate-180" : ""
                    )}
                />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <ul
                    role="listbox"
                    aria-label="Pilih kategori menu"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden z-30 py-1"
                >
                    {options.map((cat) => (
                        <li key={cat.id} role="option" aria-selected={activeId === cat.id}>
                            <button
                                onClick={() => {
                                    onChange(cat.id);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 flex items-center gap-2",
                                    activeId === cat.id
                                        ? "bg-amber-50 text-[#8B6E4E] font-semibold"
                                        : "text-stone-700 hover:bg-stone-50"
                                )}
                            >
                                {activeId === cat.id && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B6E4E] flex-shrink-0" />
                                )}
                                <span className={activeId === cat.id ? "" : "ml-3.5"}>{cat.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}