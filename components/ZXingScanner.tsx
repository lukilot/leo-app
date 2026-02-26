"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle2, Zap, AlertCircle, SwitchCamera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ZXingScannerProps {
    onScan: (code: string) => void;
    onClose?: () => void;
    className?: string;
    expectedPrefix?: string;
    label?: string;
}

export default function ZXingScanner({
    onScan,
    onClose,
    className,
    expectedPrefix,
    label = "Skanuj kod paczki"
}: ZXingScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const scannerRef = useRef<any>(null);

    const [status, setStatus] = useState<"scanning" | "success" | "error">("scanning");
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

    const stopScanner = useCallback(() => {
        if (scannerRef.current) {
            try {
                scannerRef.current.stop();
                scannerRef.current.destroy();
            } catch (_) { }
            scannerRef.current = null;
        }
    }, []);

    const startScanner = useCallback(async (camera: "environment" | "user" = "environment") => {
        stopScanner();
        setStatus("scanning");
        setErrorMsg(null);

        if (!videoRef.current) return;

        try {
            // Dynamic import — keeps bundle small, avoids SSR issues
            const QrScanner = (await import("qr-scanner")).default;

            const scanner = new QrScanner(
                videoRef.current,
                (result: any) => {
                    const code = typeof result === "string" ? result : result.data;

                    if (expectedPrefix && !code.startsWith(expectedPrefix)) {
                        setErrorMsg(`Oczekiwany format: ${expectedPrefix}...`);
                        return;
                    }

                    setScannedCode(code);
                    setStatus("success");
                    stopScanner();

                    if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
                    setTimeout(() => onScan(code), 700);
                },
                {
                    // qr-scanner options
                    preferredCamera: camera,
                    highlightScanRegion: true,     // draws the scan region outline
                    highlightCodeOutline: true,     // draws the detected QR outline
                    returnDetailedScanResult: true,
                    maxScansPerSecond: 5,
                }
            );

            scannerRef.current = scanner;
            await scanner.start();

        } catch (err: any) {
            console.error("QR Scanner error:", err?.name, err?.message);

            if (
                err?.message?.includes("Permission") ||
                err?.name === "NotAllowedError" ||
                err?.message?.includes("not allowed")
            ) {
                setStatus("error");
                setErrorMsg("Brak dostępu do kamery. Zezwól na aparat w ustawieniach Safari → Prywatność → Kamera, a następnie odśwież stronę.");
            } else if (
                err?.message?.includes("No camera") ||
                err?.name === "NotFoundError"
            ) {
                setStatus("error");
                setErrorMsg("Nie wykryto kamery. Sprawdź ustawienia urządzenia.");
            } else {
                setStatus("error");
                setErrorMsg(`Błąd: ${err?.message ?? "Nieznany błąd kamery"}`);
            }
        }
    }, [onScan, stopScanner, expectedPrefix]);

    useEffect(() => {
        startScanner(facingMode);
        return () => stopScanner();
    }, []); // eslint-disable-line

    const handleSwitchCamera = () => {
        const next = facingMode === "environment" ? "user" : "environment";
        setFacingMode(next);
        startScanner(next);
    };

    return (
        <div className={cn("flex flex-col items-center w-full select-none", className)}>
            {/* Viewfinder */}
            <div className="relative w-full aspect-square max-w-sm rounded-[2rem] overflow-hidden bg-zinc-900 shadow-2xl border-4 border-white">
                {/* video element — qr-scanner takes control of this */}
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    // iOS Safari requires all three of these attributes
                    autoPlay
                    muted
                    playsInline
                />

                {/* Scan border is injected by qr-scanner's highlightScanRegion.
                    We add our own animated laser line on top. */}
                {status === "scanning" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-52 h-52">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-leo-primary rounded-tl-xl" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-leo-primary rounded-tr-xl" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-leo-primary rounded-bl-xl" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-leo-primary rounded-br-xl" />
                            <motion.div
                                className="absolute left-2 right-2 h-[2px] bg-leo-primary shadow-[0_0_10px_#FFD700]"
                                animate={{ top: ["10%", "88%", "10%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                )}

                {/* Success */}
                <AnimatePresence>
                    {status === "success" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-4"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                            >
                                <CheckCircle2 className="w-16 h-16 text-leo-primary" />
                            </motion.div>
                            <div className="text-center px-4">
                                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Zeskanowano</div>
                                <div className="text-white font-black text-[15px] font-mono break-all">{scannedCode}</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                    {status === "error" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/92 flex flex-col items-center justify-center gap-5 p-6 text-center"
                        >
                            <AlertCircle className="w-12 h-12 text-red-400 shrink-0" />
                            <p className="text-white text-[12px] leading-relaxed font-medium">{errorMsg}</p>
                            <button
                                onClick={() => startScanner(facingMode)}
                                className="px-6 py-3 bg-leo-primary text-black text-[11px] font-black uppercase tracking-widest rounded-2xl"
                            >
                                Spróbuj ponownie
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Controls */}
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <button
                        onClick={handleSwitchCamera}
                        className="h-9 w-9 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-white"
                        title="Zmień kamerę"
                    >
                        <SwitchCamera className="w-4 h-4" />
                    </button>
                    {onClose && (
                        <button
                            onClick={() => { stopScanner(); onClose(); }}
                            className="h-9 w-9 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Label */}
            <div className="mt-5 text-center space-y-1.5">
                <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 text-leo-primary" />
                    <span className="text-[12px] font-black uppercase tracking-widest">{label}</span>
                </div>
                {status === "scanning" && (
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                        Skieruj kamerę na kod kreskowy lub QR
                    </p>
                )}
                {errorMsg && status !== "error" && (
                    <p className="text-[10px] text-amber-500 font-black uppercase">{errorMsg}</p>
                )}
            </div>
        </div>
    );
}
