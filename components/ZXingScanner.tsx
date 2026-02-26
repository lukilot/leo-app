"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
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
    const streamRef = useRef<MediaStream | null>(null);
    const controlsRef = useRef<IScannerControls | null>(null);

    const [status, setStatus] = useState<"scanning" | "success" | "error">("scanning");
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [useFrontCamera, setUseFrontCamera] = useState(false);

    const stopAll = useCallback(() => {
        try { controlsRef.current?.stop(); } catch (_) { }
        try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch (_) { }
        controlsRef.current = null;
        streamRef.current = null;
    }, []);

    const startCamera = useCallback(async (frontCamera = false) => {
        stopAll();
        setStatus("scanning");
        setErrorMsg(null);

        try {
            // Step 1: get raw media stream (bypasses ZXing's internal camera selection)
            const constraints: MediaStreamConstraints = {
                video: {
                    // On mobile: try rear camera. On desktop: just grab whatever exists.
                    facingMode: frontCamera ? "user" : { ideal: "environment" },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            // Step 2: attach stream to video element manually
            if (!videoRef.current) throw new Error("Video element not ready");
            videoRef.current.srcObject = stream;
            await videoRef.current.play();

            // Step 3: hand the live stream to ZXing for decoding
            const reader = new BrowserMultiFormatReader();
            const controls = await reader.decodeFromStream(
                stream,
                videoRef.current,
                (result, error) => {
                    if (result) {
                        const code = result.getText();

                        if (expectedPrefix && !code.startsWith(expectedPrefix)) {
                            setErrorMsg(`Oczekiwany format: ${expectedPrefix}...`);
                            return;
                        }

                        // Success!
                        setScannedCode(code);
                        setStatus("success");
                        stopAll();

                        if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
                        setTimeout(() => onScan(code), 700);
                    }
                    // ZXing fires errors constantly when no code is in frame — ignore them
                }
            );

            controlsRef.current = controls;

        } catch (err: any) {
            console.error("Camera error:", err?.name, err?.message);

            if (err?.name === "NotAllowedError") {
                setStatus("error");
                setErrorMsg("Brak dostępu do kamery. Zezwól na aparat w ustawieniach przeglądarki, a następnie odśwież.");
            } else if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
                setStatus("error");
                setErrorMsg("Nie wykryto kamery. Sprawdź czy urządzenie ma działający aparat.");
            } else if (err?.name === "OverconstrainedError" && !frontCamera) {
                // environment-facing not available (desktop) → retry with front cam
                startCamera(true);
            } else {
                setStatus("error");
                setErrorMsg(`Błąd kamery: ${err?.message}`);
            }
        }
    }, [onScan, stopAll, expectedPrefix]);

    // Mount / unmount
    useEffect(() => {
        startCamera(false);
        return () => stopAll();
    }, []); // eslint-disable-line

    const handleSwitchCamera = () => {
        const newFront = !useFrontCamera;
        setUseFrontCamera(newFront);
        startCamera(newFront);
    };

    return (
        <div className={cn("flex flex-col items-center w-full select-none", className)}>
            {/* Viewfinder */}
            <div className="relative w-full aspect-square max-w-sm rounded-[2rem] overflow-hidden bg-zinc-900 shadow-2xl border-4 border-white">
                {/* The video element is always rendered so the ref is always available */}
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                />

                {/* Scanning UI */}
                {status === "scanning" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-52 h-52">
                            {/* Corner brackets */}
                            {[
                                "top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-xl",
                                "top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-xl",
                                "bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-xl",
                                "bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-xl"
                            ].map((cls, i) => (
                                <div key={i} className={`absolute w-8 h-8 border-leo-primary ${cls}`} />
                            ))}
                            {/* Laser line */}
                            <motion.div
                                className="absolute left-2 right-2 h-[2px] bg-leo-primary shadow-[0_0_10px_#FFD700]"
                                animate={{ top: ["10%", "88%", "10%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                )}

                {/* Success overlay */}
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

                {/* Error overlay */}
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
                                onClick={() => startCamera(useFrontCamera)}
                                className="px-6 py-3 bg-leo-primary text-black text-[11px] font-black uppercase tracking-widest rounded-2xl"
                            >
                                Spróbuj ponownie
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Overlay controls */}
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
                            onClick={() => { stopAll(); onClose(); }}
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
