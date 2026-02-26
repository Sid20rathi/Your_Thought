"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="min-h-[100svh] flex flex-col items-center justify-center text-center px-4 relative z-10">
      
      {/* Eyebrow Label */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0, duration: 0.5 }}
        className="mb-6 flex items-center gap-2 border border-[#7C3AED]/30 bg-[rgba(124,58,237,0.08)] px-3 py-1 rounded-full"
      >
        <span className="text-[#7C3AED] text-xs">◆</span>
        <span className="font-mono text-xs text-[#9D65FF] tracking-[0.15em] uppercase">
          Thought of the day
        </span>
      </motion.div>

      {/* Date */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8 font-mono text-sm text-[#A1A1AA]"
      >
        {new Date().toLocaleDateString('en-GB', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="font-mono text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.1] tracking-tight text-[#F4F4F5] max-w-4xl mx-auto text-balance"
      >
        What's the dev world{" "}
        <span 
          className="inline-block text-transparent bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(90deg, #F4F4F5 0%, #A78BFA 50%, #22D3EE 100%)' }}
        >
          thinking today?
        </span>
      </motion.h1>

      {/* Subline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="mt-8 font-ui text-base text-[#A1A1AA] max-w-[480px] mx-auto text-balance"
      >
        One developer claims the spotlight. One thought shapes the day.
      </motion.p>
    </section>
  );
}
