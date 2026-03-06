"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { debounce } from "@/lib/utils";

interface SearchBarProps {
    onSearch: (value: string) => void;
    debounceMs?: number;
}

export function SearchBar({ onSearch, debounceMs = 400 }: SearchBarProps) {
    const [value, setValue] = useState("");
    const debouncedSearch = useCallback(
        debounce((v: unknown) => onSearch(v as string), debounceMs),
        [onSearch, debounceMs]
    );

    useEffect(() => {
        debouncedSearch(value);
    }, [value, debouncedSearch]);

    return (
        <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search your favorite dish..."
        leftIcon={<Search size={16} />}
        aria-label="Cari menu"
        className="max-w-xs"
        />
    );
}