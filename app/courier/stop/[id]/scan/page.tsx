"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Camera, X, CheckCircle2, Loader2, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

// Dynamic import to prevent SSR issues with camera API
const ZXingScanner = dynamic(() => import("@/components/ZXingScanner"), {
    ssr: false,
    loading: () => (
        <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-leo-primary" />
        </div>
    )
});

export default function CourierScanPage() {
    const params = useParams();
    const router = useRouter();
    const packageId = params.id as string;

    const [scanState, setScanState] = useState<"idle" | "scanning" | "matched" | "mismatch" | "error">("idle");
    const [scannedCode, setScannedCode] = useState<string | null>(null);

    async function handleScan(code: string) {
        setScannedCode(code);

        // Look up the package by tracking number
        const { data: pkg } = await supabase
            .from("packages")
            .select("id, tracking_number, status")
            .eq("id", packageId)
            .single();

        if (!pkg) {
            setScanState("error");
            return;
        }

        if (pkg.tracking_number === code || pkg.id === code) {
            setScanState("matched");

            // Emit package_scanned event
            await supabase.from("package_events").insert({
                package_id: packageId,
                event_type: "package_scanned",
                payload: {
                    scanned_code: code,
                    matched: true,
                    scanned_at: new Date().toISOString()
                }
            });

            // Update status to at_door
            await supabase
                .from("packages")
                .update({ status: "at_door", sub_status: "Kurier przy drzwiach" })
                .eq("id", packageId);

            // Navigate back to stop after 1s
            setTimeout(() => router.push(`/courier/stop/${packageId}`), 1200);
        } else {
            setScanState("mismatch");
        }
    }

    return (
        <div className="min-h-screen bg-black font-sans flex flex-col">
            {/* Header */}
            <header className="px-6 pt-16 pb-6 flex items-center gap-4">
                <Link href={`/courier/stop/${packageId}`}>
                    <Button variant="ghost" className="h-12 w-12 p-0 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-[20px] font-black italic tracking-tighter uppercase text-white leading-none">
                        Skan<span className="text-leo-primary">owanie</span>
                    </h1>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">
                        Potwierdź paczkę przed doręczeniem
                    </p>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center px-6 pt-4 pb-32 space-y-8">
                {/* Scanner or State overlay */}
                <AnimatePresence mode="wait">
                    {scanState === "idle" || scanState === "scanning" ? (
                        <motion.div
                            key="scanner"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full"
                        >
                            <ZXingScanner
                                onScan={handleScan}
                                label="Skanuj numer paczki lub kod QR"
                                className="w-full"
                            />
                        </motion.div>
                    ) : null}

                    {scanState === "matched" && (
                        <motion.div
                            key="matched"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="flex flex-col items-center gap-6 py-16"
                        >
                            <div className="w-24 h-24 bg-leo-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-leo-primary/30">
                                <CheckCircle2 className="w-12 h-12 text-black" />
                            </div>
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Paczka zgodna!</h2>
                                <p className="text-[12px] text-white/40 font-black uppercase tracking-widest">{scannedCode}</p>
                            </div>
                            <Loader2 className="w-6 h-6 text-leo-primary animate-spin" />
                        </motion.div>
                    )}

                    {scanState === "mismatch" && (
                        <motion.div
                            key="mismatch"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full space-y-6"
                        >
                            <div className="flex flex-col items-center gap-4 py-8">
                                <div className="w-24 h-24 bg-red-900/30 rounded-[2rem] flex items-center justify-center border border-red-700">
                                    <AlertTriangle className="w-12 h-12 text-red-500" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-black italic uppercase text-white">Niezgodna paczka</h2>
                                    <p className="text-[12px] text-white/40 font-black uppercase">
                                        Zeskanowany kod: {scannedCode}
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => setScanState("idle")}
                                className="w-full h-14 bg-white text-black font-black uppercase tracking-widest rounded-2xl border-0"
                            >
                                Skanuj ponownie
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Manual input fallback */}
                {(scanState === "idle" || scanState === "mismatch") && (
                    <div className="w-full space-y-3 pt-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">lub wpisz ręcznie</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="LEO-XXXX-X"
                                className="flex-1 h-14 px-5 bg-white/5 border border-white/10 rounded-2xl text-white text-[14px] font-mono font-black placeholder:text-white/20 focus:border-leo-primary outline-none"
                                onKeyDown={e => {
                                    if (e.key === "Enter") {
                                        handleScan((e.target as HTMLInputElement).value.trim());
                                    }
                                }}
                            />
                            <Button
                                className="h-14 px-6 bg-leo-primary text-black font-black uppercase rounded-2xl border-0"
                                onClick={(e) => {
                                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                    if (input?.value) handleScan(input.value.trim());
                                }}
                            >
                                <Zap className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
