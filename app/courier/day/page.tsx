"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BottomNav } from "@/components/layout/BottomNav";
import { Map, Navigation, CheckCircle2, Loader2, Play, ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface PackageData {
    id: string;
    tracking_number: string;
    recipient_name: string;
    recipient_address: string;
    status: string;
    estimated_delivery_time: string;
    window_start?: string;
    window_end?: string;
    company?: string; // e.g., 'DPD', 'DHL'
}

export default function CourierDay() {
    const [status, setStatus] = useState<"idle" | "calculating" | "ready" | "started">("idle");
    const [packages, setPackages] = useState<PackageData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPackages() {
            const { data, error } = await supabase
                .from('packages')
                .select('*')
                .in('status', ['pending', 'in_transit'])
                .order('estimated_delivery_time', { ascending: true });

            if (data) {
                setPackages(data as PackageData[]);
            } else {
                console.error("Error fetching packages:", error);
            }
            setLoading(false);
        }

        fetchPackages();

        // Setup polling every 3 seconds for real-time demo effect
        const interval = setInterval(fetchPackages, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleCalculateRate = () => {
        setStatus("calculating");
        // Simulate algorithm loading
        setTimeout(() => {
            // Assign some mock companies if missing
            const enriched = packages.map((p, i) => ({
                ...p,
                company: i % 2 === 0 ? 'DPD' : 'DHL'
            }));
            setPackages(enriched);
            setStatus("ready");
        }, 2000);
    };

    const movePackage = (index: number, direction: 'up' | 'down') => {
        const newPackages = [...packages];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= packages.length) return;

        const temp = newPackages[index];
        newPackages[index] = newPackages[targetIndex];
        newPackages[targetIndex] = temp;
        setPackages(newPackages);
    };

    const handleStartRoute = async () => {
        setStatus("started");

        // Vision 2026: Generate 15-min windows based on final order
        const now = new Date();
        const updatedPackages = packages.map((p, i) => {
            const start = new Date(now.getTime() + (i * 15 + 10) * 60000);
            const end = new Date(start.getTime() + 15 * 60000);
            return {
                ...p,
                status: 'in_transit',
                window_start: start.toISOString(),
                window_end: end.toISOString()
            };
        });

        setPackages(updatedPackages);

        // Batch update in Supabase (simplified)
        for (const pkg of updatedPackages) {
            await supabase
                .from('packages')
                .update({
                    status: 'in_transit',
                    window_start: pkg.window_start,
                    window_end: pkg.window_end
                })
                .eq('id', pkg.id);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-leo-bg flex items-center justify-center pb-24">
                <Loader2 className="w-8 h-8 animate-spin text-leo-primary" />
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 relative font-sans selection:bg-leo-primary/10">
            {/* Header */}
            <header className="px-5 pt-14 pb-4 sticky top-0 z-10 bg-[#F8FAFC]/90 backdrop-blur-md flex justify-between items-center">
                <div>
                    <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Dzień dobry!</h1>
                    <p className="text-gray-500 text-[13px] font-medium mt-0.5 uppercase tracking-wider">{new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
                <div className="h-11 w-11 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center">
                    <span className="font-bold text-leo-primary text-[15px]">LK</span>
                </div>
            </header>

            <main className="px-5 space-y-6 mt-2">
                {/* State: IDLE (Imported Packages) */}
                {status === "idle" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                        <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100/50">
                            <div className="mb-4">
                                <h2 className="text-[17px] font-bold text-gray-900">Plan dnia</h2>
                                <p className="text-[13px] text-gray-500">Podsumowanie zaimportowanych przesyłek</p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="bg-[#F8FAFC] rounded-2xl py-3 px-2 border border-blue-50">
                                    <div className="text-2xl font-extrabold text-leo-primary">{packages.length}</div>
                                    <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">Paczki</div>
                                </div>
                                <div className="bg-[#F8FAFC] rounded-2xl py-3 px-2 border border-blue-50">
                                    <div className="text-2xl font-extrabold text-leo-primary">{Math.round(packages.length * 4.5)}<span className="text-[13px] font-bold ml-0.5">km</span></div>
                                    <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">Dystans</div>
                                </div>
                                <div className="bg-[#F8FAFC] rounded-2xl py-3 px-2 border border-blue-50">
                                    <div className="text-2xl font-extrabold text-leo-primary">{Math.max(1, Math.round(packages.length * 0.4))}<span className="text-[13px] font-bold ml-0.5">h</span></div>
                                    <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">Czas</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#F0F4FF] p-4 flex gap-3 items-center border border-blue-100 rounded-2xl">
                            <CheckCircle2 className="w-6 h-6 text-leo-primary shrink-0" />
                            <p className="text-[13px] leading-snug text-gray-700">
                                <strong className="text-leo-primary block text-[14px]">Mocny start!</strong>
                                Jakość planu: 98%. Pojemność auta: 85%.
                            </p>
                        </div>

                        <Button className="w-full mt-4" onClick={handleCalculateRate} disabled={packages.length === 0}>
                            Ułóż trasę optymalną
                        </Button>
                    </motion.div>
                )}

                {/* State: CALCULATING */}
                {status === "calculating" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-8"
                    >
                        <div className="h-24 w-24 relative mb-8">
                            <motion.div
                                className="absolute inset-0 border-[6px] border-gray-100 rounded-full"
                            />
                            <motion.div
                                className="absolute inset-0 border-[6px] border-t-leo-primary border-r-transparent border-b-transparent border-l-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-black tracking-tight text-leo-primary">LEO</span>
                            </div>
                        </div>
                        <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Optymalizacja trasy...</h2>
                        <p className="text-[15px] text-gray-500 mt-2 max-w-[250px]">Analizuję okna czasowe i korki w Warszawie.</p>
                    </motion.div>
                )}

                {/* State: READY (Route View) */}
                {(status === "ready" || status === "started") && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        {status === "ready" && (
                            <div className="bg-green-50 p-4 rounded-2xl border border-green-200 flex items-center justify-between mb-2 shadow-sm">
                                <div>
                                    <h3 className="font-bold text-[15px] text-green-800 tracking-tight">Trasa gotowa!</h3>
                                    <p className="text-[12px] font-medium text-green-700 mt-0.5">Oszczędność czasu: 45 min</p>
                                </div>
                                <Button size="sm" onClick={handleStartRoute} className="bg-[#10B981] hover:bg-[#059669] text-white rounded-full px-6 shadow-sm border-0 h-10">
                                    <Play className="h-4 w-4 mr-1 fill-current" /> Start
                                </Button>
                            </div>
                        )}

                        {status === "started" && packages.length > 0 && (
                            <div className="bg-leo-primary text-white p-5 rounded-[20px] shadow-[0_8px_30px_rgba(232,93,4,0.2)] mb-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] pointer-events-none" />
                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h3 className="font-bold text-[13px] text-blue-100 uppercase tracking-wider mb-1 flex items-center"><Navigation className="h-3.5 w-3.5 mr-1" /> W trasie</h3>
                                        <p className="text-white font-semibold text-[16px] truncate">{packages[0].recipient_address}</p>
                                    </div>
                                    <div className="bg-white text-leo-primary px-3 py-1.5 rounded-xl text-[12px] font-black shrink-0 shadow-sm">
                                        ETA {new Date(packages[0].estimated_delivery_time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* List of stops */}
                        <div className="space-y-3 mt-4">
                            <h3 className="font-bold text-gray-500 text-[12px] uppercase tracking-widest pl-1 mb-3">Kolejność punktów</h3>

                            {packages.map((pkg, i) => {
                                const deliveryTime = new Date(pkg.estimated_delivery_time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
                                return (
                                    <div key={pkg.id} className="block w-full outline-none focus:ring-2 focus:ring-leo-primary rounded-[20px] relative group">
                                        <div className="bg-white rounded-[20px] p-4 flex items-center border border-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all hover:border-gray-200">
                                            <div className="h-[46px] w-[46px] bg-[#F8FAFC] rounded-full flex flex-col items-center justify-center shrink-0 font-bold text-gray-600 border border-gray-100 mr-4 text-[15px] relative">
                                                {i + 1}
                                                {status === 'ready' && (
                                                    <div className="absolute -left-12 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => movePackage(i, 'up')} className="p-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"><ChevronUp className="w-3 h-3" /></button>
                                                        <button onClick={() => movePackage(i, 'down')} className="p-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"><ChevronDown className="w-3 h-3" /></button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 overflow-hidden pr-2">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <div className="flex items-center gap-2 truncate">
                                                        <span className="font-semibold text-[15px] text-gray-900 truncate">{pkg.recipient_address}</span>
                                                        {pkg.company && (
                                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-bold uppercase tracking-tighter shrink-0">{pkg.company}</span>
                                                        )}
                                                    </div>
                                                    <span className="text-[12px] bg-leo-accent/30 px-2 py-0.5 rounded-lg text-leo-primary font-bold shrink-0 ml-2">
                                                        {pkg.window_start ?
                                                            `${new Date(pkg.window_start).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}` :
                                                            deliveryTime
                                                        }
                                                    </span>
                                                </div>
                                                <div className="text-[13px] text-gray-500 truncate">{pkg.recipient_name} • <span className="text-gray-400">{pkg.tracking_number}</span></div>
                                            </div>
                                            <Link href={`/courier/stop/${pkg.id}`} className="absolute inset-0 z-0" />
                                        </div>
                                    </div>
                                );
                            })}

                            {packages.length === 0 && (
                                <div className="text-center py-10 bg-white border border-dashed border-gray-200 rounded-[24px]">
                                    <p className="text-[15px] font-semibold text-gray-500">Wszystkie paczki doręczone!</p>
                                </div>
                            )}
                        </div>

                        {/* Map Placeholder */}
                        {packages.length > 0 && (
                            <div className="h-[200px] bg-[#F2EDEA] rounded-[24px] flex items-center justify-center border border-black/5 relative overflow-hidden mt-8 shadow-sm">
                                <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)", backgroundSize: "20px 20px" }} />
                                <Button variant="secondary" className="relative z-10 shadow-md bg-white text-gray-900 font-bold h-12 rounded-full px-6">
                                    <Map className="mr-2 h-4 w-4 text-gray-500" /> Pokaż mapę z trasą
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
