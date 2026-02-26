"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, User, Building2, Bike, Car, Check, Box, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CourierOnboarding() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        phone: "",
        otp: "",
        mode: "", // solo | b2b
        name: "",
        vehicle: "", // bike | scooter | car | bus
        companies: [] as string[],
        language: "pl",
    });

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const toggleCompany = (id: string) => {
        setFormData(prev => ({
            ...prev,
            companies: prev.companies.includes(id)
                ? prev.companies.filter(c => c !== id)
                : [...prev.companies, id]
        }));
    };

    const handleComplete = () => {
        setLoading(true);
        setTimeout(() => {
            router.push("/courier/day");
        }, 1500);
    };

    const steps = [
        // 0: Welcome
        <div key="welcome" className="space-y-8 text-center py-10">
            <div className="flex justify-center">
                <div className="h-28 w-28 bg-leo-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-leo-primary/40 relative">
                    <Truck className="h-14 w-14 text-white" />
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-black rounded-2xl flex items-center justify-center border-4 border-white">
                        <Check className="text-leo-primary h-5 w-5 stroke-[3]" />
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                <h1 className="text-[32px] font-black text-gray-900 leading-tight uppercase tracking-tight">Witaj w LEO</h1>
                <p className="text-gray-400 font-medium px-4 text-sm leading-relaxed uppercase tracking-widest">
                    Twój inteligentny asystent w codziennej pracy. Optymalizacja, komunikacja, spokój.
                </p>
            </div>
            <Button size="lg" className="w-full h-16 rounded-3xl bg-leo-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-leo-primary/20" onClick={nextStep}>
                Zacznij pracę <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
        </div>,

        // 1: Login (Phone)
        <div key="login" className="space-y-8 py-6">
            <div className="space-y-3">
                <h2 className="text-[28px] font-black text-gray-900 leading-tight uppercase tracking-tight">Logowanie</h2>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Podaj numer telefonu, aby otrzymać kod dostępu.</p>
            </div>
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Numer Telefonu</label>
                <Input
                    placeholder="+48 000 000 000"
                    className="h-16 rounded-2xl bg-gray-50 border-gray-100 text-lg font-bold focus:ring-leo-primary"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    autoFocus
                />
            </div>
            <Button className="w-full h-16 rounded-3xl bg-leo-primary text-white font-black text-sm uppercase tracking-widest" onClick={nextStep} disabled={formData.phone.length < 3}>
                Wyślij kod SMS
            </Button>
        </div>,

        // 2: Mode Selection
        <div key="mode" className="space-y-8 py-6">
            <div className="space-y-3">
                <h2 className="text-[28px] font-black text-gray-900 leading-tight uppercase tracking-tight">Tryb pracy</h2>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Jak dzisiaj pracujesz?</p>
            </div>
            <div className="grid gap-4">
                <button
                    onClick={() => { setFormData({ ...formData, mode: "solo" }); nextStep(); }}
                    className="flex items-center p-6 bg-white border-2 border-gray-50 rounded-3xl hover:border-leo-primary hover:shadow-xl transition-all group text-left"
                >
                    <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center mr-5 group-hover:bg-leo-accent/20">
                        <User className="h-7 w-7 text-leo-primary" />
                    </div>
                    <div>
                        <div className="font-black text-lg text-gray-900 uppercase tracking-tight">Pracuję solo</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Indywidualny kurier LEO</div>
                    </div>
                </button>

                <button
                    onClick={() => { setFormData({ ...formData, mode: "b2b" }); nextStep(); }}
                    className="flex items-center p-6 bg-white border-2 border-gray-50 rounded-3xl hover:border-leo-primary hover:shadow-xl transition-all group text-left"
                >
                    <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center mr-5 group-hover:bg-leo-accent/20">
                        <Building2 className="h-7 w-7 text-leo-primary" />
                    </div>
                    <div>
                        <div className="font-black text-lg text-gray-900 uppercase tracking-tight">Partner Flotowy</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Współpraca B2B / Flota</div>
                    </div>
                </button>
            </div>
        </div>,

        // 3: Multi-Company (Phase 2 Upgrade)
        <div key="companies" className="space-y-8 py-6">
            <div className="space-y-3">
                <h2 className="text-[28px] font-black text-gray-900 leading-tight uppercase tracking-tight">Operatorzy</h2>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Dla kogo dzisiaj doręczasz?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {[
                    { id: 'dpd', label: 'DPD', logo: 'D' },
                    { id: 'dhl', label: 'DHL', logo: 'D' },
                    { id: 'inpost', label: 'InPost', logo: 'I' },
                    { id: 'fedex', label: 'FedEx', logo: 'F' },
                    { id: 'ups', label: 'UPS', logo: 'U' },
                    { id: 'gls', label: 'GLS', logo: 'G' },
                ].map((c) => (
                    <button
                        key={c.id}
                        onClick={() => toggleCompany(c.id)}
                        className={cn(
                            "p-5 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 relative",
                            formData.companies.includes(c.id)
                                ? "border-leo-primary bg-leo-accent/10 shadow-lg"
                                : "border-gray-50 bg-gray-50/50 hover:bg-gray-50"
                        )}
                    >
                        {formData.companies.includes(c.id) && (
                            <div className="absolute top-3 right-3 h-5 w-5 bg-leo-primary rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-white stroke-[4]" />
                            </div>
                        )}
                        <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl",
                            formData.companies.includes(c.id) ? "bg-white text-leo-primary" : "bg-white text-gray-300"
                        )}>
                            {c.logo}
                        </div>
                        <span className={cn("text-xs font-black uppercase tracking-widest", formData.companies.includes(c.id) ? "text-leo-primary" : "text-gray-400")}>
                            {c.label}
                        </span>
                    </button>
                ))}
            </div>
            <Button className="w-full h-16 rounded-3xl bg-leo-primary text-white font-black text-sm uppercase tracking-widest mt-4" onClick={nextStep} disabled={formData.companies.length === 0}>
                Potwierdź wybór ({formData.companies.length})
            </Button>
        </div>,

        // 4: Profile & Vehicle
        <div key="profile" className="space-y-8 py-6">
            <div className="space-y-3">
                <h2 className="text-[28px] font-black text-gray-900 leading-tight uppercase tracking-tight">Twoje Dane</h2>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Uzupełnij profil kuriera.</p>
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Nazwisko i Imię</label>
                    <Input
                        placeholder="JAN KOWALSKI"
                        className="h-16 rounded-2xl bg-gray-50 border-gray-100 font-black uppercase tracking-tight"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: "bike", label: "Rower", icon: Bike },
                        { id: "scooter", label: "Skuter", icon: Bike },
                        { id: "car", label: "Auto", icon: Car },
                        { id: "bus", label: "Bus", icon: Truck },
                    ].map((v) => (
                        <button
                            key={v.id}
                            onClick={() => setFormData({ ...formData, vehicle: v.id })}
                            className={cn(
                                "flex flex-col items-center justify-center p-5 border-2 rounded-[2.5rem] transition-all gap-2",
                                formData.vehicle === v.id
                                    ? "border-leo-primary bg-leo-accent/10 shadow-lg"
                                    : "border-gray-50 bg-gray-50/50 hover:bg-gray-50"
                            )}
                        >
                            <v.icon className={cn("h-7 w-7", formData.vehicle === v.id ? "text-leo-primary" : "text-gray-300")} />
                            <span className={cn("text-[10px] font-black uppercase tracking-widest", formData.vehicle === v.id ? "text-leo-primary" : "text-gray-400")}>
                                {v.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            <Button className="w-full h-16 rounded-3xl bg-leo-primary text-white font-black text-sm uppercase tracking-widest" onClick={nextStep} disabled={!formData.vehicle || !formData.name}>
                Dalej
            </Button>
        </div>,

        // 5: Language (Final)
        <div key="language" className="space-y-8 py-6">
            <div className="space-y-3">
                <h2 className="text-[28px] font-black text-gray-900 leading-tight uppercase tracking-tight">Finalizacja</h2>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">LEO jest gotowy do pracy.</p>
            </div>

            <div className="p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-6">
                <div className="flex items-center justify-between">
                    <span className="font-black text-[11px] uppercase tracking-widest text-gray-500">Język aplikacji</span>
                    <span className="text-leo-primary font-black uppercase text-sm tracking-tight">Polski (PL)</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-black text-[11px] uppercase tracking-widest text-gray-500">Tłumaczenie Live</span>
                    <div className="h-7 w-12 bg-leo-primary rounded-full relative">
                        <div className="absolute right-1 top-1 h-5 w-5 bg-white rounded-full shadow-sm" />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-black text-[11px] uppercase tracking-widest text-gray-500">Powiadomienia</span>
                    <div className="h-7 w-12 bg-leo-primary rounded-full relative">
                        <div className="absolute right-1 top-1 h-5 w-5 bg-white rounded-full shadow-sm" />
                    </div>
                </div>
            </div>

            <Button className="w-full h-20 rounded-[2rem] bg-leo-primary text-white font-black text-lg uppercase tracking-[0.2em] shadow-2xl shadow-leo-primary/30" onClick={handleComplete} disabled={loading}>
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Rozpocznij Dzień"}
            </Button>
        </div>
    ];

    return (
        <div className="min-h-screen bg-white p-8 flex flex-col max-w-lg mx-auto relative overflow-hidden font-sans">
            {/* ProgressBar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gray-50">
                <motion.div
                    className="h-full bg-leo-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                    transition={{ type: 'spring', damping: 20 }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex-1 flex flex-col justify-center"
                >
                    {steps[step]}
                </motion.div>
            </AnimatePresence>

            {step > 0 && (
                <button onClick={prevStep} className="absolute top-10 left-8 text-gray-400 hover:text-leo-primary transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
            )}

            {/* Background Texture */}
            <div className="absolute inset-0 pointer-events-none -z-10 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>
    );
}
