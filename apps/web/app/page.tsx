import { ThoughtCard } from "@/components/thought/ThoughtCard";
import { DefaultThought } from "@/components/thought/DefaultThought";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ArchiveTicker } from "@/components/landing/ArchiveTicker";
import { ThoughtEditor } from "@/components/dashboard/ThoughtEditor";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Home() {
  const { userId } = await auth();

  // Fetch today's thought (mocked, eventually fetch from FastAPI)
  let todayThought = null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/api/thought/today`, { next: { revalidate: 0 } });
    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        todayThought = data;
      }
    }
  } catch (e) {
    console.error("Failed to fetch today's thought", e);
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-screen relative overflow-hidden">
      
      {/* --- HERO SECTION with 3D ART --- */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-32 px-4 overflow-hidden">
        
        {/* 3D Abstract Hero Image (Absolute background, soft masking) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-60 dark:opacity-40">
           <Image 
             src="/hero.png" 
             alt="Futuristic Developer Aura"
             className="object-cover w-full h-full max-w-[1400px] mask-radial mix-blend-screen dark:mix-blend-lighten"
             width={1400} 
             height={900}
             priority
           />
           {/* Darken edges to blend with background seamlessly */}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-void)]" />
           <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[var(--bg-void)]" />
        </div>

        {/* Hero Content (Z-10) */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="font-mono text-[10px] md:text-xs text-[#52525B] dark:text-[#A1A1AA] uppercase tracking-widest">
              Live Global Canvas
            </span>
          </div>

          <h1 className="text-4xl md:text-hero font-light tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-[#18181B] to-[#71717A] dark:from-white dark:to-white/60">
            Share your <br />
            <span className="font-mono text-[#7C3AED] dark:text-[#9D65FF] italic mr-2">latest</span> 
            obsession.
          </h1>

          <p className="font-ui text-base md:text-lg text-[#52525B] dark:text-[#A1A1AA] max-w-xl mx-auto leading-relaxed">
            One developer owns this space every 24 hours. A polished, distraction-free stage to share your latest bug, a major achievement, or a hot take with the world.
          </p>
        </div>

        {/* The Platinum Board (Today's Thought) - Glassmorphic floating over the 3D art */}
        <div className="relative z-20 w-full max-w-[640px] mt-16 px-4">
          <div className="absolute -inset-4 bg-white/10 dark:bg-[#7C3AED]/5 blur-2xl rounded-full opacity-50 pointer-events-none" />
          <div className="backdrop-blur-2xl bg-white/30 dark:bg-[#0D0D0D]/60 rounded-xl p-[1px] shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/10 dark:from-white/10 dark:to-transparent rounded-xl pointer-events-none" />
            {todayThought ? (
              <ThoughtCard thought={todayThought} />
            ) : (
              <DefaultThought />
            )}
          </div>
        </div>
      </section>

      {/* --- IN-PLACE EDITOR FOR LOGGED IN USERS --- */}
      {userId && (
        <section className="relative z-20 w-full max-w-3xl mx-auto px-4 py-24 border-t border-black/5 dark:border-white/5">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-light text-[#18181B] dark:text-white">Post your thought.</h2>
            <p className="font-mono text-xs text-[#71717A] uppercase tracking-widest mt-2">What did you build today?</p>
          </div>
          <ThoughtEditor />
        </section>
      )}

      {/* --- HOW IT WORKS / CAPABILITIES --- */}
      <HowItWorks />

      {/* --- ARCHIVER TICKER --- */}
      <ArchiveTicker />
      
    </main>
  );
}
