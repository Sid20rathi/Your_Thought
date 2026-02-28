"use client";

import { ThoughtCard } from "@/components/thought/ThoughtCard";
import { DefaultThought } from "@/components/thought/DefaultThought";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Portal } from "@/components/landing/Portal";
import { CharacterInfo } from "@/components/landing/CharacterInfo";
import { PremiumButton } from "@/components/landing/PremiumButton";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function Home() {
  const { isLoaded, user } = useUser();
  const userId = user?.id;
  const [todayThought, setTodayThought] = useState<any>(null);
  const [isPortalHovered, setIsPortalHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchThought = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      try {
        const res = await fetch(`${apiUrl}/api/thought/today`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.content) setTodayThought(data);
        }
      } catch (e) {
        console.error("Failed to fetch today's thought", e);
      }
    };
    fetchThought();
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) * 0.01;
      const moveY = (clientY - window.innerHeight / 2) * 0.01;
      
      gsap.to(bgRef.current, {
        x: moveX,
        y: moveY,
        duration: 2,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main ref={containerRef} className="flex flex-col items-center justify-start min-h-screen relative overflow-hidden bg-[#050505] selection:bg-sky-400/30">
      
      {/* Background Section with Parallax */}
      <div ref={bgRef} className="absolute inset-0 z-0 scale-105">
         <Image 
           src="/new bg.png" 
           alt="Thinkr World"
           fill
           className="object-cover object-center pointer-events-none transition-transform duration-1000"
           priority
           quality={100}
         />
         {/* Atmospheric layers */}
         <div className="absolute inset-0 bg-black/20" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
         
         {/* Particles Container */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {[...Array(20)].map((_, i) => (
             <div 
               key={i}
               className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px]"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
                 animation: `float ${5 + Math.random() * 10}s infinite linear`,
                 opacity: 0.1 + Math.random() * 0.5
               }}
             />
           ))}
         </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0); }
          100% { transform: translateY(-100vh) rotate(360deg); }
        }
      `}</style>
      
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        
      {/* Main Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-end pr-[10%] pt-20">
        <div className="w-full max-w-2xl flex flex-col items-center">
          
          {/* Portal Wrapper for precise anchoring */}
          <div className="relative w-full group">
            <Portal onHoverChange={setIsPortalHovered}>
              {todayThought ? (
                <div className="w-full text-center px-8">
                  <p className="text-2xl font-ui leading-relaxed text-white/90">
                    "{todayThought.content}"
                  </p>
                  {todayThought.imageUrl && (
                    <div className="mt-6 rounded-xl overflow-hidden border border-white/10">
                      <img src={todayThought.imageUrl} alt="Thought content" className="w-full h-auto" />
                    </div>
                  )}
                </div>
              ) : (
                <DefaultThought />
              )}
            </Portal>

            {/* Identity Node - Rightmost Bottom of the Portal Frame */}
            <div className="absolute bottom-6 right-12 z-40 transform-[rotate(-5deg)]">
              <CharacterInfo 
                name={todayThought?.author_name || todayThought?.author?.name || "Anonymous"} 
                socialId={todayThought?.author_social || (todayThought?.author?.id ? `@${todayThought.author.id.slice(0, 8)}` : "@thinker")} 
                isVisible={true}
              />
            </div>
          </div>

          {/* About Button - Corrected Tilt and Smaller */}
          <div className="mt-2 cursor-pointer transform-[rotate(3deg)_scale(0.65)] hover:transform-[rotate(3deg)_scale(0.75)] transition-all duration-700">
            <PremiumButton variant="outline">
              about project
            </PremiumButton>
          </div>
        </div>
      </div>
    </section>
      
    </main>
  );
}
