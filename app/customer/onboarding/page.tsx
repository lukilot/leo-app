"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Package, Home, Building, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CustomerOnboarding() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [preferences, setPreferences] = useState({
        place: "home", // home | work
        deliveryMode: "hand", // hand | door | safe
    });

    const nextStep = () => setStep((s) => s + 1);
    const finish = () => router.push("/customer/packages");

    const steps = [
        // 0: Welcome
        <div key="welcome" className="space-y-6 text-center">
            <div className="flex justify-center">
                <div className="h-24 w-24 bg-leo-primary rounded-full flex items-center justify-center shadow-xl">
                    <Package className="h-10 w-10 text-white" />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-leo-primary">Twoja dostawa,<br />pod kontrolą</h1>
            <p className="text-leo-gray-500">
                Precyzyjne okna 15-minutowe. Śledzenie na żywo. Twój Plan B.
            </p>
            <Button className="w-full mt-4" onClick={nextStep}>
                Rozpocznij
            </Button>
        </div>,

        // 1: Phone
        <div key="phone" className="space-y-6">
            <h2 className="text-xl font-bold">Podaj numer telefonu</h2>
            <Input placeholder="+48 ..." autoFocus />
            <Button className="w-full" onClick={nextStep}>Dalej</Button>
        </div>,

        // 2: Preferences
        <div key="prefs" className="space-y-6">
            <h2 className="text-xl font-bold">Gdzie najczęściej odbierasz?</h2>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setPreferences({ ...preferences, place: "home" })}
                    className={cn("p-4 border rounded-xl flex flex-col items-center gap-2", preferences.place === "home" ? "border-leo-primary bg-leo-primary/5" : "")}
                >
                    <Home className="h-6 w-6" />
                    <span className="text-sm font-medium">Dom</span>
                </button>
                <button
                    onClick={() => setPreferences({ ...preferences, place: "work" })}
                    className={cn("p-4 border rounded-xl flex flex-col items-center gap-2", preferences.place === "work" ? "border-leo-primary bg-leo-primary/5" : "")}
                >
                    <Building className="h-6 w-6" />
                    <span className="text-sm font-medium">Praca</span>
                </button>
            </div>

            <div className="space-y-2 mt-4">
                <h3 className="font-medium text-sm">Gdy Ciebie nie ma:</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">Zostaw pod drzwiami</Button>
                    <Button variant="outline" size="sm" className="flex-1">Sąsiad</Button>
                </div>
            </div>

            <Button className="w-full mt-4" onClick={finish}>Gotowe</Button>
        </div>
    ];

    return (
        <div className="min-h-screen bg-white p-6 flex flex-col justify-center max-w-md mx-auto relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    {steps[step]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
