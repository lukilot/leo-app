"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, User, Zap, Activity, Brain, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FibonacciIntro } from "@/components/intro/FibonacciIntro";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-leo-bg">
      <AnimatePresence>
        {showIntro && <FibonacciIntro key="intro" onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center space-y-8"
        >
          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tight text-leo-primary italic">LEO</h1>
            <h2 className="text-xl font-bold text-leo-secondary leading-tight">LOGISTYKA NATURALNA</h2>
            <p className="text-leo-gray-500 text-sm max-w-[280px] mx-auto leading-relaxed">System operacyjny ostatniej mili. <br />Jutro zaczyna się dzisiaj.</p>
          </div>

          <div className="grid gap-4">
            <Link href="/dispatch">
              <Button size="lg" className="w-full h-24 text-lg justify-start px-6 group border border-leo-gray-200 bg-white hover:bg-leo-bg transition-all rounded-[28px] shadow-sm" variant="ghost">
                <div className="bg-leo-secondary p-3 rounded-2xl mr-4 group-hover:scale-110 transition-transform">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-leo-secondary text-[16px]">Sztab Generalny</div>
                  <div className="text-[11px] text-leo-gray-500 font-medium uppercase tracking-wider">Kontrola Makro-Miasta</div>
                </div>
                <ArrowRight className="ml-auto text-leo-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>

            <Link href="/dispatch/fleet">
              <Button size="lg" className="w-full h-24 text-lg justify-start px-6 group border border-leo-gray-200 bg-white hover:bg-leo-bg transition-all rounded-[28px] shadow-sm" variant="ghost">
                <div className="bg-leo-primary/10 p-3 rounded-2xl mr-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-leo-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-leo-secondary text-[16px]">Partner Flotowy</div>
                  <div className="text-[11px] text-leo-gray-500 font-medium uppercase tracking-wider">Menedżer Floty / Płatności</div>
                </div>
                <ArrowRight className="ml-auto text-leo-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>

            <Link href="/courier/day">
              <Button size="lg" className="w-full h-24 text-lg justify-start px-6 group bg-leo-primary hover:bg-leo-primary/95 text-white rounded-[28px] shadow-[0_10px_30px_rgba(232,93,4,0.15)] overflow-hidden relative" variant="primary">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[80px] pointer-events-none" />
                <div className="bg-white/20 p-3 rounded-2xl mr-4 group-hover:scale-110 transition-transform relative z-10">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="text-left relative z-10">
                  <div className="font-bold text-[16px]">Aplikacja Kuriera</div>
                  <div className="text-[11px] opacity-70 font-medium uppercase tracking-wider">Zero Tarcia / Okna 15-min</div>
                </div>
                <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity relative z-10" />
              </Button>
            </Link>

            <Link href="/customer/packages">
              <Button size="lg" className="w-full h-24 text-lg justify-start px-6 group border border-leo-gray-200 bg-white hover:bg-leo-bg transition-all rounded-[28px] shadow-sm" variant="ghost">
                <div className="bg-leo-accent/40 p-3 rounded-2xl mr-4 group-hover:scale-110 transition-transform">
                  <User className="h-6 w-6 text-leo-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-leo-secondary text-[16px]">Portal Odbiorcy</div>
                  <div className="text-[11px] text-leo-gray-500 font-medium uppercase tracking-wider">IPO / Plan B / Live Tracking</div>
                </div>
                <ArrowRight className="ml-auto text-leo-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex flex-col items-center gap-1 opacity-40">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-leo-secondary">Vision 2026 Protocol</p>
            <p className="text-[9px] font-medium text-leo-gray-500 tracking-widest text-center px-8">
              Autonomiczna optymalizacja ostatniej mili. System zdarzeń czasu rzeczywistego.
            </p>
          </div>
        </motion.div>
      )}
    </main>
  );
}
