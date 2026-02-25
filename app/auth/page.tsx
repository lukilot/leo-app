"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/`,
            },
        });

        if (error) {
            console.error(error);
            setStatus("error");
        } else {
            setStatus("sent");
        }
    };

    return (
        <div className="min-h-screen bg-leo-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-leo-primary -skew-y-6 transform origin-top-left -translate-y-32 z-0" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-white rounded-3xl shadow-xl z-10 overflow-hidden border border-leo-gray-100"
            >
                <div className="p-8 text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-leo-primary rounded-2xl flex items-center justify-center shadow-lg -mt-16 mb-4 ring-4 ring-white relative z-20">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-leo-primary">Logowanie</h1>
                    <p className="text-sm text-leo-gray-500">Bezpieczny dostęp do LEO Network</p>
                </div>

                <div className="px-8 pb-8">
                    <AnimatePresence mode="wait">
                        {status === "sent" ? (
                            <motion.div
                                key="sent"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="mx-auto w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-leo-gray-900">Sprawdź swoją pocztę</h3>
                                    <p className="text-sm text-leo-gray-500 mt-1">Wysłaliśmy magiczny link do logowania na adres <span className="font-medium text-leo-primary">{email}</span></p>
                                </div>
                                <Button variant="outline" className="w-full mt-4" onClick={() => setStatus("idle")}>
                                    Wróć
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleLogin}
                                className="space-y-4"
                            >
                                <div>
                                    <Input
                                        type="email"
                                        placeholder="Adres e-mail"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-14 bg-leo-gray-50 border-transparent focus:bg-white transition-all"
                                        required
                                    />
                                </div>

                                {status === "error" && (
                                    <div className="text-red-500 text-xs text-center font-medium">
                                        Wystąpił błąd autoryzacji. Spróbuj ponownie.
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-14 text-lg font-bold group"
                                    disabled={status === "loading" || !email}
                                >
                                    {status === "loading" ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>Wejdź <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </Button>

                                <div className="text-center mt-6">
                                    <button
                                        type="button"
                                        onClick={() => router.push('/')}
                                        className="text-xs text-leo-gray-400 hover:text-leo-primary transition-colors uppercase font-bold tracking-wider"
                                    >
                                        Powrót do startu
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
