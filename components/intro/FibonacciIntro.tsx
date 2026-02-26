"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export function FibonacciIntro({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);

    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStep(1);
        }, 1000);
        const timer2 = setTimeout(() => {
            setStep(2);
        }, 2800);
        const timer3 = setTimeout(() => {
            onCompleteRef.current();
        }, 4000); // End intro

        return () => { clearTimeout(timer); clearTimeout(timer2); clearTimeout(timer3); };
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-leo-primary flex flex-col items-center justify-center text-white overflow-hidden"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Fibonacci Spiral Animation */}
            <div className="relative w-64 h-64 md:w-96 md:h-96">
                {[1, 1, 2, 3, 5, 8].map((num, i) => (
                    <motion.div
                        key={i}
                        className="absolute border border-white/20 rounded-tr-[100%]"
                        initial={{ opacity: 0, scale: 0, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: i * 0.2,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        style={{
                            width: `${num * 10}%`,
                            height: `${num * 10}%`,
                            bottom: 0,
                            left: 0,
                            transformOrigin: "bottom left"
                        }}
                    />
                ))}

                {/* Central content */}
                <motion.div
                    className="absolute right-0 top-0 p-4 text-right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    <div className="text-6xl font-black tracking-tighter">1.618</div>
                    <div className="text-sm font-light uppercase tracking-[0.2em] text-white/60">Golden Ratio</div>
                </motion.div>
            </div>

            {/* Text Sequence */}
            <div className="mt-12 h-20 text-center relative w-full max-w-md px-4">
                {step === 0 && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        key="step0"
                        className="text-lg font-light text-white/80"
                    >
                        Porządek w chaosie...
                    </motion.p>
                )}
                {step >= 1 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        key="step1"
                    >
                        <h1 className="text-4xl font-bold tracking-tight mb-2">LEO</h1>
                        <p className="text-sm text-white/60">Logistyka Naturalna</p>
                    </motion.div>
                )}
            </div>

            {/* Skip Button */}
            <button
                onClick={() => onCompleteRef.current()}
                className="absolute bottom-10 text-white/50 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase hover:bg-white/10 px-6 py-2 rounded-full border border-transparent hover:border-white/20"
            >
                Pomiń intro
            </button>
        </motion.div>
    );
}
