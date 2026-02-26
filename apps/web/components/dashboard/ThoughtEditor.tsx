"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";

export function ThoughtEditor() {
  const { getToken } = useAuth();
  const [mode, setMode] = useState<"text" | "image">("text");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General Thought");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const charCount = content.length;
  const maxChars = 300;
  const isDanger = charCount >= 290;
  const isWarning = charCount >= 250;
  const isTooShort = mode === "text" && charCount < 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTooShort) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const url = new URL(`${apiUrl}/api/thought`);
      url.searchParams.append("content_type", mode);
      url.searchParams.append("content", content); // placeholder for image file logic if mode=image
      url.searchParams.append("category", category);

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to post thought");
      }
      
      // Success styling applied in UI, just reload page for now to see live
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[640px] mt-12 mx-auto"
    >
      <div className="flex items-center gap-4 mb-6">
        <span className="font-mono text-sm text-[#9D65FF]">✦ You have the floor. Make it count.</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>
      
      {/* Toggles Row: Mode & Category */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
        {/* Mode Toggles */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`px-4 py-2 font-mono text-sm rounded-full transition-colors ${
              mode === "text" 
                ? "bg-[rgba(124,58,237,0.08)] border border-[#7C3AED] text-[#9D65FF]" 
                : "bg-[#1A1A1A] border border-white/8 text-[#52525B] hover:text-[#A1A1AA]"
            }`}
          >
            ✎ Text
          </button>
          <button
            type="button"
            onClick={() => setMode("image")}
            className={`px-4 py-2 font-mono text-sm rounded-full transition-colors ${
              mode === "image" 
                ? "bg-[rgba(124,58,237,0.08)] border border-[#7C3AED] text-[#9D65FF]" 
                : "bg-[#1A1A1A] border border-white/8 text-[#52525B] hover:text-[#A1A1AA]"
            }`}
          >
            ⬡ Image
          </button>
        </div>

        {/* Category Scroller */}
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full hide-scrollbar snap-x">
          {["General Thought", "Latest Bug", "Achievement", "Just Learned", "Hot Take"].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`snap-start whitespace-nowrap px-3 py-1 text-[10px] md:text-sm font-mono uppercase tracking-widest rounded-full transition-all border
                ${category === cat 
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" 
                  : "border-white/5 bg-transparent text-[#71717A] hover:text-[#F4F4F5]"}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Input Area */}
        <AnimatePresence mode="wait">
          {mode === "text" ? (
            <motion.div 
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's your dev thought for today?"
                className="w-full h-40 p-5 bg-[#1A1A1A] border border-white/8 rounded-sm text-[#F4F4F5] font-mono text-lg resize-none focus:outline-none focus:border-[#7C3AED]/40 focus:ring-4 focus:ring-[#7C3AED]/10 transition-shadow transition-colors"
                maxLength={maxChars}
              />
              
              {/* Counter Tracker inside bottom right */}
              <div className="flex flex-col items-end gap-1 mt-2">
                 <motion.span 
                   animate={isDanger ? { x: [-2, 2, -2, 2, 0] } : {}}
                   transition={{ duration: 0.4 }}
                   className={`font-mono text-xs ${isDanger ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-[#52525B]'}`}
                 >
                   {charCount} / {maxChars}
                 </motion.span>
                 <div className="w-full max-w-[100px] h-[2px] bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${isDanger ? 'bg-red-400' : isWarning ? 'bg-yellow-400' : 'bg-[#52525B]'}`} 
                      style={{ width: `${(charCount/maxChars)*100}%` }}
                    />
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-48 border-2 border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center gap-3 bg-[#1A1A1A] hover:bg-[rgba(124,58,237,0.08)] hover:border-[#7C3AED]/50 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <div className="text-xl">⬆</div>
              <p className="font-ui text-[#F4F4F5] text-sm">Drop your meme here or click to browse</p>
              <p className="font-mono text-xs text-[#52525B]">PNG, JPG, GIF, WEBP · max 2MB</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={isSubmitting || (mode === "text" && isTooShort)}
          className={`group w-full py-3 rounded-sm font-mono text-sm transition-all duration-300 flex items-center justify-center gap-2
            ${isSubmitting 
              ? "bg-[#22C55E] text-white" 
              : "bg-[#7C3AED] hover:bg-[#9D65FF] text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:hover:shadow-none"
            }`}
        >
          {isSubmitting ? (
            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Posting...</>
          ) : (
             <>
               <span className="group-hover:translate-x-1 transition-transform">→</span> 
               Post Today's Thought
             </>
          )}
        </button>

        {error && <p className="text-red-400 text-xs font-mono text-center">{error}</p>}
      </form>
    </motion.div>
  );
}
