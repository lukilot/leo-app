"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Map, Navigation, Box, User, Home, Shield, Lock, Loader2, Truck, MapPin, BrainCircuit, Calendar, CheckCircle } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

interface PackageData {
    id: string;
    tracking_number: string;
    recipient_name: string;
    status: string;
    estimated_delivery_time: string;
    window_start: string | null;
    window_end: string | null;
    plan_b_choice: string | null;
    ipo_instructions?: string; // e.g., "Kod: 1234, wejście od podwórza"
}

function LiveTrackingContent() {
    const searchParams = useSearchParams();
    const trackingNumber = searchParams.get("tracking");

    const [showPlanB, setShowPlanB] = useState(false);
    const [pkg, setPkg] = useState<PackageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPackage() {
            if (!trackingNumber) {
                setLoading(false);
                return;
            }

            setLoading(true);
            const { data, error } = await supabase
                .from('packages')
                .select('*')
                .eq('tracking_number', trackingNumber)
                .single();

            if (data) {
                setPkg(data as PackageData);
            } else {
                console.error("Error fetching package:", error);
            }
            setLoading(false);
        }

        fetchPackage();
    }, [trackingNumber]);

    async function handlePlanBChoice(choice: string) {
        if (!pkg) return;

        const { error } = await supabase
            .from('packages')
            .update({ plan_b_choice: choice })
            .eq('id', pkg.id);

        if (!error) {
            setPkg({ ...pkg, plan_b_choice: choice });
            setShowPlanB(false);
        } else {
            console.error("Error setting plan B:", error);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-leo-primary" />
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-xl font-bold text-leo-primary">Nie znaleziono przesyłki</h2>
                <p className="text-leo-gray-500 mt-2">Sprawdź czy link śledzenia jest poprawny.</p>
                <BottomNav />
            </div>
        );
    }

    // Format delivery window (Vision 2026: 15-min slots)
    const windowStart = pkg.window_start ? new Date(pkg.window_start) : new Date(pkg.estimated_delivery_time);
    const windowEnd = pkg.window_end ? new Date(pkg.window_end) : new Date(windowStart.getTime() + 15 * 60000);

    const startTime = windowStart.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    const endTime = windowEnd.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-leo-bg pb-24 font-sans selection:bg-leo-primary/10">
            {/* Header */}
            <header className="px-5 pt-14 pb-4 sticky top-0 z-10 bg-leo-bg/90 backdrop-blur-md flex items-center justify-between">
                <button
                    onClick={() => window.history.back()}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 border border-gray-100 transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="text-[17px] font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">Śledzenie na mapie</h1>
                <div className="w-10"></div> {/* Spacer for centering */}
            </header>

            <main className="px-5 space-y-6 mt-2">
                {/* Map Container */}
                <div className="bg-[#F2EDEA] rounded-[32px] h-[340px] relative overflow-hidden shadow-sm border border-black/5">
                    {/* Static Map Background (mocking the map view) */}
                    <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)", backgroundSize: "20px 20px" }} />

                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 300" preserveAspectRatio="none">
                        <path d="M 120 100 L 120 160 L 200 160" stroke="var(--leo-primary)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    {/* Courier Marker */}
                    <div className="absolute top-[80px] left-[100px] flex flex-col items-center">
                        <div className="h-12 w-12 bg-leo-accent/30 rounded-full flex items-center justify-center absolute -z-10 animate-pulse">
                            <div className="h-8 w-8 bg-leo-accent/50 rounded-full" />
                        </div>
                        <div className="h-10 w-10 bg-leo-primary rounded-full text-white flex items-center justify-center shadow-lg border-2 border-white">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div className="bg-white rounded-full px-3 py-1 shadow-sm border border-gray-100 text-[11px] font-bold mt-1 text-gray-600">
                            Kurier
                        </div>
                    </div>

                    {/* Destination Marker */}
                    <div className="absolute top-[140px] left-[180px] flex flex-col items-center">
                        <div className="h-10 w-10 bg-[#10B981] rounded-full text-white flex items-center justify-center shadow-lg border-2 border-white">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="bg-white rounded-full px-3 py-1 shadow-sm border border-gray-100 text-[11px] font-bold mt-1 text-gray-600">
                            Twoja lokalizacja
                        </div>
                    </div>
                </div>

                {/* Overlapping Pills */}
                <div className="flex flex-col items-center -mt-10 relative z-10 space-y-3">
                    {/* Main Time Pill */}
                    <div className="bg-leo-primary text-white rounded-full px-10 py-3.5 shadow-lg border-4 border-leo-bg">
                        <span className="text-[17px] font-extrabold tracking-tight">Za 15-20 min</span>
                    </div>

                    {/* Certainty Pill */}
                    <div className="bg-green-50 text-green-700 rounded-full px-3 py-1 border border-green-200 shadow-sm flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M20 6 9 17l-5-5" /></svg>
                        <span className="text-xs font-bold tracking-wide">Pewność doręczenia: Wysoka</span>
                    </div>
                </div>

                {/* System Info Card (Vision 2026: IPO Integrated) */}
                <div className="bg-leo-accent/30 border border-leo-accent/50 rounded-2xl p-4 flex gap-3 items-start mt-8">
                    <div className="bg-white rounded-full p-2 mt-0.5">
                        <BrainCircuit className="w-5 h-5 text-leo-primary shrink-0" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[14px] leading-snug text-gray-900 font-bold mb-1">
                            System wie:
                        </p>
                        <p className="text-[13px] leading-snug text-gray-600">
                            {pkg.ipo_instructions || "Klatka B, kod 1234. Kurier widzi Twoje wskazówki."}
                        </p>
                    </div>
                </div>

                {/* Actions (Vision 2026: Plan B Trigger) */}
                <div className="space-y-4 pt-2">
                    <div className="flex gap-3">
                        <Button onClick={() => setShowPlanB(true)} variant="secondary" className="flex-1 h-14 rounded-[20px] font-bold text-[15px]">
                            Plan B
                        </Button>
                        <Button className="flex-1 h-14 rounded-[20px] bg-leo-primary text-white font-bold text-[15px] shadow-[0_4px_14px_rgba(232,93,4,0.25)]">
                            Puknij / Ring
                        </Button>
                    </div>

                    <div className="flex justify-center items-center gap-1.5 text-gray-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium uppercase tracking-wider">Lokalizacja przybliżona • Okno {startTime}-{endTime}</span>
                    </div>
                </div>

                {/* Plan B Overlay */}
                <AnimatePresence>
                    {showPlanB && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowPlanB(false)}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                            />
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 pb-12 z-[101] shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Twój Plan B</h3>
                                    <button onClick={() => setShowPlanB(false)} className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">✕</button>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { id: 'neighbor', label: 'Zostaw u sąsiada', icon: User },
                                        { id: 'locker', label: 'Paczkomat / Automat', icon: Lock },
                                        { id: 'secure', label: 'Bezpieczne miejsce', icon: Shield },
                                        { id: 'delay', label: 'Dostarcz jutro', icon: Calendar }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handlePlanBChoice(opt.id)}
                                            className={cn(
                                                "w-full p-4 rounded-2xl border flex items-center justify-between transition-all",
                                                pkg.plan_b_choice === opt.id ? "border-leo-primary bg-leo-accent/10" : "border-gray-100 hover:border-gray-200"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 font-semibold text-gray-700">
                                                <opt.icon className={cn("w-5 h-5", pkg.plan_b_choice === opt.id ? "text-leo-primary" : "text-gray-400")} />
                                                {opt.label}
                                            </div>
                                            {pkg.plan_b_choice === opt.id && <CheckCircle className="w-5 h-5 text-leo-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

            </main>

            <BottomNav />
        </div>
    );
}

export default function LiveTracking() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-leo-primary" />
            </div>
        }>
            <LiveTrackingContent />
        </Suspense>
    );
}
