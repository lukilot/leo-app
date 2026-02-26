"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Map as MapIcon, Navigation as NavigationIcon, CheckCircle2, Loader2, Play, ChevronUp, ChevronDown,
    Truck, Zap, Camera, Mic, FileText, Settings, X, Search,
    ArrowRightLeft, ListChecks, MessageSquare, Star, Award,
    MapPin, Bell, LogOut, Info, ShieldCheck, Box, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import LEOMap from "@/components/LEOMap";

interface PackageData {
    id: string;
    tracking_number: string;
    recipient_name: string;
    recipient_address: string;
    status: string;
    estimated_delivery_time: string;
    window_start?: string;
    window_end?: string;
    company?: string;
    type?: 'S' | 'M' | 'L' | 'XL';
}

export default function CourierDay() {
    const [status, setStatus] = useState<"onboarding" | "loading" | "calculating" | "ready" | "started">("onboarding");
    const [activeTab, setActiveTab] = useState<'plan' | 'map' | 'inbox'>('plan');
    const [packages, setPackages] = useState<PackageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [activeImport, setActiveImport] = useState<'scan' | 'voice' | 'file' | null>(null);
    const [courierLevel, setCourierLevel] = useState(12);

    const fetchPackages = async () => {
        try {
            const { data, error } = await supabase
                .from('packages')
                .select('*')
                .in('status', ['pending', 'in_transit'])
                .order('estimated_delivery_time', { ascending: true });

            if (data && data.length > 0) {
                setPackages(data as PackageData[]);
            } else {
                setPackages([
                    { id: '1', tracking_number: 'LEO-777-1', recipient_name: 'Tomasz Kowalski', recipient_address: 'Al. Jerozolimskie 1, Warszawa', status: 'pending', estimated_delivery_time: new Date().toISOString(), company: 'DPD', type: 'M' },
                    { id: '2', tracking_number: 'LEO-888-2', recipient_name: 'Anna Próbna', recipient_address: 'ul. Marszałkowska 10, Warszawa', status: 'pending', estimated_delivery_time: new Date().toISOString(), company: 'DHL', type: 'S' },
                    { id: '3', tracking_number: 'LEO-991-3', recipient_name: 'Marek Nowak', recipient_address: 'ul. Wawelska 4, Warszawa', status: 'pending', estimated_delivery_time: new Date().toISOString(), company: 'InPost', type: 'XL' }
                ]);
            }
        } catch (e) {
            console.error("Fetch catch:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
        setTimeout(() => setLoading(false), 1500);
    }, []);

    const handleCalculateRoute = () => {
        setStatus("calculating");
        setTimeout(() => setStatus("ready"), 1200);
    };

    const movePackage = (index: number, direction: 'up' | 'down') => {
        const newPackages = [...packages];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= packages.length) return;
        [newPackages[index], newPackages[targetIndex]] = [newPackages[targetIndex], newPackages[index]];
        setPackages(newPackages);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans">
                <div className="w-16 h-16 border-4 border-leo-primary border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-leo-primary italic">Initialization LEO.Courier...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F7F9] flex flex-col font-sans select-none pb-32">
            {/* TACTICAL HEADER */}
            <header className="px-6 pt-16 pb-6 sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 flex justify-between items-end">
                <div>
                    <h1 className="text-[20px] font-black uppercase tracking-tighter italic leading-none text-black">
                        {activeTab === 'plan' && <>TRASA <span className="text-leo-primary">DZIŚ</span></>}
                        {activeTab === 'map' && <>MAPA <span className="text-leo-primary">TAKTYCZNA</span></>}
                        {activeTab === 'inbox' && <>CENTRUM <span className="text-leo-primary">WIADOMOŚCI</span></>}
                    </h1>
                    <div className="flex items-center gap-2 mt-1.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Łukasz • Poz. {courierLevel}</p>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowSettings(true)} className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl shadow-black/10 active:scale-95 transition-transform">
                        <Settings className="w-5 h-5 text-leo-primary" />
                    </button>
                    <div className="h-12 w-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-[10px] text-gray-400">
                        WWA
                    </div>
                </div>
            </header>

            <main className="px-6 pt-8 space-y-10 flex-1">
                {activeTab === 'plan' && (
                    <>
                        {/* 1. ONBOARDING / IMPORT DOCK */}
                        {status === 'onboarding' && (
                            <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Zaimportuj Paczki do LEO Engine</h2>
                                    <p className="text-[13px] font-medium text-gray-500">Wybierz metodę dodania listy paczek na dziś.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button onClick={() => setActiveImport('scan')} className="h-32 rounded-[2.5rem] bg-black text-white border-0 flex flex-col gap-3 shadow-2xl active:scale-95 transition-transform">
                                        <Camera className="w-6 h-6 text-leo-primary" />
                                        <span className="text-[11px] font-black uppercase tracking-widest">Skanuj Etykiety</span>
                                    </Button>
                                    <Button onClick={() => setActiveImport('voice')} className="h-32 rounded-[2.5rem] bg-white text-black border border-gray-100 flex flex-col gap-3 shadow-sm active:scale-95 transition-transform">
                                        <Mic className="w-6 h-6 text-[#E85D04]" />
                                        <span className="text-[11px] font-black uppercase tracking-widest">Dyktuj Adresy</span>
                                    </Button>
                                    <Button onClick={() => setActiveImport('file')} className="h-24 rounded-[2rem] bg-white text-black border border-gray-100 flex flex-col gap-2 col-span-2">
                                        <FileText className="w-5 h-5 text-gray-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Wgraj CSV / Plik firmy</span>
                                    </Button>
                                </div>
                                <div className="pt-4">
                                    <Button onClick={handleCalculateRoute} className="w-full h-16 rounded-[2rem] bg-leo-primary text-black font-black uppercase tracking-widest text-[12px] border-0">Oblicz trasę naturalną</Button>
                                </div>
                            </motion.section>
                        )}

                        {/* 2. ROUTE CALCULATION / READY STATE */}
                        {(status === 'calculating' || status === 'ready' || status === 'started') && (
                            <section className="space-y-8">
                                {/* PERFORMANCE HUD */}
                                <div className="bg-black rounded-[40px] p-8 text-white space-y-8 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Truck className="w-24 h-24 text-leo-primary" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic">Mój Rejon: Warszawa Wola</h3>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-leo-primary fill-current" />
                                            <span className="text-[10px] font-black text-leo-primary uppercase italic">PRO Courier</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <div className="text-4xl font-black tracking-tighter italic text-leo-primary">{packages.length}</div>
                                            <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">Stopy na trasie</div>
                                        </div>
                                        <div>
                                            <div className="text-4xl font-black tracking-tighter italic text-white">42km</div>
                                            <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">Prognozowana trasa</div>
                                        </div>
                                    </div>
                                    {status === 'ready' && (
                                        <Button onClick={() => setStatus('started')} className="w-full h-14 rounded-2xl bg-leo-primary text-black font-black uppercase tracking-widest text-[11px] border-0 shadow-lg shadow-leo-primary/10">Startuj Trasę & Wyślij Okna <Play className="w-4 h-4 ml-2" /></Button>
                                    )}
                                </div>

                                {/* PACKAGE LIST / DRAG & DROP UI */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end px-1">
                                        <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Plan Pracy (Okna 15-min)</h2>
                                        {status === 'ready' && (
                                            <p className="text-[9px] font-black text-leo-primary uppercase tracking-widest underline underline-offset-4 decoration-2">Zmień kolejność trasy</p>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {packages.map((pkg, i) => (
                                            <motion.div
                                                key={pkg.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                                                className={cn(
                                                    "bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex items-center justify-between group active:scale-98 transition-transform",
                                                    status === 'started' && i === 0 ? "border-leo-primary border-2 ring-4 ring-leo-primary/5 shadow-2xl" : ""
                                                )}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shadow-sm",
                                                        status === 'started' && i === 0 ? "bg-black text-white" : "bg-gray-50 text-gray-400"
                                                    )}>
                                                        <span className="text-[8px] uppercase opacity-40 leading-none mb-1">STOP</span>
                                                        <span className="text-[16px] leading-none">{i + 1}</span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <div className="text-[16px] font-black text-black leading-none uppercase italic tracking-tighter truncate w-40">{pkg.recipient_address.split(',')[0]}</div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">{pkg.recipient_name}</span>
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">
                                                                <Box className="w-2.5 h-2.5 text-gray-400" />
                                                                <span className="text-[8px] font-black text-gray-400">{pkg.type || 'M'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="text-[12px] font-black font-mono tracking-tighter text-black">
                                                        {new Date(new Date().getTime() + (i * 15 + 10) * 60000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    {status === 'ready' && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => movePackage(i, 'up')} className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black">
                                                                <ChevronUp className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => movePackage(i, 'down')} className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black">
                                                                <ChevronDown className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </>
                )}

                {activeTab === 'map' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 space-y-6">
                        <div className="h-[500px] w-full bg-gray-200 rounded-[40px] relative overflow-hidden border-4 border-white shadow-2xl">
                            <LEOMap
                                theme="tactical"
                                markers={packages.map((pkg, i) => ({
                                    id: pkg.id,
                                    latitude: 52.23 + (i * 0.005) - (i % 2 === 0 ? 0.01 : 0),
                                    longitude: 21.01 + (i * 0.01) - (i % 2 !== 0 ? 0.005 : 0),
                                    label: pkg.recipient_address.split(',')[0],
                                    type: 'stop'
                                }))}
                                initialViewState={{
                                    latitude: 52.23,
                                    longitude: 21.01,
                                    zoom: 13
                                }}
                            />

                            <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/80 backdrop-blur-xl rounded-3xl border border-white/10 flex justify-between items-center z-10">
                                <div>
                                    <div className="text-[10px] font-black text-leo-primary uppercase tracking-widest mb-1">Następny Stop</div>
                                    <div className="text-[14px] font-black text-white">{packages[0]?.recipient_address.split(',')[0]}</div>
                                </div>
                                <Button className="bg-leo-primary text-black h-12 rounded-xl text-[10px] font-black uppercase tracking-widest px-6 italic">Gps Start</Button>
                            </div>
                        </div>

                        <section className="bg-white rounded-[40px] p-8 border border-gray-100 space-y-4 shadow-sm">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Analiza Gęstości Rejonu</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-2xl font-black italic">14</div>
                                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Stopy / km2</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-2xl font-black italic">LOW</div>
                                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Traffic Risk</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-2xl font-black italic text-leo-primary">WIN</div>
                                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Dopasowanie</div>
                                </div>
                            </div>
                        </section>
                    </motion.div>
                )}

                {activeTab === 'inbox' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 flex-1">
                        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm space-y-6">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Dzisiejsze Powiadomienia</h2>
                            <div className="space-y-4">
                                {[
                                    { title: "Dyspozytornia Centralna", msg: "Uwaga: Utrudnienia na ul. Marszałkowskiej. System przelicza obejście.", time: "12:14", imp: true },
                                    { title: "Odbiorca (Tomasz)", msg: "Wiadomość Plan B: Proszę zostawić paczkę u sąsiada w nr 12.", time: "10:32", imp: false },
                                    { title: "System LEO", msg: "Twoja wydajność: +12% vs rówieśnicy. Gratulacje, Łukasz!", time: "08:15", imp: false }
                                ].map((noti, i) => (
                                    <div key={i} className={cn(
                                        "p-6 rounded-3xl border flex items-start gap-4 transition-all active:scale-[0.98]",
                                        noti.imp ? "bg-black text-white border-black" : "bg-gray-50 text-gray-900 border-gray-100"
                                    )}>
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", noti.imp ? "bg-leo-primary" : "bg-white")}>
                                            <Bell className={cn("w-5 h-5", noti.imp ? "text-black" : "text-gray-400")} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-center">
                                                <div className="text-[14px] font-black uppercase italic tracking-tighter">{noti.title}</div>
                                                <span className="text-[9px] font-black opacity-40">{noti.time}</span>
                                            </div>
                                            <p className="text-[12px] font-medium opacity-60 leading-tight">{noti.msg}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button className="w-full h-16 rounded-[2rem] bg-black text-white font-black uppercase tracking-widest text-[12px] border-0 shadow-2xl flex gap-3">
                            <MessageSquare className="w-5 h-5 text-leo-primary" /> Nadaj wiadomość do HQ
                        </Button>
                    </motion.div>
                )}
            </main>

            {/* DOCK NAVIGATION / COMMAND BAR */}
            <div className="fixed bottom-10 left-6 right-6 z-[100] bg-black text-white px-8 py-5 rounded-[2.5rem] shadow-3xl flex justify-between items-center border-[4px] border-white transition-all duration-500">
                <button
                    onClick={() => setActiveTab('plan')}
                    className={cn("flex flex-col items-center gap-1.5 transition-all", activeTab === 'plan' ? "opacity-100 scale-110" : "opacity-40 hover:opacity-100")}
                >
                    <Truck className={cn("w-6 h-6", activeTab === 'plan' ? "text-leo-primary" : "text-white")} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Plan</span>
                </button>
                <div className="h-10 w-[1px] bg-white/10" />
                <button
                    onClick={() => setActiveTab('map')}
                    className={cn("flex flex-col items-center gap-1.5 transition-all", activeTab === 'map' ? "opacity-100 scale-110" : "opacity-40 hover:opacity-100")}
                >
                    <MapIcon className={cn("w-6 h-6", activeTab === 'map' ? "text-leo-primary" : "text-white")} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Mapa</span>
                </button>
                <div className="h-10 w-[1px] bg-white/10" />
                <button
                    onClick={() => setActiveTab('inbox')}
                    className={cn("flex flex-col items-center gap-1.5 transition-all", activeTab === 'inbox' ? "opacity-100 scale-110" : "opacity-40 hover:opacity-100")}
                >
                    <div className="relative">
                        <MessageSquare className={cn("w-6 h-6", activeTab === 'inbox' ? "text-leo-primary" : "text-white")} />
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full border-2 border-black" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest">Inbox</span>
                </button>
            </div>

            {/* SETTINGS MODAL (Same as before) */}
            <AnimatePresence>
                {showSettings && (
                    <div className="fixed inset-0 z-[200] flex items-end justify-center">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSettings(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white rounded-t-[48px] w-full p-10 relative z-10 shadow-3xl border-t border-gray-100">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-10" />
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter italic text-black leading-tight">Ustawienia Kuriera</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Profil: Łukasz K. • LEO-PARTNER-01</p>
                                </div>
                                <div className="grid gap-3">
                                    {[
                                        { label: 'Firmy (Multi-Fleet)', val: 'DPD, DHL, LEO', icon: Truck },
                                        { label: 'Strefa Cicha (Brak powiadomień)', val: 'Wyłączona', icon: Bell },
                                        { label: 'Mój Rejon', val: 'Warszawa Wola', icon: MapPin },
                                        { label: 'Język / Tłumaczenie', val: 'Polski (PL)', icon: Globe },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <item.icon className="w-5 h-5 text-leo-primary" />
                                                <span className="text-[12px] font-black uppercase tracking-tight text-gray-900">{item.label}</span>
                                            </div>
                                            <span className="text-[11px] font-black text-gray-400 italic">{item.val}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <Button onClick={() => setShowSettings(false)} className="h-16 flex-1 rounded-[2rem] bg-black text-white font-black uppercase tracking-widest text-[12px] border-0">Zapisz Zmiany</Button>
                                    <Button onClick={() => setShowSettings(false)} variant="ghost" className="h-16 w-16 rounded-[2rem] bg-red-50 border border-red-100 flex items-center justify-center">
                                        <LogOut className="w-6 h-6 text-red-600" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="text-center pt-8 pb-32">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-leo-primary opacity-30 italic">Design and execution by lukilot.work</p>
            </div>
        </div>
    );
}
