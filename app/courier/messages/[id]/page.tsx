"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Phone, MoreVertical, Mic, Paperclip } from "lucide-react";
import { motion } from "framer-motion";

// Mock data to match what was in /messages
interface Message {
    id: number;
    sender: "me" | "them";
    text: string;
    time: string;
}

const CHATS_DB: Record<string, { name: string; avatar: string; messages: Message[] }> = {
    "1": {
        name: "Dyspozytornia (Kamil)",
        avatar: "DK",
        messages: [
            { id: 1, sender: "them", text: "Cześć, uwaga na wypadek na Puławskiej.", time: "10:15" },
            { id: 2, sender: "me", text: "Dzięki, już mnie nawigacja kieruje objazdem przez Al. Niepodległości.", time: "10:18" },
            { id: 3, sender: "them", text: "Zmieniła się trasa na sektor B. Załadunek o 14.", time: "10:24" },
        ]
    },
    "2": {
        name: "Anna Nowak (Paczka #412)",
        avatar: "AN",
        messages: [
            { id: 1, sender: "me", text: "Dzień dobry, paczka będzie u Pani około 14:30.", time: "09:00" },
            { id: 2, sender: "them", text: "Będę w domu po 15:00, proszę zostawić...", time: "09:12" },
        ]
    }
};

export default function ChatThread() {
    const params = useParams();
    const router = useRouter();
    const chatId = params.id as string;

    // Default chat to load
    const chat = CHATS_DB[chatId] || { name: "Nieznany Menedżer", avatar: "?", messages: [] as Message[] };

    const [messages, setMessages] = useState<Message[]>(chat.messages);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom when messages change
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!newMessage.trim()) return;

        const msg: Message = {
            id: Date.now(),
            sender: "me" as const,
            text: newMessage,
            time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, msg]);
        setNewMessage("");

        // Simulate reply if talking to dispatch
        if (chatId === "1") {
            setIsTyping(true);
            setTimeout(() => {
                const reply: Message = {
                    id: Date.now() + 1,
                    sender: "them" as const,
                    text: "Przyjąłem, wprowadzam do systemu.",
                    time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, reply]);
                setIsTyping(false);
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-leo-bg flex flex-col">
            {/* Header */}
            <header className="bg-white p-4 border-b border-leo-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
                        <ArrowLeft className="h-6 w-6 text-leo-primary" />
                    </Button>
                    <div className="h-10 w-10 bg-leo-primary text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {chat.avatar}
                    </div>
                    <div>
                        <h1 className="font-bold text-leo-primary text-base leading-tight truncate w-40">{chat.name}</h1>
                        <p className="text-xs text-green-600 font-medium">Aktywny teraz</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="text-leo-primary">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-leo-gray-400">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 p-4 space-y-4 overflow-y-auto pb-6">
                <div className="text-center text-xs text-leo-gray-400 my-4 font-medium uppercase tracking-wider">
                    Dzisiaj
                </div>

                {messages.map((msg, idx) => {
                    const isMe = msg.sender === "me";
                    const isLast = idx === messages.length - 1;

                    return (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            {!isMe && isLast && (
                                <div className="h-8 w-8 bg-leo-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-auto shrink-0 shadow-sm">
                                    {chat.avatar}
                                </div>
                            )}
                            <div className={`
                                max-w-[75%] rounded-2xl p-3 shadow-sm relative
                                ${isMe
                                    ? "bg-leo-primary text-white rounded-br-sm"
                                    : "bg-white text-leo-gray-900 border border-leo-gray-100 rounded-bl-sm"}
                                ${!isMe && !isLast ? "ml-10" : ""}
                            `}>
                                <div className="text-sm leading-relaxed">{msg.text}</div>
                                <div className={`text-[10px] mt-1 font-medium text-right ${isMe ? "text-white/70" : "text-leo-gray-400"}`}>
                                    {msg.time} {isMe && "✓✓"}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start items-center ml-10 mt-2"
                    >
                        <div className="bg-white border border-leo-gray-100 rounded-2xl rounded-bl-sm p-3 px-4 shadow-sm flex gap-1">
                            <span className="w-2 h-2 bg-leo-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-leo-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-leo-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}

                <div ref={bottomRef} />
            </main>

            {/* Input Footer */}
            <div className="bg-white border-t border-leo-gray-200 p-3 pb-safe-bottom">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0 text-leo-gray-400">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 bg-leo-gray-50 border border-leo-gray-200 rounded-full flex items-center px-4">
                        <input
                            className="w-full bg-transparent h-12 outline-none text-sm"
                            placeholder="Napisz wiadomość..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <Button variant="ghost" size="icon" className="shrink-0 text-leo-gray-400 ml-2">
                            <Mic className="h-5 w-5" />
                        </Button>
                    </div>

                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className={`shrink-0 rounded-full h-12 w-12 transition-colors ${newMessage.trim() ? "bg-leo-primary text-white" : "bg-leo-gray-200 text-leo-gray-400"
                            }`}
                    >
                        <Send className="h-5 w-5 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
