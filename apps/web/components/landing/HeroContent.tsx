"use client";

import { motion } from "framer-motion";

export function HeroContent() {
  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-12"
      >
        <span className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" />
        <span className="font-mono text-[10px] md:text-xs text-white/60 uppercase tracking-[0.4em]">
          Global Consciousness Feed
        </span>
      </motion.div>

      <h1 className="text-3xl md:text-5xl font-bold tracking-[-0.05em] leading-[1.1] text-white select-none">
        <span className="block opacity-10 hover:opacity-100 transition-opacity duration-1000 cursor-default">THINK DIFFERENT</span>
        <span className="block text-white/95 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">SHARE TODAY.</span>
      </h1>
    </div>
  );
}
