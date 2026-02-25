"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Map, LayoutList, MessageSquare, User, Package, Box } from "lucide-react";

interface NavItem {
    icon: React.ElementType;
    label: string;
    href: string;
}

const courierItems: NavItem[] = [
    { icon: LayoutList, label: "Dzień", href: "/courier/day" },
    { icon: Map, label: "Trasa", href: "/courier/route" },
    { icon: Box, label: "Rejon", href: "/courier/region" },
    { icon: MessageSquare, label: "Wiadomości", href: "/courier/messages" },
    { icon: User, label: "Profil", href: "/courier/profile" },
];

const customerItems: NavItem[] = [
    { icon: Package, label: "Paczki", href: "/customer/packages" },
    { icon: Map, label: "Na żywo", href: "/customer/live" },
    { icon: User, label: "Profil", href: "/customer/profile" },
    { icon: User, label: "Konto", href: "/customer/account" },
];

export function BottomNav() {
    const pathname = usePathname();
    // Determine if we are in courier or customer mode based on URL
    const isCourier = pathname?.startsWith("/courier");
    const isCustomer = pathname?.startsWith("/customer");

    if (!isCourier && !isCustomer) return null;

    const items = isCourier ? courierItems : customerItems;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-leo-gray-200 bg-white pb-safe pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center h-16 px-2">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-leo-primary" : "text-leo-gray-400 hover:text-leo-gray-600"
                            )}
                        >
                            <item.icon
                                strokeWidth={isActive ? 2.5 : 2}
                                className={cn("h-6 w-6 transition-transform", isActive && "scale-110")}
                            />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
            {/* Safe area spacer for iPhone home indicator */}
            <div className="h-safe-bottom w-full bg-white" />
        </nav>
    );
}
