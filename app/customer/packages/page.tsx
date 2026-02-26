"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/layout/BottomNav";
import { Truck, Calendar, Clock, ChevronRight, Archive, Loader2, Bell, User, CheckCircle, BrainCircuit, Box } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

interface PackageData {
    id: string;
    tracking_number: string;
    recipient_name: string;
    status: string;
    estimated_delivery_time: string;
}

function formatDeliveryTime(dateString: string | null) {
    if (!dateString) return { date: '-', time: '-' };
    const d = new Date(dateString);
    const dateStr = d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
    const timeStr = d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    return { date: dateStr, time: `${timeStr} - ${new Date(d.getTime() + 15 * 60000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}` };
}

function translateStatus(status: string) {
    switch (status) {
        case 'pending': return 'Oczekująca';
        case 'in_transit': return 'W doręczeniu';
        case 'delivered': return 'Doręczono';
        case 'failed': return 'Nieudana próba';
        default: return status;
    }
}

export default function CustomerPackages() {
    const [tab, setTab] = useState<"active" | "history">("active");
    const [packages, setPackages] = useState<PackageData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPackages() {
            setLoading(true);
            const { data, error } = await supabase.from('packages').select('*').order('created_at', { ascending: false });
            if (data) {
                setPackages(data as PackageData[]);
            } else {
                console.error("Error fetching packages:", error);
            }
            setLoading(false);
        }
        fetchPackages();
    }, []);

    const activePackages = packages.filter(p => p.status !== 'delivered' && p.status !== 'failed');
    const historyPackages = packages.filter(p => p.status === 'delivered' || p.status === 'failed');

    return (
        <div className="min-h-screen bg-leo-bg pb-24 font-sans selection:bg-leo-primary/10">
            <header className="bg-leo-bg px-5 pt-14 pb-4 sticky top-0 z-10 flex items-center justify-between">
                <h1 className="text-[28px] font-bold tracking-tight text-leo-gray-900">Moje paczki</h1>
                <div className="flex items-center gap-3">
                    <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white hover:bg-leo-gray-50 border border-leo-gray-100 transition-colors">
                        <Bell className="h-5 w-5 text-leo-gray-600" />
                    </button>
                    <div className="h-10 w-10 rounded-full bg-leo-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                        <User className="h-6 w-6 text-leo-gray-500 mt-1" />
                    </div>
                </div>
            </header>

            <main className="px-5 space-y-6">
                {/* Nearest Delivery Hero Card */}
                <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-leo-gray-100/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-leo-primary/5 to-transparent rounded-bl-full pointer-events-none" />

                    <div className="flex justify-between items-start mb-1 relative z-10">
                        <span className="text-sm font-semibold text-leo-gray-500">Najbliższa dostawa</span>
                    </div>

                    <div className="flex items-end gap-3 mb-4 relative z-10">
                        <h2 className="text-4xl font-extrabold text-leo-primary tracking-tight">Za 25 min</h2>
                    </div>

                    <div className="flex items-center gap-2 mb-5 relative z-10">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-leo-accent text-leo-primary text-[11px] font-bold uppercase tracking-wider">
                            <Truck className="w-3 h-3 mr-1" /> W drodze
                        </div>
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[11px] font-bold tracking-wider">
                            <CheckCircle className="w-3 h-3 mr-1" /> Pewność doręczenia: Wysoka
                        </div>
                    </div>

                    <div className="bg-leo-bg rounded-2xl p-4 flex gap-3 items-center mb-5 border border-leo-gray-100/50">
                        <BrainCircuit className="w-6 h-6 text-leo-primary shrink-0" />
                        <p className="text-[13px] leading-tight text-leo-gray-700">
                            <strong>System wie:</strong> Masz wysoką szansę<br />
                            doręczenia dziś <strong>18:10–18:40</strong>
                        </p>
                    </div>

                    <Link href="/customer/live?tracking=mock" className="block relative z-10">
                        <Button className="w-full h-[48px] rounded-2xl bg-leo-primary text-white font-semibold text-[15px] shadow-[0_4px_14px_rgba(232,93,4,0.25)] hover:shadow-[0_6px_20px_rgba(232,93,4,0.3)] border-0">
                            Zarządzaj <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>

                {/* Horizontal Scroll Filter Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x -mx-5 px-5">
                    <button className="whitespace-nowrap rounded-full border border-leo-accent bg-leo-accent/30 text-leo-primary px-4 py-1.5 text-sm font-bold shadow-sm focus:outline-none snap-start shrink-0">
                        W drodze
                    </button>
                    <button className="whitespace-nowrap rounded-full border border-leo-gray-200 bg-white text-leo-gray-600 px-4 py-1.5 text-sm font-medium hover:bg-leo-gray-50 focus:outline-none snap-start shrink-0 transition-colors">
                        Do odebrania
                    </button>
                    <button className="whitespace-nowrap rounded-full border border-leo-gray-200 bg-white text-leo-gray-600 px-4 py-1.5 text-sm font-medium hover:bg-leo-gray-50 focus:outline-none snap-start shrink-0 transition-colors">
                        Dostarczone
                    </button>
                    <button className="whitespace-nowrap rounded-full border border-leo-gray-200 bg-white text-leo-gray-600 px-4 py-1.5 text-sm font-medium hover:bg-leo-gray-50 focus:outline-none snap-start shrink-0 transition-colors">
                        Zwroty
                    </button>
                </div>

                {/* Package List matching mockup cards */}
                <div className="space-y-3">
                    {/* Item 1 - W drodze */}
                    <div className="bg-white rounded-[20px] p-4 flex gap-4 items-center border border-leo-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="w-12 h-12 rounded-full bg-leo-accent/40 flex items-center justify-center shrink-0">
                            <Box className="w-6 h-6 text-leo-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[15px] text-leo-gray-900 truncate">ul. Kwiatowa 15, 00-001 Warszawa</h3>
                            <p className="text-[13px] text-leo-gray-500 mb-1">Odbiorca: Anna Kowalska</p>
                            <p className="text-[11px] font-medium text-leo-gray-400">
                                Status: <span className="text-leo-primary font-bold">W drodze</span> | 17:30–19:30 | Kurier
                            </p>
                        </div>
                    </div>

                    {/* Item 2 - Do odebrania */}
                    <div className="bg-white rounded-[20px] p-4 flex gap-4 items-center border border-leo-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                            <Box className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[15px] text-leo-gray-900 truncate">ul. Kwiatowa 15, 00-001 Warszawa</h3>
                            <p className="text-[13px] text-leo-gray-500 mb-1">Odbiorca: Anna Kowalska</p>
                            <p className="text-[11px] font-medium text-leo-gray-400">
                                Status: <span className="text-green-600">Do odebrania</span> | Paczkomat, do 48h | InPost
                            </p>
                        </div>
                    </div>

                    {/* Item 3 - Dostarczone */}
                    <div className="bg-white rounded-[20px] p-4 flex gap-4 items-center border border-leo-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="w-12 h-12 rounded-full bg-leo-gray-100 flex items-center justify-center shrink-0">
                            <Box className="w-6 h-6 text-leo-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[15px] text-leo-gray-900 truncate">ul. Kwiatowa 15, 00-001 Warszawa</h3>
                            <p className="text-[13px] text-leo-gray-500 mb-1">Odbiorca: Anna Kowalska</p>
                            <p className="text-[11px] font-medium text-leo-gray-400">
                                Status: <span className="text-leo-gray-600">Dostarczone</span> | 14:20 | Kurier
                            </p>
                        </div>
                    </div>

                    {/* Item 4 - Zwroty */}
                    <div className="bg-white rounded-[20px] p-4 flex gap-4 items-center border border-leo-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                            <Box className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[15px] text-leo-gray-900 truncate">ul. Kwiatowa 15, 00-001 Warszawa</h3>
                            <p className="text-[13px] text-leo-gray-500 mb-1">Odbiorca: Anna Kowalska</p>
                            <p className="text-[11px] font-medium text-leo-gray-400">
                                Status: <span className="text-orange-500">Zwroty</span> | Weryfikacja | Sklep
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
