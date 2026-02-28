"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import gsap from "gsap";

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}

export function PremiumButton({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary" 
}: PremiumButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic effect using Framer Motion (fast)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    // Calculate center relative position
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    // Magnetic strength (scaled by 0.3)
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const baseStyles = "relative px-8 py-3 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] transition-all duration-500 isolate overflow-hidden font-bold";
  
  const variants = {
    primary: "bg-white cursor-pointer text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]",
    secondary: "bg-white/5 cursor-pointer backdrop-blur-md text-white border border-white/20 hover:bg-white/10 hover:border-white/40",
    outline: "border border-white/20 text-white/50 hover:text-white hover:border-white/60 bg-white/5 cursor-pointer backdrop-blur-xl"
  };

  return (
    <motion.button
      ref={buttonRef}
      style={{
        x: springX,
        y: springY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {/* Background Glow/Liquid Effect */}
      <motion.div
        initial={false}
        animate={isHovered ? { scale: 1.5, opacity: 1 } : { scale: 0, opacity: 0 }}
        className="absolute -z-10 bg-white/20 rounded-full blur-xl w-full h-full left-0 top-0 pointer-events-none"
      />

      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
