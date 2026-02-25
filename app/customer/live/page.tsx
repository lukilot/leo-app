"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Map, Navigation, Box, User, Home, Shield, Lock, Loader2 } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface PackageData {
    id: string;
    tracking_number: string;
    recipient_name: string;
    status: string;
    estimated_delivery_time: string;
    plan_b_choice: string | null;
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

    // Format delivery window
    const d = new Date(pkg.estimated_delivery_time);
    const startTime = d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    const endDate = new Date(d.getTime() + 15 * 60000);
    const endTime = endDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-gray-100 pb-24 relative flex flex-col overflow-hidden">
            {/* Map Background (Mock) */}
            <div className="absolute inset-0 z-0 bg-gray-300">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_Warsaw.png')] bg-cover opacity-60 grayscale" />

                {/* Courier Pin */}
                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute top-1/2 left-1/2 -ml-6 -mt-12 h-12 w-12 text-leo-primary z-10 drop-shadow-xl"
                >
                    <Navigation className="h-full w-full fill-current rotate-45" />
                </motion.div>

                {/* User Pin */}
                <div className="absolute top-[60%] left-[45%] h-4 w-4 bg-blue-500 rounded-full border-2 border-white shadow-lg ring-4 ring-blue-500/20" />
            </div>

            {/* Floating Header */}
            <div className="relative z-10 p-4 pt-12">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
                    <div className="text-center">
                        <p className="text-xs font-bold text-leo-gray-500 uppercase tracking-widest">Twoje okno</p>
                        <h1 className="text-3xl font-bold text-leo-primary my-1">{startTime} – {endTime}</h1>
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> {pkg.status === 'in_transit' ? 'W drodze' : 'Oczekuje'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1" />

            {/* Bottom Sheet Actions */}
            <div className="relative z-20 p-4 space-y-3">
                {pkg.plan_b_choice && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-xl text-center text-sm font-medium"
                    >
                        Aktywny Plan B: <span className="font-bold">{pkg.plan_b_choice}</span>
                    </motion.div>
                )}

                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-2xl space-y-4"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">Kurier Łukasz</h3>
                            <p className="text-sm text-leo-gray-500">Volvo XC40 • LEO-12345</p>
                        </div>
                        <div className="h-12 w-12 bg-leo-gray-100 rounded-full flex items-center justify-center font-bold text-leo-primary text-xl">
                            Ł
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button className="flex-1 h-12 bg-leo-primary text-white" disabled={pkg.status === 'delivered'}>
                            {pkg.status === 'delivered' ? 'Doręczono' : 'Będę na miejscu'}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 h-12 border-leo-primary text-leo-primary"
                            onClick={() => setShowPlanB(true)}
                            disabled={pkg.status === 'delivered' || !!pkg.plan_b_choice}
                        >
                            Plan B
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Plan B Modal (Overlay) */}
            <AnimatePresence>
                {showPlanB && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <div className="h-1 w-12 bg-gray-200 rounded-full mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-leo-primary">Wybierz Plan B</h2>
                                <p className="text-leo-gray-500">Gdzie kurier ma zostawić paczkę podczas Twojej nieobecności?</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Box, label: "Paczkomat", desc: "Najbliższy" },
                                    { icon: Home, label: "U sąsiada", desc: "Pod nr 5" },
                                    { icon: Shield, label: "Bezpieczne", desc: "Pod drzwiami" },
                                    { icon: Lock, label: "Punkt", desc: "Żabka" },
                                ].map((opt) => (
                                    <button
                                        key={opt.label}
                                        className="flex flex-col items-center p-4 border rounded-xl hover:bg-leo-primary/5 hover:border-leo-primary transition-colors focus:ring-2 focus:ring-leo-primary focus:outline-none"
                                        onClick={() => handlePlanBChoice(opt.label)}
                                    >
                                        <opt.icon className="h-8 w-8 text-leo-primary mb-2" />
                                        <span className="font-bold text-sm">{opt.label}</span>
                                        <span className="text-xs text-leo-gray-400">{opt.desc}</span>
                                    </button>
                                ))}
                            </div>

                            <Button variant="ghost" className="w-full text-leo-gray-500" onClick={() => setShowPlanB(false)}>
                                Anuluj
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
