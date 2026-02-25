"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import { User, Settings, LogOut, Car, Shield, BellRing, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CourierProfile() {
    return (
        <div className="min-h-screen bg-leo-bg pb-24 relative overflow-y-auto">
            {/* Header / Avatar Section bg */}
            <div className="bg-leo-primary pt-12 pb-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                <div className="relative z-10 flex justify-between items-start">
                    <h1 className="text-2xl font-bold text-white">Profil</h1>
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                        <Settings className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {/* Profile Info Overlay */}
            <main className="px-4 -mt-16 space-y-4 relative z-20">
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-leo-gray-100/50 flex flex-col items-center text-center">
                    <div className="h-24 w-24 bg-gradient-to-tr from-leo-primary to-blue-400 rounded-full flex items-center justify-center border-4 border-white shadow-md mb-3">
                        <User className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-leo-gray-900">Łukasz Kurierski</h2>
                    <p className="text-leo-gray-500 font-medium mb-4">ID: LEO-891-B</p>

                    <div className="w-full grid grid-cols-2 gap-3 pt-4 border-t border-leo-gray-100">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-leo-primary">4.92</span>
                            <span className="text-xs text-leo-gray-400 font-bold uppercase tracking-wider">Ocena</span>
                        </div>
                        <div className="flex flex-col items-center border-l border-leo-gray-100">
                            <span className="text-2xl font-black text-leo-primary">2.4k</span>
                            <span className="text-xs text-leo-gray-400 font-bold uppercase tracking-wider">Dostawy</span>
                        </div>
                    </div>
                </div>

                {/* Settings List */}
                <div className="bg-white rounded-2xl shadow-sm border border-leo-gray-100 overflow-hidden mt-4">
                    <div className="p-4 flex items-center gap-4 border-b border-leo-gray-50">
                        <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                            <Car className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-leo-gray-900">Pojazd i Rejon</div>
                            <div className="text-sm text-leo-gray-500">Mokotów, Mercedes Sprinter</div>
                        </div>
                    </div>

                    <div className="p-4 flex items-center gap-4 border-b border-leo-gray-50">
                        <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                            <BellRing className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-leo-gray-900">Powiadomienia PUSH</div>
                            <div className="text-sm text-leo-gray-500">Dyspozytornia i Klienci</div>
                        </div>
                    </div>

                    <div className="p-4 flex items-center gap-4 border-b border-leo-gray-50">
                        <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-leo-gray-900">Zgłoś Incydent</div>
                            <div className="text-sm text-leo-gray-500">Wypadek / Awaria sprzętu</div>
                        </div>
                    </div>

                    <div className="p-4 flex items-center justify-center gap-2 text-red-600 font-bold hover:bg-red-50 cursor-pointer transition-colors pt-5 pb-5">
                        <LogOut className="h-5 w-5" />
                        Wyloguj sesję
                    </div>
                </div>

                <p className="text-center text-xs text-leo-gray-400 py-4">Leo Delivery App v1.2.0-rc2</p>

            </main>

            <BottomNav />
        </div>
    );
}
