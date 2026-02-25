"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FibonacciIntro } from "@/components/intro/FibonacciIntro";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-leo-bg">
      <AnimatePresence>
        {showIntro && <FibonacciIntro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-leo-primary">LEO</h1>
            <p className="text-leo-gray-500">Wybierz wersję aplikacji do testów</p>
          </div>

          <div className="grid gap-4">
            <Link href="/courier/onboarding">
              <Button size="lg" className="w-full h-20 text-lg justify-start px-6 group" variant="primary">
                <div className="bg-white/10 p-2 rounded-lg mr-4 group-hover:bg-white/20 transition-colors">
                  <Truck className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Kurier</div>
                  <div className="text-xs opacity-80 font-normal">Narzędzie operacyjne</div>
                </div>
                <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>

            <Link href="/customer/onboarding">
              <Button size="lg" className="w-full h-20 text-lg justify-start px-6 group" variant="secondary">
                <div className="bg-leo-gray-200 p-2 rounded-lg mr-4 group-hover:bg-leo-gray-300 transition-colors">
                  <User className="h-6 w-6 text-leo-gray-700" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-leo-gray-900">Odbiorca</div>
                  <div className="text-xs text-leo-gray-500 font-normal">Aplikacja klienta</div>
                </div>
                <ArrowRight className="ml-auto text-leo-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </div>

          <p className="text-xs text-leo-gray-400 mt-8">
            LEO Prototype v0.1 • Next.js + Tailwind
            <br />
            <span className="opacity-50">Inspiracja: Ciąg Fibonacciego</span>
          </p>
        </motion.div>
      )}
    </main>
  );
}
