"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface CharacterInfoProps {
  name: string;
  socialId: string;
  isVisible?: boolean;
}

export function CharacterInfo({ name, socialId, isVisible = false }: CharacterInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative pointer-events-auto">
      {/* Sleek User Node Icon */}
      <motion.div
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.8 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8 h-8 cursor-pointer flex items-center justify-center group"
      >
        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md group-hover:bg-purple-500/40 transition-colors" />
        <div className="relative w-full h-full border-2 border-white/20 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-xl group-hover:border-purple-400/50 transition-all">
          <svg className="w-4 h-4 text-white/60 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </motion.div>

      {/* Info Card - Controlled by Click */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: -10, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 10, scale: 0.9, filter: "blur(10px)" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 z-50 min-w-[180px] mb-4"
          >
            <div className="bg-black/80 backdrop-blur-3xl border border-white/10 p-4 rounded-xl shadow-2xl overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-purple-500 to-transparent opacity-50" />
               
               <p className="font-mono text-[9px] text-purple-400 uppercase tracking-widest mb-3 text-center">Identity Node</p>
               
               <a 
                 href={`#`}
                 className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 font-mono text-[10px] text-white/50 hover:text-white hover:bg-white/10 transition-all group/link"
               >
                 <span>{socialId}</span>
                 <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                   <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                 </svg>
               </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
