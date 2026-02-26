"use client";

import { useState, useEffect } from "react";
import {
    Activity, Bell, Map, ChevronRight, Zap, ListChecks,
    ArrowRightLeft, AlertCircle, Share2, Layers, LayoutGrid,
    MessageSquare, CheckCircle2, MoreVertical, Search, Filter,
    RefreshCw, Users, ShieldAlert, BrainCircuit, Loader2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OperationsMobile() {
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState<'alerts' | 'regions' | 'actions'>('alerts');
    const [showAlertDetails, setShowAlertDetails] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        setTimeout(() => setLoading(false), 1200);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F1115] flex flex-col items-center justify-center font-sans tracking-widest">
                <Loader2 className="w-12 h-12 animate-spin text-leo-primary mb-6" />
                <p className="text-[10px] font-black uppercase text-gray-500">Inicjalizacja Systemu Operacyjnego...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans selection:bg-leo-primary/10 select-none pb-32">
            {/* TACTICAL HEADER */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-[100] shadow-sm">
                <div className="px-6 py-4 flex justify-between items-center bg-black text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-leo-primary rounded-xl flex items-center justify-center shadow-lg shadow-leo-primary/20">
                            <Activity className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h1 className="text-[18px] font-black uppercase tracking-tighter italic leading-none">LEO <span className="text-leo-primary text-[20px]">OPERACJE</span></h1>
                            <div className="text-[8px] font-black uppercase tracking-widest text-white/40 mt-1 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live Regional Mesh
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[14px] font-black font-mono tracking-tighter text-leo-primary">{currentTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-[8px] font-black text-white/30 uppercase tracking-widest">WWA-SYSTEM-01</div>
                    </div>
                </div>

                {/* Sub-Tabs: Operations Core */}
                <div className="px-6 py-2 flex gap-4 items-center bg-white shadow-sm overflow-x-auto custom-scrollbar no-scrollbar">
                    {[
                        { id: 'alerts', label: 'Alerty', icon: Bell, count: 4 },
                        { id: 'regions', label: 'Rejony', icon: LayoutGrid },
                        { id: 'actions', label: 'Szybkie Akcje', icon: Zap },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 rounded-2xl transition-all whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-black text-white shadow-lg"
                                    : "bg-gray-50 text-gray-400 hover:text-black"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                            {tab.count && (
                                <span className="bg-red-600 text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </header>

            <main className="flex-1 p-6 space-y-8">
                {activeTab === 'alerts' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-end px-1">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Kolejka Priorytetowa</h2>
                            <button className="text-[9px] font-black text-leo-primary uppercase tracking-widest flex items-center gap-2">
                                <RefreshCw className="w-3 h-3" /> Sync
                            </button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: 'A1', type: 'DELAY', title: 'Opóźnienie Sektora S04', detail: '7 kurierów zagrożonych oknem 15-min', severity: 'CRITICAL', time: '2m ago' },
                                { id: 'A2', type: 'BREAKDOWN', title: 'Awaria Auta: LEO-192', detail: 'Kurer Łukasz K. unieruchomiony - Wola', severity: 'HIGH', time: '12m ago' },
                                { id: 'A3', type: 'BURST', title: 'Pękanie Rejonu: Centrum', detail: 'Prognozowane +28% vol w oknie 18:00', severity: 'MID', time: '24m ago' },
                                { id: 'A4', type: 'SORT', title: 'Błąd Sortowania: Gate 12', detail: '32 paczki przypisane do błędnej naczepy', severity: 'HIGH', time: '45m ago' }
                            ].map((alert) => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    onClick={() => setShowAlertDetails(true)}
                                    className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 relative group active:scale-98 transition-transform"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                                alert.severity === 'CRITICAL' ? "bg-red-50 text-red-600 border border-red-100" : "bg-gray-50 text-gray-900 border border-gray-100"
                                            )}>
                                                {alert.type === 'DELAY' ? <AlertCircle className="w-5 h-5" /> : alert.type === 'BREAKDOWN' ? <ShieldAlert className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-black uppercase tracking-tighter text-gray-900">{alert.title}</div>
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{alert.time}</div>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "text-[8px] font-black px-2.5 py-1 rounded-full border tracking-[0.2em] uppercase",
                                            alert.severity === 'CRITICAL' ? "border-red-600 text-red-600" : "border-gray-200 text-gray-400"
                                        )}>
                                            {alert.severity}
                                        </div>
                                    </div>
                                    <p className="text-[12px] font-medium text-gray-500 uppercase tracking-tight leading-relaxed mb-4">
                                        {alert.detail}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button className="flex-1 bg-black text-white h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest border-0">Interweniuj</Button>
                                        <Button variant="ghost" className="bg-gray-50 h-12 w-12 rounded-2xl border border-gray-100"><Share2 className="w-4 h-4 text-gray-400" /></Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'regions' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-end px-1">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Podgląd Rejonów Live</h2>
                            <button className="text-[9px] font-black text-leo-primary uppercase tracking-widest flex items-center gap-2"><Map className="w-3 h-3" /> Mapa Głębi</button>
                        </div>

                        <div className="grid gap-4">
                            {[
                                { name: "Warszawa Wola", load: "92%", cap: "KRYTYCZNE", rec: "Przerzuć 42 paczki do Sektora S09" },
                                { name: "Warszawa Centrum", load: "78%", cap: "WYSOKIE", rec: "Uruchom Plan B dla ul. Marszałkowskiej" },
                                { name: "Mokotów Płd", load: "45%", cap: "OPTYMALNE", rec: "Możliwość wsparcia innych rejonów" }
                            ].map((region, i) => (
                                <div key={i} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-5 flex flex-col">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Layers className="w-5 h-5 text-leo-primary" />
                                            <span className="text-[16px] font-black uppercase tracking-tighter italic text-gray-900">{region.name}</span>
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-black px-3 py-1 rounded-full",
                                            region.cap === 'KRYTYCZNE' ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-900"
                                        )}>{region.cap}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <span>Obciążenie Sektora</span>
                                            <span className="text-gray-900">{region.load}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: region.load }}
                                                className={cn("h-full", parseInt(region.load) > 90 ? "bg-red-600" : "bg-leo-primary")}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-leo-primary/5 rounded-2xl p-4 border border-leo-primary/10 flex gap-3 items-start">
                                        <BrainCircuit className="w-5 h-5 text-leo-primary shrink-0" />
                                        <p className="text-[11px] font-black uppercase tracking-tight text-gray-900 italic leading-tight">
                                            <span className="text-leo-primary not-italic tracking-[0.2em] mr-2">REK:</span> {region.rec}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'actions' && (
                    <div className="space-y-8 pt-4">
                        <section className="space-y-4">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Tactical Controls</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Przerzut Paczek', icon: ArrowRightLeft, color: 'bg-black text-white' },
                                    { label: 'Zmień Priorytet', icon: ListChecks, color: 'bg-white text-black border-2 border-gray-100' },
                                    { label: 'Uruchom Plan B', icon: Activity, color: 'bg-white text-black border-2 border-gray-100' },
                                    { label: 'Tryb Awaryjny', icon: Zap, color: 'bg-red-600 text-white shadow-xl shadow-red-900/20' },
                                ].map((btn, i) => (
                                    <Button key={i} className={cn("h-32 rounded-[32px] flex flex-col items-center justify-center gap-3 p-4", btn.color)}>
                                        <btn.icon className="w-6 h-6" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{btn.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm space-y-6">
                            <div>
                                <h3 className="text-[18px] font-black uppercase tracking-tighter italic text-gray-900">Komunikacja Operacyjna</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Grupowe Wiadomości (Logging Active)</p>
                            </div>
                            <div className="space-y-3">
                                <Button className="w-full h-14 rounded-2xl bg-gray-50 text-gray-900 border border-gray-100 font-black uppercase tracking-widest text-[11px] flex justify-between px-6">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-leo-primary" /> Do wszystkich kurierów
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                </Button>
                                <Button className="w-full h-14 rounded-2xl bg-gray-50 text-gray-900 border border-gray-100 font-black uppercase tracking-widest text-[11px] flex justify-between px-6">
                                    <div className="flex items-center gap-3">
                                        <ShieldAlert className="w-4 h-4 text-red-600" /> Tylko rejony krytyczne
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                </Button>
                            </div>
                        </section>
                    </div>
                )}
            </main>

            {/* ACTION FOOTER BAR */}
            <div className="fixed bottom-10 left-6 right-6 z-[100] bg-black text-white px-8 py-5 rounded-[2.5rem] shadow-2xl flex justify-between items-center border-4 border-white">
                <button className="flex flex-col items-center gap-1.5 opacity-100">
                    <Activity className="w-5 h-5 text-leo-primary" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Dashboard</span>
                </button>
                <div className="h-10 w-[1px] bg-white/10" />
                <button className="flex flex-col items-center gap-1.5 opacity-40">
                    <Map className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Tact-Map</span>
                </button>
                <div className="h-10 w-[1px] bg-white/10" />
                <button className="flex flex-col items-center gap-1.5 opacity-40">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Inbox</span>
                </button>
            </div>

            {/* DECISION TRACE ICON */}
            <div className="fixed top-24 right-0 bg-black text-white p-3 rounded-l-2xl shadow-xl flex items-center gap-2 border-y border-l border-white/10 opacity-60 hover:opacity-100 transition-opacity">
                <ListChecks className="w-4 h-4 text-leo-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest">Trace On</span>
            </div>

            {/* Design Credit */}
            <div className="text-center pt-8 pb-32">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-leo-primary opacity-30 italic">Design and execution by lukilot.work</p>
            </div>

            <AnimatePresence>
                {showAlertDetails && (
                    <div className="fixed inset-0 z-[300] flex items-end justify-center">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowAlertDetails(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="bg-white rounded-t-[48px] w-full p-10 relative z-10 shadow-3xl border-t border-gray-100"
                        >
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-10" />
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 bg-red-600 rounded-full animate-pulse" />
                                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-red-600">Decision Required</span>
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter italic text-gray-900 leading-tight">Zator w Sektorze Wola Północna</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4 text-black">
                                        <p className="text-[13px] font-medium text-gray-500 uppercase tracking-tight leading-relaxed">
                                            Prognozowany czas opóźnienia: <span className="text-black font-black">+22 min</span>. <br />
                                            Liczba zagrożonych paczek: <span className="text-black font-black">112 szt</span>.
                                        </p>
                                    </div>
                                    <div className="bg-leo-primary/10 rounded-3xl p-6 border border-leo-primary/20 space-y-2">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-leo-primary">Rekomendacja Systemu</div>
                                        <p className="text-[14px] font-black uppercase text-gray-900 leading-tight italic tracking-tight">
                                            Automatyczny przerzut kuriera LEO-01 do wsparcia i wydłużenie okien do 20 minut.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button onClick={() => setShowAlertDetails(false)} className="h-16 flex-1 rounded-[2rem] bg-black text-white font-black uppercase tracking-widest text-[12px] border-0">Wyślij Formułę</Button>
                                    <Button onClick={() => setShowAlertDetails(false)} variant="ghost" className="h-16 w-16 rounded-[2rem] bg-gray-50 border border-gray-100 flex items-center justify-center">
                                        <X className="w-6 h-6 text-gray-400" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
