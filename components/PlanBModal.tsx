"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Users, Package, Clock, Unlock, ChevronRight, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PlanBOption = "door" | "neighbor" | "locker" | "pudo" | "delay" | "return";

interface PlanBModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (option: PlanBOption, meta?: Record<string, string>) => void;
    packageId?: string;
    currentPlanB?: PlanBOption | null;
    mode?: "customer" | "courier";
}

const PLAN_B_OPTIONS: {
    id: PlanBOption;
    label: string;
    sublabel: string;
    icon: typeof Home;
    color: string;
}[] = [
        {
            id: "door",
            label: "Pod drzwiami",
            sublabel: "Zostaw paczkę przed drzwiami (za zgodą)",
            icon: Home,
            color: "text-gray-700"
        },
        {
            id: "neighbor",
            label: "U sąsiada",
            sublabel: "Przekaż do wskazanego sąsiada",
            icon: Users,
            color: "text-blue-600"
        },
        {
            id: "locker",
            label: "Paczkomat / Locker",
            sublabel: "Przekieruj do najbliższego packLocka",
            icon: Unlock,
            color: "text-purple-600"
        },
        {
            id: "pudo",
            label: "Punkt LEO (PUDO)",
            sublabel: "Zostaw w autoryzowanym punkcie odbioru",
            icon: Package,
            color: "text-leo-primary"
        },
        {
            id: "delay",
            label: "Przesuń dostawę",
            sublabel: "Zaplanuj na jutro lub wybrany termin",
            icon: Clock,
            color: "text-amber-600"
        },
        {
            id: "return",
            label: "Zwrot do nadawcy",
            sublabel: "Paczka wróci do nadawcy bez doręczenia",
            icon: X,
            color: "text-red-600"
        }
    ];

export default function PlanBModal({
    isOpen,
    onClose,
    onConfirm,
    packageId,
    currentPlanB,
    mode = "customer"
}: PlanBModalProps) {
    const [selected, setSelected] = useState<PlanBOption | null>(currentPlanB || null);
    const [neighborFlat, setNeighborFlat] = useState("");
    const [confirmed, setConfirmed] = useState(false);

    const handleConfirm = () => {
        if (!selected) return;

        setConfirmed(true);
        const meta: Record<string, string> = {};
        if (selected === "neighbor" && neighborFlat) {
            meta.neighbor_flat = neighborFlat;
        }

        setTimeout(() => {
            onConfirm(selected, meta);
            setConfirmed(false);
            onClose();
        }, 800);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-end justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative z-10 bg-white rounded-t-[3rem] w-full max-h-[90vh] overflow-y-auto shadow-3xl"
                    >
                        <div className="p-8 space-y-8">
                            {/* Handle */}
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto" />

                            {/* Header */}
                            <div className="space-y-2">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-leo-primary">
                                    {mode === "courier" ? "Kurier • Wybór akcji" : "Plan B • Zmień instrukcję"}
                                </div>
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none text-black">
                                    Co zrobić<br />z paczką?
                                </h2>
                                <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                                    {mode === "courier"
                                        ? "Wybierz akcję jeśli odbiorca jest niedostępny."
                                        : "System powiadomi kuriera o nowej instrukcji w czasie rzeczywistym."}
                                </p>
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {PLAN_B_OPTIONS.map((opt) => {
                                    const Icon = opt.icon;
                                    const isSelected = selected === opt.id;

                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => setSelected(opt.id)}
                                            className={cn(
                                                "w-full flex items-center gap-4 p-5 rounded-3xl border-2 text-left transition-all active:scale-[0.98]",
                                                isSelected
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-100 bg-white text-black hover:border-gray-300"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                                isSelected ? "bg-white/10" : "bg-gray-50"
                                            )}>
                                                <Icon className={cn("w-5 h-5", isSelected ? "text-leo-primary" : opt.color)} />
                                            </div>
                                            <div className="flex-1">
                                                <div className={cn("text-[14px] font-black uppercase tracking-tight")}>
                                                    {opt.label}
                                                </div>
                                                <div className={cn(
                                                    "text-[11px] font-medium mt-0.5",
                                                    isSelected ? "text-white/60" : "text-gray-400"
                                                )}>
                                                    {opt.sublabel}
                                                </div>
                                            </div>
                                            {isSelected && <CheckCircle2 className="w-5 h-5 text-leo-primary shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Neighbor flat input */}
                            <AnimatePresence>
                                {selected === "neighbor" && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                Numer mieszkania sąsiada
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="np. 12"
                                                value={neighborFlat}
                                                onChange={(e) => setNeighborFlat(e.target.value)}
                                                className="w-full h-14 px-5 rounded-2xl border-2 border-gray-200 text-[14px] font-black text-black focus:border-black outline-none transition-colors"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Confirm button */}
                            <Button
                                onClick={handleConfirm}
                                disabled={!selected}
                                className="w-full h-16 rounded-[2rem] bg-black text-white font-black uppercase tracking-widest text-[12px] border-0 shadow-2xl disabled:opacity-30"
                            >
                                {confirmed ? (
                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-leo-primary" />
                                        Potwierdzono!
                                    </span>
                                ) : (
                                    `Aktywuj Plan B: ${selected ? PLAN_B_OPTIONS.find(o => o.id === selected)?.label : "..."}`
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
