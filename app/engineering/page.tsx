"use client";

import { useState, useEffect } from "react";
import {
    Activity, BarChart3, Database, Globe, Cpu, Zap,
    ArrowUpRight, ArrowDownRight, TrendingUp, Network,
    BrainCircuit, FlaskConical, Target, ShieldCheck,
    Code2, Terminal, Filter, RefreshCw, Layers, PieChart,
    ChevronRight, Loader2, Gauge, Settings, ShieldAlert,
    Atom, Share2, Binary, Search, Play, FileCode, Beaker,
    AlertTriangle, Server, HardDrive, MousePointer2, Info, User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EngineeringTab = 'neurons' | 'stability' | 'decisions' | 'data' | 'regions' | 'lab' | 'performance';

export default function EngineeringPanel() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<EngineeringTab>('neurons');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedNeuron, setSelectedNeuron] = useState<string | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        setTimeout(() => setLoading(false), 1200);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-mono">
                <div className="relative mb-12">
                    <div className="w-24 h-24 border-2 border-leo-primary/10 rounded-full animate-ping absolute inset-0" />
                    <Atom className="w-24 h-24 text-leo-primary animate-[spin_4s_linear_infinite]" />
                </div>
                <div className="space-y-4 text-center">
                    <p className="text-[12px] text-leo-primary font-black tracking-[0.6em] uppercase animate-pulse">Initializing LEO DeepMind Mesh</p>
                    <div className="flex gap-1 justify-center">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 bg-leo-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-leo-primary/10 overflow-x-hidden pt-24">
            {/* MATRIX GRID OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            {/* TACTICAL TOP NAV */}
            <header className="px-10 py-6 fixed top-0 left-0 right-0 z-[100] bg-black/40 backdrop-blur-3xl border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.href = '/'}>
                        <div className="w-10 h-10 bg-leo-primary rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)] group-hover:scale-110 transition-transform">
                            <Binary className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tighter italic">LEO <span className="text-leo-primary">ENGINEERING NODE</span></h1>
                            <div className="text-[8px] font-bold text-leo-primary/60 tracking-[0.2em] mt-0.5">CORE OBSERVABILITY & OPTIMIZATION LAYER</div>
                        </div>
                    </div>

                    <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 ml-4">
                        {[
                            { id: 'neurons', label: 'Neurony', icon: Atom },
                            { id: 'stability', label: 'Stabilność', icon: Target },
                            { id: 'decisions', label: 'Decyzje', icon: BrainCircuit },
                            { id: 'data', label: 'Address Intel', icon: Globe },
                            { id: 'lab', label: 'Sandbox (A/B)', icon: Beaker },
                            { id: 'performance', label: 'Wydajność', icon: Gauge },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as EngineeringTab)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[10px] uppercase font-black tracking-widest",
                                    activeTab === tab.id ? "bg-leo-primary text-black" : "text-white/40 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                <span className="hidden xl:inline">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                        <div className="text-[14px] font-black tracking-tighter text-leo-primary">{currentTime.toLocaleTimeString('pl-PL')}</div>
                        <div className="text-[8px] text-white/20 uppercase tracking-widest font-black">Latency: 12.4ms • node-wa-01</div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 p-10 max-w-[1920px] mx-auto">
                <AnimatePresence mode="wait">
                    {/* 1. NEURAL MAP VIEW */}
                    {activeTab === 'neurons' && (
                        <motion.div
                            key="neurons" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-12 gap-10"
                        >
                            <div className="col-span-12 xl:col-span-8 flex flex-col gap-10">
                                <section className="h-[600px] bg-white/[0.02] rounded-[40px] border border-white/5 p-10 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-leo-primary/[0.03] to-transparent" />

                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="space-y-4">
                                            <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-leo-primary shadow-leo-primary/20 shadow-sm">Live Neuron Mesh Visualization</h2>
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest max-w-md">Interaktywny widok procesów decyzyjnych w klastrze WWA. Każdy impuls to korekta wykonana przez silnik optymalizacji.</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-leo-primary">Moc Obliczeniowa: 82.4%</div>
                                            <div className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-green-500">Decyzje/Min: 1,420</div>
                                        </div>
                                    </div>

                                    {/* NEURAL NETWORK VISUALIZER (MOCK SVG/Framer) */}
                                    <div className="absolute inset-x-0 bottom-0 top-32 flex items-center justify-center">
                                        <div className="relative w-full h-full">
                                            {[...Array(8)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                    style={{
                                                        left: `${20 + Math.random() * 60}%`,
                                                        top: `${20 + Math.random() * 60}%`
                                                    }}
                                                    className="absolute"
                                                >
                                                    <div className="w-12 h-12 bg-leo-primary/5 border border-leo-primary/20 rounded-full flex items-center justify-center group cursor-pointer hover:bg-leo-primary/20 transition-all hover:scale-125">
                                                        <Atom className="w-6 h-6 text-leo-primary group-hover:text-white" />
                                                        <div className="absolute -bottom-6 text-[8px] font-bold text-white/40 opacity-0 group-hover:opacity-100 uppercase tracking-widest">Neuron_ {0x1A2 + i}</div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                                                <defs>
                                                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#FFD700" stopOpacity="0" />
                                                        <stop offset="50%" stopColor="#FFD700" stopOpacity="1" />
                                                        <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                                <path d="M 300 400 Q 500 200 700 450" stroke="url(#lineGrad)" strokeWidth="1" fill="transparent" />
                                                <path d="M 200 100 Q 400 300 600 150" stroke="url(#lineGrad)" strokeWidth="1" fill="transparent" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-10 left-10 p-6 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 max-w-sm space-y-4">
                                        <div className="flex items-center gap-3">
                                            <ShieldAlert className="w-4 h-4 text-leo-primary" />
                                            <h4 className="text-[11px] font-black uppercase tracking-widest">Aktywny Impuls</h4>
                                        </div>
                                        <p className="text-[10px] text-white/60 leading-relaxed uppercase tracking-tight">Korekta strefy WWA-C-19: Wykryto błąd adresu kuriera LEO-442. Automatyczny re-routing 12 paczek.</p>
                                    </div>
                                </section>

                                <div className="grid grid-cols-2 gap-10">
                                    <div className="bg-white/[0.02] rounded-[40px] border border-white/5 p-8 space-y-6">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Najciężej pracujące klastry</h3>
                                        <div className="space-y-4">
                                            {['WWA-Centrum', 'WWA-Mokotów', 'WWA-Wola'].map((area, i) => (
                                                <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                                    <span className="text-[12px] font-black uppercase italic">{area}</span>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-leo-primary" style={{ width: `${90 - i * 15}%` }} />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-leo-primary">{90 - i * 15}% Load</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white/[0.02] rounded-[40px] border border-white/5 p-8 space-y-6">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Główne czynniki decyzji (%)</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: 'Ruch Live', val: 42 },
                                                { label: 'Gabaryt', val: 21 },
                                                { label: 'Preferencja IPO', val: 18 },
                                                { label: 'Plan B Risk', val: 19 },
                                            ].map((factor, i) => (
                                                <div key={i} className="p-4 bg-black rounded-2xl border border-white/5 text-center">
                                                    <div className="text-[20px] font-black italic">{factor.val}%</div>
                                                    <div className="text-[8px] text-white/40 uppercase tracking-widest mt-1">{factor.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-12 xl:col-span-4 space-y-10">
                                <section className="bg-leo-primary rounded-[40px] p-10 text-black space-y-8 shadow-[0_0_50px_rgba(255,215,0,0.2)]">
                                    <div>
                                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40">Global Quality Index</h2>
                                        <div className="text-6xl font-black italic tracking-tighter mt-4">98.24%</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest border-b border-black/10 pb-2">
                                            <span>Algorytm Terminology</span>
                                            <span>SLA: 100%</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <div className="text-2xl font-black italic">99.2%</div>
                                                <div className="text-[8px] font-bold uppercase tracking-widest opacity-60">1st Attempt Success</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-black italic">14.1m</div>
                                                <div className="text-[8px] font-bold uppercase tracking-widest opacity-60">Avg Time @ Door</div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white/[0.02] rounded-[40px] border border-white/5 p-8 space-y-6">
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic">Deep Intelligence Feed</h2>
                                    <div className="space-y-4 font-mono text-[9px] text-white/30">
                                        <div className="flex gap-3 p-3 bg-white/[0.01] rounded-lg">
                                            <span className="text-leo-primary">[SYS]</span>
                                            <span>Optimizing Cluster WWA-42: High retry probability detected. Transitioning to 'Safe Path' protocol.</span>
                                        </div>
                                        <div className="flex gap-3 p-3 bg-white/[0.01] rounded-lg">
                                            <span className="text-leo-primary">[DEC]</span>
                                            <span>Decision Node 0x921 rerouted LEO-01 due to temporary road block (Street Repair). Savings: +4.2km.</span>
                                        </div>
                                        <div className="flex gap-3 p-3 bg-white/[0.01] rounded-lg">
                                            <span className="text-red-500">[ERR]</span>
                                            <span>Anomaly detected in Rejon S04. Correction rate increased by 220%. Inspecting Address Data...</span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    )}

                    {/* 2. STABILITY VIEW */}
                    {activeTab === 'stability' && (
                        <motion.div
                            key="stability" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-12 gap-10"
                        >
                            <div className="col-span-12 xl:col-span-4 space-y-10">
                                <section className="bg-white/[0.02] rounded-[40px] border border-white/5 p-10 space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-leo-primary">Stability Index</h3>
                                        <Target className="w-6 h-6 text-leo-primary" />
                                    </div>
                                    <div className="text-7xl font-black italic tracking-tighter">84/100</div>
                                    <p className="text-[11px] text-white/40 uppercase tracking-tight leading-relaxed font-bold italic">
                                        Wskaźnik mierzy "emocjonalność" algorytmu. Wysoki wynik oznacza stabilną trasę bez niepotrzebnych przetasowań.
                                    </p>
                                    <div className="grid gap-3 pt-4">
                                        <div className="flex justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl items-center">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-white/40">Korekty na trasę</span>
                                            <span className="text-[14px] font-black">2.4</span>
                                        </div>
                                        <div className="flex justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl items-center">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-white/40">Zmiana kolejności stóp</span>
                                            <span className="text-[14px] font-black text-red-500">14%</span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className="col-span-12 xl:col-span-8 bg-white/[0.02] rounded-[40px] border border-white/5 p-10 flex flex-col">
                                <div className="flex justify-between items-end mb-10">
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Plan Statyczny vs Korekty Dynamiczne</h3>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2">Deltatywna analiza wpływu korekt na KPI operacyjne</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-white/20 rounded-full" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Plan Pierwotny</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-leo-primary rounded-full" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Wersja Optymalizowana</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-12">
                                    {[
                                        { label: 'Kilometry', base: '42km', opt: '38km', impact: '-10.4%', good: true },
                                        { label: 'Czas trasy', base: '7.2h', opt: '6.8h', impact: '-5.2%', good: true },
                                        { label: 'Okno 15-min (Hit Rate)', base: '82%', opt: '94%', impact: '+12%', good: true },
                                        { label: 'Stabilność emocjonalna', base: '100%', opt: '84%', impact: '-16%', good: false },
                                    ].map((metric, i) => (
                                        <div key={i} className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[11px] font-black uppercase tracking-widest">{metric.label}</span>
                                                <span className={cn("text-[14px] font-black italic", metric.good ? "text-green-500" : "text-red-500")}>{metric.impact} impact</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1 px-4">
                                                <div className="h-6 bg-white/5 rounded-l-full relative">
                                                    <div className="absolute inset-y-0 left-0 bg-white/20 rounded-l-full" style={{ width: '100%' }} />
                                                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black uppercase">{metric.base}</span>
                                                </div>
                                                <div className="h-6 bg-leo-primary/10 rounded-r-full relative">
                                                    <div className="absolute inset-y-0 left-0 bg-leo-primary rounded-r-full opacity-60" style={{ width: metric.good ? '90%' : '110%' }} />
                                                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black uppercase text-black">{metric.opt}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 3. EXPLAINABILITY VIEW */}
                    {activeTab === 'decisions' && (
                        <motion.div
                            key="decisions" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                            className="bg-white/[0.02] rounded-[40px] border border-white/5 p-12 space-y-12"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">Wyjaśnialność Decyzji LEO</h2>
                                    <p className="text-[12px] text-white/40 uppercase tracking-widest mt-2 px-1">Dlaczego system podjął taką decyzję? Dekompozycja czynników 0x422_Opt</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 text-right">
                                    <div className="text-[10px] font-black text-leo-primary uppercase tracking-[0.3em]">Decision Node ID: LEO-2991-A</div>
                                    <div className="text-[24px] font-black italic uppercase">Re-Routing Kuriera 01</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-12">
                                <div className="col-span-12 lg:col-span-5 space-y-10">
                                    <div className="space-y-6">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 border-b border-white/10 pb-4">Top 5 Powodów (Influence Rank)</h3>
                                        <div className="space-y-6">
                                            {[
                                                { reason: "Wykryto korek (+7 min na trasie)", influence: 42, icon: AlertTriangle },
                                                { reason: "Preferencja IPO: Plan B w punkcie", influence: 28, icon: User },
                                                { reason: "Gabaryt: Brak miejsca w LEO-01 (Overflow)", influence: 15, icon: Layers },
                                                { reason: "Prognoza braku windy (Rejon S09)", influence: 10, icon: TrendingUp },
                                                { reason: "Ryzyko braku odbiorcy > 60%", influence: 5, icon: ShieldAlert },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:bg-leo-primary group-hover:text-black transition-all">
                                                            <item.icon className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-[13px] font-black uppercase italic tracking-tight text-white/80 group-hover:text-white">{item.reason}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[18px] font-black text-leo-primary italic">{item.influence}%</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-12 lg:col-span-7 flex flex-col gap-10">
                                    <div className="bg-black border border-white/5 rounded-3xl p-8 space-y-8 flex-1">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[11px] font-black uppercase tracking-widest text-white/40 italic">Odrzucone Alternatywy</h4>
                                            <Share2 className="w-4 h-4 text-white/20" />
                                        </div>
                                        <div className="grid gap-4">
                                            {[
                                                { plan: 'Wariant B: Pozostawienie trasy bez zmian', cost: '+12km / -8% SLA', logic: 'Za duże ryzyko opóźnienia okna klienta Premium.' },
                                                { plan: 'Wariant C: Przekazanie do kuriera LEO-02', cost: '+PLN 42.00 / 08m delay', logic: 'Wysoki koszt jednostkowy przy małym uzysku czasowym.' }
                                            ].map((alt, i) => (
                                                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-[12px] font-black uppercase italic text-white/80">{alt.plan}</span>
                                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{alt.cost}</span>
                                                    </div>
                                                    <p className="text-[10px] text-white/40 italic uppercase leading-relaxed tracking-tight">Logic Reject: {alt.logic}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-leo-primary/5 border border-leo-primary/20 rounded-3xl p-8 flex items-start gap-6">
                                        <div className="w-12 h-12 bg-leo-primary rounded-xl flex items-center justify-center text-black shadow-lg">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-[14px] font-black uppercase text-leo-primary tracking-tighter italic">Reguła Twarda (Hard Constraint)</h4>
                                            <p className="text-[11px] text-white/60 uppercase tracking-tight italic mt-2 leading-relaxed">
                                                Obowiązkowe doręczenie IPO w oknie 15-min dla klienta GOLD. Algorytm nie może naruszyć tej reguły niezależnie od przebiegu kilometrów.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 4. ADDRESS INTEL VIEW */}
                    {activeTab === 'data' && (
                        <motion.div
                            key="data" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                            className="grid grid-cols-12 gap-10"
                        >
                            <div className="col-span-12 xl:col-span-7 bg-white/[0.02] rounded-[40px] border border-white/5 p-12 space-y-12">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Address Intelligence & Data Quality</h2>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2">Gdzie system traci czas przez bałagan wejściowy?</p>
                                    </div>
                                    <Globe className="w-10 h-10 text-leo-primary opacity-20" />
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <div className="p-8 bg-black border border-white/5 rounded-3xl space-y-6">
                                        <div className="text-[11px] font-black uppercase tracking-widest text-white/40">Incomplete Addresses</div>
                                        <div className="text-5xl font-black italic text-red-500">12.4%</div>
                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            {['Brak numeru domu', 'Błędny kod pocztowy', 'Brak numeru klatki'].map((err, i) => (
                                                <div key={i} className="flex justify-between items-center text-[10px] uppercase font-bold text-white/40 leading-none">
                                                    <span>{err}</span>
                                                    <span className="text-white">{18 - i * 5}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-8 bg-black border border-white/5 rounded-3xl space-y-6">
                                        <div className="text-[11px] font-black uppercase tracking-widest text-white/40">Auto-Correction (AI Repair)</div>
                                        <div className="text-5xl font-black italic text-green-500">88.2%</div>
                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <p className="text-[9px] text-white/40 italic uppercase leading-relaxed font-bold">
                                                Skuteczność automatycznego uzupełniania danych na bazie historycznych dostaw IPO LEO.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <section className="space-y-6">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 italic">Korelacja: Błędy danych &rarr; KPI Operacyjne</h3>
                                    <div className="grid grid-cols-3 gap-6">
                                        {[
                                            { label: 'Nieudane Próby', impact: '+22%', status: 'HIGH' },
                                            { label: 'Czas "Pod Drzwiami"', impact: '+4.2m', status: 'MID' },
                                            { label: 'Reklamacje CX', impact: '+15%', status: 'HIGH' }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center space-y-2">
                                                <div className="text-[14px] font-black italic text-red-500">{stat.impact}</div>
                                                <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="col-span-12 xl:col-span-5 space-y-10">
                                <section className="bg-white/[0.02] rounded-[40px] border border-white/5 p-10 space-y-8">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Dopasowanie Kurier-Rejon</h3>
                                    <div className="space-y-8">
                                        <div className="bg-black/40 p-10 rounded-3xl text-center space-y-4 border border-leo-primary/10 shadow-[inset_0_0_30px_rgba(255,215,0,0.05)]">
                                            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-leo-primary mb-4">Mój Rejon Coverage</div>
                                            <div className="text-5xl font-black italic italic">92.4%</div>
                                            <p className="text-[9px] text-white/40 uppercase tracking-widest italic font-bold">Stopy obsługiwane przez "Swojego" kuriera</p>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex gap-6 items-start">
                                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                                                <div className="space-y-2">
                                                    <h5 className="text-[11px] font-black uppercase text-red-500 tracking-widest italic">Wykryto niedopasowanie: Rejon WWA-S</h5>
                                                    <p className="text-[10px] text-white/40 italic uppercase leading-relaxed font-bold">Wysłanie kuriera LEO-192 w obcy rejon spowodowało wzrost czasu "Pod Drzwiami" o 8 minut / stop.</p>
                                                </div>
                                            </div>
                                            <Button className="w-full h-14 rounded-2xl bg-white/5 text-white border border-white/10 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 italic">Wygeneruj Rekomendacje Obsady <ArrowUpRight className="w-4 h-4 ml-2" /></Button>
                                        </div>
                                    </div>
                                </section>

                                <section className="p-10 bg-leo-primary rounded-[40px] text-black">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40">Address Intel Recommendations</h3>
                                    <div className="mt-8 space-y-6">
                                        <div className="p-4 bg-black/5 rounded-xl border border-black/10">
                                            <p className="text-[12px] font-black uppercase italic leading-tight">Uruchom korektę masową dla klastra Wola: Wykryto 42 błędne kody pocztowe w nowej inwestycji.</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1 p-4 bg-black/5 rounded-xl border border-black/10 text-center">
                                                <div className="text-xl font-black italic">4.2k</div>
                                                <div className="text-[8px] uppercase font-black opacity-40">Adresów naprawionych dziś</div>
                                            </div>
                                            <div className="flex-1 p-4 bg-black/5 rounded-xl border border-black/10 text-center">
                                                <div className="text-xl font-black italic">120h</div>
                                                <div className="text-[8px] uppercase font-black opacity-40">Zaoszczędzonego czasu</div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    )}

                    {/* 5. LAB (SIMULATIONS & AB) VIEW */}
                    {activeTab === 'lab' && (
                        <motion.div
                            key="lab" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white/[0.02] rounded-[40px] border border-white/5 p-12 space-y-12"
                        >
                            <div className="flex justify-between items-center">
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter italic italic">Laboratorium Optymalizacji LEO</h2>
                                    <div className="flex gap-4">
                                        <div className="px-4 py-2 bg-leo-primary/10 border border-leo-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-leo-primary flex items-center gap-2">
                                            <Beaker className="w-4 h-4" /> Lab Environment: Active
                                        </div>
                                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4" /> Replay Base: WWA-MESH-7D
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button className="h-16 px-10 rounded-3xl bg-leo-primary text-black font-black uppercase tracking-widest text-[12px] italic border-0 shadow-2xl shadow-leo-primary/20">Nowa Symulacja <Play className="w-5 h-5 ml-3" /></Button>
                                    <Button variant="ghost" className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10"><Settings className="w-6 h-6" /></Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-12">
                                <section className="col-span-12 lg:col-span-4 bg-black rounded-[40px] border border-white/5 p-10 space-y-8">
                                    <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 italic mb-8">Scenariusze Stress-Testów</h3>
                                    <div className="grid gap-4">
                                        {[
                                            { name: 'X-TREME PEAK (+200%)', icon: Zap, status: 'READY', desc: 'Symulacja świątecznego szczytu paczkowego.' },
                                            { name: 'HUB DOWN (WWA-01 FAIL)', icon: AlertTriangle, status: 'READY', desc: 'Awaria sortowni, konieczny re-routing na inne huby.' },
                                            { name: 'STREAK RAIN / SNOW', icon: Globe, status: 'RUNNING', desc: 'Tempo kurierów spada o 25% na stop.' },
                                            { name: 'NO-COURIERS (STRIKE)', icon: User, status: 'READY', desc: 'Rezygnacja 40% floty w jednym rejonie.' }
                                        ].map((item, i) => (
                                            <div key={i} className="group p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 hover:border-leo-primary/40 transition-all cursor-pointer">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-4">
                                                        <item.icon className="w-5 h-5 text-white/20 group-hover:text-leo-primary" />
                                                        <span className="text-[13px] font-black uppercase tracking-tight italic group-hover:text-leo-primary">{item.name}</span>
                                                    </div>
                                                    <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest", item.status === 'RUNNING' ? 'bg-leo-primary text-black' : 'bg-white/5 text-white/40')}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-white/40 uppercase tracking-widest italic font-bold leading-relaxed">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="col-span-12 lg:col-span-8 space-y-12">
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 space-y-10">
                                        <div className="flex justify-between items-end border-b border-white/5 pb-8">
                                            <div>
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic">Eksperyment A/B (Ranking Model v3.2 vs v3.4)</h4>
                                                <h5 className="text-2xl font-black uppercase tracking-tighter italic mt-2">Czy nowa metoda optymalizacji redukuje km?</h5>
                                            </div>
                                            <div className="px-6 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest italic">Rekomendacja: WDRÓŻ Model v3.4</div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-12">
                                            <div className="space-y-6">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Wersja A (Control)</div>
                                                <div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-8">
                                                    <div className="flex justify-between items-end">
                                                        <div className="text-3xl font-black">412 km</div>
                                                        <div className="text-[9px] font-black text-white/40 italic uppercase tracking-widest">Global Distance</div>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <div className="text-3xl font-black">94.2%</div>
                                                        <div className="text-[9px] font-black text-white/40 italic uppercase tracking-widest">SLA Hit Rate</div>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <div className="text-[16px] font-black italic">1.2s</div>
                                                        <div className="text-[9px] font-black text-white/40 italic uppercase tracking-widest">Compute Cost</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-leo-primary italic">Wersja B (Challenger)</div>
                                                <div className="p-8 bg-leo-primary/5 rounded-3xl border border-leo-primary/20 space-y-8 shadow-[0_0_30px_rgba(255,215,0,0.05)]">
                                                    <div className="flex justify-between items-end">
                                                        <div className="text-3xl font-black text-leo-primary italic">382 km</div>
                                                        <div className="text-[9px] font-black text-white/40 italic uppercase tracking-widest">Global Distance</div>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <div className="text-3xl font-black text-leo-primary italic">96.8%</div>
                                                        <div className="text-[9px] font-black text-white/40 italic uppercase tracking-widest">SLA Hit Rate</div>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <div className="text-[16px] font-black italic text-red-500">2.4s</div>
                                                        <div className="text-[9px] font-black text-white/40 italic uppercase tracking-widest">Compute Cost</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-white/[0.01] rounded-2xl border border-white/5 font-mono text-[10px] text-white/20 uppercase tracking-widest leading-relaxed">
                                            Summary: Model v3.4 redukuje przebieg o 7.2% przy jednoczesnej poprawie SLA o 2.6%. Koszt obliczeń wzrósł o 100%, ale benefity operacyjne (paliwo, czas) przewyższają koszty infrastrukturalne o rzędy wielkości.
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    )}

                    {/* 6. PERFORMANCE & COST VIEW */}
                    {activeTab === 'performance' && (
                        <motion.div
                            key="performance" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
                            className="grid grid-cols-12 gap-10"
                        >
                            <div className="col-span-12 xl:col-span-4 space-y-10">
                                <section className="bg-white/[0.02] border border-white/5 rounded-[40px] p-12 space-y-10">
                                    <div>
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Cost per Decision</h3>
                                        <div className="text-5xl font-black italic mt-4 text-leo-primary">0.024 PLN</div>
                                    </div>
                                    <div className="space-y-8 pt-10 border-t border-white/5">
                                        {[
                                            { label: 'Compute Load (Peak)', val: '14.2 GFLOPs', icon: Gauge },
                                            { label: 'Memory Grid Usage', val: '42.8 GB', icon: HardDrive },
                                            { label: 'Event Queue Latency', val: '12ms', icon: Activity }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center group">
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="w-4 h-4 text-white/20 group-hover:text-leo-primary" />
                                                    <span className="text-[10px] uppercase font-black tracking-widest text-white/40 group-hover:text-white transition-colors">{item.label}</span>
                                                </div>
                                                <span className="text-[14px] font-black italic">{item.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="col-span-12 xl:col-span-8 space-y-10">
                                <section className="bg-black rounded-[40px] border border-white/5 p-12 space-y-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
                                        <Server className="w-48 h-48" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter italic">Infra Performance & Efficiency Tracker</h3>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2">Dbanie o to, by system nie przepalał infrastruktury niepotrzebnie.</p>
                                    </div>
                                    <div className="h-[300px] flex items-end gap-1.5 px-4 bg-white/[0.01] rounded-3xl border border-white/[0.02] p-8">
                                        {[...Array(40)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${20 + Math.random() * 60}%` }}
                                                className={cn(
                                                    "flex-1 rounded-t-[2px] transition-colors",
                                                    i > 30 ? "bg-red-500/40" : i > 20 ? "bg-leo-primary/60" : "bg-white/10"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between p-8 bg-leo-primary text-black rounded-3xl">
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Global Infrastructure ROI</div>
                                            <div className="text-3xl font-black italic mt-1">+420% efficiency vs baseline</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Saved Infra Costs</div>
                                            <div className="text-3xl font-black italic mt-1">12k PLN / Mo</div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* ENGINEERING FOOTER CREDITS */}
            <div className="fixed bottom-10 left-10 text-[9px] font-black uppercase tracking-[0.4em] text-white/20 z-[100] sm:block hidden">
                LEO ENGINEERING NODE • VISION 2026 • DARK OPS MESH • [KERNEL: 0x44]
            </div>

            <div className="fixed bottom-10 right-10 z-[100] sm:block hidden">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-leo-primary opacity-40 italic">Design and execution by lukilot.work</p>
            </div>

            {/* Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03] select-none" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
        </div>
    );
}
