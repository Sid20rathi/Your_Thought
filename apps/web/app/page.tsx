import { ThoughtCard } from "@/components/thought/ThoughtCard";
import { DefaultThought } from "@/components/thought/DefaultThought";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { Portal } from "@/components/landing/Portal";
import { HeroContent } from "@/components/landing/HeroContent";
import { CharacterInfo } from "@/components/landing/CharacterInfo";

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
    <main className="flex flex-col items-center justify-start min-h-screen relative overflow-hidden bg-[#0D0D0D]">
      
      {/* --- HERO SECTION ONLY --- */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Image: High Resolution Portal */}
        <div className="absolute inset-0 z-0">
           <Image 
             src="/portal image.png" 
             alt="The Thinkr Portal"
             fill
             className="object-cover object-center grayscale-[0.2] contrast-[1.1]"
             priority
             quality={100}
           />
           {/* Realistic cinematic overlays */}
           <div className="absolute inset-0 bg-black/20" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
           <div className="absolute inset-0 radial-overlay" />
        </div>

        {/* Character Info (Aligned with the base of the arch) */}
        <div className="absolute left-[39.5%] bottom-[42%] z-30">
          <CharacterInfo 
            name={todayThought?.author_name || "Siddhant"} 
            socialId="@sid20rathi"
          />
        </div>

        {/* Hero Content & Portal - Precisely positioned for the Arch */}
        <div className="relative z-20 flex flex-col items-center w-full max-w-[1440px] mt-[-30vh]">
          
          <div className="mb-[10vh]">
            <HeroContent />
          </div>

          {/* Integrated Portal Content - Shifted up into the archway */}
          <div className="relative w-full max-w-xl px-4 flex justify-center mt-[-5vh]">
            <Portal>
              {todayThought ? (
                <ThoughtCard thought={todayThought} />
              ) : (
                <DefaultThought />
              )}
            </Portal>
          </div>
        </div>

      </section>
      
    </main>
  );
}
