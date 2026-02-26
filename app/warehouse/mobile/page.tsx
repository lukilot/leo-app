"use client";

import { useState, useEffect } from "react";
import {
    Factory, ScanBarcode, Truck, AlertTriangle, CheckCircle2,
    Box, ChevronRight, ListChecks, ArrowUpRight, Thermometer,
    ClipboardList, Zap, Settings, Search, X, Loader2, Camera,
    ArrowDownToLine, PackageSearch, Ban
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function WarehouseMobile() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'load' | 'scan' | 'sort' | 'ramp'>('scan');
    const [scannedCount, setScannedCount] = useState(0);
    const [showExceptionModal, setShowExceptionModal] = useState(false);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1200);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans tracking-[0.3em]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-white opacity-20 rounded-full" />
                    <div className="w-16 h-16 border-4 border-leo-primary border-t-transparent rounded-full animate-spin absolute top-0" />
                </div>
                <p className="text-[10px] font-black uppercase text-leo-primary mt-8 italic">Sorting Core Initializing...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1F3F5] text-gray-900 font-sans selection:bg-leo-primary/10 pb-32">
            {/* INDUSTRIAL HEADER */}
            <header className="px-6 pt-16 pb-6 sticky top-0 z-[100] bg-white border-b border-gray-100 shadow-sm flex justify-between items-end">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                        <Factory className="w-6 h-6 text-leo-primary" />
                    </div>
                    <div>
                        <h1 className="text-[20px] font-black uppercase tracking-tighter italic leading-none text-black">LEO <span className="text-leo-primary">MAGAZYN</span></h1>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hub WWA-12</span>
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Shift A</div>
                    <div className="text-[18px] font-black font-mono tracking-tighter text-black">01:58</div>
                </div>
            </header>

            <main className="px-6 pt-8 space-y-10">
                {/* 1. RAMP STATUS HUD */}
                <section className="bg-black rounded-[40px] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Truck className="w-24 h-24" />
                    </div>
                    <div className="flex justify-between items-center">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Status Ramp</h3>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-leo-primary rounded-full animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-leo-primary italic">Live Pulse</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <div className="text-4xl font-black tracking-tighter text-leo-primary">12/14</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">Obsadzone</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black tracking-tighter text-white">03</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-red-500 mt-1">Blokady Wyjazdu</div>
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/10">Szczegóły Wyjazdów <ArrowUpRight className="w-4 h-4 ml-2" /></Button>
                </section>

                {/* 2. RAPID SCAN MODULE */}
                {activeTab === 'scan' && (
                    <section className="space-y-6">
                        <div className="flex justify-between items-end">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Rapid Scan Terminal</h2>
                            <div className="text-[10px] font-black uppercase tracking-widest text-black">Total Scanned: <span className="text-leo-primary">{scannedCount}</span></div>
                        </div>

                        <div className="bg-white rounded-[40px] p-2 border-4 border-black shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center space-y-8">
                            <div className="absolute inset-x-0 h-1 bg-leo-primary top-1/2 -mt-[0.5px] animate-pulse shadow-[0_0_20px_#FFD700]" />

                            <ScanBarcode className="w-24 h-24 text-gray-200" />
                            <div className="text-center space-y-4 px-10">
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Umieść paczkę przed kamerą terminala lub wpisz ID</p>
                                <Button
                                    onClick={() => setScannedCount(c => c + 1)}
                                    className="h-20 w-full rounded-3xl bg-black text-white text-[16px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-transform border-0"
                                >
                                    Skanowanie <Camera className="w-5 h-5 ml-3" />
                                </Button>
                                <Button onClick={() => setShowExceptionModal(true)} variant="ghost" className="text-red-600 font-black uppercase tracking-widest text-[10px] hover:bg-red-50 underline decoration-2 underline-offset-4">Zgłoś Wyjątek / Uszkodzenie</Button>
                            </div>

                            <div className="absolute bottom-6 left-6 right-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-black text-black">LEO-992-11</div>
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sektor: Centrum (WWA-04)</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-black uppercase tracking-tighter">Auto: WWA 4220</div>
                                    <div className="text-[14px] font-black text-black">Rampa 02</div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. SORT ALIGNMENT CHECK */}
                <section className="space-y-4">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Zgodność z Planem Tras</h2>
                    <div className="bg-white rounded-[40px] p-8 border border-gray-100 space-y-6">
                        {[
                            { route: "WWA-C-12", progress: "88%", status: "IN_SORT", icon: Truck },
                            { route: "WWA-C-15", progress: "100%", status: "READY", icon: CheckCircle2 },
                            { route: "WWA-C-18", progress: "45%", status: "DELAYED", icon: AlertTriangle }
                        ].map((item, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn("w-4 h-4", item.status === 'READY' ? "text-green-500" : item.status === 'DELAYED' ? "text-red-500" : "text-black")} />
                                        <span className="text-[14px] font-black uppercase tracking-tighter text-black">{item.route}</span>
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-black px-2 py-0.5 rounded-full",
                                        item.status === 'READY' ? "bg-green-50 text-green-600" : item.status === 'DELAYED' ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-900"
                                    )}>{item.status}</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: item.progress }} className={cn("h-full", item.status === 'DELAYED' ? "bg-red-500" : "bg-black")} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* DOCK NAVIGATION */}
            <div className="fixed bottom-10 left-6 right-6 z-[100] bg-white text-black px-8 py-5 rounded-[2.5rem] shadow-3xl flex justify-between items-center border-t border-gray-50">
                {[
                    { id: 'load', icon: ClipboardList, label: 'Załadunek' },
                    { id: 'scan', icon: ScanBarcode, label: 'Skaner' },
                    { id: 'sort', icon: PackageSearch, label: 'Sortownia' },
                    { id: 'ramp', icon: Truck, label: 'Rampy' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={cn(
                            "flex flex-col items-center gap-1.5 transition-all",
                            activeTab === item.id ? "text-leo-primary scale-110" : "text-gray-300 hover:text-gray-900"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* EXCEPTION MODAL */}
            <AnimatePresence>
                {showExceptionModal && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowExceptionModal(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="bg-white rounded-[40px] w-full max-w-sm p-10 relative z-10 space-y-8 overflow-hidden"
                        >
                            <div className="space-y-2 text-center">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Ban className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic text-black leading-none">Tryb Szybki Wyjątek</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Wybierz powód wyłączenia paczki z sortu</p>
                            </div>

                            <div className="grid gap-3">
                                {[
                                    { label: 'Uszkodzenie Paczki', icon: AlertTriangle, color: 'text-red-600' },
                                    { label: 'Etykieta Nieczytelna', icon: ScanBarcode, color: 'text-gray-900' },
                                    { label: 'Paczka Gabarytowa', icon: Box, color: 'text-gray-900' },
                                    { label: 'Problem z Adresem', icon: X, color: 'text-orange-600' }
                                ].map((item, i) => (
                                    <button key={i} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 group active:bg-gray-200 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <item.icon className={cn("w-5 h-5", item.color)} />
                                            <span className="text-[12px] font-black uppercase tracking-tight text-gray-900 tracking-widest">{item.label}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </button>
                                ))}
                            </div>

                            <Button onClick={() => setShowExceptionModal(false)} className="w-full h-16 rounded-[2rem] bg-black text-white font-black uppercase tracking-widest text-[11px] border-0">Zatwierdź Wyjątek</Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Design Credit */}
            <div className="text-center pt-8 pb-32">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-leo-primary opacity-30 italic">Design and execution by lukilot.work</p>
            </div>

            {/* Grain */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #111 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>
    );
}
