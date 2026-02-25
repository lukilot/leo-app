"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Truck, User, Building2, Bike, Car, Check } from "lucide-react";
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
        language: "pl",
    });

    const nextStep = () => setStep((s) => s + 1);
    const handleComplete = () => {
        setLoading(true);
        setTimeout(() => {
            router.push("/courier/day");
        }, 1500);
    };

    const steps = [
        // 0: Welcome
        <div key="welcome" className="space-y-6 text-center">
            <div className="flex justify-center">
                <div className="h-24 w-24 bg-leo-primary rounded-[2rem] flex items-center justify-center shadow-xl shadow-leo-primary/20">
                    <Truck className="h-12 w-12 text-white" />
                </div>
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-leo-primary">LEO Kurier</h1>
                <p className="text-leo-gray-500">
                    Twój inteligentny asystent w codziennej pracy. Optymalizacja, komunikacja, spokój.
                </p>
            </div>
            <Button size="lg" className="w-full mt-8" onClick={nextStep}>
                Zacznij pracę <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>,

        // 1: Login (Phone)
        <div key="login" className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Logowanie</h2>
                <p className="text-leo-gray-500">Podaj numer telefonu, aby otrzymać kod dostępu.</p>
            </div>
            <Input
                placeholder="+48 000 000 000"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                autoFocus
            />
            <Button className="w-full" onClick={nextStep} disabled={formData.phone.length < 3}>
                Wyślij kod SMS
            </Button>
        </div>,

        // 2: OTP
        <div key="otp" className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Weryfikacja</h2>
                <p className="text-leo-gray-500">Wpisz kod wysłany na {formData.phone}</p>
            </div>
            <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4].map((_, i) => (
                    <Input
                        key={i}
                        className="w-14 h-14 text-center text-2xl"
                        maxLength={1}
                        defaultValue={i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : "4"} // Mocked
                    />
                ))}
            </div>
            <Button className="w-full" onClick={nextStep}>
                Potwierdź
            </Button>
        </div>,

        // 3: Mode Selection
        <div key="mode" className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Tryb pracy</h2>
                <p className="text-leo-gray-500">Jak dzisiaj pracujesz?</p>
            </div>
            <div className="grid gap-4">
                <button
                    onClick={() => { setFormData({ ...formData, mode: "solo" }); nextStep(); }}
                    className="flex items-center p-4 border rounded-xl hover:border-leo-primary hover:bg-leo-primary/5 transition-all group text-left"
                >
                    <div className="h-12 w-12 bg-leo-gray-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-white">
                        <User className="h-6 w-6 text-leo-primary" />
                    </div>
                    <div>
                        <div className="font-semibold text-lg">Pracuję solo</div>
                        <div className="text-sm text-leo-gray-500">Indywidualny kurier (B2C)</div>
                    </div>
                </button>

                <button
                    onClick={() => { setFormData({ ...formData, mode: "b2b" }); nextStep(); }}
                    className="flex items-center p-4 border rounded-xl hover:border-leo-primary hover:bg-leo-primary/5 transition-all group text-left"
                >
                    <div className="h-12 w-12 bg-leo-gray-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-white">
                        <Building2 className="h-6 w-6 text-leo-primary" />
                    </div>
                    <div>
                        <div className="font-semibold text-lg">Pracuję dla firmy</div>
                        <div className="text-sm text-leo-gray-500">Partner flotowy / B2B</div>
                    </div>
                </button>
            </div>
        </div>,

        // 4: Profile & Vehicle
        <div key="profile" className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Twoje dane</h2>
                <p className="text-leo-gray-500">Uzupełnij profil kuriera.</p>
            </div>
            <div className="space-y-4">
                <Input
                    placeholder="Imię i Nazwisko"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: "bike", label: "Rower", icon: Bike },
                        { id: "car", label: "Auto", icon: Car },
                        { id: "scooter", label: "Skuter", icon: Bike }, // reusing icon for prototype
                        { id: "bus", label: "Bus", icon: Truck },
                    ].map((v) => (
                        <button
                            key={v.id}
                            onClick={() => setFormData({ ...formData, vehicle: v.id })}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 border rounded-xl transition-all",
                                formData.vehicle === v.id
                                    ? "border-leo-primary bg-leo-primary/5 ring-1 ring-leo-primary"
                                    : "hover:bg-leo-gray-50"
                            )}
                        >
                            <v.icon className={cn("h-6 w-6 mb-2", formData.vehicle === v.id ? "text-leo-primary" : "text-leo-gray-400")} />
                            <span className={cn("text-sm font-medium", formData.vehicle === v.id ? "text-leo-primary" : "text-leo-gray-600")}>
                                {v.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            <Button className="w-full" onClick={nextStep} disabled={!formData.vehicle}>
                Dalej
            </Button>
        </div>,

        // 5: Language (Final)
        <div key="language" className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Język i komunikacja</h2>
                <p className="text-leo-gray-500">LEO tłumaczy wiadomości w czasie rzeczywistym.</p>
            </div>

            <div className="p-4 bg-leo-gray-50 rounded-xl border space-y-4">
                <div className="flex items-center justify-between">
                    <span className="font-medium">Język aplikacji</span>
                    <span className="text-leo-primary font-bold">Polski</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-medium">Tłumaczenie głosowe</span>
                    <div className="h-6 w-10 bg-leo-primary rounded-full relative">
                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                    </div>
                </div>
            </div>

            <Button className="w-full h-14 text-lg" onClick={handleComplete} isLoading={loading}>
                {loading ? "Konfiguracja..." : "Rozpocznij dzień"}
            </Button>
        </div>
    ];

    return (
        <div className="min-h-screen bg-white p-6 flex flex-col justify-center max-w-md mx-auto relative overflow-hidden">
            {/* ProgressBar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-leo-gray-100">
                <motion.div
                    className="h-full bg-leo-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {steps[step]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
