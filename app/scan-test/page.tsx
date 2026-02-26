"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic import — avoids SSR crash (camera API is browser-only)
const ZXingScanner = dynamic(() => import("@/components/ZXingScanner"), {
    ssr: false,
    loading: () => (
        <div className="aspect-square w-full max-w-sm rounded-[2rem] bg-zinc-900 flex items-center justify-center mx-auto">
            <div className="w-8 h-8 border-2 border-t-transparent border-leo-primary rounded-full animate-spin" />
        </div>
    ),
});

export default function ScannerTestPage() {
    const [lastScanned, setLastScanned] = useState<string | null>(null);
    const [count, setCount] = useState(0);
    const [key, setKey] = useState(0); // reset scanner after each scan

    function handleScan(code: string) {
        setLastScanned(code);
        setCount(c => c + 1);
        // Reset scanner after 2s to scan again
        setTimeout(() => setKey(k => k + 1), 2000);
    }

    return (
        <div className="min-h-screen bg-black font-sans flex flex-col">
            {/* Header */}
            <header className="px-6 pt-14 pb-6 flex items-center gap-4">
                <Link href="/">
                    <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </div>
                </Link>
                <div>
                    <h1 className="text-[18px] font-black italic tracking-tighter uppercase text-white leading-none">
                        Test <span className="text-leo-primary">Skanera</span>
                    </h1>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-0.5">
                        LEO QR / Barcode Scanner
                    </p>
                </div>
                {count > 0 && (
                    <div className="ml-auto h-8 px-3 bg-leo-primary/20 rounded-xl flex items-center">
                        <span className="text-[11px] font-black text-leo-primary">{count}x zeskanowano</span>
                    </div>
                )}
            </header>

            {/* Scanner */}
            <div className="flex-1 flex flex-col items-center px-6 pt-2 pb-16">
                <ZXingScanner
                    key={key}
                    onScan={handleScan}
                    className="w-full max-w-sm"
                    label="Skanuj kod paczki lub QR"
                />

                {/* Last scan result */}
                <AnimatePresence>
                    {lastScanned && (
                        <motion.div
                            key={lastScanned + count}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-8 w-full max-w-sm"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-leo-primary/20 rounded-2xl flex items-center justify-center">
                                        <Package className="w-5 h-5 text-leo-primary" />
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">Ostatni skan</div>
                                        <div className="text-white font-black text-[15px] font-mono break-all">{lastScanned}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-leo-primary uppercase tracking-widest">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Zeskanowano pomyślnie
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Instructions */}
                <div className="mt-8 w-full max-w-sm space-y-2">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest text-center">Instrukcja testowania</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-white/40 font-medium">
                        <div className="bg-white/5 rounded-xl p-3">📱 Skieruj kamerę na kod QR lub kreskowy</div>
                        <div className="bg-white/5 rounded-xl p-3">🔁 Przycisk ↔️ przełącza przód/tył kamerę</div>
                        <div className="bg-white/5 rounded-xl p-3">✅ Wibracja = poprawny skan</div>
                        <div className="bg-white/5 rounded-xl p-3">🔒 Safari: zezwól na kamerę gdy pyta</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
