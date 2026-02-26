import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "danger";
    size?: "default" | "sm" | "lg" | "icon";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={isLoading || props.disabled}
                className={cn(
                    // Base styles
                    "inline-flex items-center justify-center rounded-full text-[15px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
                    // Variants
                    variant === "primary" && "bg-leo-primary text-white hover:bg-leo-primary/90 shadow-[0_4px_14px_rgba(10,66,247,0.25)] hover:shadow-[0_6px_20px_rgba(10,66,247,0.3)]",
                    variant === "secondary" && "bg-leo-gray-100 text-leo-gray-900 hover:bg-leo-gray-200",
                    variant === "outline" && "border-2 border-leo-gray-200 bg-transparent hover:border-leo-primary hover:bg-leo-gray-50 text-leo-gray-900",
                    variant === "ghost" && "hover:bg-leo-gray-100 text-leo-gray-600 hover:text-leo-gray-900",
                    variant === "link" && "text-leo-primary underline-offset-4 hover:underline",
                    variant === "danger" && "bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_14px_rgba(239,68,68,0.25)]",
                    // Sizes
                    size === "default" && "h-14 px-6 py-4", // Taller for mobile touch targets (56px)
                    size === "sm" && "h-10 px-4",
                    size === "lg" && "h-16 px-10 text-lg",
                    size === "icon" && "h-12 w-12",
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
