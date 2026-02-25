"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Navigation, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CourierRoute() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-leo-bg flex flex-col items-center justify-center pb-24">
                <Loader2 className="w-8 h-8 animate-spin text-leo-primary mb-4" />
                <p className="text-leo-gray-500">Wczytywanie mapy tras...</p>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-leo-bg flex flex-col relative overflow-hidden">
            {/* Overlay UI */}
            <div className="absolute top-0 left-0 right-0 z-20 p-6 pointer-events-none">
                <div className="flex gap-4 items-start pointer-events-auto">
                    <Button variant="secondary" size="icon" className="shadow-lg bg-white/90 backdrop-blur-md border border-white/20 h-12 w-12 rounded-full" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/20 flex-1">
                        <div className="text-xs font-bold text-leo-gray-500 uppercase tracking-widest mb-1">Aktywny cel</div>
                        <h2 className="font-bold text-leo-primary leading-tight">ul. Przykładowa 12/4A</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase">ETA 10:15</span>
                            <span className="text-xs text-leo-gray-500 font-medium">1.2 km</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simulated Map */}
            <div className="flex-1 relative bg-gray-300">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_Warsaw.png')] bg-cover opacity-80" />

                {/* Simulated Route Line (SVG overlay) */}
                <svg className="absolute inset-0 w-full h-full drop-shadow-lg" style={{ pointerEvents: 'none' }}>
                    <path
                        d="M 150 550 Q 200 450 180 350 T 250 250 T 350 150"
                        fill="none"
                        stroke="#000"
                        strokeWidth="5"
                        strokeDasharray="10, 10"
                        className="opacity-50"
                    />
                    <path
                        d="M 150 550 Q 200 450 180 350 T 250 250 T 350 150"
                        fill="none"
                        stroke="#4A6572"
                        strokeWidth="5"
                        strokeDasharray="1000"
                        strokeDashoffset="0"
                    />
                </svg>

                {/* Destination Pin */}
                <div className="absolute top-[140px] left-[340px] h-6 w-6 bg-green-500 rounded-full border-4 border-white shadow-xl ring-4 ring-green-500/20 z-10" />

                {/* Courier Pin */}
                <div className="absolute top-[540px] left-[140px] h-14 w-14 text-leo-primary z-10 drop-shadow-2xl">
                    <Navigation className="h-full w-full fill-current" />
                </div>
            </div>

            {/* Bottom Panel */}
            <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-6 relative z-20 pb-[100px]">
                <div className="h-1 w-12 bg-gray-200 rounded-full mx-auto mb-6" />
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="text-3xl font-bold text-leo-gray-900">4 min</div>
                        <div className="text-leo-gray-500">1.2 km • 10:15</div>
                    </div>
                    <Button size="lg" className="bg-red-50 text-red-600 hover:bg-red-100 shadow-none font-bold">
                        Zakończ trasy
                    </Button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
