"use client";

import { useState, useEffect } from "react";
import {
    Search, FileText, History, AlertCircle, MessageSquare,
    ChevronRight, Calendar, User, Truck, MapPin, ArrowRight,
    CheckCircle2, XCircle, Clock, ShieldAlert, Send, Zap,
    Phone, Mail, BrainCircuit, Loader2, ListFilter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CXMobile() {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activePackage, setActivePackage] = useState<any>(null);

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    const mockPackage = {
        id: "LEO-992-001",
        status: "EXCEPTION",
        reason: "BRAK DOSTĘPU (KOD DO BRAMY NIEPOPRAWNY)",
        recipient: "Jan Kowalski",
        address: "ul. Marszałkowska 10, 00-001 Warszawa",
        phone: "+48 600 000 000",
        courier: "Łukasz K. (LEO-01)",
        history: [
            { time: "08:12", event: "Paczka przyjęta w HUB WWA-01", type: "system" },
            { time: "09:45", event: "Wydano kurierowi do doręczenia", type: "truck" },
            { time: "11:30", event: "Próba doręczenia - nieudana (Brak kodu)", type: "error" },
            { time: "11:32", event: "Zgłoszono wyjątek CX", type: "cx" }
        ]
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center font-sans tracking-widest text-gray-400">
                <BrainCircuit className="w-12 h-12 text-leo-primary animate-pulse mb-6" />
                <p className="text-[10px] font-black uppercase">CX Protocol Initializing...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-leo-primary/10 pb-32">
            {/* CX TACTICAL HEADER */}
            <header className="px-6 pt-16 pb-6 sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-[20px] font-black uppercase tracking-tighter italic leading-none text-black">LEO <span className="text-leo-primary">CX CORE</span></h1>
                        <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1.5 flex items-center gap-1.5 italic">
                            Customer Experience Terminal
                            <div className="h-1.5 w-1.5 bg-leo-primary rounded-full animate-pulse" />
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-leo-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="SZUKAJ PO NR TRACKINGU / NAZWISKU..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (e.target.value.length > 5) setActivePackage(mockPackage);
                            else setActivePackage(null);
                        }}
                        className="w-full h-16 bg-gray-50 border border-gray-100 rounded-[2rem] pl-14 pr-6 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-leo-primary/5 focus:bg-white transition-all placeholder:text-gray-300"
                    />
                </div>
            </header>

            <main className="px-6 pt-8 space-y-8">
                <AnimatePresence mode="wait">
                    {!activePackage ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="py-24 text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-gray-50 rounded-[40px] flex items-center justify-center mx-auto border border-gray-100 shadow-sm">
                                <Search className="w-8 h-8 text-gray-200" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-[17px] font-black uppercase tracking-tighter italic text-gray-400">Oczekiwanie na dane...</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 leading-relaxed px-12">Wprowadź numer przesyłki, aby rozpocząć procedurę wsparcia klienta.</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* STATUS CARD */}
                            <section className="bg-white rounded-[40px] p-8 border border-gray-200 shadow-xl shadow-gray-200/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <ShieldAlert className="w-24 h-24" />
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="px-4 py-1.5 bg-red-50 rounded-full border border-red-100">
                                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Wymagana Akcja CX</span>
                                    </div>
                                    <span className="text-[14px] font-black text-black">{activePackage.id}</span>
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic text-black leading-none mb-4">{activePackage.reason}</h3>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ostatnia aktywność: 11:32</span>
                                </div>
                            </section>

                            {/* RECIPIENT & CONTEXT */}
                            <section className="grid gap-4">
                                <div className="bg-white rounded-[32px] p-6 border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-[15px] font-black text-black uppercase tracking-tighter leading-none italic">{activePackage.recipient}</div>
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1.5">{activePackage.phone}</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="h-10 w-10 rounded-xl bg-leo-primary/10 border border-leo-primary/20"><Phone className="w-4 h-4 text-leo-primary" /></Button>
                                </div>
                                <div className="bg-white rounded-[32px] p-6 border border-gray-100 flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-black text-black uppercase tracking-tight italic leading-snug">{activePackage.address}</div>
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">Kurier: {activePackage.courier}</div>
                                    </div>
                                </div>
                            </section>

                            {/* ACTION BUTTONS */}
                            <section className="bg-black rounded-[40px] p-8 space-y-6">
                                <h3 className="text-white text-[18px] font-black uppercase tracking-tighter leading-none italic">Szybkie Zarządzanie</h3>
                                <div className="grid gap-3">
                                    <Button className="w-full h-16 rounded-2xl bg-leo-primary text-black font-black uppercase tracking-widest text-[11px] border-0 hover:scale-[1.02] transition-transform">Ustaw Plan B (Zastępczy)</Button>
                                    <Button className="w-full h-16 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[11px] border-0">Przesuń Termin Doręczenia</Button>
                                    <Button className="w-full h-14 rounded-2xl bg-white/10 text-white font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-white/20">Eskaluj do Dyspozytora</Button>
                                </div>
                            </section>

                            {/* EVENT HISTORY */}
                            <section className="space-y-4">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Historia Zdarzeń (Live)</h2>
                                <div className="bg-white rounded-[40px] p-8 border border-gray-100 space-y-8 relative">
                                    <div className="absolute left-8 top-12 bottom-12 w-[1px] bg-gray-100" />
                                    {activePackage.history.map((event: any, i: number) => (
                                        <div key={i} className="flex gap-6 relative z-10">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm shrink-0 transition-colors",
                                                event.type === 'error' ? "bg-red-50 text-red-600" : event.type === 'cx' ? "bg-leo-primary text-black" : "bg-gray-50 text-gray-300"
                                            )}>
                                                {event.type === 'truck' ? <Truck className="w-5 h-5" /> : event.type === 'error' ? <AlertCircle className="w-5 h-5" /> : event.type === 'cx' ? <Zap className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-black uppercase tracking-tighter italic text-black leading-tight">{event.event}</div>
                                                <div className="text-[9px] font-black text-gray-400 tracking-widest uppercase mt-1">{event.time} • {event.type.toUpperCase()} NODE</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* AUTO-RESPONSES */}
                            <section className="space-y-4">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Szybkie Odpowiedzi</h2>
                                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                                    {[
                                        "Przepraszamy za opóźnienie, kurier ponowi próbę...",
                                        "Paczka oczekuje na Plan B w punkcie...",
                                        "Błędny kod do bramy. Prosimy o aktualizację...",
                                        "Przesyłka zostanie doręczona jutro rano..."
                                    ].map((msg, i) => (
                                        <button key={i} className="flex-none bg-white border border-gray-100 rounded-3xl p-5 w-64 text-left active:bg-gray-50 transition-colors shadow-sm">
                                            <p className="text-[11px] font-medium text-gray-600 uppercase tracking-tight italic leading-relaxed">"{msg}"</p>
                                            <div className="flex justify-between items-center mt-4">
                                                <div className="text-[8px] font-black text-leo-primary uppercase tracking-widest">Wyslij SMS</div>
                                                <Send className="w-3 h-3 text-leo-primary" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* CX NAVIGATION DOCK */}
            <div className="fixed bottom-10 left-6 right-6 z-[100] bg-black text-white px-8 py-5 rounded-[2.5rem] shadow-3xl flex justify-between items-center border-t border-white/10">
                {[
                    { icon: Search, label: 'Search' },
                    { icon: ListFilter, label: 'Filters' },
                    { icon: MessageSquare, label: 'Chat' },
                    { icon: History, label: 'Logs' },
                ].map((item, i) => (
                    <button key={i} className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                        <item.icon className="w-5 h-5" />
                        <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Design Credit */}
            <div className="text-center pt-8 pb-32">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-leo-primary opacity-30 italic">Design and execution by lukilot.work</p>
            </div>

            {/* Grain */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>
    );
}
