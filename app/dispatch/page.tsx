"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navigation, Map, ZoomIn, ZoomOut, Maximize, AlertCircle, Phone, Video, Search, ChevronDown, Bell, LogOut, CheckCircle2, Clock, AlertTriangle, BrainCircuit, Activity, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function DispatchView() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-leo-bg flex overflow-hidden lg:flex-row flex-col">
            {/* Sidebar (Control Center) */}
            <aside className="w-full lg:w-96 bg-white border-r border-leo-gray-200 flex flex-col h-screen shrink-0 relative z-20 shadow-xl lg:shadow-none">
                <header className="p-6 border-b border-leo-gray-100 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-leo-primary tracking-tight">SZTAB GENERALNY</h1>
                        <p className="text-xs uppercase font-bold text-leo-gray-400 tracking-widest">Kontrola Operacyjna LEO</p>
                    </div>
                    <div className="flex bg-leo-gray-50 p-2 rounded-xl text-xs font-bold font-mono border border-leo-gray-200 shadow-inner">
                        <span className="text-leo-primary mr-2 uppercase">Warszawa</span>
                        <span className="text-leo-gray-600">
                            {currentTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    </div>
                </header>

                <div className="p-4 flex-1 overflow-y-auto space-y-6">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <Card className="bg-leo-secondary border-transparent text-white shadow-md">
                            <CardContent className="p-4 pt-4">
                                <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Status Floty</div>
                                <div className="text-2xl font-black">42/45</div>
                                <div className="text-[10px] text-green-400 font-bold mt-1">● Aktywni</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-leo-gray-100 shadow-sm">
                            <CardContent className="p-4 pt-4">
                                <div className="text-[10px] text-leo-gray-400 font-bold uppercase tracking-widest mb-1">Osiągnięcie Okien</div>
                                <div className="text-2xl font-black text-leo-primary">94.2%</div>
                                <div className="text-[10px] text-leo-primary font-bold mt-1">Sloty 15-min</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-leo-accent/20 border-leo-accent/50 shadow-sm col-span-2">
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="text-[10px] text-leo-primary font-bold uppercase tracking-widest mb-0.5">Optimizer (Broker)</div>
                                    <div className="text-[15px] font-black text-leo-gray-900 leading-tight">Przerzuć 12 paczek (Sektor W)</div>
                                    <p className="text-[11px] text-leo-gray-500">Rekomendacja: Operator B2B-2</p>
                                </div>
                                <Button size="sm" className="bg-leo-primary text-white text-xs px-4">Zatwierdź</Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search / Filter */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-leo-gray-400" />
                        <input
                            placeholder="Szukaj ID, Kuriera, Rejonu..."
                            className="bg-leo-gray-50 border border-leo-gray-200 text-sm rounded-xl pl-9 pr-4 py-2 w-full outline-none focus:ring-2 focus:ring-leo-primary"
                        />
                    </div>

                    {/* Active Couriers List */}
                    <div>
                        <div className="flex justify-between items-end mb-3 px-1">
                            <h3 className="font-bold text-leo-gray-900 text-sm uppercase tracking-wider">Flota w drodze</h3>
                            <button className="text-xs text-leo-primary font-bold hover:underline">Zwiń układ</button>
                        </div>
                        <div className="space-y-2">
                            {[
                                { name: "Łukasz K.", auto: "LEO-123", status: "w_trasie", time: "2m temu", alert: false, prog: "45%" },
                                { name: "Kamil P.", auto: "LEO-092", status: "opoznienie", time: "12m temu", alert: true, prog: "88%" },
                                { name: "Anna S.", auto: "LEO-411", status: "przerwa", time: "Teraz", alert: false, prog: "60%" },
                            ].map((c, i) => (
                                <div key={i} className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden ${c.alert ? 'bg-red-50 border-red-200' : 'bg-white border-leo-gray-100'}`}>
                                    <div className="absolute left-0 bottom-0 top-0 w-1 bg-leo-primary/10">
                                        <div className={`w-full absolute bottom-0 left-0 bg-opacity-50 ${c.alert ? 'bg-red-500' : 'bg-leo-primary'}`} style={{ height: c.prog }} />
                                    </div>

                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 shadow-sm font-bold text-sm ${c.alert ? 'bg-red-100 text-red-600 border-red-200' : 'bg-leo-gray-100 text-leo-gray-600 border-white'}`}>
                                        {c.name.split(' ')[0][0]}{c.name.split(' ')[1][0]}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-sm text-leo-gray-900">{c.name}</span>
                                            {c.alert && <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />}
                                        </div>
                                        <div className="text-xs text-leo-gray-500 uppercase flex gap-2 w-full mt-1">
                                            <span className="font-mono bg-leo-gray-100 px-1 rounded">{c.auto}</span>
                                            <span className={c.alert ? 'text-red-600 font-bold' : ''}>
                                                {c.status === 'opoznienie' ? 'Zator (Korek)' : c.status === 'przerwa' ? 'Przerwa (Pauza)' : 'Na trasie'}
                                            </span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="shrink-0 rounded-full h-8 w-8 hover:bg-leo-primary/10">
                                        <Phone className="h-4 w-4 text-leo-primary" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Details & Map Area */}
            <main className="flex-1 right-0 top-0 bottom-0 relative h-screen bg-gray-200 flex flex-col">
                {/* Top Navigation Overlay */}
                <div className="absolute top-4 right-4 left-4 z-40 flex justify-between pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-md pointer-events-auto p-1.5 rounded-2xl shadow-xl border border-white/50 flex gap-1">
                        <Button variant="secondary" size="sm" className="font-bold px-4 rounded-xl shadow-sm">Real-time Map</Button>
                        <Button variant="ghost" size="sm" className="font-bold px-4 rounded-xl text-leo-gray-500 hover:text-leo-primary">Risk Heatmap</Button>
                        <Button variant="ghost" size="sm" className="font-bold px-4 rounded-xl text-leo-gray-500 hover:text-leo-primary">Address Intelligence</Button>
                        <Button variant="ghost" size="sm" className="font-bold px-4 rounded-xl text-leo-gray-500 hover:text-leo-primary">Operational Cost</Button>
                    </div>

                    <div className="flex gap-2 pointer-events-auto">
                        <Button variant="outline" size="icon" className="bg-white/90 backdrop-blur rounded-full shadow-lg border-white pointer-events-auto relative">
                            <Bell className="h-5 w-5 text-leo-primary" />
                            <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 border-2 border-white rounded-full translate-x-1/4 -translate-y-1/4" />
                        </Button>
                        <Button variant="outline" size="icon" className="bg-white/90 backdrop-blur rounded-full shadow-lg border-white pointer-events-auto text-red-600">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Simulated Map Background */}
                <div className="absolute inset-0 z-10 w-full h-full">
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_Warsaw.png')] bg-cover opacity-80" />

                    {/* Fake Map Overlays / Pins */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1/2 left-1/2 -ml-3 -mt-3 h-6 w-6 bg-blue-500 rounded-full border-2 border-white shadow-xl ring-4 ring-blue-500/30 flex items-center justify-center animate-pulse z-20"
                    >
                        <Navigation className="h-3 w-3 text-white rotate-45" />
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1/3 left-2/3 h-5 w-5 bg-red-500 rounded-full border-2 border-white shadow-xl ring-4 ring-red-500/20 z-20 flex items-center justify-center"
                    >
                        <span className="text-[10px] text-white font-bold">!</span>
                    </motion.div>
                </div>

                {/* Bottom Info Panel Overlay */}
                <motion.div
                    initial={{ y: "150%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2, type: 'spring', damping: 25 }}
                    className="absolute bottom-6 left-6 right-6 z-40 bg-white/95 backdrop-blur-xl border border-white shadow-2xl rounded-2xl max-h-64 flex overflow-hidden lg:mr-32"
                >
                    <div className="flex-1 p-6 border-r border-leo-gray-100 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                            <AlertCircle className="h-5 w-5" /> <span>Kolizja - Autostrada A2</span>
                        </div>
                        <p className="text-sm text-leo-gray-600 mb-4 max-w-sm">
                            Wypadek ciężarówki powoduje opóźnienie o 45 minut dla kurierów z Sektora Wschodniego. Skrzyżowanie z S8 zablokowane.
                        </p>
                        <Button className="w-max bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 font-bold">Wymuś zmianę trasy rezerwowej</Button>
                    </div>
                    <div className="w-80 p-6 flex flex-col justify-between bg-leo-gray-50/50">
                        <div>
                            <div className="text-xs font-bold uppercase text-leo-gray-400 mb-1">Kurier zablokowany</div>
                            <div className="text-lg font-black text-leo-primary">Kamil P. • LEO-092</div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button variant="outline" className="flex-1 bg-white border-leo-primary text-leo-primary"><Video className="mr-2 h-4 w-4" /> K-Cam</Button>
                            <Button variant="primary" className="flex-1 bg-leo-primary text-white"><Phone className="mr-2 h-4 w-4" /> Połącz</Button>
                        </div>
                    </div>
                </motion.div>

                {/* Map Controls */}
                <div className="absolute right-6 bottom-6 flex flex-col gap-2 z-40">
                    <Button variant="secondary" size="icon" className="shadow-lg bg-white/90 backdrop-blur text-leo-gray-600"><ZoomIn className="h-5 w-5" /></Button>
                    <Button variant="secondary" size="icon" className="shadow-lg bg-white/90 backdrop-blur text-leo-gray-600"><ZoomOut className="h-5 w-5" /></Button>
                    <Button variant="secondary" size="icon" className="shadow-lg bg-white/90 backdrop-blur text-leo-gray-600 mt-2"><Maximize className="h-5 w-5" /></Button>
                </div>
            </main>
        </div>
    );
}
