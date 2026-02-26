"use client";

import Link from "next/link";
import { ArrowRight, User, Zap, Activity, Users, Cpu, TrendingUp, Factory, ShieldAlert, Lock, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const hqCards = [
    {
      title: "Sztab Generalny",
      subtitle: "HQ / MACRO CONTROL",
      href: "/dispatch",
      icon: Activity,
      color: "bg-black text-white"
    },
    {
      title: "Panel Inżynieryjny",
      subtitle: "BIG DATA / OPTYMALIZACJA",
      href: "/engineering",
      icon: Cpu,
      color: "bg-zinc-900 text-leo-primary border border-leo-primary/20 shadow-[0_0_20px_rgba(255,215,0,0.1)]"
    },
    {
      title: "Partner Flotowy",
      subtitle: "B2B / ROZLICZENIA",
      href: "/dispatch/fleet",
      icon: Users,
      color: "bg-white text-black border border-gray-200"
    }
  ];

  const mobileCards = [
    {
      title: "Executive",
      subtitle: "ZARZĄD (CEO/COO)",
      href: "/exec",
      icon: TrendingUp,
      color: "bg-black text-white"
    },
    {
      title: "Operations",
      subtitle: "DYSPOZYTOR / LIVE",
      href: "/ops",
      icon: Activity,
      color: "bg-white text-black border border-gray-200"
    },
    {
      title: "Warehouse",
      subtitle: "SORTOWNIA / RAMPA",
      href: "/warehouse/mobile",
      icon: Factory,
      color: "bg-black text-white"
    },
    {
      title: "CX Support",
      subtitle: "REKLAMACJE / POMOC",
      href: "/cx",
      icon: ShieldAlert,
      color: "bg-white text-black border border-gray-200"
    }
  ];

  return (
    <main className="min-h-screen bg-[#F5F5F4] flex flex-col items-center p-6 sm:p-24 font-sans selection:bg-leo-primary/10">
      <div className="w-full max-w-xl space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-8xl font-black italic tracking-tighter text-[#1A1A1A]"
          >
            LEO
          </motion.h1>
          <div className="flex flex-col items-center gap-3">
            <div className="inline-block px-6 py-2 bg-leo-primary rounded-full shadow-xl shadow-leo-primary/20">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black">Vision 2026 Protocol</p>
            </div>
          </div>
        </div>

        {/* TOP TIER: COURIER & CUSTOMER (B2C PILLARS) */}
        <div className="space-y-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-leo-primary text-center italic">Core Ecosystem Modules</h2>

          {/* 1. COURIER (THE PULSE) */}
          <Link href="/courier/day" className="block group">
            <div className="relative p-10 rounded-[48px] bg-black text-white flex flex-col items-start transition-all active:scale-[0.98] shadow-2xl border-4 border-leo-primary/30 group-hover:border-leo-primary group-hover:shadow-leo-primary/10 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Zap className="w-48 h-48 text-leo-primary" />
              </div>
              <div className="flex justify-between w-full items-start mb-8 relative z-10">
                <div className="p-5 rounded-3xl bg-leo-primary text-black">
                  <Zap className="w-8 h-8 fill-current" />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-leo-primary/10 border border-leo-primary/20 rounded-full">
                  <Lock className="w-3 h-3 text-leo-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-leo-primary">LOCKED PROTOCOL</span>
                </div>
              </div>
              <div className="relative z-10 space-y-1">
                <div className="text-[12px] font-black uppercase tracking-[0.4em] text-leo-primary italic">Primary Terminal</div>
                <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white">Courier Day</h3>
                <p className="text-[13px] font-medium text-white/40 uppercase tracking-widest leading-relaxed pt-4 max-w-xs">
                  System operacyjny kuriera. Automatyczne okna 15-min i nawigacja dynamiczna.
                </p>
              </div>
            </div>
          </Link>

          {/* 2. CUSTOMER (THE EXPERIENCE) */}
          <Link href="/customer/packages" className="block group">
            <div className="relative p-10 rounded-[48px] bg-white text-black flex flex-col items-start transition-all active:scale-[0.98] shadow-xl border-4 border-gray-100 group-hover:border-leo-primary group-hover:shadow-leo-primary/5 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 group-hover:scale-125 transition-transform duration-700">
                <Heart className="w-48 h-48" />
              </div>
              <div className="flex justify-between w-full items-start mb-8 relative z-10">
                <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100 group-hover:bg-leo-primary group-hover:border-leo-primary group-hover:text-black text-gray-400 transition-colors">
                  <User className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/5 border border-green-500/10 rounded-full">
                  <Sparkles className="w-3 h-3 text-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-600">PREMIUM CX</span>
                </div>
              </div>
              <div className="relative z-10 space-y-1">
                <div className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-400 italic">B2C Portal</div>
                <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-black">Moje Paczki</h3>
                <p className="text-[13px] font-medium text-gray-400 uppercase tracking-widest leading-relaxed pt-4 max-w-xs">
                  Inteligentny Profil Odbiorcy (IPO) i Plan B dla każdej dostawy.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* HQ / Desktop Section */}
        <div className="space-y-6 pt-12">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 text-center">Centrale Operacyjne (Desktop)</h2>
          <div className="grid gap-4">
            {hqCards.map((card, i) => (
              <Link key={i} href={card.href} className="block group">
                <div className={`p-8 rounded-[40px] flex items-center transition-all active:scale-[0.98] ${card.color} shadow-lg group-hover:shadow-xl border border-white/5`}>
                  <div className={`p-4 rounded-2xl mr-6 ${card.color.includes('bg-white') ? 'bg-gray-100' : 'bg-white/10'}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{card.subtitle}</div>
                    <div className="text-xl font-black italic uppercase tracking-tighter">{card.title}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Terminals Section */}
        <div className="space-y-6 pt-12">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 text-center">Role-Based Terminals (RWD)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mobileCards.map((card, i) => (
              <Link key={i} href={card.href} className="block group">
                <div className={`p-8 rounded-[40px] flex flex-col items-start transition-all active:scale-[0.98] ${card.color} shadow-lg h-full border border-gray-100/10`}>
                  <div className={`p-4 rounded-2xl mb-6 ${card.color.includes('bg-white') ? 'bg-gray-50' : 'bg-white/10'}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{card.subtitle}</div>
                    <div className="text-lg font-black italic uppercase tracking-tighter">{card.title}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Scanner Test */}
        <div className="pt-8">
          <Link href="/scan-test" className="block group">
            <div className="p-6 rounded-[2rem] bg-black border-2 border-leo-primary/30 group-hover:border-leo-primary flex items-center gap-4 transition-all">
              <div className="w-12 h-12 bg-leo-primary rounded-2xl flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-black fill-current" />
              </div>
              <div className="flex-1">
                <div className="text-[9px] font-black text-leo-primary uppercase tracking-widest">Narzędzie testowe</div>
                <div className="text-white font-black italic uppercase tracking-tighter text-lg">Test Skanera QR</div>
                <div className="text-white/30 text-[10px] font-medium mt-0.5">Przetestuj kamerę bez logowania</div>
              </div>
              <ArrowRight className="w-5 h-5 text-leo-primary opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>

        {/* Footer info */}
        <div className="text-center pt-16 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">
            Logistyka Naturalna • Vision 2026
          </p>
          <div className="pt-4">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-leo-primary opacity-60 italic">Design and execution by lukilot.work</p>
          </div>
        </div>
      </div>

      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03]" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
    </main>
  );
}
