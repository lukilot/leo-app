"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, MapPin, Dog, Lock, WifiOff, UserX,
    Package, AlertCircle, Camera, Loader2, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type ExceptionType =
    | "address_not_found"
    | "access_denied"
    | "recipient_absent"
    | "cod_refused"
    | "damaged_parcel"
    | "wrong_address"
    | "dog_attack"
    | "other";

const EXCEPTION_TYPES: {
    id: ExceptionType;
    label: string;
    sublabel: string;
    icon: typeof MapPin;
    color: string;
}[] = [
        { id: "recipient_absent", label: "Brak odbiorcy", sublabel: "Nikt nie otworzył", icon: UserX, color: "text-amber-600" },
        { id: "access_denied", label: "Brak dostępu", sublabel: "Zamknięta brama, domofon", icon: Lock, color: "text-orange-600" },
        { id: "address_not_found", label: "Brak adresu", sublabel: "Nie mogę znaleźć lokalu", icon: MapPin, color: "text-red-600" },
        { id: "wrong_address", label: "Zły adres", sublabel: "Adres jest nieprawidłowy", icon: AlertCircle, color: "text-red-700" },
        { id: "cod_refused", label: "Odmowa pobrania", sublabel: "Odbiorca odmówił płatności COD", icon: AlertCircle, color: "text-purple-600" },
        { id: "damaged_parcel", label: "Uszkodzona paczka", sublabel: "Widoczne uszkodzenia opakowania", icon: Package, color: "text-red-800" },
        { id: "dog_attack", label: "Pies / zagrożenie", sublabel: "Niebezpieczne zwierzę przy wejściu", icon: Dog, color: "text-red-900" },
        { id: "other", label: "Inny problem", sublabel: "Opisz sytuację", icon: WifiOff, color: "text-gray-600" }
    ];

export default function CourierExceptionPage() {
    const params = useParams();
    const router = useRouter();
    const packageId = params.id as string;

    const [selected, setSelected] = useState<ExceptionType | null>(null);
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit() {
        if (!selected) return;
        setSubmitting(true);

        // 1. Insert exception record
        await supabase.from("exceptions").insert({
            package_id: packageId,
            type: selected,
            status: "open",
            priority: selected === "dog_attack" || selected === "damaged_parcel" ? "high" : "medium",
            courier_note: note || null
        });

        // 2. Update package status
        await supabase
            .from("packages")
            .update({ status: "exception", sub_status: EXCEPTION_TYPES.find(e => e.id === selected)?.label })
            .eq("id", packageId);

        // 3. Emit event
        await supabase.from("package_events").insert({
            package_id: packageId,
            event_type: "exception_raised",
            payload: {
                type: selected,
                note: note || null,
                raised_at: new Date().toISOString()
            }
        });

        setSubmitting(false);
        setSubmitted(true);

        setTimeout(() => router.push("/courier/day"), 2000);
    }

    return (
        <div className="min-h-screen bg-[#F5F5F4] font-sans pb-32">
            {/* Header */}
            <header className="px-6 pt-16 pb-6 bg-red-950 text-white flex items-center gap-4">
                <Link href={`/courier/stop/${packageId}`}>
                    <Button variant="ghost" className="h-12 w-12 p-0 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-[18px] font-black italic tracking-tighter uppercase leading-none">
                        Zgłoś <span className="text-red-400">Wyjątek</span>
                    </h1>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">
                        Dyspozytor zajmie się sprawą natychmiast
                    </p>
                </div>
            </header>

            <main className="px-6 pt-8 space-y-6">
                {!submitted ? (
                    <>
                        {/* Exception grid */}
                        <div className="grid grid-cols-1 gap-3">
                            {EXCEPTION_TYPES.map(exc => {
                                const Icon = exc.icon;
                                return (
                                    <button
                                        key={exc.id}
                                        onClick={() => setSelected(exc.id)}
                                        className={cn(
                                            "flex items-center gap-4 p-5 rounded-[2rem] border-2 text-left transition-all active:scale-[0.98]",
                                            selected === exc.id
                                                ? "border-red-700 bg-red-50"
                                                : "border-gray-100 bg-white hover:border-gray-300"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                            selected === exc.id ? "bg-red-100" : "bg-gray-50"
                                        )}>
                                            <Icon className={cn("w-6 h-6", exc.color)} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[14px] font-black uppercase tracking-tight text-black">{exc.label}</div>
                                            <div className="text-[11px] text-gray-400 font-medium mt-0.5">{exc.sublabel}</div>
                                        </div>
                                        {selected === exc.id && (
                                            <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Optional note */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Dodatkowe informacje (opcjonalnie)
                            </label>
                            <textarea
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                placeholder="Opisz sytuację, podaj numer lokalu, piętra..."
                                rows={3}
                                className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl text-[13px] font-medium text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            onClick={handleSubmit}
                            disabled={!selected || submitting}
                            className="w-full h-16 rounded-[2rem] bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-widest text-[12px] border-0 shadow-xl shadow-red-200 disabled:opacity-30"
                        >
                            {submitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Wyślij do Dyspozytora"
                            )}
                        </Button>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-6 py-20 text-center"
                    >
                        <div className="w-24 h-24 bg-green-100 rounded-[2rem] flex items-center justify-center">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-black">Zgłoszono!</h2>
                            <p className="text-[12px] text-gray-400 font-black uppercase tracking-widest">
                                Dyspozytor przejmuje sprawę. Wróć do trasy.
                            </p>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
