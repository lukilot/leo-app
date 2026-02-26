"use client";

import { useEffect, useState } from "react";
import { Clock, Zap, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DeliveryWindowProps {
    windowStart: Date | string | null;
    windowEnd: Date | string | null;
    delayMinutes?: number;
    theme?: "courier" | "customer";
    compact?: boolean;
    className?: string;
}

function pad(n: number) {
    return n.toString().padStart(2, "0");
}

function formatTime(date: Date) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getMinutesUntil(target: Date): number {
    return Math.floor((target.getTime() - Date.now()) / 60000);
}

export default function DeliveryWindow({
    windowStart,
    windowEnd,
    delayMinutes = 0,
    theme = "customer",
    compact = false,
    className
}: DeliveryWindowProps) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 10000); // Every 10s
        return () => clearInterval(interval);
    }, []);

    if (!windowStart || !windowEnd) {
        return (
            <div className={cn("flex items-center gap-2 opacity-40", className)}>
                <Clock className="w-4 h-4" />
                <span className="text-[12px] font-black uppercase tracking-widest">Okno: ustalane...</span>
            </div>
        );
    }

    const start = new Date(windowStart);
    const end = new Date(windowEnd);
    const minutesUntilStart = getMinutesUntil(start);
    const minutesUntilEnd = getMinutesUntil(end);
    const isActive = minutesUntilStart <= 0 && minutesUntilEnd > 0;
    const isUpcoming = minutesUntilStart > 0 && minutesUntilStart <= 20;
    const isPast = minutesUntilEnd <= 0;
    const isDelayed = delayMinutes > 0;

    if (compact) {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <div className={cn(
                    "h-2 w-2 rounded-full animate-pulse",
                    isActive ? "bg-leo-primary" : isDelayed ? "bg-amber-500" : isPast ? "bg-gray-300" : "bg-gray-400"
                )} />
                <span className="text-[11px] font-black font-mono tracking-tight">
                    {formatTime(start)} – {formatTime(end)}
                </span>
                {isDelayed && (
                    <span className="text-[9px] font-black text-amber-600 uppercase">
                        +{delayMinutes}min
                    </span>
                )}
            </div>
        );
    }

    // Full display
    return (
        <div className={cn(
            "rounded-[2rem] p-6 space-y-4",
            theme === "courier" ? "bg-black text-white" : "bg-white text-black border border-gray-100 shadow-xl",
            className
        )}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "h-2 w-2 rounded-full",
                        isActive ? "bg-leo-primary animate-pulse" : isPast ? "bg-gray-400" : "bg-gray-300"
                    )} />
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-[0.3em]",
                        theme === "courier" ? "text-white/40" : "text-gray-400"
                    )}>
                        {isActive ? "Aktywne okno" : isUpcoming ? "Zbliżające się okno" : isPast ? "Minione okno" : "Okno dostawy"}
                    </span>
                </div>
                {isDelayed && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full"
                    >
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        <span className="text-[9px] font-black text-amber-600 uppercase">+{delayMinutes} min opóźnienia</span>
                    </motion.div>
                )}
            </div>

            {/* Main time display */}
            <div className={cn(
                "text-5xl font-black italic tracking-tighter leading-none",
                theme === "courier" ? "text-leo-primary" : "text-black"
            )}>
                {formatTime(start)}
                <span className={cn(
                    "text-3xl mx-2",
                    theme === "courier" ? "text-white/30" : "text-gray-300"
                )}>–</span>
                {formatTime(end)}
            </div>

            {/* Countdown */}
            <AnimatePresence mode="wait">
                {isUpcoming && minutesUntilStart <= 15 && (
                    <motion.div
                        key="countdown"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 px-4 py-3 bg-leo-primary/10 rounded-2xl border border-leo-primary/20"
                    >
                        <Zap className="w-4 h-4 text-leo-primary" />
                        <span className="text-[12px] font-black text-leo-primary uppercase tracking-widest">
                            Kurier dotrze za ~{minutesUntilStart} min
                        </span>
                    </motion.div>
                )}
                {isActive && (
                    <motion.div
                        key="active"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 px-4 py-3 bg-leo-primary rounded-2xl"
                    >
                        <Zap className="w-4 h-4 text-black fill-current" />
                        <span className="text-[12px] font-black text-black uppercase tracking-widest">
                            Kurier jest w Twoim rejonie!
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
