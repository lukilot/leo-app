"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Truck, User, Shield, Lock, Loader2, MapPin, BrainCircuit, Calendar, CheckCircle } from "lucide-react";
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
    ipo_instructions?: string;
    current_delay_minutes?: number;
}

function LiveTrackingContent() {
    const searchParams = useSearchParams();
    const trackingNumber = searchParams.get("tracking");

    const [showPlanB, setShowPlanB] = useState(false);
    const [pkg, setPkg] = useState<PackageData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchPackage = async () => {
        if (!trackingNumber) {
            setLoading(false);
            return;
        }

        try {
            const { data } = await supabase
                .from('packages')
                .select('*')
                .eq('tracking_number', trackingNumber)
                .single();

            if (data) {
                setPkg(data as PackageData);
            }
        } catch (e) {
            console.error("Fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackage();
        // Safety: ensure loader disappears
        const safety = setTimeout(() => {
            setLoading(false);
            if (!pkg && (trackingNumber === 'mock' || !trackingNumber)) {
                setPkg({
                    id: 'mock-live',
                    tracking_number: trackingNumber || 'LEO-LIVE-MOCK',
                    recipient_name: 'Tomasz Testowy',
                    status: 'in_transit',
                    estimated_delivery_time: new Date().toISOString(),
                    window_start: null,
                    window_end: null,
                    plan_b_choice: null,
                    ipo_instructions: 'Klatka B, kod 1234. Kurier widzi Twoje wskazówki.'
                });
            }
        }, 2500);
        const interval = setInterval(fetchPackage, 10000);
        return () => { clearInterval(interval); clearTimeout(safety); };
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
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F5F4] flex flex-col items-center justify-center pb-24 font-sans">
                <Loader2 className="w-10 h-10 animate-spin text-leo-primary mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-leo-gray-400">Namierzanie LEO...</p>
                <BottomNav />
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-center font-sans">
                <h2 className="text-xl font-black text-leo-primary uppercase">Nie znaleziono</h2>
                <p className="text-gray-400 mt-2 text-sm font-medium">Błędny numer śledzenia.</p>
                <BottomNav />
            </div>
        );
    }

    const windowStart = pkg.window_start ? new Date(pkg.window_start) : new Date(pkg.estimated_delivery_time);
    const windowEnd = pkg.window_end ? new Date(pkg.window_end) : new Date(windowStart.getTime() + 15 * 60000);
    const startTime = windowStart.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    const endTime = windowEnd.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-[#F5F5F4] pb-24 font-sans">
            <header className="px-5 pt-14 pb-4 sticky top-0 z-10 bg-white/80 backdrop-blur-md flex items-center justify-between border-b border-gray-100">
                <button onClick={() => window.history.back()} className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 border border-gray-100">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <h1 className="text-[14px] font-black uppercase tracking-widest text-gray-900">Mapa Live</h1>
                <div className="w-10" />
            </header>

            <main className="px-5 space-y-6 pt-6">
                <div className="bg-[#E5E7EB] rounded-[32px] h-[300px] relative overflow-hidden shadow-inner border border-black/5">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "24px 24px" }} />
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-leo-primary animate-bounce" />
                    </motion.div>
                </div>

                <div className="flex flex-col items-center -mt-12 relative z-10 space-y-3">
                    <div className="bg-leo-primary text-white rounded-full px-10 py-4 shadow-xl border-4 border-white">
                        <span className="text-lg font-black uppercase tracking-tight">Za 15-20 min</span>
                    </div>
                </div>

                <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 mt-4">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-leo-accent/30 p-3 rounded-2xl">
                            <BrainCircuit className="w-6 h-6 text-leo-primary" />
                        </div>
                        <div>
                            <h3 className="font-black uppercase text-[10px] tracking-widest text-gray-400 mb-1">System LEO wie:</h3>
                            <p className="text-[14px] font-bold text-gray-800 leading-snug">{pkg.ipo_instructions || "Klatka B, kod 1234. Kurier widzi Twoje wskazówki."}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button onClick={() => setShowPlanB(true)} variant="secondary" className="h-14 rounded-2xl bg-gray-50 font-black text-xs uppercase tracking-widest border-0">Plan B</Button>
                        <Button className="h-14 rounded-2xl bg-leo-primary text-white font-black text-xs uppercase tracking-widest border-0">Puknij / Ring</Button>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {showPlanB && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPlanB(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-6 pb-12 z-[101]">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-6">Twój Plan B</h3>
                            <div className="grid gap-3">
                                {[
                                    { id: 'neighbor', label: 'U sąsiada', icon: User },
                                    { id: 'locker', label: 'Automat', icon: Lock },
                                    { id: 'secure', label: 'Bezpieczne miejsce', icon: Shield },
                                    { id: 'delay', label: 'Jutro', icon: Calendar }
                                ].map((opt) => (
                                    <button key={opt.id} onClick={() => handlePlanBChoice(opt.id)} className={cn("flex items-center justify-between p-5 rounded-3xl border-2 transition-all", pkg.plan_b_choice === opt.id ? "border-leo-primary bg-leo-accent/10" : "border-gray-50")}>
                                        <div className="flex items-center gap-4 font-black text-sm uppercase tracking-tight">
                                            <opt.icon className={cn("w-5 h-5", pkg.plan_b_choice === opt.id ? "text-leo-primary" : "text-gray-300")} />
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

            <BottomNav />
        </div>
    );
}

export default function LiveTracking() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-sans uppercase font-black tracking-widest text-leo-gray-400">Synchronizacja...</div>}>
            <LiveTrackingContent />
        </Suspense>
    );
}
