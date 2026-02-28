"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PremiumButton } from "../landing/PremiumButton";

export function DefaultThought() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      className="w-full flex flex-col items-center justify-center text-center p-8"
    >
      <div className="relative z-10 flex flex-col items-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-purple-500/50 mb-12">
          The void awaits your presence
        </p>

        <h3 className="font-ui text-3xl font-extralight text-white/90 tracking-tight leading-relaxed mb-12 max-w-[320px]">
          No thought has been <br/> <span className="text-purple-400/80 italic">claimed</span> today.
        </h3>

        <Link href="/dashboard" className="group/btn relative">
          <div className="absolute -inset-4 bg-purple-500/10 blur-2xl rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />
          <PremiumButton variant="outline" className="px-12 relative z-10 border-purple-500/20 hover:border-purple-500/40">
            Claim the moment
            <span className="ml-3 text-[12px] opacity-70 group-hover/btn:translate-x-1 transition-transform inline-block">→</span>
          </PremiumButton>
        </Link>
      </div>
    </motion.div>
  );
}
