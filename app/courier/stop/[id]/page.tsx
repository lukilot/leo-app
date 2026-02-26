"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/layout/BottomNav";
import { Navigation, Phone, Check, X, MapPin, Building, ArrowLeft, CheckCircle2, Loader2, Info, BrainCircuit, AlertCircle, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface PackageData {
    id: string;
    tracking_number: string;
    recipient_name: string;
    recipient_address: string;
    status: string;
    estimated_delivery_time: string;
    notes: string | null;
    plan_b_choice: string | null;
}

export default function StopDetails({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [pkg, setPkg] = useState<PackageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPackage() {
            const { data, error } = await supabase
                .from('packages')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) {
                setPkg(data as PackageData);
            } else {
                console.error("Error fetching package:", error);
            }
            setLoading(false);
        }
        fetchPackage();

        // Setup polling every 3 seconds for real-time demo effect
        const interval = setInterval(fetchPackage, 3000);
        return () => clearInterval(interval);
    }, [params.id]);

    const handleUpdateStatus = async (newStatus: "delivered" | "failed") => {
        if (!pkg) return;
        setStatusUpdating(true);

        const { error } = await supabase
            .from('packages')
            .update({ status: newStatus })
            .eq('id', pkg.id);

        if (!error) {
            setSuccessMsg(newStatus === "delivered" ? "Dostarczone pomyślnie!" : "Oznaczono jako nieudane");
            setTimeout(() => {
                router.back();
            }, 1000);
        } else {
            console.error("Error updating status:", error);
            setStatusUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-leo-bg flex items-center justify-center pb-24">
                <Loader2 className="w-8 h-8 animate-spin text-leo-primary" />
                <BottomNav />
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="min-h-screen bg-leo-bg flex flex-col items-center justify-center p-4">
                <h2 className="font-bold text-leo-primary">Błąd</h2>
                <p className="text-leo-gray-500">Nie znaleziono paczki.</p>
                <Button className="mt-4" onClick={() => router.back()}>Wróć</Button>
                <BottomNav />
            </div>
        );
    }

    const deliveryTime = new Date(pkg.estimated_delivery_time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-leo-bg pb-24 relative overflow-hidden">
            {/* Header */}
            <header className="bg-white p-4 flex items-center gap-4 border-b sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-lg font-bold truncate pr-4">{pkg.recipient_name}</h1>
                    <p className="text-xs text-leo-gray-500">ETA: {deliveryTime}</p>
                </div>
                <div className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap">
                    {pkg.status === 'in_transit' ? 'W trasie' : (pkg.status === 'delivered' ? 'Doręczono' : 'Oczekuje')}
                </div>
            </header>

            <main className="p-4 space-y-4">
                {/* Plan B Notification */}
                {pkg.plan_b_choice && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-orange-100 border-l-4 border-orange-500 p-4 rounded-r-xl flex items-start gap-3">
                        <Info className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-orange-800">Klient wybrał Plan B!</p>
                            <p className="text-sm text-orange-700 mt-1">Miejsce zostawienia paczki: <span className="font-bold">{pkg.plan_b_choice}</span></p>
                        </div>
                    </motion.div>
                )}

                {/* Address Card (Vision 2026: IPO Integrated) */}
                <Card className="border-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-leo-accent/30 p-2.5 rounded-xl">
                                <MapPin className="h-6 w-6 text-leo-primary shrink-0" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-leo-gray-900 leading-tight">{pkg.recipient_address}</h2>
                                <p className="text-[12px] font-bold text-leo-gray-400 mt-1 uppercase tracking-widest">{pkg.tracking_number} • {pkg.status === 'in_transit' ? 'W TRASIE' : 'POSTÓJ'}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-leo-gray-100/50 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <BrainCircuit className="h-4 w-4 text-leo-primary" />
                                <span className="font-bold text-[13px] text-leo-gray-700">Inteligentne Wskazówki (IPO):</span>
                            </div>
                            <p className="text-sm text-leo-gray-600 bg-leo-bg p-3 rounded-xl border border-leo-gray-100/50 leading-relaxed italic">
                                "{pkg.notes || "Klatka B, kod 1234, wejście od podwórza. Nie dzwonić dzwonkiem - dziecko śpi."}"
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Recipient Profile */}
                <div className="bg-white p-4 rounded-xl border border-leo-gray-100 space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-leo-primary/10 rounded-full flex items-center justify-center text-leo-primary font-bold text-lg">
                            {pkg.recipient_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="font-bold text-lg">{pkg.recipient_name}</div>
                            <div className="text-sm text-leo-gray-500 flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" /> +48 Zastrzeżony</div>
                        </div>
                    </div>
                </div>

                {/* Command Panel (Vision 2026: Automatic Comm) */}
                <div className="space-y-3">
                    <h3 className="font-bold text-leo-gray-400 text-[11px] uppercase tracking-[0.2em] pl-1">Panel Komend (Zero tarcia)</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border-leo-gray-200 bg-white" onClick={() => alert("Wysłano prośbę o Plan B...")}>
                            <Zap className="h-5 w-5 text-leo-primary" />
                            <span className="text-[13px] font-bold">Poproś o Plan B</span>
                        </Button>
                        <Button variant="outline" className="h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border-leo-gray-200 bg-white" onClick={() => alert("Zgłoszono problem z adresem...")}>
                            <AlertCircle className="h-5 w-5 text-orange-500" />
                            <span className="text-[13px] font-bold">Problem z adresem</span>
                        </Button>
                        <Button variant="outline" className="h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border-leo-gray-200 bg-white" onClick={() => alert("Otwieram nawigację...")}>
                            <Navigation className="h-5 w-5 text-blue-500" />
                            <span className="text-[13px] font-bold">Nawiguj</span>
                        </Button>
                        <Button variant="outline" className="h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border-leo-gray-200 bg-white" onClick={() => alert("Otwieram tłumacza...")}>
                            <Globe className="h-5 w-5 text-green-500" />
                            <span className="text-[13px] font-bold">Tłumacz AI</span>
                        </Button>
                    </div>
                </div>

                {/* Floating Bottom Action */}
                <div className="fixed bottom-[88px] left-4 right-4 z-20">
                    {!successMsg ? (
                        <div className="flex gap-2">
                            <Button
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/20 h-16 text-xl rounded-2xl"
                                onClick={() => handleUpdateStatus("delivered")}
                                disabled={statusUpdating || pkg.status === 'delivered'}
                            >
                                {statusUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="mr-2 h-6 w-6 font-bold" /> Doręczone</>}
                            </Button>
                            <Button
                                className="w-16 h-16 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-sm rounded-2xl"
                                onClick={() => handleUpdateStatus("failed")}
                                disabled={statusUpdating || pkg.status === 'delivered'}
                            >
                                {statusUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : <X className="h-7 w-7" />}
                            </Button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-leo-primary text-white p-4 h-16 rounded-2xl text-center shadow-xl font-bold flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="h-6 w-6" /> {successMsg}
                        </motion.div>
                    )}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
