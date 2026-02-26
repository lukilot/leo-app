"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MapPin, Navigation, Calendar, BarChart3, User, Package, Undo2, CalendarCheck } from "lucide-react";

interface NavItem {
    icon: React.ElementType;
    label: string;
    href: string;
}

const courierItems: NavItem[] = [
    { icon: Calendar, label: "Dzień", href: "/courier/day" },
    { icon: Navigation, label: "Trasa", href: "/courier/route" },
    { icon: MapPin, label: "Rejon", href: "/courier/region" },
    { icon: BarChart3, label: "Wyniki", href: "/courier/messages" }, // Remapping Wyniki to messages for now, or just an empty page
    { icon: User, label: "Profil", href: "/courier/profile" },
];

const customerItems: NavItem[] = [
    { icon: Package, label: "Paczki", href: "/customer/packages" },
    { icon: MapPin, label: "Mapa", href: "/customer/live" },
    { icon: CalendarCheck, label: "Plan B", href: "/customer/account" }, // Temporarily mapping Plan B to account
    { icon: Undo2, label: "Zwroty", href: "/customer/profile" }, // Temporarily mapping Zwroty
    { icon: User, label: "Profil", href: "/customer/profile" },
];

export function BottomNav() {
    const pathname = usePathname();
    // Determine if we are in courier or customer mode based on URL
    const isCourier = pathname?.startsWith("/courier");
    const isCustomer = pathname?.startsWith("/customer");

    if (!isCourier && !isCustomer) return null;

    const items = isCourier ? courierItems : customerItems;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-leo-gray-100 bg-leo-bg/90 backdrop-blur-md pb-safe pt-1">
            <div className="flex justify-around items-center h-[60px] px-2">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                isActive ? "text-leo-primary" : "text-leo-gray-400 hover:text-leo-gray-900"
                            )}
                        >
                            <item.icon
                                strokeWidth={isActive ? 2.5 : 2}
                                className={cn("h-[22px] w-[22px] transition-transform", isActive && "scale-[1.15]")}
                            />
                            <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
            {/* Safe area spacer for iPhone home indicator */}
            <div className="h-safe-bottom w-full bg-white/95" />
        </nav>
    );
}
