"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/layout/BottomNav";
import { Truck, Calendar, Clock, ChevronRight, Archive, Loader2 } from "lucide-react";
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
        <div className="min-h-screen bg-leo-bg pb-24">
            <header className="bg-white p-6 sticky top-0 z-10 border-b border-leo-gray-100">
                <h1 className="text-2xl font-bold text-leo-primary">Twoje przesyłki</h1>
                <div className="flex gap-4 mt-4 relative">
                    <button
                        onClick={() => setTab("active")}
                        className={cn("pb-2 text-sm font-medium transition-colors relative", tab === "active" ? "text-leo-primary" : "text-leo-gray-400")}
                    >
                        Aktywne ({loading ? '-' : activePackages.length})
                        {tab === "active" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-leo-primary" />}
                    </button>
                    <button
                        onClick={() => setTab("history")}
                        className={cn("pb-2 text-sm font-medium transition-colors relative", tab === "history" ? "text-leo-primary" : "text-leo-gray-400")}
                    >
                        Historia
                        {tab === "history" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-leo-primary" />}
                    </button>
                </div>
            </header>

            <main className="p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center items-center py-12 text-leo-primary">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {tab === "active" ? (
                            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                {activePackages.length === 0 ? (
                                    <div className="text-center py-10 text-leo-gray-500">Brak aktywnych przesyłek.</div>
                                ) : (
                                    activePackages.map(pkg => {
                                        const { date, time } = formatDeliveryTime(pkg.estimated_delivery_time);
                                        return (
                                            <Card key={pkg.id} className="border-l-4 border-l-leo-primary hover:shadow-md transition-shadow">
                                                <CardContent className="p-5">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 bg-leo-primary/10 rounded-full flex items-center justify-center text-leo-primary">
                                                                <Truck className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                {/* Mock brand name, in reality would come from sender data */}
                                                                <h3 className="font-bold text-leo-gray-900">Sklep On-line</h3>
                                                                <p className="text-xs text-leo-gray-500">{pkg.tracking_number}</p>
                                                            </div>
                                                        </div>
                                                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                                            {translateStatus(pkg.status)}
                                                        </span>
                                                    </div>

                                                    <div className="bg-leo-gray-50 rounded-lg p-3 grid grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <div className="text-xs text-leo-gray-500 flex items-center gap-1"><Calendar className="h-3 w-3" /> Planowana data</div>
                                                            <div className="font-bold text-leo-primary">{date}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-leo-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Okno</div>
                                                            <div className="font-bold text-leo-primary">{time}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Link href={`/customer/live?tracking=${pkg.tracking_number}`} className="w-full">
                                                            <Button className="w-full bg-leo-primary text-white">Śledź na żywo</Button>
                                                        </Link>
                                                        <Button variant="outline" className="px-3">
                                                            <Clock className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                )}
                            </motion.div>
                        ) : (
                            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                {historyPackages.length === 0 ? (
                                    <div className="text-center py-10 text-leo-gray-500">Brak historii przesyłek.</div>
                                ) : (
                                    historyPackages.map(pkg => (
                                        <div key={pkg.id} className="flex items-center p-4 bg-white rounded-xl border border-leo-gray-100">
                                            <div className="h-10 w-10 bg-leo-gray-50 rounded-full flex items-center justify-center text-leo-gray-400 mr-4">
                                                <Archive className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">Sklep On-line</div>
                                                <div className="text-xs text-leo-gray-500">{translateStatus(pkg.status)} {formatDeliveryTime(pkg.estimated_delivery_time).date}</div>
                                            </div>
                                            <div className="ml-auto">
                                                <ChevronRight className="h-5 w-5 text-leo-gray-300" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
