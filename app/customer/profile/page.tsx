"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import { User, Settings, PackageOpen, MapPin, Bell, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CustomerProfile() {
    return (
        <div className="min-h-screen bg-leo-bg pb-24 relative overflow-y-auto">
            <header className="bg-white p-6 border-b border-leo-gray-100 sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-leo-primary">Twój Profil</h1>
            </header>

            <main className="p-4 space-y-6">
                <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-leo-gray-100 shadow-sm">
                    <div className="h-16 w-16 bg-gradient-to-tr from-leo-primary to-blue-400 rounded-full flex items-center justify-center border-2 border-white shadow-md shrink-0">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-leo-gray-900 leading-tight">Marek Klient</h2>
                        <p className="text-leo-gray-500 text-sm">marek.k@example.com</p>
                        <div className="mt-1 bg-yellow-100 text-yellow-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block">Leo Premium</div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-leo-gray-400">
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>

                <div>
                    <h3 className="font-bold text-lg text-leo-gray-900 mb-3 px-1">Domyślne preferencje</h3>

                    <div className="bg-white rounded-2xl border border-leo-gray-100 overflow-hidden shadow-sm">
                        <div className="p-4 flex items-center gap-4 border-b border-leo-gray-50 active:bg-gray-50 transition-colors cursor-pointer">
                            <div className="h-10 w-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                                <PackageOpen className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-leo-gray-900">Ulubiony punkt</div>
                                <div className="text-sm text-leo-gray-500">Paczkomat WAW123M</div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-leo-gray-300" />
                        </div>

                        <div className="p-4 flex items-center gap-4 border-b border-leo-gray-50 active:bg-gray-50 transition-colors cursor-pointer">
                            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-leo-gray-900">Zostaw paczkę</div>
                                <div className="text-sm text-leo-gray-500">Pod drzwiami</div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-leo-gray-300" />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-lg text-leo-gray-900 mb-3 px-1">Ustawienia aplikacji</h3>

                    <div className="bg-white rounded-2xl border border-leo-gray-100 overflow-hidden shadow-sm">
                        <div className="p-4 flex items-center gap-4 border-b border-leo-gray-50 active:bg-gray-50 transition-colors cursor-pointer">
                            <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                                <Bell className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-leo-gray-900">Powiadomienia</div>
                                <div className="text-sm text-leo-gray-500">SMS, Push</div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-leo-gray-300" />
                        </div>

                        <div className="p-4 flex items-center gap-4 active:bg-gray-50 transition-colors cursor-pointer">
                            <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-leo-gray-900">Prywatność i bezpieczeństwo</div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-leo-gray-300" />
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
