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
                    "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
                    // Variants
                    variant === "primary" && "bg-leo-primary text-white hover:bg-leo-primary/90 shadow-sm",
                    variant === "secondary" && "bg-leo-gray-100 text-leo-gray-900 hover:bg-leo-gray-200",
                    variant === "outline" && "border border-leo-gray-200 bg-transparent hover:bg-leo-gray-50 text-leo-gray-900",
                    variant === "ghost" && "hover:bg-leo-gray-100 text-leo-gray-600 hover:text-leo-gray-900",
                    variant === "link" && "text-leo-primary underline-offset-4 hover:underline",
                    variant === "danger" && "bg-red-500 text-white hover:bg-red-600",
                    // Sizes
                    size === "default" && "h-12 px-6 py-3", // Taller for mobile touch targets
                    size === "sm" && "h-9 px-3 rounded-lg",
                    size === "lg" && "h-14 px-8 text-base rounded-2xl",
                    size === "icon" && "h-10 w-10",
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
