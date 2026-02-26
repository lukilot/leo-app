"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function FibonacciIntro({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setStep(1), 800);
        const t2 = setTimeout(() => setStep(2), 2000);
        const t3 = setTimeout(() => onComplete(), 3500);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [onComplete]);

    return (
        <motion.div
            onClick={() => onComplete()}
            className="fixed inset-0 z-[9999] bg-leo-primary flex flex-col items-center justify-center text-white cursor-pointer overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
        >
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            </div>

            <div className="relative flex flex-col items-center z-10">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-[120px] font-black italic tracking-tighter leading-none mb-6 drop-shadow-2xl"
                >
                    LEO
                </motion.div>

                <div className="h-8 overflow-hidden text-center">
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.p
                                key="0"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="text-[12px] font-black uppercase tracking-[0.5em] text-white/50"
                            >
                                Inicjalizacja...
                            </motion.p>
                        )}
                        {step === 1 && (
                            <motion.p
                                key="1"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="text-[12px] font-black uppercase tracking-[0.5em] text-white/80"
                            >
                                Logistyka Naturalna
                            </motion.p>
                        )}
                        {step === 2 && (
                            <motion.p
                                key="2"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="text-[12px] font-black uppercase tracking-[0.5em] text-leo-accent"
                            >
                                Gotowy do startu
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 animate-pulse">
                Kliknij aby pominąć
            </div>
        </motion.div>
    );
}
