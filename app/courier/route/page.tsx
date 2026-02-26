"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Navigation, Loader2, ArrowLeft, MapPin, Clock, BrainCircuit, Zap, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface PackageData {
    id: string;
    tracking_number: string;
    recipient_name: string;
    recipient_address: string;
    status: string;
    window_start: string | null;
    current_delay_minutes?: number;
    notes?: string;
}

export default function CourierRoute() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [packages, setPackages] = useState<PackageData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchRoute = async () => {
        try {
            const { data } = await supabase
                .from('packages')
                .select('*')
                .in('status', ['in_transit'])
                .order('window_start', { ascending: true });

            if (data && data.length > 0) {
                setPackages(data as PackageData[]);
            }
        } catch (e) {
            console.error("Route fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoute();
        const safety = setTimeout(() => {
            setLoading(false);
            if (packages.length === 0) {
                setPackages([{
                    id: 'mock-1',
                    tracking_number: 'LEO-ACT-001',
                    recipient_name: 'Jan Kowalski',
                    recipient_address: 'ul. Marszałkowska 10, Warszawa',
                    status: 'in_transit',
                    window_start: new Date().toISOString(),
                    notes: 'Kod 1234, II piętro'
                }]);
            }
        }, 2500);
        const interval = setInterval(fetchRoute, 10000);
        return () => { clearInterval(interval); clearTimeout(safety); };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F5F4] flex flex-col items-center justify-center pb-24 font-sans">
                <Loader2 className="w-10 h-10 animate-spin text-leo-primary mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-leo-gray-400">Inicjalizacja mapy LEO...</p>
                <BottomNav />
            </div>
        );
    }

    const currentStop = packages[currentIndex];
    const nextStops = packages.slice(currentIndex + 1, currentIndex + 4);

    return (
        <div className="min-h-screen bg-[#F1F3F5] flex flex-col relative overflow-hidden font-sans">
            {/* HUD Overlay */}
            <div className="absolute top-0 left-0 right-0 z-30 p-4 pointer-events-none">
                <AnimatePresence mode="wait">
                    {currentStop && (
                        <motion.div
                            key={currentStop.id}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="flex gap-3 items-start pointer-events-auto"
                        >
                            <Button
                                variant="secondary"
                                size="icon"
                                className="shadow-xl bg-white/95 backdrop-blur-md border-0 h-14 w-14 rounded-[20px] shrink-0"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft className="h-6 w-6 text-black" />
                            </Button>
                            <div className="bg-[#1A1A1A] text-white p-5 rounded-[28px] shadow-2xl flex-1 border border-white/10 relative overflow-hidden">
                                <div className="text-[10px] font-black text-leo-primary uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                                    <Zap className="w-3 h-3 fill-current" /> Następny Cel
                                </div>
                                <h2 className="font-black text-[18px] leading-tight mb-2 truncate pr-2">{currentStop.recipient_address}</h2>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/10 px-3 py-1 rounded-xl flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-leo-primary" />
                                        <span className="text-[12px] font-black">{currentStop.window_start ? new Date(currentStop.window_start).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : '10:15'}</span>
                                    </div>
                                    <div className="text-[11px] font-black text-white/40 uppercase tracking-widest">1.2 km</div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] text-white/60 italic">
                                    <BrainCircuit className="w-3.5 h-3.5 text-leo-primary" />
                                    "System wie: {currentStop.notes || 'Kod 1234, II piętro'}..."
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Simulated Map */}
            <div className="flex-1 bg-[#D1D8E0] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <Navigation className="w-64 h-64 text-black rotate-45" />
                </div>
                {/* Active Courier Marker */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-1/4 left-1/2 -translate-x-1/2 z-20"
                >
                    <div className="h-16 w-16 bg-leo-primary rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                        <Navigation className="w-8 h-8 text-white fill-current" />
                    </div>
                </motion.div>
            </div>

            {/* Bottom Sheet */}
            <div className="bg-white rounded-t-[40px] shadow-2xl relative z-40 pb-[100px]">
                <div className="h-1.5 w-12 bg-gray-100 rounded-full mx-auto mt-4 mb-6" />
                <div className="px-6 space-y-6">
                    <div className="flex justify-between items-center bg-[#F5F5F4] p-5 rounded-[28px] border border-gray-100">
                        <div className="flex gap-8">
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pozostało</div>
                                <div className="text-2xl font-black text-black">{packages.length - currentIndex} celów</div>
                            </div>
                            <div className="w-[1px] h-12 bg-gray-200" />
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dystans</div>
                                <div className="text-2xl font-black text-black">1.2 km</div>
                            </div>
                        </div>
                        <Button variant="ghost" className="h-14 w-14 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <History className="w-6 h-6 text-gray-400" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="secondary"
                            className="h-16 rounded-[24px] font-black text-sm uppercase tracking-widest bg-gray-50 border-gray-100"
                            onClick={() => setCurrentIndex(prev => (prev + 1) % packages.length)}
                        >
                            Pomiń Cel
                        </Button>
                        <Button
                            className="h-16 rounded-[24px] bg-leo-primary text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-leo-primary/20"
                            onClick={() => currentStop && router.push(`/courier/stop/${currentStop.id}`)}
                        >
                            Dotarłem
                        </Button>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
