"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Truck, Clock, ShieldCheck, MessageSquare, Phone, Info, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import LEOMap from "@/components/LEOMap";

export default function CustomerLiveTracking() {
    const [progress, setProgress] = useState(0);
    const [showPlanB, setShowPlanB] = useState(false);

    // Simulate Courier Movement
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => (prev < 100 ? prev + 0.1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Simulated Route Coords (Warsaw Wola to Center)
    const courierPos = {
        latitude: 52.235 - (progress * 0.0001),
        longitude: 21.005 + (progress * 0.0002)
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-leo-primary/10 overflow-hidden flex flex-col">
            {/* FULL SCREEN MAP BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <LEOMap
                    theme="consumer"
                    initialViewState={{
                        latitude: 52.232,
                        longitude: 21.01,
                        zoom: 14.5
                    }}
                    markers={[
                        { id: 'courier', latitude: courierPos.latitude, longitude: courierPos.longitude, type: 'user', label: 'Kurier Łukasz' },
                        { id: 'destination', latitude: 52.2297, longitude: 21.0122, type: 'stop', label: 'Mój Dom' }
                    ]}
                />
            </div>

            {/* OVERLAY UI: HEADER */}
            <header className="relative z-10 px-6 pt-16 pb-6 bg-gradient-to-b from-white/90 to-transparent flex items-center gap-4">
                <Link href="/customer/packages">
                    <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-white shadow-xl shadow-black/5 border border-gray-100 flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-[18px] font-black tracking-tighter uppercase italic leading-none">Status <span className="text-leo-primary">Live</span></h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest italic">LEO-9921-X • W Doręczeniu</span>
                    </div>
                </div>
            </header>

            {/* OVERLAY UI: BOTTOM CARD */}
            <div className="mt-auto relative z-10 p-6">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-black text-white rounded-[40px] p-8 space-y-8 shadow-3xl border border-white/10"
                >
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-leo-primary uppercase tracking-[0.3em] italic">Prognoza Doręczenia</div>
                            <div className="text-4xl font-black italic tracking-tighter">14:18 (Za 12 min)</div>
                        </div>
                        <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center">
                            <Truck className="w-8 h-8 text-leo-primary animate-bounce" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-leo-primary grayscale">
                            <img src="https://i.pravatar.cc/150?u=lukas" alt="Courier" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="text-[14px] font-black">Łukasz K.</div>
                            <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">Twoja 5-gwiazdkowa obsługa</div>
                        </div>
                        <div className="flex gap-2">
                            <Button className="h-10 w-10 p-0 rounded-xl bg-leo-primary text-black"><MessageSquare className="w-4 h-4" /></Button>
                            <Button className="h-10 w-10 p-0 rounded-xl bg-white/10 text-white"><Phone className="w-4 h-4" /></Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button onClick={() => setShowPlanB(true)} className="h-16 rounded-[2rem] bg-leo-primary text-black font-black uppercase tracking-widest text-[11px] border-0">Zmień na Plan B</Button>
                        <Button className="h-16 rounded-[2rem] bg-white/5 text-white font-black uppercase tracking-widest text-[11px] border border-white/10">Szczegóły</Button>
                    </div>

                    <div className="flex justify-center items-center gap-2 pt-2 opacity-40">
                        <ShieldCheck className="w-3 h-3 text-leo-primary" />
                        <span className="text-[8px] font-black uppercase tracking-widest">LEO Secured Vision 2026 Proto-Map</span>
                    </div>
                </motion.div>
            </div>

            {/* PLAN B DRAWER (Mini) */}
            <AnimatePresence>
                {showPlanB && (
                    <div className="fixed inset-0 z-[200] flex items-end justify-center">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPlanB(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white rounded-t-[48px] w-full p-10 relative z-10 shadow-3xl">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-10" />
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Zmień Instrukcję (Plan B)</h3>
                            <div className="space-y-3">
                                {['Sąsiad (nr 12)', 'Punkt LEO Hub', 'Przełóż na jutro'].map((opt, i) => (
                                    <Button key={i} variant="ghost" className="w-full h-16 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between px-6 text-[12px] font-black uppercase">
                                        {opt} <Info className="w-4 h-4 opacity-20" />
                                    </Button>
                                ))}
                            </div>
                            <Button onClick={() => setShowPlanB(false)} className="w-full h-16 rounded-[2rem] bg-black text-white mt-8 font-black uppercase tracking-widest">Potwierdź Zmianę</Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
