"use client";

import { useState, useEffect } from "react";
import {
    Truck, User, Activity, MapPin, AlertCircle, ChevronRight,
    ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Star,
    MessageSquare, Settings, Zap, ShieldAlert, Users, Timer,
    CheckCircle2, Loader2, Gauge
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FleetOwnerMobile() {
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState<'live' | 'stats' | 'reports'>('live');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        setTimeout(() => setLoading(false), 1200);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans tracking-widest">
                <Gauge className="w-12 h-12 text-leo-primary animate-pulse mb-6" />
                <p className="text-[10px] font-black uppercase text-gray-400">Fleet Control Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans selection:bg-leo-primary/10 pb-32">
            {/* TACTICAL HEADER */}
            <header className="px-6 pt-16 pb-6 sticky top-0 z-[100] bg-white border-b border-gray-100 flex justify-between items-end backdrop-blur-md bg-white/90">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-3xl flex items-center justify-center shadow-xl shadow-black/10">
                        <Users className="w-6 h-6 text-leo-primary" />
                    </div>
                    <div>
                        <h1 className="text-[20px] font-black uppercase tracking-tighter italic leading-none text-black">FLEO <span className="text-leo-primary">PARTNER</span></h1>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Fleet Owner Portal</span>
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Fleet WWA-X</div>
                    <div className="text-[18px] font-black font-mono tracking-tighter text-black">02:00</div>
                </div>
            </header>

            <main className="px-6 pt-8 space-y-10">
                {/* 1. FLEET PERFORMANCE HUD */}
                <section className="bg-black rounded-[40px] p-8 text-white space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <TrendingUp className="w-24 h-24 text-leo-primary" />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Wynik Floty Dziś</h3>
                        <div className="text-4xl font-black tracking-tighter italic text-leo-primary">96.4% SLA</div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                        <div>
                            <div className="text-2xl font-black tracking-tighter">14/15</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1 italic">Auta w Trasie</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black tracking-tighter">2.4k PLN</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1 italic">COD Do Rozliczenia</div>
                        </div>
                    </div>
                </section>

                {/* 2. FLEET LIVE: LIST OF COURIERS */}
                {activeTab === 'live' && (
                    <section className="space-y-6">
                        <div className="flex justify-between items-end px-1">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Podgląd Floty</h2>
                            <div className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-1.5">
                                <Activity className="w-3 h-3 text-leo-primary" /> Active Monitoring
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: "Łukasz K.", status: "DELIVERING", car: "WWA 1202", SLA: "99%", delay: "None", avatar: "LK" },
                                { name: "Anna S.", status: "DELAYED", car: "WWA 4492", SLA: "88%", delay: "+15m", avatar: "AS" },
                                { name: "Tomasz W.", status: "IDLE", car: "WWA 5560", SLA: "100%", delay: "None", avatar: "TW" },
                                { name: "Robert M.", status: "DELIVERING", car: "WWA 7711", SLA: "94%", delay: "None", avatar: "RM" }
                            ].map((driver, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex items-center justify-between group active:scale-98 transition-transform"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-[13px] text-gray-400 border border-gray-100 group-hover:bg-leo-primary group-hover:text-black transition-colors">
                                            {driver.avatar}
                                        </div>
                                        <div>
                                            <div className="text-[15px] font-black text-black leading-none uppercase tracking-tighter italic">{driver.name}</div>
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1.5">{driver.car} • {driver.SLA} SLA</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn(
                                            "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest",
                                            driver.status === 'DELAYED' ? "bg-red-50 text-red-600" : driver.status === 'IDLE' ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-600"
                                        )}>
                                            {driver.status}
                                        </div>
                                        {driver.delay !== 'None' && <div className="text-[11px] font-black text-red-600 mt-1">{driver.delay}</div>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 3. RANKING & EFFICIENCY */}
                {activeTab === 'stats' && (
                    <section className="space-y-6">
                        <div className="flex justify-between items-end px-1">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Ranking i Efektywność</h2>
                            <div className="bg-leo-primary/10 text-leo-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">WWA Region</div>
                        </div>

                        <div className="bg-white rounded-[40px] p-8 border border-gray-100 space-y-8 shadow-sm">
                            <div className="space-y-6">
                                {[
                                    { rank: 1, name: "Łukasz K.", pts: 9.8, deliveries: 42, km: 68 },
                                    { rank: 2, name: "Tomasz W.", pts: 9.2, deliveries: 38, km: 52 },
                                    { rank: 3, name: "Anna S.", pts: 7.4, deliveries: 31, km: 94 }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xl font-black text-gray-200 w-6">#{item.rank}</span>
                                            <div>
                                                <div className="text-[14px] font-black uppercase tracking-tighter text-black">{item.name}</div>
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{item.deliveries} paczek • {item.km} km</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[16px] font-black text-black">{item.pts}</div>
                                            <div className="flex gap-0.5 mt-1 justify-end">
                                                {[...Array(5)].map((_, star) => (
                                                    <Star key={star} className={cn("w-2 h-2 fill-current", star < Math.floor(item.pts / 2) ? "text-leo-primary" : "text-gray-100")} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 4. ACTIONS / REPORTS */}
                <section className="space-y-4">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Szybkie Zgłoszenie</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Button className="h-32 rounded-[32px] bg-red-50 text-red-600 border border-red-100 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
                            <ShieldAlert className="w-7 h-7" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-center leading-tight">Awaria Auta</span>
                        </Button>
                        <Button className="h-32 rounded-[32px] bg-orange-50 text-orange-600 border border-orange-100 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
                            <User className="w-7 h-7" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-center leading-tight">Brak Kuriera</span>
                        </Button>
                        <Button variant="ghost" className="h-24 rounded-[32px] bg-gray-50 text-black border border-gray-100 font-black uppercase tracking-widest text-[10px] col-span-2">
                            Inny Problem / Zmiana Obsady <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </section>
            </main>

            {/* DOCK NAVIGATION */}
            <div className="fixed bottom-10 left-6 right-6 z-[100] bg-black text-white px-8 py-5 rounded-[2.5rem] shadow-2xl flex justify-between items-center border-4 border-white">
                {[
                    { id: 'live', icon: MapPin, label: 'Flota Live' },
                    { id: 'stats', icon: Activity, label: 'Wyniki' },
                    { id: 'money', icon: Wallet, label: 'Kasa' },
                    { id: 'chat', icon: MessageSquare, label: 'Kontakt' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={cn(
                            "flex flex-col items-center gap-1.5 transition-all",
                            activeTab === item.id ? "text-leo-primary scale-110" : "text-white/40 hover:text-white"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Design Credit */}
            <div className="text-center pt-8 pb-32">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-leo-primary opacity-30 italic">Design and execution by lukilot.work</p>
            </div>

            {/* Grain */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #111 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>
    );
}
