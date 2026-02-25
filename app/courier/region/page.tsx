"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import { BarChart3, TrendingUp, TrendingDown, Target, Zap, Clock, ShieldCheck, Map } from "lucide-react";
import { motion } from "framer-motion";

export default function CourierRegion() {
    return (
        <div className="min-h-screen bg-leo-bg pb-24 relative overflow-y-auto">
            {/* Header */}
            <header className="bg-white p-6 pb-4 border-b border-leo-gray-100 sticky top-0 z-10">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-leo-primary">Mój Rejon</h1>
                        <p className="text-leo-gray-500 text-sm">Warszawa Mokotów • Sektor B</p>
                    </div>
                    <div className="h-10 w-10 bg-leo-gray-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-leo-primary" />
                    </div>
                </div>
            </header>

            <main className="p-4 space-y-4">
                {/* Score Card */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-leo-primary to-blue-900 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="h-32 w-32" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-white/80 font-medium mb-1">Status Kuriera</h2>
                        <div className="text-4xl font-black tracking-tight mb-2">Ekspert ★★★</div>
                        <div className="flex items-center gap-2 mt-4 bg-white/10 rounded-xl p-3 inline-flex backdrop-blur-sm">
                            <TrendingUp className="h-5 w-5 text-green-400" />
                            <span className="font-bold text-sm">Top 5% w regionie</span>
                        </div>
                    </div>
                </motion.div>

                <h3 className="font-semibold text-leo-gray-500 text-sm uppercase tracking-wider ml-1 mt-6">Podsumowanie Miesiąca</h3>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white p-4 rounded-2xl border border-leo-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-leo-gray-500 mb-2">
                            <Target className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Skuteczność</span>
                        </div>
                        <div className="text-2xl font-bold text-leo-gray-900">98.4%</div>
                        <div className="text-xs text-green-600 font-bold mt-1 inline-flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +1.2%</div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white p-4 rounded-2xl border border-leo-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-leo-gray-500 mb-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Śr. czas stopu</span>
                        </div>
                        <div className="text-2xl font-bold text-leo-gray-900">2m 14s</div>
                        <div className="text-xs text-green-600 font-bold mt-1 inline-flex items-center gap-0.5"><TrendingDown className="h-3 w-3" /> -12s</div>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white p-4 rounded-2xl border border-leo-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-leo-gray-500 mb-3">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase">Napiwki (Terminal k. / Zrzutka)</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="text-3xl font-bold text-green-600">412.50<span className="text-sm border-b text-green-600/60 ml-1">PLN</span></div>
                        <div className="h-8 w-24 bg-green-100 rounded-full overflow-hidden flex items-end justify-between px-1 pb-1 pt-3 gap-0.5">
                            {[40, 70, 45, 90, 60, 100, 80].map((h, i) => (
                                <div key={i} className="w-full bg-green-500 rounded-t-sm" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>
                </motion.div>

                <h3 className="font-semibold text-leo-gray-500 text-sm uppercase tracking-wider ml-1 mt-6">Zagęszczenie Rejonu</h3>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-leo-gray-100 shadow-sm overflow-hidden p-1">
                    <div className="h-48 rounded-xl bg-gray-200 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_Warsaw.png')] bg-cover opacity-60 grayscale" />

                        {/* Heatmap blur spots */}
                        <div className="absolute top-10 left-10 w-24 h-24 bg-red-500/40 rounded-full blur-xl" />
                        <div className="absolute top-20 right-16 w-32 h-32 bg-orange-500/40 rounded-full blur-xl" />
                        <div className="absolute bottom-10 left-32 w-16 h-16 bg-yellow-500/50 rounded-full blur-xl" />

                        <div className="relative z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-xs text-leo-gray-700 border border-white/40 shadow-sm flex items-center gap-2">
                            <Map className="h-4 w-4 text-leo-primary" /> Analiza hot-spotów dostępna
                        </div>
                    </div>
                </motion.div>

            </main>

            <BottomNav />
        </div>
    );
}
