"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, User, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

type LoginMode = "courier" | "customer" | "dispatcher";

const MODES: { id: LoginMode; label: string; href: string }[] = [
    { id: "courier", label: "Kurier", href: "/courier/day" },
    { id: "customer", label: "Klient", href: "/customer/packages" },
    { id: "dispatcher", label: "Dyspozytor", href: "/dispatch" }
];

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<LoginMode>("courier");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already logged in
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                redirectByRole(session.user);
            }
        });
    }, []);

    async function redirectByRole(user: any) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        const role = profile?.role;
        if (role === "courier") router.replace("/courier/day");
        else if (role === "dispatcher" || role === "admin") router.replace("/dispatch");
        else router.replace("/customer/packages");
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            setError("Nieprawidłowy email lub hasło. Spróbuj ponownie.");
            setLoading(false);
            return;
        }

        if (data.user) {
            await redirectByRole(data.user);
        }
    }

    // Demo quick login
    async function demoLogin(demoMode: LoginMode) {
        setMode(demoMode);
        setLoading(true);

        const demoCredentials: Record<LoginMode, { email: string; password: string }> = {
            courier: { email: "demo-kurier@leo.app", password: "leo2026demo" },
            customer: { email: "demo-klient@leo.app", password: "leo2026demo" },
            dispatcher: { email: "demo-dispatch@leo.app", password: "leo2026demo" }
        };

        const { data, error: authError } = await supabase.auth.signInWithPassword(
            demoCredentials[demoMode]
        );

        if (authError || !data.user) {
            // If demo user doesn't exist, create them
            const redirect = MODES.find(m => m.id === demoMode)?.href ?? "/";
            router.push(redirect);
            return;
        }

        await redirectByRole(data.user);
    }

    return (
        <main className="min-h-screen bg-[#F5F5F4] flex flex-col items-center justify-center p-6 font-sans">
            <div className="w-full max-w-sm space-y-10">

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-3"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-[2rem] shadow-2xl shadow-black/30 mx-auto">
                        <Zap className="w-10 h-10 text-leo-primary fill-current" />
                    </div>
                    <h1 className="text-5xl font-black italic tracking-tighter text-black">LEO</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Vision 2026 Protocol</p>
                </motion.div>

                {/* Role Selector */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex bg-white rounded-[1.5rem] p-1.5 border border-gray-100 shadow-sm"
                >
                    {MODES.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${mode === m.id
                                    ? "bg-black text-white shadow-lg"
                                    : "text-gray-400 hover:text-gray-700"
                                }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </motion.div>

                {/* Login Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                >
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="twoj@email.com"
                            required
                            className="w-full h-14 px-5 bg-white border-2 border-gray-100 rounded-2xl text-[14px] font-medium text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Hasło
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full h-14 px-5 bg-white border-2 border-gray-100 rounded-2xl text-[14px] font-medium text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors pr-14"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[11px] font-black text-red-600 uppercase tracking-tight"
                        >
                            {error}
                        </motion.p>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[12px] border-0 shadow-xl mt-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            `Zaloguj jako ${MODES.find(m => m.id === mode)?.label}`
                        )}
                    </Button>
                </motion.form>

                {/* Divider */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Demo</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Demo Quick Login */}
                <div className="grid grid-cols-3 gap-3">
                    {MODES.map(m => (
                        <button
                            key={m.id}
                            onClick={() => demoLogin(m.id)}
                            className="py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:border-black hover:text-black transition-all shadow-sm"
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <p className="text-center text-[9px] font-black uppercase tracking-widest text-gray-300">
                    LEO • Vision 2026 • by lukilot.work
                </p>
            </div>
        </main>
    );
}
