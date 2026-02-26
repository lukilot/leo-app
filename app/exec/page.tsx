"use client";

import { useState, useEffect } from "react";
import {
    Activity, TrendingUp, AlertTriangle, ShieldCheck, Map,
    ChevronRight, Zap, Bell, CheckCircle2, MessageSquare,
    ArrowUpRight, Target, BrainCircuit, BarChart3, Settings,
    FileText, ZapOff, Sparkles, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ExecutiveMobile() {
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showDecisionModal, setShowDecisionModal] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        setTimeout(() => setLoading(false), 1200);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-16 h-16 border-4 border-leo-primary border-t-transparent rounded-full mb-8"
                />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-leo-primary italic">Inicjalizacja Protokołu Executive...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-leo-primary/10 pb-32">
            {/* HIGH-LEVEL HUD HEADER */}
            <header className="px-6 pt-16 pb-6 sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic italic">LEO <span className="text-leo-primary">EXECUTIVE</span></h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Network Health: Optimal</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[20px] font-black font-mono tracking-tighter text-leo-primary">{currentTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">Warsaw Control Hub</div>
                </div>
            </header>

            <main className="px-6 pt-8 space-y-10">
                {/* 1. HEALTH OF OPERATIONS: 60-SEC INSIGHT */}
                <section className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Zdrowie Operacji (Dziś)</h2>
                        <span className="text-[9px] font-black text-leo-primary uppercase tracking-widest">Live Updates</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-[32px] p-6 border border-white/10 space-y-2">
                            <div className="flex justify-between items-start">
                                <Target className="w-5 h-5 text-leo-primary" />
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="text-3xl font-black tracking-tighter">98.2%</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-white/40 leading-tight">Okna 15-min<br />(Terminowość)</div>
                        </div>
                        <div className="bg-white/5 rounded-[32px] p-6 border border-white/10 space-y-2">
                            <div className="flex justify-between items-start">
                                <CheckCircle2 className="w-5 h-5 text-leo-primary" />
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="text-3xl font-black tracking-tighter">94.8%</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-white/40 leading-tight">First Attempt<br />(Skuteczność)</div>
                        </div>
                    </div>
                    <div className="bg-red-950/20 rounded-[32px] p-6 border border-red-900/30 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20">
                                <AlertTriangle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-2xl font-black tracking-tighter leading-none">04</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-red-500 opacity-80 mt-1">Opóźnienia Krytyczne</div>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-red-500 hover:bg-red-500/10">Szczegóły <ChevronRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                </section>

                {/* 2. RISK MAP VISUALIZATION */}
                <section className="space-y-4">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Mapa Ryzyk i Kosztów</h2>
                    <div className="h-[220px] bg-white/5 rounded-[40px] border border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/21.01,52.23,11/400x300?access_token=pk.eyJ1IjoibHVraWxvdCIsImEiOiJjbHR2eGZ6Z3EwM3BzMmpvMnV4NmV4NmV4In0.m5e5e5e5e5e5e5e5e5e5')] bg-cover bg-center grayscale contrast-125" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                        {/* Heatmap Overlays */}
                        <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-red-600/40 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-red-500/30 rounded-full blur-2xl" />

                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end backdrop-blur-md bg-black/40 p-4 rounded-3xl border border-white/5">
                            <div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-red-500 mb-1">Alert: Wola Północ</div>
                                <div className="text-[14px] font-bold text-white">Przeciążenie Sektora 04</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Koszt Operacyjny</div>
                                <div className="text-[14px] font-bold text-leo-primary">+12.4% vs Plan</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. TOP 5 ISSUES & RECS */}
                <section className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Inteligencja Systemu</h2>
                        <div className="bg-leo-primary/10 text-leo-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-leo-primary/20">
                            <BrainCircuit className="w-3 h-3" /> Gen-AI Active
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            { title: "Zator w HUB WWA-01", type: "ISSUE", severity: "HIGH", rec: "Uruchom Bramy Zapasowe (G05-G07)" },
                            { title: "Deficyt Kurierów (Włochy)", type: "ISSUE", severity: "MID", rec: "Przesunięcie 2 aut z Mokotowa" },
                            { title: "Warunki: Gołoledź", type: "STATUS", severity: "WARN", rec: "Automatyczne wydłużenie okien o 6 min" }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 rounded-3xl p-5 border border-white/10 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-[14px] uppercase tracking-tight text-white/90">{item.title}</h4>
                                    <span className={cn(
                                        "text-[8px] font-black px-2 py-0.5 rounded-full border tracking-widest",
                                        item.severity === 'HIGH' ? "border-red-500 text-red-500 bg-red-500/10" : "border-leo-primary text-leo-primary bg-leo-primary/10"
                                    )}>{item.severity}</span>
                                </div>
                                <div className="flex items-start gap-3 bg-white/5 rounded-2xl p-3 border border-white/5">
                                    <Zap className="w-4 h-4 text-leo-primary shrink-0 mt-0.5" />
                                    <p className="text-[11px] font-medium text-white/60 leading-relaxed uppercase tracking-tight italic">
                                        <span className="text-leo-primary font-black mr-2 tracking-widest not-italic">REC:</span> {item.rec}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. EXECUTIVE ACTIONS: HIGH IMPACT */}
                <section className="bg-leo-primary rounded-[40px] p-8 space-y-6 shadow-2xl shadow-leo-primary/10">
                    <div>
                        <h3 className="text-black text-[22px] font-black uppercase tracking-tighter leading-none italic">Zatwierdzanie <br />Decyzji</h3>
                        <p className="text-black/60 text-[10px] font-bold uppercase tracking-widest mt-2 leading-relaxed">System wymaga Twojej autoryzacji dla akcji wysokiego wpływu.</p>
                    </div>
                    <div className="grid gap-3">
                        <Button
                            onClick={() => setShowDecisionModal(true)}
                            className="bg-black text-white h-16 rounded-[24px] font-black text-[12px] uppercase tracking-[0.2em] border-0 hover:bg-black/90"
                        >
                            Włącz Tryb PEAK (WWA) <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                        <Button className="bg-black/10 text-black h-16 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] border-2 border-black/10 hover:bg-black/20">
                            Uruchom Plan Awaryjny <ZapOff className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </section>

                {/* 5. EXECUTIVE REPORT: LLM NOTE */}
                <section className="space-y-4">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Raport Strategiczny (Notatka)</h2>
                    <div className="bg-white/5 rounded-[40px] p-8 border border-white/10 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Sparkles className="w-24 h-24 text-leo-primary" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-leo-primary/20 rounded-2xl flex items-center justify-center">
                                <FileText className="w-5 h-5 text-leo-primary" />
                            </div>
                            <div>
                                <div className="text-[14px] font-black uppercase tracking-tight text-white">Podsumowanie Sesji</div>
                                <div className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mt-1">Generowane przez LEO AI</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[13px] font-medium text-white/70 leading-relaxed uppercase tracking-tight italic">
                                "Dzisiejsza operacja przebiega stabilnie z lekkim odchyleniem w sektorach północnych. System automatycznie zneutralizował 12 ryzyk opóźnień. <span className="text-leo-primary font-black not-italic underline decoration-2 underline-offset-4">Rekomenduję zatwierdzenie trybu Peak</span> dla Hubu WWA-01 ze względu na nadchodzącą falę wieczorną (prediction: +15% vol)."
                            </p>
                            <div className="flex gap-4 border-t border-white/5 pt-6">
                                <div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Prognoza Wyniku</div>
                                    <div className="text-[16px] font-black text-green-500">97.8% SLA</div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Ryzyko Finansowe</div>
                                    <div className="text-[16px] font-black text-leo-primary">Minimalne</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* QUICK NAVIGATION DOCK */}
            <div className="fixed bottom-10 left-6 right-6 z-[100] bg-white/5 backdrop-blur-2xl px-8 py-5 rounded-[2rem] border border-white/10 shadow-3xl flex justify-between items-center bg-gradient-to-t from-black/20 to-transparent">
                {[
                    { icon: BarChart3, label: 'Stats' },
                    { icon: Map, label: 'Live' },
                    { icon: Zap, label: 'Active', color: 'text-leo-primary' },
                    { icon: MessageSquare, label: 'Comm' },
                    { icon: Settings, label: 'Info' },
                ].map((item, i) => (
                    <button key={i} className="flex flex-col items-center gap-1.5 group">
                        <item.icon className={cn("w-5 h-5 text-white/40 group-hover:text-white transition-all", item.color)} />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/60">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* DECISION OVERLAY */}
            <AnimatePresence>
                {showDecisionModal && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDecisionModal(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="bg-zinc-900 border border-white/10 rounded-[40px] w-full max-w-sm p-8 relative z-10 space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-leo-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck className="w-8 h-8 text-leo-primary" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter text-white italic">Autoryzacja Executive</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-relaxed">Potwierdzasz włączenie trybu PEAK<br />dla całego regionu Warszawa WWA?</p>
                            </div>

                            <div className="bg-black/40 rounded-3xl p-6 border border-white/5 space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-white/40">Zasięg Akcji:</span>
                                    <span className="text-white text-right">08 HUBÓW<br />242 KURIERÓW</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-t border-white/5 pt-4">
                                    <span className="text-white/40">Wpływ na Koszt:</span>
                                    <span className="text-leo-primary">+2.40 PLN / PACZKA</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button onClick={() => setShowDecisionModal(false)} variant="ghost" className="flex-1 h-16 rounded-3xl border border-white/10 text-white/40 font-black uppercase tracking-widest text-[10px]">Anuluj</Button>
                                <Button onClick={() => setShowDecisionModal(false)} className="flex-1 h-16 rounded-3xl bg-leo-primary text-black font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] shadow-xl shadow-leo-primary/20 border-0">Zatwierdź</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Design Credit */}
            <div className="text-center pt-8 pb-32">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-leo-primary opacity-30 italic">Design and execution by lukilot.work</p>
            </div>

            {/* Grain */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>
    );
}
