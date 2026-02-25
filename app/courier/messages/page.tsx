"use client";

import { useState } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Search, MessageSquare, Phone, MoreVertical, CheckCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const CHATS = [
    { id: 1, name: "Dyspozytornia (Kamil)", text: "Zmieniła się trasa na sektor B. Załadunek o 14.", time: "10:24", unread: 2, avatar: "DK" },
    { id: 2, name: "Anna Nowak (Paczka #412)", text: "Będę w domu po 15:00, proszę zostawić...", time: "09:12", unread: 1, avatar: "AN" },
    { id: 3, name: "Jan Kowalski (Paczka #81)", text: "Dziękuję za przesyłkę!", time: "Wczoraj", unread: 0, avatar: "JK" },
    { id: 4, name: "Infolinia Kurierska", text: "Awaria systemu PDA rozwiązana.", time: "Wczoraj", unread: 0, avatar: "IK", system: true },
];

export default function Messages() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-leo-bg pb-24 relative overflow-hidden">
            {/* Header */}
            <header className="bg-white p-6 pb-4 border-b border-leo-gray-100 sticky top-0 z-10">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-leo-primary">Wiadomości</h1>
                    <div className="h-10 w-10 bg-leo-gray-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-leo-primary" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-leo-gray-400" />
                    <Input
                        placeholder="Szukaj odbiorcy lub paczki..."
                        className="pl-10 h-12 bg-leo-gray-50 border-transparent focus-visible:ring-leo-primary rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <main className="p-4 space-y-2">
                {CHATS.map((chat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={chat.id}
                        className="bg-white p-4 rounded-2xl flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer shadow-sm hover:shadow-md border border-transparent hover:border-leo-gray-100"
                    >
                        <div className={`h-14 w-14 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${chat.system ? 'bg-blue-100 text-blue-700' : (chat.unread > 0 ? 'bg-leo-primary text-white' : 'bg-leo-gray-100 text-leo-gray-500')}`}>
                            {chat.avatar}
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-end mb-1">
                                <h3 className={`font-bold truncate pr-2 ${chat.unread > 0 ? 'text-leo-gray-900' : 'text-leo-gray-700'}`}>{chat.name}</h3>
                                <span className={`text-xs shrink-0 ${chat.unread > 0 ? 'text-leo-primary font-bold' : 'text-leo-gray-400'}`}>{chat.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {chat.unread === 0 && <CheckCheck className="h-4 w-4 text-blue-500 shrink-0" />}
                                <p className={`text-sm truncate ${chat.unread > 0 ? 'font-semibold text-leo-gray-800' : 'text-leo-gray-500'}`}>
                                    {chat.text}
                                </p>
                            </div>
                        </div>

                        {chat.unread > 0 && (
                            <div className="bg-leo-primary text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                {chat.unread}
                            </div>
                        )}
                    </motion.div>
                ))}

                {CHATS.length > 0 && (
                    <div className="text-center py-8 text-leo-gray-400 text-sm">
                        To wszystkie najnowsze wiadomości.
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
