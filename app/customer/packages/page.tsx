"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Truck, ChevronRight, Loader2, Bell, User, CheckCircle, BrainCircuit,
    Box, ShieldCheck, MapPin, Sparkles, Map as MapIcon, Calendar, Users, Home,
    Smartphone, Search, ArrowRight, Settings, LogOut, PackageSearch,
    RefreshCw, X, MessageSquare, ListFilter, ClipboardCheck, ArrowLeft, ArrowRightLeft,
    Navigation as NavigationIcon
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
    status: 'in_transit' | 'delivered' | 'pending' | 'exception';
    estimated_delivery_time: string;
    address: string;
    sender: string;
    window_start?: string;
    window_end?: string;
}

export default function CustomerPackages() {
    const [packages, setPackages] = useState<PackageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [showIPO, setShowIPO] = useState(false);
    const [activeTab, setActiveTab] = useState<'packages' | 'points' | 'returns'>('packages');

    const fetchPackages = async () => {
        try {
            const { data } = await supabase
                .from('packages')
                .select('*')
                .order('created_at', { ascending: false });

            if (data && data.length > 0) {
                setPackages(data as PackageData[]);
            } else {
                setPackages([
                    { id: '1', tracking_number: 'LEO-9921-X', recipient_name: 'Tomasz', status: 'in_transit', address: 'ul. Marszałkowska 10, WWA', sender: 'Zalando', estimated_delivery_time: new Date().toISOString() },
                    { id: '2', tracking_number: 'LEO-4410-Z', recipient_name: 'Tomasz', status: 'delivered', address: 'ul. Marszałkowska 10, WWA', sender: 'Apple Store', estimated_delivery_time: new Date().toISOString() }
                ]);
            }
        } catch (e) {
            console.error("Fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
        setTimeout(() => setLoading(false), 1200);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans tracking-widest text-[#1A1A1A]">
                <div className="relative mb-8">
                    <div className="w-12 h-12 border-2 border-leo-primary/10 rounded-full animate-ping absolute inset-0" />
                    <Sparkles className="w-12 h-12 text-leo-primary animate-pulse" />
                </div>
                <p className="text-[10px] font-black uppercase italic tracking-[0.4em] text-gray-400">Moje Paczki • LEO Secured</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-32 font-sans selection:bg-leo-primary/10 select-none">
            {/* ULTRA-PREMIUM HEADER */}
            <header className="px-6 pt-16 pb-6 sticky top-0 z-[100] bg-white/80 backdrop-blur-3xl border-b border-gray-100/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div onClick={() => setShowIPO(true)} className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-[11px] uppercase shadow-2xl shadow-black/20 cursor-pointer active:scale-95 transition-transform border border-white/10 ring-4 ring-leo-primary/5">
                        TT
                    </div>
                    <div>
                        <h1 className="text-[22px] font-black tracking-tighter text-gray-900 uppercase leading-none italic">
                            {activeTab === 'packages' && <>MOJE <span className="text-leo-primary">PACZKI</span></>}
                            {activeTab === 'points' && <>MOJA <span className="text-leo-primary">MAPA</span></>}
                            {activeTab === 'returns' && <>MOJE <span className="text-leo-primary">ZWROTY</span></>}
                        </h1>
                        <div className="flex items-center gap-2 mt-1.5 grayscale opacity-60">
                            <ShieldCheck className="w-3 h-3 text-leo-primary" />
                            <span className="text-[8px] font-black uppercase tracking-widest">IPO: Aktywne • Vision 2026</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 relative active:scale-90 transition-transform">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-3.5 right-3.5 h-2 w-2 bg-red-600 rounded-full ring-2 ring-white" />
                    </button>
                    <button onClick={() => setShowSettings(true)} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 active:scale-90 transition-transform">
                        <Settings className="h-5 w-5" />
                    </button>
                </div>
            </header>

            <main className="px-6 pt-8 space-y-10">
                {activeTab === 'packages' && (
                    <>
                        {/* 1. IPO STATUS CARD */}
                        <section onClick={() => setShowIPO(true)} className="bg-white rounded-[40px] p-8 border border-white shadow-3xl shadow-gray-200/40 relative overflow-hidden group active:scale-98 transition-transform cursor-pointer">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                                <User className="w-24 h-24" />
                            </div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-3 w-3 bg-leo-primary rounded-full animate-pulse shadow-[0_0_10px_#FFD700]" />
                                    <span className="text-[10px] font-black text-leo-primary uppercase tracking-widest">Inteligentny Profil Odbiorcy</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic text-gray-900 leading-none">Cześć, Tomasz.</h3>
                            <p className="text-[12px] text-gray-400 mt-3 font-medium leading-relaxed">
                                Twoje preferencje Planu B są <span className="text-black font-black underline decoration-leo-primary decoration-4">skonfigurowane</span>. System wie, gdzie zostawić paczkę pod Twoją nieobecność.
                            </p>
                        </section>

                        {/* 2. ACTIVE DELIVERY */}
                        <section className="space-y-6">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Dostawy w Toku</h2>
                            <div className="space-y-4">
                                {packages.filter(p => p.status !== 'delivered').map((pkg) => (
                                    <Link key={pkg.id} href="/customer/live" className="block">
                                        <motion.div className="bg-black text-white rounded-[40px] p-8 space-y-8 shadow-2xl relative overflow-hidden group active:scale-[0.97] transition-transform">
                                            <div className="absolute inset-0 bg-gradient-to-br from-leo-primary/10 to-transparent" />
                                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                                <Truck className="w-24 h-24" />
                                            </div>
                                            <div className="flex justify-between items-start relative z-10">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-leo-primary flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-leo-primary rounded-full animate-pulse" />
                                                    Doręczenie Dziś
                                                </div>
                                                <span className="text-[14px] font-black font-mono tracking-tighter italic opacity-60">{pkg.tracking_number}</span>
                                            </div>
                                            <div className="space-y-2 relative z-10">
                                                <div className="text-[11px] font-black text-white/40 uppercase tracking-widest">Moje okno 15-minutowe</div>
                                                <div className="text-5xl font-black italic tracking-tighter text-leo-primary">14:15 - 14:30</div>
                                            </div>
                                            <div className="flex justify-between items-end relative z-10 pt-4 border-t border-white/10">
                                                <div className="flex gap-3">
                                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                                        <MapIcon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-black uppercase leading-none">{pkg.sender}</div>
                                                        <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1.5">Kliknij, by śledzić live</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[9px] font-black text-leo-primary uppercase tracking-widest mb-1 italic">Plan B: Aktywny</div>
                                                    <div className="text-[13px] font-black uppercase opacity-60">U sąsiada</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* 3. HISTORY */}
                        <section className="space-y-6">
                            <div className="flex justify-between items-end px-1">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Ostatnio Odebrane</h2>
                                <button className="text-[10px] font-black text-leo-primary uppercase tracking-widest border-b-2 border-leo-primary/20 pb-0.5">Wszystkie</button>
                            </div>
                            <div className="grid gap-4">
                                {packages.filter(p => p.status === 'delivered').map((pkg) => (
                                    <div key={pkg.id} className="bg-white rounded-[32px] p-6 border border-gray-100 flex items-center justify-between shadow-sm group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-gray-50 rounded-[22px] flex items-center justify-center text-green-500 border border-gray-100 shadow-inner">
                                                <CheckCircle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-[15px] font-black text-black leading-none uppercase italic tracking-tighter">{pkg.sender}</div>
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">Dostarczono wczoraj, 12:42</div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="h-10 px-4 rounded-xl bg-gray-50 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] hover:bg-leo-primary hover:text-black transition-all">Zwrot</Button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {activeTab === 'points' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <section className="bg-white rounded-[40px] p-4 border border-white shadow-3xl relative overflow-hidden h-[450px]">
                            <LEOMap
                                theme="consumer"
                                markers={[
                                    { id: 'hub-04', latitude: 52.235, longitude: 21.012, label: 'HUB WWA-04', type: 'hub' },
                                    { id: 'point-wola', latitude: 52.228, longitude: 21.018, label: 'Punkt LEO Wola', type: 'hub' },
                                    { id: 'zabka-leo', latitude: 52.232, longitude: 20.998, label: 'Zabka LEO', type: 'hub' }
                                ]}
                                initialViewState={{
                                    latitude: 52.23,
                                    longitude: 21.01,
                                    zoom: 13
                                }}
                            />

                            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-2xl space-y-4 z-10">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[12px] font-black uppercase tracking-tighter">Najbliższy punkt LEO</h4>
                                    <span className="text-[10px] font-black text-leo-primary uppercase">Czynne do 22:00</span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Dystans</div>
                                        <div className="text-[16px] font-black italic italic">400 m</div>
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Miejsca</div>
                                        <div className="text-[16px] font-black italic italic">12 Free</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-[40px] p-8 space-y-6">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Planowanie Odbioru</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <Button className="h-14 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest border-0 flex gap-2">
                                    <NavigationIcon className="w-4 h-4 text-leo-primary" /> Prowadź do najbliższego punktu
                                </Button>
                            </div>
                        </section>
                    </motion.div>
                )}

                {activeTab === 'returns' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 flex-1">
                        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-3xl text-center space-y-8">
                            <div className="w-20 h-20 bg-leo-primary/10 rounded-[32px] flex items-center justify-center mx-auto">
                                <RefreshCw className="w-10 h-10 text-leo-primary" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Nadaj Zwrot <br />Bez Etykiety</h2>
                                <p className="text-[12px] text-gray-400 font-medium leading-relaxed">System Vision 2026 pozwala na zwrot w 3 sekundy. Wygeneruj kod i zostaw paczkę w dowolnym punkcie LEO.</p>
                            </div>
                            <Button className="w-full h-18 rounded-3xl bg-black text-white text-[14px] font-black uppercase tracking-widest shadow-2xl border-0 py-6">Generuj Kod Zwrotu</Button>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Oczekujące na zwrot</h3>
                            <div className="bg-white rounded-[40px] p-8 border border-gray-100 flex items-center justify-between opacity-40">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                        <ArrowRightLeft className="w-5 h-5 text-gray-300" />
                                    </div>
                                    <div className="text-[14px] font-black uppercase text-gray-400 italic">Brak aktywnych zwrotów</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* DOCK NAVIGATION (MOBILE) */}
            <div className="fixed bottom-10 left-6 right-6 z-[100] bg-white text-black px-8 py-5 rounded-[2.5rem] shadow-3xl shadow-gray-200/50 flex justify-between items-center border-[4px] border-white">
                <button
                    onClick={() => setActiveTab('packages')}
                    className={cn("flex flex-col items-center gap-1.5 transition-all", activeTab === 'packages' ? "text-leo-primary scale-110" : "text-gray-300")}
                >
                    <Box className="w-6 h-6" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Paczki</span>
                </button>
                <div className="h-10 w-[1px] bg-gray-100" />
                <button
                    onClick={() => setActiveTab('points')}
                    className={cn("flex flex-col items-center gap-1.5 transition-all", activeTab === 'points' ? "text-leo-primary scale-110" : "text-gray-300")}
                >
                    <MapPin className="w-6 h-6" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Punkty</span>
                </button>
                <div className="h-10 w-[1px] bg-gray-100" />
                <button
                    onClick={() => setActiveTab('returns')}
                    className={cn("flex flex-col items-center gap-1.5 transition-all", activeTab === 'returns' ? "text-leo-primary scale-110" : "text-gray-300")}
                >
                    <RefreshCw className="w-6 h-6" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Zwroty</span>
                </button>
            </div>

            {/* IPO MODAL (INTELIGENTNY PROFIL ODBIORCY) */}
            <AnimatePresence>
                {showIPO && (
                    <div className="fixed inset-0 z-[200] flex items-end justify-center">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowIPO(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="bg-white rounded-t-[48px] w-full p-12 relative z-10 shadow-3xl border-t border-white/10"
                        >
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-10" />
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-leo-primary/10 rounded-full border border-leo-primary/20">
                                        <Sparkles className="w-3.5 h-3.5 text-leo-primary" />
                                        <span className="text-[10px] font-black text-leo-primary uppercase tracking-widest">LEO Secured IPO Portal</span>
                                    </div>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter italic text-black leading-none">Mój Profil Odbiorcy</h3>
                                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-widest italic">Twoja tożsamość w logistyce naturalnej</p>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-300">Moje Instrukcje dla Kurierów</h4>
                                    <div className="grid gap-3">
                                        <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <Smartphone className="w-5 h-5 text-leo-primary" />
                                                    <span className="text-[14px] font-black uppercase">Kod do Bramy</span>
                                                </div>
                                                <span className="text-[14px] font-black italic">#1291</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <Home className="w-5 h-5 text-gray-400" />
                                                    <span className="text-[14px] font-black uppercase">Miejsce doręczenia</span>
                                                </div>
                                                <span className="text-[14px] font-black italic text-gray-400">Pod wycieraczką</span>
                                            </div>
                                        </div>
                                        <Button className="w-full h-16 rounded-3xl bg-black text-white font-black uppercase tracking-widest text-[12px] border-0 shadow-xl shadow-black/10">Edytuj Instrukcje IPO</Button>
                                    </div>
                                </div>

                                <div className="space-y-6 overflow-hidden">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-300">Zapisane Adresy</h4>
                                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                                        {['Dom (WWA)', 'Biuro (Sienna)', 'Rodzice'].map((adr, i) => (
                                            <div key={i} className="flex-none w-48 p-6 bg-gray-50 border border-gray-100 rounded-3xl space-y-2">
                                                <div className="text-[14px] font-black uppercase italic italic">{adr}</div>
                                                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Marszałkowska 10/12...</div>
                                            </div>
                                        ))}
                                    </div>
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
