"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";

interface PortalProps {
  children: ReactNode;
  onHoverChange?: (isHovered: boolean) => void;
}

export function Portal({ children, onHoverChange }: PortalProps) {
  const portalRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!portalRef.current || !glowRef.current) return;

    // Breathing pulse effect
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(glowRef.current, {
      opacity: 0.6,
      scale: 1.05,
      duration: 2,
      ease: "sine.inOut"
    }).to(glowRef.current, {
      opacity: 0.3,
      scale: 1,
      duration: 2,
      ease: "sine.inOut"
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <motion.div
      ref={portalRef}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className="flex flex-col items-center gap-4 w-full max-w-2xl px-8 group perspective-[1000px]"
    >
      {/* Main Portal Container */}
      <div 
        className="relative w-full aspect-video p-8 flex items-center justify-center isolate transform-[rotateY(-15deg)] group-hover:transform-[rotateY(-11deg)] transition-transform duration-1000"
      >
        
        {/* Realistic Purple Glow Layer */}
        <div 
          ref={glowRef}
          className="absolute inset-0 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none opacity-40 scale-100"
        />

        {/* Outer Border with Deep Glassmorphism */}
        <div className="absolute inset-0 border border-white/10 rounded-[2.5rem] bg-black/40 backdrop-blur-xl shadow-[inset_0_0_60px_rgba(139,92,246,0.1)] transition-all duration-700 group-hover:border-purple-500/30 group-hover:bg-black/60" />
        
        {/* Inner Content Slot - Now Scrollable */}
        <div className="relative z-10 w-full h-full border border-white/5 rounded-2xl overflow-y-auto no-scrollbar bg-black/40 group-hover:border-purple-500/20 transition-all duration-700 p-2">
          <div className="min-h-full flex items-center justify-center">
            {children}
          </div>
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(139,92,246,0.06),rgba(0,0,0,0),rgba(139,92,246,0.06))] bg-size-[100%_2px,3px_100%] rounded-[2.5rem] overflow-hidden" />
      </div>
    </motion.div>
  );
}
