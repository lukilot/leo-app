"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import { CreditCard, Zap, History, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerAccount() {
    return (
        <div className="min-h-screen bg-leo-bg pb-24 relative overflow-y-auto">
            <header className="bg-white p-6 border-b border-leo-gray-100 sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-leo-primary">Konto i Płatności</h1>
            </header>

            <main className="p-4 space-y-6">
                {/* Leo+ Subscription */}
                <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-3xl p-6 shadow-lg border border-yellow-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Zap className="h-24 w-24 text-white" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-black text-2xl text-yellow-900 tracking-tight">LEO</span>
                            <span className="bg-yellow-900 text-yellow-300 text-xs font-bold px-2 py-0.5 rounded-full">+</span>
                        </div>
                        <p className="text-yellow-900 font-medium text-sm w-2/3">Darmowe zwroty, priorytetowa dostawa i ekskluzywne okna czasowe.</p>

                        <div className="mt-6 flex justify-between items-end">
                            <div>
                                <div className="text-yellow-800 text-xs font-bold uppercase">Ważny do</div>
                                <div className="text-yellow-900 font-black">12 Paź 2026</div>
                            </div>
                            <Button size="sm" className="bg-yellow-900 text-yellow-100 hover:bg-yellow-800 rounded-xl">Zarządzaj</Button>
                        </div>
                    </div>
                </div>

                {/* Main Settings List */}
                <div className="bg-white rounded-2xl shadow-sm border border-leo-gray-100 overflow-hidden">
                    <div className="p-4 flex items-center gap-4 border-b border-leo-gray-50 cursor-pointer hover:bg-gray-50">
                        <div className="h-10 w-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center shrink-0">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-leo-gray-900">Metody Płatności</div>
                            <div className="text-sm text-leo-gray-500">••• 4242</div>
                        </div>
                    </div>

                    <div className="p-4 flex items-center gap-4 border-b border-leo-gray-50 cursor-pointer hover:bg-gray-50">
                        <div className="h-10 w-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center shrink-0">
                            <History className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-leo-gray-900">Historia Transakcji</div>
                            <div className="text-sm text-leo-gray-500">Zobacz opłacone pobrania</div>
                        </div>
                    </div>

                    <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50">
                        <div className="h-10 w-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center shrink-0">
                            <HelpCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-leo-gray-900">Pomoc i Kontakt</div>
                            <div className="text-sm text-leo-gray-500">FAQ, Zgłoś problem</div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Button variant="outline" className="w-full text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 h-14 rounded-2xl">
                        <LogOut className="mr-2 h-5 w-5" />
                        Wyloguj się
                    </Button>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
