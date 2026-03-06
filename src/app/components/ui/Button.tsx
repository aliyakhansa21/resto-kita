import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ButtonHTMLAttributes, forwardRef } from "react";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost" | "cart";
    size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
        const base =
        "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
        primary: "bg-primary hover:bg-primary-10 text-white shadow-md hover:shadow-lg active:scale-95",
        outline: "border-2 border-stone-300 text-stone-700 hover:bg-stone-100 active:scale-95",
        ghost:   "text-secondary-50 hover:bg-secondary-10 active:scale-95",
        cart:    "bg-primary hover:bg-primary-10 text-white shadow-lg hover:shadow-xl active:scale-95",
        };

        const sizes = {
        sm:  "px-3 py-1.5 text-xs",
        md:  "px-5 py-2.5 text-sm",
        lg:  "px-7 py-3.5 text-base",
        };

        return (
        <button
            ref={ref}
            className={cn(base, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
        );
    }
);

Button.displayName = "Button";