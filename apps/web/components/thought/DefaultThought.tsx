"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function DefaultThought() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      className="w-full flex flex-col items-center justify-center text-center p-8"
    >
      <div className="relative z-10 flex flex-col items-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/30 mb-12">
          The void awaits your presence
        </p>

        <h3 className="font-ui text-3xl font-light text-white/80 tracking-tight leading-relaxed mb-12 max-w-[300px]">
          No thought has been <br/> claimed today.
        </h3>

        <Link 
          href="/dashboard"
          className="group font-mono text-[10px] text-white hover:text-[#FFD700] transition-colors border border-white/10 hover:border-[#FFD700]/30 bg-white/5 hover:bg-white/10 px-8 py-3 rounded-full uppercase tracking-widest flex items-center gap-3 active:scale-95"
        >
          Claim the moment
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </motion.div>
  );
}
