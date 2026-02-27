"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface CharacterInfoProps {
  name: string;
  socialId: string;
}

export function CharacterInfo({ name, socialId }: CharacterInfoProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      {/* Small Character Look */}
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.15 }}
        className="relative w-6 h-10 cursor-pointer group"
      >
        {/* Character Body */}
        <div className="absolute bottom-0 w-full h-8 bg-sky-400/30 backdrop-blur-md rounded-t-lg rounded-b-sm border border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.3)] group-hover:bg-sky-400/50 transition-all duration-300" />
        {/* Character Head */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-sky-200/50 backdrop-blur-md border border-sky-200/60 shadow-[0_0_10px_rgba(186,230,253,0.4)] group-hover:bg-sky-200 transition-all duration-300" />
        
        {/* Subtle ground shadow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/40 blur-sm rounded-full pointer-events-none" />
      </motion.div>

      {/* Info Card on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 40, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="absolute top-0 left-0 z-50 min-w-[200px]"
          >
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
              <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest mb-1">Published by</p>
              <h3 className="font-ui text-lg font-bold text-white mb-3">{name}</h3>
              
              <a 
                href={`https://social.thinkr.com/${socialId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs text-[#FF9D00] hover:text-[#FFC107] transition-colors group/link"
              >
                <span>{socialId}</span>
                <svg 
                  className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" 
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            {/* Visual connector */}
            <div className="absolute top-6 -left-2 w-4 h-4 bg-black/80 border-l border-b border-white/10 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
