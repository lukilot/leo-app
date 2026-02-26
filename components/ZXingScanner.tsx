"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader, BrowserCodeReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { cn } from "@/lib/utils";
import { Camera, X, CheckCircle2, Zap, AlertCircle, SwitchCamera } from "lucide-react";
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
    const controlsRef = useRef<IScannerControls | null>(null);
    const hasStarted = useRef(false);

    const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
    const [deviceIndex, setDeviceIndex] = useState(0);

    const stopScanning = useCallback(() => {
        if (controlsRef.current) {
            try { controlsRef.current.stop(); } catch (_) { }
            controlsRef.current = null;
        }
    }, []);

    // Enumerate all video input devices once on mount
    useEffect(() => {
        BrowserCodeReader.listVideoInputDevices()
            .then((videoDevices) => {
                setDevices(videoDevices);
                // Prefer rear camera on mobile, first device on desktop
                const rearCam = videoDevices.find(d =>
                    d.label.toLowerCase().includes("back") ||
                    d.label.toLowerCase().includes("rear") ||
                    d.label.toLowerCase().includes("environment")
                );
                const preferred = rearCam ?? videoDevices[0];
                if (preferred) setSelectedDeviceId(preferred.deviceId);
            })
            .catch(() => {
                // No camera access yet — will be requested on first scan
            });
    }, []);

    const startScanning = useCallback(async (deviceId?: string) => {
        if (hasStarted.current) {
            stopScanning();
            await new Promise(r => setTimeout(r, 200));
        }
        hasStarted.current = true;

        try {
            setStatus("scanning");
            setErrorMsg(null);

            const reader = new BrowserMultiFormatReader();

            if (!videoRef.current) throw new Error("Video element not ready");

            let controls: IScannerControls;

            if (deviceId) {
                // Use specific device ID (most reliable on all platforms)
                controls = await reader.decodeFromVideoDevice(
                    deviceId,
                    videoRef.current,
                    (result, error) => {
                        if (result) handleResult(result.getText(), controls);
                    }
                );
            } else {
                // Fallback: let browser pick any camera (works on desktop)
                controls = await reader.decodeFromConstraints(
                    { video: true }, // No facingMode constraint = works on desktop
                    videoRef.current,
                    (result, error) => {
                        if (result) handleResult(result.getText(), controls);
                    }
                );
            }

            controlsRef.current = controls;

            // Refresh device list after permission granted
            const videoDevices = await BrowserCodeReader.listVideoInputDevices();
            setDevices(videoDevices);
            if (!deviceId && videoDevices.length > 0) {
                setSelectedDeviceId(videoDevices[0].deviceId);
            }

        } catch (err: any) {
            hasStarted.current = false;
            console.error("Scanner error:", err);

            if (err?.name === "NotAllowedError") {
                setStatus("error");
                setErrorMsg("Brak dostępu do kamery. Zezwól na aparat w ustawieniach przeglądarki i odśwież stronę.");
            } else if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
                setStatus("error");
                setErrorMsg("Nie znaleziono kamery. Podłącz kamerę lub użyj urządzenia mobilnego.");
            } else if (err?.name === "OverconstrainedError") {
                // facingMode: environment not supported → retry without constraint
                setStatus("error");
                setErrorMsg("Nie znaleziono tylnej kamery. Spróbuj zmienić kamerę poniżej.");
            } else {
                setStatus("error");
                setErrorMsg(`Błąd: ${err?.message ?? "Sprawdź kamerę i spróbuj ponownie."}`);
            }
        }
    }, [stopScanning, expectedPrefix]);

    function handleResult(code: string, controls: IScannerControls) {
        if (expectedPrefix && !code.startsWith(expectedPrefix)) {
            setErrorMsg(`Oczekiwany format: ${expectedPrefix}...`);
            return;
        }

        setScannedCode(code);
        setStatus("success");

        try { controls.stop(); } catch (_) { }
        controlsRef.current = null;

        if ("vibrate" in navigator) {
            navigator.vibrate([100, 50, 100]);
        }

        setTimeout(() => onScan(code), 700);
    }

    // Switch between available cameras (for mobile front/rear toggle)
    function switchCamera() {
        if (devices.length < 2) return;
        const next = (deviceIndex + 1) % devices.length;
        setDeviceIndex(next);
        const nextDeviceId = devices[next].deviceId;
        setSelectedDeviceId(nextDeviceId);
        hasStarted.current = false;
        startScanning(nextDeviceId);
    }

    useEffect(() => {
        startScanning(selectedDeviceId);
        return () => stopScanning();
    }, []); // Only on mount

    return (
        <div className={cn("relative flex flex-col items-center w-full", className)}>
            {/* Viewfinder */}
            <div className="relative w-full aspect-square max-w-sm rounded-[2.5rem] overflow-hidden bg-zinc-900 shadow-2xl border-4 border-white">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                />

                {/* Scanning frame */}
                {status === "scanning" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-52 h-52">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-leo-primary rounded-tl-xl" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-leo-primary rounded-tr-xl" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-leo-primary rounded-bl-xl" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-leo-primary rounded-br-xl" />
                            <motion.div
                                className="absolute left-2 right-2 h-[2px] bg-leo-primary shadow-[0_0_10px_#FFD700]"
                                style={{ top: "10%" }}
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
                            className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                            >
                                <CheckCircle2 className="w-16 h-16 text-leo-primary" />
                            </motion.div>
                            <div className="text-center">
                                <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Zeskanowano</div>
                                <div className="text-white font-black text-[15px] font-mono break-all px-4">{scannedCode}</div>
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
                            className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 p-6 text-center"
                        >
                            <AlertCircle className="w-12 h-12 text-red-500 shrink-0" />
                            <p className="text-white text-[12px] font-bold leading-relaxed">{errorMsg}</p>
                            <button
                                onClick={() => { hasStarted.current = false; startScanning(selectedDeviceId); }}
                                className="px-6 py-3 bg-leo-primary text-black text-[11px] font-black uppercase tracking-widest rounded-2xl"
                            >
                                Spróbuj ponownie
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Controls overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    {onClose && (
                        <button
                            onClick={() => { stopScanning(); onClose(); }}
                            className="h-10 w-10 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    {devices.length > 1 && (
                        <button
                            onClick={switchCamera}
                            className="h-10 w-10 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white"
                            title="Zmień kamerę"
                        >
                            <SwitchCamera className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Label */}
            <div className="mt-6 text-center space-y-2 w-full">
                <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 text-leo-primary" />
                    <span className="text-[12px] font-black uppercase tracking-widest">{label}</span>
                </div>

                {status === "scanning" && (
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                        Skieruj kamerę na kod paczki lub QR
                    </p>
                )}

                {/* Device selector (visible when multiple cameras available) */}
                {status === "scanning" && devices.length > 1 && (
                    <select
                        value={selectedDeviceId}
                        onChange={(e) => {
                            const id = e.target.value;
                            setSelectedDeviceId(id);
                            hasStarted.current = false;
                            startScanning(id);
                        }}
                        className="mt-2 w-full max-w-xs text-[10px] font-black uppercase bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none"
                    >
                        {devices.map((d, i) => (
                            <option key={d.deviceId} value={d.deviceId}>
                                {d.label || `Kamera ${i + 1}`}
                            </option>
                        ))}
                    </select>
                )}

                {errorMsg && status !== "error" && (
                    <p className="text-[10px] text-amber-600 font-black uppercase">{errorMsg}</p>
                )}
            </div>
        </div>
    );
}
