"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function DefaultThought() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-[720px] mx-auto z-20 mt-16 p-16 md:p-24 border border-dashed border-[#7C3AED]/20 bg-gradient-to-r from-[rgba(255,255,255,0.01)] via-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.01)] rounded-[6px] flex flex-col items-center justify-center text-center relative overflow-hidden"
    >
      {/* Shimmer overlay for 'waiting' state */}
      <div className="absolute inset-0 skeleton-thought opacity-50" />

      <div className="relative z-10 flex flex-col items-center">
        <h3 className="font-mono text-lg text-[#F4F4F5] tracking-tight mb-8">
          [ The spotlight is empty. ]
        </h3>

        <div className="text-[#A1A1AA] text-2xl mb-8 animate-[pulse_3s_ease-in-out_infinite] opacity-30">
          ◈
        </div>

        <p className="font-ui text-base text-[#A1A1AA] max-w-sm mb-12">
          No thought has been claimed today.<br/>
          Be the first developer to own this moment.
        </p>

        <Link 
          href="/dashboard"
          className="group font-mono text-sm text-[#7C3AED] hover:text-[#9D65FF] transition-colors border border-transparent hover:border-[#7C3AED]/30 bg-transparent hover:bg-[#7C3AED]/10 px-6 py-2.5 rounded-sm flex items-center gap-2"
        >
          <span className="group-hover:translate-x-1 transition-transform">→</span>
          Claim today's thought
        </Link>
      </div>
    </motion.div>
  );
}
