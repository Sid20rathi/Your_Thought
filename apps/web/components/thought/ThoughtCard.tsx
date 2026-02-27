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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="w-full flex justify-center"
    >
      <div className="relative max-w-[400px] flex flex-col items-center justify-center text-center">
        {isImage ? (
          <img 
            src={thought.content} 
            alt="Dev Thought" 
            className="max-h-[250px] w-auto max-w-full object-contain rounded-lg shadow-2xl"
          />
        ) : (
          <h2 className="text-white font-ui font-light text-2xl md:text-3xl leading-[1.4] tracking-tight">
            {thought.content}
          </h2>
        )}
        
        {thought.category && (
          <div className="mt-8 font-mono text-[9px] text-white/20 uppercase tracking-[0.6em]">
            {thought.category}
          </div>
        )}
      </div>
    </motion.div>
  );
}
