"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BottomNav } from "@/components/layout/BottomNav";
import { Map, Navigation, CheckCircle2, Loader2, Play } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface PackageData {
    id: string;
    tracking_number: string;
    recipient_name: string;
    recipient_address: string;
    status: string;
    estimated_delivery_time: string;
}

export default function CourierDay() {
    const [status, setStatus] = useState<"idle" | "calculating" | "ready" | "started">("idle");
    const [packages, setPackages] = useState<PackageData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPackages() {
            const { data, error } = await supabase
                .from('packages')
                .select('*')
                .in('status', ['pending', 'in_transit'])
                .order('estimated_delivery_time', { ascending: true });

            if (data) {
                setPackages(data as PackageData[]);
            } else {
                console.error("Error fetching packages:", error);
            }
            setLoading(false);
        }

        fetchPackages();

        // Setup polling every 3 seconds for real-time demo effect
        const interval = setInterval(fetchPackages, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleCalculateRate = () => {
        setStatus("calculating");
        // Simulate algorithm loading
        setTimeout(() => {
            setStatus("ready");
        }, 2000);
    };

    const handleStartRoute = async () => {
        setStatus("started");
        // Mark all 'pending' as 'in_transit'
        if (packages.length > 0) {
            const pendingIds = packages.filter(p => p.status === 'pending').map(p => p.id);
            if (pendingIds.length > 0) {
                await supabase
                    .from('packages')
                    .update({ status: 'in_transit' })
                    .in('id', pendingIds);

                // Refresh local state to reflect in_transit
                setPackages(packages.map(p =>
                    pendingIds.includes(p.id) ? { ...p, status: 'in_transit' } : p
                ));
            }
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

    return (
        <div className="min-h-screen bg-leo-bg pb-24 relative">
            {/* Header */}
            <header className="bg-white p-6 pb-4 border-b border-leo-gray-100 sticky top-0 z-10">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-leo-primary">Dzień dobry!</h1>
                        <p className="text-leo-gray-500 text-sm">{new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                    <div className="h-10 w-10 bg-leo-gray-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-leo-primary">LK</span>
                    </div>
                </div>
            </header>

            <main className="p-4 space-y-4">
                {/* State: IDLE (Imported Packages) */}
                {status === "idle" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Plan dnia</CardTitle>
                                <CardDescription>Podsumowanie zaimportowanych przesyłek</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-leo-primary">{packages.length}</div>
                                    <div className="text-xs text-leo-gray-500">Paczki</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-leo-primary">{Math.round(packages.length * 4.5)}<span className="text-sm font-normal">km</span></div>
                                    <div className="text-xs text-leo-gray-500">Dystans</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-leo-primary">{Math.max(1, Math.round(packages.length * 0.4))}<span className="text-sm font-normal">h</span></div>
                                    <div className="text-xs text-leo-gray-500">Czas</div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-blue-800 text-sm">
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                            <div>
                                <p className="font-semibold">Mocny start!</p>
                                <p>Jakość planu: 98%. Pojemność auta: 85%.</p>
                            </div>
                        </div>

                        <Button size="lg" className="w-full h-14 text-lg mt-8 shadow-lg shadow-leo-primary/20" onClick={handleCalculateRate} disabled={packages.length === 0}>
                            Ułóż trasę optymalną
                        </Button>
                    </motion.div>
                )}

                {/* State: CALCULATING */}
                {status === "calculating" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-8"
                    >
                        <div className="h-24 w-24 relative mb-8">
                            <motion.div
                                className="absolute inset-0 border-4 border-leo-gray-100 rounded-full"
                            />
                            <motion.div
                                className="absolute inset-0 border-4 border-t-leo-primary border-r-transparent border-b-transparent border-l-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-leo-primary">LEO</span>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-leo-primary">Optymalizacja trasy...</h2>
                        <p className="text-leo-gray-500 mt-2">Analizuję okna czasowe i korki w Warszawie.</p>
                    </motion.div>
                )}

                {/* State: READY (Route View) */}
                {(status === "ready" || status === "started") && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        {status === "ready" && (
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-green-800">Trasa gotowa!</h3>
                                    <p className="text-xs text-green-700">Oszczędność czasu: 45 min</p>
                                </div>
                                <Button size="sm" onClick={handleStartRoute} className="bg-green-600 hover:bg-green-700 text-white">
                                    <Play className="h-4 w-4 mr-1 fill-current" /> Start
                                </Button>
                            </div>
                        )}

                        {status === "started" && packages.length > 0 && (
                            <div className="bg-leo-primary text-white p-4 rounded-xl shadow-lg mb-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg flex items-center"><Navigation className="h-4 w-4 mr-2" /> W trasie</h3>
                                        <p className="text-white/80 text-sm mt-1 truncate">Następny cel: {packages[0].recipient_address}</p>
                                    </div>
                                    <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold shrink-0 ml-4">
                                        ETA {new Date(packages[0].estimated_delivery_time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* List of stops */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-leo-gray-500 text-sm uppercase tracking-wider ml-1">Kolejność punktów</h3>

                            {packages.map((pkg, i) => {
                                const deliveryTime = new Date(pkg.estimated_delivery_time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
                                return (
                                    <Link href={`/courier/stop/${pkg.id}`} key={pkg.id} className="block w-full">
                                        <Card className="active:scale-[0.98] transition-transform hover:shadow-md hover:border-leo-primary/30">
                                            <CardContent className="p-4 flex gap-4 items-center">
                                                <div className="h-10 w-10 bg-leo-gray-100 rounded-full flex items-center justify-center shrink-0 font-bold text-leo-gray-600 border border-leo-gray-200">
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-semibold text-leo-gray-900 truncate pr-2">{pkg.recipient_address}</span>
                                                        <span className="text-xs bg-leo-primary/10 px-2 py-0.5 rounded-full text-leo-primary font-bold shrink-0">{deliveryTime}</span>
                                                    </div>
                                                    <div className="text-sm text-leo-gray-500 mt-0.5 truncate">{pkg.recipient_name} • {pkg.tracking_number}</div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}

                            {packages.length === 0 && (
                                <div className="text-center py-8 text-leo-gray-500 border border-dashed border-leo-gray-200 rounded-xl">
                                    Wszystkie paczki doręczone!
                                </div>
                            )}
                        </div>

                        {/* Map Placeholder */}
                        {packages.length > 0 && (
                            <div className="h-48 bg-leo-gray-200 rounded-xl flex items-center justify-center border border-leo-gray-300 relative overflow-hidden mt-6">
                                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_Warsaw.png')] bg-cover opacity-50 grayscale" />
                                <Button variant="secondary" size="sm" className="relative z-10 shadow-md">
                                    <Map className="mr-2 h-4 w-4" /> Pokaż mapę z trasą
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
