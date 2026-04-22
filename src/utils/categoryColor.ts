export function getCategoryColor(name: string): string {
    const n = name?.toLowerCase() || "";

    if (n.includes("appetizer")) {
        return "bg-emerald-100 text-emerald-700"; // Hijau
    }
    if (n.includes("main course") || n.includes("makanan")) {
        return "bg-blue-100 text-blue-700"; // Biru
    }
    if (n.includes("dessert")) {
        return "bg-amber-100 text-amber-700"; // Kuning/Amber
    }
    if (n.includes("beverage") || n.includes("drink")) {
        return "bg-purple-100 text-purple-700"; // Ungu
    }
    if (n.includes("coffee") || n.includes("tea")) {
        return "bg-orange-100 text-orange-700"; // Oranye kecoklatan
    }
    if (n.includes("juice") || n.includes("smoothie")) {
        return "bg-rose-100 text-rose-700"; // Pink/Rose
    }
    if (n.includes("special")) {
        return "bg-red-100 text-red-700"; // Merah
    }

    // Fallback default
    return "bg-red text-stone-600";
}