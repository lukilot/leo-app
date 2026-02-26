"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Users, Truck, AlertCircle, Clock, Map as MapIcon, TrendingUp, ChevronRight,
    MoreVertical, Search, Filter, RefreshCw, Zap, ArrowRightLeft, Activity,
    UserCheck, CheckCircle2, Loader2, DollarSign, MousePointer2, Settings,
    MessageSquare, ShieldAlert, BarChart3, HelpCircle, Layers, Navigation, Phone, Box
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

interface FleetMember {
    id: string;
    name: string;
    auto: string;
    packs: string;
    tempo: string;
    doorTime: string;
    km: string;
    status: 'OK' | 'UWAGA' | 'KRYTYCZNE' | 'PAUZA';
    risk: boolean;
    prog: number;
    region: string;
}

export default function FleetPartnerDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [activeTab, setActiveTab] = useState<'operacje' | 'wyjatki' | 'mapa' | 'rozliczenia'>('operacje');
    const [stats, setStats] = useState({
        progress: "68%",
        delivered: 142,
        total: 210,
        risks: 12,
        failed: "4.2%",
        doorTime: "4:12",
        kmPerPack: "3.2km",
        cod: 12450
    });

    const handleExport = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert("Raport Dnia wygenerowany pomyślnie (PDF / XLSX). Gotowy do wysyłki do centrali.");
        }, 1000);
    };

    const [fleet, setFleet] = useState<FleetMember[]>([
        { id: '1', name: "Łukasz K.", auto: "LEO-123", packs: "32/45", tempo: "6.2/h", doorTime: "3:40", km: "112km", status: "OK", risk: false, prog: 71, region: "Wola" },
        { id: '2', name: "Kamil P.", auto: "LEO-092", packs: "12/45", tempo: "1.2/h", doorTime: "8:15", km: "45km", status: "KRYTYCZNE", risk: true, prog: 26, region: "Centrum" },
        { id: '3', name: "Anna S.", auto: "LEO-411", packs: "28/40", tempo: "5.8/h", doorTime: "4:10", km: "98km", status: "OK", risk: false, prog: 70, region: "Mokotów" },
        { id: '4', name: "Marek V.", auto: "LEO-502", packs: "15/50", tempo: "4.5/h", doorTime: "5:30", km: "65km", status: "UWAGA", risk: true, prog: 30, region: "Wola Płn" },
    ]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        // Semi-real data fetch
        const load = async () => {
            await new Promise(r => setTimeout(r, 1200));
            setLoading(false);
        };
        load();
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F5F4] flex flex-col items-center justify-center font-sans uppercase">
                <Loader2 className="w-12 h-12 animate-spin text-leo-primary mb-6" />
                <div className="text-center space-y-2">
                    <p className="text-[12px] font-black tracking-[0.4em] text-gray-900 italic">Centrala Partnera Flotowego</p>
                    <p className="text-[10px] font-bold text-gray-400">Inicjalizacja Systemu Dowodzenia...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans selection:bg-leo-primary/10">
            {/* Premium Multi-Level Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-[100]">
                <div className="px-8 py-4 flex justify-between items-center bg-black text-white">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-leo-primary rounded-lg flex items-center justify-center font-black text-black">L</div>
                            <div className="flex flex-col">
                                <h1 className="text-[18px] font-black uppercase tracking-tighter italic leading-none">Partner <span className="text-leo-primary">Flotowy</span></h1>
                                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-leo-primary mt-0.5 opacity-80">Design & Execution by lukilot.work</span>
                            </div>
                        </div>
                        <div className="h-6 w-[1px] bg-white/20" />
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/50">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Operacja: Warszawa Wola</span>
                            <span>ID: LEO-PRT-042</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-[13px] font-black font-mono tracking-tighter">{currentTime.toLocaleTimeString('pl-PL')}</div>
                            <div className="text-[9px] font-black text-leo-primary uppercase tracking-widest leading-none">Status: Live Sync</div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-white/40 hover:text-white" onClick={() => setShowSettings(true)}><Settings className="w-5 h-5" /></Button>
                    </div>
                </div>

                <div className="px-8 py-2 flex gap-8 items-center border-b border-gray-100 bg-white shadow-sm overflow-x-auto">
                    {[
                        { id: 'operacje', label: 'Dzień Floty', icon: Activity },
                        { id: 'wyjatki', label: 'Centrum Wyjątków', icon: ShieldAlert, count: 3 },
                        { id: 'mapa', label: 'Monitorowanie Mapy', icon: MapIcon },
                        { id: 'rozliczenia', label: 'Finanse i COD', icon: DollarSign },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2.5 px-2 py-3 border-b-2 transition-all group relative whitespace-nowrap",
                                activeTab === tab.id ? "border-leo-primary text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <tab.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", activeTab === tab.id ? "text-leo-primary" : "text-gray-300")} />
                            <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                            {tab.count && <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full absolute -top-1 -right-1 opacity-90">{tab.count}</span>}
                        </button>
                    ))}
                </div>
            </header>

            <main className="p-8 space-y-8 max-w-[1700px] mx-auto w-full">
                {/* 1. KPI Intelligence Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: "Postęp Dnia", value: stats.progress, sub: `${stats.delivered}/${stats.total} paczek`, trend: "on track", color: "text-leo-primary" },
                        { label: "Ryzyko Opóźnień", value: "ŚREDNIE", sub: `${stats.risks} paczek zagrożonych`, trend: "stable", color: "text-orange-500" },
                        { label: "Nieudane Próby", value: stats.failed, sub: "↑ 0.5% vs wczoraj", trend: "up", color: "text-red-600" },
                        { label: "Czas Pod Drzwiami", value: stats.doorTime, sub: "min / stop", trend: "down", color: "text-gray-900" },
                        { label: "Efektywność KM", value: stats.kmPerPack, sub: "km / paczka", trend: "-8% kosztu", color: "text-green-600" },
                        { label: "Pobrania COD", value: stats.cod.toLocaleString(), sub: "PLN do rozliczenia", trend: "not settled", color: "text-leo-primary" },
                    ].map((kpi, i) => (
                        <Card key={i} className="border-0 shadow-sm rounded-[32px] bg-white group hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                                    <div className="h-2 w-2 rounded-full bg-gray-50" />
                                </div>
                                <div className={cn("text-3xl font-black tracking-tighter leading-none mb-1.5", kpi.color)}>{kpi.value}</div>
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">{kpi.sub}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT AREA: Exceptions & Recommendations */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* THE HEART: EXCEPTIONS PANEL */}
                        <section className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col h-[520px]">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <ShieldAlert className="w-5 h-5 text-red-600" />
                                    <h3 className="font-black text-gray-900 text-[13px] uppercase tracking-[0.2em]">Centrum Wyjątków</h3>
                                </div>
                                <button className="text-[10px] font-black text-leo-primary uppercase tracking-widest">Wyczyść OK</button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                                {/* Exception Group 1: Fleet */}
                                <div className="bg-red-50/50 rounded-3xl p-5 border border-red-100 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-red-100 text-red-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">KRYTYCZNE</div>
                                        <span className="text-[10px] font-black text-red-900/40 font-mono">ID: FL-042</span>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-red-900 text-[15px] uppercase italic">Awaria Pojazdu LEO-092</h4>
                                        <p className="text-[12px] text-red-900/60 font-medium mt-1 leading-snug">
                                            Kamil P. unieruchomiony (Centrum). 15 paczek zagrożonych niedowiezieniem. System wykrył przerwę w trasie &gt; 12min.
                                        </p>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button className="flex-1 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest h-10 border-0 rounded-xl hover:bg-red-700">Inicjuj Przerzut</Button>
                                        <Button variant="outline" className="h-10 w-10 border-red-200 text-red-600 rounded-xl"><Phone className="w-4 h-4" /></Button>
                                    </div>
                                </div>

                                {/* Exception Group 2: Traffic */}
                                <div className="bg-orange-50/50 rounded-3xl p-5 border border-orange-100 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">OSTRZEŻENIE</div>
                                        <span className="text-[10px] font-black text-orange-900/40 font-mono">10:14</span>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-orange-900 text-[15px] uppercase italic">Utrata Okien Czasowych</h4>
                                        <p className="text-[12px] text-orange-900/60 font-medium mt-1 leading-snug">
                                            Złota/Emilii Plater: Zator. 3 kurierów traci okna 15-min. Skumulowane opóźnienie: 42min.
                                        </p>
                                    </div>
                                    <Button className="w-full bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest h-10 border-0 rounded-xl">Koryguj Okna LEO</Button>
                                </div>

                                {/* Exception Group 3: Customer Action */}
                                <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">INFO</div>
                                        <span className="text-[10px] font-black text-blue-900/40 font-mono">LIVE</span>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-blue-900 text-[15px] uppercase italic">Aktywacja Planu B</h4>
                                        <p className="text-[12px] text-blue-900/60 font-medium mt-1 leading-snug">
                                            Odbiorca (Dzielna 5) zmienił miejsce doręczenia na: Sąsiad (m. 14). Instrukcja zaktualizowana.
                                        </p>
                                    </div>
                                    <Button variant="secondary" className="w-full bg-white text-blue-600 font-black text-[10px] uppercase tracking-widest h-10 border-blue-100 rounded-xl">Zatwierdź</Button>
                                </div>
                            </div>
                        </section>

                        {/* RECOMMENDATIONS: LEO INSTINCT */}
                        <section className="bg-black rounded-[40px] p-8 shadow-2xl text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-leo-primary/10 rounded-bl-[100px] group-hover:bg-leo-primary/20 transition-all duration-700" />
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <Zap className="w-6 h-6 text-leo-primary animate-pulse" />
                                    <h3 className="font-black text-[14px] uppercase tracking-[0.3em] text-leo-primary">Mój Rejon (Instynkt)</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-10 w-10 bg-leo-primary rounded-2xl flex items-center justify-center font-black text-white italic">M</div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-leo-primary">Dopasowanie: Marek V.</div>
                                                <div className="text-[14px] font-black uppercase italic tracking-tighter">Sektor Wola Płn.</div>
                                            </div>
                                        </div>
                                        <p className="text-[13px] font-medium leading-relaxed text-gray-300">
                                            Marek ma historyczne tempo <span className="text-white font-black underline underline-offset-4 decoration-leo-primary">6.8 pack/h</span> w tym obszarze. Przesuń go z Mokotowa, by ustabilizować okna 15-min o 18%.
                                        </p>
                                        <Button className="w-full mt-6 bg-leo-primary hover:bg-leo-primary/90 text-white font-black text-[11px] uppercase tracking-widest h-14 rounded-2xl border-0 shadow-lg shadow-leo-primary/20">
                                            Zastosuj Rekomendację
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT AREA: Fleet Board & Tactical Controls */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* FLEET OPERATIONAL TABLE */}
                        <section className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
                                <div className="flex items-center gap-8">
                                    <h3 className="font-black text-gray-900 text-[13px] uppercase tracking-[0.2em]">Raport Dowodzenia Flotą</h3>
                                    <div className="h-8 w-[1px] bg-gray-100 hidden md:block" />
                                    <div className="relative hidden md:block max-w-[280px]">
                                        <Search className="absolute left-4 top-3 h-4 w-4 text-gray-300" />
                                        <input
                                            placeholder="SZUKAJ KURERA / AUTA / REJONU"
                                            className="bg-gray-50 border-0 rounded-2xl h-11 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest w-64 focus:ring-2 focus:ring-leo-primary/20 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-leo-primary">
                                        <Filter className="w-4 h-4 mr-2" /> Filtruj
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-leo-primary">
                                        <RefreshCw className="w-4 h-4 mr-2" /> Odśwież
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="p-6 pl-10 text-[10px] font-black uppercase text-gray-400 tracking-widest">Kurier / Rejon</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Wolumen / Postęp</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Tempo / Czas</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Efektywność KM</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                                            <th className="p-6 pr-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {fleet.map((c, i) => (
                                            <tr key={c.id} className="hover:bg-gray-50/50 transition-all group">
                                                <td className="p-6 pl-10">
                                                    <div className="flex items-center gap-5">
                                                        <div className={cn(
                                                            "h-12 w-12 rounded-2xl flex items-center justify-center font-black text-[12px] italic border-2 transition-all group-hover:scale-110",
                                                            c.status === 'KRYTYCZNE' ? "bg-red-50 border-red-200 text-red-600 shadow-lg shadow-red-100" :
                                                                c.status === 'UWAGA' ? "bg-orange-50 border-orange-200 text-orange-600" :
                                                                    "bg-gray-50 border-gray-100 text-gray-400"
                                                        )}>
                                                            {c.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-gray-900 text-[16px] uppercase tracking-tighter leading-none mb-1">{c.name}</div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">{c.auto}</span>
                                                                <div className="h-1 w-1 bg-gray-200 rounded-full" />
                                                                <span className="text-[10px] font-black text-leo-primary uppercase tracking-widest">{c.region}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="text-[16px] font-black text-gray-900 leading-none mb-2">{c.packs}</div>
                                                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${c.prog}%` }}
                                                            className={cn("h-full", c.status === 'KRYTYCZNE' ? "bg-red-500" : "bg-leo-primary")}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="font-black text-[14px] text-gray-800 leading-none mb-1">{c.tempo} <span className="text-[10px] text-gray-400 font-bold">AVG</span></div>
                                                    <div className="text-[11px] text-gray-500 font-bold uppercase tracking-tight">{c.doorTime} / stop</div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="font-black text-[14px] text-gray-800 leading-none mb-1">{c.km}</div>
                                                    <div className="text-[10px] text-green-600 font-black uppercase tracking-widest flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3" /> +4.2% Efek.
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className={cn(
                                                        "text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border-2 inline-block min-w-[100px]",
                                                        c.status === "OK" ? "bg-green-50 border-green-100 text-green-600" :
                                                            c.status === "UWAGA" ? "bg-orange-50 border-orange-100 text-orange-600" :
                                                                "bg-red-50 border-red-100 text-red-600"
                                                    )}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="p-6 pr-10 text-right">
                                                    <Button variant="link" className="text-gray-300 hover:text-leo-primary">
                                                        <ChevronRight className="w-6 h-6" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* TACTICAL COMMAND DOCK */}
                        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[
                                { label: "Przerzut Paczek", icon: ArrowRightLeft, color: "text-leo-primary" },
                                { label: "Dołóż Pomoc", icon: UserCheck, color: "text-orange-500" },
                                { label: "Blokada Ryzyk", icon: ShieldAlert, color: "text-slate-900" },
                                { label: "Tryb Awaryjny", icon: Zap, color: "text-red-600", primary: true },
                                { label: "Raport Koniec Dnia", icon: BarChart3, color: "text-leo-primary" },
                            ].map((btn, i) => (
                                <Button
                                    key={i}
                                    onClick={btn.label === "Raport Koniec Dnia" ? handleExport : undefined}
                                    className={cn(
                                        "h-[140px] rounded-[40px] flex flex-col items-center justify-center gap-4 group transition-all duration-300 border-2",
                                        btn.primary
                                            ? "bg-black text-white border-black shadow-2xl shadow-red-900/10"
                                            : "bg-white border-gray-50 text-gray-900 hover:border-leo-primary/30 shadow-sm"
                                    )}
                                >
                                    <div className={cn("p-4 rounded-[20px] bg-gray-50 group-hover:scale-110 transition-transform", btn.primary && "bg-white/10")}>
                                        <btn.icon className={cn("w-7 h-7", btn.color)} />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{btn.label}</span>
                                </Button>
                            ))}
                        </section>
                    </div>
                </div>

                {/* 7. OPERATIONAL COMM CHANNEL (STICKY / OVERLAY) */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-6 flex items-center justify-between sticky bottom-10 z-[100] max-w-5xl mx-auto border-t-4 border-t-leo-primary">
                    <div className="flex items-center gap-6">
                        <div className="bg-leo-primary/10 p-3 rounded-2xl">
                            <MessageSquare className="w-6 h-6 text-leo-primary" />
                        </div>
                        <div className="h-10 w-[1px] bg-gray-100" />
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Strumień Operacyjny: Ostatni Wpis</div>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-black font-mono text-leo-primary opacity-60">10:42 | ŁUKASZ K.</span>
                                <p className="text-[14px] font-bold text-gray-800 uppercase italic leading-none">Paczka #8291 doręczona (Plan B: Sąsiad)</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex -space-x-3 mr-4 items-center">
                            {fleet.slice(0, 3).map((f, i) => (
                                <div key={i} className="h-9 w-9 bg-gray-100 border-4 border-white rounded-full flex items-center justify-center font-black text-[10px] text-gray-400">
                                    {f.name[0]}
                                </div>
                            ))}
                            <div className="h-9 w-9 bg-leo-primary text-white border-4 border-white rounded-full flex items-center justify-center font-black text-[10px]">+2</div>
                        </div>
                        <Button className="h-14 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest px-8">Otwórz Kanał Operacyjny</Button>
                    </div>
                </div>
            </main>

            {/* FLOATING MAP TOGGLE */}
            <AnimatePresence>
                {activeTab !== 'mapa' && (
                    <motion.button
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-10 right-10 z-[200] bg-black text-white h-20 w-20 rounded-full shadow-2xl border-4 border-white flex flex-col items-center justify-center group"
                        onClick={() => setActiveTab('mapa')}
                    >
                        <MapIcon className="w-6 h-6 text-leo-primary group-hover:rotate-12 transition-transform mb-0.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">MAPA</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* SETTINGS MODAL */}
            <AnimatePresence>
                {showSettings && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSettings(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[40px] w-full max-w-md p-10 relative z-10 shadow-2xl border border-gray-100"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Informacje o <span className="text-leo-primary">Systemie</span></h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">LEO Protocol v3.0.4</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)} className="rounded-full h-10 w-10 bg-gray-50 hover:bg-gray-100">
                                    <X className="w-5 h-5" />
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
                                                <div className="text-[14px] font-black uppercase italic tracking-tight text-gray-900">LEO Core Engine</div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-leo-primary">Vision 2026 Compatible</div>
                                            </div>
                                        </div>
                                        <p className="text-[12px] font-medium text-gray-500 leading-relaxed uppercase tracking-tight">
                                            Kompleksowe rozwiązanie logistyczne typu "Natural Logistics" wspierające operacje ostatniej mili w standardzie IPO.
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
                                        Automotive Protocol • AI Optimized • Real-time
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* BACKGROUND DECOR */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "48px 48px" }} />
        </div>
    );
}

function X({ className, ...props }: any) {
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
