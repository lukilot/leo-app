"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Factory, Package, QrCode, AlertCircle, CheckCircle2,
    ArrowRightLeft, Activity, Zap, Loader2, ArrowDownToLine,
    ArrowUpFromLine, Search, Filter, RefreshCw, BarChart3,
    ShieldCheck, Box, User, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function WarehouseTerminal() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [stats, setStats] = useState({
        scanned: 1240,
        total: 4800,
        errors: 12,
        throughput: "450 p/h",
        activeLines: 4
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        setTimeout(() => setLoading(false), 1200);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans">
                <Loader2 className="w-12 h-12 animate-spin text-leo-primary mb-6" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-leo-primary italic">Inicjalizacja Terminalu Magazynowego...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F4] flex flex-col font-sans selection:bg-leo-primary/10">
            {/* Warehouse HUD Header */}
            <header className="bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0 z-[100]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <Factory className="w-8 h-8 text-leo-primary" />
                        <div className="flex flex-col">
                            <h1 className="text-[18px] font-black uppercase tracking-tighter leading-none italic">LEO <span className="text-leo-primary">MAGAZYN</span></h1>
                            <p className="text-[7px] font-black text-leo-primary uppercase tracking-[0.2em] mt-1 opacity-80">Design & Execution by lukilot.work</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-[14px] font-black font-mono tracking-tighter text-leo-primary">{currentTime.toLocaleTimeString('pl-PL')}</div>
                        <div className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">HUB WWA-01</div>
                    </div>
                    <button onClick={() => setShowSettings(true)} className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors">
                        <Settings className="w-5 h-5 text-leo-primary" />
                    </button>
                </div>
            </header>

            <main className="p-6 space-y-6 max-w-6xl mx-auto w-full">
                {/* Live Throughput Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Przeskanowano", value: stats.scanned, sub: `z ${stats.total}`, color: "text-leo-primary" },
                        { label: "Przepustowość", value: stats.throughput, sub: "Live Flow", color: "text-gray-900" },
                        { label: "Błędy Sortu", value: stats.errors, sub: "Wymaga uwagi", color: "text-red-600" },
                        { label: "Aktywne Bramy", value: stats.activeLines, sub: "Sektory 1-4", color: "text-gray-900" },
                    ].map((stat, i) => (
                        <Card key={i} className="border-0 shadow-sm rounded-3xl bg-white">
                            <CardContent className="p-6">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                                <div className={cn("text-3xl font-black tracking-tighter leading-none mb-1", stat.color)}>{stat.value}</div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{stat.sub}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Primary Action: SCANNER / ENTRY */}
                    <section className="bg-black text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-leo-primary/10 rounded-bl-[100px] group-hover:bg-leo-primary/20 transition-all duration-700" />
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3">
                                <QrCode className="w-8 h-8 text-leo-primary" />
                                <h3 className="font-black text-[20px] uppercase tracking-tighter italic">Szybkie Skanowanie</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-center h-48 border-dashed group-hover:border-leo-primary transition-colors cursor-pointer">
                                    <div className="text-center">
                                        <Box className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                        <p className="text-[11px] font-black uppercase tracking-widest text-white/40">Zeskanuj Kod kreskowy lub wpisz ręcznie</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        placeholder="MANUAL TRACKING ID"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-sm font-black tracking-widest uppercase outline-none focus:ring-2 focus:ring-leo-primary/50"
                                    />
                                    <Button className="h-14 w-14 bg-leo-primary text-black rounded-2xl">
                                        <RefreshCw className="w-5 h-5 font-black" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SORTATION STATUS / TARGETS */}
                    <section className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm space-y-8">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Activity className="w-6 h-6 text-leo-primary" />
                                <h3 className="font-black text-gray-900 text-[18px] uppercase tracking-tighter italic">Harmonogram Wyjazdów</h3>
                            </div>
                            <span className="bg-green-100 text-green-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">W NORMIE</span>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: 'S1', label: 'BRAMA 01 (CENTRUM)', time: '06:45', prog: 88, status: 'FINISHING' },
                                { id: 'S2', label: 'BRAMA 02 (WOLA)', time: '07:00', prog: 42, status: 'LOADING' },
                                { id: 'S3', label: 'BRAMA 03 (MOKOTÓW)', time: '07:15', prog: 95, status: 'READY' },
                                { id: 'S4', label: 'BRAMA 04 (WŁOCHY)', time: '07:30', prog: 12, status: 'WAITING' },
                            ].map((line) => (
                                <div key={line.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="font-black text-leo-primary text-[10px] uppercase font-mono">{line.id}</span>
                                            <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">{line.label}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400">WYJAZD: {line.time}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${line.prog}%` }}
                                            className={cn("h-full", line.prog > 90 ? "bg-green-500" : "bg-leo-primary")}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* EXCEPTIONS & ERRORS TABLE */}
                <section className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                            <h3 className="font-black text-gray-900 text-[13px] uppercase tracking-[0.2em]">Wyjątki Magazynowe</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-5 pl-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Paczka ID</th>
                                    <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Opis Problemu</th>
                                    <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Hub Docelowy</th>
                                    <th className="p-5 pr-8 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Akcja</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[
                                    { id: 'LEO-2938-A', issue: 'Błędny Sektor (Auto-Sort)', target: 'WWA-BŁONIE', status: 'RED' },
                                    { id: 'LEO-1032-B', issue: 'Uszkodzenia Mechaniczne', target: 'WWA-CENTRUM', status: 'CRITICAL' },
                                    { id: 'LEO-8821-X', issue: 'Nieczytelny Kod (Ręczny)', target: 'WWA-MOKOTÓW', status: 'WARN' },
                                ].map((err, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-5 pl-8 font-black text-sm text-gray-900 font-mono italic">{err.id}</td>
                                        <td className="p-5">
                                            <div className="text-[12px] font-black text-red-600 uppercase tracking-tight">{err.issue}</div>
                                        </td>
                                        <td className="p-5 font-black text-xs text-gray-400">{err.target}</td>
                                        <td className="p-5 pr-8 text-right">
                                            <Button variant="ghost" className="h-10 px-6 rounded-xl bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-widest border border-gray-100">Wyjaśnij</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* QUICK COMMAND DOCK FOR WAREHOUSE AGENTS */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-10 py-5 rounded-full shadow-2xl flex items-center gap-8 border-4 border-white">
                {[
                    { icon: ArrowUpFromLine, label: 'Przyjęcie' },
                    { icon: ArrowDownToLine, label: 'Wydanie' },
                    { icon: ShieldCheck, label: 'Rewizja' },
                    { icon: RefreshCw, label: 'Zwrot' },
                ].map((cmd, i) => (
                    <button key={i} className="flex flex-col items-center gap-1.5 group">
                        <cmd.icon className="w-5 h-5 text-leo-primary group-hover:scale-125 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{cmd.label}</span>
                    </button>
                ))}
            </div>

            {/* SETTINGS MODAL */}
            <AnimatePresence>
                {showSettings && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSettings(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[40px] w-full max-w-md p-10 relative z-10 shadow-2xl border border-gray-100"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1 text-black">
                                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Terminal <span className="text-leo-primary">Magazynu</span></h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">LEO Protocol v3.0.4 - Warehouse Edition</p>
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
                                                <Factory className="w-6 h-6 text-leo-primary" />
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-black uppercase italic tracking-tight text-gray-900">LEO Warehouse Core</div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-leo-primary">Sortation Standard</div>
                                            </div>
                                        </div>
                                        <p className="text-[12px] font-medium text-gray-500 leading-relaxed uppercase tracking-tight">
                                            Interfejs wysokiej wydajności dla sortowni i magazynów, zoptymalizowany pod kątem urządzeń mobilnych i skanerów.
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
                                        LEO Warehouse • Vision 2026 • Real-time Sort
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Background Texture split-grid */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "32px 32px" }} />
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
