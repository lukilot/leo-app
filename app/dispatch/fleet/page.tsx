"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Users,
    Truck,
    AlertCircle,
    Clock,
    Map as MapIcon,
    TrendingUp,
    DollarSign,
    ChevronRight,
    MoreVertical,
    Search,
    Filter,
    RefreshCw,
    Zap,
    ArrowRightLeft,
    Activity,
    UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function FleetPartnerDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const kpis = [
        { label: "Postęp dnia", value: "68%", sub: "142/210 paczek", color: "text-leo-primary" },
        { label: "Ryzyko opóźnień", value: "ŚREDNIE", sub: "12 paczek zagrożonych", color: "text-orange-500" },
        { label: "Nieudane próby", value: "4.2%", sub: "↑ 0.5% vs wczoraj", color: "text-red-500" },
        { label: "Czas 'pod drzwiami'", value: "4:12", sub: "min/paczka", color: "text-leo-secondary" },
        { label: "Kilometry / Paczka", value: "3.2km", sub: "Efektywność: +8%", color: "text-green-600" },
        { label: "Pobrania (COD)", value: "12 450", sub: "PLN do rozliczenia", color: "text-leo-primary" },
    ];

    const alerts = [
        { type: "CRITICAL", title: "Awaria pojazdu: LEO-092", desc: "Kamil P. unieruchomiony. 15 paczek wymaga przerzutu.", action: "Przerzuć paczki" },
        { type: "WARNING", title: "Zator: Al. Jerozolimskie", desc: "Opóźnienie 20 min dla 3 kurierów.", action: "Koryguj okna" },
        { type: "INFO", title: "Plan B: Sąsiad", desc: "Odbiorca (Złota 44) wybrał Plan B u sąsiada.", action: "OK" },
    ];

    const fleet = [
        { name: "Łukasz K.", auto: "LEO-123", packs: "32/45", tempo: "6.2/h", doorTime: "3:40", km: "112km", status: "OK", risk: false },
        { name: "Kamil P.", auto: "LEO-092", packs: "12/45", tempo: "1.2/h", doorTime: "8:15", km: "45km", status: "AWARIA", risk: true },
        { name: "Anna S.", auto: "LEO-411", packs: "28/40", tempo: "5.8/h", doorTime: "4:10", km: "98km", status: "OK", risk: false },
        { name: "Marek V.", auto: "LEO-502", packs: "15/50", tempo: "4.5/h", doorTime: "5:30", km: "65km", status: "UWAGA", risk: true },
    ];

    return (
        <div className="min-h-screen bg-leo-bg flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b border-leo-gray-100 p-6 flex justify-between items-center sticky top-0 z-50">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-leo-secondary tracking-tight uppercase italic">Partner Flotowy</h1>
                        <span className="bg-leo-accent/30 text-leo-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Premium Ops</span>
                    </div>
                    <p className="text-leo-gray-500 text-xs mt-1 font-medium tracking-wide uppercase">Kontrola Dnia • {currentTime.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-black text-leo-secondary font-mono">{currentTime.toLocaleTimeString('pl-PL')}</div>
                        <div className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">System Live</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-leo-bg border border-leo-gray-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-leo-primary" />
                    </div>
                </div>
            </header>

            <main className="p-6 space-y-6 flex-1 max-w-[1600px] mx-auto w-full">
                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {kpis.map((kpi, i) => (
                        <Card key={i} className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden group hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                <p className="text-[10px] font-bold text-leo-gray-400 uppercase tracking-widest mb-2">{kpi.label}</p>
                                <div className={cn("text-2xl font-black tracking-tight", kpi.color)}>{kpi.value}</div>
                                <p className="text-[11px] font-medium text-leo-gray-500 mt-1">{kpi.sub}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Alerts & Recommendations */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="bg-white rounded-3xl p-6 shadow-sm border border-leo-gray-100">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="font-black text-leo-secondary text-[14px] uppercase tracking-widest">Alerty Wyjątkowe</h3>
                                <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">3 NOWE</span>
                            </div>
                            <div className="space-y-4">
                                {alerts.map((alert, i) => (
                                    <div key={i} className={cn(
                                        "p-4 rounded-2xl border flex gap-3 items-start",
                                        alert.type === "CRITICAL" ? "bg-red-50 border-red-100" :
                                            alert.type === "WARNING" ? "bg-orange-50 border-orange-100" : "bg-blue-50 border-blue-100"
                                    )}>
                                        {alert.type === "CRITICAL" ? <AlertCircle className="w-5 h-5 text-red-500 shrink-0" /> : <Clock className="w-5 h-5 text-orange-500 shrink-0" />}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-[14px] text-leo-gray-900">{alert.title}</div>
                                            <p className="text-[12px] text-leo-gray-600 mt-1 leading-snug">{alert.desc}</p>
                                            <button className="mt-3 text-[11px] font-black uppercase tracking-wider text-leo-primary flex items-center gap-1 group">
                                                {alert.action} <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-leo-secondary rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px]" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Zap className="w-5 h-5 text-leo-primary" />
                                    <h3 className="font-black text-[14px] uppercase tracking-widest">Rekomendacje LEO</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                                        <p className="text-sm font-medium leading-relaxed">
                                            Przesuń <strong>Marka V.</strong> na rejon Centrum Północ. Jego historyczne tempo w tym rejonie stabilizuje jakość okien 15-minutowych.
                                        </p>
                                        <Button className="w-full mt-4 bg-leo-primary hover:bg-leo-primary/90 text-white border-0 py-2 h-10 font-bold text-xs uppercase tracking-widest">
                                            Zastosuj Zmianę
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Fleet Table & Map */}
                    <div className="lg:col-span-8 space-y-6">
                        <section className="bg-white rounded-3xl p-0 shadow-sm border border-leo-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-leo-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <h3 className="font-black text-leo-secondary text-[14px] uppercase tracking-widest">Tabela Floty</h3>
                                    <div className="relative hidden md:block">
                                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-leo-gray-400" />
                                        <input
                                            placeholder="Szukaj kuriera..."
                                            className="bg-leo-bg border-0 rounded-full h-8 px-8 text-xs w-48 focus:ring-1 focus:ring-leo-primary outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 rounded-full text-leo-gray-500 font-bold text-xs">
                                        <Filter className="w-3.5 h-3.5 mr-1" /> Filtruj
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 rounded-full text-leo-gray-500 font-bold text-xs">
                                        <RefreshCw className="w-3.5 h-3.5 mr-1" /> Odśwież
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-leo-bg/50 border-b border-leo-gray-100">
                                        <tr>
                                            <th className="p-4 pl-6 text-[10px] font-black uppercase text-leo-gray-400 tracking-widest">Kurier / Auto</th>
                                            <th className="p-4 text-[10px] font-black uppercase text-leo-gray-400 tracking-widest">Paczki</th>
                                            <th className="p-4 text-[10px] font-black uppercase text-leo-gray-400 tracking-widest">Tempo</th>
                                            <th className="p-4 text-[10px] font-black uppercase text-leo-gray-400 tracking-widest">Pod drzwiami</th>
                                            <th className="p-4 text-[10px] font-black uppercase text-leo-gray-400 tracking-widest">Dystans</th>
                                            <th className="p-4 text-[10px] font-black uppercase text-leo-gray-400 tracking-widest">Status</th>
                                            <th className="p-4 pr-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fleet.map((c, i) => (
                                            <tr key={i} className="border-b border-leo-gray-50 last:border-0 hover:bg-leo-bg/30 transition-colors">
                                                <td className="p-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs border bg-white",
                                                            c.risk ? "border-red-200 text-red-500" : "border-leo-gray-100 text-leo-gray-600"
                                                        )}>
                                                            {c.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-leo-gray-900 text-[14px]">{c.name}</div>
                                                            <div className="text-[10px] font-mono text-leo-gray-400 leading-tight">{c.auto}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm font-black text-leo-secondary">{c.packs}</div>
                                                    <div className="w-16 h-1 bg-leo-gray-100 rounded-full mt-1.5 overflow-hidden">
                                                        <div
                                                            className="h-full bg-leo-primary"
                                                            style={{ width: `${(parseInt(c.packs.split('/')[0]) / parseInt(c.packs.split('/')[1])) * 100}%` }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-4 font-bold text-sm text-leo-gray-700">{c.tempo}</td>
                                                <td className="p-4 font-bold text-sm text-leo-gray-700">{c.doorTime}</td>
                                                <td className="p-4 font-medium text-xs text-leo-gray-500">{c.km}</td>
                                                <td className="p-4">
                                                    <span className={cn(
                                                        "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                                                        c.status === "OK" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                                    )}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 pr-6 text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-leo-gray-400">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Quick Actions Panel */}
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button className="h-auto py-5 rounded-3xl bg-white border border-leo-gray-100 text-leo-secondary hover:bg-leo-bg flex flex-col gap-2 group shadow-sm">
                                <ArrowRightLeft className="w-6 h-6 text-leo-primary group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-wider">Przerzuć Paczki</span>
                            </Button>
                            <Button className="h-auto py-5 rounded-3xl bg-white border border-leo-gray-100 text-leo-secondary hover:bg-leo-bg flex flex-col gap-2 group shadow-sm">
                                <UserCheck className="h-auto flex flex-col gap-2 p-0 bg-transparent border-0 hover:bg-transparent text-leo-secondary">
                                    <Activity className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-wider">Dołóż Pomoc</span>
                                </UserCheck>
                            </Button>
                            <Button className="h-auto py-5 rounded-3xl bg-white border border-leo-gray-100 text-leo-secondary hover:bg-leo-bg flex flex-col gap-2 group shadow-sm">
                                <TrendingUp className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-wider">Plan Wyniku</span>
                            </Button>
                            <Button className="h-auto py-5 rounded-3xl bg-leo-primary text-white hover:bg-leo-primary/95 flex flex-col gap-2 group shadow-lg shadow-leo-primary/20">
                                <Zap className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-wider">Tryb Awaryjny</span>
                            </Button>
                        </section>
                    </div>
                </div>
            </main>

            {/* Floating Map Toggle (as per vision) */}
            <button className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-leo-secondary text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 group z-[100] border-4 border-white">
                <MapIcon className="w-5 h-5 text-leo-primary group-hover:rotate-12 transition-transform" />
                <span className="text-[13px] font-black uppercase tracking-widest">Podgląd Mapy Floty</span>
            </button>

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>
    );
}
