"use client";

import { motion } from "framer-motion";

const pastThoughts = [
  { text: "Tabs over spaces. Always.", author: "devuser1", date: "Jan 14" },
  { text: "Shipping > Perfection.", author: "shipooor", date: "Jan 13" },
  { text: "TypeScript is just spicy JavaScript.", author: "ts_fan", date: "Jan 12" },
  { text: "Production is down. Sending thoughts & prayers.", author: "oncall_dev", date: "Jan 11" },
  { text: "It works on my machine.", author: "local_host", date: "Jan 10" },
  { text: "Ctrl+C, Ctrl+V, commit.", author: "10x_dev", date: "Jan 09" },
];

export function ArchiveTicker() {
  return (
    <div className="w-full mt-12 mb-24 overflow-hidden py-4 border-y border-white/5 relative bg-[#050505]/50">
      
      {/* Edge Fades */}
      <div 
        className="absolute inset-0 pointer-events-none z-10" 
        style={{ background: 'linear-gradient(90deg, #050505 0%, transparent 10%, transparent 90%, #050505 100%)' }}
      />

      <motion.div 
        className="flex whitespace-nowrap gap-12 w-max"
        animate={{ x: [0, -1000] }} // Arbitrary pixel value to kick off loop, real infinite scroll usually involves duplicate arrays
        transition={{ repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" }}
        style={{ display: "flex", width: "max-content" }}
      >
        {/* Render array twice for infinite seamless scroll trick */}
        {[...pastThoughts, ...pastThoughts, ...pastThoughts].map((item, i) => (
          <div 
            key={i} 
            className="font-mono text-sm text-[#52525B] flex items-center gap-3 hover:text-[#F4F4F5] transition-colors hover:pause cursor-default"
          >
            <span>"{item.text}"</span>
            <span className="text-[#a1a1aa]">— @{item.author}</span>
            <span className="text-[#27272A] mx-2">·</span>
            <span className="text-[#27272A]">{item.date}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
