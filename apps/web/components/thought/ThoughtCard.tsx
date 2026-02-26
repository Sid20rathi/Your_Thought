"use client";

import { motion } from "framer-motion";

interface ThoughtCardProps {
  thought: {
    id: string;
    content_type: "text" | "image";
    content: string;
    post_date: string;
    author_name?: string;
    category?: string;
  };
}

export function ThoughtCard({ thought }: ThoughtCardProps) {
  const isImage = thought.content_type === "image" || thought.content.startsWith("http");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="thought-card w-full max-w-[720px] mx-auto z-20 mt-16"
    >
      {/* Corner Ornaments */}
      <div className="absolute top-4 left-4 text-[#7C3AED]/20 font-mono text-xs">+</div>
      <div className="absolute bottom-4 right-4 text-[#7C3AED]/20 font-mono text-xs">+</div>

      <div className="relative min-h-[240px] flex flex-col items-center justify-center">
        {/* Quote Mark Decoration */}
        {!isImage && (
          <span className="absolute -top-12 -left-8 text-[6rem] text-[#7C3AED]/30 font-serif leading-none select-none pointer-events-none">
            "
          </span>
        )}

        {isImage ? (
          <div className="relative w-full flex justify-center">
             <img 
               src={thought.content} 
               alt="Dev Thought" 
               className="max-h-[420px] w-auto max-w-full object-contain rounded-sm border-[2px] border-[rgba(124,58,237,0.2)]"
               style={{ filter: "drop-shadow(0 0 10px rgba(124,58,237,0.15))" }}
             />
          </div>
        ) : (
          <h2 className="relative z-10 text-[#F4F4F5] font-mono font-normal text-[clamp(1.4rem,3vw,2rem)] leading-[1.6] tracking-tight text-center max-w-prose text-balance">
            {thought.content}
          </h2>
        )}
      </div>
      
      {/* Footer Row */}
      <div className="mt-12 flex justify-between items-center border-t border-white/5 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[rgba(124,58,237,0.3)] bg-[#141414] overflow-hidden flex items-center justify-center">
            {/* Fallback avatar */}
            <span className="font-mono text-xs text-[#9D65FF]">
              {(thought.author_name || "D").charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm text-[#F4F4F5]">
              {thought.author_name || "Anonymous"}
            </span>
            {thought.category && (
              <span className="font-mono text-[10px] text-[#7C3AED] uppercase tracking-widest mt-0.5">
                ✦ {thought.category}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <span className="font-mono text-xs text-[#27272A] block uppercase tracking-wider">
            {new Date(thought.post_date).toLocaleDateString()}
          </span>
          {!isImage && (
             <span className="font-mono text-[10px] text-[#27272A] block mt-1 uppercase">
               {thought.content.length} / 300
             </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
