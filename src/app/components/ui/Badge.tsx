import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
    food:    "bg-primary text-white",
    drinks:  "bg-accent-10 text-white",
    desserts:"bg-primary-10 text-white",
    others:  "bg-secondary-50 text-white",
    };

interface BadgeProps {
    category: string;   
    className?: string;
}

export function Badge({ category, className }: BadgeProps) {
    const color =
        CATEGORY_COLORS[category.toLowerCase()] ?? "bg-secondary-50 text-white";

    return (
        <span
        className={cn(
            "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
            color,
            className
        )}
        >
            {category}
        </span>
    );
}