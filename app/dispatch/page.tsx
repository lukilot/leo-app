"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Navigation, ZoomIn, ZoomOut, Maximize, AlertCircle, Phone, Video, Search,
    Bell, LogOut, BrainCircuit, Activity, Zap, Loader2, Globe, Box,
    BarChart3, Settings, ShieldCheck, Share2, Filter, Layers, LayoutDashboard,
    PieChart, Map as MapIcon, Megaphone, CheckCircle2, Factory, Clock,
    Truck, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

export default function B2BDispatchMaster() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [viewMode, setViewMode] = useState<'operacyjne' | 'planowanie' | 'magazyn' | 'raporty'>('operacyjne');
    const [stats, setStats] = useState({
        totalPacks: 4829,
        inTransit: 3120,
        delivered: 1642,
        unassigned: 67,
        firstAttemptSuccess: "96.4%",
        onTime: "92.8%",
        opsCost: "2.42 PLN/p"
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        const load = async () => {
            await new Promise(r => setTimeout(r, 1500));
            setLoading(false);
        };
        load();
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F5F4] flex flex-col items-center justify-center font-sans">
                <Loader2 className="w-16 h-16 animate-spin text-leo-primary mb-8" />
                <div className="text-center space-y-3">
                    <h2 className="text-[14px] font-black uppercase tracking-[0.5em] text-gray-900 italic">LEO B2B COMMAND CENTER</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Synchronizacja Hubów i Sektorów...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans selection:bg-leo-primary/10 select-none">
            {/* Top Navigation: Professional Level */}
            <header className="bg-black text-white px-8 py-5 flex justify-between items-center sticky top-0 z-[200] shadow-2xl">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-leo-primary rounded-xl flex items-center justify-center">
                            <Box className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h1 className="text-[20px] font-black uppercase tracking-tighter leading-none italic">SZTAB <span className="text-leo-primary">GENERALNY</span></h1>
                            <div className="flex flex-col mt-1">
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">LEO B2B OPERATIONAL CORE</p>
                                <p className="text-[7px] font-black text-leo-primary/60 uppercase tracking-[0.2em] mt-0.5">Design & Execution by lukilot.work</p>
                            </div>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-4">
                        {[
                            { id: 'operacyjne', label: 'Operacje Live', icon: LayoutDashboard },
                            { id: 'planowanie', label: 'Planowanie & Wolumen', icon: BrainCircuit },
                            { id: 'magazyn', label: 'Hub & Sortownia', icon: Factory },
                            { id: 'raporty', label: 'BI & Raportowanie', icon: BarChart3 },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setViewMode(item.id as any)}
                                className={cn(
                                    "flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest",
                                    viewMode === item.id ? "bg-white/10 text-leo-primary" : "text-white/40 hover:text-white"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-right">
                        <div className="text-[14px] font-black font-mono tracking-tighter">{currentTime.toLocaleTimeString('pl-PL')}</div>
                        <div className="text-[9px] font-black text-green-500 uppercase tracking-widest flex items-center justify-end gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Global Live Network
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-3 right-3 h-2 w-2 bg-red-600 rounded-full" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10">
                            <Settings className="w-5 h-5 text-leo-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-red-900/20 border border-red-900/30 text-red-500 hover:bg-red-900/40">
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex lg:flex-row flex-col overflow-hidden">
                {/* 2. Control Sidebar (Global Intelligence) */}
                <aside className="w-full lg:w-[450px] bg-white border-r border-gray-100 flex flex-col h-[calc(100vh-84px)] shrink-0 overflow-y-auto z-50 shadow-2xl custom-scrollbar lg:shadow-none">
                    <div className="p-8 space-y-10">
                        {/* Macro KPI Grid */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Zdrowie Operacji (Global)</h3>
                                <Activity className="w-4 h-4 text-leo-primary" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-black rounded-3xl p-5 text-white">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Pierwsza Próba</p>
                                    <div className="text-3xl font-black text-leo-primary leading-none uppercase italic">{stats.firstAttemptSuccess}</div>
                                    <div className="text-[9px] font-black text-green-500 mt-3 uppercase">Target: 95%+</div>
                                </div>
                                <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Punktualność (15m)</p>
                                    <div className="text-3xl font-black text-gray-900 leading-none uppercase italic">{stats.onTime}</div>
                                    <div className="text-[9px] font-black text-leo-primary mt-3 uppercase tracking-tighter">Sloty Aktywne</div>
                                </div>
                                <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 col-span-2 flex justify-between items-center">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Koszt Operacyjny / Paczka</p>
                                        <div className="text-2xl font-black text-gray-900 uppercase italic leading-none">{stats.opsCost}</div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-red-600 mb-1.5">Koszty Paliwa (Market)</p>
                                        <div className="text-xs font-black text-gray-900 uppercase tracking-tighter">+4.2% Today</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* EXCEPTIONS: THE CORE REASON FOR THE PANEL */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900">Zarządzanie Wyjątkami</h3>
                                <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">12 AKTYWNYCH</span>
                            </div>

                            <div className="space-y-3">
                                {/* CATEGORY: WAREHOUSE */}
                                <div className="p-5 rounded-[2.5rem] bg-amber-50 border border-amber-100 group cursor-pointer hover:shadow-lg transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 bg-amber-600 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-900">MAGAZYN & SORTOWNIA</span>
                                        </div>
                                        <span className="text-[10px] font-black font-mono text-amber-900/30">H-01-WWA</span>
                                    </div>
                                    <h4 className="text-[15px] font-black uppercase italic text-amber-950 leading-tight">Przekroczenie Przepustowości Sortera</h4>
                                    <p className="text-[12px] font-medium text-amber-900/60 mt-2 leading-relaxed">
                                        Hub WWA-Zachód: Zator na linii bocznej. 420 paczek niezeskanowanych do 11:00. Ryzyko opóźnienia wyjazdów o 35min.
                                    </p>
                                    <div className="flex gap-2 mt-5">
                                        <Button className="flex-1 h-12 bg-amber-200 hover:bg-amber-300 text-amber-900 font-black text-[10px] uppercase tracking-widest rounded-2xl border-0">Aplikuj Plan B (Re-Route)</Button>
                                    </div>
                                </div>

                                {/* CATEGORY: FLEET CRITICAL */}
                                <div className="p-5 rounded-[2.5rem] bg-red-50 border border-red-100 group cursor-pointer hover:shadow-lg transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-red-900">FLOTA & TRASY</span>
                                        </div>
                                        <span className="text-[10px] font-black font-mono text-red-900/30">KRYTYCZNE</span>
                                    </div>
                                    <h4 className="text-[15px] font-black uppercase italic text-red-950 leading-tight">Blokada Sektora: AW82 (Kraków)</h4>
                                    <p className="text-[12px] font-medium text-red-900/60 mt-2 leading-relaxed">
                                        Wypadek mostu: Sektor Kraków-Wschód odcięty. 18 kurierów unieruchomionych. 510 okien 15-min zagrożonych.
                                    </p>
                                    <div className="flex gap-2 mt-5">
                                        <Button className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl border-0 shadow-lg shadow-red-200">Uruchom Tryb Awaryjny (Macro)</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PLANNING & VOLUME (PREVIEW) */}
                        <div className="bg-leo-primary/5 rounded-[40px] p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <BrainCircuit className="w-5 h-5 text-leo-primary" />
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 italic">Planowanie Jutro</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="text-[11px] font-black uppercase text-gray-400">Predykcja Wolumenu</div>
                                    <div className="text-xl font-black text-gray-900 italic">+12.5% vs Śr</div>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-leo-primary w-[82%]" />
                                </div>
                                <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-tight">
                                    System sugeruje otwarcie 3 rezerwowych rejonów i uruchomienie 2 dodatkowych Partnerów Flotowych.
                                </p>
                                <Button className="w-full h-14 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Szczegóły Modelu Planistycznego</Button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* 3. Tactical Map / Visualization Area */}
                <section className="flex-1 relative h-[calc(100vh-84px)] bg-[#E9ECEF]">
                    {/* MAP LAYERS CONTROL */}
                    <div className="absolute top-8 left-8 z-[60] flex flex-col gap-2">
                        <div className="bg-white/90 backdrop-blur-xl p-2 rounded-3xl shadow-2xl border border-white flex flex-col gap-1">
                            {[
                                { id: 'couriers', icon: Truck, label: 'Kurierzy Live' },
                                { id: 'regions', icon: Layers, label: 'Dynamiczne Rejony' },
                                { id: 'heatmap', icon: Activity, label: 'Mapa Tarć (Cieplna)' },
                                { id: 'warehouse', icon: Factory, label: 'Huby i Przepustowość' },
                                { id: 'customer', icon: MessageSquare, label: 'Plan B / Zwroty' },
                            ].map((layer) => (
                                <button
                                    key={layer.id}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-all group"
                                >
                                    <layer.icon className="w-4 h-4 text-gray-400 group-hover:text-leo-primary transition-colors" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{layer.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* MAP GRAPHICS (SIMULATED MACRO VIEW) */}
                    <div className="absolute inset-0 bg-[#DDE1E4]">
                        {/* Map background (Warsaw / Poland scale) */}
                        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_Warsaw.png')", backgroundSize: 'cover' }} />

                        {/* Heatmap effect */}
                        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-red-500/10 blur-[100px] animate-pulse" />
                        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-orange-500/10 blur-[80px]" />

                        {/* Dynamic Region Borders (Hypothetical) */}
                        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                            <path d="M100,100 L400,150 L600,400 L500,600 L150,550 Z" fill="rgba(8, 23, 58, 0.05)" stroke="rgba(8, 23, 58, 0.2)" strokeWidth="2" strokeDasharray="10 5" />
                            <path d="M500,100 L800,200 L900,500 L700,700 L400,600 Z" fill="rgba(255, 107, 0, 0.02)" stroke="rgba(255, 107, 0, 0.1)" strokeWidth="2" />
                        </svg>

                        {/* Live Points */}
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-[42%] left-[38%] h-12 w-12 bg-red-600 rounded-full border-[6px] border-white shadow-2xl flex items-center justify-center group cursor-pointer">
                            <ShieldCheck className="w-5 h-5 text-white" />
                            <div className="absolute -top-12 bg-black text-white text-[10px] font-black uppercase px-3 py-2 rounded-xl scale-0 group-hover:scale-100 transition-transform whitespace-nowrap">ALARM: KR-ZACHOD</div>
                        </motion.div>
                    </div>

                    {/* BOTTOM MASTER HUD */}
                    <div className="absolute bottom-10 left-10 right-10 z-[60] flex gap-6">
                        {/* Operational Flow (Global Newsfeed) */}
                        <div className="flex-1 bg-black/90 backdrop-blur-3xl rounded-[40px] border border-white/10 p-8 flex items-center justify-between text-white shadow-2xl">
                            <div className="flex items-center gap-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-leo-primary/10 rounded-[24px]">
                                        <Megaphone className="w-6 h-6 text-leo-primary" />
                                    </div>
                                    <div className="h-10 w-[1px] bg-white/10" />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Kanał Operacyjny Global (Live)</div>
                                    <div className="flex items-center gap-4 font-mono">
                                        <span className="text-leo-primary text-[11px] font-black">10:58</span>
                                        <span className="text-[14px] font-bold uppercase italic tracking-tight">System: Inicjacja planu rotacji wolumenu dla Hubu Kraków-Południe.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button className="h-14 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-widest px-8">Komenda Ogólna</Button>
                                <Button className="h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-widest px-8 hover:bg-white/10">Logi Audytu</Button>
                            </div>
                        </div>

                        {/* Tactical Quick Access */}
                        <div className="w-[300px] flex flex-col gap-3">
                            <Button className="h-full bg-leo-primary text-black rounded-[40px] flex flex-col items-center justify-center gap-2 group border-0 shadow-xl shadow-leo-primary/20">
                                <Activity className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-widest">Wymuś Re-Sync Trasy</span>
                            </Button>
                        </div>
                    </div>

                    {/* MAP NAVIGATION HUD */}
                    <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-3 z-[60]">
                        <Button size="icon" className="h-[60px] w-[60px] rounded-[24px] bg-white shadow-2xl border-0 text-gray-400 hover:text-leo-primary"><ZoomIn className="w-6 h-6" /></Button>
                        <Button size="icon" className="h-[60px] w-[60px] rounded-[24px] bg-white shadow-2xl border-0 text-gray-400 hover:text-leo-primary"><ZoomOut className="w-6 h-6" /></Button>
                        <Button size="icon" className="h-[60px] w-[60px] rounded-[24px] bg-white shadow-2xl border-0 text-gray-400 hover:text-leo-primary mt-6"><Maximize className="w-6 h-6" /></Button>
                        <Button size="icon" className="h-[60px] w-[60px] rounded-[24px] bg-white shadow-2xl border-0 text-gray-400 hover:text-leo-primary"><Globe className="w-6 h-6" /></Button>
                    </div>
                </section>
            </main>

            {/* SETTINGS MODAL */}
            <AnimatePresence>
                {showSettings && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSettings(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[40px] w-full max-w-md p-10 relative z-10 shadow-2xl border border-gray-100"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1 text-black">
                                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Informacje o <span className="text-leo-primary">Systemie</span></h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">LEO Protocol v3.0.4 - B2B Edition</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)} className="rounded-full h-10 w-10 bg-gray-50 hover:bg-gray-100 text-black">
                                    <XIcon className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="space-y-8">
                                <section className="space-y-4">
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                                                <Box className="w-6 h-6 text-leo-primary" />
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-black uppercase italic tracking-tight text-gray-900">LEO B2B Core</div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-leo-primary">Macro-Operational Standard</div>
                                            </div>
                                        </div>
                                        <p className="text-[12px] font-medium text-gray-500 leading-relaxed uppercase tracking-tight">
                                            Skalowalne rozwiązanie dla operatorów logistycznych, pozwalające na zarządzanie miastem w czasie rzeczywistym.
                                        </p>
                                    </div>

                                    <div className="p-6 bg-leo-primary/5 rounded-3xl border border-leo-primary/10 space-y-3">
                                        <div className="text-[11px] font-black uppercase tracking-[0.2em] text-leo-primary">Design & Execution</div>
                                        <div className="text-[20px] font-black font-mono tracking-tighter text-gray-900 uppercase">lukilot.work</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Digital Architect & Automation Master</div>
                                    </div>
                                </section>

                                <div className="text-center">
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300">
                                        LEO B2B • Vision 2026 • Optimized by Intelligence
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Background Grain/Grid */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "48px 48px" }} />
        </div>
    );
}

function XIcon({ className, ...props }: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
