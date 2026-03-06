import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { InputHTMLAttributes, forwardRef } from "react";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ leftIcon, rightIcon, className, ...props }, ref) => {
        return (
        <div className="relative flex items-center w-full">
            {leftIcon && (
            <span className="absolute left-3.5 text-stone-400 pointer-events-none">
                {leftIcon}
            </span>
            )}
            <input
            ref={ref}
            className={cn(
                "w-full rounded-full border border-stone-200 bg-white py-2.5 text-sm text-stone-800",
                "placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700",
                "transition-all duration-200",
                leftIcon ? "pl-10 pr-4" : "px-4",
                rightIcon ? "pr-10" : "",
                className
            )}
            {...props}
            />
            {rightIcon && (
            <span className="absolute right-3.5 text-stone-400 pointer-events-none">
                {rightIcon}
            </span>
            )}
        </div>
        );
    }
);

Input.displayName = "Input";