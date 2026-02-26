"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Helper to format remaining time
function useCountdown(targetDateStr: string | null) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!targetDateStr) return;
    
    // We assume the target is midnight UTC or local time
    // For simplicity, let's just make it midnight local time of tomorrow
    const t = new Date();
    t.setHours(24, 0, 0, 0);
    const targetTime = t.getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("00h 00m 00s");
        return;
      }

      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr]);

  return timeLeft;
}

export function StatusBannerAvailable({ onClaimClick }: { onClaimClick: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden border border-[#7C3AED]/25 bg-[rgba(124,58,237,0.08)] rounded-sm p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6"
    >
      {/* Animated border shimmer effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(124,58,237,0.4)_360deg)]" />
        <div className="absolute inset-[1px] bg-[rgba(10,10,10,0.95)] rounded-sm" />
      </div>

      <div className="relative z-10 flex gap-4">
        <span className="text-[#9D65FF] text-xl">✦</span>
        <div>
          <h3 className="font-mono text-base text-[#F4F4F5] mb-1">Today's spotlight is unclaimed.</h3>
          <p className="font-ui text-sm text-[#A1A1AA]">Be the first to post. The day is yours.</p>
        </div>
      </div>

      <button 
        onClick={onClaimClick}
        className="relative z-10 group bg-[#7C3AED] hover:bg-[#9D65FF] text-white px-5 py-2.5 rounded-sm font-mono text-sm transition-all whitespace-nowrap flex items-center gap-2"
      >
        Claim Today's Thought
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </button>
    </motion.div>
  );
}

export function StatusBannerClaimed({ thoughtObj }: { thoughtObj: any }) {
  const timeLeft = useCountdown(new Date().toISOString());

  return (
    <motion.div 
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="border border-white/8 bg-white/[0.02] rounded-sm p-6 mb-8 flex gap-4 items-start"
    >
      <span className="text-[#52525B] text-xl font-mono">✗</span>
      <div>
        <h3 className="font-mono text-base text-[#F4F4F5] mb-2">
          Today's thought has been claimed by <span className="text-[#A1A1AA]">@{thoughtObj.author_name || 'devuser'}</span>
        </h3>
        <p className="font-ui text-sm text-[#A1A1AA]">
          Come back tomorrow. The spotlight resets in <span className="font-mono text-amber-400 tabular-nums">{timeLeft}</span>.
        </p>
      </div>
    </motion.div>
  );
}

export function StatusBannerYours({ thoughtObj }: { thoughtObj: any }) {
  const timeLeft = useCountdown(new Date().toISOString());

  return (
    <motion.div 
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="border border-green-500/20 bg-green-500/[0.04] rounded-sm p-6 mb-8 flex gap-4 items-start"
    >
      <span className="text-green-500 text-xl font-mono leading-none mt-0.5">✔</span>
      <div>
        <h3 className="font-mono text-base text-[#F4F4F5] mb-2">You own today. Your thought is live.</h3>
        
        {/* Thought mini preview */}
        <div className="bg-[#050505] border border-white/5 rounded-sm p-3 my-4 max-w-lg">
          {thoughtObj.content_type === 'image' ? (
             <span className="font-mono text-sm text-[#52525B] italic">[Image Posted]</span>
          ) : (
             <p className="font-mono text-sm text-[#A1A1AA] line-clamp-2">"{thoughtObj.content}"</p>
          )}
        </div>

        <p className="font-ui text-sm text-[#52525B]">
          It expires in <span className="font-mono text-green-400 tabular-nums">{timeLeft}</span>.
        </p>
      </div>
    </motion.div>
  );
}
